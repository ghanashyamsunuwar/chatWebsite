import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Sidebar from './Sidebar';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join', currentRoom);

    socketRef.current.on('message', (message) => {
      setMessages((msgs) => [...msgs, message]);
    });

    return () => socketRef.current.disconnect();
  }, [currentRoom]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${currentRoom}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentRoom, user.token]);

  const sendMessage = async (content) => {
    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ content, chatRoom: currentRoom })
      });
      const message = await res.json();
      socketRef.current.emit('message', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} currentUser={user} />
        </div>
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
