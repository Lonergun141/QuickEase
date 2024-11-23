import React, { useState, useEffect } from 'react';
import { FiShield, FiCheck, FiAlertCircle, FiLock, FiInfo } from 'react-icons/fi';

const PasswordStrengthMeter = ({ password }) => {
  const [passwordStrength, setPasswordStrength] = useState('weak');
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });
  const [isTyping, setIsTyping] = useState(false);


  const getPasswordStrength = (password) => {
    if (password.length >= 12 && passwordRequirements.hasUppercase && passwordRequirements.hasNumber && passwordRequirements.hasSpecialChar) {
      return 'strong';
    } else if (password.length >= 8) {
      return 'medium';
    } else {
      return 'weak';
    }
  };


  const checkPasswordRequirements = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 12;

    setPasswordRequirements({
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      hasMinLength,
    });
  };

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
    checkPasswordRequirements(password);
    setIsTyping(password.length > 0);
  }, [password]);

  const hidePasswordMeter = passwordStrength === 'strong' && password.length >= 12;

  const getStrengthConfig = (strength) => {
    switch (strength) {
      case 'strong':
        return {
          color: 'emerald',
          icon: FiShield,
          message: 'Very secure password'
        };
      case 'medium':
        return {
          color: 'amber',
          icon: FiInfo,
          message: 'Could be stronger'
        };
      default:
        return {
          color: 'red',
          icon: FiAlertCircle,
          message: 'Too weak'
        };
    }
  };

  const strengthConfig = getStrengthConfig(passwordStrength);
  const StrengthIcon = strengthConfig.icon;

  const requirements = [
    { 
      met: passwordRequirements.hasMinLength, 
      text: 'At least 12 characters', 
      icon: FiShield 
    },
    { 
      met: passwordRequirements.hasUppercase, 
      text: 'One uppercase letter', 
      icon: FiCheck 
    },
    { 
      met: passwordRequirements.hasNumber, 
      text: 'One number', 
      icon: FiCheck 
    },
    { 
      met: passwordRequirements.hasSpecialChar, 
      text: 'One special character', 
      icon: FiCheck 
    },
  ];

  return (
    <>
      {isTyping && !hidePasswordMeter && (
        <div className="w-full mt-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="p-4 space-y-5">
            {/* Strength Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${strengthConfig.color}-50 dark:bg-${strengthConfig.color}-500/10`}>
                  <StrengthIcon className={`w-5 h-5 text-${strengthConfig.color}-500`} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium text-${strengthConfig.color}-500`}>
                    {strengthConfig.message}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Password Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((segment) => (
                <div
                  key={segment}
                  className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden"
                >
                  <div
                    className={`h-full transition-all duration-300 ease-out bg-${strengthConfig.color}-500 ${
                      (passwordStrength === 'weak' && segment === 1) ||
                      (passwordStrength === 'medium' && segment <= 2) ||
                      (passwordStrength === 'strong' && segment <= 3)
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-2 gap-3">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 ${
                    req.met ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <div className={`flex-shrink-0 ${req.met ? `text-${strengthConfig.color}-500` : ''}`}>
                    {req.met ? (
                      <FiCheck className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm">{req.text}</span>
                </div>
              ))}
            </div>

            {/* Tip Section */}
            {passwordStrength !== 'strong' && (
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <FiLock className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">
                  Use a mix of letters, numbers, and symbols to create a stronger password
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordStrengthMeter;