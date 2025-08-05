"use client"

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FormStorageAPI } from "@/lib/form-storage"
import { toast } from "react-toastify"
import { FormResponse, SavedForm } from "@/types/form-types"

export function useInfiniteForms(limit = 6) {
  return useInfiniteQuery({
    queryKey: ["forms-list"],
    queryFn: async ({ pageParam = 1 }) => await FormStorageAPI.getPaginatedForms(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page === lastPage.pagination.totalPages)
        return undefined;

      return lastPage.pagination.page + 1;
    },
    refetchOnWindowFocus: true,
  })
}

export function useGetForm(id: string) {
  return useQuery({
    queryKey: ["form", id],
    queryFn: () => FormStorageAPI.getForm(id),
    enabled: !!id,
  })
}

export function useCreateForm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-form"],
    mutationFn: (formData: Omit<SavedForm, "id" | "createdAt">) => FormStorageAPI.createForm(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms-list"] })
      toast.success("Formulário criado com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao criar formulário")
    },
  })
}

export function useDeleteForm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-form"],
    mutationFn: (id: string) => FormStorageAPI.deleteForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms-list"] })
      toast.done("Formulário excluído com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao excluir formulário")
    },
  })
}

export function useSaveResponse() {
  return useMutation({
    mutationFn: (response: FormResponse) => FormStorageAPI.saveResponse(response),
    onSuccess: () => {
      toast.success("Formulário enviado com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao enviar formulário")
    },
  })
}
