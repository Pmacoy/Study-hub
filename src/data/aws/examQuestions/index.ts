import type { AwsQuestion } from '../../../types/awsExam';
import { iamQuestions } from './iam';
import { vpcQuestions } from './vpc';
import { computeQuestions } from './compute';
import { storageQuestions } from './storage';
import { databasesQuestions } from './databases';
import { wellarchQuestions } from './wellarch';

export const ALL_AWS_QUESTIONS: AwsQuestion[] = [
  ...iamQuestions,
  ...vpcQuestions,
  ...computeQuestions,
  ...storageQuestions,
  ...databasesQuestions,
  ...wellarchQuestions,
];

export function questionsByTopic(topic: string): AwsQuestion[] {
  return ALL_AWS_QUESTIONS.filter(q => q.topic === topic);
}
