import React from 'react';
import { Note } from '../types';
import { Trash2 } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ notes, activeNoteId, onSelect, onDelete }) => {
  if (notes.length === 0) {
    return <div className="p-4 text-sm text-stone-500 italic text-center mt-4">No notes yet. Create one to begin.</div>;
  }

  return (
    <ul className="divide-y divide-stone-300/50">
      {notes.map((note) => (
        <li key={note.id} className="group relative">
          <button
            onClick={() => onSelect(note.id)}
            className={`w-full text-left p-4 transition-colors ${
              activeNoteId === note.id 
                ? 'bg-white border-l-4 border-gold-500 shadow-sm' 
                : 'hover:bg-stone-200/50 border-l-4 border-transparent'
            }`}
          >
            <h3 className={`font-medium truncate pr-6 ${activeNoteId === note.id ? 'text-stone-900' : 'text-stone-700'}`}>
              {note.title || 'Untitled Note'}
            </h3>
            <p className="text-xs text-stone-500 mt-1 truncate">
              {note.content || 'No content'}
            </p>
            <span className="text-[10px] text-stone-400 mt-2 block">
              {new Date(note.updatedAt).toLocaleDateString()}
            </span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              if(window.confirm("Are you sure you want to delete this note?")) {
                onDelete(note.id);
              }
            }}
            className="absolute top-4 right-2 p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete note"
          >
            <Trash2 size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
};