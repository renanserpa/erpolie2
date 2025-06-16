
# OLIE ERP
**Sistema de Gestão Modular e Inteligente para Ateliês e Negócios Criativos**

> **Atenção:** todos os agentes, automações e desenvolvedores devem ler `README.md`, `AGENTS.md`, `CHECKLIST.md` e `MODULOS.md` antes de contribuir ou alterar qualquer parte do projeto.

## ✨ Visão Geral
O **Olie ERP** é um sistema de gestão 100% digital, escalável e personalizável, desenvolvido para atender as necessidades do Ateliê Olie e negócios artesanais similares. Automatiza e integra pedidos, produção, estoque, compras, financeiro, logística, RH e BI, com suporte completo à personalização de produtos, controle de múltiplos setores e expansão futura para franquias e multiunidades.

## 🚀 Principais Funcionalidades
- Controle total do ciclo do pedido (da venda à entrega)
- Produção e personalização de produtos multi-componente (bordado, hotstamping, etc)
- Gestão integrada de estoque, compras e fornecedores
- Dashboards visuais e painéis Kanban para produção, compras, pedidos e entregas
- Controle financeiro e RH
- Multiusuário, permissões, logs e auditoria
- Pronto para integrações com WhatsApp, marketplaces, automações e BI

## 🛠 Stack Tecnológica
- **Frontend:** Next.js (React) + TailwindCSS
- **Backend & Banco:** Supabase (PostgreSQL, Auth, Storage, Functions)
- **Deploy:** Vercel
- **Idiomas:** Português do Brasil (pt-BR)
- **Design:** Moderno, responsivo, acessível, dark mode
- **Padrão:** TypeScript, código tipado, DataTable centralizado, componentes modulares

## 🗂 Estrutura do Projeto
- **README.md** — Você está aqui!
- **ARQUITETURA.md** — Estrutura técnica, pastas, convenções e módulos ([link](./ARQUITETURA.md))
- **AGENTS.md** — Diretrizes para agentes, automações e refatorações ([link](./AGENTS.md))
- **CHECKLIST.md** — Checklist de QA, releases, refatoração, onboarding ([link](./CHECKLIST.md))
- **FLUXOS.md** — Mapas dos fluxos principais (Pedido, Produção, Estoque, Entrega, etc) ([link](./FLUXOS.md))
- **MODULOS/** — Subpastas com docs detalhados para cada módulo (Clientes, Pedidos, Produção, etc)
- **docs/** — Outras documentações técnicas, exemplos e guias

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


## 📢 Contribuindo
Leia o `AGENTS.md` e o `CHECKLIST.md` antes de abrir um PR ou realizar alterações significativas.
Siga padrões de código, tipagem e modularização.
Commits devem ser pequenos e atômicos.
Sempre atualize a documentação relacionada às alterações.

## Status Atual

O ciclo de tipagem manual dos dashboards foi conclu\u00EDdo. Cada p\u00E1gina passou por revis\u00E3o individual de tipos.

- 🔧 `npm run build`, `npm test` e `npm run type-check` executam parcialmente e ainda apresentam falhas em alguns m\u00F3dulos.
- ❌ `npm run lint` retorna erros de ordem de hooks que necessitam refatora\u00E7\u00F5es profundas.
- 🚀 Projeto liberado para refatora\u00E7\u00E3o global, divis\u00E3o por pacotes e prepara\u00E7\u00E3o de deploy.

## Pontos t\u00E9cnicos pendentes

- Resolver avisos do ESLint relacionados \u00E0 ordem de hooks.
- Finalizar corre\u00E7\u00F5es de tipagem restantes at\u00E9 que o `type-check` passe sem erros.
- Ajustar scripts de teste e build para execu\u00E7\u00E3o completa em CI.

## Sugest\u00E3o de pr\u00F3ximos passos

1. Planejar refatora\u00E7\u00E3o global priorizando limpeza de hooks e padroniza\u00E7\u00E3o.
2. Separar m\u00F3dulos em pacotes (monorepo) para facilitar manuten\u00E7\u00E3o.
3. Definir pipeline de deploy e publica\u00E7\u00E3o.

## 📄 Licença
Este projeto é privado para o Ateliê Olie. Não distribua sem autorização.

