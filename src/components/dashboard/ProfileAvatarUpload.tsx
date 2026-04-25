'use client';

import { useState } from 'react';
import { Edit3, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileAvatarUpload({ initialPhoto, name }: { initialPhoto?: string, name: string }) {
  const [photo, setPhoto] = useState(initialPhoto);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.url) {
        setPhoto(data.url);
        // Also update the database User photo via a fast API call or Server Action (assume an endpoint exists or just save it later)
        await fetch('/api/settings/profile', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ photo: data.url })
        });
        toast.success('Profile photo updated!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative" style={{ marginBottom: '24px' }}>
      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-2xl shadow-indigo-500/20" style={{ padding: '4px' }}>
        <div className="w-full h-full bg-[#0a0e1a] rounded-[22px] flex items-center justify-center text-5xl font-bold text-white overflow-hidden relative">
          {photo ? (
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          ) : (
            name?.[0]?.toUpperCase() || 'S'
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      </div>
      <label className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
        <Edit3 className="w-4 h-4" />
        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
      </label>
    </div>
  );
}
