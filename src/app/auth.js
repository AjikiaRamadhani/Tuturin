import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useTuturin } from '../providers/TuturinProvider.js';
import AuthScreen from '../screens/auth/AuthScreen.js';

export default function AuthRoute() {
  const { mode } = useLocalSearchParams();
  const { signIn, signUp, resetPassword } = useTuturin();
  return (
    <AuthScreen
      initialMode={mode === 'register' ? 'register' : 'login'}
      onSignIn={signIn}
      onSignUp={signUp}
      onReset={resetPassword}
      onBackWelcome={() => router.replace('/welcome')}
    />
  );
}

