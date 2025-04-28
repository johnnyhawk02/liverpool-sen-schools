"use client";

import { useState, useEffect } from 'react';

interface StarRatingProps {
  initialRating: number;
  schoolId: number;
  onRatingChange: (rating: number) => Promise<void>;
  isEditable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
  initialRating = 0,
  schoolId,
  onRatingChange,
  isEditable = true,
  size = 'md'
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleRatingChange = async (newRating: number) => {
    if (!isEditable || isLoading) return;
    
    try {
      setIsLoading(true);
      await onRatingChange(newRating);
      setRating(newRating);
    } catch (error) {
      console.error("Error updating rating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-lg';
      case 'lg': return 'text-3xl';
      default: return 'text-2xl';
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || rating);
        
        return (
          <button
            key={star}
            type="button"
            className={`${getSizeClasses()} focus:outline-none transition-colors duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : isEditable ? 'cursor-pointer' : 'cursor-default'
            } ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => handleRatingChange(star)}
            onMouseEnter={() => isEditable && setHover(star)}
            onMouseLeave={() => isEditable && setHover(0)}
            disabled={isLoading || !isEditable}
            aria-label={`Rate ${star} out of 5 stars`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
} 