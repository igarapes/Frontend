import { api } from "./api";

export const loginService = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
}