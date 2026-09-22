#!/usr/bin/env bash
# Stop hook: if RUNBOOK_WORKSPACE_EMAIL.md changed since the last time its
# Artifact mirror was published, block the stop and ask Claude to republish it.

FILE="$CLAUDE_PROJECT_DIR/RUNBOOK_WORKSPACE_EMAIL.md"
STATE="$CLAUDE_PROJECT_DIR/.claude/runbook-artifact-sync.sha256"
ARTIFACT_URL="https://claude.ai/artifact/9Wo2RmWGaoxi4atFjJ1yJb"

[ -f "$FILE" ] || exit 0

CUR=$(sha256sum "$FILE" 2>/dev/null | cut -d' ' -f1)
[ -n "$CUR" ] || exit 0

PREV=$(cat "$STATE" 2>/dev/null || echo "")

if [ "$CUR" = "$PREV" ]; then
  exit 0
fi

REASON="RUNBOOK_WORKSPACE_EMAIL.md mudou desde a ultima sincronizacao do Artifact $ARTIFACT_URL. AVISO: esse Artifact e um Claude Docs (nao HTML estatico) -- action=publish NAO funciona nele, vai falhar. Passos corretos: 1) leia o arquivo local em $FILE; 2) Artifact action=read url=$ARTIFACT_URL para confirmar o tipo e pegar o id do doc (procure project id nas notas do tipo); 3) mcp docs connector: read do project, depois read do node com projection outline para ver o conteudo atual; 4) compare com o arquivo local -- se o doc tiver secoes/conteudo que NAO existem no arquivo local, PARE e pergunte ao usuario antes de apagar (pode ser conteudo editado direto no doc, sem equivalente no arquivo); 5) se a comparacao for segura, edite o doc via update (ops de replace/insert/delete, com ifHash) para refletir o arquivo local -- nao existe um replace-de-pagina-inteira nesse sistema, e edicao granular; 6) so depois de confirmar a atualizacao, grave o novo hash rodando: sha256sum '$FILE' | cut -d' ' -f1 > '$STATE' -- isso evita que este hook bloqueie de novo sem necessidade. So entao pare a resposta."

printf '{"decision":"block","reason":"%s"}\n' "$REASON"
