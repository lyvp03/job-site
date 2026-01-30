/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          50: '#f5f3ff',   // Light tint
          100: '#e9e5ff',
          200: '#d5cfff',
          300: '#b8a9ff',
          400: '#9a7eff',
          500: '#7c4dff',   // Close to 574AE2
          600: '#574AE2',   // Your primary color
          700: '#4638d1',
          800: '#392bb7',
          900: '#2f2395',
        },
        
        // Secondary Colors
        secondary: {
          50: '#f8f7fc',
          100: '#eeecf7',
          200: '#ddd9f0',
          300: '#c5bde5',
          400: '#ab81cd',   // Your secondary color
          500: '#8e5db8',
          600: '#72419e',
          700: '#5c3281',
          800: '#4c296a',
          900: '#3f2157',
        },
        
        // Accent Colors
        accent: {
          50: '#fdf7ff',
          100: '#f9edff',
          200: '#f2d9ff',
          300: '#e9b8ff',
          400: '#E2ADF2',   // Your accent color
          500: '#d18ce5',
          600: '#b96ad3',
          700: '#9e4fb8',
          800: '#824197',
          900: '#6a357c',
        },
        
        // Dark Blues
        dark: {
          50: '#f0f2ff',
          100: '#e0e4ff',
          200: '#c7ceff',
          300: '#a5afff',
          400: '#818cff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#222A68',   // Your dark blue
          900: '#1d2460',
        },
        
        // Purple Gradient
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#654597',   // Your purple
          900: '#581c87',
        },
        
        // Custom single colors (nếu muốn dùng riêng lẻ)
        'coolor-primary': '#574AE2',
        'coolor-dark': '#222A68',
        'coolor-purple': '#654597',
        'coolor-secondary': '#AB81CD',
        'coolor-accent': '#E2ADF2',
      },
      
      // Gradient configurations
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #574AE2 0%, #222A68 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #AB81CD 0%, #654597 100%)',
        'gradient-accent': 'linear-gradient(135deg, #E2ADF2 0%, #AB81CD 100%)',
        'gradient-dark': 'linear-gradient(135deg, #222A68 0%, #654597 100%)',
        'gradient-full': 'linear-gradient(135deg, #574AE2 0%, #222A68 25%, #654597 50%, #AB81CD 75%, #E2ADF2 100%)',
      },
      
      // Animation
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 0%'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '100% 100%'
          }
        }
      }
    },
  },
  plugins: [],
}