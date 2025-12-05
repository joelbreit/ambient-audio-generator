const PlayButton = ({ isPlaying, onTogglePlay }) => {
	return (
		<button
			onClick={onTogglePlay}
			className={`md:col-span-2 py-6 px-8 rounded-2xl text-xl font-bold transition-all ${
				isPlaying
					? "bg-gradient-to-r from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 shadow-xl shadow-red-500/30"
					: "bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/30"
			} transform hover:scale-105 active:scale-95`}
		>
			{isPlaying ? "⏸ Pause Audio" : "▶ Start Audio"}
		</button>
	);
};

export default PlayButton;

