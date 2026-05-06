import React, { useState } from 'react';
import axios from 'axios';
import { MessageCircle, X } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I can suggest veg meals. E.g. 'suggest veg meal under 80'", sender: 'bot' }]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { message: userMsg.text });
      const botMsg = { text: res.data.reply, sender: 'bot', suggestions: res.data.suggestions };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error connecting to AI.", sender: 'bot' }]);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="btn-primary"
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', borderRadius: '50%', width: '60px', height: '60px', padding: 0 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="card" style={{ position: 'fixed', bottom: '6rem', right: '2rem', width: '350px', height: '400px', display: 'flex', flexDirection: 'column', zIndex: 100, padding: 0, overflow: 'hidden' }}>
          <div style={{ background: 'var(--primary)', padding: '1rem', color: 'white', fontWeight: 'bold' }}>
            AI Assistant
          </div>
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--primary-dark)' : 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '0.5rem', maxWidth: '80%' }}>
                <p style={{ margin: 0 }}>{msg.text}</p>
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    {msg.suggestions.map(s => (
                      <div key={s._id} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                        <strong>{s.name}</strong> - ₹{s.price}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask me anything..." 
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
            />
            <button type="submit" style={{ color: 'var(--primary)', background: 'transparent' }}>Send</button>
          </form>
        </div>
      )}
    </>
  );
}
