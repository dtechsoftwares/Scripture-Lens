import React from 'react';
import { Insight } from '../types';
import { X, Quote, Book, Lightbulb, History, PlusCircle } from 'lucide-react';

interface InsightsSidebarProps {
  insights: Insight[];
  onClose: () => void;
  onAddToNote: (insight: Insight) => void;
}

export const InsightsSidebar: React.FC<InsightsSidebarProps> = ({ insights, onClose, onAddToNote }) => {
  
  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'historical': return <History size={16} className="text-amber-700" />;
      case 'theological': return <Book size={16} className="text-indigo-700" />;
      case 'linguistic': return <Quote size={16} className="text-emerald-700" />;
      default: return <Lightbulb size={16} className="text-gold-700" />;
    }
  };

  const getColor = (type: Insight['type']) => {
    switch (type) {
      case 'historical': return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'theological': return 'bg-indigo-50 border-indigo-200 text-indigo-900';
      case 'linguistic': return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      default: return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
        <h2 className="font-bold text-stone-800 flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-gold-500" />
          AI Insights
        </h2>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {insights.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="bg-white p-4 rounded-full inline-flex mb-4 shadow-sm">
              <Lightbulb size={32} className="text-stone-300" />
            </div>
            <p className="text-stone-500 text-sm">
              Click "Analyze" in the editor to generate insights based on your current notes.
            </p>
          </div>
        ) : (
          insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-4 rounded-lg border shadow-sm flex flex-col gap-3 transition-all hover:shadow-md ${getColor(insight.type)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide opacity-80">
                  {getIcon(insight.type)}
                  {insight.type}
                </div>
                <button 
                  onClick={() => onAddToNote(insight)}
                  className="text-stone-400 hover:text-stone-700 hover:bg-white/50 p-1 rounded transition-colors"
                  title="Add to note for comparison"
                >
                  <PlusCircle size={18} />
                </button>
              </div>
              
              <div>
                <h3 className="font-bold text-sm mb-1 leading-snug">{insight.title}</h3>
                <p className="text-sm leading-relaxed opacity-90 font-serif">{insight.description}</p>
              </div>

              {insight.reference && (
                <div className="text-xs pt-2 border-t border-black/5 font-medium flex items-center gap-1 opacity-70">
                  <Book size={12} />
                  {insight.reference}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 bg-stone-100 border-t border-stone-200 text-xs text-stone-500 text-center">
        AI results may vary. Always verify with primary sources.
      </div>
    </div>
  );
};

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
    </svg>
  )
}