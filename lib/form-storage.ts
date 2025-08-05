import { FormResponse, SavedForm } from "@/types/form-types"

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    totalForms: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export class FormStorageAPI {
  private static FORMS_KEY = "savedForms"
  private static RESPONSES_KEY = "formResponses"

  static async getPaginatedForms(page: number, limit: number): Promise<PaginatedResponse<SavedForm>> {
    return new Promise((resolve) => {
      setTimeout(() => {

        const allForms = this.getAllFormsFromStorage()
        const totalForms = allForms.length
        const totalPages = totalForms / limit
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const data = allForms.slice(startIndex, endIndex)

        resolve({
          data,
          pagination: {
            page,
            limit,
            totalForms,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        })
      }, 1000)
    })
  }
  static async getForms(): Promise<SavedForm[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allForms = this.getAllFormsFromStorage()
        resolve(allForms)
      }, 700)
    })
  }

  static async getForm(id: string): Promise<SavedForm | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const forms = this.getAllFormsFromStorage()
        resolve(forms.find((form) => form.id === id) || null)
      }, 500)
    })
  }

  static async createForm(formData: Omit<SavedForm, "id" | "createdAt">): Promise<SavedForm> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const forms = this.getAllFormsFromStorage()
        const newForm: SavedForm = {
          id: crypto.randomUUID(),
          ...formData,
          createdAt: new Date().toISOString(),
        }

        forms.unshift(newForm)
        this.saveFormsToStorage(forms)

        resolve(newForm)
      }, 800)
    })
  }

  static async deleteForm(id: string): Promise<void> {
    return new Promise(() => {
      setTimeout(() => {
        const forms = this.getAllFormsFromStorage()
        const filteredForms = forms.filter((form) => form.id !== id)
        this.saveFormsToStorage(filteredForms)
      }, 600)
    })
  }

  static async saveResponse(response: FormResponse): Promise<void> {
    return new Promise(() => {
      setTimeout(() => {
        const responses = this.getResponsesFromStorage()
        responses.push(response)
        localStorage.setItem(this.RESPONSES_KEY, JSON.stringify(responses))
      }, 700)
    })
  }

  private static getAllFormsFromStorage(): SavedForm[] {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem(this.FORMS_KEY)
    return saved ? JSON.parse(saved) : []
  }

  private static saveFormsToStorage(forms: SavedForm[]): void {
    localStorage.setItem(this.FORMS_KEY, JSON.stringify(forms))
  }

  private static getResponsesFromStorage(): FormResponse[] {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem(this.RESPONSES_KEY)
    return saved ? JSON.parse(saved) : []
  }
}
