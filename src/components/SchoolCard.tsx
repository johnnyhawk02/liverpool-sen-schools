"use client";

import { useState, useEffect } from "react";
import { School } from "@/data/schools";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { isSchoolFavorited, toggleFavorite } from "@/lib/schoolStore";
import { getSchoolNotes } from "@/lib/schoolStore";

type SchoolCardProps = {
  school: School;
  index: number;
};

export default function SchoolCard({ school, index }: SchoolCardProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasNotes, setHasNotes] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFavoriteAndNotesStatus = async () => {
      setIsLoading(true);
      if (user) {
        // Check favorite status
        const favoriteResult = await isSchoolFavorited(index, user);
        setIsFavorite(favoriteResult);
        
        // Check notes status
        const notes = await getSchoolNotes(index, user);
        setHasNotes(notes.length > 0);
      }
      setIsLoading(false);
    };

    checkFavoriteAndNotesStatus();
  }, [user, index]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // If user is not logged in, prompt them to login
      alert("Please login to save favorites");
      return;
    }

    try {
      const result = await toggleFavorite(index, user);
      setIsFavorite(result);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 card-hover h-full flex flex-col">
      {/* Card Header with Name and Favorite Button */}
      <div className="p-6 pb-4 border-b border-gray-50">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            <Link href={`/schools/${index}`} className="hover:underline">
              {school.name}
            </Link>
          </h2>
          <button 
            onClick={handleToggleFavorite}
            className="text-2xl focus:outline-none transition-colors duration-200 p-1 hover:bg-gray-50 rounded-full"
            disabled={isLoading}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isLoading ? (
              <span className="text-gray-300">⭐</span>
            ) : isFavorite ? (
              <span className="text-yellow-400">⭐</span>
            ) : (
              <span className="text-gray-300 hover:text-yellow-400">☆</span>
            )}
          </button>
        </div>
        
        {school.summary_bold_info && (
          <div className="mt-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
            {school.summary_bold_info}
          </div>
        )}
      </div>
      
      {/* Card Body with School Info */}
      <div className="p-6 pt-4 flex-grow">
        {school.summary_description && (
          <div className="mb-4 text-sm text-gray-600 line-clamp-3">
            {school.summary_description}
          </div>
        )}
        
        {school.address_summary && (
          <div className="mb-4 text-sm">
            <div className="flex items-start">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600">{school.address_summary}</p>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-700">Contact Information</h3>
          </div>
          
          <div className="pl-6 space-y-1 text-sm">
            {school.phone.map((phoneNumber, idx) => (
              <div key={idx} className="text-gray-600 hover:text-blue-600 transition-colors">
                <a href={`tel:${phoneNumber}`} className="hover:underline">
                  {phoneNumber}
                </a>
              </div>
            ))}
            
            {school.email && (
              <div className="text-gray-600 hover:text-blue-600 transition-colors truncate">
                <a href={`mailto:${school.email}`} className="hover:underline">
                  {school.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Footer with Action Buttons */}
      <div className="p-6 pt-3 border-t border-gray-50 bg-gray-50 mt-auto">
        <div className="flex space-x-3">
          <Link 
            href={`/schools/${index}`}
            className="flex-1 flex justify-center items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Details
            {hasNotes && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Notes
              </span>
            )}
          </Link>
          
          <a 
            href={school.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Website
          </a>
        </div>
      </div>
    </div>
  );
} 