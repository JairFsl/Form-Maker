"use client"

import AnimatedComponent from "@/components/animated-component";
import QuestionsBuilder from "@/components/questions-builder";
import SideButton from "@/components/side-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateForm } from "@/lib/form-hooks";
import { FormStorageAPI } from "@/lib/form-storage";
import { FormData, QuestionType, SavedForm } from "@/types/form-types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function FormCreator() {
  const router = useRouter()
  const createForm = useCreateForm()
  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      questions: [
        {
          question: "",
          type: QuestionType.FREE_TEXT,
          options: [],
          required: true,
        },
      ],
    },
  })

  const onSubmit = useCallback(async (data: FormData) => {
    if (data.questions.length === 0) {
      toast.error("Adicione pelo menos uma pergunta")
      return
    }

    const existingForms = await FormStorageAPI.getForms()
    const savedForms = existingForms || []

    const newForm: Omit<SavedForm, "id" | "createdAt"> = {
      title: data.title || `Formulário ${savedForms.length + 1}`,
      questions: data.questions.map((q, index) => {
        if (q.question === "") {
          return {
            ...q,
            question: `Pergunta Nº ${index + 1}`
          }
        }

        return q
      }),
    }

    await FormStorageAPI.createForm(newForm)

    toast.success("Formulário criado com sucesso!")
    reset()
  }, [])

  const onReset = async () => {
    toast.warn("Formulário redefinido!")
    reset()
  }

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gray-50 py-12 px-5">
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-between space-x-7 mb-8 w-full 2xl:w-7xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Criador de Formulários</h1>
            <p className="text-gray-600">Crie formulários personalizados de forma fácil e rápida</p>
          </div>
          <SideButton>
            <Button onClick={() => router.replace("/")}>
              Ver Formulários Criados
            </Button>
          </SideButton>
        </div>


        <AnimatedComponent type="slide-from-bottom" className="w-full 2xl:w-7xl">
          <div className="w-full 2xl:w-7xl">
            <Card>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Formulário</Label>
                    <Input
                      className="h-12"
                      id="title"
                      placeholder="Digite o título do formulário"
                      {...register("title")}
                      disabled={createForm.isPending}
                    />
                  </div>

                  <QuestionsBuilder
                    control={control}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />

                  <div className="flex flex-col md:flex-row items-center justify-between w-full pt-8 gap-3">
                    <Button onClick={onReset} type="button" variant={"secondary"} className="w-full md:w-2/5" disabled={createForm.isPending}>
                      Redefinir Formulário
                    </Button>
                    <Button type="submit" className="w-full md:w-2/5" disabled={createForm.isPending}>
                      {createForm.isPending ? (
                        <div className="space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Criando Formulário...
                        </div>
                      ) : (
                        "Criar Formulário"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </AnimatedComponent>
      </div>
    </div>
  );
}
