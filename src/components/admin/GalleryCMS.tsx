import React, { useState } from 'react';
import { ImageIcon, Plus, Edit3, Trash2, Save, XCircle } from 'lucide-react';
import { useGallery } from '../../context/GalleryContext';
import type { GalleryItem } from '../../types';

export const GalleryCMS: React.FC = () => {
  const { galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useGallery();
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const initialFormState: GalleryItem = {
    id: '',
    title: '',
    category: 'Jet Ski',
    image_url: '',
    location: ''
  };

  const [form, setForm] = useState<GalleryItem>(initialFormState);

  const handleEdit = (item: GalleryItem) => {
    setForm(item);
    setEditingItem(item);
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setForm({ ...initialFormState, id: 'g-' + Date.now() });
    setIsAdding(true);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingItem(null);
    setForm(initialFormState);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) {
      addGalleryItem(form);
    } else if (editingItem) {
      updateGalleryItem(form);
    }
    handleCancel();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this image from the gallery?')) {
      deleteGalleryItem(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-extrabold text-2xl text-[#0D2137] flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-[#C8820A]" />
          <span>Gallery Content Management System</span>
        </h3>
        {!isAdding && !editingItem && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A5C52] text-white text-sm font-bold shadow-sm hover:bg-[#0D2137] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Image</span>
          </button>
        )}
      </div>

      {(isAdding || editingItem) && (
        <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 shadow-sm mb-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display font-bold text-lg text-[#0D2137]">
              {isAdding ? 'Upload New Image' : 'Edit Image Details'}
            </h4>
            <button onClick={handleCancel} className="text-[#64748B] hover:text-rose-600">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0D2137] uppercase">Image Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A5C52]"
                  placeholder="e.g. Sunset Jet Ski Tour"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0D2137] uppercase">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A5C52]"
                >
                  <option value="Jet Ski">Jet Ski</option>
                  <option value="Speedboat">Speedboat</option>
                  <option value="Islands">Islands</option>
                  <option value="Fishing">Fishing</option>
                  <option value="Snorkeling">Snorkeling</option>
                  <option value="Sunset">Sunset</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-[#0D2137] uppercase">Image URL (CDN / Supabase Storage)</label>
                <input
                  type="url"
                  required
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A5C52]"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-[#0D2137] uppercase">Location Text</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1A5C52]"
                  placeholder="e.g. Koh Tao Reef"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#E8704A] hover:bg-[#D45F3C] text-white font-bold rounded-xl shadow-md transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Image</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryItems.map((item) => (
          <div key={item.id} className="group relative rounded-2xl overflow-hidden shadow-card border border-slate-200 bg-white">
            <div className="aspect-square bg-slate-100 overflow-hidden relative">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-bold uppercase tracking-wider">
                {item.category}
              </div>
            </div>
            <div className="p-3">
              <h5 className="text-xs font-bold text-[#0D2137] line-clamp-1">{item.title}</h5>
              <p className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">{item.location}</p>
            </div>
            
            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 rounded-full bg-white text-[#1A5C52] hover:bg-[#1A5C52] hover:text-white transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-full bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
