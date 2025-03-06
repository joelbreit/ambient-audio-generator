# Setting Up the Ambient Audio Generator React App

This is how I set up this Ambient Audio Generator React app from scratch using Vite. This was my first React app using Vite rather than create-react-app.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- npm (comes with Node.js)

## Step 1: Create a new React project with Vite

Open your terminal and run the following command:

```bash
npm create vite@latest ambient-audio-generator -- --template react
```

## Step 2: Navigate to the project directory

```bash
cd ambient-audio-generator
```

## Step 3: Install dependencies

The Ambient Audio Generator app requires Tailwind CSS for styling:

```bash
npm install tailwindcss@3.0.0 postcss autoprefixer
```

> Note: by default, Tailwind 4 was used, but it took me down a long rabbit hole of trying to get it to work with Vite. I ended up reverting to Tailwind 3.0.0, which worked out of the box.

## ~~Step 4: Initialize Tailwind CSS~~

```bash
npx tailwindcss init -p
```

## Step 5: Configure Tailwind CSS PostCSS

> Note: I needed to change the `tailwind.config.js` and `postcss.config.js` to `.cjs` files to get it to work with Vite.

Create a new `tailwind.config.cjs` file and replace its content with:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create a new file `postcss.config.cjs` in the root directory and add the following content:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

## Step 6: Add Tailwind directives to your CSS

Open `src/index.css` and replace its content with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 7: Create the Ambient Audio Generator component

Create a new file `src/components/AmbientAudioGenerator.jsx` and wrote the React code necessary.

## Step 8: Update Main.jsx

Replace the content of `src/main.jsx` with:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import AmbientAudioGenerator from './components/AmbientAudioGenerator'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AmbientAudioGenerator />
  </React.StrictMode>,
)
```

## Step 9: Update App metadata (optional)

Open `index.html` in the root directory and update the title and favicon:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ambient Audio Generator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## Step 10: Start the development server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to see the app in action.

## Step 11: Building for production

When you're ready to deploy your app:

```bash
npm run build
```

This will create a `dist` folder with optimized production files that you can deploy to any static hosting service.

## Step 12: Preview the production build

To preview the production build locally:

```bash
npm run preview
```

## Troubleshooting

* A host of issues including the following were resolved by using tailwind 3 instead of 4
  * `npm error could not determine executable to run`
  * `[vite] (client) Pre-transform error: [postcss] Missing "./base" specifier in "tailwindcss" package`
  * `[vite] (client) Pre-transform error: Failed to load PostCSS config`
  * `ReferenceError: module is not defined in ES module scope`
  * etc
* This npx issue was resolved by adding an `npm` folder to the `...Roaming/` folder that it was complaining about
  * `npm error code ENOENT: no such file or directory, open 'C:\Users\username\AppData\Roaming\npm\`