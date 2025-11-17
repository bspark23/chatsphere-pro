import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PollCreator({ onCreatePoll }) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleCreate = () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error('Please add at least 2 options');
      return;
    }

    onCreatePoll({
      question,
      options: validOptions.map(opt => ({ text: opt, votes: 0 }))
    });

    setQuestion('');
    setOptions(['', '']);
    setIsOpen(false);
    toast.success('Poll created!');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        title="Create poll"
      >
        <BarChart2 className="w-5 h-5" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create Poll</h3>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What's your question?"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Options</label>
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {options.length < 6 && (
                  <button
                    onClick={addOption}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    + Add option
                  </button>
                )}
              </div>

              <button
                onClick={handleCreate}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create Poll
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
