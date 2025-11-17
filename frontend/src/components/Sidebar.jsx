import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Moon, Sun, UserPlus } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ThemeSelector from './ThemeSelector';
import GroupCreator from './GroupCreator';

export default function Sidebar({ selectedChat, onSelectChat, onLogout }) {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('blue');

  useEffect(() => {
    loadGroups();
    loadContacts();
  }, []);

  const loadGroups = async () => {
    try {
      const { data } = await api.get('/groups');
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const { data } = await api.get('/users/contacts');
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const addContact = async () => {
    if (!phoneSearch) return;
    try {
      await api.post('/users/contacts', { phoneNumber: phoneSearch });
      toast.success('Contact added!');
      setPhoneSearch('');
      loadContacts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add contact');
    }
  };

  const searchUsers = async (query) => {
    if (!query) {
      setUsers([]);
      return;
    }
    try {
      const { data } = await api.get(`/users/search?q=${query}`);
      setUsers(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    try {
      await api.put('/users/settings', { darkMode: newMode });
    } catch (error) {
      console.error('Failed to update dark mode');
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">ChatSphere Pro</h1>
          <div className="flex gap-2">
            <Link to="/analytics">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <BarChart3 className="w-5 h-5" />
              </button>
            </Link>
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          </div>
        </div>
        
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              searchUsers(e.target.value);
            }}
            className="w-full px-3 py-2 border rounded-lg"
          />
          
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="Add by phone..."
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <button
              onClick={addContact}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.length > 0 && (
          <div className="p-2">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">CONTACTS</h3>
            {contacts.map(contact => (
              <div
                key={contact._id}
                onClick={() => onSelectChat({ type: 'direct', user: contact })}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <div className="font-medium">{contact.username}</div>
                    <div className="text-xs text-gray-500">{contact.phoneNumber}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {search && users.length > 0 && (
          <div className="p-2">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">SEARCH RESULTS</h3>
            {users.map(user => (
              <div
                key={user._id}
                onClick={() => onSelectChat({ type: 'direct', user })}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-500">{user.phoneNumber}</div>
              </div>
            ))}
          </div>
        )}

        {groups.length > 0 && (
          <div className="p-2">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">GROUPS</h3>
            {groups.map(group => (
              <div
                key={group._id}
                onClick={() => onSelectChat({ type: 'group', group })}
                className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer ${
                  selectedChat?.group?._id === group._id ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <div className="font-medium">{group.name}</div>
                <div className="text-sm text-gray-500">{group.members.length} members</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t space-y-2">
        <GroupCreator contacts={contacts} onGroupCreated={loadGroups} />
        <button
          onClick={onLogout}
          className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
