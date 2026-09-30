# API Configuration Guide

## Cách thay đổi môi trường API

### 1. Sử dụng file .env

Tạo file `.env` trong thư mục gốc và set biến môi trường:

```bash
# Cho môi trường development (localhost)
VITE_APP_ENV=development

# Cho môi trường production (server)
VITE_APP_ENV=production

# Hoặc force một môi trường cụ thể
VITE_FORCE_ENV=development
```

### 2. Thay đổi URL cơ sở

Bạn có thể thay đổi URL cơ sở trong file `.env`:

```bash
VITE_API_BASE_URL_DEV=http://localhost
VITE_API_BASE_URL_PROD=http://152.42.172.83
```

### 3. Kiểm tra cấu hình hiện tại

Khi chạy ứng dụng, bạn sẽ thấy log trong console:

```
🚀 API Config loaded for: DEVELOPMENT
📡 Base URL: http://localhost
```

### 4. Ports cho các service

- USER_SERVICE: 8091
- PATIENT_SERVICE: 8092
- DOCTOR_SERVICE: 8093
- ROOM_SERVICE: 8093
- APPOINTMENT_SERVICE: 8094
- NOTIFICATION_SERVICE: 8095
- INVENTORY_SERVICE: 8096
- COMMUNITY_PORTAL_SERVICE: 8097
- ANALYTIC_RESEARCH_SERVICE: 8098

### 5. Các cách thay đổi môi trường

#### Cách 1: Thông qua file .env

```bash
VITE_APP_ENV=development  # hoặc production
```

#### Cách 2: Force environment

```bash
VITE_FORCE_ENV=development  # sẽ luôn dùng development
```

#### Cách 3: Thay đổi trực tiếp trong code

Sửa file `src/config/apiConfig.js`, dòng cuối trong function `getCurrentEnvironment()`:

```javascript
return "development"; // Force development mode
```

## Ví dụ sử dụng

```javascript
import { API_URLS, IS_DEVELOPMENT } from "../config/apiConfig.js";

// Sử dụng URL service
console.log(API_URLS.USER_SERVICE); // http://localhost:8091 hoặc http://152.42.172.83:8091

// Kiểm tra môi trường
if (IS_DEVELOPMENT) {
  console.log("Đang chạy ở môi trường development");
}
```
