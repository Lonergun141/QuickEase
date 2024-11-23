import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faFire,
  faWandMagicSparkles,
  faTimes,
  faSave,
  faArrowRight,
  faLightbulb,
  faClone,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

const SaveConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onSaveWithDelete, 
  onSaveOnly, 
  quizExists, 
  flashcardsExist,
  isSaving 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Simple backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 
          rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon 
                  icon={faWandMagicSparkles} 
                  className="text-lg text-primary dark:text-primary-light" 
                />
                <h3 className="text-lg font-psemibold text-zinc-800 dark:text-zinc-100">
                  Update Study Materials
                </h3>
              </div>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 
                  dark:hover:text-zinc-300 rounded-md transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="text-lg" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
        
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon 
                  icon={faBookOpen} 
                  className="text-zinc-400 dark:text-zinc-500" 
                />
                <h4 className="font-pmedium text-zinc-900 dark:text-zinc-100">
                  Current Materials
                </h4>
              </div>
              
              <div> 
                {(quizExists || flashcardsExist) ? (
                  <ul className="space-y-2">
                    {quizExists && (
                      <li className="flex items-center gap-2.5">
                        <FontAwesomeIcon 
                          icon={faLightbulb} 
                          className="text-primary w-4" 
                        />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          Active quiz
                        </span>
                      </li>
                    )}
                    {flashcardsExist && (
                      <li className="flex items-center gap-2.5">
                        <FontAwesomeIcon 
                          icon={faClone} 
                          className="text-primary w-4" 
                        />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          Active flashcard set
                        </span>
                      </li>
                    )}
                  </ul>
                ) : (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    No active study materials
                  </span>
                )}
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-md p-4">
              <div className="flex gap-3">
                <FontAwesomeIcon 
                  icon={faFire} 
                  className="mt-0.5 text-amber-500 dark:text-amber-400" 
                />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-300">
                    Important Note
                  </h4>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-400/90">
                    You've modified the summary content. Your existing study materials may no longer 
                    align with the updated content.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Delete Option */}
              <button
                onClick={onSaveWithDelete}
                disabled={isSaving}
                className="w-full flex items-center justify-between p-3 
                  bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20
                  text-rose-700 dark:text-rose-400
                  border border-rose-200 dark:border-rose-500/20
                  rounded-md transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 
                        rounded-full animate-spin" />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="block font-medium">
                      {isSaving ? 'Deleting Content...' : 'Save and Delete Existing Content'}
                    </span>
                    <span className="text-sm text-rose-600/80 dark:text-rose-400/80">
                      Remove current materials and save changes
                    </span>
                  </div>
                </div>
              </button>

              {/* Keep Option */}
              <button
                onClick={onSaveOnly}
                disabled={isSaving}
                className="w-full flex items-center justify-between p-3 
                  bg-primary/5 hover:bg-primary/10 
                  dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20
                  text-primary dark:text-primary-light
                  border border-primary/20 dark:border-primary-dark/20
                  rounded-md transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary 
                        rounded-full animate-spin" />
                    ) : (
                      <FontAwesomeIcon icon={faSave} className="text-lg" />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="block font-medium">
                      {isSaving ? 'Saving Changes...' : 'Save and Keep Existing Content'}
                    </span>
                    <span className="text-sm opacity-80">
                      Preserve current materials and save changes
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 
            border-t border-zinc-200 dark:border-zinc-800 rounded-b-lg">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="w-full px-4 py-2 text-sm font-medium 
                text-zinc-600 dark:text-zinc-400 
                hover:text-zinc-900 dark:hover:text-zinc-200
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmationModal; 