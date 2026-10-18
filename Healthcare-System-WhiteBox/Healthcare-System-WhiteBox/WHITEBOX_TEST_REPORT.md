# BÁO CÁO KIỂM THỬ HỘP TRẮNG
## Healthcare System – WhiteBox Edition

### 1. Phạm vi

Đối tượng kiểm thử: `AppointmentService`.

Kỹ thuật:

- White-box testing.
- Branch testing.
- Decision/path testing.
- Positive và negative path.

Mục tiêu là kiểm tra trực tiếp các nhánh điều kiện trong code service, không chỉ dựa vào giao diện hay HTTP response.

### 2. Nhánh logic được xác định

| Branch ID | Điều kiện trong code | Nhánh cần kiểm tra |
|---|---|---|
| WB-BR-01 | Doctor không tồn tại | true / false |
| WB-BR-02 | Ngày ở quá khứ | true / false |
| WB-BR-03 | startTime >= endTime hoặc null | true / false |
| WB-BR-04 | perPatientMinutes <= 0 | true / false |
| WB-BR-05 | thời lượng > khung giờ | true / false |
| WB-BR-06 | slot overlap | true / false |
| WB-BR-07 | Patient không tồn tại / inactive | true / false |
| WB-BR-08 | Slot không tồn tại | true / false |
| WB-BR-09 | Slot unavailable | true / false |
| WB-BR-10 | AppointmentType null | true / false |
| WB-BR-11 | Trùng Patient + Doctor + ngày | true / false |
| WB-BR-12 | Appointment không tồn tại | true / false |
| WB-BR-13 | Appointment đã cancelled | true / false |

### 3. Test case hộp trắng

| ID | Đường đi / mục tiêu | Expected | Actual | KQ |
|---|---|---|---|---|
| WB-01 | Happy path tạo slot | Tạo 2 slot 30 phút | Tạo 2 slot | PASS |
| WB-02 | WB-BR-01=true | `Doctor not found` | Đúng message | PASS |
| WB-03 | WB-BR-02=true | `Past date not allowed` | Đúng message | PASS |
| WB-04 | WB-BR-03=true | Từ chối start >= end | Đúng message | PASS |
| WB-05 | WB-BR-04=true | Từ chối duration = 0 | Đúng message | PASS |
| WB-06 | WB-BR-05=true | Từ chối duration vượt window | Đúng message | PASS |
| WB-07 | WB-BR-06=true | Từ chối overlap | Đúng message | PASS |
| WB-08 | Happy path booking | BOOKED, slot unavailable | Đúng | PASS |
| WB-09 | WB-BR-07=true | Từ chối Patient inactive | Đúng message | PASS |
| WB-10 | WB-BR-08=true | Từ chối slot không tồn tại | Đúng message | PASS |
| WB-11 | WB-BR-09=true | Từ chối slot unavailable | Đúng message | PASS |
| WB-12 | WB-BR-10=true | Từ chối type null | Đúng message | PASS |
| WB-13 | WB-BR-11=true | Từ chối cùng Doctor cùng ngày | Đúng message | PASS |
| WB-14 | Happy path cancel | CANCELLED và slot mở lại | Đúng | PASS |
| WB-15 | WB-BR-12/13=true | Từ chối missing/repeated cancel | Đúng message | PASS |

### 4. Kết quả thực thi

Bộ test đã được compile và chạy trực tiếp bằng Java.

```text
Tests run: 15
PASS:      15
FAIL:      0
Result:    PASS
```

### 5. Đánh giá coverage

Không sử dụng công cụ coverage tự động như JaCoCo trong bản offline này. Coverage được đánh giá theo **ma trận branch đã thiết kế**:

- 13 nhóm quyết định chính đã được xác định trong code.
- Bộ test có cả happy path và nhánh lỗi tương ứng.
- 15/15 test case thực thi PASS.

Vì vậy có thể báo cáo là **đã bao phủ các nhánh nghiệp vụ mục tiêu trong phạm vi AppointmentService**, nhưng không nên ghi một tỷ lệ line/branch coverage phần trăm nếu chưa đo bằng công cụ coverage chuyên dụng.

### 6. Kết luận

Bản phần mềm mới hoạt động độc lập và bộ kiểm thử hộp trắng xác nhận các đường đi chính của nghiệp vụ tạo slot, booking và cancel. Các test được thiết kế từ cấu trúc code và điều kiện rẽ nhánh, phù hợp với mục tiêu kiểm thử hộp trắng.
