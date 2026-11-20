import React, { useEffect } from 'react';
import { Animated, Platform, Pressable, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, T } from './ui.js';
import { colors } from '../theme.js';

const ITEMS = [
  { id: 'home', label: 'Beranda', icon: 'home-outline', activeIcon: 'home' },
  { id: 'training', label: 'Latihan', icon: 'mic-outline', activeIcon: 'mic' },
  { id: 'profile', label: 'Profil', icon: 'person-circle-outline', activeIcon: 'person-circle' },
];
const tabProgress = new Animated.Value(0);

export default function BottomNav({ active }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bottom = Platform.OS === 'web' ? 14 : Math.max(insets.bottom, 10) + 8;
  const tabWidth = Math.max(0, (width - 50) / ITEMS.length);
  const activeIndex = Math.max(0, ITEMS.findIndex((item) => item.id === active));
  const useNativeDriver = Platform.OS !== 'web';

  useEffect(() => {
    const animation = Animated.spring(tabProgress, {
      toValue: activeIndex,
      damping: 19,
      stiffness: 155,
      mass: 0.9,
      overshootClamping: true,
      useNativeDriver,
    });
    animation.start();
  }, [activeIndex, useNativeDriver]);

  const indicatorOffset = tabProgress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, tabWidth, tabWidth * 2],
  });

  return (
    <View
      accessibilityRole="tablist"
      style={{
        position: 'absolute',
        left: 20,
        right: 20,
        bottom,
        minHeight: 68,
        padding: 5,
        borderRadius: 999,
        backgroundColor: '#252936',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#171B26',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 5,
          top: 5,
          bottom: 5,
          width: tabWidth,
          borderRadius: 999,
          backgroundColor: colors.primary,
          transform: [{ translateX: indicatorOffset }],
        }}
      />
      {ITEMS.map((item) => {
        const selected = item.id === active;
        const itemIndex = ITEMS.findIndex((tab) => tab.id === item.id);
        const iconScale = tabProgress.interpolate({
          inputRange: [0, 1, 2],
          outputRange: ITEMS.map((_, index) => (index === itemIndex ? 1.08 : 0.94)),
          extrapolate: 'clamp',
        });
        return (
          <Pressable
            key={item.id}
            testID={`tab-${item.id}`}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={item.label}
            onPress={() => {
              const href = item.id === 'profile' ? '/account' : `/${item.id}`;
              if (!selected) router.navigate(href);
            }}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: 58,
              borderRadius: 999,
              backgroundColor: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.82 : 1,
            })}
          >
            <Animated.View style={{ transform: [{ scale: iconScale }] }}>
              <Icon name={selected ? item.activeIcon : item.icon} size={21} color={selected ? '#FFFFFF' : '#C3C7D2'} />
            </Animated.View>
            <T v="caption" color={selected ? '#FFFFFF' : '#C3C7D2'} style={{ marginTop: 2, fontSize: 11 }}>
              {item.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}
