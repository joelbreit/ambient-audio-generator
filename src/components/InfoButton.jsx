import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

const InfoButton = ({ controlKey, explanations }) => {
	const [isOpen, setIsOpen] = useState(false);
	const buttonRef = useRef(null);
	const tooltipRef = useRef(null);
	const hoverTimeoutRef = useRef(null);

	const explanation = explanations[controlKey];
	if (!explanation) return null;

	// Close tooltip when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				tooltipRef.current &&
				buttonRef.current &&
				!tooltipRef.current.contains(event.target) &&
				!buttonRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
		};
	}, [isOpen]);

	const handleMouseEnter = () => {
		hoverTimeoutRef.current = setTimeout(() => {
			setIsOpen(true);
		}, 300); // Small delay to avoid accidental triggers
	};

	const handleMouseLeave = () => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}
		setIsOpen(false);
	};

	return (
		<div className="relative inline-block ml-2">
			<button
				ref={buttonRef}
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 bg-opacity-30 hover:bg-opacity-50 text-blue-300 hover:text-blue-200 text-xs font-semibold transition-all cursor-help"
				aria-label={`Info about ${explanation.title}`}
			>
				<Info className="w-4 h-4" />
			</button>

			{isOpen && (
				<div
					ref={tooltipRef}
					className="absolute z-50 w-72 p-4 bg-slate-900 bg-opacity-95 backdrop-blur-xl rounded-lg border border-blue-500 border-opacity-30 shadow-2xl text-sm text-slate-200 left-0 top-6 mb-2"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<h4 className="font-semibold text-blue-400 mb-2">
						{explanation.title}
					</h4>
					<p className="text-slate-300 mb-2">
						{explanation.description}
					</p>
					{explanation.details && (
						<p className="text-slate-400 text-xs leading-relaxed">
							{explanation.details}
						</p>
					)}
					<div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-500 border-opacity-30" />
				</div>
			)}
		</div>
	);
};

export default InfoButton;
