import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function GroupCreator({ contacts, onGroupCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleMember = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/groups', {
        name,
        description,
        members: selectedMembers
      });

      toast.success('Group created!');
      onGroupCreated(data);
      setIsOpen(false);
      setName('');
      setDescription('');
      setSelectedMembers([]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
      >
        <Users className="w-4 h-4" />
        Create Group
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="text-blue-500" />
                  Create Group
                </h3>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Group Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this group about?"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Members * ({selectedMembers.length} selected)
                  </label>
                  <div className="max-h-48 overflow-y-auto border rounded-lg">
                    {contacts.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No contacts available. Add contacts first!
                      </div>
                    ) : (
                      contacts.map((contact) => (
                        <div
                          key={contact._id}
                          onClick={() => toggleMember(contact._id)}
                          className={`p-3 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                            selectedMembers.includes(contact._id)
                              ? 'bg-blue-50 dark:bg-blue-900'
                              : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{contact.username}</div>
                              <div className="text-xs text-gray-500">{contact.phoneNumber}</div>
                            </div>
                            {selectedMembers.includes(contact._id) && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <Plus className="w-3 h-3 text-white rotate-45" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={loading || !name.trim() || selectedMembers.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
