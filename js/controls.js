define(['camera', 'Mousetrap'], function (camera) {

    var triggerAnimation = function () {};

    Mousetrap.bind(['w', 'a', 's', 'd'], function (e, key) {

        var validKey = true;

        switch (key) {
            case 'w':
                camera.goForwards();
                break;
            case 'a':
                camera.goLeft();
                break;
            case 's':
                camera.goBackwards();
                break;
            case 'd':
                camera.goRight();
                break;
            default:
                validKey = false;
        }

        if (validKey) {
            triggerAnimation();
        }

    }, 'keydown');

    return {
        bindToAnimation: function (callback) {
            triggerAnimation = callback;
        }
    }

});