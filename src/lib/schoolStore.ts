import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { User } from 'firebase/auth';

export interface SchoolNote {
  id: string;
  schoolId: number;
  userId: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoriteSchool {
  id: string;
  schoolId: number;
  userId: string;
  createdAt: Date;
}

// Helper to get user document reference
const getUserDocRef = (userId: string) => {
  return doc(db, 'users', userId);
};

// Helper to get school favorites document reference
const getFavoriteDocRef = (userId: string, schoolId: number) => {
  return doc(db, 'favorites', `${userId}_${schoolId}`);
};

// Helper to get note document reference
const getNoteDocRef = (noteId: string) => {
  return doc(db, 'notes', noteId);
};

// Check if a school is favorited
export const isSchoolFavorited = async (schoolId: number, user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const favoriteRef = getFavoriteDocRef(user.uid, schoolId);
    const favoriteDoc = await getDoc(favoriteRef);
    return favoriteDoc.exists();
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Toggle favorite status
export const toggleFavorite = async (schoolId: number, user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const favoriteRef = getFavoriteDocRef(user.uid, schoolId);
    const favoriteDoc = await getDoc(favoriteRef);
    
    if (favoriteDoc.exists()) {
      // Remove from favorites
      await deleteDoc(favoriteRef);
      return false;
    } else {
      // Add to favorites
      await setDoc(favoriteRef, {
        schoolId,
        userId: user.uid,
        createdAt: new Date()
      });
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};

// Get all favorite schools
export const getFavoriteSchools = async (user: User | null): Promise<number[]> => {
  if (!user) return [];
  
  try {
    const favoritesQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(favoritesQuery);
    const favoriteIds: number[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      favoriteIds.push(data.schoolId);
    });
    
    return favoriteIds;
  } catch (error) {
    console.error('Error getting favorite schools:', error);
    return [];
  }
};

// Get notes for a school
export const getSchoolNotes = async (schoolId: number, user: User | null): Promise<SchoolNote[]> => {
  if (!user) return [];
  
  try {
    const notesQuery = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid),
      where('schoolId', '==', schoolId)
    );
    
    const querySnapshot = await getDocs(notesQuery);
    const notes: SchoolNote[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notes.push({
        id: doc.id,
        schoolId: data.schoolId,
        userId: data.userId,
        note: data.note,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      });
    });
    
    return notes;
  } catch (error) {
    console.error('Error getting school notes:', error);
    return [];
  }
};

// Add a note to a school
export const addSchoolNote = async (schoolId: number, note: string, user: User | null): Promise<SchoolNote | null> => {
  if (!user || !note.trim()) return null;
  
  try {
    const noteRef = doc(collection(db, 'notes'));
    const now = new Date();
    
    const noteData: Omit<SchoolNote, 'id'> = {
      schoolId,
      userId: user.uid,
      note,
      createdAt: now,
      updatedAt: now
    };
    
    await setDoc(noteRef, noteData);
    
    return {
      id: noteRef.id,
      ...noteData
    };
  } catch (error) {
    console.error('Error adding school note:', error);
    return null;
  }
};

// Update a note
export const updateSchoolNote = async (noteId: string, note: string, user: User | null): Promise<boolean> => {
  if (!user || !note.trim()) return false;
  
  try {
    const noteRef = getNoteDocRef(noteId);
    const noteDoc = await getDoc(noteRef);
    
    if (!noteDoc.exists()) return false;
    
    const noteData = noteDoc.data();
    
    // Verify the note belongs to the user
    if (noteData.userId !== user.uid) return false;
    
    await updateDoc(noteRef, {
      note,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating school note:', error);
    return false;
  }
};

// Delete a note
export const deleteSchoolNote = async (noteId: string, user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const noteRef = getNoteDocRef(noteId);
    const noteDoc = await getDoc(noteRef);
    
    if (!noteDoc.exists()) return false;
    
    const noteData = noteDoc.data();
    
    // Verify the note belongs to the user
    if (noteData.userId !== user.uid) return false;
    
    await deleteDoc(noteRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting school note:', error);
    return false;
  }
}; 