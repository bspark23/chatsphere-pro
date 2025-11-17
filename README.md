# ChatSphere Pro – Global Real-Time Messaging Platform

A feature-rich, visually stunning chat application with real-time messaging, AI assistant, analytics, and advanced interactive features.

## Features

### Core Features
- 🔐 User authentication with phone number contacts
- 💬 Real-time global messaging via Socket.IO
- 👥 Group chats with dynamic member management
- 🟢 Online/offline presence detection
- ⌨️ Typing indicators & read receipts
- 📱 Contact management by phone number
- 🔍 Search users and messages
- 📜 Chat history with pagination

### Advanced Features
- 🤖 AI-powered chat assistant (summarize, suggest replies)
- 📊 Real-time analytics dashboard
- 🎨 Multiple color themes + dark mode
- ✨ Smooth animations with Framer Motion
- 🎮 Gamification (points, badges, leaderboard)
- 🌍 Global reach - chat with anyone on the platform
- 🎯 Landing page with animations
- 📈 Live metrics and charts

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts, Socket.IO-client
- **Backend**: Node.js, Express, Socket.IO, OpenAI API (optional)
- **Database**: MongoDB
- **Cache/Pub-Sub**: Redis
- **Deployment**: Docker, Nginx

## Quick Start

```bash
# Start all services
docker-compose up --build

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Nginx (production): http://localhost
```

## Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
chatsphere/
├── frontend/          # React app
├── backend/           # Node.js API + Socket.IO
├── docker-compose.yml # Docker orchestration
├── nginx.conf         # Reverse proxy config
└── README.md
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatsphere
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key_optional
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## New Features Guide

### Phone Number Contacts
Users can add contacts by phone number. Only users registered on the platform can be added and messaged.

### AI Assistant
Click the sparkle icon in any chat to:
- Summarize conversations
- Get smart reply suggestions
- Ask questions about the chat

### Analytics Dashboard
Access `/analytics` to view:
- Real-time user statistics
- Message frequency charts
- Top active groups
- User leaderboard with points and badges

### Themes & Dark Mode
- Toggle dark mode from the sidebar
- Choose from 5 color themes (blue, purple, green, pink, orange)
- Settings persist per user

### Gamification
- Earn points for activity
- Unlock badges for achievements
- Compete on the leaderboard


## 🚀 Complete Setup Guide

### Development Mode (Recommended)

```bash
# 1. Start databases (MongoDB + Redis)
docker-compose -f docker-compose.dev.yml up -d

# 2. Backend setup
cd backend
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY (optional but recommended)
npm install
npm run dev

# 3. Frontend setup (new terminal)
cd frontend
copy .env.example .env
npm install
npm run dev
```

### Production Mode (Full Docker)

```bash
# Start all services with Docker
docker-compose up --build

# Access via Nginx at http://localhost
```

## 📱 Access Points

- **Landing Page**: http://localhost:3000
- **Chat Interface**: http://localhost:3000/chat
- **Analytics Dashboard**: http://localhost:3000/analytics
- **Backend API**: http://localhost:5000/api

## 🎯 Complete Feature List

### ✅ Fully Implemented
- 📞 **Phone number-based contacts** - Add users by phone number
- 💬 **Real-time messaging** - Instant message delivery with Socket.IO
- 📸 **Multimedia support** - Send images, videos, and files
- 📹 **Video & audio calls** - WebRTC-powered real-time calls
- 🤖 **AI assistant** - Real OpenAI integration for smart replies
- 📊 **Analytics dashboard** - Real-time stats and charts
- 🎨 **Themes** - 5 color themes + dark mode
- 📊 **Polls** - Create and vote on polls in chat
- 🏆 **Gamification** - Points, badges, and leaderboard
- ✨ **Animations** - Smooth Framer Motion animations
- 🌐 **Landing page** - Beautiful animated landing
- 👥 **Group chats** - Create and manage groups
- ⌨️ **Typing indicators** - See when someone is typing
- ✓ **Read receipts** - Know when messages are read
- 🟢 **Online status** - Real-time presence detection
- 🚫 **Offline detection** - "User is not online" notifications

### 🔜 Ready to Add (Scaffolded)
- 🎮 Mini-games (Tic-Tac-Toe, Quiz, Rock-Paper-Scissors)
- 📍 Geolocation sharing with maps
- ⏱️ Self-destructing messages (TTL support in model)
- 🎤 Voice messages
- 🔐 End-to-end encryption

## 🔑 Required API Keys

### OpenAI API (Optional but Recommended)
The AI assistant works with fallback responses without a key, but for full functionality:

1. Get your key from: https://platform.openai.com/api-keys
2. Add to `backend/.env`: 
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

Without the key, AI assistant will provide basic responses.

## 📦 Dependencies

### Backend
- `express` - Web framework
- `socket.io` - Real-time communication
- `mongoose` - MongoDB ODM
- `redis` - Pub/sub and caching
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `openai` - AI assistant integration
- `multer` - File upload handling

### Frontend
- `react` + `vite` - UI framework
- `socket.io-client` - Real-time client
- `framer-motion` - Animations
- `recharts` - Analytics charts
- `simple-peer` - WebRTC for calls
- `leaflet` - Maps (for geolocation)
- `lucide-react` - Icons
- `react-hot-toast` - Notifications

## 🎨 UI Features

- **5 Color Themes**: Blue, Purple, Green, Pink, Orange
- **Dark Mode**: Toggle between light and dark
- **Smooth Animations**: Message send/receive, typing indicators
- **Responsive Design**: Works on desktop and mobile
- **Beautiful Landing**: Animated hero section with features

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File upload validation
- CORS protection
- Environment variable configuration

## 📝 Message Types Supported

- `text` - Regular text messages
- `image` - Image files
- `video` - Video files
- `file` - Documents and other files
- `poll` - Interactive polls
- `ai-response` - AI assistant responses
- `game` - Mini-games (ready to implement)
- `location` - Geolocation (ready to implement)

## 🎮 How to Use

1. **Register** with username, email, and phone number
2. **Add contacts** by searching phone numbers
3. **Start chatting** - Messages work only if recipient is online
4. **Make calls** - Video/audio calls when user is online
5. **Upload media** - Click image/video/file icons
6. **Create polls** - Click poll icon in chat
7. **Use AI** - Click sparkle icon for AI assistant
8. **View analytics** - Check dashboard for stats
9. **Customize** - Change themes and toggle dark mode

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
docker-compose -f docker-compose.dev.yml up -d
```

### Redis Connection Error
```bash
# Check Redis is running
docker ps | grep redis
```

### File Upload Issues
```bash
# Ensure uploads folder exists
mkdir backend/uploads
```

### WebRTC Call Issues
- Ensure HTTPS in production (WebRTC requires secure context)
- Check browser permissions for camera/microphone
- Both users must be online

## 🚀 Deployment

### Docker Production
```bash
docker-compose up -d
```

### Manual Deployment
1. Set environment variables
2. Build frontend: `npm run build`
3. Serve with Nginx
4. Run backend with PM2 or similar

## 📄 License

MIT License - Feel free to use for learning and projects!

---

Built with ❤️ using React, Node.js, Socket.IO, MongoDB, Redis, and OpenAI
