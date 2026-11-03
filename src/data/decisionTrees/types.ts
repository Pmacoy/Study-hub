export type TreeNodeId = string;

export interface TreeAnswer {
  label: string;
  nextId: TreeNodeId;
}

export interface TreeQuestionNode {
  type: 'question';
  id: TreeNodeId;
  question: string;
  description?: string;
  answers: TreeAnswer[];
}

export interface TreeResultNode {
  type: 'result';
  id: TreeNodeId;
  title: string;
  service: string;
  description: string;
  icon?: string;
}

export type TreeNode = TreeQuestionNode | TreeResultNode;

export interface DecisionTree {
  id: string;
  title: string;
  description: string;
  startNodeId: TreeNodeId;
  nodes: Record<TreeNodeId, TreeNode>;
}
