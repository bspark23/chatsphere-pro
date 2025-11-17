import { motion } from 'framer-motion';
import { Phone, PhoneOff, Video } from 'lucide-react';

export default function CallNotification({ caller, callType, onAccept, onReject }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-80"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          {callType === 'video' ? (
            <Video className="w-6 h-6 text-white" />
          ) : (
            <Phone className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <div className="font-semibold">{caller.username}</div>
          <div className="text-sm text-gray-500">
            Incoming {callType} call...
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onAccept}
          className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          Accept
        </button>
        <button
          onClick={onReject}
          className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
        >
          <PhoneOff className="w-5 h-5" />
          Decline
        </button>
      </div>
    </motion.div>
  );
}
