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

        Mousetrap.bind(['f'], function (e, key) {
            camera.toggleFullScreen();
            triggerAnimation();
        }, 'keydown');

        Mousetrap.bind(['p'], function (e, key) {
            paused = !paused;
        }, 'keydown');
    }

    function createGUI() {

        var canvasContainer = document.getElementById('canvas_solar_system__container');
        var guiContainer = document.createElement('DIV');
        guiContainer.id = 'webgl_solarsystem_gui';
        canvasContainer.insertBefore(guiContainer, canvasContainer.firstChild);

        guiContainer.innerHTML = '<h3>Instructions</h3>';
        guiContainer.innerHTML += '<p>Rotate your field of view by dragging the mouse over the canvas. Tweak the lighting conditions and orbital speeds using the sliders below.</p>';
        guiContainer.innerHTML += '<p><strong>Keyboard controls:</strong> "p": pause, "f": full screen, "w": move camera forwards, "a": move camera to the left, "s": move camera backwards, "d": move camera to the right</p>';

        createSlider({
            label:     'Time',
            id:        'millisecondsPerDay',
            minLabel:  'Fast',
            maxLabel:  'Slow',
            min:       5,
            max:       5000,
            default:   1000,
            container: guiContainer
        });

        createSlider({
            label:     'Ambient Light - Red',
            id:        'ambientR',
            min:       0,
            max:       1,
            default:   0.3,
            step:      0.1,
            container: guiContainer
        });

        createSlider({
            label:     'Ambient Light - Green',
            id:        'ambientG',
            min:       0,
            max:       1,
            default:   0.3,
            step:      0.1,
            container: guiContainer
        });

        createSlider({
            label:     'Ambient Light - Blue',
            id:        'ambientB',
            min:       0,
            max:       1,
            default:   0.3,
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
    }

    function createSlider(config) {
        var fieldset = document.createElement('FIELDSET'),
            slider   = document.createElement('INPUT'),
            label    = document.createElement('LABEL');
        
        label.innerHTML = config.label;

        slider.type  = 'range';
        slider.id    = config.id;
        slider.step  = config.step || 1;
        slider.min   = config.min;
        slider.max   = config.max;
        slider.value = config.default;

        config.container.appendChild(fieldset);
        fieldset.appendChild(label);
        fieldset.appendChild(document.createTextNode(config.minLabel || slider.min));
        fieldset.appendChild(slider);
        fieldset.appendChild(document.createTextNode(config.maxLabel || slider.max));
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