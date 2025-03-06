import React, { useState, useEffect, useRef } from "react";

const AmbientAudioGenerator = () => {
  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [audioColor, setAudioColor] = useState(0.02);
  const [bassLevel, setBassLevel] = useState(3.5);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [timerDisplay, setTimerDisplay] = useState("");
  const [colorLabel, setColorLabel] = useState("Brown");

  // Refs
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const filterNodeRef = useRef(null);
  const ambientAudioNodeRef = useRef(null);
  const timerEndTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const waveRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize audio context
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = volume;
      gainNodeRef.current.connect(audioContextRef.current.destination);

      // Create filter node
      filterNodeRef.current = audioContextRef.current.createBiquadFilter();
      filterNodeRef.current.type = "lowpass";
      filterNodeRef.current.frequency.value = 1000;
      filterNodeRef.current.Q.value = 0.7;
      filterNodeRef.current.connect(gainNodeRef.current);
    }
  };

  // Generate audio
  const createAmbientAudio = () => {
    if (!audioContextRef.current) initAudio();

    // If there's already a running node, stop it
    if (ambientAudioNodeRef.current) {
      ambientAudioNodeRef.current.stop();
      ambientAudioNodeRef.current.disconnect();
    }

    ambientAudioNodeRef.current = audioContextRef.current.createBufferSource();

    // Create buffer for audio
    const bufferSize = audioContextRef.current.sampleRate * 5; // 5 seconds of audio
    const buffer = audioContextRef.current.createBuffer(
      1,
      bufferSize,
      audioContextRef.current.sampleRate
    );
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      // Audio algorithm with adjustable color
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + audioColor * white) / (1 + audioColor);
      lastOut = data[i];
      data[i] *= bassLevel; // Adjustable amplification
    }

    ambientAudioNodeRef.current.buffer = buffer;
    ambientAudioNodeRef.current.loop = true;

    // Connect nodes
    ambientAudioNodeRef.current.connect(filterNodeRef.current);

    return ambientAudioNodeRef.current;
  };

  // Play/pause toggle
  const togglePlay = () => {
    // Resume context if suspended (browser policy)
    if (
      audioContextRef.current &&
      audioContextRef.current.state === "suspended"
    ) {
      audioContextRef.current.resume();
    }

    if (!isPlaying) {
      initAudio();
      const audio = createAmbientAudio();
      audio.start();
      setIsPlaying(true);
      // Use setTimeout to ensure state update has happened before animation
      setTimeout(() => animateWave(true), 0);
    } else {
      if (ambientAudioNodeRef.current) {
        ambientAudioNodeRef.current.stop();
        ambientAudioNodeRef.current.disconnect();
        ambientAudioNodeRef.current = null;
      }
      setIsPlaying(false);
      animateWave(false);
    }
  };

  // Update volume
  const updateVolume = (newVolume) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  // Update audio color
  useEffect(() => {
    // Update color label
    if (audioColor <= 0.01) {
      setColorLabel("Dark Brown");
    } else if (audioColor <= 0.02) {
      setColorLabel("Brown");
    } else if (audioColor <= 0.03) {
      setColorLabel("Pink-Brown");
    } else if (audioColor <= 0.04) {
      setColorLabel("Pink");
    } else {
      setColorLabel("Pink-White");
    }

    // Recreate audio if playing
    if (isPlaying) {
      // Store the current play state
      const wasPlaying = isPlaying;

      // Stop the current sound
      if (ambientAudioNodeRef.current) {
        ambientAudioNodeRef.current.stop();
        ambientAudioNodeRef.current.disconnect();
        ambientAudioNodeRef.current = null;
      }

      // Start a new sound with updated parameters
      if (wasPlaying) {
        const audio = createAmbientAudio();
        audio.start();
      }
    }
  }, [audioColor, bassLevel, isPlaying]);

  // Timer functions
  const startTimer = () => {
    // Clear any existing timer
    clearInterval(timerIntervalRef.current);

    if (isNaN(timerMinutes) || timerMinutes <= 0) {
      setTimerDisplay("Please enter a valid time");
      return;
    }

    // Set end time
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + timerMinutes);
    timerEndTimeRef.current = endTime;

    // Update display immediately
    updateTimerDisplay();

    // Start interval to update display
    timerIntervalRef.current = setInterval(updateTimerDisplay, 1000);
  };

  const updateTimerDisplay = () => {
    if (!timerEndTimeRef.current) {
      setTimerDisplay("");
      return;
    }

    const now = new Date();
    const diff = timerEndTimeRef.current - now;

    if (diff <= 0) {
      // Timer ended
      clearInterval(timerIntervalRef.current);
      setTimerDisplay("Time's up!");

      // Stop playback if it's playing
      if (isPlaying) {
        togglePlay();
      }

      timerEndTimeRef.current = null;
      return;
    }

    // Convert milliseconds to minutes and seconds
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    setTimerDisplay(
      `${minutes}:${seconds.toString().padStart(2, "0")} remaining`
    );
  };

  const toggleTimer = () => {
    if (timerEndTimeRef.current) {
      // Cancel timer
      clearInterval(timerIntervalRef.current);
      timerEndTimeRef.current = null;
      setTimerDisplay("");
    } else {
      // Start timer
      startTimer();
    }
  };

  // Wave animation - more complex, wave-like animation
  const animateWave = (active) => {
    if (waveRef.current) {
      if (active) {
        // Multiple waves with different phases and speeds
        const wavePoints = Array(10)
          .fill(0)
          .map(() => ({
            phase: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.03,
            amplitude: 5 + Math.random() * 10,
          }));

        let time = 0;

        const animate = () => {
          if (!isPlaying) return;

          time += 0.05;

          // Create wave effect by summing multiple sine waves
          let totalHeight = 50; // Base height

          wavePoints.forEach((point) => {
            // Each point contributes a sine wave with its own phase, speed and amplitude
            totalHeight +=
              Math.sin(time * point.speed + point.phase) * point.amplitude;
          });

          // Keep height within reasonable bounds
          totalHeight = Math.max(30, Math.min(70, totalHeight));

          if (waveRef.current) {
            waveRef.current.style.height = `${totalHeight}%`;

            // Add a small horizontal shift to create ripple effect
            const shift = Math.sin(time * 0.1) * 2;
            waveRef.current.style.transform = `translateX(${shift}px)`;
          }

          animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();
      } else {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        waveRef.current.style.height = "50%";
        waveRef.current.style.transform = "translateX(0)";
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ambientAudioNodeRef.current) {
        ambientAudioNodeRef.current.stop();
        ambientAudioNodeRef.current.disconnect();
      }

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 text-white p-4">
      <div className="bg-slate-900 bg-opacity-20 rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Ambient Audio Generator
        </h1>

        <div className="relative w-full h-32 mb-6 bg-slate-950 bg-opacity-20 rounded overflow-hidden">
          <div
            ref={waveRef}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 transition-all duration-100"
            style={{
              borderTopLeftRadius: "50% 20%",
              borderTopRightRadius: "50% 20%",
              boxShadow: "0 -5px 15px rgba(59, 130, 246, 0.5)",
            }}
          ></div>
        </div>

        <div className="mb-6">
          <button
            onClick={togglePlay}
            className={`w-full py-3 px-6 rounded-full text-lg font-medium transition-colors ${
              isPlaying
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-20 text-sm">Volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => updateVolume(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="w-20 text-sm">Color:</span>
            <input
              type="range"
              min="0.005"
              max="0.05"
              step="0.001"
              value={audioColor}
              onChange={(e) => setAudioColor(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm min-w-16 text-right">{colorLabel}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-20 text-sm">Bass:</span>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={bassLevel}
              onChange={(e) => setBassLevel(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center mb-2">
            <label htmlFor="timerMinutes" className="text-sm">
              Set Timer (minutes):
            </label>
          </div>
          <div className="flex gap-3 justify-center mb-2">
            <input
              type="number"
              id="timerMinutes"
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
              className="w-16 px-3 py-2 rounded bg-slate-700 text-center"
              min="1"
              max="180"
            />
            <button
              onClick={toggleTimer}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
            >
              {timerEndTimeRef.current ? "Cancel Timer" : "Start Timer"}
            </button>
          </div>
          {timerDisplay && (
            <div className="text-center text-sm mt-2">{timerDisplay}</div>
          )}
        </div>
      </div>

      <div className="mt-6 text-sm opacity-70 text-center">
        Created by Joel Breit (
        <a
          href="https://breitest.com"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          breitest.com
        </a>
        )
        <div>
          {/* GitHub */}
          Source code available on{" "}
          <a href="" target="_blank" rel="noreferrer" className="underline">
            GitHub
          </a>
          {/* MIT License */}.
        </div>
        <div>
          {" "}
          <a href="" target="_blank" rel="noreferrer" className="underline">
            MIT License
          </a>{" "}
          (free to use and modify)
        </div>
      </div>
    </div>
  );
};

export default AmbientAudioGenerator;
