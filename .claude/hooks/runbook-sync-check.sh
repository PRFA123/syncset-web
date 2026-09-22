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

REASON="RUNBOOK_WORKSPACE_EMAIL.md mudou desde a ultima publicacao do Artifact. Passos: 1) leia o arquivo em $FILE; 2) leia o Artifact atual com action=read url=$ARTIFACT_URL; 3) republique com action=publish url=$ARTIFACT_URL, atualizando a pagina para refletir o conteudo novo (siga o design ja usado na pagina, nao apenas cole o markdown cru); 4) so depois, grave o novo hash rodando: sha256sum '$FILE' | cut -d' ' -f1 > '$STATE' -- isso evita que este hook bloqueie de novo sem necessidade. So entao pare a resposta."

printf '{"decision":"block","reason":"%s"}\n' "$REASON"
