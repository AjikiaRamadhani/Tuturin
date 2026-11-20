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
    return this.unwrap(await this.client.from('profiles').select('*').eq('id', userId).maybeSingle());
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
}

