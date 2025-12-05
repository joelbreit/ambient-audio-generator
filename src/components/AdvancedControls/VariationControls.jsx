import InfoButton from "../InfoButton";
import { controlExplanations } from "../../utils/controlExplanations";
import { Waves } from "lucide-react";

const VariationControls = ({ params, onUpdateParam, onToggleParam }) => {
	return (
		<div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl p-5 border border-pink-500 border-opacity-20">
			<h3 className="text-lg font-semibold mb-4 text-pink-400 flex items-center gap-2">
				<Waves className="w-5 h-5" />
				Variation
			</h3>

			<div className="space-y-4">
				<div>
					<label className="flex items-center justify-between mb-2 text-sm text-slate-300">
						<span className="flex items-center">
							Modulation
							<InfoButton
								controlKey="ampMod"
								explanations={controlExplanations}
							/>
						</span>
						<div
							onClick={() => onToggleParam("ampMod")}
							className={`w-12 h-6 rounded-full cursor-pointer transition-all ${
								params.ampMod ? "bg-pink-500" : "bg-slate-600"
							} relative`}
						>
							<div
								className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
									params.ampMod ? "right-0.5" : "left-0.5"
								}`}
							/>
						</div>
					</label>
				</div>

				<div>
					<label className="block mb-2 text-sm text-slate-300">
						Mod Depth
						<InfoButton
							controlKey="modDepth"
							explanations={controlExplanations}
						/>
						<span className="float-right text-slate-400">
							{(params.modDepth / 10).toFixed(1)}dB
						</span>
					</label>
					<input
						type="range"
						min="0"
						max="40"
						value={params.modDepth}
						onChange={(e) =>
							onUpdateParam("modDepth", parseInt(e.target.value))
						}
						className="w-full"
					/>
				</div>

				<div>
					<label className="block mb-2 text-sm text-slate-300">
						Mod Speed
						<InfoButton
							controlKey="modSpeed"
							explanations={controlExplanations}
						/>
						<span className="float-right text-slate-400">
							{params.modSpeed}s
						</span>
					</label>
					<input
						type="range"
						min="20"
						max="180"
						value={params.modSpeed}
						onChange={(e) =>
							onUpdateParam("modSpeed", parseInt(e.target.value))
						}
						className="w-full"
					/>
				</div>
			</div>
		</div>
	);
};

export default VariationControls;
