# OLIE ERP
**Sistema de Gestão Modular e Inteligente para Ateliês e Negócios Criativos**
> **Atenção:** todos os agentes, automações e desenvolvedores devem ler `README.md`, `AGENTS.md`, `CHECKLIST.md` e `MODULOS.md` antes de contribuir ou alterar qualquer parte do projeto.
---
## ✨ Visão Geral
O **Olie ERP** é um sistema de gestão 100% digital, escalável e personalizável, desenvolvido para atender as necessidades do Ateliê Olie e negócios artesanais similares. Automatiza e integra pedidos, produção, estoque, compras, financeiro, logística, RH e BI, com suporte completo à personalização de produtos, controle de múltiplos setores e expansão futura para franquias e multiunidades.
---
## 🚀 Principais Funcionalidades
- Controle total do ciclo do pedido (da venda à entrega)
- Produção e personalização de produtos multi-componente (bordado, hotstamping, etc)
- Gestão integrada de estoque, compras e fornecedores
- Dashboards visuais e painéis Kanban para produção, compras, pedidos e entregas
- Controle financeiro e RH
- Multiusuário, permissões, logs e auditoria
- Pronto para integrações com WhatsApp, marketplaces, automações e BI
---
## 🛠 Stack Tecnológica
- **Frontend:** Next.js (React) + TailwindCSS
- **Backend & Banco:** Supabase (PostgreSQL, Auth, Storage, Functions)
- **Deploy:** Vercel
- **Idiomas:** Português do Brasil (pt-BR)
- **Design:** Moderno, responsivo, acessível, dark mode
- **Padrão:** TypeScript, código tipado, DataTable centralizado, componentes modulares
---
## 🗂 Estrutura do Projeto
- **README.md** — Você está aqui!
- **ARQUITETURA.md** — Estrutura técnica, pastas, convenções e módulos ([link](./ARQUITETURA.md))
- **AGENTS.md** — Diretrizes para agentes, automações e refatorações ([link](./AGENTS.md))
- **CHECKLIST.md** — Checklist de QA, releases, refatoração, onboarding ([link](./CHECKLIST.md))
- **FLUXOS.md** — Mapas dos fluxos principais (Pedido, Produção, Estoque, Entrega, etc) ([link](./FLUXOS.md))
- **MODULOS/** — Subpastas com docs detalhados para cada módulo (Clientes, Pedidos, Produção, etc)
- **docs/** — Outras documentações técnicas, exemplos e guias
---
## ⚡ Como Rodar o Projeto
1. **Pré-requisitos**
   - Node.js >= 18.x
   - Yarn ou npm
   - Conta e projeto no [Supabase](https://supabase.com)
   - Ambiente configurado (.env.local com as chaves do Supabase)
2. **Instalação**
```bash
git clone https://github.com/sua-orga/olie-erp.git
cd olie-erp
yarn install # ou npm install
```
3. **Configuração**
```bash
cp .env.example .env.local
# Preencha suas variáveis Supabase (URL, Anon Key, etc)
```
4. **Execução Local**
```bash
yarn dev # ou npm run dev
```
5. **Testes**
```bash
yarn test # ou npm test
```
6. **Build para Produção**
```bash
yarn build # ou npm run build
```

## 📚 Referências Importantes
- `ARQUITETURA.md`: Estrutura técnica, padrão de pastas, dependências
- `AGENTS.md`: Regras para agentes/automação/IA
- `CHECKLIST.md`: Checklist para QA, releases e contribuições
- `FLUXOS.md`: Mapas e explicações dos principais fluxos operacionais
- `MODULOS/`: Documentos detalhados de cada módulo do sistema

## 👥 Time & Colaboradores
- Renan Serpa — Founder, CTO, Product Owner
- Equipe Olie — Produção, Criação, Atendimento
- @crewai — Agente de engenharia/automação
- @devolie — Backend/Supabase
- @docwriter — Documentação técnica e funcional
- @atelieolie — Especialista em fluxo real de produção

## 📢 Contribuindo
Leia o `AGENTS.md` e o `CHECKLIST.md` antes de abrir um PR ou realizar alterações significativas.
Siga padrões de código, tipagem e modularização.
Commits devem ser pequenos e atômicos.
Sempre atualize a documentação relacionada às alterações.

## 📈 Status Atual
- Estrutura principal criada
- Módulos básicos em desenvolvimento
- Foco atual: Pedidos, Produção, Estoque (Kanban)
- Próximos passos: Financeiro, Compras, Logística, BI

## 📄 Licença
Este projeto é privado para o Ateliê Olie. Não distribua sem autorização.
