import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareNodes, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function GalleryItem({ img, index, onFavorite, onShare, onDelete }) {
  const src = img.signedUrl || img.imageUrl;
  const uploaded = img.uploadDate ? new Date(img.uploadDate) : null;

  return (
    <div
      className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer bg-white dark:bg-gray-900"
      onClick={() => src && window.open(src, '_blank')}
    >
      <img
        src={src}
        alt={`Gallery item ${index + 1}`}
        className="w-full h-56 object-cover"
        loading="lazy"
      />
      {uploaded && (
        <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-black/50 text-white backdrop-blur-sm">
          {uploaded.toLocaleString()}
        </div>
      )}
      <div className="absolute inset-0 flex items-end justify-end gap-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/40 to-transparent">
        <button
          title="Favorite"
          className={`rounded-full bg-white/90 p-2 ${img.favorite ? 'text-pink-600' : 'text-gray-700'}`}
          onClick={(e) => onFavorite(img.imageId, e)}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
        <button
          title="Share"
          className="rounded-full bg-white/90 p-2 text-gray-700 hover:text-black"
          onClick={(e) => onShare(img.imageId, e)}
        >
          <FontAwesomeIcon icon={faShareNodes} />
        </button>
        <button
          title="Delete"
          className="rounded-full bg-white/90 p-2 text-gray-700 hover:text-black"
          onClick={(e) => onDelete(img.imageId, e)}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    </div>
  );
}

export default GalleryItem;
