import React, { useCallback, useState, useEffect, useRef } from "react";

import logo from "../assets/logo.png";

const AmbientAudioGenerator = () => {
  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [audioColor, setAudioColor] = useState(0.015);
  const [bassLevel, setBassLevel] = useState(3.5);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [timerDisplay, setTimerDisplay] = useState("");
  const [colorLabel, setColorLabel] = useState("Brown");
  const [animationStyle, setAnimationStyle] = useState("particles");

  // Refs
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const filterNodeRef = useRef(null);
  const ambientAudioNodeRef = useRef(null);
  const timerEndTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const animationRef = useRef(null);
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

      if (animationStyle === "wave") {
        animateWave(true);
      } else {
        animateParticles(true);
      }
    } else {
      if (ambientAudioNodeRef.current) {
        ambientAudioNodeRef.current.stop();
        ambientAudioNodeRef.current.disconnect();
        ambientAudioNodeRef.current = null;
      }
      setIsPlaying(false);

      if (animationStyle === "wave") {
        animateWave(false);
      } else {
        animateParticles(false);
      }
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

  const handleKeyPress = useCallback(
    (event) => {
      // Start/Stop with spacebar
      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      } else if (event.code === "Escape") {
        // Stop timer if Escape is pressed
        if (timerEndTimeRef.current) {
          clearInterval(timerIntervalRef.current);
          timerEndTimeRef.current = null;
          setTimerDisplay("");
        }
      }
    },
    [togglePlay]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  // Wave Animation
  const animateWave = (start) => {
    if (!animationRef.current) return;

    const canvas = animationRef.current;
    const ctx = canvas.getContext("2d");

    let waveOffset = 0;

    const drawWave = () => {
      if (!start) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin((x + waveOffset) * 0.05) * 20;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      waveOffset += 2;
      animationFrameRef.current = requestAnimationFrame(drawWave);
    };

    if (start) {
      drawWave();
    } else {
      cancelAnimationFrame(animationFrameRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Particle animation
  const animateParticles = (active) => {
    const canvas = animationRef.current;

    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");
      let particles = [];
      const particleCount = 40;

      // Set canvas size to match container
      const resizeCanvas = () => {
        if (canvas.parentElement) {
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = canvas.parentElement.clientHeight;
        }
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      if (active) {
        // Create particles
        particles = Array(particleCount)
          .fill()
          .map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 2 + Math.random() * 4,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: `hsl(${210 + Math.random() * 40}, 80%, ${
              50 + Math.random() * 30
            }%)`,
            pulseFactor: Math.random(),
            pulseSpeed: 0.02 + Math.random() * 0.04,
          }));

        let time = 0;

        const animate = () => {
          time += 0.05;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Background gradient
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, "rgba(30, 41, 59, 0.4)");
          gradient.addColorStop(1, "rgba(15, 23, 42, 0.7)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Update and draw particles
          particles.forEach((particle) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width)
              particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height)
              particle.speedY *= -1;

            // Calculate pulse size based on time
            const pulse = 1 + Math.sin(time * particle.pulseSpeed) * 0.5;
            const size = particle.size * pulse * (isPlaying ? 1.5 : 0.8);

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            // Draw glow
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
            const glow = ctx.createRadialGradient(
              particle.x,
              particle.y,
              size * 0.5,
              particle.x,
              particle.y,
              size * 2
            );
            glow.addColorStop(0, particle.color.replace(")", ", 0.8)"));
            glow.addColorStop(1, particle.color.replace(")", ", 0)"));
            ctx.fillStyle = glow;
            ctx.fill();
          });

          // Draw connections between nearby particles
          ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
          ctx.lineWidth = 0.5;

          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 80) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
              }
            }
          }

          // Only continue animation if not canceled
          if (active) {
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        };

        // Cancel any existing animation before starting a new one
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animate();
      } else {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        // Clear canvas when stopped
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(30, 41, 59, 0.4)");
        gradient.addColorStop(1, "rgba(15, 23, 42, 0.7)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  };

  // Handle animation style change
  const changeAnimationStyle = (newStyle) => {
    // Stop current animation
    if (animationStyle === "wave") {
      animateWave(false);
    } else {
      animateParticles(false);
    }

    // Update style
    setAnimationStyle(newStyle);

    // Start new animation if playing
    if (isPlaying) {
      if (newStyle === "wave") {
        animateWave(true);
      } else {
        animateParticles(true);
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
        <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <img src={logo} alt="App Logo" className="w-12 h-12 rounded-full" />
          <span>Ambient Audio Generator</span>
        </h1>

        <div className="relative w-full h-32 mb-6 bg-slate-950 bg-opacity-20 rounded overflow-hidden">
          <canvas
            ref={animationRef}
            className="absolute bottom-0 left-0 w-full h-full"
          ></canvas>
        </div>

        <div className="mb-6">
          <button
            onClick={togglePlay}
            className={`w-full py-3 px-6 rounded-full text-lg font-medium transition-colors ${
              isPlaying
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <p className="text-xs text-center mt-2 text-slate-300 italic">
            *On mobile devices, you may need to unmute your ringer/silent switch
            in order to hear the audio
          </p>
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
            <span className="text-sm w-24 text-center whitespace-nowrap">
              {colorLabel}
            </span>
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

        <div className="flex items-center gap-3">
          <span className="w-20 text-sm">Visual:</span>
          <div className="flex-1 flex gap-2">
            <button
              onClick={() => changeAnimationStyle("particles")}
              className={`px-3 py-1 rounded text-sm flex-1 transition-colors ${
                animationStyle === "particles"
                  ? "bg-blue-500"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              Particles
            </button>
            <button
              onClick={() => changeAnimationStyle("wave")}
              className={`px-3 py-1 rounded text-sm flex-1 transition-colors ${
                animationStyle === "wave"
                  ? "bg-blue-500"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              Wave
            </button>
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
  );
};

export default AmbientAudioGenerator;
