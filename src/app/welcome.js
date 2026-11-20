import React from 'react';
import { router } from 'expo-router';
import WelcomeScreen from '../screens/WelcomeScreen.js';

export default function WelcomeRoute() {
  return (
    <WelcomeScreen
      onLogin={() => router.push('/auth')}
      onRegister={() => router.push({ pathname: '/auth', params: { mode: 'register' } })}
    />
  );
}
