import axiosInstance from './axiosInstance';
import { CriteriaResponse } from './criteriaService';

export interface TimelineRequest {
  stepName: string;
  roleTarget: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CriteriaFormRequest {
  formName: string;
  academicYearStart: number;
  semester: string;
  description: string;
  startDate: string;
  endDate: string;
  formType: string;
  isActive: boolean;
  selectedCriteriaIds: number[];
  timelines: TimelineRequest[];
}

export interface CriteriaFormResponse extends CriteriaFormRequest {
  criteriaFormID: number;
  selectedCriteria?: CriteriaResponse[];
}

const API_PATH = '/api/criteriaform';

export const getAllCriteriaForms = async (): Promise<CriteriaFormResponse[]> => {
  const res = await axiosInstance.get<CriteriaFormResponse[]>(`${API_PATH}/all`);
  return res.data;
};

export const getCriteriaFormById = async (id: number): Promise<CriteriaFormResponse> => {
  const res = await axiosInstance.get<CriteriaFormResponse>(`${API_PATH}/${id}`);
  return res.data;
};

export const createCriteriaForm = async (data: CriteriaFormRequest): Promise<any> => {
  const res = await axiosInstance.post(`${API_PATH}/create`, data);
  return res.data;
};

export const updateCriteriaForm = async (id: number, data: CriteriaFormRequest): Promise<any> => {
  const res = await axiosInstance.put(`${API_PATH}/update/${id}`, data);
  return res.data;
};

export const deleteCriteriaForm = async (id: number): Promise<any> => {
  try {
    const res = await axiosInstance.delete(`${API_PATH}/${id}`); // Sửa endpoint thành ${id}
    console.log('Phản hồi từ server khi xóa:', res.data); // Debug
    return res.data;
  } catch (error: any) {
    console.error('Lỗi khi xóa biểu mẫu:', error.response?.data || error.message);
    throw error; // Ném lỗi để xử lý ở phía client
  }
};