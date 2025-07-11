import axios from './axiosInstance';

interface LoginResponse {
  token: string;
  roleId: number;
  fullName: string;
  roleName: string;
  userId: number;
}

export const login = async (data: { username: string; password: string }) => {
  const response = await axios.post<LoginResponse>('/api/Auth/login', data);
  const { token, roleId, fullName, roleName, userId } = response.data;

  // Lưu thông tin vào localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({
    username: data.username,
    fullName,
    role: roleId,
    roleName,
    userId
  }));

  return response;
};
