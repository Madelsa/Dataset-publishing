/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Main theme colors - Purple spectrum
        primary: {
          DEFAULT: '#6d28d9', // Purple (main)
          light: '#8b5cf6',   // Light purple
          dark: '#5b21b6'     // Dark purple
        },
        // Grays - Greyish whites
        'gray-light': '#f8f8fb',  // Very light greyish white (almost white)
        'gray-medium': '#e9e9ef', // Medium greyish white
        'gray-dark': '#9ca3af',   // Darker gray for text
        // Base colors
        'app-bg': '#f2f2f6',      // Application background (greyish white)
        'card-bg': '#ffffff',     // Card background (pure white)
        // Functional colors with better contrast
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      backgroundColor: {
        'primary': '#6d28d9',
        'primary-light': '#8b5cf6',
        'primary-dark': '#5b21b6',
        'app': '#f2f2f6',
        'card': '#ffffff',
      },
      textColor: {
        'primary': '#6d28d9',
        'primary-light': '#8b5cf6',
        'primary-dark': '#5b21b6',
        'dark': '#1f2937',
        'medium': '#4b5563',
        'light': '#6b7280',
      },
      borderColor: {
        'primary': '#6d28d9',
        'primary-light': '#8b5cf6',
        'gray-medium': '#e9e9ef',
      },
    },
  },
  plugins: [],
}; 