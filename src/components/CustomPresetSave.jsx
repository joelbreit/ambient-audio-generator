const CustomPresetSave = ({ onSaveFavorite }) => {
	return (
		<div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl p-5 mb-6 border border-yellow-500 border-opacity-20">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-yellow-400">
						💾 Custom Settings Active
					</h3>
					<p className="text-sm text-slate-400">
						Save this configuration for later use
					</p>
				</div>
				<button
					onClick={onSaveFavorite}
					className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl font-semibold transition-all"
				>
					Save as Favorite
				</button>
			</div>
		</div>
	);
};

export default CustomPresetSave;

