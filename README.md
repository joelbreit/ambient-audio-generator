# Ambient Audio Generator

## Description

This web app is a customizable ambient audio generator designed to provide ambient audio "colors" like white noise, brown noise, and pink noise available to anyone anywhere without the hassle of app downloads, paywalls, etc. Ambient noise helps people focus, relax, and sleep better. I personally like brown noise playing in addition to other focus music for maximum lock-in, and I wanted this to be available anywhere with no hassle. Like other audio generators, this app gives control over the "color" of your audio, from deep brown to pink-white, allowing you to pick what fits you best.

## Features

- **Adjustable Audio Color**: Fine-tune the audio on a spectrum from dark brown to pink-white
- **Bass Control**: Adjust the low-frequency content to your preference
- **Timer Function**: Set a duration for your sound session
- **Visual Feedback**: *Working on this*
- **Volume Control**: Adust volume levels to easily blend with other audio
- **Responsive Design**: Works anywhere there are web browsers
- **Hassle Free**: No download, no paywall, no ads, no terms

## Live Demo

Try the app live at: [ambient-audio.com](https://ambient-audio.com)

<!-- TODO Add Demo Gif -->

<!-- src/assets/logo.png -->
![Screenshot](src/assets/Screenshot.png)

## Technology Stack

- React.js for UI components and state management
- Web Audio API for spontaneous audio generation
- Tailwind CSS for responsive styling
- Vite for React project setup
- GitHub for version control and deployment
- AWS for hosting and domain management

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/joelbreit/ambient-audio-generator.git
   cd ambient-audio-generator
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173/`

## How It Works

The app uses the Web Audio API to generate colored noise algorithmically. The audio "color" is adjusted by modifying the coefficient in the algorithm that determines how quickly energy falls off at higher frequencies.

```javascript
// Core audio generation algorithm
data[i] = (lastOut + (audioColor * white)) / (1 + audioColor);
lastOut = data[i];
data[i] *= bassLevel;
```

- Lower `audioColor` values (0.005-0.01) produce darker brown noise with more bass
- Higher values (0.03-0.05) create brighter sounds approaching pink and white noise
- The `bassLevel` parameter further shapes the low-frequency response

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by personal auspicious use of brown noise generated by other apps for focus and relaxation
