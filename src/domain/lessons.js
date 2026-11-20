export class LessonCatalog {
  forProfile(lessons, level, goal) {
    return (lessons || [])
      .filter((lesson) => lesson.level === level)
      .map((lesson) => ({ ...lesson, recommended: lesson.goal === goal }))
      .sort((left, right) => {
        if (left.recommended !== right.recommended) return left.recommended ? -1 : 1;
        return (left.sortOrder ?? Number.MAX_SAFE_INTEGER) - (right.sortOrder ?? Number.MAX_SAFE_INTEGER);
      });
  }

  find(lessons, id) {
    return (lessons || []).find((lesson) => lesson.id === id) || null;
  }
}

export const lessonCatalog = new LessonCatalog();

export function lessonsForProfile(lessons, level, goal) {
  return lessonCatalog.forProfile(lessons, level, goal);
}

