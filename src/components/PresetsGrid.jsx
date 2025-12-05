const PresetsGrid = ({ presets, currentPreset, onLoadPreset }) => {
	return (
		<div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-blue-500 border-opacity-20">
			<h3 className="text-lg font-semibold mb-4 text-blue-400">
				🎯 Quick Presets
			</h3>
			<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
				{Object.entries(presets).map(([key, preset]) => (
					<button
						key={key}
						onClick={() => onLoadPreset(key)}
						className={`p-4 rounded-xl transition-all ${
							currentPreset === key
								? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
								: "bg-slate-700 hover:bg-slate-600"
						}`}
					>
						<div className="text-2xl mb-1">
							{preset.name.split(" ")[0]}
						</div>
						<div className="text-xs font-semibold">
							{preset.name.split(" ").slice(1).join(" ")}
						</div>
						<div className="text-xs text-slate-400 mt-1">
							{preset.description}
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default PresetsGrid;

