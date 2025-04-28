"use client";

import { useState, useEffect } from 'react';
import schools from '@/data/schools';
import SchoolCard from './SchoolCard';

export default function SchoolsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSchools, setFilteredSchools] = useState(schools);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate a small delay for better UX
    const timer = setTimeout(() => {
      const results = schools.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.summary_description && 
         school.summary_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (school.address_summary && 
         school.address_summary.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      setFilteredSchools(results);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by school name, description, or location..."
            className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {searchTerm && (
            <button 
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div>
            {filteredSchools.length > 0 ? (
              <p>Showing {filteredSchools.length} of {schools.length} schools</p>
            ) : (
              <p>No schools found</p>
            )}
          </div>
          
          {searchTerm && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              Search results for: "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading results...</p>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-lg mb-1">No schools found matching your search</p>
          <p className="text-gray-500 text-sm">Try using different keywords or broaden your search</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school, index) => {
            // Find the original index in the schools array
            const originalIndex = schools.findIndex(s => s.name === school.name);
            return (
              <div key={index} className="animate-slide-up" style={{animationDelay: `${index * 0.05}s`}}>
                <SchoolCard school={school} index={originalIndex} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 