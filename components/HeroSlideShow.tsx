import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { useHeroSlider } from "../context/HeroSliderContext";
import Navbar from "./Navbar";
import Link from "next/link";

const HeroSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { movies, isLoading, error } = useHeroSlider();
  
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length]);

  const currentMovie = movies[currentIndex];

  // Loading State
  if (isLoading) {
    return (
      <div className="relative w-full h-[50vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] bg-neutral-900">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-neutral-800 to-neutral-900"></div>
        <div className="relative z-20 h-full flex flex-col justify-end px-4 pt-20 pb-12">
           <div className="h-12 w-64 bg-neutral-700 rounded animate-pulse mb-4"></div>
        </div>
      </div>
    );
  }

  // Empty State (Prevents Crash)
  if (!currentMovie || movies.length === 0) {
    return (
      <div className="relative w-full h-[85vh] bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>No featured content available</p>
        </div>
      </div>
    );
  }

  // --- SAFE DATA EXTRACTION (CRASH FIXES) ---
  const safeYear = currentMovie.release_date ? currentMovie.release_date.substring(0, 4) : "";
  const safeRating = typeof currentMovie.vote_average === "number" ? currentMovie.vote_average.toFixed(1) : "0.0";
  const safeGenres = Array.isArray(currentMovie.genres) ? currentMovie.genres.slice(0, 2) : [];
  const safeTitle = currentMovie.title || "Untitled";
  const safeOverview = currentMovie.overview || "";
  const uniqueKey = currentMovie.id ? `movie-${currentMovie.id}` : `index-${currentIndex}`;

  return (
    <div className="font-mont relative w-full h-[85vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      <Navbar />

      {error && (
        <div className="absolute top-16 right-4 bg-red-500 text-white px-4 py-2 rounded z-50 text-sm">
          Warning: Content load error
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={uniqueKey}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute z-[2] w-full h-full bg-background/30 bg-gradient-to-b from-background/10 to-background" />
          
          {currentMovie.backdrop_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
              alt={safeTitle}
              fill
              style={{ objectFit: "cover", objectPosition: "center 20%" }}
              quality={90}
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-800" />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full flex flex-col justify-end px-4 sm:px-8 md:px-12 lg:px-16 pb-24 sm:pb-12 md:pb-16 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`info-${uniqueKey}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            {/* Title / Logo */}
            <div className="mb-4">
              {currentMovie.logo ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${currentMovie.logo}`}
                  alt={safeTitle}
                  width={300}
                  height={150}
                  className="object-contain w-48 sm:w-80 h-auto"
                  priority
                />
              ) : (
                <h1 className="text-3xl sm:text-5xl font-bold text-white">{safeTitle}</h1>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-white">
              <span className="bg-red-600 px-2 py-0.5 text-xs font-bold rounded">HD</span>
              <div className="flex items-center text-sm">
                <span className="text-yellow-400 mr-1">★</span>
                {safeRating}
              </div>
              <span className="text-sm">{safeYear}</span>
              {safeGenres.map((g, i) => (
                <span key={i} className="text-sm hidden sm:inline opacity-80">{g}</span>
              ))}
            </div>

            <p className="text-white/80 text-sm md:text-base mb-6 line-clamp-3 max-w-2xl">
              {safeOverview}
            </p>

            <div className="flex gap-4">
              <Link href={`/${currentMovie.type || 'movie'}/${currentMovie.id || ''}`}>
                <button className="flex items-center justify-center bg-white hover:bg-gray-200 text-black font-medium rounded-full w-12 h-12 transition">
                  <FaPlay size={18} className="ml-1" />
                </button>
              </Link>
              <Link href={`/${currentMovie.type || 'movie'}/${currentMovie.id || ''}`}>
                <button className="border border-white/30 hover:bg-white/10 text-white px-8 py-2.5 rounded-full transition">
                  More Info
                </button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-6" : "bg-white/40 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlideshow;