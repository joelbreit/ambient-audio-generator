import { useState } from "react";
import { Save } from "lucide-react";

const CustomPresetSave = ({ onSaveFavorite }) => {
	const [presetName, setPresetName] = useState("");

	const handleSave = () => {
		onSaveFavorite(presetName);
		setPresetName("");
	};

	return (
		<div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl p-5 mb-6 border border-yellow-500 border-opacity-20">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
							<Save className="w-5 h-5" />
							Custom Settings Active
						</h3>
						<p className="text-sm text-slate-400">
							Save this configuration for later use
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<input
						type="text"
						value={presetName}
						onChange={(e) => setPresetName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSave();
							}
						}}
						placeholder="Enter preset name (optional)"
						className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
					/>
					<button
						onClick={handleSave}
						className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl font-semibold transition-all"
					>
						Save as Favorite
					</button>
				</div>
			</div>
		</div>
	);
};

export default CustomPresetSave;
