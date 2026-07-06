export type QuestionTopic =
  | 'identity'
  | 'governance'
  | 'rbac'
  | 'storage'
  | 'compute'
  | 'containers'
  | 'vnet'
  | 'monitor';

export type ExamTopicFilter = QuestionTopic | 'all';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type ExamMode = 'practice' | 'timed';

export interface Question {
  id: number;
  topic: QuestionTopic;
  topicLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: QuestionDifficulty;
}

export interface ExamHistoryEntry {
  id: string;
  date: string;
  mode: ExamMode;
  topic: QuestionTopic | 'all';
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  weakTopics: QuestionTopic[];
}

// Alias used by some components
export type Difficulty = QuestionDifficulty;
