/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./docusaurus.config.js",
    "./docs/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'pro-bg': '#0f172a',
        'pro-panel': '#1e293b',
        'pro-primary': '#3b82f6',
        'pro-accent': '#8b5cf6',
        'pro-text': '#94a3b8',
        'pro-text-light': '#e2e8f0',
        'pro-border': '#334155',
        'pro-alert': '#ef4444',
        'pro-success': '#22c55e',
      },
    },
  },
};
