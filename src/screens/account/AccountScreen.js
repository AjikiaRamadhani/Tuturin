import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Screen, Title, Card, CardHeader, Button, Badge, Icon, T } from '../../components/ui.js';
import { GOALS, LEVELS } from '../../data.js';
import { colors } from '../../theme.js';

function Stat({ value, label, icon }) {
  return (
    <View style={{ flex: 1, minHeight: 88, padding: 12, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={20} color={colors.teal} />
      <T v="h3" style={{ marginTop: 5 }}>{value}</T>
      <T v="caption" color={colors.muted} style={{ textAlign: 'center', marginTop: 2 }}>{label}</T>
    </View>
  );
}

function PreferenceRow({ label, value, onPress, testID }) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={{ flexDirection: 'row', alignItems: 'center', minHeight: 54, borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 10 }}
    >
      <View style={{ flex: 1 }}>
        <T v="caption" color={colors.muted}>{label}</T>
        <T style={{ marginTop: 2 }}>{value}</T>
      </View>
      {onPress ? <Icon name="chevron-forward" size={18} color={colors.muted} /> : null}
    </Pressable>
  );
}

export default function AccountScreen({
  profile,
  preferences,
  progress,
  streak,
  vocabCount,
  onBack,
  hasBottomNav = false,
  onEditPreferences,
  onSignOut,
  onDeleteAccount,
  onUpdateAvatar,
  onRemoveAvatar,
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [confirmAvatarRemoval, setConfirmAvatarRemoval] = useState(false);
  const isAdmin = profile.role === 'admin';
  const levelLabel = LEVELS.find((item) => item.id === preferences?.level)?.label || 'Belum diatur';
  const goalLabel = GOALS.find((item) => item.id === preferences?.goal)?.label || 'Belum diatur';

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan. Coba lagi.');
      setBusy(false);
    }
  };

  const pickAvatar = async () => {
    setError('');
    setAvatarBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
      });
      if (result.canceled) return;
      await onUpdateAvatar(result.assets[0]);
    } catch (e) {
      setError(e.message || 'Foto profil belum berhasil diperbarui.');
    } finally {
      setAvatarBusy(false);
    }
  };

  const removeAvatar = async () => {
    setAvatarBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await onRemoveAvatar();
      setConfirmAvatarRemoval(false);
      setNotice(result?.cleanupWarning || 'Foto profil dihapus. Gambar bawaan Nala digunakan kembali.');
    } catch (e) {
      setError(e.message || 'Foto profil belum berhasil dihapus.');
    } finally {
      setAvatarBusy(false);
    }
  };

  return (
    <Screen hasBottomNav={hasBottomNav}>
      <Pressable
        testID="back-button"
        onPress={onBack}
        accessibilityRole="button"
        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingRight: 12, alignSelf: 'flex-start' }}
      >
        <Icon name="chevron-back" size={22} color={colors.primary} />
        <T v="bodyBold" color={colors.primary}>Kembali</T>
      </Pressable>

      <Title testID="account-title" style={{ marginTop: 10, marginBottom: 18 }}>Profil</Title>

      <Card style={{ alignItems: 'center', paddingVertical: 24 }}>
        <Pressable
          testID="change-avatar"
          onPress={pickAvatar}
          disabled={busy || avatarBusy || !onUpdateAvatar}
          accessibilityRole="button"
          accessibilityLabel="Ubah foto profil"
          style={{ alignItems: 'center' }}
        >
          <View style={{ width: 92, height: 92, borderRadius: 46, overflow: 'hidden', backgroundColor: colors.coralSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={profile.avatar_url ? { uri: profile.avatar_url } : require('../../../assets/nala-lion.png')}
              accessibilityLabel="Foto profil"
              style={{ width: 92, height: 92, borderRadius: 46 }}
            />
            {avatarBusy ? (
              <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(23,27,38,0.48)', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : null}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Icon name="camera-outline" size={16} color={colors.primary} />
            <T v="caption" color={colors.primary} style={{ marginLeft: 5 }}>{avatarBusy ? 'Menyimpan foto...' : 'Ubah foto'}</T>
          </View>
        </Pressable>
        {profile.avatar_url && onRemoveAvatar ? (
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            {!confirmAvatarRemoval ? (
              <Pressable
                testID="remove-avatar-button"
                onPress={() => setConfirmAvatarRemoval(true)}
                disabled={busy || avatarBusy}
                accessibilityRole="button"
                accessibilityLabel="Hapus foto profil"
              >
                <T v="caption" color={colors.bad}>Hapus foto</T>
              </Pressable>
            ) : (
              <View style={{ width: '100%', gap: 8 }}>
                <T v="caption" color={colors.muted} style={{ textAlign: 'center' }}>Hapus foto dan gunakan gambar bawaan?</T>
                <Button testID="remove-avatar-confirm" label={avatarBusy ? 'Menghapus...' : 'Ya, hapus foto'} icon="trash-outline" variant="secondary" disabled={busy || avatarBusy} onPress={removeAvatar} />
                <Button testID="remove-avatar-cancel" label="Batal" variant="secondary" disabled={avatarBusy} onPress={() => setConfirmAvatarRemoval(false)} />
              </View>
            )}
          </View>
        ) : null}
        <T v="h2" testID="account-name" style={{ marginTop: 12, textAlign: 'center' }}>{profile.display_name || 'Pengguna Tuturin'}</T>
        <T testID="account-email" color={colors.muted} style={{ marginTop: 3, textAlign: 'center' }}>{profile.email}</T>
        <Badge testID="account-role" label={isAdmin ? 'Admin' : 'Pelajar'} tone={isAdmin ? 'coral' : 'mint'} icon={isAdmin ? 'shield-checkmark-outline' : undefined} />
        {isAdmin ? (
          <T testID="account-admin-note" color={colors.muted} style={{ marginTop: 12, textAlign: 'center' }}>
            Kamu mengelola konten dan akun Tuturin.
          </T>
        ) : null}
      </Card>

      {!isAdmin ? (
        <>
          <T v="h3" style={{ marginTop: 8, marginBottom: 12 }}>Ringkasan hari ini</T>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
            <Stat value={progress?.completed?.length || 0} label="Pelajaran selesai" icon="checkmark-circle-outline" />
            <Stat value={streak || 0} label="Hari streak" icon="flame-outline" />
            <Stat value={vocabCount || 0} label="Kosakata" icon="bookmark-outline" />
          </View>

          <Card>
            <CardHeader icon="options-outline" title="Preferensi latihan" subtitle="Atur latihan sesuai kebutuhanmu." />
            <PreferenceRow label="Level" value={levelLabel} onPress={onEditPreferences} testID="profile-level" />
            <PreferenceRow label="Fokus belajar" value={goalLabel} onPress={onEditPreferences} testID="profile-goal" />
            <PreferenceRow label="Target harian" value={preferences ? `${preferences.target} pelajaran` : 'Belum diatur'} onPress={onEditPreferences} testID="profile-target" />
          </Card>
        </>
      ) : null}

      {error ? (
        <View style={{ backgroundColor: colors.badBg, borderRadius: 16, padding: 12, marginBottom: 16 }}>
          <T testID="account-error" color={colors.bad}>{error}</T>
        </View>
      ) : null}
      {notice ? (
        <View style={{ backgroundColor: colors.yellowSoft, borderRadius: 16, padding: 12, marginBottom: 16 }}>
          <T color={colors.onYellow}>{notice}</T>
        </View>
      ) : null}

      <View style={{ marginTop: 4 }}>
        <Button testID="logout-button" label={busy ? 'Memproses...' : 'Keluar dari akun'} icon="log-out-outline" variant="secondary" disabled={busy || avatarBusy} onPress={() => run(onSignOut)} />
      </View>

      <Card tone="surface" style={{ marginTop: 20 }}>
        <CardHeader icon="trash-outline" title="Hapus akun" />
        <T color={colors.muted} style={{ marginBottom: 12 }}>
          Akun dan data tersimpanmu akan dihapus permanen.
        </T>
        {!confirming ? (
            <Button testID="delete-account-button" label="Hapus akun saya" icon="trash-outline" variant="secondary" disabled={avatarBusy} onPress={() => setConfirming(true)} />
        ) : (
          <View>
            <T v="bodyBold" testID="delete-confirm-text" color={colors.bad} style={{ marginBottom: 12 }}>
              Penghapusan ini tidak bisa dibatalkan. Lanjutkan?
            </T>
            <Button testID="delete-confirm" label="Ya, hapus akun" icon="trash-outline" disabled={busy} onPress={() => run(onDeleteAccount)} />
            <View style={{ marginTop: 10 }}>
              <Button testID="delete-cancel" label="Batal" variant="secondary" disabled={busy} onPress={() => setConfirming(false)} />
            </View>
          </View>
        )}
      </Card>
    </Screen>
  );
}
