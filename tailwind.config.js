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
				newTxt: '#292929',
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
					'50%': { transform: 'scale(1.1)' },
				},
				'pulse-bg': {
					'0%, 100%': { backgroundSize: '100%' },
					'50%': { backgroundSize: '105%' },
				},
				'float-gentle': {
					'0%, 100%': {
						transform: 'translateY(0) scale(1)',
					},
					'50%': {
						transform: 'translateY(-20px) scale(1.01)',
					},
				},
				slide: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'float-particle': {
					'0%, 100%': {
						transform: 'translate(0, 0)',
						opacity: 0.3,
					},
					'50%': {
						transform: 'translate(20px, -20px)',
						opacity: 0.8,
					},
				},
				modalShow: {
					'0%': { transform: 'scale(0.95)', opacity: 0 },
					'100%': { transform: 'scale(1)', opacity: 1 },
				},
				iconBounce: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				blob: {
					'0%': { transform: 'translate(0px, 0px) scale(1)' },
					'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
					'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
					'100%': { transform: 'translate(0px, 0px) scale(1)' },
				},
			},
			animation: {
				float: 'float 3s ease-in-out infinite',
				'pulse-scale': 'pulse-scale 1s ease-in-out infinite',
				'pulse-bg': 'pulse-bg 2s ease-in-out infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'pulse-slower': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float-gentle': 'float-gentle 6s ease-in-out infinite',
				'slide-slow': 'slide 15s linear infinite',
				'float-particle': 'float-particle 8s ease-in-out infinite',
				blob: 'blob 7s infinite',
			},
			boxShadow: {
				neumorphism:
					'8px 8px 16px rgba(189, 195, 199, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.7)',
				'neumorphism-btn':
					'4px 4px 8px rgba(189, 195, 199, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.7)',
				'neumorphism-inset':
					'inset 8px 8px 16px rgba(189, 195, 199, 0.5), inset -8px -8px 16px rgba(255, 255, 255, 0.7)',
			},
			dropShadow: {
				glow: '0 0 10px rgba(255, 255, 255, 0.5)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			},
			textShadow: {
				md: '0 4px 6px rgba(0, 0, 0, 0.1)',
			},
			modalShow: 'modalShow 0.3s ease-out',
			iconBounce: 'iconBounce 2s ease-in-out infinite',
		},
	},
	plugins: [],
};
