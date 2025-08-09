import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareNodes, faTrashCan, faRotateRight, faFilter } from '@fortawesome/free-solid-svg-icons';
import Navbar from "../components/Navbar";
import axios from "axios";

function Gallery () {

  
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    favoritesOnly: false,
    fromDate: "",
    toDate: "",
  });

  const loadImages = async () => {
    try {
      setIsLoading(true);
      setError("");
      const r = await axios.get('http://localhost:3002/images', { withCredentials: true });
      setImages(r.data || []);
    } catch (err) {
      console.error('Load images error:', err);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadImages(); }, []);

  // Favorite
  const toggleFavorite = async (imageId, e) => {
    e.stopPropagation();
    try {
      const r = await axios.patch(`http://localhost:3002/images/${imageId}/favorite`, {}, { withCredentials: true });
      setImages(prev => prev.map(img => img.imageId === imageId ? { ...img, favorite: r.data.favorite } : img));
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  // Function to share an image (Web Share API with clipboard fallback)
  const shareImage = async (id, e) => {
    e.stopPropagation();
    const img = images.find(i => i.imageId === id);
    const url = img?.signedUrl || img?.imageUrl;
    if (!url) return;
    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch {}
  };

  // Delete
  const deleteImage = async (imageId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3002/images/${imageId}`, { withCredentials: true });
      setImages(prev => prev.filter(img => img.imageId !== imageId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Inclusive end-of-day timestamp for date filter
  const inclusiveEndOfDay = (dateStr) => {
    if (!dateStr) return Infinity;
    const d = new Date(dateStr);
    return d.getTime() + 24 * 60 * 60 * 1000 - 1;
  };

  // Filtering
  const filteredImages = useMemo(() => {
    const fromTs = filters.fromDate ? new Date(filters.fromDate).getTime() : -Infinity;
    const toTs = inclusiveEndOfDay(filters.toDate);
    return (images || [])
      .filter(img => (filters.favoritesOnly ? img.favorite : true))
      .filter(img => {
        const t = img.uploadDate ? new Date(img.uploadDate).getTime() : 0;
        return t >= fromTs && t <= toTs;
      });
  }, [images, filters]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Toolbar */}
        <div className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <FontAwesomeIcon icon={faFilter} />
              <span>Filters</span>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input type="checkbox" checked={filters.favoritesOnly} onChange={e => setFilters(f => ({...f, favoritesOnly: e.target.checked}))} />
              <span className="flex items-center gap-1"><FontAwesomeIcon icon={faHeart} className="text-pink-500"/> Favorites</span>
            </label>
            <div className="flex items-center gap-2">
              <input type="date" value={filters.fromDate} onChange={e => setFilters(f => ({...f, fromDate: e.target.value}))} className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded px-2 py-1 text-sm" />
              <span className="text-zinc-400">—</span>
              <input type="date" value={filters.toDate} onChange={e => setFilters(f => ({...f, toDate: e.target.value}))} className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded px-2 py-1 text-sm" />
            </div>
            <button onClick={() => setFilters({ favoritesOnly: false, fromDate: "", toDate: "" })} className="text-sm text-zinc-600 dark:text-zinc-300 hover:underline">Clear</button>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={loadImages} className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 text-sm">
                <FontAwesomeIcon icon={faRotateRight} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="container mx-auto px-4 mt-4">
            <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
          </div>
        )}

        {/* Gallery of images */}
        <div className="container mx-auto px-4 pt-8 pb-8 z-10 mt-36">
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && filteredImages.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-300">No images found.</div>
          )}

          {!isLoading && filteredImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((img, index) => {
                const src = img.signedUrl || img.imageUrl;
                const uploaded = img.uploadDate ? new Date(img.uploadDate) : null;
                return (
                  <div
                    key={img.imageId || index}
                    className="relative group rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer bg-white dark:bg-gray-900"
                    onClick={() => src && window.open(src, '_blank')}
                  >
                    <img
                      src={src}
                      alt={`Gallery item ${index + 1}`}
                      className="w-full h-56 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-black/50 text-white">
                      {uploaded ? uploaded.toLocaleString() : ''}
                    </div>
                    <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/40 to-transparent">
                      <button
                        title="Favorite"
                        className={`mr-2 rounded-full bg-white/90 px-3 py-2 ${img.favorite ? 'text-pink-600' : 'text-gray-700'}`}
                        onClick={(e) => toggleFavorite(img.imageId, e)}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      <button
                        title="Share"
                        className="mr-2 rounded-full bg-white/90 px-3 py-2 text-gray-700 hover:text-black"
                        onClick={(e) => shareImage(img.imageId, e)}
                      >
                        <FontAwesomeIcon icon={faShareNodes} />
                      </button>
                      <button
                        title="Delete"
                        className="rounded-full bg-white/90 px-3 py-2 text-gray-700 hover:text-black"
                        onClick={(e) => deleteImage(img.imageId, e)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Gallery;
