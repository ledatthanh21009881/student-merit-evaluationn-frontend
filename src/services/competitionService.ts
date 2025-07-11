import axios from './axiosInstance';

const API_URL = '/Campaign';  // ⚠ Giữ nguyên nếu BE đã có

export const CompetitionService = {
    getAll: () => axios.get(API_URL),
    getById: (id: number) => axios.get(`${API_URL}/${id}`),
    filterBySemester: (semester: string) => axios.get(`${API_URL}/filter?semester=${semester}`),
    create: (data: any) => axios.post(API_URL, data),
    update: (id: number, data: any) => axios.put(`${API_URL}/${id}`, data),
    delete: (id: number) => axios.delete(`${API_URL}/${id}`),
};
