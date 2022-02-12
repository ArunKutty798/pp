import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:5000" });
const API = axios.create({ baseURL: "http://54.167.27.82:5000" });

export const signInApi = (formData: any) => API.post("/auth/signin", formData);
export const signUpApi = (formData: any) => API.post("/auth/signup", formData);

export const getUserApi = (id: any) => API.get(`/auth/${id}`);
