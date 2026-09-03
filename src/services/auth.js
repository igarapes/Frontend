import { api } from "./api";

export const loginService = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
}

export const updatePasswordService = async (newPassword, confirmPassword) => {
  const response = await api.patch('/auth/updatePassword', {
    newPassword,
    confirmPassword,
  });
  return response.data;
};