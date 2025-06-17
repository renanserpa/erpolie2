# Checklist de Deploy

1. **Revisar ambiente**
   - [ ] `.env.production` com variáveis do Supabase configuradas
   - [ ] Secrets adicionadas na Vercel
2. **Validações locais**
   - [ ] `npm run lint`
   - [ ] `npm run test`
   - [ ] `npm run build`
3. **Funcionalidades principais**
   - [ ] Login e autenticação
   - [ ] Clientes e fornecedores
   - [ ] Pedidos e produção
   - [ ] Estoque e compras
4. **Após deploy**
   - [ ] Verificar logs de inicialização
   - [ ] Executar teste rápido de navegação
   - [ ] Registrar data e hora do deploy
