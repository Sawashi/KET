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
