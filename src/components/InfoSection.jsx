import { FlaskConical } from "lucide-react";

const InfoSection = () => {
	return (
		<div className="bg-slate-800 bg-opacity-40 backdrop-blur-xl rounded-2xl p-5 border border-blue-500 border-opacity-10">
			<h3 className="text-sm font-semibold mb-2 text-blue-400 flex items-center gap-2">
				<FlaskConical className="w-4 h-4" />
				Active Technologies
			</h3>
			<div className="flex flex-wrap gap-2 mb-3">
				<span className="px-3 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-full text-xs">
					60s Buffer (No Loops)
				</span>
				<span className="px-3 py-1 bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-30 rounded-full text-xs">
					Multi-LFO Modulation
				</span>
				<span className="px-3 py-1 bg-pink-500 bg-opacity-20 border border-pink-500 border-opacity-30 rounded-full text-xs">
					Dynamic Compression
				</span>
				<span className="px-3 py-1 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-full text-xs">
					Psychoacoustic EQ
				</span>
				<span className="px-3 py-1 bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-full text-xs">
					Resonance Drift
				</span>
				<span className="px-3 py-1 bg-cyan-500 bg-opacity-20 border border-cyan-500 border-opacity-30 rounded-full text-xs">
					Smooth Fades
				</span>
			</div>
			<p className="text-slate-400 text-xs leading-relaxed">
				This advanced generator uses multiple overlapping modulation
				sources, extended buffers to prevent pattern detection, dynamic
				range compression for consistent loudness, Fletcher-Munson
				compensation, targeted frequency masking for common
				distractions, and slowly drifting resonance filters that add
				natural spatial character—all scientifically designed to
				maximize focus while minimizing listening fatigue.
			</p>
		</div>
	);
};

export default InfoSection;
