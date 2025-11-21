import React, { useState, useCallback } from 'react';
import { Note, Insight } from '../types';
import { analyzeNote } from '../services/geminiService';
import { Button } from './Button';
import { Sparkles, PanelRightClose, PanelRightOpen } from 'lucide-react';

interface EditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onInsightsReceived: (insights: Insight[]) => void;
  isInsightsOpen: boolean;
  toggleInsights: () => void;
}

export const Editor: React.FC<EditorProps> = ({ 
  note, 
  onUpdate, 
  onInsightsReceived,
  isInsightsOpen,
  toggleInsights
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(note.id, { title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, { content: e.target.value });
  };

  const handleAnalyze = async () => {
    if (!note.content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const insights = await analyzeNote(note);
      onInsightsReceived(insights);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze notes. Please check your connection or API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-stone-200 bg-stone-50/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">
          Edit Mode
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAnalyze} 
            disabled={!note.content.trim() || isAnalyzing}
            isLoading={isAnalyzing}
            className="bg-gradient-to-r from-stone-800 to-stone-700 hover:from-stone-700 hover:to-stone-600 text-gold-100 border border-stone-600"
          >
            <Sparkles size={16} className="mr-2 text-gold-500" />
            Analyze
          </Button>
          <button 
            onClick={toggleInsights}
            className={`p-2 rounded-md transition-colors ${isInsightsOpen ? 'bg-stone-200 text-stone-800' : 'text-stone-400 hover:bg-stone-100'}`}
            title="Toggle Insights Panel"
          >
            {isInsightsOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
          </button>
        </div>
      </div>

      {/* Writing Area */}
      <div className="flex-1 overflow-y-auto p-8 md:p-12 max-w-4xl mx-auto w-full">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Title your study..."
          className="w-full text-4xl font-serif font-bold text-stone-800 placeholder-stone-300 border-none focus:outline-none focus:ring-0 bg-transparent mb-6"
        />
        
        <textarea
          value={note.content}
          onChange={handleContentChange}
          placeholder="Start writing your observations, scriptures, and thoughts..."
          className="w-full h-[calc(100%-100px)] resize-none text-lg leading-relaxed font-serif text-stone-700 placeholder-stone-300 border-none focus:outline-none focus:ring-0 bg-transparent"
        />
      </div>
    </div>
  );
};