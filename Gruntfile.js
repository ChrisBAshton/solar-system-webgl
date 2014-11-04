module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    
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

    grunt.registerTask('default', ['jshint']);
};