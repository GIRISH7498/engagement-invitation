$ErrorActionPreference = "Stop"

$siteName = "EngagementInvitation"
$appPoolName = "EngagementInvitationPool"
$sitePort = 8090

$sourcePath = Join-Path $env:WORKSPACE "dist\animated-engagement-invitation\browser"
$deployPath = "C:\inetpub\wwwroot\EngagementInvitation"

Write-Host "=============================================="
Write-Host "Angular IIS Deployment"
Write-Host "=============================================="

Write-Host "Site Name       : $siteName"
Write-Host "Application Pool: $appPoolName"
Write-Host "Port            : $sitePort"
Write-Host "Source          : $sourcePath"
Write-Host "Destination     : $deployPath"

# ---------------------------------------------------------
# 1. Verify Administrator privileges
# ---------------------------------------------------------

Write-Host ""
Write-Host "Checking administrator privileges..."

$currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentIdentity)

$isAdministrator = $principal.IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
)

if (-not $isAdministrator) {
    throw "Jenkins agent must run with Administrator privileges to install and configure IIS."
}

Write-Host "Administrator privileges confirmed."

# ---------------------------------------------------------
# 2. Verify Angular build output
# ---------------------------------------------------------

Write-Host ""
Write-Host "Checking Angular build output..."

if (-not (Test-Path $sourcePath)) {
    throw "Angular build output was not found: $sourcePath"
}

$indexFile = Join-Path $sourcePath "index.html"

if (-not (Test-Path $indexFile)) {
    throw "index.html was not found in Angular build output."
}

Write-Host "Angular build output verified."

# ---------------------------------------------------------
# 3. Install IIS if required
# ---------------------------------------------------------

Write-Host ""
Write-Host "Checking IIS installation..."

$iisFeature = Get-WindowsOptionalFeature `
    -Online `
    -FeatureName IIS-WebServerRole

if ($iisFeature.State -ne "Enabled") {

    Write-Host "IIS is not installed."
    Write-Host "Installing IIS..."

    $features = @(
        "IIS-WebServerRole",
        "IIS-WebServer",
        "IIS-CommonHttpFeatures",
        "IIS-StaticContent",
        "IIS-DefaultDocument",
        "IIS-HttpErrors",
        "IIS-HttpLogging",
        "IIS-RequestFiltering",
        "IIS-HttpCompressionStatic",
        "IIS-WebServerManagementTools",
        "IIS-ManagementConsole",
        "IIS-ManagementScriptingTools"
    )

    foreach ($feature in $features) {

        Write-Host "Enabling Windows feature: $feature"

        Enable-WindowsOptionalFeature `
            -Online `
            -FeatureName $feature `
            -All `
            -NoRestart
    }

    Write-Host "IIS installation completed."
}
else {

    Write-Host "IIS is already installed."
}

# ---------------------------------------------------------
# 4. Start IIS service
# ---------------------------------------------------------

Write-Host ""
Write-Host "Checking W3SVC service..."

$service = Get-Service W3SVC -ErrorAction Stop

if ($service.Status -ne "Running") {

    Write-Host "Starting W3SVC..."

    Start-Service W3SVC
}

Set-Service W3SVC -StartupType Automatic

Write-Host "W3SVC is running."

# ---------------------------------------------------------
# 5. Load IIS PowerShell module
# ---------------------------------------------------------

Write-Host ""
Write-Host "Loading WebAdministration..."

Import-Module WebAdministration -Force

# ---------------------------------------------------------
# 6. Create deployment directory
# ---------------------------------------------------------

Write-Host ""
Write-Host "Preparing deployment directory..."

if (-not (Test-Path $deployPath)) {

    New-Item `
        -ItemType Directory `
        -Path $deployPath `
        -Force | Out-Null
}

# IIS must be able to read the files

& icacls $deployPath `
    /grant "IIS_IUSRS:(OI)(CI)RX" `
    /T `
    /C | Out-Null

# ---------------------------------------------------------
# 7. Create application pool
# ---------------------------------------------------------

Write-Host ""
Write-Host "Checking IIS Application Pool..."

if (-not (Test-Path "IIS:\AppPools\$appPoolName")) {

    Write-Host "Creating Application Pool: $appPoolName"

    New-WebAppPool `
        -Name $appPoolName

    Set-ItemProperty `
        -Path "IIS:\AppPools\$appPoolName" `
        -Name managedRuntimeVersion `
        -Value ""
}
else {

    Write-Host "Application Pool already exists."
}

# ---------------------------------------------------------
# 8. Create IIS website
# ---------------------------------------------------------

Write-Host ""
Write-Host "Checking IIS Website..."

$existingSite = Get-Website `
    -Name $siteName `
    -ErrorAction SilentlyContinue

if (-not $existingSite) {

    Write-Host "Creating IIS Website..."

    New-Website `
        -Name $siteName `
        -PhysicalPath $deployPath `
        -Port $sitePort `
        -ApplicationPool $appPoolName
}
else {

    Write-Host "IIS Website already exists."
}

# ---------------------------------------------------------
# 9. Stop site while deploying
# ---------------------------------------------------------

Write-Host ""
Write-Host "Stopping website before deployment..."

$siteState = (Get-WebsiteState -Name $siteName).Value

if ($siteState -eq "Started") {

    Stop-Website `
        -Name $siteName
}

# ---------------------------------------------------------
# 10. Deploy Angular application
# ---------------------------------------------------------

Write-Host ""
Write-Host "Deploying Angular application..."

robocopy `
    $sourcePath `
    $deployPath `
    /MIR `
    /R:3 `
    /W:2 `
    /NFL `
    /NDL `
    /NJH `
    /NJS

$robocopyExitCode = $LASTEXITCODE

# Robocopy exit codes 0-7 are successful conditions

if ($robocopyExitCode -gt 7) {

    throw "Robocopy deployment failed with exit code $robocopyExitCode."
}

Write-Host "Angular files deployed successfully."

# ---------------------------------------------------------
# 11. Start application pool
# ---------------------------------------------------------

Write-Host ""
Write-Host "Starting Application Pool..."

$appPoolState = (
    Get-WebAppPoolState `
        -Name $appPoolName
).Value

if ($appPoolState -ne "Started") {

    Start-WebAppPool `
        -Name $appPoolName
}

# ---------------------------------------------------------
# 12. Start website
# ---------------------------------------------------------

Write-Host ""
Write-Host "Starting IIS Website..."

Start-Website `
    -Name $siteName

# ---------------------------------------------------------
# 13. Health check
# ---------------------------------------------------------

Write-Host ""
Write-Host "Running deployment health check..."

Start-Sleep -Seconds 3

$url = "http://localhost:$sitePort"

$response = Invoke-WebRequest `
    -Uri $url `
    -UseBasicParsing `
    -TimeoutSec 30

if ($response.StatusCode -ne 200) {

    throw "Health check failed. HTTP Status: $($response.StatusCode)"
}

Write-Host ""
Write-Host "=============================================="
Write-Host "Deployment successful"
Write-Host "URL: $url"
Write-Host "=============================================="