# Capstone Project - Authentication System

Dự án này là một hệ thống authentication hoàn chỉnh được xây dựng với React, Redux Toolkit, và React Router.

## Tính năng chính

### 🔐 Authentication

- **Login**: Đăng nhập với email và password
- **Register**: Đăng ký tài khoản mới
- **Forgot Password**: Gửi email reset password
- **Reset Password**: Đặt lại mật khẩu với token
- **Protected Routes**: Bảo vệ các route yêu cầu authentication
- **Token Management**: Quản lý access token và refresh token

### 🎨 UI/UX

- Responsive design với Tailwind CSS
- Form validation real-time
- Loading states và error handling
- Success messages và user feedback
- Modern và clean interface

### 🚀 State Management

- Redux Toolkit cho state management
- Async thunks cho API calls
- Optimized re-renders
- Persistent authentication state

## Cấu trúc dự án

```
src/
├── app/
│   └── store.js                 # Redux store configuration
├── config/
│   └── api.js                   # API endpoints và configuration
├── features/
│   ├── auth/
│   │   ├── authService.js       # Authentication service functions
│   │   ├── authSlice.js         # Redux slice cho auth
│   │   └── components/
│   │       ├── Login.jsx        # Login component
│   │       ├── Register.jsx     # Register component
│   │       ├── ForgotPassword.jsx # Forgot password component
│   │       └── ResetPassword.jsx # Reset password component
│   └── dashboard/
│       ├── dashboardSlice.js    # Dashboard state management
│       └── components/
│           └── Dashboard.jsx    # Dashboard component
├── routes/
│   ├── AppRouter.jsx            # Main router configuration
│   └── ProtectedRoute.jsx       # Route protection component
├── utils/
│   └── helpers.js               # Utility functions
├── App.js                       # Main App component
└── index.js                     # Entry point
```

## Cài đặt và chạy dự án

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình environment variables

Tạo file `.env` trong thư mục gốc:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Chạy dự án

```bash
npm start
```

Dự án sẽ chạy tại `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/forgot-password` - Gửi email reset password
- `POST /api/auth/reset-password` - Đặt lại mật khẩu
- `POST /api/auth/verify-token` - Xác thực token
- `POST /api/auth/refresh-token` - Làm mới token
- `POST /api/auth/logout` - Đăng xuất

### User

- `GET /api/user/profile` - Lấy thông tin user
- `PUT /api/user/profile` - Cập nhật thông tin user

## Cách sử dụng

### 1. Đăng ký tài khoản

- Truy cập `/register`
- Điền thông tin cá nhân
- Tạo mật khẩu mạnh (ít nhất 6 ký tự, có chữ hoa, chữ thường và số)
- Xác nhận mật khẩu

### 2. Đăng nhập

- Truy cập `/login`
- Nhập email và mật khẩu
- Hệ thống sẽ tự động chuyển hướng đến dashboard

### 3. Quên mật khẩu

- Truy cập `/forgot-password`
- Nhập email đã đăng ký
- Kiểm tra email để lấy link reset password
- Click vào link và đặt mật khẩu mới

### 4. Đăng xuất

- Từ dashboard, click vào nút logout
- Hệ thống sẽ xóa token và chuyển hướng về trang login

## Tính năng bảo mật

- **Password Validation**: Mật khẩu phải đáp ứng các yêu cầu về độ mạnh
- **Token-based Authentication**: Sử dụng JWT tokens
- **Protected Routes**: Tự động chuyển hướng nếu chưa đăng nhập
- **Form Validation**: Validation real-time trên client-side
- **Error Handling**: Xử lý lỗi một cách graceful

## Customization

### Thay đổi API endpoints

Chỉnh sửa file `src/config/api.js`:

```javascript
const API_BASE_URL = "https://your-api-domain.com/api";
```

### Thay đổi UI theme

Chỉnh sửa các class Tailwind CSS trong các component hoặc tạo custom CSS variables.

### Thêm validation rules

Chỉnh sửa các function validation trong các component.

## Troubleshooting

### Lỗi thường gặp

1. **API connection failed**

   - Kiểm tra `REACT_APP_API_URL` trong file `.env`
   - Đảm bảo backend server đang chạy

2. **Token expired**

   - Hệ thống sẽ tự động refresh token
   - Nếu refresh thất bại, user sẽ được chuyển về trang login

3. **Form validation errors**
   - Kiểm tra các yêu cầu về format email và password
   - Đảm bảo tất cả các field required đã được điền

## Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trong repository hoặc liên hệ trực tiếp.

