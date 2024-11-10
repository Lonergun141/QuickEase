/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#63A7FF',
				secondary: '#F6F7FB',
				highlights: '#213660',
				secondhighlights: '#060321',
				backgroundColor: '#F8FAFC',
				onBoardingbg: '#DEECFA',
				pomodoro: '#7EC3FA',
				review: '#EE924F',
				smenu: '#696969',
				dark: '#121212',
				darken: '#1E1E1E',
				naeg: '#C0C0C0',
				checkText: '#0D5F07',
				checkbg: '#d4fbd2',
				darkS: '#424242',
				newTxt:'#292929'
			},
			fontFamily: {
				inc: ['Regular'],
				pregular: ['pRegular'],
				pbold: ['pBold'],
				pmedium: ['pMedium'],
				aceh: ['aceh'],
			},
			screens: {
				md: '768px',
				xs: '344px',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'pulse-scale': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }, // Slight scale up at the mid-point
				},
				'pulse-bg': {
					'0%, 100%': { backgroundSize: '100%' },
					'50%': { backgroundSize: '105%' }, // Slight pulse in background size
				},
			},
			animation: {
				float: 'float 3s ease-in-out infinite',
				'pulse-scale': 'pulse-scale 1s ease-in-out infinite',
				'pulse-bg': 'pulse-bg 2s ease-in-out infinite', // Smooth background pulsing
			},
			boxShadow: {
				neumorphism: '8px 8px 16px rgba(189, 195, 199, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.7)',
				'neumorphism-btn': '4px 4px 8px rgba(189, 195, 199, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.7)',
				'neumorphism-inset': 'inset 8px 8px 16px rgba(189, 195, 199, 0.5), inset -8px -8px 16px rgba(255, 255, 255, 0.7)',
			},
			dropShadow: {
				glow: '0 0 10px rgba(255, 255, 255, 0.5)',
			},
		},
	},
	plugins: [],
};
