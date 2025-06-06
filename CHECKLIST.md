# CHECKLIST.md

Este checklist deve ser seguido rigorosamente antes de merges ou deploys do **Olie ERP**.

## Revisão de Código
- [ ] Código segue os padrões definidos em `AGENTS.md`.
- [ ] Não foram incluídos dados de testes ou mocks em produção.
- [ ] Funções e módulos atualizados possuem comentários ou documentação.
- [ ] Alterações limitam-se ao escopo da tarefa.

## Validação e Testes
- [ ] Testes unitários e de integração executados com `npm test`.
- [ ] Resultados de testes foram analisados e não há falhas.
- [ ] Validação manual dos módulos afetados.

## Documentação
- [ ] `README.md` e documentos relevantes atualizados.
- [ ] Changelog ou notas de versão preenchidas quando necessário.

## Processo de Merge
- [ ] Pull Request revisado por pelo menos uma pessoa da equipe.
- [ ] Conflitos resolvidos priorizando a versão mais moderna do código.
- [ ] Tags e mensagens de commit claras e objetivas.

## Deploy
- [ ] Ambiente preparado (variáveis, secrets e configurações).
- [ ] Build executado sem erros (`npm run build`).
- [ ] Após deploy, monitorar logs para identificar problemas.

