import hudson.model.Result

environments = supportedEnvs()
prodEnv = 'prod'

pipeline {
    agent any

    environment {
        PWD = pwd()
        FAILED_STAGE = ''
        DEPLOY_ENVIRONMENT = "${params.deploymentEnvironment}"
        VPC_ENVIRONMENT = "${params.vpcEnvironment}"
        AWS_PRACTICE_BUILD_NUMBER = "${params.buildNumber}"
        AMI_ID_SSM_NAME = "${params.devopsAMISSMName}"
        // pass createCloudWatchResources value as true at the time of stack creation
        // but for stack update just use the default value false
        CREATE_RETAINED_RESOURCES = "${params.createRetainedResources}"
        AMI_ID_LATEST = ''
        REGION = "us-east-2"
        APP_NAME = "aws-practice"
        BUILD_SSM_PARAM = "/${params.deploymentEnvironment}/${APP_NAME}/lastDeployedVersion"
    }

    stages {
        stage('BE Deploy') {
            steps {
                script {
                    FAILED_STAGE = env.STAGE_NAME
                    AMI_ID_LATEST = sh(returnStdout: true, script: "aws ssm get-parameter --name ${AMI_ID_SSM_NAME} --region ${REGION} --output text --query 'Parameter.Value'").trim()
                }
                sh "./scripts/deploy-backend-cf-vpc.sh ${DEPLOY_ENVIRONMENT} ${AWS_PRACTICE_BUILD_NUMBER} ${VPC_ENVIRONMENT} ${AMI_ID_LATEST} ${CREATE_RETAINED_RESOURCES} 2>&1"
            }
        }

        stage('Update deployed artifact values/versions') {
            steps {
                script {
                    FAILED_STAGE = env.STAGE_NAME
                }
                sh "./scripts/post-deploy-updates.sh ${DEPLOY_ENVIRONMENT} ${REGION} ${AMI_ID_LATEST} ${BUILD_SSM_PARAM} ${AWS_PRACTICE_BUILD_NUMBER} 2>&1"
            }
        }

        // stage('Create/Update WSO2 Swagger version 1.0.0') {
        //     steps {
        //         sh "./scripts/generate-wso2-config-file-vpc.sh $PWD/wso2-config.json ${DEPLOY_ENVIRONMENT} 1.0.0 ${AWS_PRACTICE_BUILD_NUMBER} ${getBucketExt(DEPLOY_ENVIRONMENT)}"
        //         build job: "${WSO2_BUILD_JOB}", parameters: [
        //             booleanParam(name: "TEST_IMPORT_TOOL", value: false),
        //             booleanParam(name: "API_DEFINITION_IS_REFERENCE", value: false),
        //             string(name: "ACTION", value: "update"),
        //         ]
        //     }
        // }
    }
}



String[] supportedEnvs() {
    return ['prod']
}

// def reportChangeToSuccess() {
//     if (!Result.SUCCESS.toString().equals(currentBuild.getPreviousBuild()?.getResult())) {
//         slackSend channel: "#aa_audit_service_build", color: 'good', message: "SS-System-Data Build Fixed: job - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
//     }
// }