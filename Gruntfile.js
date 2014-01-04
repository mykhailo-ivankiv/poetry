module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bgShell : {
            runMongo : {
                cmd: 'mongod',
                done: function (err, stdout, stderr) {
                }
            },
            runGenghis : {
                cmd: "genghisapp",
                done: function (err, stdout, stderr) {
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bg-shell');

    grunt.registerTask('startEnvironment', ["bgShell:runGenghis", 'bgShell:runMongo', ]);
}
