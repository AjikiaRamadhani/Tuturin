import { LEVELS } from '../data.js';

const LEVEL_RANK = Object.fromEntries(LEVELS.map((level, index) => [level.id, index]));

export function buildLearningPath(lessons, level, goal, completedIds = []) {
  const completed = new Set(completedIds);
  const ordered = (lessons || [])
    .filter((lesson) => lesson.goal === goal)
    .slice()
    .sort((a, b) => {
      const levelDifference = (LEVEL_RANK[a.level] ?? 99) - (LEVEL_RANK[b.level] ?? 99);
      return levelDifference || (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.title.localeCompare(b.title);
    });

  if (ordered.length === 0) return [];

  const requestedRank = LEVEL_RANK[level] ?? 0;
  let firstLessonIndex = ordered.findIndex((lesson) => (LEVEL_RANK[lesson.level] ?? 99) >= requestedRank);
  if (firstLessonIndex < 0) firstLessonIndex = ordered.length - 1;

  let canContinue = true;
  return ordered.map((lesson, index) => {
    if (index < firstLessonIndex) {
      return { ...lesson, pathStatus: 'skipped', pathPosition: index + 1 };
    }

    if (completed.has(lesson.id)) {
      return { ...lesson, pathStatus: 'completed', pathPosition: index + 1 };
    }

    if (canContinue) {
      canContinue = false;
      return { ...lesson, pathStatus: 'current', pathPosition: index + 1 };
    }

    return { ...lesson, pathStatus: 'locked', pathPosition: index + 1 };
  });
}

export function nextPathLesson(path) {
  return (path || []).find((lesson) => lesson.pathStatus === 'current')
    || [...(path || [])].reverse().find((lesson) => lesson.pathStatus === 'completed')
    || null;
}

export function canOpenPathLesson(lessons, level, goal, completedIds, lessonId) {
  const lesson = buildLearningPath(lessons, level, goal, completedIds)
    .find((item) => item.id === lessonId);
  return Boolean(lesson && ['current', 'completed'].includes(lesson.pathStatus));
}
