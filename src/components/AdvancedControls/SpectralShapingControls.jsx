const SpectralShapingControls = ({ params, onUpdateParam }) => {
	return (
		<div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl p-5 border border-purple-500 border-opacity-20">
			<h3 className="text-lg font-semibold mb-4 text-purple-400">
				🔊 Spectral Shaping
			</h3>

			<div className="space-y-4">
				<div>
					<label className="block mb-2 text-sm text-slate-300">
						Speech Masking (250-500Hz)
						<span className="float-right text-slate-400">
							+{params.speechMask}dB
						</span>
					</label>
					<input
						type="range"
						min="0"
						max="10"
						value={params.speechMask}
						onChange={(e) =>
							onUpdateParam("speechMask", parseInt(e.target.value))
						}
						className="w-full"
					/>
				</div>

				<div>
					<label className="block mb-2 text-sm text-slate-300">
						Presence (2-4kHz)
						<span className="float-right text-slate-400">
							+{params.presence}dB
						</span>
					</label>
					<input
						type="range"
						min="0"
						max="10"
						value={params.presence}
						onChange={(e) =>
							onUpdateParam("presence", parseInt(e.target.value))
						}
						className="w-full"
					/>
				</div>
			</div>
		</div>
	);
};

export default SpectralShapingControls;

