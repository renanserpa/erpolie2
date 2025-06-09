# Módulo de Recursos Humanos

Este módulo gerencia colaboradores, vínculo empregatício e produtividade.

## Principais entidades
- **employees**: dados cadastrais do colaborador
- **employment_types**: tipos de vínculo (CLT, PJ, estágio)
- **production_stage_history**: registro de atuação em etapas de produção
- **user_permissions**: permissões de acesso por função

## Funcionalidades
- Cadastro completo de colaboradores com nome, função, vínculo e data de admissão
- Registro de férias e licenças (tabela `leaves`)
- Vinculação de colaboradores às etapas da produção
- Controle de ponto via `time_tracking`
- Relatórios de produtividade por colaborador

