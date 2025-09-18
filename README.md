# AgriConnect Frontend

A modern React application for connecting agricultural stakeholders including farmers, buyers, brokers, processors, and consumers.

## Features

- **Landing Page**: Beautiful, responsive landing page with call-to-action
- **Authentication**: Firebase-based auth with both email/password and Google SSO
- **Onboarding Flow**: Progressive user onboarding with role selection, profile setup, and category selection
- **Dashboard**: Product listings with search, filter, and pagination
- **Profile Management**: User profile with settings and account management

## Tech Stack

- **React 18**: Modern React with hooks and functional components
- **Firebase**: Authentication and user management
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Form handling and validation
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Toast notifications

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env` file with your Firebase configuration:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

3. Start the development server:

```bash
npm start
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable components
│   ├── dashboard/      # Dashboard and main app views
│   ├── landing/        # Landing page
│   ├── onboarding/     # User onboarding flow
│   └── profile/        # User profile pages
├── contexts/           # React contexts
├── types/              # Type definitions
├── App.js              # Main app component
└── index.js            # App entry point
```

## User Flow

1. **Landing**: Users see the landing page with options to sign up or continue as guest
2. **Authentication**: Users can sign up/in with email/password or Google
3. **Onboarding**: New users complete a 3-step onboarding process:
   - Role selection (Farmer, Buyer, Broker, etc.)
   - Profile setup (Name, location, photo)
   - Category selection (Product categories they deal with)
4. **Dashboard**: Main application with product listings and navigation
5. **Profile**: User can manage their profile and app settings

## Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App
