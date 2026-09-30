# Analytics & Research Management System

Hệ thống quản lý nghiên cứu và phân tích dữ liệu y tế cho HMS (Healthcare Management System).

## Tính năng chính

### Cho Admin:

1. **Quản lý đơn đăng ký nghiên cứu**

   - Xem danh sách tất cả đơn đăng ký
   - Phê duyệt/từ chối đơn đăng ký
   - Xem chi tiết thông tin researcher

2. **Quản lý quyền truy cập dữ liệu**

   - Cấp quyền truy cập cho researcher đã được phê duyệt
   - Theo dõi trạng thái download dữ liệu
   - Xuất dữ liệu y tế ẩn danh

3. **Dashboard thống kê**
   - Số lượng đơn đăng ký chờ phê duyệt
   - Số lượng researcher đã được phê duyệt
   - Số lượng đã download dữ liệu

### Cho Researcher:

1. **Đăng ký nghiên cứu**
   - Form đăng ký với thông tin chi tiết
   - Mô tả mục đích và phương pháp nghiên cứu
   - Cam kết tuân thủ quy định sử dụng dữ liệu

## API Endpoints

### Backend Service: Analytic Research Service (Port: 8095)

1. **POST** `/research/register`

   - Đăng ký researcher mới
   - Body: ResearcherDto

2. **GET** `/research/registered/all`

   - Lấy tất cả researcher đã đăng ký

3. **GET** `/research/applied/all`

   - Lấy tất cả researcher đã được phê duyệt

4. **GET** `/research/taken/all`

   - Lấy tất cả researcher đã download dữ liệu

5. **GET** `/research/give-access/{id}`

   - Cấp quyền truy cập cho researcher

6. **GET** `/research/get/analytic-data/{id}`
   - Download dữ liệu y tế ẩn danh (CSV format)

## Cách sử dụng

### Đối với Admin:

1. Đăng nhập vào hệ thống với role Admin
2. Vào menu "Analytics & Research" → "Research Management"
3. Xem danh sách đơn đăng ký trong các tab:
   - **All Applications**: Tất cả đơn đăng ký
   - **Approved**: Đơn đã được phê duyệt
   - **Completed**: Đơn đã download dữ liệu
4. Thực hiện các hành động:
   - **View**: Xem chi tiết đơn đăng ký
   - **Approve**: Phê duyệt đơn đăng ký
   - **Download**: Cho phép researcher download dữ liệu

### Đối với Researcher:

1. Truy cập trang chủ HMS
2. Click "Apply for Research Data" hoặc truy cập `/researcher/register`
3. Điền form đăng ký với đầy đủ thông tin:
   - Họ tên
   - Email
   - Chức danh/Vị trí
   - Tổ chức/Trường học
   - Mục đích nghiên cứu chi tiết
4. Submit đơn đăng ký
5. Chờ admin phê duyệt
6. Sau khi được phê duyệt, admin sẽ liên hệ để cung cấp dữ liệu

## Quy trình làm việc

1. **Researcher đăng ký** → Status: "Pending Approval"
2. **Admin xem xét và phê duyệt** → Status: "Access Granted"
3. **Admin download dữ liệu cho researcher** → Status: "Data Downloaded"

## Bảo mật và quyền riêng tư

- Tất cả dữ liệu được xuất đều đã được ẩn danh hóa
- Không có thông tin định danh bệnh nhân
- Researcher phải cam kết tuân thủ các quy định về sử dụng dữ liệu
- Dữ liệu chỉ được sử dụng cho mục đích nghiên cứu đã khai báo

## Công nghệ sử dụng

- **Frontend**: React.js, Material-UI, Tailwind CSS
- **Backend**: Spring Boot, OpenCSV
- **Database**: PostgreSQL/MySQL
- **File Format**: CSV for health data export
