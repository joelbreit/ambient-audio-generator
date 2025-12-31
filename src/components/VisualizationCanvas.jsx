import { useEffect, useRef, useCallback } from "react";

const VisualizationCanvas = ({
	analyserNodeRef,
	isPlaying,
	sourceNodeRef,
	maxFreq = 22000,
}) => {
	const canvasRef = useRef(null);
	const animationFrameRef = useRef(null);
	const fadeOutStartTimeRef = useRef(null);
	const lastFrequencyDataRef = useRef(null);
	const lastTimeDomainDataRef = useRef(null);
	const FADE_OUT_DURATION = 2000; // 2 seconds to match audio fade-out

	// Enhanced visualization with multiple display modes
	const visualize = useCallback(() => {
		const analyserNode = analyserNodeRef?.current;
		const hasActiveAudio = sourceNodeRef?.current !== null;
		const now = Date.now();

		if (!canvasRef.current || !analyserNode) {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
			return;
		}

		// Calculate fade-out progress (0 to 1)
		let opacity = 1;
		if (fadeOutStartTimeRef.current !== null) {
			const fadeElapsed = now - fadeOutStartTimeRef.current;
			if (fadeElapsed >= FADE_OUT_DURATION) {
				// Fade-out complete - clear canvas and stop
				const canvas = canvasRef.current;
				const ctx = canvas.getContext("2d");
				const width = canvas.width / window.devicePixelRatio;
				const height = canvas.height / window.devicePixelRatio;
				ctx.fillStyle = "rgba(15, 23, 42, 1)";
				ctx.fillRect(0, 0, width, height);

				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
					animationFrameRef.current = null;
				}
				fadeOutStartTimeRef.current = null;
				return;
			}
			opacity = 1 - fadeElapsed / FADE_OUT_DURATION;
		}

		// Continue with visualization during fade-out or when playing (even if source node is temporarily null during restart)
		// This allows the visualization to continue smoothly during parameter changes that require audio restart
		const shouldVisualize =
			hasActiveAudio ||
			(fadeOutStartTimeRef.current !== null && opacity > 0) ||
			(isPlaying && lastFrequencyDataRef.current !== null);

		if (!shouldVisualize) {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
			return;
		}

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const bufferLength = analyserNode.frequencyBinCount;
		const sampleRate = analyserNode.context.sampleRate;
		const nyquist = sampleRate / 2;

		// Calculate which bars to show based on max frequency
		// Each frequency bin represents: (binIndex / frequencyBinCount) * nyquist
		// So the bin index for max frequency is: (max frequency / nyquist) * frequencyBinCount
		const maxBinIndex = Math.min(
			Math.floor((maxFreq / nyquist) * bufferLength),
			bufferLength - 1
		);

		// Calculate how many bars to show
		// Each bar samples: dataIndex = Math.floor((i * bufferLength) / barCount)
		// We want the last bar to correspond to maxBinIndex
		// So: maxBarIndex = (maxBinIndex * barCount) / bufferLength
		const barCount = 128;
		const maxBarIndex = Math.min(
			Math.floor((maxBinIndex * barCount) / bufferLength),
			barCount - 1
		);

		console.log("maxBarIndex", maxBarIndex);

		// Initialize storage for last frame if needed
		if (!lastFrequencyDataRef.current) {
			lastFrequencyDataRef.current = new Uint8Array(bufferLength);
		}
		if (!lastTimeDomainDataRef.current) {
			lastTimeDomainDataRef.current = new Uint8Array(bufferLength);
		}

		let frequencyData, timeDomainData;

		// Get data only if source node exists, otherwise use last frame with fade
		if (hasActiveAudio) {
			frequencyData = new Uint8Array(bufferLength);
			timeDomainData = new Uint8Array(bufferLength);
			analyserNode.getByteFrequencyData(frequencyData);
			analyserNode.getByteTimeDomainData(timeDomainData);
			// Store last frame for fade-out
			lastFrequencyDataRef.current.set(frequencyData);
			lastTimeDomainDataRef.current.set(timeDomainData);
		} else {
			// During fade-out, use stored last frame
			frequencyData = lastFrequencyDataRef.current;
			timeDomainData = lastTimeDomainDataRef.current;
		}

		const width = canvas.width / window.devicePixelRatio;
		const height = canvas.height / window.devicePixelRatio;

		// Clear with fade effect - increase fade opacity as visualization fades out
		const clearOpacity = 0.25 + (1 - opacity) * 0.75;
		ctx.fillStyle = `rgba(15, 23, 42, ${clearOpacity})`;
		ctx.fillRect(0, 0, width, height);

		// Draw frequency bars with gradient and opacity fade
		// Only draw bars up to maxBarIndex, but scale them to fill the full width
		const visibleBarCount = maxBarIndex + 1;
		const barWidth = width / visibleBarCount;

		for (let i = 0; i <= maxBarIndex; i++) {
			const dataIndex = Math.floor((i * bufferLength) / barCount);
			const barHeight =
				(frequencyData[dataIndex] / 255) * height * 0.8 * opacity;

			// Create gradient for each bar with opacity applied
			const gradient = ctx.createLinearGradient(
				0,
				height,
				0,
				height - barHeight
			);
			const hue = 200 + (i / barCount) * 60;
			gradient.addColorStop(
				0,
				`hsla(${hue}, 80%, 50%, ${0.8 * opacity})`
			);
			gradient.addColorStop(
				1,
				`hsla(${hue}, 90%, 65%, ${0.9 * opacity})`
			);

			ctx.fillStyle = gradient;
			ctx.fillRect(
				i * barWidth,
				height - barHeight,
				barWidth - 1,
				barHeight
			);
		}

		// Draw waveform overlay with opacity fade
		// Note: Waveform is time-domain data, so we show it across the full width
		ctx.beginPath();
		ctx.strokeStyle = `rgba(96, 165, 250, ${0.5 * opacity})`;
		ctx.lineWidth = 2;

		const sliceWidth = width / bufferLength;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			const v = timeDomainData[i] / 128.0;
			const y = (v * height) / 2;

			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		ctx.stroke();

		animationFrameRef.current = requestAnimationFrame(visualize);
	}, [analyserNodeRef, sourceNodeRef, isPlaying, maxFreq]);

	// Start visualization when playing begins - loop continues during fade-out
	useEffect(() => {
		const now = Date.now();

		if (isPlaying) {
			// Reset fade-out when starting to play
			fadeOutStartTimeRef.current = null;
			lastFrequencyDataRef.current = null;
			lastTimeDomainDataRef.current = null;
		} else if (
			!isPlaying &&
			fadeOutStartTimeRef.current === null &&
			analyserNodeRef?.current
		) {
			// Pause just pressed - start fade-out timer
			fadeOutStartTimeRef.current = now;
		}

		if (
			(isPlaying || fadeOutStartTimeRef.current !== null) &&
			analyserNodeRef?.current &&
			!animationFrameRef.current
		) {
			// Start visualization when playing begins or during fade-out
			// The loop itself will check source node existence and continue during fade-out
			visualize();
		}
		// Don't cleanup here - let the loop stop itself when fade-out completes
	}, [isPlaying, analyserNodeRef, visualize]);

	// Cleanup on unmount only
	useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
		};
	}, []);

	// Canvas resize
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth * window.devicePixelRatio;
			canvas.height = canvas.offsetHeight * window.devicePixelRatio;
			const ctx = canvas.getContext("2d");
			ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
		return () => window.removeEventListener("resize", resizeCanvas);
	}, []);

	return (
		<div className="bg-slate-900 bg-opacity-60 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-blue-500 border-opacity-20 shadow-2xl">
			<canvas
				ref={canvasRef}
				className="w-full h-56 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900"
			/>
		</div>
	);
};

export default VisualizationCanvas;
