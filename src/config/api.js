// API Configuration
const API_BASE_URL = 'http://localhost:8081/api';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  REGISTER: `${API_BASE_URL}/register`,
  SEND_OTP: `${API_BASE_URL}/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/verify-otp`,
  VERIFY_EMAIL: `${API_BASE_URL}/verify-email`,
  GET_USER: (id) => `${API_BASE_URL}/user/${id}`,
  TEST_EMAIL: `${API_BASE_URL}/test-email`,
  CREATE_PROFILE: `${API_BASE_URL}/create-profile`,
  GET_PROFILE: (userId) => `${API_BASE_URL}/profile/${userId}`,
  UPDATE_PROFILE: (userId) => `${API_BASE_URL}/profile/${userId}`,

  // News Management
  GET_NEWS: `${API_BASE_URL}/news`,
  CREATE_NEWS: `${API_BASE_URL}/news`,
  UPDATE_NEWS: (newsId) => `${API_BASE_URL}/news/${newsId}`,
  DELETE_NEWS: (newsId) => `${API_BASE_URL}/news/${newsId}`
};

// API Helper Functions
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export default API_ENDPOINTS;
