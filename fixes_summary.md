## Correções Aplicadas
- Ajustados imports das páginas de Componentes, Insumos e Estoque para utilizar as funções geradoras de colunas.
- Criados callbacks `handleEdit` e `handleDelete` com placeholders e uso de `useMemo`.
- Corrigida tipagem de estados nos formulários.
- Atualizada `MovementForm` removendo `nonzero()` e usando `refine` para validar quantidade.
- Ajustado módulo de fornecedores com useMemo e callbacks.
- Serviços financeiros retornam arrays seguros e tipagem iniciada.