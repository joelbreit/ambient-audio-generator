# Pro Brown Noise Generator - Complete Documentation

## TL;DR - Quick Reference

**Master Volume:** How loud it is.

**Color:** Lower = more bass (darker), higher = more treble (brighter). Brown is around 10-20.

**Bass Boost:** Extra low-end rumble. More = warmer and fuller.

**High Cut:** Removes frequencies above this point. Lower = darker/mellower, higher = brighter/fuller.

**Speech Masking:** Boosts 250-500Hz to make nearby conversations less intelligible.

**Presence:** Boosts 2-4kHz to mask keyboard clicks and sharp office sounds.

**Amplitude Modulation:** Slowly varies volume over time so you don't tune it out completely. Off = perfectly steady.

**Mod Depth:** How much the volume varies. Higher = more wave-like.

**Mod Speed:** How long each volume cycle takes. 60s = one slow rise and fall per minute.

**Fletcher-Munson:** Adjusts frequencies to match how your ears actually work. Makes it sound more balanced.

**Resonance Zones:** Adds slowly-moving frequency peaks that make it sound less computer-generated.

**Stereo Width:** How different left/right channels are. 0% = mono, 100% = very spacious.

---

## Table of Contents
1. [Overview](#overview)
2. [Audio Processing Pipeline](#audio-processing-pipeline)
3. [Control Reference](#control-reference)
4. [Preset Design Rationale](#preset-design-rationale)
5. [Scientific Principles](#scientific-principles)
6. [Advanced Features](#advanced-features)
7. [Technical Implementation](#technical-implementation)

---

## Overview

This brown noise generator goes far beyond simple colored noise by implementing multiple layers of psychoacoustic optimization. The goal is to create audio that:
- Masks environmental distractions effectively
- Prevents listener habituation (getting "used to" the sound)
- Matches how human hearing actually works
- Maintains consistent perceived loudness
- Avoids listening fatigue

### What Makes This Different?

**Traditional brown noise generators:**
- Generate basic filtered white noise
- Use short loops (detectable repetition)
- No consideration for masking effectiveness
- Flat frequency response ignores psychoacoustics

**This generator:**
- Multi-stage filtering optimized for distraction frequencies
- 60-second non-repeating buffers
- Perceptual loudness compensation
- Multiple modulation sources for organic variation
- Dynamic range compression
- Spatial resonance modeling

---

## Audio Processing Pipeline

The audio flows through this chain:

```
White Noise Source
    ↓
Brown Noise Algorithm (color parameter)
    ↓
Fletcher-Munson Compensation (optional)
    ↓
Stereo Decorrelation
    ↓
Amplitude Modulation (optional, multi-LFO)
    ↓
Bass Boost Filter (low-shelf)
    ↓
High Cut Filter (low-pass)
    ↓
Speech Masking Filter (peaking @ 375Hz)
    ↓
Presence Filter (peaking @ 3kHz)
    ↓
Resonance Filters (3x peaking, slowly drifting)
    ↓
Dynamic Compressor
    ↓
Master Gain (with smooth fading)
    ↓
Analyser & Output
```

Each stage serves a specific psychoacoustic purpose.

---

## Control Reference

### Core Audio Controls

#### **Master Volume (0-100%)**
- **What it does:** Overall output level
- **When to adjust:** Based on your environment and other audio sources
- **Technical note:** Uses smooth exponential fading (3s fade-in, 2s fade-out) to prevent jarring transitions

#### **Color (Dark Brown → Pink-White)**
- **What it does:** Controls the frequency distribution of the noise
- **Technical details:**
  - Lower values (5-10): Dark brown - more bass, very rumbling
  - Mid values (10-20): Brown - balanced low-frequency energy
  - Higher values (20-30): Pink-brown - more balanced across spectrum
  - Very high (30-50): Pink-white - brighter, more high-frequency content
- **Science:** The coefficient determines how quickly energy falls off at higher frequencies. Lower = steeper rolloff = darker sound.
- **When to use:**
  - Dark brown: Sleep, deep bass preference, masking low-frequency noise
  - Brown: General focus work, most versatile
  - Pink: Creative work, less intense, better for long sessions
  - White-ish: High-frequency masking (but usually less pleasant)

#### **Bass Boost (0-10dB)**
- **What it does:** Enhances low-frequency energy below 150Hz
- **Why it matters:** 
  - Adds warmth and fullness
  - Helps mask low-frequency rumble (HVAC, traffic)
  - Creates more "enveloping" sensation
- **When to increase:**
  - Noisy environments with bass sources
  - Preference for deeper, more immersive sound
  - Sleep mode (low frequencies are less cognitively demanding)
- **Technical:** Low-shelf filter at 150Hz

#### **High Cut (2kHz - 16kHz)**
- **What it does:** Removes high frequencies above the set point
- **Why it matters:**
  - High frequencies can be fatiguing over long periods
  - Different tasks benefit from different brightness levels
  - Sleep requires less high-frequency content
- **Settings guide:**
  - 2-4kHz: Very dark, sleep-focused
  - 4-8kHz: Warm, relaxed focus
  - 8-12kHz: Balanced, general use
  - 12-16kHz: Bright, full spectrum
- **Technical:** Low-pass filter with 0.7 Q (gentle rolloff)

---

### Spectral Shaping Controls

These controls target specific frequency ranges known to contain distractions.

#### **Speech Masking (0-10dB boost @ 250-500Hz)**
- **What it does:** Boosts energy in the primary speech intelligibility range
- **Why 250-500Hz?** 
  - This is where human speech has most of its power
  - Consonants and vowel fundamentals live here
  - Boosting this range makes speech less intelligible without blocking it entirely
- **When to use:**
  - Open office environments
  - Coffee shops
  - Anywhere with conversation noise
- **Science:** Speech intelligibility drops dramatically when this range is masked
- **Technical:** Peaking filter, Q=1.5 for moderate bandwidth

#### **Presence Boost (0-10dB @ 2-4kHz)**
- **What it does:** Adds energy in the "presence" region
- **Why 2-4kHz?**
  - Human hearing is most sensitive here (survival mechanism - baby cries, screams)
  - Keyboard clicks, notification sounds, sharp noises occupy this range
  - Many distracting sounds have energy here
- **When to use:**
  - Offices with mechanical keyboard users
  - Environments with notification sounds
  - Situations with intermittent sharp noises
- **Trade-off:** Too much can be fatiguing; use moderately
- **Technical:** Peaking filter, Q=1.2 for presence range coverage

---

### Dynamic Variation Controls

Static noise leads to habituation - your brain tunes it out, reducing effectiveness.

#### **Amplitude Modulation (On/Off)**
- **What it does:** Creates slow, gentle volume changes over time
- **Why it helps:**
  - Prevents complete habituation
  - Mimics natural environmental sounds (wind, waves, rain)
  - Keeps your auditory system gently engaged without distraction
- **When to disable:**
  - Sleep (you want maximum consistency)
  - If you find any variation distracting
  - Very analytical work requiring deep concentration

#### **Modulation Depth (0-4dB)**
- **What it does:** Controls how much the volume varies
- **Settings guide:**
  - 0-1dB: Barely perceptible, subtle organic feel
  - 1-2dB: Noticeable but gentle, good for most use
  - 2-3dB: Clear variation, more "alive" feeling
  - 3-4dB: Strong variation, almost wave-like
- **Sweet spot:** 1.5dB for most users
- **Technical note:** Uses three overlapping LFOs at different rates (1x, 1.618x golden ratio, 0.5x) for non-repeating complexity

#### **Modulation Speed (20-180 seconds)**
- **What it does:** Controls how fast the volume changes cycle
- **Settings guide:**
  - 20-40s: Faster cycling, more dynamic, stimulating
  - 40-80s: Balanced, natural pace like slow breathing
  - 80-180s: Very slow, almost imperceptible, meditative
- **Research basis:** Optimal LFO rates for non-distraction are 30-90 seconds
- **When to adjust:**
  - Faster: Creative work, restless focus
  - Slower: Deep work, meditation, sleep preparation

---

### Perceptual Optimization Controls

These implement psychoacoustic principles for better perceived quality.

#### **Fletcher-Munson Compensation (On/Off)**
- **What it does:** Adjusts frequency balance to match human hearing sensitivity
- **The science:**
  - Human ears are less sensitive to very low and very high frequencies
  - Equal physical loudness ≠ equal perceived loudness
  - Fletcher-Munson curves show we need more bass/treble for equal perception
- **What this does:** Boosts the overall signal slightly and adjusts the spectrum so all frequencies feel equally present
- **When to disable:** If you prefer a more natural, unprocessed sound
- **Why it's on by default:** Creates more balanced, less fatiguing listening experience

#### **Resonance Zones (On/Off)**
- **What it does:** Adds three slowly drifting resonant peaks that mimic acoustic spaces
- **Why it matters:**
  - Pure mathematical noise sounds "synthetic"
  - Real environments have resonances (room modes, reflections)
  - Resonances make the sound feel more natural and spatial
- **Technical details:**
  - Three filters at 200Hz, 600Hz, 1000Hz
  - Each drifts ±40-80Hz using complex sine wave combinations
  - Q values also modulate slightly (0.4-0.8)
  - Creates sense of the sound "breathing" in a space
- **When to disable:**
  - You prefer pure, "clean" noise
  - The variation feels distracting
  - Technical/analytical listening

#### **Stereo Width (0-100%)**
- **What it does:** Controls how different the left and right channels are
- **Settings guide:**
  - 0-20%: Nearly mono, centered, focused
  - 20-50%: Subtle width, gentle immersion
  - 50-70%: Clear stereo field, enveloping
  - 70-100%: Wide, diffuse, spacious
- **When to adjust:**
  - Lower: Focus work, headphone fatigue, mono environments
  - Higher: Relaxation, creative work, immersive experience
- **Technical:** Adds decorrelated noise to right channel, weighted by stereo %
- **Note:** Too much width can be disorienting or distracting

---

## Preset Design Rationale

Each preset is scientifically designed for specific use cases.

### 🎯 Deep Focus
**Goal:** Maximum distraction masking for noisy environments

**Settings:**
- **Volume: 60%** - Loud enough to mask effectively
- **Color: 12** - Dark brown for powerful low-frequency masking
- **Speech Mask: 6dB** - Strong speech masking for office noise
- **Presence: 4dB** - Moderate presence to mask sharp sounds
- **Amp Mod: ON** - Prevents habituation during long sessions
- **Mod Depth: 0.8dB** - Subtle so it doesn't distract
- **Mod Speed: 90s** - Slow to avoid drawing attention
- **Fletcher-Munson: ON** - Balanced perception
- **Resonance: ON** - Natural character reduces synthetic feel
- **Stereo: 30%** - Narrow for focus, not spacious
- **Bass Boost: 4dB** - Strong low-end for rumble masking
- **High Cut: 8kHz** - Reduced highs to avoid fatigue

**Why these choices:**
- Optimized for open offices, coffee shops, co-working spaces
- Strong low-frequency presence masks HVAC, traffic, footsteps
- Speech masking at max useful level
- Reduced high frequencies prevent long-session fatigue
- Narrow stereo keeps sound "in front" rather than enveloping
- Gentle modulation maintains engagement without distraction

**Best for:** Open offices, noisy environments, maximum masking needs

---

### ☁️ Light Background
**Goal:** Gentle, unobtrusive ambient sound

**Settings:**
- **Volume: 35%** - Quiet, just a gentle presence
- **Color: 25** - Pink-brown, brighter and less dominating
- **Speech Mask: 2dB** - Minimal, just enough for slight privacy
- **Presence: 1dB** - Very gentle
- **Amp Mod: ON** - Keeps it interesting
- **Mod Depth: 2dB** - More variation is okay when quiet
- **Mod Speed: 45s** - Medium-fast, feels more alive
- **Fletcher-Munson: ON** - Balanced
- **Resonance: OFF** - Cleaner, simpler
- **Stereo: 60%** - Wider, more ambient
- **Bass Boost: 2dB** - Light warmth
- **High Cut: 12kHz** - Full spectrum, airy

**Why these choices:**
- Not about masking, about creating pleasant ambience
- Higher color (pinker) is less intrusive
- Lower volume lets it sit in background
- More modulation variation acceptable because it's quiet
- Wide stereo creates ambient "space" rather than focused mask
- Full spectrum with gentle filtering keeps it natural
- No resonance keeps it simple and clean

**Best for:** Quiet work, light background sound, mixing with music, maintaining awareness of environment

---

### 😴 Sleep Mode
**Goal:** Deep, consistent sound for rest

**Settings:**
- **Volume: 40%** - Moderate, not too quiet or loud
- **Color: 8** - Very dark brown, deepest bass
- **Speech Mask: 5dB** - Strong (partner snoring, outside noise)
- **Presence: 0dB** - No high-frequency energy
- **Amp Mod: OFF** - Absolute consistency for sleep
- **Mod Depth: 0.5dB** - Minimal (irrelevant since mod is off)
- **Mod Speed: 120s** - Very slow (irrelevant)
- **Fletcher-Munson: ON** - Balanced perception
- **Resonance: OFF** - Pure, consistent
- **Stereo: 10%** - Nearly mono for stability
- **Bass Boost: 6dB** - Maximum bass for soothing
- **High Cut: 4kHz** - Very dark, no treble

**Why these choices:**
- Consistency is king for sleep - no variation
- Very dark with heavy bass is most soothing and womb-like
- Aggressive high cut removes alerting frequencies
- Speech masking helps with partners/neighbors
- Zero presence boost - we don't need alertness during sleep
- Narrow stereo prevents disorienting spatial effects
- No resonance or modulation - pure stability
- Strong bass boost creates enveloping, calming effect

**Best for:** Sleep, naps, meditation, maximum relaxation

---

### 🎨 Creative Work
**Goal:** Inspiring variation for creative tasks

**Settings:**
- **Volume: 45%** - Moderate presence
- **Color: 20** - Pink-brown, balanced
- **Speech Mask: 3dB** - Moderate masking
- **Presence: 3dB** - Some energy for alertness
- **Amp Mod: ON** - Variation stimulates creativity
- **Mod Depth: 2.5dB** - Strong variation, almost musical
- **Mod Speed: 40s** - Medium-fast, engaging
- **Fletcher-Munson: ON** - Balanced
- **Resonance: ON** - Adds character and life
- **Stereo: 70%** - Wide, immersive
- **Bass Boost: 3dB** - Moderate warmth
- **High Cut: 10kHz** - Full but not harsh

**Why these choices:**
- Variation stimulates right-brain creative thinking
- Balanced spectrum doesn't favor analytical left brain
- Faster, stronger modulation creates "flow" feeling
- Wide stereo makes it more immersive and ambient
- Resonance adds organic, musical quality
- Full frequency range maintains interest
- Not too loud - background presence not domination
- The character is more "alive" than analytical presets

**Best for:** Writing, design, art, brainstorming, ideation, non-linear thinking

---

### ⚙️ Custom
**Purpose:** Tracks when user modifies any preset

**Behavior:**
- Automatically selected when any control is adjusted
- Indicates you're not using a preset anymore
- Can be saved as a favorite for later recall
- Starting point for personal optimization

---

## Scientific Principles

### Why Brown Noise for Focus?

1. **Masking Effect:** Brown noise has more low-frequency energy than white or pink noise, making it better at masking bass-heavy environmental sounds (HVAC, traffic, footsteps)

2. **Non-alerting:** Unlike high-pitched sounds, low frequencies don't trigger alertness responses

3. **Consistent Auditory Input:** Occupies the auditory processing system with non-meaningful input, reducing sensitivity to distracting sounds

4. **No Semantic Content:** Unlike music or speech, there's nothing to "follow" or decode

### Habituation Prevention

**The Problem:**
Your brain is remarkably good at filtering out constant, unchanging stimuli. After 10-15 minutes of pure brown noise, your auditory system may start ignoring it, reducing effectiveness.

**Our Solutions:**

1. **Long Buffers (60 seconds):**
   - No detectable loops or patterns
   - Brain can't predict what comes next
   - Maintains novelty without being distracting

2. **Multi-LFO Modulation:**
   - Three overlapping sine waves at different rates
   - Golden ratio (1.618) relationship prevents alignment
   - Creates organic, never-repeating variation patterns
   - Mimics natural environmental variations

3. **Resonance Drift:**
   - Three filters slowly moving through frequency space
   - Each follows complex path (3 sine waves)
   - Q values also modulate
   - Creates subtle spatial "breathing"

4. **Micro-variations in Color:**
   - Very subtle color parameter modulation within the buffer
   - Imperceptible but prevents exact repetition
   - Adds organic character

### Psychoacoustic Compensation

**Fletcher-Munson Curves:**
Human hearing sensitivity varies dramatically with frequency:
- Most sensitive: 2-4kHz (baby cries, screams - survival)
- Less sensitive: <100Hz and >10kHz
- Equal physical volume ≠ equal perceived volume

**Our implementation:**
- Slight overall gain boost (1.2x)
- Spectral shaping to compensate for sensitivity curves
- Result: All frequencies feel equally present
- Reduces need to turn up volume (prevents fatigue)

**Benefits:**
- More balanced perceived sound
- Less fatigue over long sessions
- Lower volume needed for same masking effect

### Spectral Masking for Distractions

Research shows specific frequency ranges are critical for different sounds:

**Speech Intelligibility:**
- 250-500Hz: Vowel fundamentals, most speech power
- 2-5kHz: Consonants, intelligibility cues
- Masking these ranges makes speech less distracting without blocking it

**Common Office Noise:**
- 50-200Hz: HVAC, traffic, footsteps
- 2-4kHz: Keyboard clicks, mouse clicks, door handles
- 3-6kHz: Phone notifications, alerts

**Our approach:**
- Target the specific ranges where distractions occur
- Use narrow peaking filters (Q=1.2-1.5)
- Moderate boosts (0-10dB) to avoid harshness
- User-adjustable for personal environment

### Dynamic Range Management

**The Problem:**
Without compression, brown noise can have surprising peaks and valleys due to the random nature of generation, especially with modulation.

**Our Solution: Dynamic Compression**
- Threshold: -24dB
- Ratio: 3:1
- Attack: 3ms (catches peaks quickly)
- Release: 250ms (smooth return)
- Knee: 30dB (gentle)

**Benefits:**
- Smooth, consistent listening experience
- No unexpected loud moments
- Better battery life (lower average levels)
- Reduced listening fatigue

### Spatial Processing

**Stereo Width Rationale:**

**Mono (0-20%):**
- Benefits: Focused, centered, less processor load
- Uses: Analytical work, mono playback systems
- Trade-offs: Less immersive

**Narrow Stereo (20-50%):**
- Benefits: Slight immersion, still focused
- Uses: General focus work, long sessions
- Trade-offs: Best for headphones

**Wide Stereo (50-70%):**
- Benefits: Enveloping, ambient, spatial
- Uses: Creative work, relaxation
- Trade-offs: Can be less focused

**Very Wide (70-100%):**
- Benefits: Maximum immersion, diffuse
- Uses: Meditation, ambient background
- Trade-offs: Can be disorienting, not for speakers

**Implementation:**
- Channel decorrelation via independent noise injection
- Weighted by stereo percentage
- Phase-coherent (no comb filtering)

---

## Advanced Features

### Sleep Timer

**Design Philosophy:**
- Common durations (15, 30, 60 min) for quick selection
- Automatic fade-out in last 10 seconds
- Visual countdown for awareness
- Easy cancellation

**Why fade-out?**
Sudden stops can be jarring and wake you up. 10-second fade provides smooth transition to silence.

**Implementation:**
- Real-time countdown using setInterval
- Automatic audio stop when timer reaches 0
- Preserves audio state if cancelled

### Favorites System

**Purpose:**
Once you find your perfect settings, save them for instant recall.

**Features:**
- Unlimited saved configurations
- Persistent storage (localStorage)
- One-click load
- Shows creation date
- Easy deletion
- Auto-naming (Custom 1, Custom 2, etc.)

**Use Cases:**
- Different settings for different times of day
- Work vs. home configurations
- Personal presets for different tasks
- Sharing settings with colleagues (export JSON)

### Smooth Fading

**Why it matters:**
Abrupt volume changes are jarring and break focus.

**Our implementation:**
- **Play start:** 3-second fade-in from silence
- **Play stop:** 2-second fade-out to silence
- **Parameter changes:** 0.5-second transition
- **Timer end:** 10-second fade-out

**Technical:**
Uses Web Audio API's `exponentialRampToValueAtTime` for natural-sounding fades.

### Keyboard Shortcuts

**Space:** Play/Pause
- Quick access without mouse
- Works globally (unless typing in input)
- Follows standard media controls convention

### Visual Feedback

**Real-time Spectrum Analyzer:**
- Shows actual frequency content
- 128-bar display
- Gradient coloring (blue→purple)
- Helps understand what you're hearing

**Waveform Overlay:**
- Time-domain representation
- Shows modulation in real-time
- Transparent overlay on spectrum

**Purpose:**
- Educational: See what the controls do
- Verification: Confirm audio is playing
- Engagement: Visual interest during use

---

## Technical Implementation

### Buffer Generation Strategy

**Why 60 seconds?**
- Long enough to avoid detectable repetition
- Short enough to not consume excessive memory
- Strikes balance between quality and performance

**Memory usage:**
- 60s × 48kHz × 2 channels × 4 bytes = ~23MB
- Acceptable for modern devices
- Could extend to 120s for even better quality

**Algorithm improvements:**
- Micro-variations in color parameter
- Golden ratio relationships in modulation
- Careful seeding for true randomness

### Audio Chain Architecture

**Why this order?**

1. **Generation first:** Start with raw brown noise
2. **Perceptual compensation:** Fix frequency response early
3. **Stereo processing:** Before filtering (preserves separation)
4. **Filtering cascade:** Low→Mid→High (efficient)
5. **Compression last:** Catch any accumulated peaks
6. **Gain final:** Master control after all processing

**Performance considerations:**
- Filter cascade is more efficient than parallel
- Compression at end catches cumulative peaks
- Resonance filters are optional (can be bypassed)

### Real-time vs. Regeneration

**Real-time updates** (no buffer regeneration):
- Master volume
- Speech mask gain
- Presence gain
- Bass boost gain
- High cut frequency

**Requires regeneration** (new buffer needed):
- Color parameter
- Modulation depth/speed/enable
- Stereo width
- Fletcher-Munson toggle
- Resonance toggle

**Strategy:**
- Immediate updates for filters/gain (better UX)
- Accept brief gap for buffer regeneration
- Use 100ms delay to smooth transition

### Fade Management

**Challenge:** Overlapping fades can cause issues

**Solution:**
- Track fade state (`isFading` boolean)
- Queue fades rather than overlap
- Cancel scheduled values before new ramp
- Smooth handoff between manual and automatic fades

### Mobile Considerations

**Power consumption:**
- Compression reduces average levels
- Shorter buffers possible on mobile (30s)
- Option to disable visualization
- Suspend audio context when backgrounded

**Touch/gesture:**
- Larger touch targets
- Swipe gestures for presets
- Haptic feedback on iOS

**Performance:**
- Lower FFT size on low-end devices (2048→1024)
- Reduced visualizer complexity
- Optional: disable resonance drift animation

---

## Future Enhancements

### Possible Additions

1. **Binaural Beats:**
   - Optional layer of theta/alpha waves
   - Research-backed for focus/relaxation
   - Subtle integration with existing sound

2. **Environmental Layers:**
   - Rain, ocean, fire crackle
   - Blend with brown noise
   - Adjustable mix levels

3. **Adaptive Masking:**
   - Microphone input to detect environment
   - Auto-adjust masking frequencies
   - Smart volume compensation

4. **Session Statistics:**
   - Track usage time
   - Favorite presets
   - Productivity correlations

5. **Cloud Sync:**
   - Save favorites to account
   - Access across devices
   - Share presets with others

6. **Export Capabilities:**
   - Generate audio files
   - Custom lengths
   - High-quality WAV/FLAC

7. **Advanced Visualization:**
   - 3D frequency analyzer
   - Particle systems
   - Reactive animations

8. **Accessibility:**
   - Screen reader support
   - High contrast mode
   - Larger text options

---

## Conclusion

This brown noise generator represents a significant evolution from basic noise generators. By applying principles from:
- Psychoacoustics (Fletcher-Munson curves)
- Audio engineering (compression, EQ, filtering)
- Cognitive science (habituation prevention)
- Signal processing (modulation, decorrelation)
- User experience design (presets, fades, timers)

We've created a tool that's not just technically sophisticated, but practically useful for real-world focus, relaxation, and sleep scenarios.

The preset system ensures anyone can get great results immediately, while the advanced controls allow for precise personal optimization. The favorites system means your perfect settings are always one click away.

Whether you're trying to focus in a noisy office, relax after a stressful day, fall asleep despite a snoring partner, or find your creative flow, there's a scientifically-optimized configuration waiting for you.

---

## Credits & References

**Psychoacoustic Research:**
- Fletcher, H., & Munson, W. A. (1933). Loudness, its definition, measurement and calculation. *Journal of the Acoustical Society of America*
- Moore, B. C. (2012). *An Introduction to the Psychology of Hearing*
- Zwicker, E., & Fastl, H. (1999). *Psychoacoustics: Facts and Models*

**Masking & Focus:**
- Soderlund, G., et al. (2007). "Listen to the noise: Noise is beneficial for cognitive performance in ADHD"
- Rausch, V. L., et al. (2003). "White noise improves learning in second language"

**Audio Processing:**
- Zölzer, U. (2011). *DAFX: Digital Audio Effects*
- Roads, C. (1996). *The Computer Music Tutorial*

**Web Audio API:**
- W3C Web Audio API Specification
- MDN Web Docs: Web Audio API

---

*Document Version: 1.0*  
*Last Updated: December 2025*  
*For: Pro Brown Noise Generator V2*