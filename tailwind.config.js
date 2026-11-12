/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sf: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'sans-serif'],
      },
      colors: {
        ios: {
          glass: 'rgba(255, 255, 255, 0.16)',
          glassDark: 'rgba(24, 24, 27, 0.65)',
          border: 'rgba(255, 255, 255, 0.2)',
          borderDark: 'rgba(255, 255, 255, 0.12)',
        }
      },
      boxShadow: {
        'ios-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
        'ios-card': '0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.12)',
      }
    },
  },
  plugins: [],
}

