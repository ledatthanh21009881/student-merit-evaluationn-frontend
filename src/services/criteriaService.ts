// src/services/criteriaService.ts
import axiosInstance from './axiosInstance';

export type CriteriaType = string; // Giờ không dùng enum cứng nữa

export interface CriteriaRequest {
  criteriaName: string;
  description?: string;
  maxScore: number;
  level: number;
  isStudentScored: boolean;
  isAdminScored: boolean;
  isUploadOnly: boolean;
  isActive: boolean;
  criteriaTypeID: number;
  parentID?: number | null;
}

export interface CriteriaResponse {
  criteriaID: number;
  criteriaName: string;
  description?: string;
  maxScore: number;
  parentID?: number | null;
  criteriaTypeName: string;
  isStudentScored?: boolean;
  isAdminScored?: boolean;
  isUploadOnly?: boolean;
  isActive?: boolean;
  level?: number;
  children?: CriteriaResponse[];
}

export interface CriteriaTypeItem {
  criteriaTypeID: number;
  criteriaTypeName: string;
}

const API_PATH = '/api/criteria';
const TYPE_PATH = '/api/criteriatype';

export const getAllCriteria = async (): Promise<CriteriaResponse[]> => {
  const res = await axiosInstance.get<CriteriaResponse[]>(`${API_PATH}/all`);
  return res.data;
};

export const getCriteriaById = async (id: number): Promise<CriteriaResponse> => {
  const res = await axiosInstance.get<CriteriaResponse>(`${API_PATH}/${id}`);
  return res.data;
};

export const createCriteria = async (data: CriteriaRequest): Promise<any> => {
  const res = await axiosInstance.post(`${API_PATH}/create`, data);
  return res.data;
};

export const updateCriteria = async (id: number, data: CriteriaRequest): Promise<any> => {
  const res = await axiosInstance.put(`${API_PATH}/update/${id}`, data);
  return res.data;
};

export const deleteCriteria = async (id: number): Promise<any> => {
  const res = await axiosInstance.delete(`${API_PATH}/delete/${id}`);
  return res.data;
};

export const getAllCriteriaTypes = async (): Promise<CriteriaTypeItem[]> => {
  const res = await axiosInstance.get<CriteriaTypeItem[]>(`${TYPE_PATH}/all`);
  return res.data;
};
