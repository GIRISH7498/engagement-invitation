pipeline {

    agent {
        label 'windows && angular'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Environment Information') {
            steps {
                bat '''
                    echo ==================================
                    echo Jenkins Angular CI/CD Pipeline
                    echo ==================================

                    whoami
                    hostname

                    git --version
                    node --version
                    npm --version
                    java -version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build Angular') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Verify Build Output') {
            steps {
                powershell '''
                    $buildPath = Join-Path $env:WORKSPACE "dist\\animated-engagement-invitation\\browser"

                    if (-not (Test-Path $buildPath)) {
                        throw "Angular build output not found: $buildPath"
                    }

                    if (-not (Test-Path "$buildPath\\index.html")) {
                        throw "index.html not found."
                    }

                    Write-Host "Angular build output verified:"
                    Write-Host $buildPath
                '''
            }
        }

        stage('Archive Artifact') {
            steps {
                archiveArtifacts(
                    artifacts: 'dist/**/*',
                    fingerprint: true
                )
            }
        }

        stage('Deploy IIS') {

            when {
                branch 'main'
            }

            steps {

                powershell '''
                    Set-ExecutionPolicy Bypass -Scope Process -Force

                    & "$env:WORKSPACE\\deployment\\Deploy-IIS.ps1"
                '''
            }
        }

        stage('Deployment Verification') {

            when {
                branch 'main'
            }

            steps {

                powershell '''
                    $url = "http://localhost:8090"

                    Write-Host "Checking $url"

                    $response = Invoke-WebRequest `
                        -Uri $url `
                        -UseBasicParsing `
                        -TimeoutSec 30

                    if ($response.StatusCode -ne 200) {
                        throw "Application health check failed."
                    }

                    Write-Host "Application is responding successfully."
                '''
            }
        }
    }

    post {

        success {
            echo 'Angular CI/CD pipeline completed successfully.'
            echo 'Application: http://localhost:8090'
        }

        failure {
            echo 'Angular CI/CD pipeline failed.'
        }

        always {
            echo 'Pipeline completed.'
        }
    }
}