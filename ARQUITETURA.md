# ARQUITETURA.md

Este documento apresenta uma visão geral da arquitetura do **Olie ERP** e as tecnologias utilizadas.

## Tecnologias Principais
- **Next.js 14** para o frontend e roteamento.
- **TypeScript** como linguagem padrão.
- **Supabase** para banco de dados PostgreSQL e autenticação.
- **TailwindCSS** para estilização.
- Hospedagem e deploy via **Vercel**.

## Estrutura de Pastas
| Diretório            | Descrição                                              |
|----------------------|--------------------------------------------------------|
| `src/`               | Código do frontend Next.js e componentes React.        |
| `sql/`               | Scripts SQL de criação e manutenção do banco.          |
| `docs/`              | Documentação complementar.                             |
| `tests/`             | Testes automatizados com Vitest.                       |

## Integração entre Módulos
1. Autenticação realizada no módulo **Login** usando Supabase Auth.
2. Após login, o **Dashboard** consulta dados consolidados e direciona para módulos específicos.
3. Módulos de **Clientes**, **Produtos**, **Estoque** e demais utilizam APIs REST fornecidas pelo Supabase.
4. Operações críticas disparam funções de banco (`sql/`) garantindo consistência.
5. Relatórios de **BI** agregam dados de vários módulos para visualização analítica.

## Boas Práticas de Desenvolvimento
- Manter commits pequenos e descrições claras.
- Executar `npm test` antes de qualquer push.
- Evitar dados sensíveis no repositório; utilize variáveis de ambiente.
- Priorizar componentes reutilizáveis com Tipagem forte.

