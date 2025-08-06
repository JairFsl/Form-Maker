# 📝 Form Builder Dinâmico

Este projeto é um construtor de formulários dinâmicos, permitindo aos usuários criar formulários personalizados com diferentes tipos de perguntas, condições de exibição e sub-perguntas. Os dados são persistidos localmente usando `localStorage` para simular um backend.

## ✨ Funcionalidades

*   **Criação de Formulários Dinâmicos**: Adicione e remova perguntas facilmente.
*   **Tipos de Perguntas Diversos**: Suporte para Sim/Não, Múltipla Escolha, Única Escolha, Texto Livre, Número Inteiro e Número Decimal.
*   **Perguntas Opcionais/Obrigatórias**: Marque perguntas como obrigatórias ou opcionais.
*   **Sugestões de Resposta**: Adicione sugestões pré-definidas para perguntas de texto, número inteiro e decimal.
*   **Lógica Condicional**: Exiba perguntas ou sub-perguntas com base nas respostas de perguntas anteriores.
*   **Sub-Perguntas Aninhadas**: Crie sub-perguntas que aparecem condicionalmente.
*   **Persistência Local**: Os formulários criados são salvos no `localStorage` do navegador.
*   **Visualização de Formulários**: Uma rota dedicada para listar e visualizar os formulários criados.
*   **Paginação e Scroll Infinito**: A lista de formulários utiliza `react-query` com `useInfiniteQuery` para carregamento eficiente.
*   **Componente de Informações do Desenvolvedor**: Um componente flutuante com detalhes do desenvolvedor.

## 🚀 Tecnologias Utilizadas

*   **Next.js**: Framework React para aplicações web.
*   **React**: Biblioteca JavaScript para construção de interfaces de usuário.
*   **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
*   **Shadcn/ui**: Componentes de UI acessíveis e personalizáveis construídos com Radix UI e Tailwind CSS.
*   **React Hook Form**: Para gerenciamento de formulários e validação.
*   **React Query (`@tanstack/react-query`)**: Para gerenciamento de estado do servidor e cache de dados.
*   **`useFieldArray` (React Hook Form)**: Para lidar com campos dinâmicos em formulários.
*   **`localStorage`**: Simulação de persistência de dados no lado do cliente.
*   **Lucide React**: Biblioteca de ícones.

## 📦 Como Começar

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter o Node.js (versão 18.x ou superior) e o npm (ou yarn/pnpm) instalados.

*   [Node.js](https://nodejs.org/en/download/)
*   [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (geralmente vem com o Node.js)

### Instalação

1.  **Clone o repositório (se aplicável)**:
    \`\`\`bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd form-builder
    \`\`\`

2.  **Instale as dependências**:
    \`\`\`bash
    # yarn (recomendado)
    # ou yarn install
    # ou pnpm install
    \`\`\`

### Executando o Projeto

1.  **Inicie o servidor de desenvolvimento**:
    \`\`\`bash
    npm run dev
    yarn dev (recomendado)
    pnpm dev
    \`\`\`

2.  **Acesse a aplicação**:
    Abra seu navegador e navegue para `http://localhost:3000`.

## 💡 Uso

*   **Criar Formulários**: Na página inicial (`/create`), você pode adicionar um título ao formulário e começar a adicionar perguntas.
    *   Selecione o tipo de pergunta (Sim/Não, Múltipla Escolha, etc.).
    *   Adicione opções ou sugestões de resposta conforme o tipo.
    *   Marque a pergunta como "Obrigatória" se necessário.
    *   Habilite "Condição de Exibição" para que a pergunta apareça apenas se uma pergunta anterior tiver uma resposta específica.
    *   Habilite "Sub-Pergunta" para adicionar uma pergunta aninhada que também pode ter sua própria condição.
*   **Visualizar Formulários Criados**: Clique no botão "Ver Formulários Criados" na página inicial ou navegue para `/`.
    *   Nesta página, você verá uma lista de todos os formulários salvos.
    *   Clique em "Visualizar" para preencher um formulário específico.
    *   Clique em "Excluir" para remover um formulário.
    *   A lista de formulários suporta scroll infinito para carregar mais formulários conforme você rola.
*   **Preencher Formulários**: Na página de visualização de um formulário (`/preview/id]`), preencha as respostas. As respostas são salvas no `localStorage`.

## 💾 Persistência de Dados

Os formulários e as respostas são salvos no `localStorage` do seu navegador. Isso simula um backend para fins de demonstração. Se você limpar os dados do site no seu navegador, os formulários serão perdidos.

## 📄 Licença

Este projeto está licenciado sob a licença MIT.
