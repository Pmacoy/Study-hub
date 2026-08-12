import type { AwsQuestion } from '../../../types/awsExam';
import { iamQuestions } from './iam';
import { vpcQuestions } from './vpc';
import { computeQuestions } from './compute';
import { storageQuestions } from './storage';
import { databasesQuestions } from './databases';
import { wellarchQuestions } from './wellarch';
import { scenarioQuestions } from './scenarios';

export const ALL_AWS_QUESTIONS: AwsQuestion[] = [
  ...iamQuestions,
  ...vpcQuestions,
  ...computeQuestions,
  ...storageQuestions,
  ...databasesQuestions,
  ...wellarchQuestions,
  ...scenarioQuestions,
];

/** Só as questões em estilo de cenário (como o exame real) */
export const SCENARIO_QUESTIONS: AwsQuestion[] = scenarioQuestions;

export function questionsByTopic(topic: string): AwsQuestion[] {
  return ALL_AWS_QUESTIONS.filter(q => q.topic === topic);
}
