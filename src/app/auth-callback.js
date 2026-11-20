import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen, Title, Card, Button, T } from '../components/ui.js';
import { colors } from '../theme.js';
import { services } from '../services/index.js';

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function fragmentParams(fragment) {
  if (!fragment) return {};
  return Object.fromEntries(fragment.replace(/^#/, '').split('&').filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    const key = index < 0 ? part : part.slice(0, index);
    const value = index < 0 ? '' : part.slice(index + 1);
    return [decodeURIComponent(key), decodeURIComponent(value.replace(/\+/g, ' '))];
  }));
}

export default function AuthCallbackRoute() {
  const params = useLocalSearchParams();
  const request = useRef(null);
  const [error, setError] = useState('');
  const code = first(params.code);
  const tokenHash = first(params.token_hash);
  const type = first(params.type);
  const accessToken = first(params.access_token);
  const refreshToken = first(params.refresh_token);
  const fragment = fragmentParams(first(params['#']));
  const finalAccessToken = accessToken || fragment.access_token;
  const finalRefreshToken = refreshToken || fragment.refresh_token;
  const finalTokenHash = tokenHash || fragment.token_hash;
  const finalType = type || fragment.type;
  const finalCode = code || fragment.code;
  const errorDescription = first(params.error_description) || fragment.error_description;

  useEffect(() => {
    let active = true;
    if (!request.current) {
      request.current = errorDescription
        ? Promise.reject(new Error(errorDescription.replace(/\+/g, ' ')))
        : services.auth.completeEmailLink({
          code: finalCode,
          tokenHash: finalTokenHash,
          type: finalType,
          accessToken: finalAccessToken,
          refreshToken: finalRefreshToken,
        });
    }
    request.current
      .then(() => {
        if (active) router.replace('/set-password');
      })
      .catch((e) => {
        if (active) setError(e.message || 'Tautan gagal diproses. Minta tautan baru.');
      });
    return () => { active = false; };
  }, [errorDescription, finalAccessToken, finalCode, finalRefreshToken, finalTokenHash, finalType]);

  return (
    <Screen>
      <Title style={{ marginTop: 20 }}>Menyiapkan akunmu</Title>
      <Card style={{ marginTop: 20 }}>
        {error ? (
          <>
            <T color={colors.bad}>{error}</T>
            <View style={{ marginTop: 16 }}><Button label="Kembali ke masuk" onPress={() => router.replace('/auth')} /></View>
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 18 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <T color={colors.muted} style={{ marginTop: 14 }}>Memeriksa tautan undangan atau reset password...</T>
          </View>
        )}
      </Card>
    </Screen>
  );
}
