
📋 **Checklist Geral do Olie ERP**

Este arquivo centraliza os checklists de tarefas, validações e revisões para desenvolvimento, automação, QA e releases. Todo PR, sprint, refatoração ou inclusão de nova funcionalidade deve passar pelos itens abaixo.

## 1. Checklist de Task/Feature
- [ ] Task registrada no board com descrição clara e responsável definido
- [ ] Código segue padrões do projeto (tipagem, nomenclatura, modularização)
- [ ] Nenhum dado mockado no build de produção
- [ ] Componentes e hooks reutilizáveis, quando aplicável
- [ ] Testes automatizados criados/atualizados para nova feature
- [ ] Documentação técnica (docstring, comentários, exemplos) incluída
- [ ] Atualização dos arquivos de documentação relevante (`AGENTS.md`, `FLUXOS.md`, `ARQUITETURA.md` etc.)
- [ ] Validação de acessibilidade e responsividade
- [ ] Internacionalização (pt-br padrão, preparado para expansão)
- [ ] Commit pequeno, atômico e autoexplicativo

## 2. Checklist de Merge/Release
- [ ] Todos os testes automatizados passaram (`npm test`)
- [ ] Build limpo (sem erros/lint warnings)
- [ ] Confirmação de funcionamento nos principais fluxos (login, pedidos, estoque, produção, financeiro etc.)
- [ ] Review do código feito por pelo menos 1 agente (humano ou IA)
- [ ] Changelog/release notes atualizados
- [ ] Data e autor do merge/release registrados
- [ ] Logs e auditorias revisados (ações críticas devidamente salvas)
- [ ] Backup/snapshot realizado antes do deploy em produção

## 3. Checklist de Refatoração/Automação
- [ ] Mudança segmentada por módulo/função
- [ ] Commits pequenos e reversíveis
- [ ] Decisões e racional técnico documentados no PR
- [ ] Não impacta fluxos já validados em produção
- [ ] `AGENTS.md` e documentação técnica atualizados, se necessário
- [ ] Testes refatorados ou mantidos (garantir cobertura)
- [ ] Validação manual após automação/refatoração

## 4. Checklist de QA Manual
- [ ] Navegação completa testada nos principais navegadores (Chrome, Edge, Firefox, Safari)
- [ ] Teste em diferentes tamanhos de tela (desktop, tablet, mobile)
- [ ] Fluxos de Kanban (produção, compras, pedidos, entregas) validados na interface
- [ ] Campos obrigatórios, máscaras e validações funcionando
- [ ] Exportação/importação CSV funcionando em todos os módulos
- [ ] Notificações e toasts exibidos corretamente nos principais eventos
- [ ] Falhas simuladas retornam mensagens claras para o usuário
- [ ] Perfis/restrições de permissão validados (admin x produção x compras x financeiro x RH)
- [ ] Logs de ações (críticas e suspeitas) revisados

## 5. Checklist de Onboarding/Documentação
- [ ] Novos devs ou agentes receberam acesso ao `AGENTS.md` e `ARQUITETURA.md`
- [ ] Passos para setup local testados e documentados (`README.md` atualizado)
- [ ] Scripts de inicialização/documentação de banco revisados
- [ ] Padrões de commit e branch comunicados à equipe

### 🔁 Histórico de Atualizações
- 2024-06-06: Primeira versão consolidada do CHECKLIST.md (por Renan + squad Olie)
- (adicione data, autor e resumo da alteração a cada nova atualização)

**Importante:** Este arquivo deve ser revisado e assinado (digitalmente ou via PR) por todos envolvidos a cada release principal, migração de stack ou inclusão de novo agente/IA. Mantém o Olie ERP sempre auditável, seguro e com evolução controlada!
=======

