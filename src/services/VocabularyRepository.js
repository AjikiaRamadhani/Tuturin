import { BaseService } from './BaseService.js';

export class VocabularyRepository extends BaseService {
  async list(userId) {
    const rows = this.unwrap(await this.client.from('saved_vocab')
      .select('en, id_text, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }));
    return (rows || []).map((row) => ({ en: row.en, id: row.id_text }));
  }

  async save(userId, phrase) {
    this.unwrap(await this.client.from('saved_vocab').upsert(
      { user_id: userId, en: phrase.en, id_text: phrase.id },
      { onConflict: 'user_id,en' }
    ));
  }

  async remove(userId, phrase) {
    this.unwrap(await this.client.from('saved_vocab').delete()
      .eq('user_id', userId)
      .eq('en', phrase.en));
  }
}

