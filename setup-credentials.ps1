# XT AI TradeKit credential setup for PowerShell / Windows
# Secret Key is read securely: no echo, never enters the AI conversation, not written to history.
$ErrorActionPreference = "Stop"

$CredDir = "$HOME\.xt-tradekit"
$CredFile = "$CredDir\credentials.json"

Write-Host "🔐 XT AI TradeKit Credential Setup" -ForegroundColor Cyan
Write-Host ""
Write-Host "First create an API key on the XT.COM 'API Management' page."
Write-Host "⚠️ Permission tip: enable only Read + Trade; enabling Withdraw is not recommended for AI trading." -ForegroundColor Yellow
Write-Host "   Enable Transfer only if you need transfers, and bind an IP allowlist whenever possible."
Write-Host ""

if (Test-Path $CredFile) {
    $ans = Read-Host "Credential file $CredFile already exists. Overwrite? (y/N)"
    if ($ans -notmatch '^[yY]') {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit 0
    }
}

$AccessKey = Read-Host "Access Key"
$SecureSecret = Read-Host -AsSecureString "Secret Key (input is hidden)"
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureSecret)
$SecretKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

if ([string]::IsNullOrWhiteSpace($AccessKey) -or [string]::IsNullOrWhiteSpace($SecretKey)) {
    Write-Host "❌ Access Key / Secret Key cannot be empty" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $CredDir)) {
    New-Item -ItemType Directory -Path $CredDir -Force | Out-Null
}

$jsonObj = [PSCustomObject]@{
    access_key = $AccessKey
    secret_key = $SecretKey
}

$jsonContent = $jsonObj | ConvertTo-Json -Compress
[System.IO.File]::WriteAllText($CredFile, $jsonContent)

$AccessKey = $null
$SecretKey = $null

Write-Host ""
Write-Host "✅ Saved to $CredFile" -ForegroundColor Green
Write-Host "   You can ask the assistant to check credentials status using xt_credentials_status (masked, keys never shown)."
