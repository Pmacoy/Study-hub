import type { QuestionDifficulty } from './exam';

export type AwsQuestionTopic =
  | 'iam'
  | 'vpc'
  | 'compute'
  | 'storage'
  | 'databases'
  | 'wellarch';

export type AwsExamTopicFilter = AwsQuestionTopic | 'all';

export interface AwsQuestion {
  id: number;
  topic: AwsQuestionTopic;
  topicLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: QuestionDifficulty;
}
