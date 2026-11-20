import { AuthService } from './AuthService.js';
import { ProfileRepository } from './ProfileRepository.js';
import { LessonRepository } from './LessonRepository.js';
import { ProgressRepository } from './ProgressRepository.js';
import { VocabularyRepository } from './VocabularyRepository.js';

export const services = Object.freeze({
  auth: new AuthService(),
  profiles: new ProfileRepository(),
  lessons: new LessonRepository(),
  progress: new ProgressRepository(),
  vocabulary: new VocabularyRepository(),
});

