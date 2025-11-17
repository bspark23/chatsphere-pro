import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'poll', 'game', 'location', 'ai-response'],
    default: 'text'
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  chatType: {
    type: String,
    enum: ['direct', 'group'],
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  deleted: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date
  }
}, { timestamps: true });

messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Message', messageSchema);
