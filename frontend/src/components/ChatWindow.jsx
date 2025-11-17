import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import MediaUpload from './MediaUpload';
import VideoCall from './VideoCall';
import PollCreator from './PollCreator';

export default function ChatWindow({ chat, socket }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '😍', '🤔', '👏', '🙌'];

  useEffect(() => {
    if (!chat) return;

    loadMessages();

    if (socket) {
      socket.on('new-message', handleNewMessage);
      socket.on('user-typing', handleTyping);
      socket.on('user-status', handleUserStatus);

      if (chat.type === 'group') {
        socket.emit('join-group', chat.group._id);
      }

      return () => {
        socket.off('new-message', handleNewMessage);
        socket.off('user-typing', handleTyping);
        socket.off('user-status', handleUserStatus);
        if (chat.type === 'group') {
          socket.emit('leave-group', chat.group._id);
        }
      };
    }
  }, [chat, socket]);

  const handleUserStatus = (data) => {
    if (chat.type === 'direct' && data.userId === chat.user._id) {
      setIsOnline(data.status === 'online');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const endpoint = chat.type === 'direct'
        ? `/messages/direct/${chat.user._id}`
        : `/messages/group/${chat.group._id}`;
      const { data } = await api.get(endpoint);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleTyping = (data) => {
    setTyping(data.isTyping ? data.username : null);
    if (data.isTyping) {
      setTimeout(() => setTyping(null), 3000);
    }
  };

  const sendMessage = (e, messageData = {}) => {
    if (e) e.preventDefault();
    
    const content = messageData.content || newMessage.trim();
    if (!content || !socket) return;

    if (!isOnline && chat.type === 'direct') {
      toast.error('This person is not online');
      return;
    }

    socket.emit('send-message', {
      content,
      type: messageData.type || 'text',
      data: messageData.data,
      chatType: chat.type,
      recipient: chat.type === 'direct' ? chat.user._id : null,
      group: chat.type === 'group' ? chat.group._id : null
    });

    setNewMessage('');
  };

  const handleMediaUpload = (mediaData) => {
    sendMessage(null, {
      content: mediaData.filename,
      type: mediaData.type,
      data: { url: mediaData.url }
    });
  };

  const handleCreatePoll = (pollData) => {
    sendMessage(null, {
      content: pollData.question,
      type: 'poll',
      data: pollData
    });
  };

  const handleTypingIndicator = (isTyping) => {
    if (!socket) return;
    socket.emit('typing', {
      chatType: chat.type,
      recipient: chat.type === 'direct' ? chat.user._id : null,
      group: chat.type === 'group' ? chat.group._id : null,
      isTyping
    });
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  const chatName = chat.type === 'direct' ? chat.user.username : chat.group.name;

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b bg-white dark:bg-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{chatName}</h2>
          {chat.type === 'direct' && (
            <div className="text-xs text-gray-500">
              {isOnline ? 'Online' : 'Offline'}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {chat.type === 'direct' && isOnline && (
            <>
              <VideoCall 
                socket={socket}
                userId={chat.user._id}
                callType="video"
              />
              <VideoCall 
                socket={socket}
                userId={chat.user._id}
                callType="audio"
              />
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`max-w-xs px-4 py-3 rounded-2xl shadow-md ${
                  msg.sender._id === user.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {chat.type === 'group' && msg.sender._id !== user.id && (
                  <div className="text-xs font-semibold mb-1">{msg.sender.username}</div>
                )}
                
                {msg.type === 'image' && msg.data?.url && (
                  <img 
                    src={msg.data.url} 
                    alt={msg.content}
                    className="max-w-xs rounded-lg mb-2"
                  />
                )}
                
                {msg.type === 'video' && msg.data?.url && (
                  <video 
                    src={msg.data.url}
                    controls
                    className="max-w-xs rounded-lg mb-2"
                  />
                )}
                
                {msg.type === 'file' && msg.data?.url && (
                  <a 
                    href={msg.data.url}
                    download
                    className="flex items-center gap-2 underline"
                  >
                    📎 {msg.content}
                  </a>
                )}
                
                {msg.type === 'poll' && msg.data && (
                  <div className="space-y-2">
                    <div className="font-semibold mb-2">{msg.content}</div>
                    {msg.data.options?.map((option, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500"
                      >
                        {option.text} ({option.votes || 0})
                      </button>
                    ))}
                  </div>
                )}
                
                {msg.type === 'text' && <div>{msg.content}</div>}
                
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {msg.reactions.map((reaction, idx) => (
                      <span key={idx} className="text-sm">
                        {reaction.emoji}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-xs opacity-75 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 italic"
          >
            {typing} is typing...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t bg-white dark:bg-gray-800">
        <div className="flex gap-2 items-center">
          <MediaUpload onUpload={handleMediaUpload} />
          <PollCreator onCreatePoll={handleCreatePoll} />
          
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-12 left-0 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-xl grid grid-cols-5 gap-2"
              >
                {emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewMessage(newMessage + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-2xl hover:scale-125 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onFocus={() => handleTypingIndicator(true)}
            onBlur={() => handleTypingIndicator(false)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Send
          </motion.button>
        </div>
      </form>
    </div>
  );
}
