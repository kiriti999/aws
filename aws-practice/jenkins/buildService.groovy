pipeline {
    agent any

    environment {
        PWD=pwd()
        FAILED_STAGE=""
    }

    stages {

        // stage ("Build npm") {
        //    steps {
        //       sh "rm -rf package-lock.json"
        //       sh "npm install"
        //    }
        // }

        // stage('build backend') {
        //     steps {
        //         // sh "chmod +x -R ${env.WORKSPACE}"
        //         script {
        //             FAILED_STAGE=env.STAGE_NAME
        //         }
        //         // sh "./scripts/build-backend.sh"
        //     }
        // }

        stage('docker version') {
            steps {
                sh "chmod +x -R ${env.WORKSPACE}"
                sh "./scripts/get-version.sh"
            }
        }

        stage('push image') {
            steps {
                script {
                    FAILED_STAGE=env.STAGE_NAME
                }
                echo "build number ${env.BUILD_NUMBER}"
                echo "pwd ${pwd}"
                sh "./scripts/build-push-backend-image.sh ${env.BUILD_NUMBER} dev 2>&1"
            }
        }
    }
}
