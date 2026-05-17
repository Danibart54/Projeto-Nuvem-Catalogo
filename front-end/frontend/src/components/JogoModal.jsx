import { useState, useRef } from 'react';

const GENEROS = ['Action','Action-Adventure','Action RPG','Adventure','RPG','Strategy','FPS','Sports','Puzzle','Horror','Simulation','Fighting','Platform','Roguelike','MMORPG'];
const PLATAFORMAS = ['PC','PlayStation 5','PlayStation 4','Xbox Series X','Xbox One','Nintendo Switch','Mobile','Multi-platform'];

const EMPTY = {
  title: '', 
  genre: '', 
  platform: '', 
  developer: '', 
  publisher: '',
  releaseDate: `${new Date().getFullYear()}-01-01`, 
  price: '', 
  rating: '', 
  description: '',
  coverImageUrl: '', 
  isAvailable: true,
};

export default function JogoModal({ jogo, onSave, onClose }) {
  // Usar useRef para valores iniciais - NÃO re-renderiza quando jogo muda
  const initialValues = useRef(jogo && jogo.id ? {
    ...EMPTY, 
    ...jogo,
    releaseDate: jogo.releaseDate || EMPTY.releaseDate,
    rating: jogo.rating ?? '',
    price: jogo.price ?? '',
  } : EMPTY);

  const [form, setForm] = useState(initialValues.current);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Handler otimizado - evita re-renders desnecessários
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setForm(prev => ({ ...prev, [name]: newValue }));
    
    // Limpar erro do campo quando usuário digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title?.trim()) e.title = 'Title is required';
    if (!form.genre) e.genre = 'Genre is required';
    if (!form.platform) e.platform = 'Platform is required';
    if (!form.developer?.trim()) e.developer = 'Developer is required';
    if (!form.publisher?.trim()) e.publisher = 'Publisher is required';
    if (!form.releaseDate) e.releaseDate = 'Release date is required';
    
    const price = parseFloat(form.price);
    if (!form.price || isNaN(price) || price < 0) {
      e.price = 'Valid price required (must be >= 0)';
    }
    
    const rating = parseFloat(form.rating);
    if (form.rating !== '' && (isNaN(rating) || rating < 0 || rating > 10)) {
      e.rating = 'Rating must be between 0 and 10';
    }
    
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { 
      setErrors(errs); 
      return; 
    }
    
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: parseFloat(form.price),
        rating: form.rating !== '' ? parseFloat(form.rating) : null,
      });
    } catch (err) {
      const msg = err.response?.data?.error || 'Error saving game';
      const fields = err.response?.data?.fields || {};
      setErrors({ _global: msg, ...fields });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{jogo?.id ? '✏️ Edit Game' : '🎮 New Game'}</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        
        <div className="modal-body">
          {errors._global && <div className="alert-error">{errors._global}</div>}
          
          <div className="form-grid">
            {/* Title */}
            <div className="field full-width">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Elden Ring"
                className={errors.title ? 'error' : ''}
                autoFocus
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            {/* Developer */}
            <div className="field">
              <label htmlFor="developer">Developer *</label>
              <input
                id="developer"
                type="text"
                name="developer"
                value={form.developer}
                onChange={handleChange}
                placeholder="e.g. FromSoftware"
                className={errors.developer ? 'error' : ''}
              />
              {errors.developer && <span className="field-error">{errors.developer}</span>}
            </div>

            {/* Publisher */}
            <div className="field">
              <label htmlFor="publisher">Publisher *</label>
              <input
                id="publisher"
                type="text"
                name="publisher"
                value={form.publisher}
                onChange={handleChange}
                placeholder="e.g. Bandai Namco"
                className={errors.publisher ? 'error' : ''}
              />
              {errors.publisher && <span className="field-error">{errors.publisher}</span>}
            </div>

            {/* Genre */}
            <div className="field">
              <label htmlFor="genre">Genre *</label>
              <select
                id="genre"
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className={errors.genre ? 'error' : ''}
              >
                <option value="">Select genre...</option>
                {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.genre && <span className="field-error">{errors.genre}</span>}
            </div>

            {/* Platform */}
            <div className="field">
              <label htmlFor="platform">Platform *</label>
              <select
                id="platform"
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className={errors.platform ? 'error' : ''}
              >
                <option value="">Select platform...</option>
                {PLATAFORMAS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.platform && <span className="field-error">{errors.platform}</span>}
            </div>

            {/* Release Date */}
            <div className="field">
              <label htmlFor="releaseDate">Release Date *</label>
              <input
                id="releaseDate"
                type="date"
                name="releaseDate"
                value={form.releaseDate}
                onChange={handleChange}
                className={errors.releaseDate ? 'error' : ''}
              />
              {errors.releaseDate && <span className="field-error">{errors.releaseDate}</span>}
            </div>

            {/* Price */}
            <div className="field">
              <label htmlFor="price">Price (R$) *</label>
              <input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="149.99"
                min="0"
                step="0.01"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>

            {/* Rating */}
            <div className="field">
              <label htmlFor="rating">Rating (0–10)</label>
              <input
                id="rating"
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="9.0 (optional)"
                min="0"
                max="10"
                step="0.1"
                className={errors.rating ? 'error' : ''}
              />
              {errors.rating && <span className="field-error">{errors.rating}</span>}
            </div>

            {/* Cover Image URL */}
            <div className="field full-width">
              <label htmlFor="coverImageUrl">Cover Image URL</label>
              <input
                id="coverImageUrl"
                type="url"
                name="coverImageUrl"
                value={form.coverImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg (optional)"
              />
            </div>

            {/* Description */}
            <div className="field full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the game... (optional)"
              />
            </div>

            {/* Available Checkbox */}
            <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
                id="available"
                style={{ width: 'auto', margin: 0 }}
              />
              <label htmlFor="available" style={{ textTransform: 'none', fontSize: '0.88rem', cursor: 'pointer', margin: 0 }}>
                Available for purchase
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : (jogo?.id ? 'Save Changes' : 'Add Game')}
          </button>
        </div>
      </div>
    </div>
  );
}
