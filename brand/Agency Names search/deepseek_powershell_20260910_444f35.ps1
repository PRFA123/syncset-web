# Verificar todas as sessões em busca de arquivos que possam conter resultados
$sessions = Get-ChildItem "C:\Users\paulo\.claude\projects\C--Users-paulo" -Directory
foreach ($session in $sessions) {
    Write-Host "`n=== Verificando sessão: $($session.Name) ==="
    
    # Verificar estrutura geral
    Get-ChildItem $session.FullName -Force | Select-Object Name, LastWriteTime, Length
    
    # Verificar se há tool-results
    $toolResults = Join-Path $session.FullName "tool-results"
    if (Test-Path $toolResults) {
        Write-Host "`n--- tool-results encontrado ---"
        Get-ChildItem $toolResults -Force | Select-Object Name, LastWriteTime, Length
        
        # Procurar por arquivos maiores que podem conter listas de domínios
        Get-ChildItem $toolResults -Filter "*.json" | ForEach-Object {
            $content = Get-Content $_.FullName -Raw
            if ($content -match "forgeworks" -or $content -match "\.com" -or $content -match "available|unavailable|taken") {
                Write-Host "`n--- Arquivo com dados relevantes: $($_.Name) ---"
                # Mostrar primeiras linhas
                $content -split "`n" | Select-Object -First 20
            }
        }
    }
    
    # Verificar outros arquivos na raiz da sessão
    Get-ChildItem $session.FullName -File | Where-Object { $_.Extension -in @('.txt', '.csv', '.json', '.log', '.md') } | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -match "domain|forgeworks|available|unavailable|taken") {
            Write-Host "`n--- Arquivo com dados: $($_.Name) ---"
            $content -split "`n" | Select-Object -First 10
        }
    }
}