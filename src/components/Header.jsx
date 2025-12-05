const Header = () => {
	return (
		<div className="text-center mb-8">
			<h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
				🎧 Ambient Audio Generator
			</h1>
			<p className="text-slate-400 text-sm">
				Advanced focus-optimized audio with psychoacoustic processing
			</p>
			<p className="text-slate-500 text-xs mt-1">
				Press Space to play/pause • Use presets for instant optimization
			</p>
		</div>
	);
};

export default Header;

