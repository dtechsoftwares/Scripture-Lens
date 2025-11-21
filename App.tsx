import React, { useState, useEffect } from 'react';
import { NoteList } from './components/NoteList';
import { Editor } from './components/Editor';
import { InsightsSidebar } from './components/InsightsSidebar';
import { Note, Insight } from './types';
import { BookOpen, Plus } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [currentInsights, setCurrentInsights] = useState<Insight[]>([]);

  // Load initial sample note if empty
  useEffect(() => {
    if (notes.length === 0) {
      const initialNote: Note = {
        id: '1',
        title: 'Study: The Parable of the Sower',
        content: 'I am researching the varying types of soil mentioned in the parable. The seed represents the word, but the soil represents the condition of the heart. I want to compare this with agricultural practices of the 1st century to understand why a sower would let seeds fall on rocks.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([initialNote]);
      setActiveNoteId(initialNote.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Study',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setCurrentInsights([]);
    setIsInsightsOpen(false);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
      setCurrentInsights([]);
      setIsInsightsOpen(false);
    }
  };

  const handleAddInsightToNote = (insight: Insight) => {
    if (!activeNote) return;
    
    const formattedInsight = `\n\n--- AI Insight: ${insight.title} ---\n${insight.description}\nReference: ${insight.reference || 'N/A'}\n------------------\n`;
    
    handleUpdateNote(activeNote.id, {
      content: activeNote.content + formattedInsight
    });
  };

  return (
    <div className="flex h-screen w-full bg-stone-100 overflow-hidden text-stone-800 font-sans">
      {/* Sidebar: Note List */}
      <aside className="w-64 flex-shrink-0 bg-stone-200 border-r border-stone-300 flex flex-col">
        <div className="p-4 flex items-center justify-between bg-stone-300 shadow-sm z-10">
          <div className="flex items-center gap-2 text-stone-700 font-bold">
            <BookOpen size={20} />
            <span>Scripture Lens</span>
          </div>
          <button 
            onClick={handleCreateNote}
            className="p-1.5 rounded-md hover:bg-stone-400/20 transition-colors text-stone-600"
            title="New Note"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <NoteList 
            notes={notes} 
            activeNoteId={activeNoteId} 
            onSelect={setActiveNoteId} 
            onDelete={handleDeleteNote}
          />
        </div>
      </aside>

      {/* Main Area: Editor */}
      <main className="flex-1 flex flex-col relative bg-paper h-full">
        {activeNote ? (
          <Editor 
            note={activeNote} 
            onUpdate={handleUpdateNote}
            onInsightsReceived={(insights) => {
              setCurrentInsights(insights);
              setIsInsightsOpen(true);
            }}
            isInsightsOpen={isInsightsOpen}
            toggleInsights={() => setIsInsightsOpen(!isInsightsOpen)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-stone-400 flex-col gap-4">
            <BookOpen size={64} className="opacity-20" />
            <p className="text-lg font-serif italic">Select a study note or start a new one.</p>
          </div>
        )}
      </main>

      {/* Right Sidebar: Insights */}
      {isInsightsOpen && activeNote && (
        <aside className="w-80 flex-shrink-0 bg-white border-l border-stone-200 shadow-xl z-20 flex flex-col animate-in slide-in-from-right duration-300">
          <InsightsSidebar 
            insights={currentInsights} 
            onClose={() => setIsInsightsOpen(false)}
            onAddToNote={handleAddInsightToNote}
          />
        </aside>
      )}
    </div>
  );
}