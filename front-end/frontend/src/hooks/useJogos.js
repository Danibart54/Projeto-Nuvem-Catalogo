import { useState, useEffect, useCallback } from 'react';
import gameService from '../services/jogoService';

export function useJogos() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJogos = useCallback(async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await gameService.listarTodos(search);
      setJogos(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar jogos. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJogos(); }, [fetchJogos]);

  const criarJogo = async (game) => {
    const { data } = await gameService.criar(game);
    setJogos(prev => [...prev, data]);
    return data;
  };

  const atualizarJogo = async (id, game) => {
    const { data } = await gameService.atualizar(id, game);
    setJogos(prev => prev.map(j => j.id === id ? data : j));
    return data;
  };

  const excluirJogo = async (id) => {
    await gameService.excluir(id);
    setJogos(prev => prev.filter(j => j.id !== id));
  };

  return { jogos, loading, error, fetchJogos, criarJogo, atualizarJogo, excluirJogo };
}
