"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { QuestionType, QUESTION_TYPE_LABELS, type FormData, type SubQuestion, FormQuestion } from "@/types/form-types"
import type { Control, UseFormRegister } from "react-hook-form"

interface SubQuestionBuilderProps {
  questionIndex: number
  control: Control<FormData>
  register: UseFormRegister<FormData>
  errors: any
  setValue: any
  watch: any
}

export function SubQuestionBuilder({
  questionIndex,
  control,
  register,
  errors,
  setValue,
  watch,
}: SubQuestionBuilderProps) {
  const subQuestionPath = `questions.${questionIndex}.subQuestion` as const
  const watchedSubQuestion = watch(subQuestionPath) as SubQuestion

  const handleSubQuestionTypeChange = (type: QuestionType) => {
    setValue(`${subQuestionPath}.type`, type)
    if (type !== QuestionType.MULTIPLE_CHOICE && type !== QuestionType.SINGLE_CHOICE) {
      setValue(`${subQuestionPath}.options`, [])
    } else if (!watchedSubQuestion?.options?.length) {
      setValue(`${subQuestionPath}.options`, ["Opção A", "Opção B"])
    }
    if (![QuestionType.FREE_TEXT, QuestionType.INTEGER, QuestionType.DECIMAL].includes(type)) {
      setValue(`${subQuestionPath}.answerSuggestions`, [])
    }
  }

  const addSubOption = () => {
    const currentOptions = watchedSubQuestion?.options || []
    setValue(`${subQuestionPath}.options`, [...currentOptions, ""])
  }

  const removeSubOption = (optionIndex: number) => {
    const currentOptions = watchedSubQuestion?.options || []
    const newOptions = currentOptions.filter((_: string, index: number) => index !== optionIndex)
    setValue(`${subQuestionPath}.options`, newOptions)
  }

  const addSubSuggestion = () => {
    const currentSuggestions = watchedSubQuestion?.answerSuggestions || []
    setValue(`${subQuestionPath}.answerSuggestions`, [...currentSuggestions, ""])
  }

  const removeSubSuggestion = (suggestionIndex: number) => {
    const currentSuggestions = watchedSubQuestion?.answerSuggestions || []
    const newSuggestions = currentSuggestions.filter((_: string, index: number) => index !== suggestionIndex)
    setValue(`${subQuestionPath}.answerSuggestions`, newSuggestions)
  }

  const needsOptions = (type: QuestionType) => {
    return type === QuestionType.MULTIPLE_CHOICE || type === QuestionType.SINGLE_CHOICE
  }

  const needsSuggestions = (type: QuestionType) => {
    return [QuestionType.FREE_TEXT, QuestionType.INTEGER, QuestionType.DECIMAL].includes(type)
  }

  const parentQuestion = watch(`questions.${questionIndex}`) as FormQuestion

  return (
    <div className="space-y-4 border-t pt-4 mt-4 border-gray-200">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold">Detalhes da Pergunta Auxiliar</h4>

      </div>

      <div className="flex not-sm:flex-col gap-4">
        <div className="flex-auto space-y-2">
          <Label htmlFor={`${subQuestionPath}.question`}>Texto da Pergunta Auxiliar</Label>
          <Input
            id={`${subQuestionPath}.question`}
            placeholder="Digite a pergunta auxiliar"
            {...register(`${subQuestionPath}.question` as const, {
              required: "O texto da pergunta auxiliar é obrigatório",
            })}
          />
          {errors?.questions?.[questionIndex]?.subQuestion?.question && (
            <p className="text-sm text-red-500">{errors.questions[questionIndex].subQuestion.question.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Label>Tipo da Pergunta Auxiliar</Label>
            <Select
              value={watchedSubQuestion?.type || QuestionType.FREE_TEXT}
              onValueChange={(value) => handleSubQuestionTypeChange(value as QuestionType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 sm:hidden">
            <Label htmlFor={`${subQuestionPath}.required`}>Pergunta Auxiliar Obrigatória</Label>
            <Switch
              id={`${subQuestionPath}.required`}
              checked={watchedSubQuestion?.required ?? true}
              onCheckedChange={(checked) => setValue(`${subQuestionPath}.required`, checked)}
            />
          </div>
        </div>
      </div>

      {needsOptions(watchedSubQuestion?.type || QuestionType.FREE_TEXT) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Opções da Pergunta Auxiliar</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSubOption}
              className="flex items-center gap-2 bg-transparent"
            >
              <Plus className="h-3 w-3" />
              Adicionar Opção
            </Button>
          </div>
          {(watchedSubQuestion?.options || []).map((option: string, optionIndex: number) => (
            <div key={optionIndex} className="flex gap-2 items-center">
              <Input
                placeholder={`Opção ${optionIndex + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...(watchedSubQuestion?.options || [])]
                  newOptions[optionIndex] = e.target.value
                  setValue(`${subQuestionPath}.options`, newOptions)
                }}
              />
              {(watchedSubQuestion?.options || []).length > 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSubOption(optionIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {needsSuggestions(watchedSubQuestion?.type || QuestionType.FREE_TEXT) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Sugestões de Resposta da Pergunta Auxiliar</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSubSuggestion}
              className="flex items-center gap-2 bg-transparent"
            >
              <Plus className="h-3 w-3" />
              Adicionar Sugestão
            </Button>
          </div>
          {(watchedSubQuestion?.answerSuggestions || []).map((suggestion: string, suggestionIndex: number) => (
            <div key={suggestionIndex} className="flex gap-2 items-center">
              <Input
                placeholder={`Sugestão ${suggestionIndex + 1}`}
                value={suggestion}
                onChange={(e) => {
                  const newSuggestions = [...(watchedSubQuestion?.answerSuggestions || [])]
                  newSuggestions[suggestionIndex] = e.target.value
                  setValue(`${subQuestionPath}.answerSuggestions`, newSuggestions)
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeSubSuggestion(suggestionIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Valor Esperado da Pergunta {questionIndex + 1}</Label>
          {parentQuestion.type === QuestionType.FREE_TEXT ||
            parentQuestion.type === QuestionType.INTEGER ||
            parentQuestion.type === QuestionType.DECIMAL ? (
            <Input
              placeholder="Digite o valor esperado"
              {...register(`${subQuestionPath}.condition.expectedValue` as const)}
            />
          ) : parentQuestion.type === QuestionType.YES_NO ? (
            <RadioGroup
              value={
                Array.isArray(watchedSubQuestion.condition?.expectedValue)
                  ? watchedSubQuestion.condition?.expectedValue[0] || ""
                  : watchedSubQuestion.condition?.expectedValue || ""
              }
              onValueChange={(value) => setValue(`${subQuestionPath}.condition.expectedValue`, value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id={`sub-cond-${questionIndex}-sim`} />
                <Label htmlFor={`sub-cond-${questionIndex}-sim`}>Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id={`sub-cond-${questionIndex}-nao`} />
                <Label htmlFor={`sub-cond-${questionIndex}-nao`}>Não</Label>
              </div>
            </RadioGroup>
          ) : (
            <Select
              value={
                Array.isArray(watchedSubQuestion?.condition?.expectedValue)
                  ? watchedSubQuestion?.condition?.expectedValue[0] || ""
                  : watchedSubQuestion?.condition?.expectedValue || ""
              }
              onValueChange={(value) => setValue(`${subQuestionPath}.condition.expectedValue`, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {(parentQuestion.options || []).map((option, optIdx) => (
                  <SelectItem key={optIdx} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  )
}
