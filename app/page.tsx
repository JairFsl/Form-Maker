"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, Loader2, Plus } from "lucide-react"
import { useDeleteForm, useInfiniteForms } from "@/lib/form-hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SideButton from "@/components/side-button"
import dayjs from "dayjs"
import InfiniteScroll from "@/components/infinite-scroll"
import AnimatedComponent from "@/components/animated-component"

export default function FormsList() {
  const router = useRouter()

  const deleteForm = useDeleteForm()
  const { data, isPending, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteForms()
  const allForms = data?.pages ? data.pages[0].data : []

  if (isPending || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando formulários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-20 px-5">
      <div className="flex flex-col items-center w-full gap-5">
        <div className="flex justify-between space-x-7 mb-8 w-full 2xl:w-7xl">
          <AnimatedComponent type="slide-from-left">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Formulários Criados</h1>
              <p className="text-gray-600">Gerencie e visualize seus formulários</p>
            </div>
          </AnimatedComponent>
          <AnimatedComponent type="slide-from-right">
            <SideButton>
              <Button onClick={() => router.push("/create")} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Formulário
              </Button>
            </SideButton>
          </AnimatedComponent>
        </div>


        <AnimatedComponent type="slide-from-bottom" className="w-full 2xl:w-7xl">
          <div className="w-full 2xl:w-7xl">
            {allForms.length === 0 ? (
              <div className="flex items-center justify-center min-w-full">
                <Card className="w-full">
                  <CardContent className="flex flex-col items-center pt-6 text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum formulário criado</h3>
                    <p className="text-gray-500 mb-4">Comece criando seu primeiro formulário personalizado</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <InfiniteScroll onEndScroll={() => hasNextPage && !isFetching && fetchNextPage()}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allForms.map((form) => (
                    <Card key={form.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">{form.title}</CardTitle>
                        <CardDescription>{form.questions.length} pergunta(s)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-500">
                            Criado em{" "}
                            {dayjs(form.createdAt).format("DD/MM/YYYY - HH:mm")}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => router.push(`/preview/${form.id}`)}
                              className="flex-1 flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Visualizar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteForm.mutate(form.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {isFetchingNextPage && (
                  <Loader2 className="animate-spin mx-auto" color="white" />
                )}
              </InfiniteScroll>
            )}

          </div>
        </AnimatedComponent>

        {!hasNextPage && allForms.length > 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">Todos os formulários foram carregados ({allForms.length} total)</p>
          </div>
        )}
      </div>
    </div>
  )
}
