# Healthcare System – WhiteBox Edition

Bản mới độc lập, nhỏ gọn của bài tập lớn **Healthcare System – hệ thống đặt lịch khám**, được tạo để có thể chạy và kiểm thử hộp trắng mà **không cần Docker, Maven, MySQL hay thư viện ngoài**.

## Chức năng

- Xem bác sĩ.
- Xem slot khám còn trống.
- Đặt lịch cho Patient.
- Chặn Patient inactive.
- Chặn slot đã được đặt.
- Chặn cùng Patient đặt cùng Doctor trong cùng ngày.
- Hủy lịch và mở lại slot.
- Tạo slot với kiểm tra ngày quá khứ, thời gian, thời lượng và overlap.
- Giao diện Web đơn giản tại `http://localhost:8088`.

## Yêu cầu

- JDK 17 trở lên.
- Windows PowerShell hoặc terminal có `javac` + `java`.

## Chạy phần mềm trên Windows

```powershell
cd Healthcare-System-WhiteBox
Set-ExecutionPolicy -Scope Process Bypass -Force
.\run-app.ps1
```

Mở:

```text
http://localhost:8088
```

Dữ liệu demo:

- `P001`: Patient active.
- `P002`: Patient inactive.
- `D001`: Cardiology.
- `D002`: Neurology.

## Chạy kiểm thử hộp trắng

```powershell
cd Healthcare-System-WhiteBox
.\run-tests.ps1
```

Kết quả chuẩn của bộ hiện tại:

```text
Tests run: 15
PASS:      15
FAIL:      0
Result:    PASS
```

## Vì sao đây là kiểm thử hộp trắng?

Tester dựa trực tiếp vào cấu trúc bên trong `AppointmentService.java`. Các nhánh quyết định được đánh dấu `WB-BR-01` đến `WB-BR-13`, sau đó thiết kế dữ liệu để đi qua nhánh đúng và nhánh lỗi.

Xem chi tiết trong:

- `WHITEBOX_TEST_REPORT.md`
- `evidence/whitebox-test-output.txt`

## File quan trọng

```text
src/main/java/.../service/AppointmentService.java
src/test/java/.../WhiteBoxTestRunner.java
web/index.html
WHITEBOX_TEST_REPORT.md
```

> Bộ test dùng runner Java thuần để project chạy offline, không phụ thuộc JUnit/Maven. Kỹ thuật kiểm thử vẫn là white-box branch/path testing vì test được thiết kế dựa trên code và các nhánh điều kiện bên trong service.
