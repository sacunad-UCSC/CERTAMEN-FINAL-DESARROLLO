import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { api } from '../services/api';

export default function ChatbotWidget({ onNavigateToContact }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '¡Hola! Bienvenido al asistente de NexoPC. ¿En qué componente de hardware o consulta te puedo ayudar hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState([
    '¿Qué garantía tienen las GPUs?',
    '¿Tiempos de despacho a regiones?',
    '¿Cuáles son los métodos de pago?',
    'Solicitar contacto con un ejecutivo',
  ]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (query === 'Solicitar contacto con un ejecutivo') {
      setMessages((prev) => [
        ...prev,
        { sender: 'user', text: query },
        {
          sender: 'bot',
          text: 'Te derivo de inmediato a nuestro formulario institucional para que un ejecutivo te contacte directamente por correo.',
        },
      ]);
      setInput('');
      if (onNavigateToContact) onNavigateToContact();
      return;
    }

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInput('');

    try {
      const res = await api.askBot(query);
      if (res.success) {
        setMessages((prev) => [...prev, { sender: 'bot', text: res.answer }]);
        if (res.options) {
          setOptions(res.options);
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Ocurrió un error al consultar el servicio. Por favor intenta más tarde.' },
      ]);
    }
  };

  return (
    <>
      <button className="chatbot-bubble" onClick={() => setIsOpen(!isOpen)} title="Asistente Virtual">
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={22} />
              <div>
                <strong style={{ fontSize: '14px', display: 'block' }}>NexoPC Bot</strong>
                <small style={{ fontSize: '11px', opacity: 0.9 }}>Soporte & Hardware en línea</small>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-msg ${m.sender}`}>
                {m.text}
              </div>
            ))}

            {/* Sugerencias rápidas de preguntas frecuentes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
              <small style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                Preguntas frecuentes:
              </small>
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(opt)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    fontWeight: 600,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <form
            className="chatbot-input"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Escribe tu duda aquí..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              style={{
                background: 'var(--primary)',
                border: 'none',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
