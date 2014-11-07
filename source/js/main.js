var version = '0.0.1',
    requireconfig = {
        baseUrl:         'js/app/',
        paths: {
            'glUtils':   '../lib/webgl-utils',
            'glMatrix':  '../lib/glMatrix-2.2.1',
            'Mousetrap': '../lib/mousetrap'
        },
        urlArgs:         'version=' + version
    };

require(requireconfig, ['app'], function (app) {
    app.init();
});