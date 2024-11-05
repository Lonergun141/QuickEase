/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Textfield({
  type = 'text',
  placeholder = 'Enter text',
  value,
  name,
  onChange,
  autoComplete = 'off', // Added default value for autoComplete
  borderColor = 'border-gray-300',
  focusBorderColor = 'border-primary',
  paddingY = 'py-2',
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full relative">
      <input
        type={type === 'password' && showPassword ? 'text' : type}
        className={`w-full font-pregular border-b-2 transition-all duration-300 dark:bg-dark dark:text-secondary px-2 ${isFocused ? focusBorderColor : borderColor} outline-none ${paddingY}`}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete={autoComplete} // Added autoComplete attribute
      />
      {type === 'password' && (
        <button
          type="button"
          className="absolute right-2 top-2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      )}
    </div>
  );
}

Textfield.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  autoComplete: PropTypes.string, 
  borderColor: PropTypes.string,
  name: PropTypes.string,
  focusBorderColor: PropTypes.string,
  paddingY: PropTypes.string,
};

export default Textfield;
