#!/usr/bin/env bash
set -euo pipefail

log() {
  echo -e "\n[$(date +'%H:%M:%S')] $*"
}

trap 'log "❌ A etapa anterior falhou. Verifique os logs e tente rodar os comandos manualmente."' ERR

log "🔧 Verificando acesso ao registry npm..."
npm config set registry https://registry.npmjs.org >/dev/null
if ! npm ping >/dev/null 2>&1; then
  log "Erro ao acessar registry.npmjs.org. Ajuste suas configurações de rede ou proxy."
  exit 1
fi

log "📦 Instalando dependências"
if ! npm install --no-fund --no-audit; then
  log "Primeira tentativa falhou. Tentando novamente com --legacy-peer-deps..."
  npm install --legacy-peer-deps --no-fund --no-audit
fi

run_step() {
  log "Executando: $*"
  "$@"
}

run_step npm run lint
run_step npm run build
run_step npm test

log "✅ Processo concluído com sucesso"

