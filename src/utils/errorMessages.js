export const ERROR_MESSAGES = {
  // Flashcard Generation Errors
  FLASHCARD_GENERATION: {
    CONTENT_TOO_SHORT: {
      title: "Content Too Short",
      message: "The summary content is too short to generate meaningful flashcards. Please add more content to your notes."
    },
    ALREADY_EXISTS: {
      title: "Flashcards Already Exist",
      message: "Flashcards for this note already exist. You can view or edit the existing flashcards."
    },
    SERVER_ERROR: {
      title: "Server Error",
      message: "We encountered an issue while generating flashcards. Please try again later."
    },
    RATE_LIMIT: {
      title: "Too Many Requests",
      message: "You've reached the limit for flashcard generation. Please wait a few minutes and try again."
    }
  },

  // Quiz Generation Errors
  QUIZ_GENERATION: {
    CONTENT_TOO_SHORT: {
      title: "Content Too Short",
      message: "The summary content is too short to generate a meaningful quiz. Please add more content to your notes."
    },
    ALREADY_EXISTS: {
      title: "Quiz Already Exists",
      message: "A quiz for this note already exists. You can take the existing quiz."
    },
    SERVER_ERROR: {
      title: "Server Error",
      message: "We encountered an issue while generating the quiz. Please try again later."
    },
    RATE_LIMIT: {
      title: "Too Many Requests",
      message: "You've reached the limit for quiz generation. Please wait a few minutes and try again."
    }
  },

  // General Errors
  GENERAL: {
    NETWORK_ERROR: {
      title: "Connection Error",
      message: "Please check your internet connection and try again."
    },
    UNAUTHORIZED: {
      title: "Session Expired",
      message: "Your session has expired. Please log in again."
    },
  }
}; 