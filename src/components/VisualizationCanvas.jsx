import { useEffect, useRef, useCallback } from "react";

const VisualizationCanvas = ({ analyserNodeRef, isPlaying }) => {
	const canvasRef = useRef(null);
	const animationFrameRef = useRef(null);

	// Enhanced visualization with multiple display modes
	const visualize = useCallback(() => {
		const analyserNode = analyserNodeRef?.current;
		if (!isPlaying || !canvasRef.current || !analyserNode) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const bufferLength = analyserNode.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		analyserNode.getByteFrequencyData(dataArray);

		const width = canvas.width / window.devicePixelRatio;
		const height = canvas.height / window.devicePixelRatio;

		// Clear with fade effect
		ctx.fillStyle = "rgba(15, 23, 42, 0.25)";
		ctx.fillRect(0, 0, width, height);

		// Draw frequency bars with gradient
		const barCount = 128;
		const barWidth = width / barCount;

		for (let i = 0; i < barCount; i++) {
			const dataIndex = Math.floor((i * bufferLength) / barCount);
			const barHeight = (dataArray[dataIndex] / 255) * height * 0.8;

			// Create gradient for each bar
			const gradient = ctx.createLinearGradient(
				0,
				height,
				0,
				height - barHeight
			);
			const hue = 200 + (i / barCount) * 60;
			gradient.addColorStop(0, `hsla(${hue}, 80%, 50%, 0.8)`);
			gradient.addColorStop(1, `hsla(${hue}, 90%, 65%, 0.9)`);

			ctx.fillStyle = gradient;
			ctx.fillRect(
				i * barWidth,
				height - barHeight,
				barWidth - 1,
				barHeight
			);
		}

		// Draw waveform overlay
		analyserNode.getByteTimeDomainData(dataArray);
		ctx.beginPath();
		ctx.strokeStyle = "rgba(96, 165, 250, 0.5)";
		ctx.lineWidth = 2;

		const sliceWidth = width / bufferLength;
		let x = 0;

		for (let i = 0; i < bufferLength; i++) {
			const v = dataArray[i] / 128.0;
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
	}, [isPlaying, analyserNodeRef]);

	// Start visualization when playing
	useEffect(() => {
		if (isPlaying && analyserNodeRef?.current) {
			visualize();
		} else {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isPlaying, analyserNodeRef, visualize]);

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

