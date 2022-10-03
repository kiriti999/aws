const LOCAL_ENV = 'local/environment.json';
const LOCAL_EVENTS_BASE_PATH = 'local/events/';

module.exports = function (grunt) {
    // Init tasks 
    grunt.initConfig({
        shell: {
            'sam-local': {
                command: (functionName) => {
                    if (functionName === 'undefined') {
                        return `echo Invalid Function Name:: npm run invoke -- --function-name=FunctionName`;
                    }
                    return `sam.cmd local invoke  \
                        ${functionName} \
                        --event  ${LOCAL_EVENTS_BASE_PATH}/${functionName}.json \
                        --env-vars  ${LOCAL_ENV}`
                }
            },
            'start-api': {
                command: () => {
                    return `sam.cmd local start-api \
                        -n ${LOCAL_ENV}`
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    const functionName = grunt.option('function-name');
    grunt.registerTask('invoke', ['shell:sam-local:' + functionName]);
    grunt.registerTask('start:api', ['shell:start-api']);
};
