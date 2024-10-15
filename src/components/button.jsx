import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';

function Button({
	children,
	onClick = () => {},
	type = 'button',
	className = '',
	disabled = false,
	isLoading = false,
}) {
	const progressColor = 'white'; 
	const darkProgressColor = '#4B5563'; 

	return (
		<button
			type={type}
			onClick={onClick}
			className={`w-full font-pregular bg-highlights dark:bg-secondary dark:text-dark cursor-pointer text-white py-4 rounded-md hover:bg-primary transition-colors duration-300 ${className}`}
			disabled={disabled || isLoading}>
			{isLoading ? (
				<div className="flex items-center justify-center">
					<CircularProgress
						size={24}
						sx={{ color: disabled ? 'gray' : progressColor }}
						style={{ color: 'currentColor' }} 
					/>
					<style>
						{`.dark .MuiCircularProgress-root {
							color: ${darkProgressColor} !important;
						}`}
					</style>
				</div>
			) : (
				children
			)}
		</button>
	);
}

Button.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	type: PropTypes.oneOf(['button', 'submit', 'reset']),
	className: PropTypes.string,
	disabled: PropTypes.bool,
	isLoading: PropTypes.bool,
};

export default Button;
