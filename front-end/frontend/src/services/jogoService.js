import axios from 'axios';

// Em produção AWS, troque pela URL do API Gateway
// Ex: https://xxxxxxx.execute-api.us-east-1.amazonaws.com/prod
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

const gameService = {
  listarTodos: (search = '')      => api.get('/games', { params: search ? { search } : {} }),
  buscarPorId: (id)               => api.get(`/games/${id}`),
  criar:       (game)             => api.post('/games', game),
  atualizar:   (id, game)         => api.put(`/games/${id}`, game),
  excluir:     (id)               => api.delete(`/games/${id}`),
  getReport:   ()                 => api.get('/games/report'),
};

export default gameService;
