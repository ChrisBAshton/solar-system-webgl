module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    
    grunt.config('jshint', {
        options: {
            es3:      true,
            indent:   4,
            curly:    true,
            eqeqeq:   true,
            immed:    true,
            latedef:  true,
            newcap:   true,
            noarg:    true,
            quotmark: true,
            sub:      true,
            boss:     true,
            eqnull:   true,
            trailing: true,
            white:    true,
            force:    true,
            ignores: ['js/lib/*.js']
        },
        all: ['Gruntfile.js', 'js/*.js']
    });

    grunt.config('pkg', grunt.file.readJSON('package.json'));

    grunt.config('yuidoc', {
        compile: {
            name: '<%= pkg.name %>',
            description: '<%= pkg.description %>',
            version: '<%= pkg.version %>',
            options: {
                paths:    './source/js/app/',
                //themedir: 'path/to/custom/theme/',
                outdir:   './documentation/javascript/'
            }
        }
    });

    grunt.registerTask('default', ['jshint', 'yuidoc']);
};