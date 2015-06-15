//Wrapper function with one parameter
module.exports = function(grunt) {
    var bannerContent = '/*! <%= pkg.name %> v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
        ' *  License: <%= pkg.license %> */\n';

    var latest = 'sdk';
    var name = '<%= pkg.name %>-v<%= pkg.version%>';

    devRelease = 'distrib/' + name + '.js';
    minRelease = 'distrib/' + name + '.min.js';
    sourceMapMin = 'distrib/' + name + '.min.js';
    sourceMapUrl = name + '.min.js';

    lDevRelease = 'distrib/' + latest + '.js';
    lMinRelease = 'distrib/' + latest + '.min.js';
    lSourceMapMin = 'distrib/' + latest + '.min.js.map';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            development: { // copy non-minified release file
                src: devRelease,
                dest: lDevRelease
            },
            minified: { // copy minified release file
                src: minRelease,
                dest: lMinRelease
            },
            smMinified: { // source map of minified release file
                src: sourceMapMin,
                dest: lSourceMapMin
            }
        },
        concat: {
            options: {
                banner: bannerContent
            },
            target: {
                src: ['src/intro.js',  'src/**/*.js', 'src/main/init.js', 'src/outro.js'],
                dest: 'distrib/' + name + '.js'
            }
        },
        uglify: {
            options: {
                banner: bannerContent,
                sourceMapRoot: '../',
                sourceMap: 'distrib/' + name + '.min.js.map',
                sourceMapUrl: name + '.min.js.map'
            },
            target: {
                src: ['distrib/' + name + '.js'],
                dest: 'distrib/' + name + '.min.js'
            }
        },
        jshint: {
            options: {
                eqeqeq: true,
                trailing: true
            },
            target: {
                src: ['src/**/*.js', 'test/**/*.js',
                    '!src/outro.js', '!src/intro.js'
                ]
            }
        }
    });

    //Load each grunt task. The easy way!
    require('matchdep').filterDev('grunt-*').forEach(
        function(task) {
            grunt.loadNpmTasks(task);
        }
    );

    grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'copy']);
};