import axios from "axios";

const API_BASE = "https://pulse-technology-server.vercel.app";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    userId: string;
    name: string;
    email?: string;
    role: string;
    image?: string | { uri: string; name?: string; type?: string };
  };
}

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post(`${API_BASE}/api/auth/login`, data);
  return response.data;
};

interface RegisterData {
  email: string;
  password: string;
}

export const signupUser = async (data: RegisterData) => {
  const response = await axios.post(`${API_BASE}/api/auth/register`, data);
  return response.data;
};
