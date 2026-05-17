export default function JogoDetalhes({ jogo, onClose, onEdit }) {
  if (!jogo) return null;
  const precoFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(jogo.price);
  const year = jogo.releaseDate ? jogo.releaseDate.substring(0, 4) : '—';

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-detail">
        <div className="modal-header">
          <h2>🎮 {jogo.title}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item"><span>Genre</span><strong>{jogo.genre}</strong></div>
            <div className="detail-item"><span>Platform</span><strong>{jogo.platform}</strong></div>
            <div className="detail-item"><span>Developer</span><strong>{jogo.developer}</strong></div>
            <div className="detail-item"><span>Publisher</span><strong>{jogo.publisher}</strong></div>
            <div className="detail-item"><span>Release Year</span><strong>{year}</strong></div>
            <div className="detail-item"><span>Rating</span><strong>{jogo.rating ? `⭐ ${jogo.rating}/10` : '—'}</strong></div>
            <div className="detail-item"><span>Price</span><strong className="price-big">{precoFmt}</strong></div>
            <div className="detail-item"><span>Available</span><strong>{jogo.isAvailable ? '✅ Yes' : '❌ No'}</strong></div>
          </div>
          {jogo.description && (
            <div className="detail-desc">
              <span>Description</span>
              <p>{jogo.description}</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => { onClose(); onEdit(jogo); }}>Edit</button>
        </div>
      </div>
    </div>
  );
}
