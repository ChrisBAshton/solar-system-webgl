define(['glMatrix', 'camera', 'Mousetrap'], function (glMatrix, camera) {

    var canvas           = document.getElementById('canvas_solar_system');
    var triggerAnimation = function () {};
    var keyDown          = false;
    var mouseDown        = false;
    var lastMouseX       = null;
    var lastMouseY       = null;
    var paused           = false;

    function init() {
        bindKeyboardControls();
        bindMouseControls();
        createGUI();
    }

    function bindMouseControls() {
        canvas.onmousedown   = handleMouseDown;
        document.onmouseup   = handleMouseUp;
        document.onmousemove = handleMouseMove;
    }

    function bindKeyboardControls() {
        Mousetrap.bind(['w', 'a', 's', 'd'], function (e, key) {

            keyDown = keyDown ? ++keyDown : 1;

            var validKey = true;

            switch (key) {
                case 'w':
                    camera.goForwards(keyDown);
                    break;
                case 'a':
                    camera.goLeft(keyDown);
                    break;
                case 's':
                    camera.goBackwards(keyDown);
                    break;
                case 'd':
                    camera.goRight(keyDown);
                    break;
                default:
                    validKey = false;
            }

            if (validKey) {
                triggerAnimation();
            }

        }, 'keydown');

        Mousetrap.bind(['w', 'a', 's', 'd'], function (e, key) {
            keyDown = false;
        }, 'keyup');  
    }

    function createGUI() {

        var guiContainer = document.createElement('DIV');
        guiContainer.id = 'webgl_solarsystem_gui';
        document.body.appendChild(guiContainer);

        var pauseButton     = document.createElement('BUTTON'),
            pauseButtonText = document.createTextNode("Play/pause");

        pauseButton.onclick = function () {
            paused = !paused;
        }

        pauseButton.appendChild(pauseButtonText);
        guiContainer.appendChild(pauseButton);

        createSlider({
            label:     'Milliseconds per day',
            id:        'millisecondsPerDay',
            min:       500,
            max:       100000,
            default:   20000,
            container: guiContainer
        });

        createSlider({
            label:     'Ambient Light - Red',
            id:        'ambientR',
            min:       0,
            max:       1,
            default:   0.2,
            step:      0.1,
            container: guiContainer
        });

        createSlider({
            label:     'Ambient Light - Green',
            id:        'ambientG',
            min:       0,
            max:       1,
            default:   0.2,
            step:      0.1,
            container: guiContainer
        });

        createSlider({
            label:     'Ambient Light - Blue',
            id:        'ambientB',
            min:       0,
            max:       1,
            default:   0.2,
            step:      0.1,
            container: guiContainer
        });

        createSlider({
            label:     'Point Light Color - Red',
            id:        'pointR',
            min:       0,
            max:       1,
            default:   0.8,
            step:      0.1,
            container: guiContainer
        });

        createSlider({
            label:     'Point Light Color - Green',
            id:        'pointG',
            min:       0,
            max:       1,
            default:   0.8,
            step:      0.1,
            container: guiContainer
        });

        createSlider({
            label:     'Point Light Color - Blue',
            id:        'pointB',
            min:       0,
            max:       1,
            default:   0.8,
            step:      0.1,
            container: guiContainer
        });

        createSlider({
            label:     'Light position X',
            id:        'lightPositionX',
            min:       -10000,
            max:       10000,
            default:   0,
            container: guiContainer
        });

        createSlider({
            label:     'Light position Y',
            id:        'lightPositionY',
            min:       -10000,
            max:       10000,
            default:   0,
            container: guiContainer
        });

        createSlider({
            label:     'Light position Z',
            id:        'lightPositionZ',
            min:       -10000,
            max:       10000,
            default:   0,
            container: guiContainer
        });

    }

    function createSlider(config) {
        var slider = document.createElement('INPUT'),
            label  = document.createElement('LABEL');
        
        label.innerHTML = config.label;

        slider.type  = 'range';
        slider.id    = config.id;
        slider.step  = config.step || 1;
        slider.min   = config.min;
        slider.max   = config.max;
        slider.value = config.default;

        config.container.appendChild(label);
        config.container.appendChild(document.createTextNode(slider.min));
        config.container.appendChild(slider);
        config.container.appendChild(document.createTextNode(slider.max));
    }

    function handleMouseDown(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }

    function handleMouseUp(event) {
        mouseDown = false;
    }

    function handleMouseMove(event) {
        if (!mouseDown) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX
        var newRotationMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(newRotationMatrix);
        glMatrix.mat4.rotate(newRotationMatrix, newRotationMatrix, degToRad(deltaX / 10), [0, 1, 0]);

        var deltaY = newY - lastMouseY;
        glMatrix.mat4.rotate(newRotationMatrix, newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

        camera.rotateView(newRotationMatrix);

        lastMouseX = newX
        lastMouseY = newY;

        triggerAnimation();
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    return {
        bindToAnimation: function (callback) {
            triggerAnimation = callback;
            init();
        },

        paused: function () {
            return paused;
        },

        millisecondsPerDay: function () {
            return parseInt(document.getElementById('millisecondsPerDay').value, 10);
        }
    }

});