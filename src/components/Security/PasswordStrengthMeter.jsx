import React, { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const [passwordStrength, setPasswordStrength] = useState('weak');
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isTyping, setIsTyping] = useState(false);

  // Function to determine password strength
  const getPasswordStrength = (password) => {
    if (password.length >= 12 && passwordRequirements.hasUppercase && passwordRequirements.hasNumber && passwordRequirements.hasSpecialChar) {
      return 'strong';
    } else if (password.length >= 8) {
      return 'medium';
    } else {
      return 'weak';
    }
  };

  // Check for password requirements
  const checkPasswordRequirements = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordRequirements({
      hasUppercase,
      hasNumber,
      hasSpecialChar,
    });
  };

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
    checkPasswordRequirements(password);
    setIsTyping(password.length > 0);
  }, [password]);

  // Hide password meter when strong
  const hidePasswordMeter = passwordStrength === 'strong' && password.length >= 12;

  return (
    <>
      {isTyping && !hidePasswordMeter && (
        <div className="w-full mt-2">
          <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1 font-pregular">
            {!passwordRequirements.hasUppercase && <li className="text-red-500">Add at least one uppercase letter</li>}
            {!passwordRequirements.hasNumber && <li className="text-red-500">Include at least one number</li>}
            {!passwordRequirements.hasSpecialChar && <li className="text-red-500">Use at least one special character (!, @, #, etc.)</li>}
          </ul>

         
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                passwordStrength === 'strong'
                  ? 'bg-green-500'
                  : passwordStrength === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{
                width:
                  passwordStrength === 'strong'
                    ? '100%'
                    : passwordStrength === 'medium'
                    ? '66%'
                    : '33%',
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span
              className={`text-sm font-pregular ${
                passwordStrength === 'strong'
                  ? 'text-green-600'
                  : passwordStrength === 'medium'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordStrengthMeter;