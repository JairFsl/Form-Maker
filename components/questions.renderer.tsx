"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { QuestionType, type FormQuestion } from "@/types/form-types"
import { Badge } from "./ui/badge"
import { useEffect } from "react"

interface QuestionRendererProps {
  question: FormQuestion
  questionIndex: number
  register: any
  errors: any
  setValue?: any
  watch?: any
  parentFieldName?: string
}

export default function QuestionsRenderer({
  question,
  questionIndex,
  register,
  errors,
  setValue,
  watch,
  parentFieldName
}: QuestionRendererProps) {
  const fieldName = `question-${questionIndex}`
  const watchedValue = watch ? watch(fieldName) : undefined
  const isRequired = question.required ?? false


  const shouldRenderMainQuestion = () => {
    if (!question.condition || parentFieldName) {

      return true
    }

    const parentQuestionValue = watch(`question-${question.condition.parentQuestionIndex}`)
    const expectedValue = question.condition.expectedValue

    const parentVal = Array.isArray(parentQuestionValue) ? parentQuestionValue : String(parentQuestionValue || "")
    const expectedVal = Array.isArray(expectedValue) ? expectedValue : String(expectedValue || "")

    if (question.type === QuestionType.MULTIPLE_CHOICE) {

      if (Array.isArray(parentVal) && Array.isArray(expectedVal)) {
        return parentVal.some((val) => expectedVal.includes(val))
      } else if (Array.isArray(parentVal) && typeof expectedVal === "string") {
        return parentVal.includes(expectedVal)
      }
      return false
    } else {

      return parentVal === expectedVal
    }
  }

  const shouldRenderSubQuestion = () => {
    if (!question.subQuestion?.condition) {
      return true
    }

    const parentQuestionValue = watchedValue
    const expectedValue = question.subQuestion.condition.expectedValue

    const parentVal = Array.isArray(parentQuestionValue) ? parentQuestionValue : String(parentQuestionValue || "")
    const expectedVal = Array.isArray(expectedValue) ? expectedValue : String(expectedValue || "")

    if (question.type === QuestionType.MULTIPLE_CHOICE) {
      if (Array.isArray(parentVal) && Array.isArray(expectedVal)) {
        return parentVal.some((val) => expectedVal.includes(val))
      } else if (Array.isArray(parentVal) && typeof expectedVal === "string") {
        return parentVal.includes(expectedVal)
      }
      return false
    } else {
      return parentVal === expectedVal
    }
  }

  const renderMainQuestion = shouldRenderMainQuestion()
  const renderSubQuestion = renderMainQuestion && question.subQuestion && shouldRenderSubQuestion()

  useEffect(() => {
    if (!renderMainQuestion && watchedValue !== undefined && watchedValue !== null && watchedValue !== "") {
      setValue(fieldName, undefined)
    }
  }, [renderMainQuestion, fieldName, setValue, watchedValue])

  if (!renderMainQuestion && !parentFieldName) {
    return null
  }

  const renderInput = () => {
    const validationRules = {
      required: isRequired ? "Esta resposta é obrigatória" : false,
    }

    switch (question.type) {
      case QuestionType.YES_NO:
        return (
          <RadioGroup
            onValueChange={(value) => setValue && setValue(fieldName, value)}
            value={watchedValue}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id={`${fieldName}-sim`} />
              <Label htmlFor={`${fieldName}-sim`}>Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id={`${fieldName}-nao`} />
              <Label htmlFor={`${fieldName}-nao`}>Não</Label>
            </div>
          </RadioGroup>
        )

      case QuestionType.SINGLE_CHOICE:
        return (
          <RadioGroup
            onValueChange={(value) => setValue && setValue(fieldName, value)}
            value={watchedValue}
            className="space-y-2"
          >
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${fieldName}-option-${optionIndex}`} />
                <Label htmlFor={`${fieldName}-option-${optionIndex}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Checkbox
                  id={`${fieldName}-option-${optionIndex}`}
                  checked={Array.isArray(watchedValue) && watchedValue.includes(option)}
                  onCheckedChange={(checked) => {
                    if (!setValue) return
                    const currentValues = Array.isArray(watchedValue) ? watchedValue : []
                    if (checked) {
                      setValue(fieldName, [...currentValues, option])
                    } else {
                      setValue(
                        fieldName,
                        currentValues.filter((v: string) => v !== option),
                      )
                    }
                  }}
                />
                <Label htmlFor={`${fieldName}-option-${optionIndex}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case QuestionType.FREE_TEXT:
        return (
          <Textarea id={fieldName} placeholder="Digite sua resposta..." {...register(fieldName, validationRules)} />
        )

      case QuestionType.INTEGER:
        return (
          <Input
            id={fieldName}
            type="number"
            step="1"
            placeholder="Digite um número inteiro..."
            {...register(fieldName, {
              ...validationRules,
              pattern: {
                value: /^-?\d+$/,
                message: "Digite apenas números inteiros",
              },
            })}
          />
        )

      case QuestionType.DECIMAL:
        return (
          <Input
            id={fieldName}
            type="number"
            step="0.01"
            placeholder="Digite um número (ex: 10.50)..."
            {...register(fieldName, {
              ...validationRules,
              pattern: {
                value: /^-?\d+(\.\d{1,2})?$/,
                message: "Digite um número com até 2 casas decimais",
              },
            })}
          />
        )

      default:
        return <Input id={fieldName} placeholder="Digite sua resposta..." {...register(fieldName, validationRules)} />
    }
  }

  const needsSuggestions = (type: QuestionType) => {
    return [QuestionType.FREE_TEXT, QuestionType.INTEGER, QuestionType.DECIMAL].includes(type)
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={fieldName} className="text-base font-medium">
        {question.question}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderInput()}
      {errors[fieldName] && <p className="text-sm text-red-500">{errors[fieldName]?.message}</p>}

      {needsSuggestions(question.type) && question.answerSuggestions && question.answerSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {question.answerSuggestions.map((suggestion, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => setValue(fieldName, suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}

      {renderSubQuestion && (
        <div className="pl-6 pt-4 border-l-2 border-gray-200 mt-4">
          <QuestionsRenderer
            question={question.subQuestion!}
            questionIndex={questionIndex}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            parentFieldName={fieldName}
          />
        </div>
      )}
    </div>
  )
}
