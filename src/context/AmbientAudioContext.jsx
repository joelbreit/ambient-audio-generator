import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { presets } from "../utils/presets";

const AmbientAudioContext = createContext(null);

export const useAmbientAudioContext = () => {
	const context = useContext(AmbientAudioContext);
	if (!context) {
		throw new Error(
			"useAmbientAudioContext must be used within AmbientAudioProvider"
		);
	}
	return context;
};

export const AmbientAudioProvider = ({ children }) => {
	// State
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentPreset, setCurrentPreset] = useState("deepFocus");
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [isFading, setIsFading] = useState(false);
	const [params, setParams] = useState(presets.deepFocus.params);
	const [timer, setTimer] = useState({
		active: false,
		remaining: 0,
		duration: 30,
	});
	const [favorites, setFavorites] = useState([]);

	// Load favorites from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem("brownNoiseFavorites");
		if (saved) {
			setFavorites(JSON.parse(saved));
		}
	}, []);

	// Load preset
	const loadPreset = useCallback((presetKey) => {
		if (presetKey === "custom") {
			setCurrentPreset("custom");
			return;
		}

		const preset = presets[presetKey];
		setParams(preset.params);
		setCurrentPreset(presetKey);
	}, []);

	// Update param
	const updateParam = useCallback((key, value) => {
		setParams((prev) => ({ ...prev, [key]: value }));
		setCurrentPreset("custom");
	}, []);

	// Toggle param
	const toggleParam = useCallback(
		(key) => {
			setParams((prev) => ({ ...prev, [key]: !prev[key] }));
			setCurrentPreset("custom");
		},
		[]
	);

	// Cancel timer
	const cancelTimer = useCallback(() => {
		setTimer((prev) => ({ active: false, remaining: 0, duration: prev.duration }));
	}, []);

	// Save favorite
	const saveFavorite = useCallback(() => {
		setFavorites((prevFavorites) => {
			const favorite = {
				name: `Custom ${prevFavorites.length + 1}`,
				params: { ...params },
				timestamp: Date.now(),
			};
			const newFavorites = [...prevFavorites, favorite];
			localStorage.setItem(
				"brownNoiseFavorites",
				JSON.stringify(newFavorites)
			);
			return newFavorites;
		});
	}, [params]);

	const deleteFavorite = useCallback((index) => {
		setFavorites((prevFavorites) => {
			const newFavorites = prevFavorites.filter((_, i) => i !== index);
			localStorage.setItem(
				"brownNoiseFavorites",
				JSON.stringify(newFavorites)
			);
			return newFavorites;
		});
	}, []);

	const loadFavorite = useCallback((favParams) => {
		setParams(favParams);
		setCurrentPreset("custom");
	}, []);

	const value = {
		// State
		isPlaying,
		setIsPlaying,
		currentPreset,
		setCurrentPreset,
		showAdvanced,
		setShowAdvanced,
		isFading,
		setIsFading,
		params,
		setParams,
		timer,
		setTimer,
		favorites,
		// Actions
		loadPreset,
		updateParam,
		toggleParam,
		cancelTimer,
		saveFavorite,
		deleteFavorite,
		loadFavorite,
	};

	return (
		<AmbientAudioContext.Provider value={value}>
			{children}
		</AmbientAudioContext.Provider>
	);
};
