import InfoButton from "../InfoButton";
import { controlExplanations } from "../../utils/controlExplanations";

const PerceptualControls = ({ params, onUpdateParam, onToggleParam }) => {
	return (
		<div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl p-5 border border-green-500 border-opacity-20">
			<h3 className="text-lg font-semibold mb-4 text-green-400">
				🧠 Perceptual
			</h3>

			<div className="space-y-4">
				<div>
					<label className="flex items-center justify-between mb-2 text-sm text-slate-300">
						<span className="flex items-center">
							Fletcher-Munson
							<InfoButton
								controlKey="fletcherMunson"
								explanations={controlExplanations}
							/>
						</span>
						<div
							onClick={() => onToggleParam("fletcherMunson")}
							className={`w-12 h-6 rounded-full cursor-pointer transition-all ${
								params.fletcherMunson
									? "bg-green-500"
									: "bg-slate-600"
							} relative`}
						>
							<div
								className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
									params.fletcherMunson
										? "left-6.5"
										: "left-0.5"
								}`}
							/>
						</div>
					</label>
				</div>

				<div>
					<label className="flex items-center justify-between mb-2 text-sm text-slate-300">
						<span className="flex items-center">
							Resonance Zones
							<InfoButton
								controlKey="resonance"
								explanations={controlExplanations}
							/>
						</span>
						<div
							onClick={() => onToggleParam("resonance")}
							className={`w-12 h-6 rounded-full cursor-pointer transition-all ${
								params.resonance
									? "bg-green-500"
									: "bg-slate-600"
							} relative`}
						>
							<div
								className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
									params.resonance ? "left-6.5" : "left-0.5"
								}`}
							/>
						</div>
					</label>
				</div>

				<div>
					<label className="block mb-2 text-sm text-slate-300">
						Stereo Width
						<InfoButton
							controlKey="stereo"
							explanations={controlExplanations}
						/>
						<span className="float-right text-slate-400">
							{params.stereo}%
						</span>
					</label>
					<input
						type="range"
						min="0"
						max="100"
						value={params.stereo}
						onChange={(e) =>
							onUpdateParam("stereo", parseInt(e.target.value))
						}
						className="w-full"
					/>
				</div>
			</div>
		</div>
	);
};

export default PerceptualControls;
