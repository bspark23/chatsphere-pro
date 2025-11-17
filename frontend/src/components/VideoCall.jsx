import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import Peer from 'simple-peer';
import toast from 'react-hot-toast';

export default function VideoCall({ socket, userId, callType = 'video' }) {
  const [stream, setStream] = useState(null);
  const [calling, setCalling] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    if (!socket) return;

    socket.on('incoming-call', (data) => {
      setReceivingCall(true);
      setCaller(data);
      setCallerSignal(data.signal);
    });

    socket.on('call-accepted', (data) => {
      setCallAccepted(true);
      connectionRef.current.signal(data.signal);
    });

    socket.on('call-rejected', () => {
      toast.error('Call rejected');
      endCall();
    });

    socket.on('call-ended', () => {
      toast('Call ended');
      endCall();
    });

    return () => {
      socket.off('incoming-call');
      socket.off('call-accepted');
      socket.off('call-rejected');
      socket.off('call-ended');
    };
  }, [socket]);

  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      });

      setStream(mediaStream);
      if (myVideo.current) {
        myVideo.current.srcObject = mediaStream;
      }

      setCalling(true);

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: mediaStream
      });

      peer.on('signal', (signal) => {
        socket.emit('call-user', {
          to: userId,
          signal,
          callType
        });
      });

      peer.on('stream', (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }
      });

      connectionRef.current = peer;
    } catch (error) {
      toast.error('Could not access camera/microphone');
      console.error('Media error:', error);
    }
  };

  const acceptCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: caller.callType === 'video',
        audio: true
      });

      setStream(mediaStream);
      if (myVideo.current) {
        myVideo.current.srcObject = mediaStream;
      }

      setCallAccepted(true);

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: mediaStream
      });

      peer.on('signal', (signal) => {
        socket.emit('accept-call', {
          to: caller.from,
          signal
        });
      });

      peer.on('stream', (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }
      });

      peer.signal(callerSignal);
      connectionRef.current = peer;
      setReceivingCall(false);
    } catch (error) {
      toast.error('Could not access camera/microphone');
      console.error('Media error:', error);
    }
  };

  const rejectCall = () => {
    socket.emit('reject-call', { to: caller.from });
    setReceivingCall(false);
  };

  const endCall = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (userId) {
      socket.emit('end-call', { to: userId });
    }
    setCalling(false);
    setCallAccepted(false);
    setReceivingCall(false);
    setStream(null);
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  return (
    <>
      {!calling && !callAccepted && (
        <button
          onClick={startCall}
          className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
          title={`Start ${callType} call`}
        >
          {callType === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
        </button>
      )}

      <AnimatePresence>
        {receivingCall && !callAccepted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl text-center"
            >
              <div className="text-xl font-bold mb-4">
                {caller?.username} is calling...
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={acceptCall}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={rejectCall}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {(calling || callAccepted) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            <div className="flex-1 relative">
              {callAccepted && (
                <video
                  ref={userVideo}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              
              <video
                ref={myVideo}
                autoPlay
                muted
                playsInline
                className="absolute bottom-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white"
              />
            </div>

            <div className="p-6 flex justify-center gap-4">
              {callType === 'video' && (
                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full ${videoEnabled ? 'bg-gray-700' : 'bg-red-500'} text-white`}
                >
                  {videoEnabled ? <Video /> : <VideoOff />}
                </button>
              )}
              
              <button
                onClick={toggleAudio}
                className={`p-4 rounded-full ${audioEnabled ? 'bg-gray-700' : 'bg-red-500'} text-white`}
              >
                {audioEnabled ? <Mic /> : <MicOff />}
              </button>
              
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <PhoneOff />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
