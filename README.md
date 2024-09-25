<div align="center">
  <img src="src/assets/readme/logo.png" width="100" height="100" />
  <h1>블꾸</h1>
  <p>커스텀 극대화 블로그<p>
  <a href="https://blccu.com">blccu.com</a>
</div>

## Tech Stack

- Nest.js
- mysql/typeORM

## ERD

```mermaid
erDiagram
    notification {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        string type
        bool is_checked
        int article_id FK
        int user_id FK
        int target_user_id FK
    }
    follow {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        int to_user_id FK
        int from_user_id FK
    }
    agreement {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        string agreement_type
        bool is_agreed
        int user_id FK
    }
    feedback {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        string content
        string type
        int user_id FK
    }
    article {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        int article_category_id FK
        int article_background_id FK
        string html_title
        bool is_published
        int like_count
        int view_count
        int comment_count
        int report_count
        bool allow_comment
        string scope
        string content
        string main_description
        string image_url
        string main_image_url
        int user_id FK
    }
    article_category {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        string name
        int user_id FK
    }
    article_background {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        string image_url
    }
    user {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        string handle
        string current_refresh_token
        bool is_admin
        int following_count
        int follower_count
        string username
        string description
        string profile_image
        string background_image
    }
    comment {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        int article_id FK
        int content
        int report_count
        int parent_id
        int user_id FK
    }
    report {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        string content
        string type
        string target
        int article_id FK
        int comment_id FK
        int user_id FK
        int target_user_id FK
    }
    like {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        int article_id FK
        int user_id FK
    }
    sticker_block {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        int sticker_id FK
        int article_id FK
        float scale
        float angle
        float pos_x
        float pos_y
        float z_index
        int client_id
    }
    sticker {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        string image_url
        bool is_default
        bool is_reusable
        int user_id FK
    }
    sticker_category {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        string name
    }
    sticker_category_mapper {
        int sticker_id FK
        int sticker_category_id FK
        datetime date_created
        datetime date_updated
        datetime date_deleted
    }
    announcement {
        int id PK
        datetime date_created
        datetime date_updated
        datetime date_deleted
        string title
        string content
    }

    notification ||--o{ article : relates
    notification ||--o{ user : notifies
    notification ||--o{ user : targets
    follow ||--o{ user : follows
    follow ||--o{ user : followed_by
    agreement ||--o{ user : belongs_to
    feedback ||--o{ user : given_by
    article ||--o{ article_category : belongs_to
    article ||--o{ article_background : has_background
    article ||--o{ user : written_by
    comment ||--o{ article : related_to
    comment ||--o{ user : authored_by
    report ||--o{ article : reports
    report ||--o{ comment : reports
    report ||--o{ user : filed_by
    report ||--o{ user : targets
    like ||--o{ article : liked
    like ||--o{ user : liked_by
    sticker_block ||--o{ sticker : contains
    sticker_block ||--o{ article : placed_on
    sticker ||--o{ user : owned_by
    sticker_category_mapper ||--o{ sticker : maps_to
    sticker_category_mapper ||--o{ sticker_category : categorized_as
```

## 네이밍 룰의 우선사항

**엔티티 중심의 클래스 작명**: {Entity}{Action}{Purpose}{Layer}

`UserCreateResponseDto, ArticlesCreateService`

**Layer 중심의 인스턴스 작명**: {Layer}\_{Entity}{Action}{Purpose}

`svc_usersCreate, dto_userCreateResponse`

**선택적 도메인과 접두사 활용해 지역변수 및 필드 작명**: ({prefix})({Domain}){Name}

`isPubluished, userId, articleId`

## DTO 네이밍 룰

**Common DTO**: 모든 계층에서 공통으로 사용할 수 있는 기본 DTO.

`{Entity}Dto`

**Request DTO**: 클라이언트 -> 컨트롤러 간의 데이터 전송.

`{Entity}{Action}RequestDto`

**Response DTO**: 컨트롤러 -> 클라이언트 간의 데이터 전송. 혹은 공통된 response일 때 사용.

`{Entity}{Action}ResponseDto`

**Service Output DTO**: 서비스 -> 컨트롤러 간의 별도의 데이터 전송.

`{Entity}{Action}SvcOutputDto`

**Repository Output DTO**: 레포지토리 -> 서비스 간의 별도의 데이터 전송.

`{Entity}{Action}RepoOutputDto`

**Service Interface**: 컨트롤러 -> 서비스 간의 데이터 전송.

`I{Entity}{Layer}{Action}`

**Repository Interface**: 서비스 -> 레포지토리 간의 데이터 전송.

`I{Entity}{Layer}{Action}`

## 메서드 네이밍 룰

- **컨트롤러 메서드**: HTTP 요청 중점 네이밍
  - 생성: `create{Entity}`
  - 조회: `get{Entity}`, `get{Entities}`
  - 업데이트: `patch{Entity}`, `put{Entity}`
  - 삭제: `delete{Entity}`
- **서비스 메서드**: Entity 명시
  - 생성: `create{Entity}`
  - 조회: `find{Entities}`, `find{Entity}By{Criteria}`
  - 복합 조회: `read{Object}`
  - 업데이트: `update{Entity}`
  - 삭제: `delete{Entity}`
- **레포지토리 메서드**: Entity 생략
  - 생성: `save`, `create`
  - 조회: `findById`, `findAll`, `findBy{Criteria}`
  - 업데이트: `update`
  - 삭제: `delete`

## 테스트 코드 네이밍 룰

### jest 코드

```typescript
describe('{layer}', () => {
  describe('{method}', async () => {
    it('should {result}{condition}', () => {});
  });
});
```

### 예시

```typescript
AgreementsService
    createAgreement
      ✓ should return AgreementDto with valid input (6 ms)
    existCheck
      ✓ should throw exception when agreement does not exist (5 ms)
      ✓ should return AgreementDto when agreement exists (2 ms)
```

## 접두사 정리

### 엔티티 (Entity)

- **접두사:** `ent_`
- **예시:** `ent_agreement`

### 모듈 (Module)

- **접두사:** `mod_`
- **예시:** `mod_`

### 서비스 (Service)

- **접두사:** `svc_`
- **예시:** `svc_agreements`

### 레포지토리 (Repository)

- **접두사:** `repo_`
- **예시:** `repo_agreements`

### 컨트롤러 (Controller)

- **접두사:** `ctrl_`
- **예시:** `ctrl_user`

### DTO (Data Transfer Object)

- **접두사:** `dto_`
- **예시:** `dto_agreement`

### DB 관련 변수 (db connection pool 등)

- **접두사:** `db_`
- **예시:** `db_redisQueue`, `db_dataSource`

## 커밋 메세지과 머지 룰

### 커밋 컨벤션

#### 커밋 메시지 양식

- 커밋 메시지는 다음 형식을 따릅니다:
  ```
  type(scope): subject
  ```
- 예시:
  ```
  refactor(user): change variables name
  ```

#### 커밋 메시지 구성 요소

- **type**: 커밋의 종류를 나타냅니다.
  - `feat`: 새로운 기능 추가
  - `fix`: 버그 수정
  - `docs`: 문서 변경
  - `style`: 코드 포맷팅, 세미콜론 누락 등 (비즈니스 로직에 변화가 없는 경우)
  - `refactor`: 코드 리팩토링 (기능 변화 없음)
  - `perf`: 성능 개선
  - `test`: 테스트 추가 또는 수정
  - `chore`: 빌드 과정 또는 보조 도구 수정 (라이브러리, 환경 설정 파일 등)
- **scope**: 커밋 범위를 나타냅니다.
- **subject**: 변경 사항에 대한 간결한 설명 (필수).

#### 본문 내용 (선택 사항)

- 필요한 경우, 본문에 추가 설명을 작성할 수 있습니다.
- 왜 이 변경을 했는지, 무엇을 변경했는지에 대한 배경 정보를 포함할 수 있습니다.

### 머지 룰

#### 브랜치 구조

- `develop`: 개발 중인 브랜치
- `staging`: 테스트 및 검증을 위한 브랜치
- `master`: 프로덕션 배포를 위한 브랜치
- `{type}/{subject}`: 세부 기능 개발을 위한 브랜치

#### 머지 절차

1. **개발 작업**

   - 새로운 기능 또는 버그 수정은 개별 기능 브랜치에서 작업합니다.
   - 작업이 완료되면 `develop` 브랜치에 pr을 올립니다.

2. **검토 및 테스트**

   - 모든 변경 사항은 `develop` 브랜치에서 충분히 검토하고 테스트합니다.
   - 변경 사항이 검토되고 테스트가 완료되면 `develop` 브랜치를 `staging` 브랜치로 머지합니다.

3. **스테이징 환경에서 검증**

   - `staging` 브랜치에서 애플리케이션이 정상적으로 작동하는지 확인합니다.
   - 테스트가 완료되고 모든 기능이 정상 작동하면 `staging` 브랜치를 `master` 브랜치로 머지합니다.

     https://staging.api.blccu.com

4. **프로덕션 배포**

   - `master` 브랜치에 머지된 변경 사항은 프로덕션 환경에 배포됩니다.

     https://api.blccu.com
