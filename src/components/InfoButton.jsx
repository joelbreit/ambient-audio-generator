import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

const InfoButton = ({ controlKey, explanations }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
	const buttonRef = useRef(null);
	const tooltipRef = useRef(null);
	const hoverTimeoutRef = useRef(null);

	const explanation = explanations[controlKey];
	if (!explanation) return null;

	// Calculate tooltip position when opening
	useEffect(() => {
		if (isOpen && buttonRef.current) {
			const buttonRect = buttonRef.current.getBoundingClientRect();
			const tooltipWidth = 288; // w-72 = 18rem = 288px
			const tooltipHeight = 200; // approximate height
			const spacing = 8; // spacing between button and tooltip

			let left = buttonRect.left;
			let top = buttonRect.bottom + spacing;

			// Check right edge overflow
			if (left + tooltipWidth > window.innerWidth - 16) {
				left = window.innerWidth - tooltipWidth - 16;
			}

			// Check left edge overflow
			if (left < 16) {
				left = 16;
			}

			// Check bottom edge overflow - flip to top if needed
			if (top + tooltipHeight > window.innerHeight - 16) {
				top = buttonRect.top - tooltipHeight - spacing;
			}

			// Ensure tooltip doesn't go above viewport
			if (top < 16) {
				top = 16;
			}

			setTooltipPosition({ top, left });
		}
	}, [isOpen]);

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

	const tooltipContent = isOpen && (
		<div
			ref={tooltipRef}
			className="fixed z-[9999] w-72 p-4 bg-slate-900 bg-opacity-95 backdrop-blur-xl rounded-lg border border-blue-500 border-opacity-30 shadow-2xl text-sm text-slate-200"
			style={{
				top: `${tooltipPosition.top}px`,
				left: `${tooltipPosition.left}px`,
			}}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<h4 className="font-semibold text-blue-400 mb-2">
				{explanation.title}
			</h4>
			<p className="text-slate-300 mb-2">{explanation.description}</p>
			{explanation.details && (
				<p className="text-slate-400 text-xs leading-relaxed">
					{explanation.details}
				</p>
			)}
			<div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-500 border-opacity-30" />
		</div>
	);

	return (
		<>
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
			</div>
			{createPortal(tooltipContent, document.body)}
		</>
	);
};

export default InfoButton;
