'use client';

import { useState, useEffect } from "react";
import { School } from "@/data/schools";
import SchoolNotes from "@/components/SchoolNotes";
import { useAuth } from "@/context/AuthContext";
import { isSchoolFavorited, toggleFavorite } from "@/lib/schoolStore";
import { MapPin, Phone, Mail, Globe, Star, NotebookPen, AlertCircle } from "lucide-react";

type SchoolDetailProps = {
  school: School;
  schoolId: number;
};

export default function SchoolDetail({ school, schoolId }: SchoolDetailProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        const result = await isSchoolFavorited(schoolId, user);
        setIsFavorite(result);
      }
      setIsLoading(false);
    };

    checkFavoriteStatus();
  }, [user, schoolId]);

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Please login to save favorites");
      return;
    }

    try {
      setIsLoading(true);
      const result = await toggleFavorite(schoolId, user);
      setIsFavorite(result);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{school.name}</h1>
        <button 
          onClick={handleToggleFavorite}
          className="focus:outline-none transition-colors duration-200"
          disabled={isLoading}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isLoading ? (
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 animate-pulse">
              <Star className="w-5 h-5 text-gray-300" />
            </div>
          ) : isFavorite ? (
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-yellow-50">
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-yellow-50">
              <Star className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
            </div>
          )}
        </button>
      </div>
      
      {school.summary_bold_info && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-blue-800 font-medium">{school.summary_bold_info}</p>
          </div>
        </div>
      )}
      
      {school.summary_description && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">About the School</h2>
          <p className="text-gray-600 leading-relaxed">{school.summary_description}</p>
        </div>
      )}
      
      {school.address_summary && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Location</h2>
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">{school.address_summary}</p>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h2>
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
          <h3 className="text-md font-medium text-gray-700 mb-3">Phone Numbers</h3>
          <ul className="space-y-3">
            {school.phone.map((phoneNumber, index) => (
              <li key={index} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <a 
                  href={`tel:${phoneNumber}`} 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {phoneNumber}
                </a>
              </li>
            ))}
          </ul>
          
          {school.email && (
            <div className="mt-5">
              <h3 className="text-md font-medium text-gray-700 mb-3">Email</h3>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <a 
                  href={`mailto:${school.email}`} 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {school.email}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center my-10">
        <a 
          href={school.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-sm"
        >
          <Globe className="w-5 h-5 mr-2" />
          Visit School Website
        </a>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center mb-4">
          <NotebookPen className="w-5 h-5 text-gray-700 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Notes</h2>
        </div>
        <SchoolNotes schoolId={schoolId} />
      </div>
    </div>
  );
} 