import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShareNodes, faTrashCan, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSelector } from "react-redux";

/**
 * Card with consistent row height + modern glass dock.
 * Accent color matches the filter bar's rose/pink gradient.
 */
function GalleryItem({ img, index, onFavorite, onShare, onDelete }) {
  const src = img.signedUrl || img.imageUrl;
  const uploaded = img.uploadDate ? new Date(img.uploadDate) : null;
  const [loaded, setLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Get night mode state from Redux
  const isDarkMode = useSelector((state) => state.nightToggle);

  // Debug logging
  console.log("GalleryItem render:", { img, favorite: img.favorite, imageId: img.imageId, _id: img._id });

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        shadow-sm hover:shadow-xl transition-all duration-300
        cursor-pointer border
        ${isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
        }
      `}
      onClick={() => src && window.open(src, "_blank")}
    >
      {/* Image area: decreased height, increased width for better proportions */}
      <div className="w-full h-56 md:h-64 lg:h-64 xl:h-72 relative">
        <img
          src={src}
          alt={`Gallery item ${index + 1}`}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-transform duration-300 ease-out
            ${loaded ? "scale-100" : "scale-[1.01]"}
            group-hover:scale-[1.03]
          `}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />

        {/* gradient layers for readability */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
      </div>

      {/* Favorite tag */}
      {img.favorite && (
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-rose-600 text-white shadow-md font-medium">
            <FontAwesomeIcon icon={faHeart} />
            Favorite
          </span>
        </div>
      )}

      {/* Date badge */}
      {uploaded && (
        <div className={`absolute left-3 bottom-3 text-[11px] px-2 py-1 rounded-full backdrop-blur-sm font-medium transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-slate-900/90 text-white' 
            : 'bg-black/70 text-white'
        }`}>
          {uploaded.toLocaleDateString()} · {uploaded.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      )}

      {/* Three dots menu button - bottom right */}
      <div className="absolute bottom-3 right-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className={`
            w-8 h-8 rounded-full grid place-items-center
            transition-all duration-200 backdrop-blur
            ${isDarkMode 
              ? 'bg-slate-800/90 text-white hover:bg-slate-700/90' 
              : 'bg-slate-800/90 text-white hover:bg-slate-700/90'
            }
            shadow-lg border
            ${isDarkMode ? 'border-slate-600/80' : 'border-slate-600/80'}
          `}
        >
          <FontAwesomeIcon icon={faEllipsis} className="text-sm" />
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div 
            className={`
              absolute bottom-full right-0 mb-2 w-32 rounded-lg shadow-xl
              backdrop-blur border transition-all duration-200
              ${isDarkMode 
                ? 'bg-slate-800/95 border-slate-600/80' 
                : 'bg-slate-800/95 border-slate-600/80'
              }
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Favorite option */}
            <button
              onClick={(e) => {
                const imageId = img.imageId || img._id;
                console.log("Favorite clicked for:", imageId);
                onFavorite(imageId, e);
                setShowMenu(false);
              }}
              className={`
                w-full px-3 py-2 text-left text-sm transition-colors
                flex items-center gap-2
                ${img.favorite
                  ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                  : isDarkMode
                    ? "text-white hover:bg-slate-700/60 hover:text-rose-400"
                    : "text-slate-700 hover:bg-slate-100/70 hover:text-rose-600"
                }
              `}
            >
              <FontAwesomeIcon icon={faHeart} />
              {img.favorite ? "Unfavorite" : "Favorite"}
            </button>

            {/* Share option */}
            <button
              onClick={(e) => {
                const imageId = img.imageId || img._id;
                onShare(imageId, e);
                setShowMenu(false);
              }}
              className={`
                w-full px-3 py-2 text-left text-sm transition-colors
                flex items-center gap-2
                ${isDarkMode
                  ? "text-white hover:bg-slate-700/60 hover:text-blue-400"
                  : "text-slate-700 hover:bg-slate-100/70 hover:text-blue-600"
                }
              `}
            >
              <FontAwesomeIcon icon={faShareNodes} />
              Share
            </button>

            {/* Delete option */}
            <button
              onClick={(e) => {
                const imageId = img.imageId || img._id;
                onDelete(imageId, e);
                setShowMenu(false);
              }}
              className={`
                w-full px-3 py-2 text-left text-sm transition-colors
                flex items-center gap-2
                ${isDarkMode
                  ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
                }
              `}
            >
              <FontAwesomeIcon icon={faTrashCan} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryItem;
