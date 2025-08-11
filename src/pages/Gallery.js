import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faFilter,
  faHeart,
  faCalendarDays,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import GalleryItem from "../components/GalleryItem";
import axios from "axios";
import { useSelector } from "react-redux";

function Gallery() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    favoritesOnly: false,
    fromDate: "",
    toDate: "",
  });

  // Get night mode state from Redux
  const isDarkMode = useSelector((state) => state.nightToggle);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      setError("");
      const r = await axios.get("http://localhost:3002/images", { withCredentials: true });
      console.log("Loaded images:", r.data);
      setImages(r.data || []);
    } catch (err) {
      console.error("Load images error:", err);
      setError("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadImages(); }, []);

  const toggleFavorite = async (imageId, e) => {
    e.stopPropagation();
    console.log("Toggling favorite for imageId:", imageId);
    console.log("Current images:", images);
    
    try {
      const r = await axios.patch(
        `http://localhost:3002/images/${imageId}/favorite`,
        {},
        { withCredentials: true }
      );
      console.log("Favorite response:", r.data);
      
      setImages((prev) => {
        const updated = prev.map((img) => 
          (img.imageId === imageId || img._id === imageId) 
            ? { ...img, favorite: r.data.favorite } 
            : img
        );
        console.log("Updated images:", updated);
        return updated;
      });
    } catch (err) {
      console.error("Favorite error:", err);
      setError("Failed to update favorite status");
    }
  };

  const shareImage = async (id, e) => {
    e.stopPropagation();
    const img = images.find((i) => i.imageId === id || i._id === id);
    const url = img?.signedUrl || img?.imageUrl;
    if (!url) return;
    try {
      if (navigator.share) await navigator.share({ url });
      else if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(url);
    } catch {}
  };

  const deleteImage = async (imageId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3002/images/${imageId}`, { withCredentials: true });
      setImages((prev) => prev.filter((img) => 
        (img.imageId !== imageId && img._id !== imageId)
      ));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete image");
    }
  };

  // inclusive end-of-day for toDate
  const inclusiveEndOfDay = (dateStr) => {
    if (!dateStr) return Infinity;
    const d = new Date(dateStr);
    return d.getTime() + 24 * 60 * 60 * 1000 - 1;
  };

  const filteredImages = useMemo(() => {
    const fromTs = filters.fromDate ? new Date(filters.fromDate).getTime() : -Infinity;
    const toTs = inclusiveEndOfDay(filters.toDate);
    return (images || [])
      .filter((img) => (filters.favoritesOnly ? img.favorite : true))
      .filter((img) => {
        const t = img.uploadDate ? new Date(img.uploadDate).getTime() : 0;
        return t >= fromTs && t <= toTs;
      });
  }, [images, filters]);

  const hasAnyFilter = filters.favoritesOnly || filters.fromDate || filters.toDate;

  return (
    <>
      <Navbar />

      {/* SOLID page background (no grey haze) */}
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        {/* TOP BAR AREA */}
        <div className={`sticky top-0 z-30 backdrop-blur transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-slate-900/95 border-slate-700' 
            : 'bg-white/95 border-slate-200'
        }`}>
          <div className="px-4 py-5 flex justify-center">
            {/* AIRBNB-STYLE PILL */}
            <div className={`
              inline-block
              rounded-full shadow-lg ring-1 transition-colors duration-300
              px-3 py-2
              ${isDarkMode 
                ? 'bg-slate-800 ring-slate-700' 
                : 'bg-white ring-slate-200'
              }
            `}>
              <div className="
                flex items-center gap-3
              ">
                {/* Left side - filters */}
                <div className="flex items-center gap-3">
                  {/* Filters label */}
                  <button
                    className={`hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:bg-slate-700/60' 
                        : 'text-slate-800 hover:bg-slate-100/70'
                    }`}
                    title="Filters"
                  >
                    <FontAwesomeIcon icon={faFilter} className={isDarkMode ? 'text-white' : 'text-slate-800'} />
                    Filters
                  </button>

                  {/* divider */}
                  <span className={`hidden sm:block w-px h-6 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`} />

                  {/* Favorites segment (toggle pill) */}
                  <button
                    onClick={() => setFilters((f) => ({ ...f, favoritesOnly: !f.favoritesOnly }))}
                    className={`
                      inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
                      transition-colors
                      ${filters.favoritesOnly
                        ? isDarkMode 
                          ? "bg-white text-slate-800 shadow-md"
                          : "bg-rose-100 text-rose-700 border border-rose-200 shadow-md"
                        : isDarkMode 
                          ? "text-white hover:bg-slate-700/60" 
                          : "text-slate-800 hover:bg-slate-100/70"
                      }
                    `}
                    aria-pressed={filters.favoritesOnly}
                    title="Toggle favorites"
                  >
                    <FontAwesomeIcon icon={faHeart} className={
                      filters.favoritesOnly
                        ? isDarkMode 
                          ? 'text-slate-800' 
                          : 'text-rose-700'
                        : isDarkMode 
                          ? 'text-white' 
                          : 'text-slate-800'
                    } />
                    Favorites
                  </button>

                  {/* divider */}
                  <span className={`hidden sm:block w-px h-6 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`} />

                  {/* Date range segment - modernized */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                    isDarkMode 
                      ? 'text-white hover:bg-slate-700/60' 
                      : 'text-slate-800 hover:bg-slate-100/70'
                  }`}>
                    <FontAwesomeIcon icon={faCalendarDays} className="text-rose-500" />
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-slate-500'}`}>From</span>
                        <input
                          type="date"
                          value={filters.fromDate}
                          onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
                          className={`bg-transparent outline-none transition-colors text-xs w-24 ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}
                        />
                      </div>
                      <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-slate-500'}`}>-</span>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-slate-500'}`}>To</span>
                        <input
                          type="date"
                          value={filters.toDate}
                          onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
                          className={`bg-transparent outline-none transition-colors text-xs w-24 ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clear chip (shows only when something is set) */}
                  {hasAnyFilter && (
                    <button
                      onClick={() => setFilters({ favoritesOnly: false, fromDate: "", toDate: "" })}
                      className={`ml-1 hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                        isDarkMode 
                          ? 'text-white hover:bg-slate-700/60' 
                          : 'text-slate-700 hover:bg-slate-100/70'
                      }`}
                      title="Clear filters"
                    >
                      <FontAwesomeIcon icon={faCircleXmark} className={isDarkMode ? 'text-white' : 'text-slate-700'} />
                      Clear
                    </button>
                  )}
                </div>

                {/* Right side - refresh button */}
                <button
                  onClick={loadImages}
                  title="Refresh"
                  className={`
                    h-10 w-10 rounded-full grid place-items-center
                    font-semibold transition-all duration-300
                    bg-gradient-to-r from-rose-500 to-pink-600
                    hover:from-rose-600 hover:to-pink-700
                    active:scale-95 shadow-md
                  `}
                >
                  <FontAwesomeIcon 
                    icon={faRotateRight} 
                    className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 mt-4">
            <div className={`text-sm px-4 py-2 rounded-lg border transition-colors duration-300 ${
              isDarkMode 
                ? 'text-red-400 bg-red-900/20 border-red-800' 
                : 'text-red-600 bg-red-50 border-red-200'
            }`}>
              {error}
            </div>
          </div>
        )}

        {/* GRID */}
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden animate-pulse transition-colors duration-300 ${
                  isDarkMode ? 'bg-slate-700/60' : 'bg-slate-200/80'
                }`}>
                  <div className="h-56 md:h-64 lg:h-64 xl:h-72 w-full" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredImages.length === 0 && (
            <div className="text-center py-16">
              <div className={`text-lg font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {hasAnyFilter ? "No images match your filters." : "No images found."}
              </div>
              <div className={`text-sm mt-2 transition-colors duration-300 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {hasAnyFilter ? "Try adjusting your filters or upload some images." : "Upload some images to get started."}
              </div>
            </div>
          )}

          {!isLoading && filteredImages.length > 0 && (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((img, index) => (
                <GalleryItem
                  key={img.imageId || index}
                  img={img}
                  index={index}
                  onFavorite={toggleFavorite}
                  onShare={shareImage}
                  onDelete={deleteImage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Gallery;
