"use client"

import React from "react"

import { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { DeveloperInfo } from "./developer-info"
import { ToastContainer } from "react-toastify"

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient(),
  )

  return (
    <QueryClientProvider client={queryClient} >
      {children}
      <DeveloperInfo />
    </QueryClientProvider>
  )
}
