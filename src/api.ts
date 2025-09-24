import axios from 'axios';
import { Client, Case, LegalText } from './types';

const API_BASE = 'http://localhost:3001/api';

// Client API
export const getClients = async (): Promise<Client[]> => {
  const response = await axios.get(`${API_BASE}/clients`);
  return response.data;
};

export const createClient = async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
  const response = await axios.post(`${API_BASE}/clients`, client);
  return response.data;
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  const response = await axios.put(`${API_BASE}/clients/${id}`, client);
  return response.data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/clients/${id}`);
};

// Case API
export const getCases = async (): Promise<Case[]> => {
  const response = await axios.get(`${API_BASE}/cases`);
  return response.data;
};

export const createCase = async (caseItem: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> => {
  const response = await axios.post(`${API_BASE}/cases`, caseItem);
  return response.data;
};

export const updateCase = async (id: string, caseItem: Partial<Case>): Promise<Case> => {
  const response = await axios.put(`${API_BASE}/cases/${id}`, caseItem);
  return response.data;
};

export const deleteCase = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/cases/${id}`);
};

// Legal Texts API
export const getLegalTexts = async (): Promise<LegalText[]> => {
  const response = await axios.get(`${API_BASE}/legal-texts`);
  return response.data;
};

export const createLegalText = async (legalText: Omit<LegalText, 'id' | 'createdAt' | 'updatedAt'>): Promise<LegalText> => {
  const response = await axios.post(`${API_BASE}/legal-texts`, legalText);
  return response.data;
};

export const updateLegalText = async (id: string, legalText: Partial<LegalText>): Promise<LegalText> => {
  const response = await axios.put(`${API_BASE}/legal-texts/${id}`, legalText);
  return response.data;
};

export const deleteLegalText = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/legal-texts/${id}`);
};