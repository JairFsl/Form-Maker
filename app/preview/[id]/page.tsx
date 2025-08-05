"use client"

import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import { useGetForm, useSaveResponse } from "@/lib/form-hooks"
import QuestionsRenderer from "@/components/questions.renderer"
import { FormResponse } from "@/types/form-types"

dayjs.locale("pt-br")

export default function PreviewForm() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const { data: form, isLoading, isError } = useGetForm(formId)
  const saveResponseMutation = useSaveResponse()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormResponse>()

  const onSubmit = (data: FormResponse) => {
    if (!data) return
    saveResponseMutation.mutate({
      formId: data.formId,
      formTitle: data.formTitle,
      responses: data.responses,
      submittedAt: dayjs().toString(),
    })
  }

  const goBack = () => {
    router.replace("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    )
  }

  if (isError || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Formulário não encontrado</h2>
            <p className="text-gray-600 mb-4">O formulário que você está procurando não existe ou foi removido.</p>
            <Button onClick={goBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar à lista
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Button variant="outline" onClick={goBack} className="flex items-center gap-2 mb-4 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Voltar à lista
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
            <p className="text-gray-600">Preencha o formulário abaixo com suas respostas</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formulário</CardTitle>
            <CardDescription>
              {form.questions.length} pergunta(s) • Criado em {dayjs(form.createdAt).format("DD/MM/YYYY - HH:mm")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {form.questions.map((question, index) => (
                <QuestionsRenderer
                  key={index}
                  question={question}
                  questionIndex={index}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
              ))}
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Este é um formulário de demonstração. As respostas são salvas localmente.</p>
        </div>
      </div>
    </div>
  )
}
