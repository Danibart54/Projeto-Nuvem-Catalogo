export default function ConfirmDialog({ jogo, onConfirm, onCancel }) {
  if (!jogo) return null;
  return (
    <div className="modal-overlay">
      <div className="modal modal-confirm">
        <div className="modal-header">
          <h2>🗑 Confirm Delete</h2>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete <strong>"{jogo.title}"</strong>?</p>
          <p className="confirm-warn">This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={() => onConfirm(jogo.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
