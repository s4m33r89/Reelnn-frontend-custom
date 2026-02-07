import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface content {
  id: string;
  title: string;
  year: number;
  poster: string;
  vote_average: number;
  media_type: string;
}

interface contentCardProps {
  content: content;
}

export const Card: React.FC<contentCardProps> = ({ content }) => {
  const [isHovered, setIsHovered] = useState(false);

  // --- CRASH FIXES ---
  const safeRating = typeof content.vote_average === 'number' ? content.vote_average.toFixed(1) : "0.0";
  const safeYear = content.year || "";
  const safeTitle = content.title || "Untitled";
  
  // Use a fallback image if poster is null
  const posterSrc = content.poster 
    ? `https://image.tmdb.org/t/p/w500${content.poster}`
    : `https://via.placeholder.com/500x750?text=No+Poster`;

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer w-full bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative aspect-[2/3] w-full">
        <motion.div
          className="w-full h-full relative"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={posterSrc}
            alt={safeTitle}
            fill
            sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 200px"
            className="object-cover"
            unoptimized
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-white text-xs font-bold">{safeRating}</span>
        </div>

        {/* Year Badge */}
        {safeYear && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded px-2 py-1">
            {safeYear}
          </div>
        )}

        {/* Hover State: Play Button & Title */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-red-600 rounded-full p-3 mb-4 shadow-lg">
                 <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div className="absolute bottom-0 w-full p-3 text-center">
                <h3 className="text-white text-sm font-bold truncate px-2">{safeTitle}</h3>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};