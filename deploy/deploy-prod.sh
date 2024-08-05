#!/bin/bash
# 스크립트의 실제 위치를 기준으로 경로 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR=$(cd "$SCRIPT_DIR/.."; pwd)
PEM_PATH="$SCRIPT_DIR/../../../keys/blccu-prod.pem"

# PEM 파일 경로가 올바른지 확인
if [[ ! -f "$PEM_PATH" ]]; then
  echo "PEM 파일이 존재하지 않습니다: $PEM_PATH"
  exit 1
fi

# PEM 파일 권한 확인 및 수정
chmod 400 "$PEM_PATH"

HOSTS=("13.209.215.21")
ACCOUNT=ubuntu
SERVICE_NAME=blccu
DOCKER_TAG=latest
ECR_URL="792939917746.dkr.ecr.ap-northeast-2.amazonaws.com"
AWS_PROFILE=production  # 배포 프로파일 사용
ENV_FILE="$ROOT_DIR/.env.prod"

NGINX_CONFIG=/etc/nginx/nginx.conf
BLUE_PORT="3000"
GREEN_PORT="3001"

# docker push (aws ecr)
echo -e "\n## Docker build & push ##\n"

npm run build
aws ecr get-login-password --region ap-northeast-2 --profile $AWS_PROFILE | docker login --username AWS --password-stdin $ECR_URL
docker buildx build --platform linux/amd64 -t $SERVICE_NAME . --load
docker tag $SERVICE_NAME:$DOCKER_TAG $ECR_URL/$SERVICE_NAME:$DOCKER_TAG
docker push $ECR_URL/$SERVICE_NAME:$DOCKER_TAG

for HOST in "${HOSTS[@]}"; do
  SERVER=$ACCOUNT@$HOST

  # .env.prod 파일 전송
  echo -e "\n## .env.prod 파일 전송 to $HOST ##\n"
  ssh -i $PEM_PATH $SERVER "mkdir -p /home/ubuntu/upload"
  ssh -i $PEM_PATH $SERVER "chmod 700 /home/ubuntu/upload"
  scp -i "$PEM_PATH" "$ENV_FILE" $SERVER:/home/$ACCOUNT/upload/.env.prod

  # 현재 설정에서 활성 포트 찾기
  CURRENT_PORT=$(ssh -i "$PEM_PATH" -o StrictHostKeyChecking=no $SERVER "grep 'server localhost:' $NGINX_CONFIG | awk '{print \$2}' | cut -d ':' -f 2 | sed 's/;//'")
  echo -e "\nOld = $CURRENT_PORT on $HOST\n"

  # 포트 변경
  if [ "$CURRENT_PORT" = "$BLUE_PORT" ]; then
      NEW_PORT=$GREEN_PORT
  elif [ "$CURRENT_PORT" = "$GREEN_PORT" ]; then
      NEW_PORT=$BLUE_PORT
  else
      echo -e "\n 서버의 blue green 포트 확인 실패 on $HOST \n" 
      exit 1
  fi

  echo -e "\nNew = $NEW_PORT on $HOST\n"

  NEW_SERVICE_NAME=$SERVICE_NAME-$NEW_PORT
  OLD_SERVICE_NAME=$SERVICE_NAME-$CURRENT_PORT

  # docker pull & run
  echo -e "\n## new docker pull & run on $HOST ##\n"
  ssh -i $PEM_PATH $SERVER "aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin $ECR_URL"
  ssh -i $PEM_PATH $SERVER "docker pull $ECR_URL/$SERVICE_NAME:$DOCKER_TAG"
  ssh -i $PEM_PATH $SERVER "docker run --env-file /home/$ACCOUNT/upload/.env.prod -d -p $NEW_PORT:3000 --name $NEW_SERVICE_NAME -e TZ=Asia/Seoul --network blccu_network $ECR_URL/$SERVICE_NAME"

  # 헬스체크 수행
  echo -e "\n## 헬스체크 수행 on $HOST ##\n"
  for i in {1..20}; do
      HEALTH_CHECK=$(ssh -i $PEM_PATH $SERVER "curl -s -o /dev/null -w '%{http_code}' http://localhost:$NEW_PORT/health")
      echo "http://localhost:$NEW_PORT/health"
      echo "HTTP Status Code: $HEALTH_CHECK"
      if [ "$HEALTH_CHECK" -eq 200 ]; then
          echo -e "\n 헬스체크 성공 on $HOST \n"
          break
      fi
      echo -e "\n 헬스체크 시도 $i/20 실패. 5초 후 재시도 on $HOST... \n"
      sleep 5
  done

  if [ "$HEALTH_CHECK" -ne 200 ]; then
      echo -e "\n 헬스체크 실패. 배포 중단 on $HOST \n"
      ssh -i $PEM_PATH $SERVER "docker stop $NEW_SERVICE_NAME && docker rm $NEW_SERVICE_NAME"
      exit 1
  fi

  # NGINX 설정 파일 수정
  echo -e "\n## Nginx 설정 수정 & restart on $HOST ##\n"
  ssh -i $PEM_PATH $SERVER "sudo sed -i 's/server localhost:$CURRENT_PORT;/server localhost:$NEW_PORT;/g' $NGINX_CONFIG"
  ssh -i $PEM_PATH $SERVER "sudo systemctl restart nginx"

  # old docker 제거
  echo -e "\n## old docker 제거 on $HOST ##\n"
  ssh -i $PEM_PATH $SERVER "sudo docker stop $OLD_SERVICE_NAME"
  ssh -i $PEM_PATH $SERVER "sudo docker rm $OLD_SERVICE_NAME"
  echo -e "$ECR_URL/$SERVICE_NAME:$DOCKER_TAG"
  ssh -i $PEM_PATH $SERVER "docker images --format \"{{.ID}} {{.Repository}}:{{.Tag}}\" | grep -v ':latest' | awk '{print \$1}' | xargs -r docker rmi"
  ssh -i $PEM_PATH $SERVER "y | sudo docker system prune -a"

  echo -e "\n## 배포 완료 on $HOST. $NEW_SERVICE_NAME ##\n"
done
