import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { NoteItem } from '../../types/os';
import { Plus, Search, Trash2, ArrowLeft, Edit3 } from 'lucide-react';
import { sounds } from '../../utils/sound';

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'n1',
    title: 'TestOS Ideas & Roadmap',
    content: '1. Test frosted clouded blur rendering\n2. Add custom apps in Store\n3. Check 3-button navigation responsive layout',
    date: 'Nov 2, 2026',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  },
  {
    id: 'n2',
    title: 'Grocery List',
    content: '- Cold brew coffee\n- Organic avocados\n- Sourdough loaf\n- Greek yogurt',
    date: 'Nov 1, 2026',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  },
];

export const NotesApp: React.FC = () => {
  const { registerBackHandler } = useOS();
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('testos_notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTES;
  });

  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('testos_notes', JSON.stringify(notes));
    } catch {}
  }, [notes]);

  useEffect(() => {
    return registerBackHandler(() => {
      if (activeNote) {
        setActiveNote(null);
        return true;
      }
      return false;
    });
  }, [activeNote, registerBackHandler]);

  const handleCreateNote = () => {
    sounds.click();
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: '',
      date: 'Today',
      color: 'from-sky-500/20 to-indigo-500/20 border-sky-500/30',
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
  };

  const handleUpdateNote = (id: string, title: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title, content } : n))
    );
    if (activeNote && activeNote.id === id) {
      setActiveNote((prev) => (prev ? { ...prev, title, content } : null));
    }
  };

  const handleDeleteNote = (id: string) => {
    sounds.haptic();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setActiveNote(null);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white select-none overflow-hidden">
      {!activeNote ? (
        <div className="flex-1 flex flex-col p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold">Notes ({notes.length})</h1>
            <button
              onClick={handleCreateNote}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> New
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 no-scrollbar">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  sounds.click();
                  setActiveNote(note);
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-tr ${note.color} border cursor-pointer hover:bg-white/15 transition-all shadow-md group`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                    {note.title || 'Untitled'}
                  </h3>
                  <span className="text-[10px] text-white/40">{note.date}</span>
                </div>
                <p className="text-[11px] text-white/70 line-clamp-2 mt-1 leading-relaxed">
                  {note.content || 'Empty note...'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ACTIVE NOTE EDITOR
        <div className="flex-1 flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <button
              onClick={() => setActiveNote(null)}
              className="flex items-center gap-1 text-xs text-amber-400 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> All Notes
            </button>
            <button
              onClick={() => handleDeleteNote(activeNote.id)}
              className="text-white/40 hover:text-rose-400 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={activeNote.title}
            onChange={(e) =>
              handleUpdateNote(activeNote.id, e.target.value, activeNote.content)
            }
            placeholder="Title"
            className="text-base font-bold bg-transparent border-none text-white focus:outline-none mb-2"
          />

          <textarea
            value={activeNote.content}
            onChange={(e) =>
              handleUpdateNote(activeNote.id, activeNote.title, e.target.value)
            }
            placeholder="Start typing your note here..."
            className="flex-1 bg-transparent border-none text-xs text-white/80 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
