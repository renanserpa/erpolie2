// Exemplo de validação para rodar manualmente
console.log("\u{1F680} Rodando valida\u00E7\u00F5es finais...");
await Promise.all([
  run("npm run lint"),
  run("npm run type-check"),
  run("npm test"),
  run("npx next build"),
]);
