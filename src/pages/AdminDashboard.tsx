import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { convertImageToWebP } from '../utils/imageUtils';
import { v4 as uuidv4 } from 'uuid';
import { SUPABASE_CONFIG } from '../config';

export default function AdminDashboard() {
  // Config & Contents
  const { data: contents, refetch: refetchContents } = useApi<any>('/api/contents', {});
  // Works
  const { data: works, refetch: refetchWorks } = useApi<any[]>('/api/work', []);

  const [activeTab, setActiveTab] = useState('contents');

  // Forms state
  const [contentsForm, setContentsForm] = useState<any>({});
  const [workForm, setWorkForm] = useState<any>({ title: '', description: '', category: '', image_url: '', link: '' });
  const [editingWorkId, setEditingWorkId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (contents) setContentsForm(contents);
  }, [contents]);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const webpBlob = await convertImageToWebP(file);
      const fileName = `${uuidv4()}.webp`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, webpBlob, {
          contentType: 'image/webp',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please check Supabase configuration.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        setContentsForm({ ...contentsForm, logo_url: url });
      }
    }
  };

  const handleWorkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        setWorkForm({ ...workForm, image_url: url });
      }
    }
  };

  const handleContentsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/contents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentsForm)
    });
    alert('Contents updated!');
    refetchContents();
  };

  const handleWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...workForm, id: editingWorkId };
    await fetch('/api/work', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert(editingWorkId ? 'Work updated!' : 'Work added (Existing works deleted)!');
    setWorkForm({ title: '', description: '', category: '', image_url: '', link: '' });
    setEditingWorkId(null);
    refetchWorks();
  };

  const handleDeleteWork = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/work/${id}`, { method: 'DELETE' });
    refetchWorks();
  };

  const startEditWork = (work: any) => {
    setEditingWorkId(work.id);
    setWorkForm(work);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-xl font-bold">Admin</h1>
          <Link to="/" className="text-sm text-gray-500 hover:text-black">← Back to Site</Link>
        </div>
        
        <div className="mb-6 text-xs text-gray-400 break-all">
          <p className="font-bold mb-1">Supabase Config</p>
          <p>URL: {SUPABASE_CONFIG.url}</p>
        </div>

        <nav className="space-y-2">
          {['contents', 'work'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2 rounded-md capitalize ${activeTab === tab ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-10 overflow-auto">
        {activeTab === 'contents' && (
          <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Edit Contents (Logo, Hero, Info)</h2>
            <form onSubmit={handleContentsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Logo Image</label>
                <div className="flex items-center gap-4">
                  {contentsForm.logo_url && (
                    <img src={contentsForm.logo_url} alt="Logo" className="h-12 w-auto border rounded p-1" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                  />
                </div>
                {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Logo Text (Fallback)</label>
                <input 
                  value={contentsForm.logo_text || ''} 
                  onChange={e => setContentsForm({...contentsForm, logo_text: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input 
                  value={contentsForm.contact_email || ''} 
                  onChange={e => setContentsForm({...contentsForm, contact_email: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium mb-1">Hero Title</label>
                <input 
                  value={contentsForm.hero_title || ''} 
                  onChange={e => setContentsForm({...contentsForm, hero_title: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                <input 
                  value={contentsForm.hero_subtitle || ''} 
                  onChange={e => setContentsForm({...contentsForm, hero_subtitle: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
              <button type="submit" className="bg-black text-white px-4 py-2 rounded">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === 'work' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">{editingWorkId ? 'Edit Work' : 'Add New Work'}</h2>
              <p className="text-sm text-red-500 mb-4">Note: Adding a new work will DELETE all existing works (as requested).</p>
              <form onSubmit={handleWorkSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Title</label>
                    <input 
                      value={workForm.title} 
                      onChange={e => setWorkForm({...workForm, title: e.target.value})}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input 
                      value={workForm.category} 
                      onChange={e => setWorkForm({...workForm, category: e.target.value})}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    value={workForm.description} 
                    onChange={e => setWorkForm({...workForm, description: e.target.value})}
                    className="w-full border p-2 rounded h-20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cover Image</label>
                  <div className="flex items-center gap-4">
                    {workForm.image_url && (
                      <img src={workForm.image_url} alt="Cover" className="h-20 w-20 object-cover border rounded" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleWorkImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                    />
                  </div>
                  <input 
                    value={workForm.image_url} 
                    onChange={e => setWorkForm({...workForm, image_url: e.target.value})}
                    className="w-full border p-2 rounded mt-2"
                    placeholder="Or enter image URL manually"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Link</label>
                  <input 
                    value={workForm.link} 
                    onChange={e => setWorkForm({...workForm, link: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                    {editingWorkId ? 'Update Work' : 'Add Work'}
                  </button>
                  {editingWorkId && (
                    <button 
                      type="button" 
                      onClick={() => { setEditingWorkId(null); setWorkForm({ title: '', description: '', category: '', image_url: '', link: '' }); }}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Existing Works</h2>
              <div className="space-y-4">
                {(works as any[])?.map(work => (
                  <div key={work.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      {work.image_url && <img src={work.image_url} className="w-12 h-12 object-cover rounded" />}
                      <div>
                        <h4 className="font-bold">{work.title}</h4>
                        <p className="text-sm text-gray-500">{work.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditWork(work)} className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => handleDeleteWork(work.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
