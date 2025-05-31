// src/services/bulletinService.js
import axios from 'axios';

// IMPORTANTE: Substitua pela URL base da sua API Java/.NET
const API_BASE_URL = 'https://sua-api-aqui.com/api'; // Exemplo: http://localhost:8080/api ou https://seuapp.azurewebsites.net/api

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Poderia adicionar headers de autenticação aqui se necessário
    // 'Authorization': `Bearer SEU_TOKEN_JWT`,
  },
  // Timeout para as requisições (ex: 10 segundos)
  // timeout: 10000,
});

/**
 * Busca todos os boletins da API.
 * @async
 * @returns {Promise<Array|null>} Uma promessa que resolve para um array de boletins ou null em caso de erro.
 */
export const getBulletins = async () => {
  try {
    console.log('Buscando boletins de:', `${API_BASE_URL}/bulletins`);
    const response = await apiClient.get('/bulletins'); // Ex: endpoint GET /bulletins
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar boletins:', error.response ? error.response.data : error.message);
    // Para um tratamento de erro mais robusto na UI, podemos relançar o erro
    // ou retornar um objeto de erro específico.
    throw error; // Relança o erro para ser tratado na tela
  }
};

/**
 * Busca um boletim específico pelo ID.
 * @async
 * @param {string|number} id - O ID do boletim.
 * @returns {Promise<object|null>} Uma promessa que resolve para o objeto do boletim ou null.
 */
export const getBulletinById = async (id) => {
  try {
    console.log('Buscando boletim por ID:', `${API_BASE_URL}/bulletins/${id}`);
    const response = await apiClient.get(`/bulletins/${id}`); // Ex: endpoint GET /bulletins/{id}
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar boletim ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};


/**
 * Cria um novo boletim.
 * @async
 * @param {object} bulletinData - Os dados do boletim a ser criado.
 * Ex: { title: 'Título', content: 'Conteúdo detalhado', location: 'Local', severity: 'Alerta', sender: 'Nome do Remetente' }
 * Ajuste os campos conforme a sua API espera.
 * @returns {Promise<object|null>} Uma promessa que resolve para o boletim criado ou null em caso de erro.
 */
export const createBulletin = async (bulletinData) => {
  try {
    console.log('Criando boletim em:', `${API_BASE_URL}/bulletins`, bulletinData);
    const response = await apiClient.post('/bulletins', bulletinData); // Ex: endpoint POST /bulletins
    return response.data;
  } catch (error) {
    console.error('Erro ao criar boletim:', error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Atualiza um boletim existente.
 * @async
 * @param {string|number} id - O ID do boletim a ser atualizado.
 * @param {object} bulletinData - Os dados atualizados do boletim.
 * @returns {Promise<object|null>} Uma promessa que resolve para o boletim atualizado ou null em caso de erro.
 */
export const updateBulletin = async (id, bulletinData) => {
  try {
    console.log('Atualizando boletim em:', `${API_BASE_URL}/bulletins/${id}`, bulletinData);
    const response = await apiClient.put(`/bulletins/${id}`, bulletinData); // Ex: endpoint PUT /bulletins/{id}
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar boletim ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Deleta um boletim.
 * @async
 * @param {string|number} id - O ID do boletim a ser deletado.
 * @returns {Promise<boolean>} Uma promessa que resolve para true se bem-sucedido, false caso contrário.
 */
export const deleteBulletin = async (id) => {
  try {
    console.log('Deletando boletim em:', `${API_BASE_URL}/bulletins/${id}`);
    await apiClient.delete(`/bulletins/${id}`); // Ex: endpoint DELETE /bulletins/{id}
    return true; // Sucesso
  } catch (error) {
    console.error(`Erro ao deletar boletim ${id}:`, error.response ? error.response.data : error.message);
    throw error; // Ou return false;
  }
};
