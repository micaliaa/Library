// src/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({ baseURL: API_URL });

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});
