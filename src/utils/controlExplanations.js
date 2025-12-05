// Control explanations extracted from Explanation.md
export const controlExplanations = {
	// Core Audio Controls
	volume: {
		title: "Master Volume",
		description: "Overall output level. Adjust based on your environment and other audio sources.",
		details: "Uses smooth exponential fading (3s fade-in, 2s fade-out) to prevent jarring transitions.",
	},
	color: {
		title: "Color",
		description: "Controls the frequency distribution of the noise.",
		details: "Lower values (5-10): Dark brown - more bass, very rumbling. Mid values (10-20): Brown - balanced low-frequency energy. Higher values (20-30): Pink-brown - more balanced across spectrum. Very high (30-50): Pink-white - brighter, more high-frequency content. The coefficient determines how quickly energy falls off at higher frequencies. Lower = steeper rolloff = darker sound.",
	},
	bassBoost: {
		title: "Bass Boost",
		description: "Enhances low-frequency energy below 150Hz.",
		details: "Adds warmth and fullness. Helps mask low-frequency rumble (HVAC, traffic). Creates more 'enveloping' sensation. Use for noisy environments with bass sources, preference for deeper sound, or sleep mode (low frequencies are less cognitively demanding). Technical: Low-shelf filter at 150Hz.",
	},
	highCut: {
		title: "High Cut",
		description: "Removes high frequencies above the set point.",
		details: "High frequencies can be fatiguing over long periods. Different tasks benefit from different brightness levels. Sleep requires less high-frequency content. Settings: 2-4kHz (very dark, sleep-focused), 4-8kHz (warm, relaxed focus), 8-12kHz (balanced, general use), 12-16kHz (bright, full spectrum). Technical: Low-pass filter with 0.7 Q (gentle rolloff).",
	},

	// Spectral Shaping Controls
	speechMask: {
		title: "Speech Masking",
		description: "Boosts energy in the primary speech intelligibility range (250-500Hz).",
		details: "This is where human speech has most of its power. Consonants and vowel fundamentals live here. Boosting this range makes speech less intelligible without blocking it entirely. Use in open office environments, coffee shops, or anywhere with conversation noise. Speech intelligibility drops dramatically when this range is masked. Technical: Peaking filter, Q=1.5 for moderate bandwidth.",
	},
	presence: {
		title: "Presence Boost",
		description: "Adds energy in the 'presence' region (2-4kHz).",
		details: "Human hearing is most sensitive here (survival mechanism - baby cries, screams). Keyboard clicks, notification sounds, sharp noises occupy this range. Many distracting sounds have energy here. Use in offices with mechanical keyboard users, environments with notification sounds, or situations with intermittent sharp noises. Trade-off: Too much can be fatiguing; use moderately. Technical: Peaking filter, Q=1.2 for presence range coverage.",
	},

	// Variation Controls
	ampMod: {
		title: "Amplitude Modulation",
		description: "Creates slow, gentle volume changes over time.",
		details: "Prevents complete habituation. Mimics natural environmental sounds (wind, waves, rain). Keeps your auditory system gently engaged without distraction. Disable for sleep (you want maximum consistency), if you find any variation distracting, or very analytical work requiring deep concentration.",
	},
	modDepth: {
		title: "Modulation Depth",
		description: "Controls how much the volume varies.",
		details: "Settings: 0-1dB (barely perceptible, subtle organic feel), 1-2dB (noticeable but gentle, good for most use), 2-3dB (clear variation, more 'alive' feeling), 3-4dB (strong variation, almost wave-like). Sweet spot: 1.5dB for most users. Technical note: Uses three overlapping LFOs at different rates (1x, 1.618x golden ratio, 0.5x) for non-repeating complexity.",
	},
	modSpeed: {
		title: "Modulation Speed",
		description: "Controls how fast the volume changes cycle.",
		details: "Settings: 20-40s (faster cycling, more dynamic, stimulating), 40-80s (balanced, natural pace like slow breathing), 80-180s (very slow, almost imperceptible, meditative). Research basis: Optimal LFO rates for non-distraction are 30-90 seconds. Use faster for creative work or restless focus. Use slower for deep work, meditation, or sleep preparation.",
	},

	// Perceptual Controls
	fletcherMunson: {
		title: "Fletcher-Munson Compensation",
		description: "Adjusts frequency balance to match human hearing sensitivity.",
		details: "Human ears are less sensitive to very low and very high frequencies. Equal physical loudness ≠ equal perceived loudness. Fletcher-Munson curves show we need more bass/treble for equal perception. This boosts the overall signal slightly and adjusts the spectrum so all frequencies feel equally present. Disable if you prefer a more natural, unprocessed sound. On by default for more balanced, less fatiguing listening experience.",
	},
	resonance: {
		title: "Resonance Zones",
		description: "Adds three slowly drifting resonant peaks that mimic acoustic spaces.",
		details: "Pure mathematical noise sounds 'synthetic'. Real environments have resonances (room modes, reflections). Resonances make the sound feel more natural and spatial. Technical: Three filters at 200Hz, 600Hz, 1000Hz. Each drifts ±40-80Hz using complex sine wave combinations. Q values also modulate slightly (0.4-0.8). Creates sense of the sound 'breathing' in a space. Disable if you prefer pure, 'clean' noise, the variation feels distracting, or for technical/analytical listening.",
	},
	stereo: {
		title: "Stereo Width",
		description: "Controls how different the left and right channels are.",
		details: "Settings: 0-20% (nearly mono, centered, focused), 20-50% (subtle width, gentle immersion), 50-70% (clear stereo field, enveloping), 70-100% (wide, diffuse, spacious). Use lower for focus work, headphone fatigue, or mono environments. Use higher for relaxation, creative work, or immersive experience. Technical: Adds decorrelated noise to right channel, weighted by stereo %. Note: Too much width can be disorienting or distracting.",
	},
};

