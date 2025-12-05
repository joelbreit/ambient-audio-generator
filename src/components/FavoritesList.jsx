const FavoritesList = ({ favorites, onLoadFavorite, onDeleteFavorite }) => {
	if (favorites.length === 0) return null;

	return (
		<div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl p-5 mb-6 border border-blue-500 border-opacity-20">
			<h3 className="text-lg font-semibold mb-4 text-blue-400">
				⭐ Your Favorites
			</h3>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				{favorites.map((fav, index) => (
					<div key={index} className="relative group">
						<button
							onClick={() => onLoadFavorite(fav.params)}
							className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all"
						>
							<div className="text-sm font-semibold">{fav.name}</div>
							<div className="text-xs text-slate-400 mt-1">
								{new Date(fav.timestamp).toLocaleDateString()}
							</div>
						</button>
						<button
							onClick={() => onDeleteFavorite(index)}
							className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
						>
							×
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default FavoritesList;

