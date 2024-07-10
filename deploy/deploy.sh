#!/bin/bash
# 스크립트의 실제 위치를 기준으로 경로 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PEM_PATH="$SCRIPT_DIR/../../../keys/blccu-dev-rsa.pem"

# PEM 파일 경로가 올바른지 확인
if [[ ! -f "$PEM_PATH" ]]; then
  echo "PEM 파일이 존재하지 않습니다: $PEM_PATH"
  exit 1
fi

# PEM 파일 권한 확인 및 수정
chmod 400 "$PEM_PATH"

HOST="api.blccu.com"
ACCOUNT=ubuntu
SERVICE_NAME=blccu-ecr
DOCKER_TAG=latest
ECR_URL="637423583546.dkr.ecr.ap-northeast-2.amazonaws.com"
SERVER=$ACCOUNT@$HOST

NGINX_CONFIG=/etc/nginx/nginx.conf
BLUE_PORT="3000"
GREEN_PORT="3001"

# docker push (aws ecr)
echo -e "\n## Docker build & push ##\n"


npm run build
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 637423583546.dkr.ecr.ap-northeast-2.amazonaws.com
docker buildx build --platform linux/amd64 -t $SERVICE_NAME . --load
docker tag $SERVICE_NAME:$DOCKER_TAG $ECR_URL/$SERVICE_NAME:$DOCKER_TAG
docker push $ECR_URL/$SERVICE_NAME:$DOCKER_TAG

# 현재 설정에서 활성 포트 찾기
CURRENT_PORT=$(ssh -i "$PEM_PATH" -o StrictHostKeyChecking=no $SERVER "grep 'server localhost:' $NGINX_CONFIG | awk '{print \$2}' | cut -d ':' -f 2 | sed 's/;//'")
echo -e "\nOld = $CURRENT_PORT\n"

# 포트 변경
if [ "$CURRENT_PORT" = "$BLUE_PORT" ]; then
    NEW_PORT=$GREEN_PORT
elif [ "$CURRENT_PORT" = "$GREEN_PORT" ]; then
    NEW_PORT=$BLUE_PORT
else
    echo -e "\n 서버의 blue green 포트 확인 실패 \n" 
    exit 1;
fi

echo -e "\nNew $NEW_PORT\n"

NEW_SERVICE_NAME=$SERVICE_NAME-$NEW_PORT
OLD_SERVICE_NAME=$SERVICE_NAME-$CURRENT_PORT

# docker pull & run
echo -e "\n## new docker pull & run ##\n"
ssh -i $PEM_PATH $SERVER "aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 637423583546.dkr.ecr.ap-northeast-2.amazonaws.com"
ssh -i $PEM_PATH $SERVER "docker pull $ECR_URL/$SERVICE_NAME:$DOCKER_TAG"
ssh -i $PEM_PATH $SERVER "docker run  --env-file .env.staging -d --memory="512m" --cpus="0.5" -p $NEW_PORT:3000 --name $NEW_SERVICE_NAME -e TZ=Asia/Seoul $ECR_URL/$SERVICE_NAME"
# memory랑 cpu 사용량 조절

# 헬스체크 수행
echo -e "\n## 헬스체크 수행 ##\n"
for i in {1..20}; do
    HEALTH_CHECK=$(ssh -i $PEM_PATH $SERVER "curl -s -o /dev/null -w '%{http_code}' http://localhost:$NEW_PORT/health")
    if [ "$HEALTH_CHECK" -eq 200 ]; then
        echo -e "\n 헬스체크 성공 \n"
        break
    fi
    echo -e "\n 헬스체크 시도 $i/20 실패. 5초 후 재시도... \n"
    sleep 5
done

if [ "$HEALTH_CHECK" -ne 200 ]; then
    echo -e "\n 헬스체크 실패. 배포 중단 \n"
    ssh -i $PEM_PATH $SERVER "docker stop $NEW_SERVICE_NAME && docker rm $NEW_SERVICE_NAME"
    exit 1
fi

# NGINX 설정 파일 수정
echo -e "\n## Nginx 설정 수정 & restart ##\n"
ssh -i $PEM_PATH $SERVER "sudo sed -i 's/server localhost:$CURRENT_PORT;/server localhost:$NEW_PORT;/g' $NGINX_CONFIG"
ssh -i $PEM_PATH $SERVER "sudo systemctl restart nginx"

# old docker 제거
echo -e "\n## old docker 제거 ##\n"
ssh -i $PEM_PATH $SERVER "sudo docker stop $OLD_SERVICE_NAME"
ssh -i $PEM_PATH $SERVER "sudo docker rm $OLD_SERVICE_NAME"
echo -e "$ECR_URL/$SERVICE_NAME:$DOCKER_TAG"
ssh -i $PEM_PATH $SERVER "docker images --format "{{.ID}} {{.Repository}}:{{.Tag}}" | grep -v ':latest' | awk '{print $1}' | xargs -r docker rmi"
ssh -i $PEM_PATH $SERVER "y | sudo docker system prune -a"

echo -e "\n## 배포 완료. $NEW_SERVICE_NAME ##\n"