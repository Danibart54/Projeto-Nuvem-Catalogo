import { useState } from 'react';
import { useJogos } from './hooks/useJogos';
import JogoCard from './components/JogoCard';
import JogoModal from './components/JogoModal';
import JogoDetalhes from './components/JogoDetalhes';
import ConfirmDialog from './components/ConfirmDialog';
import Report from './components/Report';
import './App.css';

export default function App() {
  const { jogos, loading, error, fetchJogos, criarJogo, atualizarJogo, excluirJogo } = useJogos();
  const [modal, setModal]       = useState(null);
  const [detalhes, setDetalhes] = useState(null);
  const [confirmar, setConfirmar] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [busca, setBusca]       = useState('');
  const [feedback, setFeedback] = useState(null);

  const toast = (msg, tipo = 'success') => {
    setFeedback({ msg, tipo });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSave = async (form) => {
    if (modal && modal.id) {
      await atualizarJogo(modal.id, form);
      toast('Game updated successfully!');
    } else {
      await criarJogo(form);
      toast('Game added successfully!');
    }
    setModal(null);
  };

  const handleDelete = async (id) => {
    await excluirJogo(id);
    setConfirmar(null);
    toast('Game deleted.', 'info');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJogos(busca);
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <div>
              <h1>GameVault</h1>
              <p>Digital Games Catalog</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowReport(true)}>
              📊 Report
            </button>
            <button className="btn btn-primary" onClick={() => setModal({})}>
              + Add Game
            </button>
          </div>
        </div>
      </header>

      {/* ── Search ── */}
      <div className="search-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="🔍 Search by title, genre, developer, platform..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">Search</button>
          {busca && (
            <button type="button" className="btn btn-ghost" onClick={() => { setBusca(''); fetchJogos(); }}>
              Clear
            </button>
          )}
        </form>
        <div className="stats-bar">
          {!loading && `${jogos.length} game${jogos.length !== 1 ? 's' : ''} found`}
        </div>
      </div>

      {/* ── Toast ── */}
      {feedback && <div className={`toast toast-${feedback.tipo}`}>{feedback.msg}</div>}

      {/* ── Content ── */}
      <main className="main-content">
        {loading && (
          <div className="state-center">
            <div className="spinner" />
            <p>Loading games...</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-center state-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={() => fetchJogos()}>Retry</button>
          </div>
        )}

        {!loading && !error && jogos.length === 0 && (
          <div className="state-center state-empty">
            <span>🎲</span>
            <p>No games in the catalog yet.</p>
            <button className="btn btn-primary" onClick={() => setModal({})}>Add first game</button>
          </div>
        )}

        {!loading && !error && jogos.length > 0 && (
          <div className="games-grid">
            {jogos.map(jogo => (
              <JogoCard
                key={jogo.id}
                jogo={jogo}
                onView={setDetalhes}
                onEdit={setModal}
                onDelete={setConfirmar}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {modal !== null && (
        <JogoModal
          jogo={modal && modal.id ? modal : null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {detalhes && (
        <JogoDetalhes
          jogo={detalhes}
          onClose={() => setDetalhes(null)}
          onEdit={setModal}
        />
      )}
      {confirmar && (
        <ConfirmDialog
          jogo={confirmar}
          onConfirm={handleDelete}
          onCancel={() => setConfirmar(null)}
        />
      )}
      {showReport && (
        <Report onClose={() => setShowReport(false)} />
      )}
    </div>
  );
}
