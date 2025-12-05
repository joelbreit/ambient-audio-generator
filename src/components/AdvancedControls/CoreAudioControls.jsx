import { getColorLabel } from "../../utils/helpers";
import InfoButton from "../InfoButton";
import { controlExplanations } from "../../utils/controlExplanations";

const CoreAudioControls = ({ params, onUpdateParam }) => {
	return (
		<div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl p-5 border border-blue-500 border-opacity-20">
			<h3 className="text-lg font-semibold mb-4 text-blue-400">
				🎚️ Core Audio
			</h3>

			<div className="space-y-4">
				<div>
					<label className="block mb-2 text-sm text-slate-300">
						Master Volume
						<InfoButton
							controlKey="volume"
							explanations={controlExplanations}
						/>
						<span className="float-right text-slate-400">
							{params.volume}%
						</span>
					</label>
					<input
						type="range"
						min="0"
						max="100"
						value={params.volume}
						onChange={(e) =>
							onUpdateParam("volume", parseInt(e.target.value))
						}
						className="w-full"
					/>
				</div>

				<div>
					<label className="block mb-2 text-sm text-slate-300">
						Color
						<InfoButton
							controlKey="color"
							explanations={controlExplanations}
						/>
						<span className="float-right text-slate-400">
							{getColorLabel(params.color)}
						</span>
					</label>
					<input
						type="range"
						min="5"
						max="50"
						value={params.color}
						onChange={(e) =>
							onUpdateParam("color", parseInt(e.target.value))
						}
						className="w-full"
					/>
				</div>

				<div>
					<label className="block mb-2 text-sm text-slate-300">
						Bass Boost
						<InfoButton
							controlKey="bassBoost"
							explanations={controlExplanations}
						/>
						<span className="float-right text-slate-400">
							+{params.bassBoost}dB
						</span>
					</label>
					<input
						type="range"
						min="0"
						max="10"
						value={params.bassBoost}
						onChange={(e) =>
							onUpdateParam("bassBoost", parseInt(e.target.value))
						}
						className="w-full"
					/>
				</div>

				<div>
					<label className="block mb-2 text-sm text-slate-300">
						High Cut
						<InfoButton
							controlKey="highCut"
							explanations={controlExplanations}
						/>
						<span className="float-right text-slate-400">
							{(params.highCut / 1000).toFixed(1)}kHz
						</span>
					</label>
					<input
						type="range"
						min="2000"
						max="16000"
						step="500"
						value={params.highCut}
						onChange={(e) =>
							onUpdateParam("highCut", parseInt(e.target.value))
						}
						className="w-full"
					/>
				</div>
			</div>
		</div>
	);
};

export default CoreAudioControls;
