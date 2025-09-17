import { useState } from 'react';
import { SignUpForm } from './SignUpForm';
import { SignInForm } from './SignInForm';
import { ProfileSetup } from './ProfileSetup';
import { WelcomeScreen } from './WelcomeScreen';

export type AuthStep = 'signin' | 'signup' | 'profile' | 'welcome' | 'complete';

// Base user data properties
interface UserData {
  email?: string;
  password?: string;
  name?: string;
  profilePicture?: string;
  interests?: string[];
  // Add other possible properties as needed
}

interface SignupData extends Partial<UserData> {
  email: string;
  password: string;
}

interface ProfileData extends Partial<UserData> {
  name: string;
  // Other required profile fields
}

interface AuthWrapperProps {
  onAuthComplete: (userData: UserData) => void;
}

export function AuthWrapper({ onAuthComplete }: AuthWrapperProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('signin');
  const [userData, setUserData] = useState<UserData>({});

  const handleSignInComplete = () => {
    // In SignInForm we're directly using AuthContext's login function
    // which will update the authentication state
    setCurrentStep('complete');
  };

  const handleSwitchToSignUp = () => {
    setCurrentStep('signup');
  };

  const handleSwitchToSignIn = () => {
    setCurrentStep('signin');
  };

  const handleSignUpComplete = (signupData: SignupData) => {
    setUserData(prev => ({ ...prev, ...signupData }));
    setCurrentStep('profile');
  };

  const handleProfileComplete = (profileData: ProfileData) => {
    setUserData(prev => ({ ...prev, ...profileData }));
    setCurrentStep('welcome');
  };

  const handleWelcomeComplete = () => {
    setCurrentStep('complete');
    // TODO: Send complete user data to backend
    // await createUserAccount(userData);
    onAuthComplete(userData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'signin':
        return <SignInForm 
                 onComplete={handleSignInComplete} 
                 onSwitchToSignUp={handleSwitchToSignUp} 
               />;
      case 'signup':
        return <SignUpForm 
                 onComplete={handleSignUpComplete}
                 onSwitchToSignIn={handleSwitchToSignIn} 
               />;
      case 'profile':
        return <ProfileSetup onComplete={handleProfileComplete} userData={userData} />;
      case 'welcome':
        return <WelcomeScreen onComplete={handleWelcomeComplete} userData={userData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderStep()}
      </div>
    </div>
  );
}