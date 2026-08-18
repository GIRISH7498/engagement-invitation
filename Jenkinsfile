pipeline {

    agent {
        label 'windows && angular'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {

        // =====================================================
        // Application
        // =====================================================
        APP_NAME = 'animated-engagement-invitation'

        // =====================================================
        // Angular Build Output
        // =====================================================
        BUILD_OUTPUT = 'dist\\animated-engagement-invitation\\browser'

        // =====================================================
        // IIS Configuration
        // =====================================================
        IIS_SITE_NAME = 'EngagementInvitation'
        IIS_APP_POOL = 'EngagementInvitationPool'
        IIS_PORT = '8090'

        // =====================================================
        // Deployment Locations
        // =====================================================
        DEPLOY_PATH = 'C:\\inetpub\\wwwroot\\EngagementInvitation'
        BACKUP_ROOT = 'C:\\Jenkins-Backups\\EngagementInvitation'
    }

    stages {

        // =====================================================
        // 1. ENVIRONMENT INFORMATION
        // =====================================================

        stage('Environment Information') {
            steps {

                bat '''
                    echo ==========================================
                    echo Jenkins Angular CI/CD Pipeline
                    echo ==========================================

                    echo.
                    echo Current User:
                    whoami

                    echo.
                    echo Computer:
                    hostname

                    echo.
                    echo Workspace:
                    echo %WORKSPACE%

                    echo.
                    echo Git:
                    git --version

                    echo.
                    echo Node:
                    node --version

                    echo.
                    echo NPM:
                    npm --version

                    echo.
                    echo Java:
                    java -version
                '''
            }
        }

        // =====================================================
        // 2. CHECK ADMINISTRATOR PRIVILEGES
        // =====================================================

        stage('Check Administrator') {

            when {
                branch 'main'
            }

            steps {

                powershell '''

                    Write-Host "Checking Jenkins Agent privileges..."

                    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()

                    $principal = New-Object `
                        Security.Principal.WindowsPrincipal($identity)

                    $isAdministrator = $principal.IsInRole(
                        [Security.Principal.WindowsBuiltInRole]::Administrator
                    )

                    Write-Host "Current User : $($identity.Name)"
                    Write-Host "Administrator: $isAdministrator"

                    if (-not $isAdministrator) {

                        throw @"
Jenkins agent does not have Administrator privileges.

Current user:
$($identity.Name)

IIS installation/configuration requires Administrator privileges.

Add jenkinsagent to Administrators and reconnect the Jenkins agent.
"@
                    }

                    Write-Host "Administrator privileges confirmed."
                '''
            }
        }

        // =====================================================
        // 3. INSTALL DEPENDENCIES
        // =====================================================

        stage('Install Dependencies') {
            steps {

                echo 'Installing Angular dependencies...'

                bat 'npm ci'
            }
        }

        // =====================================================
        // 4. BUILD ANGULAR
        // =====================================================

        stage('Build Angular') {
            steps {

                echo 'Building Angular application...'

                bat 'npm run build'
            }
        }

        // =====================================================
        // 5. VERIFY ANGULAR BUILD
        // =====================================================

        stage('Verify Build Output') {
            steps {

                powershell '''

                    $buildPath = Join-Path `
                        $env:WORKSPACE `
                        $env:BUILD_OUTPUT

                    Write-Host "Checking Angular build output:"
                    Write-Host $buildPath

                    if (-not (Test-Path $buildPath)) {

                        throw "Angular build output does not exist: $buildPath"
                    }

                    $indexFile = Join-Path `
                        $buildPath `
                        "index.html"

                    if (-not (Test-Path $indexFile)) {

                        throw "index.html was not found: $indexFile"
                    }

                    Write-Host ""
                    Write-Host "Angular build output verified successfully."

                    Write-Host ""
                    Write-Host "Files generated:"

                    Get-ChildItem `
                        $buildPath `
                        -Recurse |
                    Select-Object FullName
                '''
            }
        }

        // =====================================================
        // 6. ARCHIVE BUILD
        // =====================================================

        stage('Archive Artifact') {
            steps {

                echo 'Archiving Angular build...'

                archiveArtifacts(
                    artifacts: 'dist/**/*',
                    fingerprint: true
                )
            }
        }

        // =====================================================
        // 7. INSTALL IIS
        // =====================================================

        stage('Install / Verify IIS') {

            when {
                branch 'main'
            }

            steps {

                powershell '''

                    $ErrorActionPreference = "Stop"

                    Write-Host "========================================"
                    Write-Host "Checking IIS"
                    Write-Host "========================================"

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
                            "IIS-DirectoryBrowsing",
                            "IIS-HttpErrors",
                            "IIS-HttpLogging",
                            "IIS-RequestFiltering",
                            "IIS-HttpCompressionStatic",
                            "IIS-WebServerManagementTools",
                            "IIS-ManagementConsole",
                            "IIS-ManagementScriptingTools"
                        )

                        foreach ($feature in $features) {

                            Write-Host ""
                            Write-Host "Enabling: $feature"

                            Enable-WindowsOptionalFeature `
                                -Online `
                                -FeatureName $feature `
                                -All `
                                -NoRestart `
                                -ErrorAction Stop |
                            Out-Null
                        }

                        Write-Host ""
                        Write-Host "IIS installation completed."
                    }
                    else {

                        Write-Host "IIS is already installed."
                    }

                    Write-Host ""
                    Write-Host "Checking IIS service..."

                    $service = Get-Service `
                        W3SVC `
                        -ErrorAction Stop

                    if ($service.Status -ne "Running") {

                        Write-Host "Starting W3SVC..."

                        Start-Service W3SVC
                    }

                    Set-Service `
                        W3SVC `
                        -StartupType Automatic

                    Write-Host "W3SVC is running."
                '''
            }
        }

        // =====================================================
        // 8. CONFIGURE IIS
        // =====================================================

        stage('Configure IIS') {

            when {
                branch 'main'
            }

            steps {

                powershell '''

                    $ErrorActionPreference = "Stop"

                    Import-Module WebAdministration -Force

                    $siteName =
                        $env:IIS_SITE_NAME

                    $appPoolName =
                        $env:IIS_APP_POOL

                    $deployPath =
                        $env:DEPLOY_PATH

                    $port =
                        [int]$env:IIS_PORT


                    Write-Host "========================================"
                    Write-Host "IIS Configuration"
                    Write-Host "========================================"

                    Write-Host "Site Name : $siteName"
                    Write-Host "App Pool  : $appPoolName"
                    Write-Host "Path      : $deployPath"
                    Write-Host "Port      : $port"


                    # ==========================================
                    # Create deployment folder
                    # ==========================================

                    if (-not (Test-Path $deployPath)) {

                        Write-Host ""
                        Write-Host "Creating deployment directory..."

                        New-Item `
                            -ItemType Directory `
                            -Path $deployPath `
                            -Force |
                        Out-Null
                    }


                    # ==========================================
                    # IIS permissions
                    # ==========================================

                    Write-Host ""
                    Write-Host "Giving IIS read permissions..."

                    & icacls `
                        $deployPath `
                        /grant `
                        "IIS_IUSRS:(OI)(CI)RX" `
                        /T `
                        /C

                    if ($LASTEXITCODE -ne 0) {

                        throw "Failed to configure IIS directory permissions."
                    }


                    # ==========================================
                    # Application Pool
                    # ==========================================

                    Write-Host ""
                    Write-Host "Checking Application Pool..."

                    if (-not (
                        Test-Path "IIS:\\AppPools\\$appPoolName"
                    )) {

                        Write-Host "Creating Application Pool..."

                        New-WebAppPool `
                            -Name $appPoolName |
                        Out-Null
                    }


                    # Static Angular application does not need
                    # .NET CLR
                    # ==========================================

                    Set-ItemProperty `
                        "IIS:\\AppPools\\$appPoolName" `
                        -Name managedRuntimeVersion `
                        -Value ""


                    # ==========================================
                    # Website
                    # ==========================================

                    Write-Host ""
                    Write-Host "Checking IIS Website..."

                    $website = Get-Website `
                        -Name $siteName `
                        -ErrorAction SilentlyContinue

                    if (-not $website) {

                        Write-Host "Creating Website..."

                        New-Website `
                            -Name $siteName `
                            -PhysicalPath $deployPath `
                            -Port $port `
                            -ApplicationPool $appPoolName |
                        Out-Null
                    }
                    else {

                        Write-Host "Website already exists."

                        Write-Host "Updating physical path..."

                        Set-ItemProperty `
                            "IIS:\\Sites\\$siteName" `
                            -Name physicalPath `
                            -Value $deployPath
                    }


                    Write-Host ""
                    Write-Host "IIS configuration completed."
                '''
            }
        }

        // =====================================================
        // 9. BACKUP CURRENT DEPLOYMENT
        // =====================================================

        stage('Backup Current Website') {

            when {
                branch 'main'
            }

            steps {

                powershell '''

                    $ErrorActionPreference = "Stop"

                    $deployPath =
                        $env:DEPLOY_PATH

                    $backupRoot =
                        $env:BACKUP_ROOT


                    if (-not (
                        Test-Path $backupRoot
                    )) {

                        New-Item `
                            -ItemType Directory `
                            -Path $backupRoot `
                            -Force |
                        Out-Null
                    }


                    $existingFiles =
                        Get-ChildItem `
                            $deployPath `
                            -Force `
                            -ErrorAction SilentlyContinue


                    if ($existingFiles.Count -eq 0) {

                        Write-Host "No previous deployment found."

                        Write-Host "Backup skipped."

                        return
                    }


                    $timestamp =
                        Get-Date `
                            -Format "yyyyMMdd_HHmmss"


                    $backupPath =
                        Join-Path `
                            $backupRoot `
                            $timestamp


                    Write-Host "Backing up current website..."

                    Write-Host "Source:"
                    Write-Host $deployPath

                    Write-Host "Backup:"
                    Write-Host $backupPath


                    New-Item `
                        -ItemType Directory `
                        -Path $backupPath `
                        -Force |
                    Out-Null


                    robocopy `
                        $deployPath `
                        $backupPath `
                        /E `
                        /R:2 `
                        /W:2 `
                        /NFL `
                        /NDL `
                        /NJH `
                        /NJS


                    $robocopyResult =
                        $LASTEXITCODE


                    if ($robocopyResult -gt 7) {

                        throw "Website backup failed. Robocopy exit code: $robocopyResult"
                    }


                    $global:LASTEXITCODE = 0

                    Write-Host "Website backup completed."
                '''
            }
        }

        // =====================================================
        // 10. DEPLOY ANGULAR APPLICATION
        // =====================================================

        stage('Deploy to IIS') {

            when {
                branch 'main'
            }

            steps {

                powershell '''

                    $ErrorActionPreference = "Stop"

                    Import-Module WebAdministration -Force


                    $siteName =
                        $env:IIS_SITE_NAME

                    $appPoolName =
                        $env:IIS_APP_POOL

                    $deployPath =
                        $env:DEPLOY_PATH

                    $sourcePath =
                        Join-Path `
                            $env:WORKSPACE `
                            $env:BUILD_OUTPUT


                    Write-Host ""
                    Write-Host "========================================"
                    Write-Host "Angular IIS Deployment"
                    Write-Host "========================================"

                    Write-Host "Source:"
                    Write-Host $sourcePath

                    Write-Host ""

                    Write-Host "Destination:"
                    Write-Host $deployPath


                    # ==========================================
                    # Verify source
                    # ==========================================

                    if (-not (
                        Test-Path $sourcePath
                    )) {

                        throw "Angular build output not found: $sourcePath"
                    }


                    # ==========================================
                    # Stop Website
                    # ==========================================

                    Write-Host ""
                    Write-Host "Stopping IIS website..."

                    $siteState =
                        (
                            Get-WebsiteState `
                                -Name $siteName
                        ).Value


                    if ($siteState -eq "Started") {

                        Stop-Website `
                            -Name $siteName
                    }


                    # ==========================================
                    # Deploy
                    # ==========================================

                    Write-Host ""
                    Write-Host "Copying Angular application..."

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


                    $robocopyResult =
                        $LASTEXITCODE


                    if ($robocopyResult -gt 7) {

                        throw "Deployment failed. Robocopy exit code: $robocopyResult"
                    }


                    # Robocopy uses successful non-zero codes.
                    # Reset it so Jenkins does not consider
                    # the PowerShell stage failed.
                    # ==========================================

                    $global:LASTEXITCODE = 0


                    # ==========================================
                    # Start Application Pool
                    # ==========================================

                    Write-Host ""
                    Write-Host "Starting Application Pool..."

                    $poolState =
                        (
                            Get-WebAppPoolState `
                                -Name $appPoolName
                        ).Value


                    if ($poolState -ne "Started") {

                        Start-WebAppPool `
                            -Name $appPoolName
                    }


                    # ==========================================
                    # Start Website
                    # ==========================================

                    Write-Host "Starting Website..."

                    $siteState =
                        (
                            Get-WebsiteState `
                                -Name $siteName
                        ).Value


                    if ($siteState -ne "Started") {

                        Start-Website `
                            -Name $siteName
                    }


                    Write-Host ""
                    Write-Host "Angular deployment completed."
                '''
            }
        }

        // =====================================================
        // 11. VERIFY IIS
        // =====================================================

        stage('Deployment Verification') {

            when {
                branch 'main'
            }

            steps {

                powershell '''

                    $ErrorActionPreference = "Stop"

                    $url =
                        "http://localhost:$env:IIS_PORT"


                    Write-Host ""
                    Write-Host "========================================"
                    Write-Host "Application Health Check"
                    Write-Host "========================================"

                    Write-Host "URL: $url"


                    $success =
                        $false


                    for ($attempt = 1; $attempt -le 5; $attempt++) {

                        Write-Host ""
                        Write-Host "Health check attempt $attempt of 5..."

                        try {

                            $response =
                                Invoke-WebRequest `
                                    -Uri $url `
                                    -UseBasicParsing `
                                    -TimeoutSec 15


                            Write-Host "HTTP Status: $($response.StatusCode)"


                            if ($response.StatusCode -eq 200) {

                                $success = $true

                                break
                            }
                        }
                        catch {

                            Write-Host "Website not ready yet."

                            Write-Host $_.Exception.Message
                        }


                        Start-Sleep `
                            -Seconds 3
                    }


                    if (-not $success) {

                        throw "Application health check failed after 5 attempts."
                    }


                    Write-Host ""
                    Write-Host "========================================"
                    Write-Host "DEPLOYMENT SUCCESSFUL"
                    Write-Host "========================================"

                    Write-Host ""
                    Write-Host "Application URL:"
                    Write-Host $url
                '''
            }
        }
    }

    // =========================================================
    // POST ACTIONS
    // =========================================================

    post {

        success {

            echo '=========================================='
            echo 'Angular CI/CD Pipeline SUCCESS'
            echo '=========================================='

            echo "Application URL: http://localhost:${IIS_PORT}"
        }

        failure {

            echo '=========================================='
            echo 'Angular CI/CD Pipeline FAILED'
            echo '=========================================='

            echo 'Check the failed stage in Jenkins console output.'
        }

        always {

            echo 'Pipeline execution completedddddddddddddddddd.'
        }
    }
}