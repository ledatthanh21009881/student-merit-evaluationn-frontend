import axiosInstance from './axiosInstance';

// DTO nhận về từ backend
export interface CriteriaTypeResponse {
  criteriaTypeID: number;
  criteriaTypeName: string;
}

// DTO gửi đi
export interface CriteriaTypeRequest {
  criteriaTypeName: string;
}

const API_PATH = '/api/criteriatype';

// GET all
export const getAllCriteriaTypes = async (): Promise<CriteriaTypeResponse[]> => {
  const res = await axiosInstance.get<CriteriaTypeResponse[]>(`${API_PATH}/all`);
  return res.data;
};

// GET by ID
export const getCriteriaTypeById = async (id: number): Promise<CriteriaTypeResponse> => {
  const res = await axiosInstance.get<CriteriaTypeResponse>(`${API_PATH}/${id}`);
  return res.data;
};

// POST create
export const createCriteriaType = async (data: CriteriaTypeRequest): Promise<any> => {
  const res = await axiosInstance.post(`${API_PATH}/create`, data);
  return res.data;
};

// PUT update
export const updateCriteriaType = async (id: number, data: CriteriaTypeRequest): Promise<any> => {
  const res = await axiosInstance.put(`${API_PATH}/update/${id}`, data);
  return res.data;
};

// DELETE
export const deleteCriteriaType = async (id: number): Promise<any> => {
  console.log('🛰️ Thực hiện DELETE gọi backend với ID:', id); // ⬅️ thêm log
  const res = await axiosInstance.delete(`${API_PATH}/delete/${id}`);
  console.log('✅ Phản hồi xoá:', res);
  return res.data;
};