import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { chatbotResponses } from '../data/chatbotResponses';

export default function AIChatbot({ experimentId }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEnd = useRef(null);
  const { t } = useLanguage();
  const data = chatbotResponses[experimentId] || {};

  useEffect(() => {
    if (open && messages.length === 0) {
      const greet = data.greeting || t('chat.greeting');
      setMessages([{ from: 'bot', text: greet }]);
    }
  }, [open]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const respond = (userMsg) => {
    const lower = userMsg.toLowerCase();
    if (lower.includes('next') || lower.includes('step') || lower.includes('அடுத்த')) {
      const steps = data.steps || [];
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setCurrentStep(c => c + 1);
        return `📋 Step ${currentStep + 1}: ${step}`;
      }
      return '✅ You\'ve completed all the steps! Great work!';
    }
    if (lower.includes('formula') || lower.includes('சூத்திரம்')) {
      const c = data.concepts;
      return c?.formula || 'Please refer to the Lab Manual for the formula.';
    }
    if (lower.includes('principle') || lower.includes('concept') || lower.includes('கொள்கை')) {
      const c = data.concepts;
      return c?.principle || 'This experiment is based on fundamental physics principles.';
    }
    if (lower.includes('error') || lower.includes('wrong') || lower.includes('mistake') || lower.includes('help') || lower.includes('problem')) {
      const errs = data.errors;
      if (errs) {
        const errKeys = Object.keys(errs);
        return '🔍 Common issues:\n\n' + errKeys.map(k => errs[k]).join('\n\n');
      }
      return '🔍 Check all your connections and make sure the circuit is complete.';
    }
    if (lower.includes('hint') || lower.includes('tip') || lower.includes('குறிப்பு')) {
      const steps = data.steps || [];
      const nextStep = steps[currentStep] || steps[0];
      return `💡 Hint: ${nextStep}`;
    }
    if (lower.includes('aim') || lower.includes('நோக்கம்')) {
      return '🎯 Check the Aim section in the left panel for the experiment objective.';
    }
    const responses = [
      'Try saying "next step" to proceed through the experiment.',
      'You can ask about the "formula" or "principle" behind this experiment.',
      'Need help? Say "hint" for a tip, or "error" to troubleshoot.',
      'Type "next" to get step-by-step guidance!',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = respond(userMsg);
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
      setTyping(false);
    }, 800 + Math.random() * 500);
  };

  return (
    <>
      {!open && (
        <button style={styles.fab} onClick={() => setOpen(true)}>
          <MessageCircle size={24} />
          <span style={styles.fabPulse} />
        </button>
      )}
      {open && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <div style={styles.chatHeaderLeft}>
              <div style={styles.botAvatar}><Bot size={18} /></div>
              <div>
                <div style={styles.chatTitle}>{t('chat.title')}</div>
                <div style={styles.chatStatus}>● Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={styles.closeBtn}><X size={18} /></button>
          </div>

          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={{ ...styles.msgRow, justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.from === 'bot' && <div style={styles.msgBotIcon}><Bot size={14} /></div>}
                <div style={msg.from === 'user' ? styles.msgUser : styles.msgBot}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={styles.msgRow}>
                <div style={styles.msgBotIcon}><Bot size={14} /></div>
                <div style={styles.msgBot}>
                  <span style={styles.typingDots}>
                    <span style={{ ...styles.dot, animationDelay: '0s' }}>●</span>
                    <span style={{ ...styles.dot, animationDelay: '0.2s' }}>●</span>
                    <span style={{ ...styles.dot, animationDelay: '0.4s' }}>●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          <div style={styles.quickBtns}>
            {['Next Step', 'Formula', 'Hint', 'Help'].map(q => (
              <button key={q} style={styles.quickBtn} onClick={() => { setInput(q); setTimeout(() => { setInput(q); handleSend(); }, 50); setMessages(prev => [...prev, { from: 'user', text: q }]); setTyping(true); setTimeout(() => { setMessages(prev => [...prev, { from: 'bot', text: respond(q.toLowerCase()) }]); setTyping(false); }, 800); }}>
                {q}
              </button>
            ))}
          </div>

          <form style={styles.inputRow} onSubmit={e => { e.preventDefault(); handleSend(); }}>
            <input
              style={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
            />
            <button type="submit" style={styles.sendBtn}><Send size={16} /></button>
          </form>
        </div>
      )}
    </>
  );
}

const styles = {
  fab: {
    position: 'fixed', bottom: 24, right: 24, zIndex: 200,
    width: 56, height: 56, borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f8cff, #7c5cff)',
    color: '#fff', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(79,140,255,0.4)',
    transition: 'transform 0.2s', overflow: 'visible',
  },
  fabPulse: {
    position: 'absolute', inset: -4, borderRadius: '50%',
    border: '2px solid rgba(79,140,255,0.4)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  chatWindow: {
    position: 'fixed', bottom: 24, right: 24, zIndex: 200,
    width: 380, height: 520, borderRadius: 20,
    background: 'rgba(10, 14, 39, 0.95)', backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    animation: 'scaleIn 0.3s ease',
    overflow: 'hidden',
  },
  chatHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(79,140,255,0.08)',
  },
  chatHeaderLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  botAvatar: {
    width: 34, height: 34, borderRadius: 10,
    background: 'linear-gradient(135deg, #4f8cff, #7c5cff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
  },
  chatTitle: { fontSize: '0.88rem', fontWeight: 600, color: '#fff' },
  chatStatus: { fontSize: '0.7rem', color: '#00e676' },
  closeBtn: {
    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex',
  },
  messages: {
    flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
  },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: 8 },
  msgBotIcon: {
    width: 24, height: 24, borderRadius: '50%',
    background: 'rgba(79,140,255,0.15)', color: '#4f8cff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  msgBot: {
    background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
    fontSize: '0.84rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5,
    maxWidth: '80%', whiteSpace: 'pre-wrap',
  },
  msgUser: {
    background: 'linear-gradient(135deg, #4f8cff, #7c5cff)', padding: '10px 14px',
    borderRadius: '14px 14px 4px 14px', fontSize: '0.84rem', color: '#fff',
    maxWidth: '80%', lineHeight: 1.5,
  },
  typingDots: { display: 'flex', gap: 4 },
  dot: {
    fontSize: '0.7rem', color: '#4f8cff',
    animation: 'pulse 1s ease-in-out infinite',
  },
  quickBtns: {
    display: 'flex', gap: 6, padding: '8px 16px',
    overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,0.04)',
  },
  quickBtn: {
    padding: '5px 12px', borderRadius: 20,
    background: 'rgba(79,140,255,0.1)', border: '1px solid rgba(79,140,255,0.2)',
    color: '#4f8cff', fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer',
    whiteSpace: 'nowrap', transition: 'all 0.2s',
  },
  inputRow: {
    display: 'flex', gap: 8, padding: '10px 16px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1, padding: '10px 14px', borderRadius: 12,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: '0.84rem', outline: 'none',
    fontFamily: 'Inter, sans-serif',
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 12,
    background: 'linear-gradient(135deg, #4f8cff, #7c5cff)',
    border: 'none', color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};
