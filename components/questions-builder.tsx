"use client"

import { type FieldErrors, useFieldArray, type UseFormSetValue, type UseFormWatch, type Control, type UseFormRegister } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus, X, ChevronDown } from "lucide-react"
import { QuestionType, QUESTION_TYPE_LABELS, type FormData, FormQuestion, SubQuestion } from "@/types/form-types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SubQuestionBuilder } from "./sub-question-builder"

interface QuestionBuilderProps {
  control: Control<FormData>
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
  setValue: UseFormSetValue<FormData>
  watch: UseFormWatch<FormData>
}

export default function QuestionsBuilder({ control, register, errors, setValue, watch }: QuestionBuilderProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  const watchedQuestions = watch("questions")

  const addQuestion = () => {
    append({
      question: "",
      type: QuestionType.FREE_TEXT,
      options: [],
      required: false,
    })
  }

  const removeQuestion = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const changeQuestionField = <T extends keyof FormQuestion>({ questionIndex, field, newValue }: { questionIndex: number, field: keyof FormQuestion, newValue: FormQuestion[T] }) => {
    setValue(`questions.${questionIndex}.${field}`, newValue)
  }

  const addOption = (questionIndex: number) => {
    const currentOptions = watchedQuestions[questionIndex]?.options || []
    changeQuestionField({ questionIndex, field: "options", newValue: [...currentOptions, ""] })
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = watchedQuestions[questionIndex]?.options || []
    const newValue = currentOptions.filter((_, index: number) => index !== optionIndex)
    changeQuestionField({ questionIndex, field: "options", newValue })
  }

  const addSuggestion = (questionIndex: number) => {
    const currentSuggestions = watchedQuestions[questionIndex]?.answerSuggestions || []
    setValue(`questions.${questionIndex}.answerSuggestions`, [...currentSuggestions, ""])
  }

  const removeSuggestion = (questionIndex: number, suggestionIndex: number) => {
    const currentSuggestions = watchedQuestions[questionIndex]?.answerSuggestions || []
    const newSuggestions = currentSuggestions.filter((_: string, idx: number) => idx !== suggestionIndex)
    setValue(`questions.${questionIndex}.answerSuggestions`, newSuggestions)
  }

  const handleTypeChange = (questionIndex: number, type: QuestionType) => {
    changeQuestionField({ questionIndex, field: "type", newValue: type })

    if (type !== QuestionType.MULTIPLE_CHOICE && type !== QuestionType.SINGLE_CHOICE) {
      changeQuestionField({ questionIndex, field: "options", newValue: [] })
    } else if (!watchedQuestions[questionIndex]?.options?.length) {
      changeQuestionField({ questionIndex, field: "options", newValue: ["", ""] })
    }
  }

  const needsOptions = (type: QuestionType) => {
    return type === QuestionType.MULTIPLE_CHOICE || type === QuestionType.SINGLE_CHOICE
  }

  const needsSuggestions = (type: QuestionType) => {
    return [QuestionType.FREE_TEXT, QuestionType.INTEGER, QuestionType.DECIMAL].includes(type)
  }

  const handleConditionToggle = (questionIndex: number, checked: boolean) => {
    if (checked) {
      changeQuestionField({
        questionIndex, field: "condition", newValue: {
          parentQuestionIndex: 0,
          expectedValue: "",
        }
      })
    } else {
      changeQuestionField({
        questionIndex, field: "condition", newValue: undefined
      })
    }
  }

  const handleSubQuestionToggle = (questionIndex: number, checked: boolean) => {
    if (checked) {
      changeQuestionField({
        questionIndex, field: "subQuestion", newValue: {
          question: "",
          type: QuestionType.FREE_TEXT,
          options: [],
          required: true,
          answerSuggestions: [],
          condition: {
            parentQuestionIndex: 0,
            expectedValue: "",
          },
        }
      })
    } else {
      changeQuestionField({
        questionIndex, field: "subQuestion", newValue: undefined
      })
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      {fields.map((field, index) => {
        const questionType = watchedQuestions[index]?.type || QuestionType.FREE_TEXT
        const questionOptions = watchedQuestions[index]?.options || []
        const questionSuggestions = watchedQuestions[index]?.answerSuggestions || []
        const isRequired = watchedQuestions[index]?.required ?? false
        const hasCondition = watchedQuestions[index]?.condition !== undefined
        const hasSubQuestion = watchedQuestions[index]?.subQuestion !== undefined

        const parentQuestionIndex = watchedQuestions[index]?.condition?.parentQuestionIndex
        const parentQuestion = parentQuestionIndex !== undefined ? watchedQuestions[parentQuestionIndex] : undefined

        const availableParentQuestions = watchedQuestions
          .slice(0, index)
          .filter((q: any) => q.type === QuestionType.YES_NO || q.type === QuestionType.SINGLE_CHOICE)

        return (
          <Card key={field.id} className="p-4">
            <CardHeader className="p-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pergunta número {index + 1}</CardTitle>
                <div className="flex not-sm:flex-col-reverse items-center space-x-5">
                  <div className="flex space-x-2 not-sm:hidden">
                    <Label htmlFor={`questions.${index}.required`}>Obrigatória</Label>
                    <Switch
                      id={`questions.${index}.required`}
                      checked={isRequired}
                      onCheckedChange={(checked) => setValue(`questions.${index}.required`, checked)}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                      className="text-gray-700 hover:text-gray-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <div className="flex not-sm:flex-col gap-4">
                <div className="flex-auto space-y-2">
                  <Label htmlFor={`questions.${index}.question`}>Texto da pergunta</Label>
                  <Input
                    id={`questions.${index}.question`}
                    placeholder={`Digite a pergunta ${index + 1}`}
                    {...register(`questions.${index}.question` as const, {
                      required: "Esta pergunta é obrigatória",
                    })}
                  />
                  {errors.questions?.[index]?.question && (
                    <p className="text-sm text-red-500">{errors.questions[index]?.question?.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Label>Tipo da pergunta</Label>
                    <Select value={questionType} onValueChange={(value) => handleTypeChange(index, value as QuestionType)}>
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
                    <Label htmlFor={`questions.${index}.required`}>Obrigatória</Label>
                    <Switch
                      id={`questions.${index}.required`}
                      checked={isRequired}
                      onCheckedChange={(checked) => setValue(`questions.${index}.required`, checked)}
                    />
                  </div>
                </div>
              </div>

              {needsOptions(questionType) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Opções</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(index)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-3 w-3" />
                      Adicionar Opção
                    </Button>
                  </div>

                  {questionOptions.map((option: string, optionIndex: number) => (
                    <div key={optionIndex} className="flex gap-2 items-center">
                      <Input
                        placeholder={`Opção ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionOptions]
                          newOptions[optionIndex] = e.target.value
                          changeQuestionField({ questionIndex: index, field: "options", newValue: newOptions })
                        }}
                      />
                      {questionOptions.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index, optionIndex)}
                          className="text-gray-700 hover:text-gray-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {needsSuggestions(questionType) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Sugestões de Resposta</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSuggestion(index)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-3 w-3" />
                      Adicionar Sugestão
                    </Button>
                  </div>

                  {questionSuggestions.map((suggestion: string, suggestionIndex: number) => (
                    <div key={suggestionIndex} className="flex gap-2 items-center">
                      <Input
                        placeholder={`Sugestão ${suggestionIndex + 1}`}
                        value={suggestion}
                        onChange={(e) => {
                          const newSuggestions = [...questionSuggestions]
                          newSuggestions[suggestionIndex] = e.target.value
                          setValue(`questions.${index}.answerSuggestions`, newSuggestions)
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSuggestion(index, suggestionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {index > 0 && availableParentQuestions.length > 0 && (
                <Collapsible className="space-y-2 pt-2">
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium [&[data-state=open]>svg]:rotate-180">
                    <span>Condição de Exibição</span>
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor={`questions.${index}.hasCondition`}>Habilitar Condição</Label>
                      <Switch
                        id={`questions.${index}.hasCondition`}
                        checked={hasCondition}
                        onCheckedChange={(checked) => handleConditionToggle(index, checked)}
                      />
                    </div>

                    {hasCondition && (
                      <>
                        <div className="space-y-2">
                          <Label>Pergunta de Referência</Label>
                          <Select
                            value={parentQuestionIndex !== undefined ? String(parentQuestionIndex) : ""}
                            onValueChange={(value) => {
                              setValue(`questions.${index}.condition.parentQuestionIndex`, Number(value))
                              setValue(`questions.${index}.condition.expectedValue`, "")
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a pergunta">
                                {parentQuestionIndex !== undefined && watchedQuestions[parentQuestionIndex]
                                  ? `Pergunta ${parentQuestionIndex + 1}: ${watchedQuestions[parentQuestionIndex].question || "(Sem texto)"}`
                                  : "Selecione a pergunta"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {availableParentQuestions.map((q: any, qIdx: number) => (
                                <SelectItem key={qIdx} value={String(watchedQuestions.indexOf(q))}>
                                  Pergunta {watchedQuestions.indexOf(q) + 1}: {q.question || `(Sem texto)`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {parentQuestion && (
                          <div className="space-y-2">
                            <Label>
                              Valor Esperado da Pergunta {typeof parentQuestionIndex === "number" ? parentQuestionIndex + 1 : "(?)"}
                            </Label>
                            {parentQuestion.type === QuestionType.YES_NO ? (
                              <RadioGroup
                                value={
                                  Array.isArray(watchedQuestions[index]?.condition?.expectedValue)
                                    ? (watchedQuestions[index]?.condition?.expectedValue[0] ?? "")
                                    : (watchedQuestions[index]?.condition?.expectedValue ?? "")
                                }
                                onValueChange={(value) => setValue(`questions.${index}.condition.expectedValue`, value)}
                                className="flex gap-6"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id={`cond-${index}-sim`} />
                                  <Label htmlFor={`cond-${index}-sim`}>Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id={`cond-${index}-nao`} />
                                  <Label htmlFor={`cond-${index}-nao`}>Não</Label>
                                </div>
                              </RadioGroup>
                            ) : (

                              <Select
                                value={
                                  Array.isArray(watchedQuestions[index]?.condition?.expectedValue)
                                    ? watchedQuestions[index]?.condition?.expectedValue[0] || ""
                                    : watchedQuestions[index]?.condition?.expectedValue || ""
                                }
                                onValueChange={(value) => setValue(`questions.${index}.condition.expectedValue`, value)}
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
                        )}
                      </>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )}

              <div className="space-y-2 pt-2">
                <div
                  className="flex items-center justify-between space-x-2 [&[data-state=open]>svg]:rotate-180"
                  onClick={() => handleSubQuestionToggle(index, !hasSubQuestion)}>
                  <Label htmlFor={`questions.${index}.hasSubQuestion`}>Pergunta Auxiliar</Label>
                  <ChevronDown className="h-4 w-4 transition-transform" />
                </div>

                {hasSubQuestion && (
                  <SubQuestionBuilder
                    questionIndex={index}
                    control={control}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addQuestion}
        className="flex items-center gap-2 bg-transparent border-2 border-dashed h-20"
      >
        <Plus className="h-10 w-10" />
        Adicionar Pergunta
      </Button>
    </div>
  )
}
