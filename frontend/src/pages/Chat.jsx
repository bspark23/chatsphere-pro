import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { initSocket, getSocket, disconnectSocket } from '../utils/socket';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function Chat() {
  const { token, logout } = useAuthStore();
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = initSocket(token);
    setSocket(s);

    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        onLogout={logout}
      />
      <ChatWindow 
        chat={selectedChat}
        socket={socket}
      />
    </div>
  );
}
