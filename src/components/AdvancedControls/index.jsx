import CoreAudioControls from "./CoreAudioControls";
import SpectralShapingControls from "./SpectralShapingControls";
import VariationControls from "./VariationControls";
import PerceptualControls from "./PerceptualControls";

const AdvancedControls = ({
	showAdvanced,
	onToggleAdvanced,
	params,
	onUpdateParam,
	onToggleParam,
}) => {
	return (
		<>
			<button
				onClick={onToggleAdvanced}
				className="w-full mb-4 py-3 bg-slate-800 bg-opacity-60 backdrop-blur-xl rounded-xl border border-blue-500 border-opacity-20 hover:bg-opacity-80 transition-all"
			>
				{showAdvanced ? "▼" : "▶"} Advanced Controls
			</button>

			{showAdvanced && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
					<CoreAudioControls params={params} onUpdateParam={onUpdateParam} />
					<SpectralShapingControls
						params={params}
						onUpdateParam={onUpdateParam}
					/>
					<VariationControls
						params={params}
						onUpdateParam={onUpdateParam}
						onToggleParam={onToggleParam}
					/>
					<PerceptualControls
						params={params}
						onUpdateParam={onUpdateParam}
						onToggleParam={onToggleParam}
					/>
				</div>
			)}
		</>
	);
};

export default AdvancedControls;

