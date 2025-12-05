import { useRef, useCallback, useEffect } from "react";

export const useAmbientAudio = (params, isPlaying, setIsFading) => {
	// Refs for audio nodes
	const audioContextRef = useRef(null);
	const sourceNodeRef = useRef(null);
	const gainNodeRef = useRef(null);
	const analyserNodeRef = useRef(null);
	const speechMaskFilterRef = useRef(null);
	const presenceFilterRef = useRef(null);
	const bassFilterRef = useRef(null);
	const highCutFilterRef = useRef(null);
	const resonanceFiltersRef = useRef([]);
	const dynamicCompressorRef = useRef(null);
	const animationFrameRef = useRef(null);
	const targetVolumeRef = useRef(params.volume / 100);

	// Initialize audio context with all nodes
	const initAudio = useCallback(() => {
		if (!audioContextRef.current) {
			audioContextRef.current = new (window.AudioContext ||
				window.webkitAudioContext)();

			// Analyser
			analyserNodeRef.current = audioContextRef.current.createAnalyser();
			analyserNodeRef.current.fftSize = 4096;
			analyserNodeRef.current.smoothingTimeConstant = 0.8;

			// Master gain
			gainNodeRef.current = audioContextRef.current.createGain();
			gainNodeRef.current.gain.value = params.volume / 100;

			// Bass boost filter
			bassFilterRef.current =
				audioContextRef.current.createBiquadFilter();
			bassFilterRef.current.type = "lowshelf";
			bassFilterRef.current.frequency.value = 150;
			bassFilterRef.current.gain.value = params.bassBoost;

			// High cut filter
			highCutFilterRef.current =
				audioContextRef.current.createBiquadFilter();
			highCutFilterRef.current.type = "lowpass";
			highCutFilterRef.current.frequency.value = params.highCut;
			highCutFilterRef.current.Q.value = 0.7;

			// Speech masking filter
			speechMaskFilterRef.current =
				audioContextRef.current.createBiquadFilter();
			speechMaskFilterRef.current.type = "peaking";
			speechMaskFilterRef.current.frequency.value = 375;
			speechMaskFilterRef.current.Q.value = 1.5;
			speechMaskFilterRef.current.gain.value = params.speechMask;

			// Presence filter
			presenceFilterRef.current =
				audioContextRef.current.createBiquadFilter();
			presenceFilterRef.current.type = "peaking";
			presenceFilterRef.current.frequency.value = 3000;
			presenceFilterRef.current.Q.value = 1.2;
			presenceFilterRef.current.gain.value = params.presence;

			// Dynamic compression for smooth dynamics
			dynamicCompressorRef.current =
				audioContextRef.current.createDynamicsCompressor();
			dynamicCompressorRef.current.threshold.value = -24;
			dynamicCompressorRef.current.knee.value = 30;
			dynamicCompressorRef.current.ratio.value = 3;
			dynamicCompressorRef.current.attack.value = 0.003;
			dynamicCompressorRef.current.release.value = 0.25;

			// Resonance filters
			resonanceFiltersRef.current = [];
			for (let i = 0; i < 3; i++) {
				const filter = audioContextRef.current.createBiquadFilter();
				filter.type = "peaking";
				filter.frequency.value = 200 + i * 400;
				filter.Q.value = 0.7;
				filter.gain.value = 1.5;
				resonanceFiltersRef.current.push(filter);
			}
		}
	}, [params.volume, params.bassBoost, params.highCut, params.speechMask, params.presence]);

	// Generate buffer with improved algorithm
	const createNoiseBuffer = useCallback(() => {
		const bufferSize = audioContextRef.current.sampleRate * 60; // 60 second buffer for less repetition
		const buffer = audioContextRef.current.createBuffer(
			2,
			bufferSize,
			audioContextRef.current.sampleRate
		);

		for (let channel = 0; channel < 2; channel++) {
			const data = buffer.getChannelData(channel);
			let lastOut = 0;
			const color = params.color / 1000;

			// Add slight natural variations in the color parameter over time
			const colorModRate = (2 * Math.PI) / bufferSize;

			for (let i = 0; i < bufferSize; i++) {
				const white = Math.random() * 2 - 1;

				// Slightly varying color over the buffer (very subtle)
				const colorVariation =
					color * (1 + Math.sin(i * colorModRate * 0.001) * 0.05);

				// Brown noise algorithm
				data[i] =
					(lastOut + colorVariation * white) / (1 + colorVariation);
				lastOut = data[i];

				// Fletcher-Munson compensation
				if (params.fletcherMunson) {
					data[i] *= 1.2;
				}

				// Stereo decorrelation with phase variation
				if (channel === 1 && params.stereo > 0) {
					const decorrelation =
						(Math.random() * 2 - 1) * 0.15 * (params.stereo / 100);
					data[i] += decorrelation;
				}

				// Amplitude modulation with multiple LFOs for organic feel
				if (params.ampMod) {
					const modRate1 =
						(2 * Math.PI) /
						(audioContextRef.current.sampleRate * params.modSpeed);
					const modRate2 =
						(2 * Math.PI) /
						(audioContextRef.current.sampleRate *
							params.modSpeed *
							1.618); // Golden ratio
					const modRate3 =
						(2 * Math.PI) /
						(audioContextRef.current.sampleRate *
							params.modSpeed *
							0.5);

					const mod1 = Math.sin(i * modRate1) * 0.4;
					const mod2 = Math.sin(i * modRate2) * 0.35;
					const mod3 = Math.sin(i * modRate3) * 0.25;

					const modulation =
						1 + (mod1 + mod2 + mod3) * (params.modDepth / 100);
					data[i] *= modulation;
				}
			}
		}

		return buffer;
	}, [
		params.color,
		params.fletcherMunson,
		params.stereo,
		params.ampMod,
		params.modSpeed,
		params.modDepth,
	]);

	// Smooth fade in/out for volume changes
	const fadeVolume = useCallback(
		(targetVolume, duration = 2) => {
			if (!gainNodeRef.current) return;

			setIsFading(true);
			const currentTime = audioContextRef.current.currentTime;
			gainNodeRef.current.gain.cancelScheduledValues(currentTime);
			gainNodeRef.current.gain.setValueAtTime(
				gainNodeRef.current.gain.value,
				currentTime
			);
			gainNodeRef.current.gain.linearRampToValueAtTime(
				targetVolume,
				currentTime + duration
			);

			setTimeout(() => setIsFading(false), duration * 1000);
		},
		[setIsFading]
	);

	// Animate resonance filters with more complex patterns
	const animateResonance = useCallback(() => {
		if (!isPlaying || !params.resonance) return;

		const time = Date.now() / 1000;

		resonanceFiltersRef.current.forEach((filter, index) => {
			const baseFreq = 200 + index * 400;
			// Multiple sine waves at different rates for complex drift
			const drift1 = Math.sin(time / (5 + index)) * 40;
			const drift2 = Math.sin(time / (8 + index * 0.5)) * 25;
			const drift3 = Math.cos(time / (12 + index * 0.3)) * 15;
			filter.frequency.value = baseFreq + drift1 + drift2 + drift3;

			// Slightly varying Q for more organic feel
			filter.Q.value = 0.6 + Math.sin(time / (10 + index * 0.7)) * 0.2;
		});

		requestAnimationFrame(animateResonance);
	}, [isPlaying, params.resonance]);

	// Start audio with fade-in
	const startAudio = useCallback(() => {
		if (audioContextRef.current.state === "suspended") {
			audioContextRef.current.resume();
		}

		sourceNodeRef.current = audioContextRef.current.createBufferSource();
		sourceNodeRef.current.buffer = createNoiseBuffer();
		sourceNodeRef.current.loop = true;

		// Build audio chain
		let currentNode = sourceNodeRef.current;

		// Bass boost
		currentNode.connect(bassFilterRef.current);
		currentNode = bassFilterRef.current;

		// High cut
		currentNode.connect(highCutFilterRef.current);
		currentNode = highCutFilterRef.current;

		// Speech masking
		currentNode.connect(speechMaskFilterRef.current);
		currentNode = speechMaskFilterRef.current;

		// Presence
		currentNode.connect(presenceFilterRef.current);
		currentNode = presenceFilterRef.current;

		// Resonance filters
		if (params.resonance) {
			for (const filter of resonanceFiltersRef.current) {
				currentNode.connect(filter);
				currentNode = filter;
			}
		}

		// Compression
		currentNode.connect(dynamicCompressorRef.current);
		currentNode = dynamicCompressorRef.current;

		// Master gain
		currentNode.connect(gainNodeRef.current);

		// Analyser and output
		gainNodeRef.current.connect(analyserNodeRef.current);
		analyserNodeRef.current.connect(audioContextRef.current.destination);

		sourceNodeRef.current.start();

		// Fade in
		gainNodeRef.current.gain.setValueAtTime(
			0,
			audioContextRef.current.currentTime
		);
		fadeVolume(targetVolumeRef.current, 3);

		if (params.resonance) {
			animateResonance();
		}
	}, [
		createNoiseBuffer,
		params.resonance,
		animateResonance,
		fadeVolume,
	]);

	// Stop audio with fade-out
	const stopAudio = useCallback(
		(immediate = false) => {
			if (sourceNodeRef.current) {
				if (immediate) {
					sourceNodeRef.current.stop();
					sourceNodeRef.current.disconnect();
					sourceNodeRef.current = null;
				} else {
					fadeVolume(0, 2);
					setTimeout(() => {
						if (sourceNodeRef.current) {
							sourceNodeRef.current.stop();
							sourceNodeRef.current.disconnect();
							sourceNodeRef.current = null;
						}
					}, 2000);
				}
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		},
		[fadeVolume]
	);

	// Update filter values in real-time when params change
	useEffect(() => {
		if (speechMaskFilterRef.current) {
			speechMaskFilterRef.current.gain.value = params.speechMask;
		}
	}, [params.speechMask]);

	useEffect(() => {
		if (presenceFilterRef.current) {
			presenceFilterRef.current.gain.value = params.presence;
		}
	}, [params.presence]);

	useEffect(() => {
		if (bassFilterRef.current) {
			bassFilterRef.current.gain.value = params.bassBoost;
		}
	}, [params.bassBoost]);

	useEffect(() => {
		if (highCutFilterRef.current) {
			highCutFilterRef.current.frequency.value = params.highCut;
		}
	}, [params.highCut]);

	useEffect(() => {
		if (targetVolumeRef.current) {
			targetVolumeRef.current = params.volume / 100;
		}
	}, [params.volume]);

	return {
		audioContextRef,
		analyserNodeRef,
		sourceNodeRef,
		gainNodeRef,
		speechMaskFilterRef,
		presenceFilterRef,
		bassFilterRef,
		highCutFilterRef,
		animationFrameRef,
		targetVolumeRef,
		initAudio,
		startAudio,
		stopAudio,
		fadeVolume,
	};
};

