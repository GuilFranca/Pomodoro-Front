# Chronos Pomodoro — Frontend

App Pomodoro em React + TypeScript + Vite, integrado à API backend (Express + Prisma + MySQL).

## Pré-requisitos

- Node.js 18+
- API backend rodando (ver `pomodoro-api/`)

## Instalação

```bash
npm install
cp .env.example .env
# edite .env se a API estiver em outra porta/host
npm run dev
```

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3333` | URL base da API backend |

## Integração com a API

### Como funciona

- **Startup**: o provider carrega `GET /settings` e `GET /tasks` da API, sobrescrevendo o localStorage.
- **Iniciar tarefa**: `POST /tasks` é chamado automaticamente.
- **Completar tarefa**: `PATCH /tasks/:id/complete` ao fim do timer.
- **Interromper tarefa**: `PATCH /tasks/:id/interrupt` ao clicar em parar.
- **Salvar configurações**: `PUT /settings` persiste no banco.
- **Limpar histórico**: `DELETE /tasks` apaga no banco e atualiza a UI.
- **Fallback**: se a API não responder, o app continua funcionando com os dados do localStorage.

## Credenciais de acesso (mock)

```
Usuário: Guizin Trovoada
Senha:   MasterPlayer123
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Compila para produção |
| `npm run preview` | Visualiza o build de produção |
