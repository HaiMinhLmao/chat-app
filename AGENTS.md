# Project Rules

File này dùng để ghi các rule làm việc cho Codex trong repo `chat-app`.

Từ các task tiếp theo trong repo này, mình sẽ đọc file này trước khi bắt đầu làm việc.
Nếu có rule nào xung đột với ràng buộc hệ thống, an toàn, hoặc tool, mình sẽ nói rõ trước khi làm.

## Cách dùng

Viết rule ngắn, rõ, ưu tiên theo mức quan trọng.

Ví dụ tốt:
- Ưu tiên sửa bug trước khi tối ưu UI.
- Không tự ý đổi text tiếng Việt sang tiếng Anh.
- Mọi thay đổi frontend phải giữ layout desktop cũ nếu user không yêu cầu đổi.
- Trước khi push phải chạy `mvnw.cmd -q test`.

Ví dụ chưa tốt:
- Làm giao diện đẹp hơn.
- Code sạch hơn.

## Rule Hiện Tại

### 1. Mục tiêu ưu tiên
- [Ưu tiên sửa bug trước khi tối ưu UI ]

### 2. UI / UX
- [friendly interface, không thừa hay thiếu thông tin]

### 3. Backend / Logic
- [theo flow work rõ ràng không thừa  hay bỏ trống]

### 4. Code style
- [clean code,OOP, đảm bảo dễ đọc dễ hiểu]

### 5. Test / Verify
- [test sau khi thay đổi điều gì đó]

### 6. Git / Commit / Push
- [đẩy lên git sau khi debug hoặc thay đổi mới]

### 7. Cách giao tiếp
- [ngắn rõ ràng, đi vào điều chính]

