var version = '0.0.1';

// create an alias that points to proper file
var requireconfig = {
    baseUrl: 'js/',
    paths: {
        'glUtils':   'lib/webgl-utils',
        'glMatrix':  'lib/glMatrix-2.2.1',
        'Mousetrap': 'lib/mousetrap'
    }/*,
    urlArgs: "version=" + version
    */
};

// Start the main app logic.
require(requireconfig, ['app'], function (app) {
    app.init();
}); 