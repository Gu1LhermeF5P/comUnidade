import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ...

// IMPORTANTE: URL para aceder ao localhost do seu PC a partir do EMULADOR ANDROID
const API_BASE_URL = 'http://10.0.2.2:8080/api'; 
// Se a sua porta no Spring Boot for diferente de 8080, ajuste aqui também.

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
// Interceptor para adicionar o token JWT a cada requisição, se disponível
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken'); // Chave onde você guarda o token JWT
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

// Interceptor para logs de resposta (opcional, mas útil para debug)
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
    // Pode adicionar tratamento global de erros aqui (ex: para erros 401 redirecionar para login)
    // if (error.response && error.response.status === 401) {
    //   // Lógica para deslogar o utilizador ou redirecionar para login
    // }
    return Promise.reject(error);
  }
);

// =============================================================================
// FUNÇÕES DO SERVIÇO DE BOLETINS
// =============================================================================

/**
 * Busca todos os boletins da API (com paginação).
 */
export const getBulletins = async (page = 0, size = 10, sort = 'timestamp,desc') => {
  try {
    // Os parâmetros de paginação são passados como query params
    const response = await apiClient.get('/bulletins', {
      params: {
        page,
        size,
        sort
      }
    });
    // A API Spring Data Pageable retorna os dados dentro de uma propriedade "content"
    // e outras informações de paginação.
    // Ex: response.data = { content: [...], totalPages: ..., totalElements: ... }
    return response.data; // Retorna o objeto Page completo
  } catch (error) {
    console.error('Erro detalhado ao buscar boletins:', error);
    throw error; 
  }
};

/**
 * Busca um boletim específico pelo ID.
 */
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

/**
 * Atualiza um boletim existente.
 */
export const updateBulletin = async (id, bulletinData) => {
  try {
    const response = await apiClient.put(`/bulletins/${id}`, bulletinData);
    return response.data;
  } catch (error) {
    console.error(`Erro detalhado ao atualizar boletim ${id}:`, error);
    throw error;
  }
};

/**
 * Deleta um boletim.
 */
export const deleteBulletin = async (id) => {
  try {
    await apiClient.delete(`/bulletins/${id}`);
    return true; 
  } catch (error) {
    console.error(`Erro detalhado ao deletar boletim ${id}:`, error);
    throw error; 
  }
};