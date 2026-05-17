import { useState, useEffect } from 'react';
import axios from 'axios';

const REPORT_URL = 'https://y18j9igaig.execute-api.us-east-1.amazonaws.com/report';

export default function Report({ onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(REPORT_URL)
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (!data && loading) return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>📊 Games Report</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '1rem' }}>Loading report...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>📊 Games Report</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="alert-error">Error loading report: {error}</div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );

  const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>📊 Catalog Report</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Summary */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>📈 Summary</h3>
            <div className="detail-grid">
              <div className="detail-item"><span>Total Games</span><strong>{data.totalGames}</strong></div>
              <div className="detail-item"><span>Available</span><strong style={{ color: 'var(--success)' }}>{data.availableGames}</strong></div>
              <div className="detail-item"><span>Average Price</span><strong className="price-big">{fmt(data.averagePrice)}</strong></div>
              <div className="detail-item"><span>Average Rating</span><strong style={{ color: 'var(--warning)' }}>⭐ {data.averageRating}</strong></div>
              <div className="detail-item"><span>Total Value</span><strong className="price-big">{fmt(data.totalCatalogValue)}</strong></div>
            </div>
          </div>

          {/* By Genre */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>🎮 By Genre</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              {Object.entries(data.gamesByGenre).map(([genre, count]) => (
                <div key={genre} className="detail-item" style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>{count}</strong>
                  <span style={{ display: 'block', marginTop: '0.25rem' }}>{genre}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Platform */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>🖥️ By Platform</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
              {Object.entries(data.gamesByPlatform).map(([platform, count]) => (
                <div key={platform} className="detail-item" style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>{count}</strong>
                  <span style={{ display: 'block', marginTop: '0.25rem' }}>{platform}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Games */}
          <div className="detail-grid">
            <div className="detail-desc">
              <span>💰 Most Expensive</span>
              <p><strong>{data.mostExpensiveGame.title}</strong></p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {data.mostExpensiveGame.platform} · {fmt(data.mostExpensiveGame.price)}
              </p>
            </div>
            <div className="detail-desc">
              <span>⭐ Top Rated</span>
              <p><strong>{data.topRatedGame.title}</strong></p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {data.topRatedGame.platform} · {data.topRatedGame.rating}/10
              </p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
