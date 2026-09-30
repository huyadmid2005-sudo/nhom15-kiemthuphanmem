import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, timedelta


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")


API_BASE_URL = os.getenv("SEEDER_API_BASE_URL", "http://api-gateway:8090").rstrip("/")
DEFAULT_PASSWORD = os.getenv("SEEDER_DEFAULT_PASSWORD", "Test@12345")
ADMIN_EMAIL = os.getenv("SEEDER_ADMIN_EMAIL", "admin.seed@hsm.test")
REQUEST_TIMEOUT = int(os.getenv("SEEDER_REQUEST_TIMEOUT_SECONDS", "10"))
MAX_WAIT_SECONDS = int(os.getenv("SEEDER_MAX_WAIT_SECONDS", "180"))
RETRY_SECONDS = int(os.getenv("SEEDER_RETRY_SECONDS", "5"))


PATIENTS = [
    {
        "email": "patient01.seed@hsm.test",
        "firstName": "An",
        "lastName": "Nguyen",
        "dateOfBirth": "1992-03-14",
        "gender": "Female",
        "bloodGroup": "A_Positive",
        "phoneNumber": "09000000001",
        "address": "12 Nguyen Trai, District 1, Ho Chi Minh City",
    },
    {
        "email": "patient02.seed@hsm.test",
        "firstName": "Binh",
        "lastName": "Tran",
        "dateOfBirth": "1988-07-22",
        "gender": "Male",
        "bloodGroup": "O_Positive",
        "phoneNumber": "09000000002",
        "address": "24 Le Loi, District 3, Ho Chi Minh City",
    },
    {
        "email": "patient03.seed@hsm.test",
        "firstName": "Chi",
        "lastName": "Pham",
        "dateOfBirth": "1995-11-02",
        "gender": "Female",
        "bloodGroup": "B_Positive",
        "phoneNumber": "09000000003",
        "address": "36 Hai Ba Trung, District 1, Ho Chi Minh City",
    },
    {
        "email": "patient04.seed@hsm.test",
        "firstName": "Dung",
        "lastName": "Le",
        "dateOfBirth": "1979-05-18",
        "gender": "Male",
        "bloodGroup": "AB_Positive",
        "phoneNumber": "09000000004",
        "address": "48 Phan Xich Long, Phu Nhuan, Ho Chi Minh City",
    },
    {
        "email": "patient05.seed@hsm.test",
        "firstName": "Em",
        "lastName": "Vo",
        "dateOfBirth": "2000-09-09",
        "gender": "Other",
        "bloodGroup": "O_Negative",
        "phoneNumber": "09000000005",
        "address": "60 Vo Van Tan, District 3, Ho Chi Minh City",
    },
]


DOCTORS = [
    {
        "email": "doctor01.seed@hsm.test",
        "firstName": "Minh",
        "lastName": "Hoang",
        "careerTitle": "Specialist",
        "department": "Cardiology",
        "specialization": "Cardiology",
        "designation": "Consultant",
        "institute": "HSM Clinic",
        "experienceYears": 9,
        "qualifications": "MD, Cardiology",
        "licenseNumber": "VN-MED-90001",
        "dateOfBirth": "1983-04-11",
        "gender": "Male",
        "bloodGroup": "B_Positive",
        "phoneNumber": "09100000001",
        "biography": "Cardiology specialist focused on preventive heart care.",
        "address": "HSM Clinic, Cardiology Department",
        "roomNo": "SEED-101",
    },
    {
        "email": "doctor02.seed@hsm.test",
        "firstName": "Lan",
        "lastName": "Do",
        "careerTitle": "Specialist",
        "department": "Endocrinology",
        "specialization": "Endocrinology",
        "designation": "Consultant",
        "institute": "HSM Clinic",
        "experienceYears": 7,
        "qualifications": "MD, Endocrinology",
        "licenseNumber": "VN-MED-90002",
        "dateOfBirth": "1986-12-05",
        "gender": "Female",
        "bloodGroup": "A_Positive",
        "phoneNumber": "09100000002",
        "biography": "Endocrinology specialist focused on diabetes care.",
        "address": "HSM Clinic, Endocrinology Department",
        "roomNo": "SEED-102",
    },
]


def build_articles(updated_on):
    return [
        {
            "doctorEmail": "doctor01.seed@hsm.test",
            "title": "Theo dõi huyết áp tại nhà: đọc chỉ số sao cho đúng?",
            "category": "DISEASE",
            "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/4/44/CP25_Leukemia_Patient_Consultation_%289123625%29.jpg",
            "content": f"""Một lần đo huyết áp đơn lẻ chưa đủ để kết luận tình trạng sức khỏe. Điều quan trọng là đo đúng cách, ghi lại xu hướng và biết khi nào cần liên hệ nhân viên y tế.

## Vì sao nên theo dõi huyết áp?

Huyết áp cao thường không gây triệu chứng rõ ràng trong giai đoạn đầu. Theo dõi tại nhà giúp bác sĩ nhìn được bức tranh thực tế hơn so với một lần đo trong phòng khám, đặc biệt khi người bệnh dễ lo lắng khi đi khám.

## Cách đo để kết quả đáng tin cậy

- Nghỉ yên 5 phút trước khi đo.
- Ngồi tựa lưng, hai chân đặt trên sàn, không bắt chéo chân.
- Đặt vòng bít ngang tim và không nói chuyện trong lúc đo.
- Đo 2 lần cách nhau 1-2 phút, ghi lại cả hai kết quả.
- Mang sổ ghi chép hoặc dữ liệu từ máy đo khi tái khám.

## Khi nào nên đi khám?

Nếu chỉ số thường xuyên cao hơn mục tiêu mà bác sĩ đã đặt ra, hoặc bạn có đau ngực, khó thở, yếu liệt một bên, nói khó, đau đầu dữ dội, hãy đi khám ngay. Không tự ý tăng, giảm hoặc ngưng thuốc huyết áp nếu chưa trao đổi với bác sĩ.

## Gợi ý thực hành hằng ngày

Chọn một khung giờ cố định, ví dụ buổi sáng trước khi ăn và trước khi uống cà phê. Việc đo đều đặn quan trọng hơn đo quá nhiều lần trong ngày rồi lo lắng với từng dao động nhỏ.

**Cập nhật:** {updated_on}

**Lưu ý:** Bài viết chỉ dùng cho mục đích giáo dục sức khỏe, không thay thế chẩn đoán hoặc điều trị cá nhân.

**Nguồn ảnh thumbnail:** [CP25 Leukemia Patient Consultation](https://commons.wikimedia.org/wiki/File:CP25_Leukemia_Patient_Consultation_(9123625).jpg), U.S. Navy photo by Petty Officer 2nd Class Jonas Womack, Public domain.""",
        },
        {
            "doctorEmail": "doctor02.seed@hsm.test",
            "title": "Đĩa ăn cân bằng cho người bận rộn",
            "category": "NUTRITION",
            "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/1/16/Alimentaci%C3%B3n_saludable.jpg",
            "content": f"""Ăn lành mạnh không nhất thiết phải cầu kỳ. Với người bận rộn, một nguyên tắc dễ nhớ là chia bữa ăn thành các nhóm thực phẩm rõ ràng để tránh ăn quá nhiều tinh bột tinh chế hoặc bỏ quên rau.

## Công thức đĩa ăn dễ áp dụng

- Một nửa đĩa là rau củ và trái cây ít ngọt.
- Một phần tư đĩa là chất đạm như cá, trứng, đậu, thịt nạc hoặc sữa chua không đường.
- Một phần tư đĩa là tinh bột nguyên hạt hoặc thực phẩm giàu chất xơ như gạo lứt, khoai, yến mạch.
- Ưu tiên dầu thực vật vừa phải, hạn chế món chiên ngập dầu.

## Mẹo chuẩn bị nhanh

Rửa và cắt sẵn rau cho 2-3 ngày, luộc trứng hoặc chuẩn bị đậu hũ, ức gà, cá hộp ít muối. Khi đó một bữa ăn đủ chất có thể hoàn thành nhanh mà không cần gọi đồ ăn nhiều dầu mỡ.

## Với người cần kiểm soát đường huyết

Không cần loại bỏ hoàn toàn tinh bột, nhưng nên chọn khẩu phần vừa phải và ăn kèm chất xơ, đạm. Nếu đang điều trị đái tháo đường, hãy theo kế hoạch của bác sĩ hoặc chuyên gia dinh dưỡng, vì nhu cầu mỗi người khác nhau.

## Dấu hiệu bữa ăn đang lệch

Nếu sau ăn bạn nhanh đói, buồn ngủ nhiều hoặc thèm đồ ngọt liên tục, hãy xem lại lượng rau, đạm và chất xơ trong bữa. Điều chỉnh nhỏ nhưng đều đặn thường bền vững hơn ăn kiêng quá nghiêm ngặt.

**Cập nhật:** {updated_on}

**Lưu ý:** Bài viết chỉ dùng cho mục đích giáo dục sức khỏe, không thay thế tư vấn dinh dưỡng cá nhân.

**Nguồn ảnh thumbnail:** [Alimentación saludable](https://commons.wikimedia.org/wiki/File:Alimentaci%C3%B3n_saludable.jpg), Silvia Elizabeth Bonilla Veloz, CC BY-SA 4.0.""",
        },
        {
            "doctorEmail": "doctor01.seed@hsm.test",
            "title": "Tiêm chủng: chuẩn bị gì trước và sau khi tiêm?",
            "category": "PREVENTION",
            "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Vaccination_of_girl.jpg",
            "content": f"""Tiêm chủng giúp cơ thể nhận diện tác nhân gây bệnh trước khi tiếp xúc thật. Chuẩn bị đúng cách giúp buổi tiêm diễn ra an toàn hơn và giúp bạn theo dõi phản ứng sau tiêm bình tĩnh hơn.

## Trước khi tiêm

- Mang theo sổ tiêm chủng hoặc thông tin vaccine đã tiêm trước đó.
- Báo với nhân viên y tế nếu từng dị ứng nặng, đang sốt cao, đang mang thai hoặc đang dùng thuốc ức chế miễn dịch.
- Ăn nhẹ và uống đủ nước nếu lịch hẹn kéo dài.
- Đặt câu hỏi nếu chưa rõ loại vaccine, lịch nhắc lại hoặc phản ứng thường gặp.

## Sau khi tiêm

Ở lại điểm tiêm theo thời gian được hướng dẫn để theo dõi phản ứng sớm. Trong 1-2 ngày đầu, đau tại chỗ tiêm, mệt nhẹ hoặc sốt nhẹ có thể xuất hiện tùy loại vaccine và cơ địa.

## Khi nào cần hỗ trợ y tế?

Hãy liên hệ cơ sở y tế ngay nếu có khó thở, sưng môi hoặc mặt, nổi mề đay toàn thân, choáng, sốt cao kéo dài, co giật hoặc bất kỳ triệu chứng nào khiến bạn lo lắng.

## Đừng quên lịch nhắc lại

Một số vaccine cần nhiều mũi để đạt hiệu quả bảo vệ tốt. Ghi lịch vào điện thoại hoặc sổ sức khỏe để không bỏ sót mũi tiếp theo.

**Cập nhật:** {updated_on}

**Lưu ý:** Bài viết chỉ dùng cho mục đích giáo dục sức khỏe. Lịch tiêm cụ thể cần theo hướng dẫn của cơ sở y tế.

**Nguồn ảnh thumbnail:** [Vaccination of girl](https://commons.wikimedia.org/wiki/File:Vaccination_of_girl.jpg), James Gathany, Public domain.""",
        },
        {
            "doctorEmail": "doctor01.seed@hsm.test",
            "title": "Đi bộ nhanh: bài tập nhỏ cho sức khỏe tim mạch",
            "category": "GENERAL_HEALTH",
            "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Woman_walking_in_exercise_clothing_on_Como_lakefront.jpg",
            "content": f"""Đi bộ nhanh là lựa chọn dễ bắt đầu, ít tốn chi phí và phù hợp với nhiều độ tuổi. Khi duy trì đều, thói quen này hỗ trợ tim mạch, giấc ngủ, cân nặng và tinh thần.

## Thế nào là đi bộ nhanh?

Bạn đang đi đủ nhanh khi hơi thở nhanh hơn bình thường nhưng vẫn nói được từng câu ngắn. Nếu vẫn hát thoải mái, cường độ có thể còn nhẹ. Nếu không nói được, hãy giảm tốc.

## Bắt đầu an toàn

- Khởi động 5 phút với tốc độ chậm.
- Tăng dần lên 10-15 phút mỗi buổi nếu lâu ngày chưa vận động.
- Mang giày vừa chân, chọn đường sáng và bằng phẳng.
- Uống nước, tránh tập lúc quá đói hoặc ngay sau bữa ăn lớn.

## Khi cần hỏi bác sĩ trước

Người có đau ngực, khó thở khi gắng sức, chóng mặt, bệnh tim đã biết, biến chứng bàn chân do đái tháo đường hoặc vừa phẫu thuật nên trao đổi với bác sĩ trước khi tăng cường độ tập.

## Làm sao duy trì?

Gắn đi bộ với một thói quen sẵn có như sau bữa tối 30-60 phút, đi cùng người thân hoặc nghe podcast nhẹ. Mục tiêu thực tế trong tuần đầu quan trọng hơn kế hoạch quá tham vọng.

**Cập nhật:** {updated_on}

**Lưu ý:** Bài viết chỉ dùng cho mục đích giáo dục sức khỏe, không thay thế chỉ định vận động cá nhân.

**Nguồn ảnh thumbnail:** [Woman walking in exercise clothing on Como lakefront](https://commons.wikimedia.org/wiki/File:Woman_walking_in_exercise_clothing_on_Como_lakefront.jpg), Daniel Case, CC BY-SA 3.0.""",
        },
        {
            "doctorEmail": "doctor02.seed@hsm.test",
            "title": "Stress và giấc ngủ: chăm sóc tinh thần từ những bước cơ bản",
            "category": "MENTAL_HEALTH",
            "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/d/de/Mindfulness_Meditation_-_Art4Good.jpg",
            "content": f"""Stress kéo dài có thể ảnh hưởng đến giấc ngủ, cảm giác thèm ăn, đường huyết, huyết áp và khả năng tập trung. Chăm sóc sức khỏe tinh thần nên bắt đầu từ các thói quen nhỏ, dễ duy trì.

## Nhận diện tín hiệu cơ thể

Một số dấu hiệu thường gặp là khó ngủ, thức dậy mệt, cáu gắt, đau đầu căng cơ, ăn uống thất thường hoặc khó tập trung. Những dấu hiệu này không có nghĩa là bạn yếu đuối; chúng cho thấy cơ thể đang cần được điều chỉnh.

## Ba việc có thể làm trong tuần này

- Đặt giờ ngủ và giờ thức dậy tương đối cố định.
- Tắt màn hình hoặc giảm ánh sáng xanh 30 phút trước khi ngủ.
- Dành 5 phút thở chậm, đi bộ nhẹ hoặc viết ra điều đang làm bạn lo.

## Khi nào nên tìm hỗ trợ?

Nếu mất ngủ kéo dài, buồn bã hoặc lo âu ảnh hưởng công việc, học tập, quan hệ gia đình; hoặc xuất hiện ý nghĩ tự làm hại bản thân, hãy liên hệ bác sĩ, chuyên viên tâm lý hoặc dịch vụ cấp cứu tại địa phương ngay.

## Không cần thay đổi tất cả cùng lúc

Một thay đổi nhỏ nhưng lặp lại mỗi ngày thường hiệu quả hơn cố gắng thay đổi toàn bộ lịch sinh hoạt trong một đêm. Hãy chọn một thói quen dễ nhất và theo dõi trong 7 ngày.

**Cập nhật:** {updated_on}

**Lưu ý:** Bài viết chỉ dùng cho mục đích giáo dục sức khỏe, không thay thế đánh giá tâm lý hoặc điều trị y khoa.

**Nguồn ảnh thumbnail:** [Mindfulness Meditation - Art4Good](https://commons.wikimedia.org/wiki/File:Mindfulness_Meditation_-_Art4Good.jpg), Vaishali Dhiman, CC BY-SA 4.0.""",
        },
    ]


class ApiError(Exception):
    def __init__(self, status, body, path):
        super().__init__(f"{status} from {path}: {body}")
        self.status = status
        self.body = body
        self.path = path


def log(message):
    print(f"[test-data-seeder] {message}", flush=True)


def decode_response(raw):
    if not raw:
        return None
    text = raw.decode("utf-8")
    if not text:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return text


def request(method, path, payload=None, token=None, expected=(200,), allow=()):
    data = None
    headers = {"Accept": "application/json"}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = token if token.startswith("Bearer ") else f"Bearer {token}"

    req = urllib.request.Request(
        f"{API_BASE_URL}{path}",
        data=data,
        headers=headers,
        method=method,
    )

    try:
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as response:
            body = decode_response(response.read())
            if response.status not in expected and response.status not in allow:
                raise ApiError(response.status, body, path)
            return response.status, body
    except urllib.error.HTTPError as error:
        body = decode_response(error.read())
        if error.code in allow:
            return error.code, body
        raise ApiError(error.code, body, path) from error


def is_duplicate_response(status, body):
    if status != 400:
        return False
    message = ""
    if isinstance(body, dict):
        message = str(body.get("message") or body.get("error") or body)
    else:
        message = str(body)
    return "already" in message.lower() or "exists" in message.lower()


def is_truthy_flag(data, *names):
    for name in names:
        if isinstance(data, dict) and name in data:
            return bool(data[name])
    return False


def wait_for_api():
    deadline = time.time() + MAX_WAIT_SECONDS
    last_error = None

    while time.time() < deadline:
        try:
            request("GET", "/users/id/0", expected=(200,), allow=(400, 401, 403, 404))
            log("API gateway and security-service are reachable")
            return
        except Exception as exc:
            last_error = exc
            log(f"waiting for API gateway: {exc}")
            time.sleep(RETRY_SECONDS)

    raise RuntimeError(f"API did not become ready within {MAX_WAIT_SECONDS}s: {last_error}")


def register_user(email, role):
    payload = {
        "email": email,
        "password": DEFAULT_PASSWORD,
        "role": role,
        "isActive": True,
    }
    status, body = request("POST", "/users/register", payload, expected=(201,), allow=(400,))
    if status == 201:
        log(f"created {role.lower()} user {email}")
        return body
    if is_duplicate_response(status, body):
        log(f"{role.lower()} user already exists: {email}")
        return body
    raise ApiError(status, body, "/users/register")


def login(email):
    _, body = request(
        "POST",
        "/users/login",
        {"email": email, "password": DEFAULT_PASSWORD},
        expected=(200,),
    )
    token = body.get("userLoginDetails", {}).get("token") if isinstance(body, dict) else None
    if not token:
        raise RuntimeError(f"login response did not include token for {email}: {body}")
    return token


def encoded(value):
    return urllib.parse.quote(value, safe="")


def get_patient_by_email(email, token):
    status, body = request(
        "GET",
        f"/patients/email/{encoded(email)}",
        token=token,
        expected=(200,),
        allow=(404,),
    )
    return body if status == 200 else None


def get_doctor_by_email(email, token):
    status, body = request(
        "GET",
        f"/doctors/email/{encoded(email)}",
        token=token,
        expected=(200,),
        allow=(404,),
    )
    return body if status == 200 else None


def ensure_patient(patient, admin_token):
    email = patient["email"]
    existing = get_patient_by_email(email, admin_token)

    if existing is None:
        payload = {**patient, "password": DEFAULT_PASSWORD, "isApproved": True, "isActive": True}
        status, body = request("POST", "/patients/register", payload, expected=(201,), allow=(400,))
        if status == 201:
            log(f"created patient profile {email}")
        elif is_duplicate_response(status, body):
            log(f"patient registration already exists: {email}")
        else:
            raise ApiError(status, body, "/patients/register")
        existing = get_patient_by_email(email, admin_token)

    if not existing or "patientId" not in existing:
        raise RuntimeError(f"could not resolve patientId for {email}: {existing}")

    patient_id = existing["patientId"]
    if not is_truthy_flag(existing, "approved", "isApproved"):
        status, body = request(
            "POST",
            f"/patients/approve/{patient_id}",
            token=admin_token,
            expected=(200,),
            allow=(400,),
        )
        if status == 200:
            log(f"approved patient {patient_id}")
        elif is_duplicate_response(status, body):
            log(f"patient already approved: {patient_id}")
        else:
            raise ApiError(status, body, f"/patients/approve/{patient_id}")

    return patient_id


def get_health_records(patient_id, token):
    status, body = request(
        "GET",
        f"/patients/health-records/patient/{encoded(patient_id)}",
        token=token,
        expected=(200,),
        allow=(404,),
    )
    return body if status == 200 and isinstance(body, list) else []


def build_health_record(patient_id, patient_index, record_index):
    checkup_date = date.today() - timedelta(days=(patient_index * 3 + record_index))
    systolic = 112 + patient_index * 4 + record_index % 7
    diastolic = 72 + patient_index * 2 + record_index % 5
    blood_sugar = round(4.9 + patient_index * 0.3 + record_index * 0.08, 1)
    temperature = round(36.4 + (record_index % 5) * 0.15, 1)
    pulse = 68 + patient_index * 2 + record_index % 9

    return {
        "patientId": patient_id,
        "checkupDate": checkup_date.isoformat(),
        "heightInCm": 160 + patient_index * 4,
        "weightInKg": 56 + patient_index * 5 + record_index % 4,
        "bloodPressure": f"{systolic}/{diastolic}",
        "bloodSugar": str(blood_sugar),
        "bodyTemperature": str(temperature),
        "pulseRate": str(pulse),
        "allergies": ["None", "Pollen", "Seafood", "Peanuts", "Dust"][record_index % 5],
        "pastSurgeries": ["None", "Appendectomy", "Tonsillectomy"][record_index % 3],
        "hasDiabetes": patient_index in (1, 3) and record_index % 2 == 0,
        "isHypertensive": systolic >= 130,
        "hasHeartDisease": patient_index == 3 and record_index % 4 == 0,
        "hasKidneyDisease": False,
        "hasLiverDisease": False,
        "hasCancer": False,
        "hasHiv": False,
        "hasTb": False,
        "physicalDisability": "None",
        "vaccineInfo": ["COVID-19", "COVID-19, Flu", "Hepatitis B", "Tetanus"][record_index % 4],
        "isSmoker": patient_index == 1 and record_index % 3 == 0,
        "isAlcoholic": patient_index == 3 and record_index % 5 == 0,
        "isActive": True,
    }


def ensure_health_records(patient_id, patient_index, admin_token):
    existing = get_health_records(patient_id, admin_token)
    if len(existing) >= 10:
        log(f"patient {patient_id} already has {len(existing)} health records")
        return

    for record_index in range(len(existing), 10):
        request(
            "POST",
            "/patients/health-records/create",
            build_health_record(patient_id, patient_index, record_index),
            token=admin_token,
            expected=(201,),
        )
    log(f"created {10 - len(existing)} health records for patient {patient_id}")


def get_rooms(admin_token):
    status, body = request("GET", "/rooms/all", token=admin_token, expected=(200,), allow=(404,))
    return body if status == 200 and isinstance(body, list) else []


def ensure_room(room_no, admin_token):
    rooms = get_rooms(admin_token)
    if any(room.get("roomNo") == room_no for room in rooms if isinstance(room, dict)):
        log(f"room already exists: {room_no}")
        return

    status, body = request(
        "POST",
        "/rooms/create",
        {"roomNo": room_no, "isAvailable": True},
        token=admin_token,
        expected=(201,),
        allow=(400,),
    )
    if status == 201:
        log(f"created room {room_no}")
    elif is_duplicate_response(status, body):
        log(f"room already exists: {room_no}")
    else:
        raise ApiError(status, body, "/rooms/create")


def ensure_doctor(doctor, admin_token):
    email = doctor["email"]
    existing = get_doctor_by_email(email, admin_token)

    if existing is None:
        payload = {
            key: value
            for key, value in doctor.items()
            if key != "roomNo"
        }
        payload.update({"password": DEFAULT_PASSWORD, "isApproved": True, "isActive": True})
        status, body = request("POST", "/doctors/register", payload, expected=(201,), allow=(400,))
        if status == 201:
            log(f"created doctor profile {email}")
        elif is_duplicate_response(status, body):
            log(f"doctor registration already exists: {email}")
        else:
            raise ApiError(status, body, "/doctors/register")
        existing = get_doctor_by_email(email, admin_token)

    if not existing or "doctorId" not in existing:
        raise RuntimeError(f"could not resolve doctorId for {email}: {existing}")

    doctor_id = existing["doctorId"]
    if is_truthy_flag(existing, "approved", "isApproved"):
        log(f"doctor already approved: {doctor_id}")
        return doctor_id

    ensure_room(doctor["roomNo"], admin_token)
    status, body = request(
        "POST",
        f"/doctors/approve/allocate/{doctor_id}/{encoded(doctor['roomNo'])}",
        token=admin_token,
        expected=(200,),
        allow=(400,),
    )
    if status == 200:
        log(f"approved doctor {doctor_id} and allocated room {doctor['roomNo']}")
    elif is_duplicate_response(status, body):
        log(f"doctor already approved: {doctor_id}")
    else:
        raise ApiError(status, body, f"/doctors/approve/allocate/{doctor_id}/{doctor['roomNo']}")
    return doctor_id


def get_articles_by_doctor(doctor_id, token):
    status, body = request(
        "GET",
        f"/community-portal/articles/doctor/{encoded(doctor_id)}",
        token=token,
        expected=(200,),
        allow=(404,),
    )
    return body if status == 200 and isinstance(body, list) else []


def ensure_article(article, doctor_id, doctor_token):
    existing_articles = get_articles_by_doctor(doctor_id, doctor_token)
    existing = next(
        (
            item
            for item in existing_articles
            if isinstance(item, dict) and item.get("title") == article["title"]
        ),
        None,
    )

    payload = {
        "title": article["title"],
        "content": article["content"],
        "category": article["category"],
        "thumbnailUrl": article["thumbnailUrl"],
    }

    if existing and existing.get("articleId"):
        payload["articleId"] = existing["articleId"]
        request(
            "PUT",
            "/community-portal/articles/update",
            payload,
            token=doctor_token,
            expected=(200,),
        )
        log(f"updated article: {article['title']}")
        return

    request(
        "POST",
        "/community-portal/articles/create",
        payload,
        token=doctor_token,
        expected=(201,),
    )
    log(f"created article: {article['title']}")


def main():
    log(f"using API base URL {API_BASE_URL}")
    wait_for_api()

    register_user(ADMIN_EMAIL, "Admin")
    admin_token = login(ADMIN_EMAIL)
    log(f"admin ready: {ADMIN_EMAIL}")

    for index, patient in enumerate(PATIENTS):
        patient_id = ensure_patient(patient, admin_token)
        ensure_health_records(patient_id, index, admin_token)

    doctor_ids_by_email = {}
    for doctor in DOCTORS:
        doctor_ids_by_email[doctor["email"]] = ensure_doctor(doctor, admin_token)

    for article in build_articles(date.today().strftime("%d/%m/%Y")):
        doctor_email = article["doctorEmail"]
        doctor_id = doctor_ids_by_email.get(doctor_email)
        if not doctor_id:
            raise RuntimeError(f"could not resolve doctor for article seed: {doctor_email}")
        doctor_token = login(doctor_email)
        ensure_article(article, doctor_id, doctor_token)

    log("seed complete: 1 admin, 5 patients, 50 health records, 2 doctors, 5 articles")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        log(f"seed failed: {exc}")
        sys.exit(1)
