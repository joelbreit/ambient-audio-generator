const formatTime = (seconds) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const TimerControls = ({ timer, onStartTimer, onCancelTimer }) => {
	return (
		<div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-2xl p-4 border border-blue-500 border-opacity-20">
			<div className="text-center mb-2">
				<label className="text-xs text-slate-400 block mb-2">
					Sleep Timer
				</label>
				{timer.active ? (
					<div>
						<div className="text-3xl font-bold text-blue-400 mb-2">
							{formatTime(timer.remaining)}
						</div>
						<button
							onClick={onCancelTimer}
							className="w-full py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition-colors"
						>
							Cancel Timer
						</button>
					</div>
				) : (
					<div className="flex gap-2">
						<button
							onClick={() => onStartTimer(15)}
							className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
						>
							15m
						</button>
						<button
							onClick={() => onStartTimer(30)}
							className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
						>
							30m
						</button>
						<button
							onClick={() => onStartTimer(60)}
							className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
						>
							60m
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default TimerControls;

