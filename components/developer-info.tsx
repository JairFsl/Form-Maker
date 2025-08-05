"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Github, Linkedin, Code, X } from "lucide-react"

export function DeveloperInfo() {
  const [isOpen, setIsOpen] = useState(false)

  const developerData = {
    name: "Jair Francisco",
    email: "jairfrancisco2018@gmail.com",
    github: "https://github.com/JairFsl",
    linkedin: "https://www.linkedin.com/in/jairfsl",
    role: "FullStack Developer",
    technologies: ["React", "Next.js", "TypeScript", "TailwindCSS", "Shadcn", "React Hook Form", "React Query", "Day.js"],
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-50">

        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-10"></div>

        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="flex flex-col relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-blue-200 hover:border-blue-300 w-14 h-14 rounded-full"
        >
          <span className="text-blue-700 font-medium text-xl">JF</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="relative">
          <Button
            onClick={() => setIsOpen(false)}
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://media.licdn.com/dms/image/v2/C4E03AQEL8NLcukabWQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1645772288571?e=1757548800&v=beta&t=ZlSFDOWckScG29U90t9hlL_7iGvrg2ha4gO9xT6M9UI" alt="@developer" />
              <AvatarFallback>JF</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{developerData.name}</CardTitle>
              <CardDescription className="text-sm">{developerData.role}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Code className="h-4 w-4" />
              Tecnologias usadas
            </h4>
            <div className="flex flex-wrap gap-1">
              {developerData.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs border-gray-300">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Contato</h4>

            <div className="space-y-2">
              <a
                href={`mailto:${developerData.email}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Mail className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-xs text-gray-500">{developerData.email}</p>
                </div>
              </a>

              <a
                href={developerData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Github className="h-4 w-4 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">GitHub</p>
                  <p className="text-xs text-gray-500">Ver repositórios</p>
                </div>
              </a>

              <a
                href={developerData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Linkedin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">LinkedIn</p>
                  <p className="text-xs text-gray-500">Conectar-se</p>
                </div>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
