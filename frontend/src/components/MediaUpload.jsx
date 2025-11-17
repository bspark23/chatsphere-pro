import { useRef } from 'react';
import { Image, Video, Paperclip } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function MediaUpload({ onUpload }) {
  const fileInputRef = useRef();
  const imageInputRef = useRef();
  const videoInputRef = useRef();

  const handleUpload = async (file, type) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      toast.loading('Uploading...');
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.dismiss();
      toast.success('Uploaded!');
      
      onUpload({
        type: data.type,
        url: data.url,
        filename: data.filename
      });
    } catch (error) {
      toast.dismiss();
      toast.error('Upload failed');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        title="Send image"
      >
        <Image className="w-5 h-5" />
      </button>
      
      <button
        type="button"
        onClick={() => videoInputRef.current?.click()}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        title="Send video"
      >
        <Video className="w-5 h-5" />
      </button>
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        title="Send file"
      >
        <Paperclip className="w-5 h-5" />
      </button>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files[0], 'image')}
      />
      
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files[0], 'video')}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files[0], 'file')}
      />
    </div>
  );
}
