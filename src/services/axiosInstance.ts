import axios from 'axios';

// Khởi tạo instance
const axiosInstance = axios.create({
  baseURL: 'https://localhost:7166', // Dùng http để tránh lỗi SSL khi dev
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // Không gửi cookie, chỉ dùng Bearer token
});

// Gắn token vào header nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Lỗi 401: Không được phép');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
