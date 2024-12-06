import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
        brown: '#8B4513',
        'custom-brown1': '#8C6428',
        'custom-brown2': '#B58D52',
        'custom-blue1': '#0F3174',
        'custom-blue2': '#2F549C',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
