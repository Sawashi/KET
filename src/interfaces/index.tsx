import { ResponseExam } from "src/apis/gemini";

export interface SubmitDataItem {
  order: number;
  topic: string;
  questionType: string;
  hint: string;
}
export interface ExcelDataItem {
  order: number;
  typeOfKnowledge: string;
  topic: string;
  numberOfQuestions: number;
  recognize: string | null;
  understand: string | null;
  apply: string | null;
  highlyApplied: string | null;
}
export interface AnswerStore {
  order: string;
  questionGenerated: ResponseExam[];
}
export interface GroupedDataItem {
  typeOfKnowledge: string;
  questionByTopic: {
    topic: string;
    questions: ResponseExam[];
  }[];
}
// Define a new interface for the restructured data
export interface RestructuredDataItem {
  typeOfKnowledge: string;
  questionByTopic: {
    topic: string;
    questions: AnswerStore | undefined;
  }[];
}
export interface TypeOfKnowledgeWithOrders {
  typeOfKnowledge: string;
  orders: string;
}
export interface AugmentedAnswerStoreItem extends AnswerStore {
  typeOfKnowledge: string;
  topic: string;
}
