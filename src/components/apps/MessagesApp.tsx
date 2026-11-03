import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { INITIAL_CONTACTS } from '../../data/osData';
import { MessageContact, MessageItem } from '../../types/os';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Smile } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const MessagesApp: React.FC = () => {
  const { registerBackHandler } = useOS();
  const [contacts, setContacts] = useState<MessageContact[]>(() => {
    try {
      const saved = localStorage.getItem('testos_contacts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CONTACTS;
  });

  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find((c) => c.id === activeContactId);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('testos_contacts', JSON.stringify(contacts));
    } catch {}
  }, [contacts]);

  // Handle OS back button to return to contact list
  useEffect(() => {
    return registerBackHandler(() => {
      if (activeContactId) {
        setActiveContactId(null);
        return true;
      }
      return false;
    });
  }, [activeContactId, registerBackHandler]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContact?.messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContactId) return;

    sounds.click();
    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentText = inputText.trim();
    setInputText('');

    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeContactId
          ? {
              ...c,
              lastMessage: currentText,
              lastMessageTime: 'Just now',
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );

    // Simulate smart bot reply after 1.2s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      sounds.notification();

      const botReplies = [
        `That sounds fantastic! TestOS runs really smoothly.`,
        `Totally agree! Have you tried the Store app or the Galaxy Runner game yet?`,
        `Nice! The frosted glass blur transitions look so futuristic.`,
        `Got it! Let me know if you test the CloudNet search engine too.`,
        `Awesome! You can also customize your wallpaper in Settings.`,
      ];
      const replyText = botReplies[Math.floor(Math.random() * botReplies.length)];

      const replyMsg: MessageItem = {
        id: `m-${Date.now() + 1}`,
        sender: 'other',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeContactId
            ? {
                ...c,
                lastMessage: replyText,
                lastMessageTime: 'Just now',
                messages: [...c.messages, replyMsg],
              }
            : c
        )
      );
    }, 1400);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/85 backdrop-blur-2xl text-white select-none overflow-hidden">
      {!activeContactId ? (
        // CONTACTS LIST
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h1 className="text-lg font-bold tracking-tight">Messages</h1>
            <span className="text-xs text-sky-400 font-medium">3 Conversations</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5 no-scrollbar">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
                  sounds.click();
                  setActiveContactId(contact.id);
                  // Mark as read
                  setContacts((prev) =>
                    prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c))
                  );
                }}
                className="p-4 flex items-center gap-3.5 hover:bg-white/5 active:bg-white/10 cursor-pointer transition-colors"
              >
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover border border-white/20"
                  />
                  {contact.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {contact.name}
                    </h3>
                    <span className="text-[11px] text-white/40">{contact.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-white/60 truncate">{contact.lastMessage}</p>
                </div>

                {contact.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[11px] font-bold flex items-center justify-center">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ACTIVE CHAT VIEW
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveContactId(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img
                src={activeContact?.avatar}
                alt={activeContact?.name}
                className="w-8 h-8 rounded-full object-cover border border-white/20"
              />
              <div>
                <h3 className="text-xs font-bold text-white truncate max-w-[130px]">
                  {activeContact?.name}
                </h3>
                <span className="text-[10px] text-emerald-400 capitalize">
                  {activeContact?.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/70">
              <button className="p-2 hover:bg-white/10 rounded-lg">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg">
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {activeContact?.messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                      isMe
                        ? 'bg-sky-500 text-white rounded-br-none'
                        : 'bg-white/10 text-white rounded-bl-none border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-white/40 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white/10 max-w-[80px] rounded-bl-none">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:hover:bg-sky-500 text-white shadow-md transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
