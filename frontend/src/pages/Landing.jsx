import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, Users, Zap, Shield, Globe, Sparkles } from 'lucide-react';

export default function Landing() {
  const features = [
    { icon: MessageCircle, title: 'Real-Time Messaging', desc: 'Instant global communication' },
    { icon: Users, title: 'Group Chats', desc: 'Connect with teams worldwide' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Powered by Redis & Socket.IO' },
    { icon: Shield, title: 'Secure', desc: 'End-to-end encryption ready' },
    { icon: Globe, title: 'Global Reach', desc: 'Chat with anyone, anywhere' },
    { icon: Sparkles, title: 'AI Assistant', desc: 'Smart replies & summaries' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <nav className="p-6 flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          ChatSphere Pro
        </motion.h1>
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition">
            Get Started
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Connect Globally, Chat Instantly
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Experience the future of real-time communication with AI-powered features
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-full shadow-xl hover:shadow-2xl transition"
            >
              Start Chatting Now
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Join thousands of users worldwide • Free forever • No credit card required
          </p>
        </motion.div>
      </div>
    </div>
  );
}
