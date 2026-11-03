import type { Flashcard } from '../../types/flashcard';

const raw: Omit<Flashcard, 'id' | 'domain'>[] = [
  // AWS CLI Core
  { category: 'AWS CLI', front: 'aws configure', back: 'Configura interativamente as credenciais (Access Key, Secret Key), região default e formato de output (json, text, table).' },
  { category: 'AWS CLI', front: 'aws sts get-caller-identity', back: 'Retorna detalhes sobre a identidade IAM (User, Role) associada às credenciais atuais. Útil para debugar problemas de permissões (o equivalente a "whoami").' },
  
  // S3
  { category: 'AWS CLI (S3)', front: 'aws s3 ls', back: 'Lista todos os buckets S3 na conta. Se for usado com "aws s3 ls s3://bucket-name", lista os ficheiros dentro do bucket.' },
  { category: 'AWS CLI (S3)', front: 'aws s3 cp file.txt s3://my-bucket/', back: 'Copia um ficheiro local para um bucket S3. O cp suporta local->S3, S3->local, e S3->S3.' },
  { category: 'AWS CLI (S3)', front: 'aws s3 sync ./dir s3://my-bucket/', back: 'Sincroniza um diretório local com um bucket S3. Apenas copia os ficheiros novos ou modificados, sendo muito mais eficiente que o cp para diretórios.' },
  
  // EC2
  { category: 'AWS CLI (EC2)', front: 'aws ec2 describe-instances', back: 'Lista informações detalhadas sobre as instâncias EC2, incluindo estado, IPs, subnets e tags.' },
  { category: 'AWS CLI (EC2)', front: 'aws ec2 start-instances --instance-ids i-12345', back: 'Inicia uma ou mais instâncias EC2 previamente paradas (stopped).' },
  
  // IAM
  { category: 'AWS CLI (IAM)', front: 'aws iam list-users', back: 'Lista todos os utilizadores IAM da conta da AWS.' },
  { category: 'AWS CLI (IAM)', front: 'aws iam create-access-key --user-name Alice', back: 'Cria um novo par de Access Key e Secret Key para um utilizador IAM. A Secret Key só é mostrada nesta resposta!' },
  
  // EKS
  { category: 'AWS CLI (EKS)', front: 'aws eks update-kubeconfig --name my-cluster', back: 'Atualiza o ficheiro ~/.kube/config local com as credenciais necessárias para autenticar no cluster EKS especificado via kubectl.' },
  
  // CloudFormation
  { category: 'AWS CLI (CFN)', front: 'aws cloudformation deploy --template-file tmpl.yaml --stack-name my-stack', back: 'Faz o deploy de uma stack CloudFormation. Cria um ChangeSet e executa-o automaticamente se houver alterações.' },
  
  // SSM (Systems Manager)
  { category: 'AWS CLI (SSM)', front: 'aws ssm start-session --target i-12345', back: 'Inicia uma sessão interativa de shell na instância EC2 usando o Session Manager, sem necessitar de chaves SSH abertas ou porta 22 exposta.' },
];

export const awsFlashcards: Flashcard[] = raw.map((c, i) => ({
  ...c,
  id: `aws-${i}`,
  domain: 'aws' as const,
}));
