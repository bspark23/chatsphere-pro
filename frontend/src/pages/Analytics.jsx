import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MessageSquare, TrendingUp, Award } from 'lucide-react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      const [statsRes, leaderRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/analytics/leaderboard')
      ]);
      setStats(statsRes.data);
      setLeaderboard(leaderRes.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  if (!stats) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Link to="/chat" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Back to Chat
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="blue" />
          <StatCard icon={TrendingUp} label="Active (24h)" value={stats.activeUsers} color="green" />
          <StatCard icon={MessageSquare} label="Total Messages" value={stats.totalMessages} color="purple" />
          <StatCard icon={MessageSquare} label="Recent (24h)" value={stats.recentMessages} color="pink" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Top Groups</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messageCount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="text-yellow-500" /> Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <div className="font-semibold">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.points} points</div>
                    </div>
                  </div>
                  {user.badges?.length > 0 && (
                    <div className="flex gap-1">
                      {user.badges.slice(0, 3).map((badge, i) => (
                        <span key={i} className="text-xl">🏆</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${colors[color]} p-6 rounded-xl shadow-lg text-white`}
    >
      <Icon className="w-8 h-8 mb-2 opacity-80" />
      <div className="text-3xl font-bold mb-1">{value.toLocaleString()}</div>
      <div className="text-sm opacity-90">{label}</div>
    </motion.div>
  );
}
