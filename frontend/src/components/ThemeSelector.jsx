import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const themes = [
  { name: 'blue', color: 'bg-blue-500' },
  { name: 'purple', color: 'bg-purple-500' },
  { name: 'green', color: 'bg-green-500' },
  { name: 'pink', color: 'bg-pink-500' },
  { name: 'orange', color: 'bg-orange-500' }
];

export default function ThemeSelector({ currentTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = async (theme) => {
    try {
      await api.put('/users/settings', { theme });
      onThemeChange(theme);
      toast.success('Theme updated!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to update theme');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50"
        >
          <div className="text-sm font-semibold mb-3">Choose Theme</div>
          <div className="flex gap-2">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className={`w-8 h-8 rounded-full ${theme.color} ${
                  currentTheme === theme.name ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
