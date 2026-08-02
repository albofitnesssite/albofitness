import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { Trash2, Upload } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = 'n5k5jptm';
const CLOUDINARY_UPLOAD_PRESET = 'albofitness';
const empty = { client_name: '', before_image_url: '', after_image_url: '', duration: '', result_text: '' };

export default function TransformationManagement() {
  const [form, setForm] = useState(empty);
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from('transformations').select('*').order('created_at', { ascending: false });
    if (error) return console.error(error.message);
    setItems(data || []);
  };

  useEffect(() => { load(); }, []);

  const upload = async (file, field) => {
    if (!file) return;
    setUploading(field);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body });
      const data = await response.json();
      if (!data.secure_url) throw new Error(data.error?.message || 'Upload failed');
      setForm(prev => ({ ...prev, [field]: data.secure_url }));
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading('');
    }
  };

  const add = async () => {
    if (!form.before_image_url || !form.after_image_url) return alert('Upload both BEFORE and AFTER photos.');
    setSaving(true);
    const { error } = await supabase.from('transformations').insert([{
      ...form,
      client_name: form.client_name.trim() || 'ALBO Client',
    }]);
    setSaving(false);
    if (error) return alert(error.message);
    setForm(empty);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this transformation?')) return;
    const { error } = await supabase.from('transformations').delete().eq('id', id);
    if (error) return alert(error.message);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="border border-gray-800 bg-[#0B0B0B] p-6">
        <h2 className="mb-2 text-2xl font-black uppercase text-[#E85D2A]">Add Client Transformation</h2>
        <p className="mb-6 text-sm text-gray-500">Upload before and after images here. These photos do not appear in member reviews.</p>

        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} placeholder="Client name (optional)" className="border border-gray-700 bg-[#111] p-3 text-white focus:border-[#E85D2A] focus:outline-none" />
          <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration e.g. 12 Weeks" className="border border-gray-700 bg-[#111] p-3 text-white focus:border-[#E85D2A] focus:outline-none" />
        </div>

        <input value={form.result_text} onChange={(e) => setForm({ ...form, result_text: e.target.value })} placeholder="Short result e.g. Fat loss + strength gain" className="mt-4 w-full border border-gray-700 bg-[#111] p-3 text-white focus:border-[#E85D2A] focus:outline-none" />

        <div className="mt-5 grid grid-cols-2 gap-4">
          <UploadBox label="Before" field="before_image_url" url={form.before_image_url} busy={uploading === 'before_image_url'} onUpload={upload} />
          <UploadBox label="After" field="after_image_url" url={form.after_image_url} busy={uploading === 'after_image_url'} onUpload={upload} />
        </div>

        <button onClick={add} disabled={saving || uploading} className="mt-5 w-full bg-[#E85D2A] py-3 font-black uppercase text-white hover:bg-[#C9471B] disabled:opacity-50">
          {saving ? 'Saving...' : 'Publish Transformation'}
        </button>
      </div>

      <div>
        <h2 className="mb-5 text-2xl font-black uppercase text-white">Published Transformations ({items.length})</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map(item => (
            <article key={item.id} className="border border-gray-800 bg-[#0B0B0B]">
              <div className="grid grid-cols-2">
                <img src={item.before_image_url} alt="Before" className="aspect-[3/4] w-full object-cover" />
                <img src={item.after_image_url} alt="After" className="aspect-[3/4] w-full object-cover" />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-black uppercase text-white">{item.client_name}</p>
                  <p className="text-sm text-gray-500">{item.duration} {item.result_text && `· ${item.result_text}`}</p>
                </div>
                <button onClick={() => remove(item.id)} className="text-red-500"><Trash2 size={20}/></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function UploadBox({ label, field, url, busy, onUpload }) {
  return (
    <div className="border border-gray-800 bg-[#111] p-3">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#E85D2A]">{label}</p>
      {url ? <img src={url} alt={`${label} preview`} className="mb-3 aspect-[3/4] w-full object-cover" /> : <div className="mb-3 grid aspect-[3/4] place-items-center bg-black text-xs text-gray-600">NO IMAGE</div>}
      <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-gray-600 p-3 text-sm font-bold text-white hover:border-[#E85D2A]">
        <Upload size={17}/> {busy ? 'Uploading...' : `Upload ${label}`}
        <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => onUpload(e.target.files?.[0], field)} />
      </label>
    </div>
  );
}
