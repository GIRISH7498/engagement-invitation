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
                    echo ================================
                    echo Jenkins Angular CI Pipeline
                    echo ================================

                    echo.
                    echo Current User:
                    whoami

                    echo.
                    echo Host:
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
    }

    post {

        success {
            echo 'Angular application built successfully.'
        }

        failure {
            echo 'Angular CI pipeline failed.'
        }

        always {
            echo 'Pipeline completed.'
        }
    }
}