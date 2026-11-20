import { BaseService } from './BaseService.js';
import { loadJSON, saveJSON } from './storage.js';
import { LESSONS } from '../data.js';

const CACHE_KEY = 'tuturin:lessons-cache:v2';

function mapLesson(row) {
  const steps = [...(row.lesson_steps || [])]
    .sort((a, b) => a.position - b.position)
    .map((step) => ({ en: step.en, id: step.id_text }));

  return {
    id: row.id,
    level: row.level,
    goal: row.goal,
    title: row.title,
    minutes: row.minutes,
    objectives: row.objectives || [],
    sortOrder: row.sort_order,
    steps,
  };
}

export class LessonRepository extends BaseService {
  async listAll() {
    const rows = this.unwrap(await this.client
      .from('lessons')
      .select('id, level, goal, title, minutes, objectives, sort_order, published, lesson_steps(position, en, id_text)')
      .order('sort_order', { ascending: true }));
    return (rows || []).map((row) => ({ ...mapLesson(row), published: row.published }));
  }

  async save(lesson) {
    this.unwrap(await this.client.rpc('save_lesson', { p: lesson }));
  }

  async remove(id) {
    this.unwrap(await this.client.from('lessons').delete().eq('id', id));
  }

  async listPublished() {
    try {
      const rows = this.unwrap(await this.client
        .from('lessons')
        .select('id, level, goal, title, minutes, objectives, sort_order, lesson_steps(position, en, id_text)')
        .eq('published', true)
        .order('sort_order', { ascending: true }));

      const lessons = (rows || []).map(mapLesson).filter((lesson) => lesson.steps.length > 0);
      await saveJSON(CACHE_KEY, lessons);
      return { lessons, source: 'server' };
    } catch (error) {
      const cached = await loadJSON(CACHE_KEY);
      if (Array.isArray(cached) && cached.length > 0) return { lessons: cached, source: 'cache' };
      return { lessons: LESSONS, source: 'bundled', warning: error.message };
    }
  }
}

