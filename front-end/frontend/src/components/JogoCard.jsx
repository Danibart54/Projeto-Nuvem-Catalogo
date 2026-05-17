export default function JogoCard({ jogo, onEdit, onDelete, onView }) {
  const precoFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(jogo.price);
  const year = jogo.releaseDate ? jogo.releaseDate.substring(0, 4) : '—';

  return (
    <div className="game-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="card-badge">{jogo.genre}</div>
        {jogo.rating && (
          <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 700 }}>
            ⭐ {jogo.rating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="card-platform">{jogo.platform}</div>
      <h3 className="card-title">{jogo.title}</h3>
      <p className="card-dev">{jogo.developer} · {year}</p>
      {jogo.description && (
        <p className="card-desc">
          {jogo.description.substring(0, 90)}{jogo.description.length > 90 ? '...' : ''}
        </p>
      )}
      <div className="card-footer">
        <span className="card-price">{precoFmt}</span>
        <div className="card-actions">
          <button className="btn-icon" title="View details" onClick={() => onView(jogo)}>👁</button>
          <button className="btn-icon" title="Edit" onClick={() => onEdit(jogo)}>✏️</button>
          <button className="btn-icon btn-danger" title="Delete" onClick={() => onDelete(jogo)}>🗑</button>
        </div>
      </div>
    </div>
  );
}
