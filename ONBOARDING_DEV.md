# Onboarding de Desenvolvedores

Este guia ajuda novos colaboradores a configurar o projeto do Olie ERP localmente.

1. **Pré‑requisitos**
   - Node.js 20+
   - Acesso ao repositório Git
   - Chaves do Supabase

2. **Clonando o projeto**
```bash
git clone <repo-url>
cd erpolie2
npm install
```

3. **Configuração de ambiente**
```bash
cp .env.example .env.local
# preencha as variáveis com suas chaves Supabase
```

4. **Rodando o projeto**
```bash
npm run dev
```

5. **Testes e build**
```bash
npm run test
npm run lint
npm run build
```

Consulte `README.md`, `AGENTS.md` e `CHECKLIST.md` para regras e padrões adicionais.
