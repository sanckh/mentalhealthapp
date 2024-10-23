Overview
This project is a full-stack application with a React Native frontend and an Express/Node.js backend using Firebase for authentication and Firestore for data storage. It includes a daily check-in feature and user authentication.

Prerequisites
Node.js (v14+)
npm (v6+)
Firebase project set up with Firestore and Authentication

Getting Started

Backend Setup

Navigate to the Backend Directory:

cd backend

Install Dependencies:

npm install

Set Up Environment Variables:

Create a firebase_options.ts file and serviceAccountKey.json in the backend directory.

Add your Firebase credentials and other environment variables.

Start the Backend Server:

npm start. Alternatively using ts-node run npx ts-node src/index.ts


Frontend Setup

Navigate to the Frontend Directory:

cd mentalhealthappfrontend

Install Dependencies:

npm install

add a .env* file with your API_URL

Start the React Native App:

npm start
