'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  getSchoolNotes, 
  addSchoolNote, 
  updateSchoolNote, 
  deleteSchoolNote,
  SchoolNote
} from '@/lib/schoolStore';

type SchoolNotesProps = {
  schoolId: number;
};

export default function SchoolNotes({ schoolId }: SchoolNotesProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<SchoolNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, [user, schoolId]);

  const loadNotes = async () => {
    setIsLoading(true);
    if (user) {
      const schoolNotes = await getSchoolNotes(schoolId, user);
      setNotes(schoolNotes);
    } else {
      setNotes([]);
    }
    setIsLoading(false);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to add notes');
      return;
    }
    
    if (!newNote.trim()) return;
    
    try {
      const note = await addSchoolNote(schoolId, newNote, user);
      if (note) {
        setNotes(prev => [...prev, note]);
        setNewNote('');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEditNote = (note: SchoolNote) => {
    setEditingNoteId(note.id);
    setEditedNote(note.note);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditedNote('');
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editedNote.trim()) return;
    
    try {
      const success = await updateSchoolNote(noteId, editedNote, user);
      if (success) {
        setNotes(prev => 
          prev.map(note => 
            note.id === noteId 
              ? { ...note, note: editedNote, updatedAt: new Date() } 
              : note
          )
        );
        setEditingNoteId(null);
        setEditedNote('');
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        const success = await deleteSchoolNote(noteId, user);
        if (success) {
          setNotes(prev => prev.filter(note => note.id !== noteId));
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Notes</h2>
        <p className="text-gray-600">Please login to add and view your notes for this school.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-blue-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Notes</h2>
      
      {isLoading ? (
        <p className="text-gray-600">Loading notes...</p>
      ) : (
        <>
          {notes.length === 0 ? (
            <p className="text-gray-600 mb-4">You don't have any notes for this school yet.</p>
          ) : (
            <div className="space-y-4 mb-6">
              {notes.map(note => (
                <div key={note.id} className="bg-white p-4 rounded-md shadow-sm">
                  {editingNoteId === note.id ? (
                    <div>
                      <textarea
                        value={editedNote}
                        onChange={e => setEditedNote(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateNote(note.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 whitespace-pre-wrap">{note.note}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-blue-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddNote} className="mt-4">
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={!newNote.trim()}
              >
                Add Note
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
} 