import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#cb1030',
        'background-light': '#ffffff',
        'background-dark': '#1a1a1a',
        'dark-text': '#181112',
        'border-subtle': '#e6dbdd',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        glow: '0 0 20px -5px rgba(203, 16, 48, 0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config;