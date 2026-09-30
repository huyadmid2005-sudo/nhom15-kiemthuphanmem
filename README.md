# HSM - Healthcare Management System

HSM là hệ thống quản lý chăm sóc sức khỏe theo kiến trúc microservices. Dự án bao gồm frontend React/Vite, API Gateway, các service Spring Boot, MySQL, Redis, Eureka, Config Server, Zipkin và một seeder riêng để tạo dữ liệu test/demo.

Tài liệu này được viết theo source hiện tại trong repo. Repo hiện tại tập trung vào hệ thống HSM microservices; các phần không còn xuất hiện trong source sẽ không được đưa vào hướng dẫn chạy.

## Chức năng chính

- Đăng ký, đăng nhập, phân quyền theo role, JWT và khôi phục mật khẩu.
- Quản lý bệnh nhân, hồ sơ bệnh nhân, duyệt bệnh nhân và chỉ số sức khỏe.
- Quản lý bác sĩ, phòng khám, chuyên khoa, lịch hẹn và phê duyệt bác sĩ.
- Cổng cộng đồng với bài viết, bình luận, article, like, bookmark và upload qua Cloudinary.
- Quản lý kho dược phẩm gồm thuốc và thiết bị y tế.
- CDSS tạo khuyến nghị sức khỏe dựa trên health records và OpenAI.
- Notification service cho email, SMS và tùy chọn thông báo.
- Analytic research service để duyệt và xuất dữ liệu nghiên cứu ra CSV.
- Frontend React/Vite được build và serve bằng Nginx trong Docker.
- Seeder riêng để tạo account test, bệnh nhân, bác sĩ, phòng và health records mẫu.

## Kiến trúc tổng quan

```text
Browser
  |
  | 5173
  v
hsm-client (React/Vite, Nginx)
  |
  | HTTP
  v
api-gateway (Spring Cloud Gateway, 8090)
  |
  +-- security-service (8091)
  +-- patient-service (8092)
  +-- doctor-service (8093)
  +-- community-portal-service (8094)
  +-- cdss-service (8095)
  +-- pharmaceutical-inventory-service (8096)
  +-- notification-service (8097)
  +-- analytic-research-service (8098)

Dịch vụ hạ tầng:
  - eureka-service-discovery (8761)
  - config-server (8888)
  - mysql (3306)
  - redis
  - zipkin (9411)
```


<img width="2250" height="1809" alt="HSM global architecture diagram" src="https://github.com/user-attachments/assets/7ed0c27a-ee29-4146-8692-f142db0db937" />

## Công nghệ sử dụng

- Backend: Java 17, Spring Boot 3.1.5, Spring Cloud 2022.0.4.
- Gateway và service discovery: Spring Cloud Gateway, Eureka.
- Config: Spring Cloud Config Server, `config-repo`.
- Database: MySQL, Spring Data JPA, Hibernate.
- Auth: Spring Security, JWT.
- Service-to-service: OpenFeign.
- Cache và recovery token: Redis.
- Tracing: Micrometer Tracing, Zipkin.
- Frontend: React 18, Vite 7, Nginx, MUI, Tailwind, Axios.
- Seeder: Python 3.12 container, dùng standard library.
- Orchestration: Docker Compose.

## Cấu trúc thư mục

```text
.
|-- analytic-research-service/         # Quy trình researcher và xuất CSV
|-- api-gateway/                       # Route vào các backend service
|-- cdss-service/                      # Clinical decision support
|-- community-portal-service/          # Community, post, comment, article, upload
|-- config-repo/                       # Config được mount vào config-server
|-- config-server/                     # Spring Cloud Config Server
|-- doctor-service/                    # Bác sĩ, phòng, lịch hẹn
|-- eureka-service-discovery/          # Eureka registry
|-- hsm-client/                        # Frontend React/Vite
|-- init-scripts/                      # SQL init, hiện có schema Zipkin
|-- notification-service/              # Email, SMS, notification preferences
|-- patient-service/                   # Bệnh nhân và health records
|-- pharmaceutical-inventory-service/  # Thuốc và thiết bị y tế
|-- security-service/                  # User, auth, JWT, recovery
|-- test-data-seeder/                  # Seeder dữ liệu test/demo
|-- docker-compose.yml
|-- .env.example
`-- user_health_data-research.csv       # CSV mẫu/được export bởi research flow
```

## Yêu cầu trước khi chạy

- Docker Desktop hoặc Docker Engine có Docker Compose.
- Java 17 nếu muốn chạy backend service ngoài Docker.
- Node.js 18+ nếu muốn chạy `hsm-client` ngoài Docker.

## Cấu hình môi trường

Tạo file `.env` ở thư mục gốc từ `.env.example`.

PowerShell:

```powershell
Copy-Item .env.example .env
```

Bash:

```bash
cp .env.example .env
```

Các biến nên kiểm tra trước khi chạy:

- `JWT_TOKEN_SECRET`
- `MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD`, `MYSQL_ACCOUNT`
- `OPENAI_API_KEY`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `SENDGRID_API_KEY`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `VITE_ZEGO_APP_ID`, `VITE_ZEGO_SERVER_SECRET`

Lưu ý: các biến bắt đầu bằng `VITE_*` sẽ được đóng vào frontend bundle. `VITE_ZEGO_SERVER_SECRET` chỉ phù hợp cho local/demo. Khi chạy production, nên tạo Zego token ở backend thay vì đưa server secret xuống browser.

## Chạy dự án bằng Docker Compose

Build và chạy toàn bộ stack:

```bash
docker compose up --build
```

Chạy nền:

```bash
docker compose up -d --build
```

Kiểm tra container:

```bash
docker compose ps
```

Xem log:

```bash
docker compose logs -f
```

Dừng stack:

```bash
docker compose down
```

Dừng stack và xóa volume database/cache local:

```bash
docker compose down -v
```

## URL sau khi chạy

| Thành phần | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| API Gateway | `http://localhost:8090` |
| Eureka Dashboard | `http://localhost:8761` |
| Config Server | `http://localhost:8888` |
| Zipkin | `http://localhost:9411` |
| MySQL | `localhost:3306` |

Frontend gọi backend qua `api-gateway` ở port `8090`.

## Tạo dữ liệu test

Sau khi stack đã chạy ổn, chạy seeder:

```bash
docker compose --profile seed run --rm test-data-seeder
```

Seeder nằm sau Docker Compose profile `seed`, vì vậy lệnh `docker compose up` bình thường sẽ không tự tạo dữ liệu test.

Seeder sẽ tạo:

- 1 admin.
- 5 bệnh nhân đã được duyệt.
- 10 health records cho mỗi bệnh nhân, tổng cộng 50 records.
- 2 bác sĩ.
- 2 phòng demo: `SEED-101`, `SEED-102`.
- Duyệt bác sĩ và gán phòng cho bác sĩ đã seed.

Seeder có thể chạy lại. Nếu user/profile đã tồn tại thì seeder bỏ qua phần đã có và chỉ bổ sung health records cho tới khi mỗi bệnh nhân seed có ít nhất 10 records.

## Account test

Các account dưới đây có sau khi đã chạy:

```bash
docker compose --profile seed run --rm test-data-seeder
```

Mật khẩu mặc định cho tất cả account seed:

```text
Test@12345
```

Có thể đổi mật khẩu mặc định bằng `SEEDER_DEFAULT_PASSWORD` trong `.env` trước khi chạy seeder.

| Role | Email | Ghi chú |
| --- | --- | --- |
| Admin | `admin.seed@hsm.test` | Dùng để duyệt bệnh nhân/bác sĩ và tạo record mẫu |
| Patient | `patient01.seed@hsm.test` | Đã duyệt, có 10 health records |
| Patient | `patient02.seed@hsm.test` | Đã duyệt, có 10 health records |
| Patient | `patient03.seed@hsm.test` | Đã duyệt, có 10 health records |
| Patient | `patient04.seed@hsm.test` | Đã duyệt, có 10 health records |
| Patient | `patient05.seed@hsm.test` | Đã duyệt, có 10 health records |
| Doctor | `doctor01.seed@hsm.test` | Cardiology, phòng `SEED-101` |
| Doctor | `doctor02.seed@hsm.test` | Endocrinology, phòng `SEED-102` |

## Service ports

| Service | Port | Mục đích |
| --- | ---: | --- |
| `api-gateway` | 8090 | Backend entrypoint |
| `security-service` | 8091 | User, login, JWT, recovery |
| `patient-service` | 8092 | Bệnh nhân và health records |
| `doctor-service` | 8093 | Bác sĩ, phòng, lịch hẹn |
| `community-portal-service` | 8094 | Post, article, vote, upload |
| `cdss-service` | 8095 | Khuyến nghị sức khỏe và OpenAI |
| `pharmaceutical-inventory-service` | 8096 | Thuốc và thiết bị y tế |
| `notification-service` | 8097 | Email, SMS, notification |
| `analytic-research-service` | 8098 | Research workflow và CSV export |
| `eureka-service-discovery` | 8761 | Service registry |
| `config-server` | 8888 | Centralized config |
| `hsm-client` | 5173 | Frontend |
| `zipkin` | 9411 | Distributed tracing |
| `mysql` | 3306 | Database |

## API route qua Gateway

| Path | Service |
| --- | --- |
| `/users/**` | `security-service` |
| `/patients/**` | `patient-service` |
| `/doctors/**` | `doctor-service` |
| `/rooms/**` | `doctor-service` |
| `/appointments/**` | `doctor-service` |
| `/community-portal/**` | `community-portal-service` |
| `/cdss/**` | `cdss-service` |
| `/recommendation/**` | `cdss-service` |
| `/pharmaceutical-inventory/**` | `pharmaceutical-inventory-service` |
| `/notifications/**` | `notification-service` |
| `/research/**` | `analytic-research-service` |

## Chạy frontend local

Frontend đọc biến môi trường từ root `.env` vì `hsm-client/vite.config.js` đang cấu hình `envDir: '..'`.

```bash
cd hsm-client
npm install
npm run dev
```

URL dev:

```text
http://localhost:5173
```

Build frontend:

```bash
cd hsm-client
npm run build
```

## Chạy backend service local

Mỗi backend service là một app Maven/Spring Boot độc lập. Ví dụ:

```bash
cd security-service
./mvnw spring-boot:run
```

Trên Windows:

```powershell
cd security-service
.\mvnw.cmd spring-boot:run
```

Khi chạy backend ngoài Docker, cần đảm bảo các dependency tương ứng đang chạy hoặc đã được cấu hình: MySQL, Redis, Eureka, Config Server và Zipkin.

## Dữ liệu và persistence

- MySQL lưu dữ liệu trong Docker volume `mysql_data`.
- Redis lưu dữ liệu trong Docker volume `redis_data`.
- Các Spring service đang dùng JPA `ddl-auto=update`.
- `init-scripts/01-create-zipkin-db.sql` tạo bảng cho Zipkin.
- `pharmaceutical-inventory-service` có `InventoryDataSeeder` để seed thuốc và thiết bị y tế khi inventory còn dưới 20 records.
- `test-data-seeder` seed user, patient, doctor, room và health records thông qua HTTP API, không ghi trực tiếp vào database service khác.

## Lệnh hay dùng

Build một service:

```bash
docker compose build patient-service
```

Restart một service:

```bash
docker compose up -d --build patient-service
```

Chạy lại seeder:

```bash
docker compose --profile seed run --rm test-data-seeder
```

Validate Docker Compose config:

```bash
docker compose config --quiet
```

Check build frontend:

```bash
cd hsm-client
npm run build
```

Check package backend:

```powershell
cd doctor-service
.\mvnw.cmd -q -DskipTests package
```

## Ghi chú vận hành

- `docker-compose.yml` vẫn có top-level `version`; Docker Compose mới sẽ bỏ qua và có thể in warning.
- Dependency Zego UI Kit có thể sinh warning về `eval` khi build frontend; build vẫn thành công.
- Frontend bundle hiện khá lớn vì import nhiều UI dependency và Zego vào main bundle.
- `caniuse-lite` có thể báo browser data cũ khi build frontend.
- Các luồng dùng dịch vụ ngoài cần credential thật trước khi chạy đầy đủ: OpenAI, Twilio, SendGrid, Cloudinary và Zego.

## Ghi chú bảo trì

- Không commit secret vào source; để secret trong `.env`.
- `.env.example` là template biến môi trường dùng chung ở thư mục gốc.
- Dữ liệu test/demo nên thêm qua `test-data-seeder` hoặc API rõ ràng, tránh ghi trực tiếp xuyên database của service khác.
- Với production, không đưa server secret xuống frontend; hãy chuyển sang backend token generation flow.
