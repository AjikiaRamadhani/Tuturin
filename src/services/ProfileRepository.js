import { BaseService } from './BaseService.js';

export class ProfileRepository extends BaseService {
  async listUsers() {
    return this.unwrap(await this.client.from('profiles')
      .select('id, email, display_name, role, active, created_at')
      .order('created_at', { ascending: false }));
  }

  async updateUser(id, changes) {
    const rows = this.unwrap(await this.client.from('profiles')
      .update(changes)
      .eq('id', id)
      .select('id'));
    if (!rows || rows.length === 0) throw new Error('Perubahan pengguna tidak tersimpan. Periksa role dan status admin.');
  }

  async findById(userId) {
    const profile = this.unwrap(await this.client.from('profiles').select('*').eq('id', userId).maybeSingle());
    if (!profile?.avatar_path) return profile;
    const signedUrl = this.unwrap(await this.client.storage.from('avatars').createSignedUrl(profile.avatar_path, 604800));
    return { ...profile, avatar_url: signedUrl.signedUrl };
  }

  async savePreferences(userId, preferences) {
    const rows = this.unwrap(await this.client.from('profiles')
      .update({
        level: preferences.level,
        goal: preferences.goal,
        target: preferences.target,
      })
      .eq('id', userId)
      .select('id'));
    if (!rows || rows.length === 0) throw new Error('Preferensi belum tersimpan. Periksa status akunmu.');
  }

  async saveAvatar(userId, asset, previousPath) {
    const response = await fetch(asset.uri);
    if (!response.ok) throw new Error('Foto tidak dapat dibaca dari perangkat.');
    const file = await response.blob();
    if (file.size > 5 * 1024 * 1024) throw new Error('Ukuran foto maksimal 5 MB.');

    const contentType = asset.mimeType || file.type || 'image/jpeg';
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType)) {
      throw new Error('Pilih foto berformat JPG, PNG, atau WebP.');
    }
    const extension = contentType.split('/')[1].replace('jpeg', 'jpg');
    const objectPath = `${userId}/${Date.now()}.${extension}`;
    const bucket = this.client.storage.from('avatars');
    this.unwrap(await bucket.upload(objectPath, file, {
      contentType,
      cacheControl: '3600',
      upsert: false,
    }));

    let rows;
    try {
      rows = this.unwrap(await this.client.from('profiles')
        .update({ avatar_path: objectPath })
        .eq('id', userId)
        .select('id'));
    } catch (error) {
      await bucket.remove([objectPath]);
      throw error;
    }
    if (!rows || rows.length === 0) {
      await bucket.remove([objectPath]);
      throw new Error('Foto terunggah, tetapi profil tidak dapat diperbarui.');
    }

    if (previousPath && previousPath !== objectPath && previousPath.startsWith(`${userId}/`)) {
      await bucket.remove([previousPath]);
    }
    const signedUrl = this.unwrap(await bucket.createSignedUrl(objectPath, 604800));
    return { path: objectPath, url: signedUrl.signedUrl };
  }

  async removeAvatar(userId, avatarPath) {
    if (!avatarPath || !avatarPath.startsWith(`${userId}/`)) return;
    this.unwrap(await this.client.storage.from('avatars').remove([avatarPath]));
  }
}

