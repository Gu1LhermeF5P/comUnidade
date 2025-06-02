import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const API_BASE_URL = 'http://10.0.2.2:8080/api'; 


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('A iniciar requisição para:', config.url, config.method, config.data);
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida de:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error(
      'Erro na resposta da API:', 
      error.config?.url, 
      error.response?.status, 
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export const getBulletins = async (page = 0, size = 10, sort = 'timestamp,desc') => {
  try {
   
    const response = await apiClient.get('/bulletins', {
      params: {
        page,
        size,
        sort
      }
    });

    return response.data; 
  } catch (error) {
    console.error('Erro detalhado ao buscar boletins:', error);
    throw error; 
  }
};

export const getBulletinById = async (id) => {
  try {
    const response = await apiClient.get(`/bulletins/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro detalhado ao buscar boletim ${id}:`, error);
    throw error;
  }
};

/**
 * Cria um novo boletim.
 * O campo 'sender' (ou 'username') será determinado pelo backend a partir do token JWT.
 * O 'timestamp' também pode ser gerado pelo backend.
 * @param {object} bulletinData - Ex: { title: "string", location: "string", content: "string", severity: "string" }
 */
export const createBulletin = async (bulletinData) => {
  try {
    const response = await apiClient.post('/bulletins', bulletinData);
    return response.data; 
  } catch (error) {
    console.error('Erro detalhado ao criar boletim:', error);
    throw error;
  }
};


export const updateBulletin = async (id, bulletinData) => {
  try {
    const response = await apiClient.put(`/bulletins/${id}`, bulletinData);
    return response.data;
  } catch (error) {
    console.error(`Erro detalhado ao atualizar boletim ${id}:`, error);
    throw error;
  }
};


export const deleteBulletin = async (id) => {
  try {
    await apiClient.delete(`/bulletins/${id}`);
    return true; 
  } catch (error) {
    console.error(`Erro detalhado ao deletar boletim ${id}:`, error);
    throw error; 
  }
};