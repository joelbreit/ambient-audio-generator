import { Play, Pause } from "lucide-react";

const PlayButton = ({ isPlaying, onTogglePlay }) => {
	return (
		<button
			onClick={onTogglePlay}
			className={`py-3 px-6 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-2 ${
				isPlaying
					? "bg-slate-800 hover:bg-slate-700 border border-slate-700"
					: "bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/30"
			} transform hover:scale-105 active:scale-95`}
		>
			{isPlaying ? (
				<>
					<Pause className="w-5 h-5" />
					Pause Audio
				</>
			) : (
				<>
					<Play className="w-5 h-5" />
					Start Audio
				</>
			)}
		</button>
	);
};

export default PlayButton;
