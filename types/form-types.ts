export enum QuestionType {
  YES_NO = "yes_no",
  MULTIPLE_CHOICE = "multiple_choice",
  SINGLE_CHOICE = "single_choice",
  FREE_TEXT = "free_text",
  INTEGER = "integer",
  DECIMAL = "decimal",
}

export type SubQuestion = Omit<FormQuestion, "subQuestion">

export interface FormQuestion {
  question: string
  type: QuestionType
  options?: string[]
  required?: boolean
  answerSuggestions?: string[]
  condition?: {
    parentQuestionIndex: number
    expectedValue: string | string[]
  }
  subQuestion?: SubQuestion & {
    condition?: {
      expectedValue: string | string[]
    }
  }
}

export interface FormResponse {
  formId: string
  formTitle: string
  responses: { [key: string]: string | string[] }
  submittedAt: string
}

export interface FormQuestion {
  question: string
  type: QuestionType
  options?: string[]
  required?: boolean
}

export interface FormData {
  title: string
  questions: FormQuestion[]
}

export interface SavedForm {
  id: string
  title: string
  questions: FormQuestion[]
  createdAt: string
}

export const QUESTION_TYPE_LABELS = {
  [QuestionType.YES_NO]: "Sim e Não",
  [QuestionType.MULTIPLE_CHOICE]: "Múltipla Escolha",
  [QuestionType.SINGLE_CHOICE]: "Única Escolha",
  [QuestionType.FREE_TEXT]: "Texto Livre",
  [QuestionType.INTEGER]: "Número Inteiro",
  [QuestionType.DECIMAL]: "Número com 2 casas decimais",
}
