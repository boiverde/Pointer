
# Preparação do Ambiente de Produção

Seu MVP foi finalizado e preparado para deploy.

## Estrutura Atual
- **Frontend (Store)**: Next.js na porta 3000.
- **Backend (API)**: NestJS na porta 3001.
- **Database**: PostgreSQL na porta 5432.

## Como Rodar em Produção (Docker)

1. Certifique-se de ter o Docker e Docker Compose instalados.
2. Na raiz do projeto, execute:

```bash
docker-compose up --build -d
```

Isso irá:
- Subir o banco de dados.
- Construir e subir a API (conectada ao banco).
- Construir e subir o Frontend (conectado à API).

## Como Rodar Localmente (Desenvolvimento)

Caso queira rodar sem Docker (exceto o banco):

1. **Subir Banco**:
   ```bash
   docker-compose up postgres -d
   ```

2. **Backend**:
   ```bash
   cd apps/api
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Frontend**:
   ```bash
   cd apps/store
   npm install
   npm run dev
   ```

## Próximos Passos Recomendados
- **CI/CD**: Configurar pipeline no GitHub Actions.
- **Domínio**: Configurar Nginx reverso para apontar `seudominio.com` para o container `store`.
