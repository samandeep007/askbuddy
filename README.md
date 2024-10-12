# AskBuddy | Send Anonymous Confessions

## Description:
AskBuddy is an online platform where you can receive/send anonymous messages. It all starts with creating an account and sharing your unique profile link to the audience you want to receive messages from. The audience has option to send their own message or send an AI generated message of their choice

## Features:
- User Registration: Users can create an account to ask and answer questions.
- AI: Users can get message suggestions from AI and send them.


## Technologies Used:
- Frontend: React, Tailwind, ShadCn, React-Hook-Forms, Typescript, ZOD
- Backend: Next Js, Next-auth, Express
- Database: MongoDB
- SMTP: Resend Email
- AI: Vercel AI 
- AI Provider: Google Gemini
- Authentication: JSON Web Tokens (JWT), Next-auth Session
- Deployment: Vercel


## Installation:
1. Clone the repository: `git clone https://github.com/samandeep007/askbuddy.git`
2. Navigate to the project directory: `cd askbuddy`
3. Install dependencies: `npm install`
4. Set up the environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:
      ```
      MONGO_URI=your_mongodb_uri
      RESEND_API_KEY=your_resend_api_key
      NEXTAUTH_SECRET=your_next-auth_secret
      NEXTAUTH_URL=http://localhost:3000
      GEMINI_API_KEY=your_gemini_api_key
      ```
5. Start the server: `npm run dev`

## Usage:
1. Open your web browser and navigate to `http://localhost:3000`.
2. Sign up for a new account or log in if you already have one.
3. Verify your account using OTP (One-time Password) sent to your email
4. Share your profile link to others.
5. See all the anonymous messages you get.

## Contributing:
We welcome contributions from the community. To contribute to AskBuddy, please follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m "Add your commit message"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request on GitHub.

## License:
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
