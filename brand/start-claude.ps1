# ============================================================
# start-claude.ps1 - Inicialização automática do Claude Code + OmniRoute
# ============================================================

# Definições
$OMNIROUTE_DIR = "$env:USERPROFILE\.omniroute"
$ENV_FILE = "$OMNIROUTE_DIR\.env"
$LOG_FILE = "$env:TEMP\omniroute.log"

# Cores para output
$GREEN = "Green"
$YELLOW = "Yellow"
$RED = "Red"
$CYAN = "Cyan"

function Write-Step {
    param([string]$Message)
    Write-Host "`n[STEP] $Message" -ForegroundColor $CYAN
}

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor $GREEN
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERRO] $Message" -ForegroundColor $RED
    exit 1
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[AVISO] $Message" -ForegroundColor $YELLOW
}

# ------------------------------------------------------------
# 1. Verifica se o OmniRoute está instalado
# ------------------------------------------------------------
Write-Step "Verificando instalação do OmniRoute"
$omniPath = (Get-Command omniroute -ErrorAction SilentlyContinue).Source
if (-not $omniPath) {
    Write-Error "OmniRoute não encontrado. Instale com: npm install -g omniroute"
}
Write-Success "OmniRoute encontrado em: $omniPath"

# ------------------------------------------------------------
# 2. Cria/Mantém o arquivo .env com as configurações ideais
# ------------------------------------------------------------
Write-Step "Configurando arquivo .env"
if (-not (Test-Path $OMNIROUTE_DIR)) {
    New-Item -ItemType Directory -Path $OMNIROUTE_DIR -Force | Out-Null
}

$envContent = @"
# OmniRoute Environment
REQUIRE_API_KEY=false
OMNIROUTE_SERVER_HOST=127.0.0.1
OMNIROUTE_PORT=20128
OMNIROUTE_MEMORY_MB=2048
OMNIROUTE_CHAT_MAX_HEAVY_IN_FLIGHT=20
OMNIROUTE_CHAT_MAX_TOTAL_IN_FLIGHT=50

# Claude Code defaults
CLAUDE_CODE_MAX_CONTEXT_TOKENS=1000000
CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT=1

# Preferred model (use provider/model)
# List available models at http://localhost:20128/
DEFAULT_MODEL=google/gemini-2.0-flash
"@

$envContent | Out-File -FilePath $ENV_FILE -Encoding utf8 -Force
Write-Success "Arquivo .env configurado em $ENV_FILE"

# ------------------------------------------------------------
# 3. Carrega as variáveis de ambiente no processo atual
# ------------------------------------------------------------
Write-Step "Carregando variáveis de ambiente"
Get-Content $ENV_FILE | ForEach-Object {
    if ($_ -match '^([^#=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path "env:$name" -Value $value -ErrorAction SilentlyContinue
        Write-Host "  $name = $value" -ForegroundColor Gray
    }
}
Write-Success "Variáveis carregadas"

# ------------------------------------------------------------
# 4. Encerra qualquer instância anterior do OmniRoute
# ------------------------------------------------------------
Write-Step "Encerrando instâncias anteriores do OmniRoute"
$oldProcs = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*omniroute*" }
if ($oldProcs) {
    $oldProcs | ForEach-Object { 
        Write-Warning "Encerrando PID $($_.Id)"
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# ------------------------------------------------------------
# 5. Inicia o OmniRoute em segundo plano (janela separada)
# ------------------------------------------------------------
Write-Step "Iniciando OmniRoute em segundo plano"
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "powershell.exe"
$psi.Arguments = "-NoExit -Command `"omniroute serve 2>&1 | Tee-Object -FilePath $LOG_FILE`""
$psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Minimized
$psi.CreateNoWindow = $false
$process = [System.Diagnostics.Process]::Start($psi)

Write-Success "OmniRoute iniciado (PID: $($process.Id))"
Write-Host "  Logs disponíveis em: $LOG_FILE" -ForegroundColor Gray

# ------------------------------------------------------------
# 6. Aguarda o serviço ficar disponível (com timeout)
# ------------------------------------------------------------
Write-Step "Aguardando OmniRoute ficar disponível (até 30s)"
$timeout = 30
$wait = 0
$ready = $false
while ($wait -lt $timeout) {
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:20128/health" -Method Get -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $ready = $true
            break
        }
    } catch {
        # ainda não respondeu
    }
    Start-Sleep -Seconds 1
    $wait++
}
if (-not $ready) {
    Write-Error "OmniRoute não respondeu em $timeout segundos. Verifique logs em $LOG_FILE"
}
Write-Success "OmniRoute está pronto!"

# ------------------------------------------------------------
# 7. Lista os modelos disponíveis para o usuário
# ------------------------------------------------------------
Write-Step "Obtendo lista de modelos disponíveis"
try {
    $modelsJson = Invoke-WebRequest -Uri "http://127.0.0.1:20128/v1/models" -Method Get -ErrorAction Stop
    $models = $modelsJson.Content | ConvertFrom-Json
    Write-Host "`nModelos disponíveis:" -ForegroundColor $CYAN
    $models.data | ForEach-Object { Write-Host "  - $($_.id)" -ForegroundColor Gray }
} catch {
    Write-Warning "Não foi possível listar modelos (erro: $($_.Exception.Message))"
    Write-Host "  Acesse http://127.0.0.1:20128/ para ver a lista." -ForegroundColor Gray
}

# ------------------------------------------------------------
# 8. Define o modelo padrão (se não definido, usa google/gemini-2.0-flash)
# ------------------------------------------------------------
$defaultModel = $env:DEFAULT_MODEL
if (-not $defaultModel) { $defaultModel = "google/gemini-2.0-flash" }

Write-Host "`nModelo padrão: $defaultModel" -ForegroundColor $CYAN
Write-Host "Para usar outro modelo, execute: claude-code --model <provider/model>" -ForegroundColor Gray

# ------------------------------------------------------------
# 9. Inicia o Claude Code com o modelo definido
# ------------------------------------------------------------
Write-Step "Iniciando Claude Code (modelo: $defaultModel)"
Write-Host "`nDigite seus comandos normalmente. Para sair, pressione Ctrl+C duas vezes.`n" -ForegroundColor $GREEN

# Abre uma nova janela para o Claude Code (para não misturar com o servidor)
$psi2 = New-Object System.Diagnostics.ProcessStartInfo
$psi2.FileName = "powershell.exe"
$psi2.Arguments = "-NoExit -Command `"claude-code --model $defaultModel`""
$psi2.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Normal
$process2 = [System.Diagnostics.Process]::Start($psi2)

Write-Success "Claude Code iniciado em nova janela!"
Write-Host "`nDica: Se precisar trocar de modelo, feche a janela do Claude e execute:" -ForegroundColor Yellow
Write-Host "  claude-code --model outro/provedor/modelo" -ForegroundColor Yellow
Write-Host "`nO servidor OmniRoute continua rodando em segundo plano." -ForegroundColor Gray
Write-Host "Para parar o servidor, feche a janela minimizada ou mate o processo node." -ForegroundColor Gray

# Fim