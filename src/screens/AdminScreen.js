import React, { useCallback, useEffect, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { Screen, Title, Card, CardHeader, Button, Badge, Chip, T } from '../components/ui.js';
import { GOALS, LEVELS } from '../data.js';
import { colors, fonts } from '../theme.js';

const inputStyle = {
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.card,
  borderRadius: 14,
  paddingHorizontal: 14,
  paddingVertical: 12,
  color: colors.text,
  fontFamily: fonts.regular,
  fontSize: 15,
  marginTop: 8,
};

export default function AdminScreen({ profile, lessonsApi, usersApi, onSignOut, onOpenAccount }) {
  const [tab, setTab] = useState('lessons');
  const [lessons, setLessons] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [level, setLevel] = useState('pemula');
  const [goal, setGoal] = useState('percakapan');
  const [objectives, setObjectives] = useState('');
  const [steps, setSteps] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [focusedInput, setFocusedInput] = useState('');

  const refresh = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const [nextLessons, nextUsers] = await Promise.all([lessonsApi.listAll(), usersApi.listUsers()]);
      setLessons(nextLessons);
      setUsers(nextUsers);
    } catch (e) {
      setError(e.message || 'Data admin gagal dimuat.');
    } finally {
      setBusy(false);
    }
  }, [lessonsApi, usersApi]);

  useEffect(() => {
    const timer = setTimeout(refresh, 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  const clearEditor = () => {
    setEditing(null);
    setTitle('');
    setLessonId('');
    setLevel('pemula');
    setGoal('percakapan');
    setObjectives('');
    setSteps('');
  };

  const editLesson = (lesson) => {
    setEditing(lesson);
    setTitle(lesson.title);
    setLessonId(lesson.id);
    setLevel(lesson.level);
    setGoal(lesson.goal);
    setObjectives((lesson.objectives || []).join('\n'));
    setSteps((lesson.steps || []).map((step) => `${step.en} | ${step.id}`).join('\n'));
    setTab('lessons');
  };

  const saveLesson = async () => {
    const parsedSteps = steps.split('\n').map((line) => line.split('|').map((part) => part.trim()))
      .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
      .map(([en, id]) => ({ en, id }));
    const parsedObjectives = objectives.split('\n').map((item) => item.trim()).filter(Boolean);
    if (!title.trim() || !/^[a-z0-9-]+$/.test(lessonId) || !parsedObjectives.length || !parsedSteps.length) {
      setError('Isi judul, ID berupa huruf kecil/angka/tanda hubung, minimal satu tujuan, dan langkah berformat “Inggris | Indonesia”.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await lessonsApi.save({
        id: lessonId,
        title: title.trim(),
        level,
        goal,
        minutes: 4,
        objectives: parsedObjectives,
        published: editing ? editing.published : false,
        sort_order: editing?.sortOrder ?? lessons.length + 1,
        steps: parsedSteps,
      });
      setNotice(editing ? 'Perubahan pelajaran tersimpan.' : 'Pelajaran tersimpan sebagai draf.');
      clearEditor();
      await refresh();
    } catch (e) {
      setError(e.message || 'Pelajaran gagal disimpan.');
    } finally {
      setBusy(false);
    }
  };

  const togglePublished = async (lesson) => {
    setBusy(true);
    setError('');
    try {
      await lessonsApi.save({
        id: lesson.id, title: lesson.title, level: lesson.level, goal: lesson.goal,
        minutes: lesson.minutes, objectives: lesson.objectives, published: !lesson.published,
        sort_order: lesson.sortOrder, steps: lesson.steps,
      });
      setNotice(lesson.published ? 'Pelajaran disimpan sebagai draf.' : 'Pelajaran diterbitkan.');
      await refresh();
    } catch (e) {
      setError(e.message || 'Status publikasi gagal diubah.');
    } finally {
      setBusy(false);
    }
  };

  const removeLesson = (lesson) => {
    const run = async () => {
      setBusy(true);
      setError('');
      try {
        await lessonsApi.remove(lesson.id);
        setNotice('Pelajaran dihapus.');
        await refresh();
      } catch (e) {
        setError(e.message || 'Pelajaran gagal dihapus.');
      } finally {
        setBusy(false);
      }
    };
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm(`Hapus pelajaran “${lesson.title}”?`)) run();
    } else {
      Alert.alert('Hapus pelajaran?', lesson.title, [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: run },
      ]);
    }
  };

  const updateUser = async (user, changes) => {
    setBusy(true);
    setError('');
    try {
      await usersApi.updateUser(user.id, changes);
      setNotice(`Akun ${user.email} diperbarui.`);
      await refresh();
    } catch (e) {
      setError(e.message || 'Perubahan akun gagal disimpan.');
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setError('');
    try {
      await onSignOut();
    } catch (e) {
      setError(e.message || 'Gagal keluar. Coba lagi.');
    }
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Badge label="RUANG ADMIN" tone="coral" icon="shield-checkmark-outline" />
          <Title testID="admin-title" style={{ marginTop: 10 }}>Hai, {profile.display_name || 'Admin'}!</Title>
          <T color={colors.muted} style={{ marginTop: 4 }}>{profile.email}</T>
        </View>
        <View style={{ gap: 6 }}>
          <Button label="Akun" variant="secondary" icon="person-outline" onPress={onOpenAccount} />
          <Button label="Keluar" variant="ghost" icon="log-out-outline" onPress={logout} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 22, marginBottom: 16 }}>
        <Chip label="Pelajaran" selected={tab === 'lessons'} onPress={() => setTab('lessons')} icon="book-outline" />
        <Chip label="Pengguna" selected={tab === 'users'} onPress={() => setTab('users')} icon="people-outline" />
      </View>

      {error ? <Card tone="coralSoft"><T testID="admin-error" color={colors.bad}>{error}</T></Card> : null}
      {notice ? <Card tone="tealSoft"><T color={colors.teal}>{notice}</T></Card> : null}

      {tab === 'lessons' ? (
        <>
          <Card>
            <CardHeader icon={editing ? 'create-outline' : 'add-circle-outline'} title={editing ? 'Ubah pelajaran' : 'Tambah pelajaran'} subtitle="Isi langkah satu per baris: kalimat Inggris | terjemahan Indonesia" />
            <T v="caption" color={colors.muted}>ID pelajaran</T>
            <TextInput testID="admin-lesson-id" value={lessonId} onChangeText={setLessonId} onFocus={() => setFocusedInput('id')} onBlur={() => setFocusedInput('')} selectionColor={colors.primary} cursorColor={colors.primary} placeholderTextColor={colors.muted} placeholder="contoh: pemula-kafe" autoCapitalize="none" editable={!editing} style={[inputStyle, focusedInput === 'id' && { borderColor: colors.primary, backgroundColor: '#FFFFFF' }]} />
            <T v="caption" color={colors.muted} style={{ marginTop: 12 }}>Judul</T>
            <TextInput testID="admin-lesson-title" value={title} onChangeText={setTitle} onFocus={() => setFocusedInput('title')} onBlur={() => setFocusedInput('')} selectionColor={colors.primary} cursorColor={colors.primary} placeholderTextColor={colors.muted} placeholder="Pesan di kafe" style={[inputStyle, focusedInput === 'title' && { borderColor: colors.primary, backgroundColor: '#FFFFFF' }]} />
            <T v="caption" color={colors.muted} style={{ marginTop: 12 }}>Level</T>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>{LEVELS.map((item) => <Chip key={item.id} label={item.label} selected={level === item.id} onPress={() => setLevel(item.id)} />)}</View>
            <T v="caption" color={colors.muted} style={{ marginTop: 12 }}>Tujuan</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>{GOALS.map((item) => <Chip key={item.id} label={item.label} selected={goal === item.id} onPress={() => setGoal(item.id)} />)}</View>
            <T v="caption" color={colors.muted} style={{ marginTop: 12 }}>Tujuan latihan (satu per baris)</T>
            <TextInput testID="admin-lesson-objectives" value={objectives} onChangeText={setObjectives} onFocus={() => setFocusedInput('objectives')} onBlur={() => setFocusedInput('')} selectionColor={colors.primary} cursorColor={colors.primary} placeholderTextColor={colors.muted} placeholder={'Memesan makanan\nMeminta tagihan'} multiline style={[inputStyle, { minHeight: 76, textAlignVertical: 'top' }, focusedInput === 'objectives' && { borderColor: colors.primary, backgroundColor: '#FFFFFF' }]} />
            <T v="caption" color={colors.muted} style={{ marginTop: 12 }}>Langkah latihan</T>
            <TextInput testID="admin-lesson-steps" value={steps} onChangeText={setSteps} onFocus={() => setFocusedInput('steps')} onBlur={() => setFocusedInput('')} selectionColor={colors.primary} cursorColor={colors.primary} placeholderTextColor={colors.muted} placeholder={'Can I see the menu? | Boleh saya lihat menunya?'} multiline style={[inputStyle, { minHeight: 110, textAlignVertical: 'top' }, focusedInput === 'steps' && { borderColor: colors.primary, backgroundColor: '#FFFFFF' }]} />
            <View style={{ marginTop: 14 }}><Button testID="admin-lesson-save" label={busy ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Simpan sebagai draf'} disabled={busy} onPress={saveLesson} /></View>
            {editing ? <View style={{ marginTop: 8 }}><Button label="Batal mengedit" variant="secondary" onPress={clearEditor} /></View> : null}
          </Card>
          <Card>
            <CardHeader icon="library-outline" title={`Daftar pelajaran (${lessons.length})`} right={<Button label="Muat ulang" variant="secondary" disabled={busy} onPress={refresh} />} />
            {lessons.map((lesson) => (
              <View key={lesson.id} style={{ paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <T v="bodyBold" style={{ flex: 1, marginRight: 8 }}>{lesson.title}</T>
                  <Badge label={lesson.published ? 'Terbit' : 'Draf'} tone={lesson.published ? 'mint' : 'yellow'} />
                </View>
                <T v="caption" color={colors.muted} style={{ marginTop: 4 }}>{lesson.level} · {lesson.goal} · {lesson.steps.length} langkah</T>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                  <Button label="Edit" variant="secondary" onPress={() => editLesson(lesson)} />
                  <Button label={lesson.published ? 'Jadikan draf' : 'Terbitkan'} variant="secondary" disabled={busy} onPress={() => togglePublished(lesson)} />
                  <Button label="Hapus" variant="ghost" disabled={busy} onPress={() => removeLesson(lesson)} />
                </View>
              </View>
            ))}
            {!lessons.length && !busy ? <T color={colors.muted}>Belum ada pelajaran.</T> : null}
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader icon="people-outline" title={`Pengguna (${users.length})`} subtitle="Atur akses berdasarkan role akun." />
          {users.map((user) => (
            <View key={user.id} style={{ paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
              <T v="bodyBold">{user.display_name || user.email}</T>
              <T v="caption" color={colors.muted} style={{ marginTop: 3 }}>{user.email}</T>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Button label={user.role === 'admin' ? 'Admin' : 'Jadikan admin'} variant={user.role === 'admin' ? 'primary' : 'secondary'} disabled={busy || user.id === profile.id || (user.role === 'admin' && users.filter((item) => item.role === 'admin' && item.active).length <= 1)} onPress={() => updateUser(user, { role: user.role === 'admin' ? 'learner' : 'admin' })} />
                <Button label={user.active ? 'Nonaktifkan' : 'Aktifkan'} variant="secondary" disabled={busy || user.id === profile.id || (user.role === 'admin' && user.active && users.filter((item) => item.role === 'admin' && item.active).length <= 1)} onPress={() => updateUser(user, { active: !user.active })} />
              </View>
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}
