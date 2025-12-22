import React, { useEffect, useRef, useCallback } from "react";
import {
	AmbientAudioProvider,
	useAmbientAudioContext,
} from "../context/AmbientAudioContext";
import { useAmbientAudio } from "../hooks/useAmbientAudio";
import { presets } from "../utils/presets";
import Header from "./Header";
import VisualizationCanvas from "./VisualizationCanvas";
import PlayButton from "./PlayButton";
import TimerControls from "./TimerControls";
import PresetsGrid from "./PresetsGrid";
import AdvancedControls from "./AdvancedControls";
import CustomPresetSave from "./CustomPresetSave";
import FavoritesList from "./FavoritesList";

const AmbientAudioGeneratorContent = () => {
	const {
		isPlaying,
		setIsPlaying,
		currentPreset,
		showAdvanced,
		setShowAdvanced,
		isFading,
		setIsFading,
		params,
		timer,
		setTimer,
		favorites,
		loadPreset,
		updateParam,
		toggleParam,
		startTimer,
		cancelTimer,
		saveFavorite,
		deleteFavorite,
		loadFavorite,
	} = useAmbientAudioContext();

	const timerIntervalRef = useRef(null);

	// Audio hook
	const {
		analyserNodeRef,
		sourceNodeRef,
		initAudio,
		startAudio: startAudioHook,
		stopAudio: stopAudioHook,
		fadeVolume,
	} = useAmbientAudio(params, isPlaying, setIsFading);

	// Toggle play
	const togglePlay = useCallback(() => {
		if (!isPlaying) {
			initAudio();
			startAudioHook();
			setIsPlaying(true);
		} else {
			stopAudioHook();
			setIsPlaying(false);
		}
	}, [isPlaying, initAudio, startAudioHook, stopAudioHook, setIsPlaying]);

	// Load preset with audio restart
	const handleLoadPreset = useCallback(
		(presetKey) => {
			loadPreset(presetKey);
			if (presetKey !== "custom" && isPlaying) {
				stopAudioHook(true);
				setTimeout(() => {
					initAudio();
					startAudioHook();
				}, 100);
			}
		},
		[loadPreset, isPlaying, stopAudioHook, initAudio, startAudioHook]
	);

	// Update param with audio handling
	const handleUpdateParam = useCallback(
		(key, value) => {
			updateParam(key, value);

			// Handle real-time updates vs restart needed
			if (key === "volume") {
				if (!isFading) {
					fadeVolume(value / 100, 0.5);
				}
			} else if (
				[
					"color",
					"modDepth",
					"modSpeed",
					"stereo",
					"ampMod",
					"fletcherMunson",
					"resonance",
				].includes(key)
			) {
				if (isPlaying) {
					stopAudioHook(true);
					setTimeout(() => {
						initAudio();
						startAudioHook();
					}, 100);
				}
			}
		},
		[
			updateParam,
			isFading,
			fadeVolume,
			isPlaying,
			stopAudioHook,
			initAudio,
			startAudioHook,
		]
	);

	// Timer with audio integration
	const handleStartTimer = useCallback(
		(minutes) => {
			if (timerIntervalRef.current) {
				clearInterval(timerIntervalRef.current);
			}

			setTimer({
				active: true,
				remaining: minutes * 60,
				duration: minutes,
			});

			timerIntervalRef.current = setInterval(() => {
				setTimer((prev) => {
					const newRemaining = prev.remaining - 1;

					if (newRemaining <= 0) {
						clearInterval(timerIntervalRef.current);
						if (isPlaying) {
							stopAudioHook();
							setIsPlaying(false);
						}
						return {
							active: false,
							remaining: 0,
							duration: prev.duration,
						};
					}

					// Fade out in last 10 seconds
					if (newRemaining <= 10 && isPlaying) {
						fadeVolume(0, 10);
					}

					return { ...prev, remaining: newRemaining };
				});
			}, 1000);
		},
		[setTimer, isPlaying, stopAudioHook, setIsPlaying, fadeVolume]
	);

	const handleCancelTimer = useCallback(() => {
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
		}
		cancelTimer();
	}, [cancelTimer]);

	// Load favorite
	const handleLoadFavorite = useCallback(
		(favParams) => {
			loadFavorite(favParams);
			if (isPlaying) {
				stopAudioHook(true);
				setTimeout(() => {
					initAudio();
					startAudioHook();
				}, 100);
			}
		},
		[loadFavorite, isPlaying, stopAudioHook, initAudio, startAudioHook]
	);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.code === "Space" && e.target.tagName !== "INPUT") {
				e.preventDefault();
				togglePlay();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [togglePlay]);

	// Cleanup
	useEffect(() => {
		return () => {
			stopAudioHook(true);
			if (timerIntervalRef.current) {
				clearInterval(timerIntervalRef.current);
			}
		};
	}, [stopAudioHook]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-5">
			<div className="w-full max-w-7xl">
				<Header />

				<VisualizationCanvas
					analyserNodeRef={analyserNodeRef}
					isPlaying={isPlaying}
					sourceNodeRef={sourceNodeRef}
				/>

				{/* Play Button & Timer */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<PlayButton
						isPlaying={isPlaying}
						onTogglePlay={togglePlay}
					/>
					<TimerControls
						timer={timer}
						onStartTimer={handleStartTimer}
						onCancelTimer={handleCancelTimer}
					/>
				</div>

				<PresetsGrid
					presets={presets}
					currentPreset={currentPreset}
					onLoadPreset={handleLoadPreset}
				/>

				<AdvancedControls
					showAdvanced={showAdvanced}
					onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
					params={params}
					onUpdateParam={handleUpdateParam}
					onToggleParam={toggleParam}
				/>

				{currentPreset === "custom" && (
					<CustomPresetSave onSaveFavorite={saveFavorite} />
				)}

				<FavoritesList
					favorites={favorites}
					onLoadFavorite={handleLoadFavorite}
					onDeleteFavorite={deleteFavorite}
				/>

				<div className="mt-6 text-sm opacity-70 text-center">
					Created by Joel Breit (
					<a
						href="https://joelbreit.com"
						target="_blank"
						rel="noreferrer"
						className="underline"
					>
						joelbreit.com
					</a>
					)
					<div>
						{/* GitHub */}
						Source code available on{" "}
						<a
							href="https://github.com/joelbreit/ambient-audio-generator"
							target="_blank"
							rel="noreferrer"
							className="underline"
						>
							GitHub
						</a>
						{/* MIT License */}.
					</div>
					<div>
						{" "}
						<a
							href="https://opensource.org/licenses/MIT"
							target="_blank"
							rel="noreferrer"
							className="underline"
						>
							MIT License
						</a>{" "}
						(free to use and modify)
					</div>
				</div>
			</div>
		</div>
	);
};

const AmbientAudioGenerator = () => {
	return (
		<AmbientAudioProvider>
			<AmbientAudioGeneratorContent />
		</AmbientAudioProvider>
	);
};

export default AmbientAudioGenerator;
