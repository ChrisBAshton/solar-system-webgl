define(['camera', 'Mousetrap'], function (camera) {

    Mousetrap.bind(['w', 'a', 's', 'd'], function (e, key) {
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
        }
    }, 'keydown');

});