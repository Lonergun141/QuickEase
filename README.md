# QuickEase

In today’s academic environment, students often struggle to balance their study sessions due to non-academic responsibilities that demand significant time and energy. Additionally, tasks like manually summarizing study materials and creating self-assessment tools, such as flashcards and quizzes, consume a lot of time and effort, reducing the effectiveness of their study sessions. To address these challenges, the QuickEase web and mobile application was developed to streamline students’ study sessions. The system uses technologies such as OpenAI GPT-4o, Google Vision, and ConvertAPI which allows students to upload study materials in various formats and automatically generate summaries, flashcards, and quizzes. Additional features, including a Pomodoro Timer and a Gamified Badge System, help boost productivity, motivation, and engagement of the students using the system. The user testing showed an average System Usability Scale (SUS) score of 82.29, categorized as "Excellent," while ISO/IEC 25010 evaluations highlighted strong functional suitability and usability. These results conclude that QuickEase successfully addressed key challenges in streamlining students’ study sessions. The researchers recommend extending availability to iOS and introducing an AI chatbot for additional study assistance.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 12.2.0 or higher. You can download it from the [official website](https://nodejs.org/).
- **Package Manager**: Either [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/).

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Lonergun141/QuickEase.git
   cd QuickEase
   ```

2. **Install Dependencies**:

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

## Running the Application

To start the development server:

Using npm:

```bash
npm run dev
```

Or using Yarn:

```bash
yarn dev
```

The application will be accessible at `http://localhost:3000/` by default. You can modify the port in the `vite.config.js` file if needed.

## Building for Production

To build the application for production:

Using npm:

```bash
npm run build
```

Or using Yarn:

```bash
yarn build
```

The optimized files will be generated in the `dist` directory.

## Previewing the Production Build

To preview the production build locally:

Using npm:

```bash
npm run preview
```

Or using Yarn:

```bash
yarn preview
```

This will start a local server to serve the production build.


This command will run ESLint based on the configurations specified in the project.

## Deployment

QuickEase is configured for deployment on platforms like Vercel. For more details on deploying Vite applications, refer to the [Vite Deployment Guide](https://vite.dev/guide/static-deploy.html).

## Learn More

- [Vite Documentation](https://vite.dev/guide/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

Feel free to explore these resources to get a deeper understanding of the tools used in this project.

---

*Note: This project uses various dependencies such as `@emotion/react`, `@mui/material`, and `axios`. For a complete list, refer to the `package.json` file.*
