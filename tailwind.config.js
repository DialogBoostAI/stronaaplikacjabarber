/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.22,1,0.36,1) both',
        'slide-up':       'slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both',
        'pop-in':         'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'spin-head':      'spinHead 3s linear infinite',
        'progress-fill':  'progressFill 3s ease-out forwards',
        'fade-out':       'fadeOut 0.4s ease forwards',
        'fade-in':        'fadeIn 0.4s ease forwards',
      },
    },
  },
  plugins: [],
}
