# Downloads the official brand marks for the SyncSet connector grid.
# Source: Simple Icons (simpleicons.org) — each mark served in its own official brand colour.
# Run from anywhere; it creates the folder for you.

$dest = "C:\Users\paulo\syncset-web\public\logos"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# slug = Simple Icons slug, value = official brand hex (colour baked into the SVG)
$icons = @{
  "googlecalendar"   = "4285F4"
  "microsoftoutlook" = "0F6CBD"
  "caldotcom"        = "D8DEE4"
  "hubspot"          = "FF7A59"
  "pipedrive"        = "1A9C55"
  "airtable"         = "18BFFF"
  "notion"           = "E8E8E8"
  "mondaydotcom"     = "FF3D57"
  "clickup"          = "7B68EE"
  "stripe"           = "635BFF"
  "square"           = "9BA2A8"
  "xero"             = "13B5EA"
  "gmail"            = "EA4335"
  "zohomail"         = "E42527"
  "front"            = "FF5A3C"
  "slack"            = "36C5F0"
  "microsoftteams"   = "6264A7"
  "telegram"         = "26A5E4"
  "twilio"           = "F22F46"
  "brevo"            = "0B996E"
  "mailchimp"        = "FFE01B"
  "make"             = "8A3FFC"
  "n8n"              = "EA4B71"
  "zapier"           = "FF4F00"
  "shopify"          = "7AB55C"
  "woocommerce"      = "9B5C8F"
  "myob"             = "8B3FD1"
  "googlesheets"     = "34A853"
  "microsoftexcel"   = "217346"
  "supabase"         = "3ECF8E"
}

$ok = 0
$missing = @()

foreach ($slug in $icons.Keys) {
    $url  = "https://cdn.simpleicons.org/$slug/$($icons[$slug])"
    $file = Join-Path $dest "$slug.svg"
    try {
        Invoke-WebRequest -Uri $url -OutFile $file -UseBasicParsing -ErrorAction Stop
        Write-Host "  ok      $slug" -ForegroundColor Green
        $ok++
    } catch {
        Write-Host "  missing $slug" -ForegroundColor DarkYellow
        $missing += $slug
    }
}

Write-Host ""
Write-Host "$ok downloaded to $dest"
if ($missing.Count -gt 0) {
    Write-Host "Not on Simple Icons (grab from the vendor's own brand kit): $($missing -join ', ')" -ForegroundColor DarkYellow
}
