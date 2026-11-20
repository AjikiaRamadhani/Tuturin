import { BaseService } from './BaseService.js';

export class ProgressRepository extends BaseService {
  async listCompleted(userId, day) {
    const rows = this.unwrap(await this.client.from('lesson_results')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('day', day));
    return (rows || []).map((row) => row.lesson_id);
  }

  async listAllCompleted(userId) {
    const rows = this.unwrap(await this.client.from('lesson_results')
      .select('lesson_id')
      .eq('user_id', userId));
    return [...new Set((rows || []).map((row) => row.lesson_id))];
  }

  async saveLessonResult(userId, lessonId, day, mastery, seconds) {
    this.unwrap(await this.client.from('lesson_results').upsert(
      { user_id: userId, lesson_id: lessonId, day, mastery, seconds },
      { onConflict: 'user_id,lesson_id,day' }
    ));
  }

  async getStreak(userId) {
    const row = this.unwrap(await this.client.from('streaks')
      .select('last_day, count')
      .eq('user_id', userId)
      .maybeSingle());
    return row ? { last: row.last_day, count: row.count } : { last: null, count: 0 };
  }

  async saveStreak(userId, streak) {
    this.unwrap(await this.client.from('streaks').upsert(
      { user_id: userId, last_day: streak.last, count: streak.count },
      { onConflict: 'user_id' }
    ));
  }
}

