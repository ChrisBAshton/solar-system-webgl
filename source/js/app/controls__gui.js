/**
 * @module ControlsGUI
 */
define(function () {

    var triggerAnimation;

    /**
     * Creates the GUI.
     * @method createGUI
     * @param  {object} planetShortcuts    Array of planet names and the keyboard shortcut to use to snap to them.  
     * @param  {Function} triggerAnimationParameter Provides a hook for updating animation after changing input values (@TODO - this is a code smell. Should decouple the animation from the GUI inputs.)
     */
    function createGUI(planetShortcuts, triggerAnimationParameter) {
        triggerAnimation = triggerAnimationParameter;
        
        var canvasContainer = document.getElementById('canvas_solar_system__container');
        var instructionsContainer = document.createElement('DIV');
        var guiContainer = document.createElement('DIV'),
            controls = {
                'p': 'pause',
                'f': 'full screen',
                'w': 'move forwards',
                'a': 'move left',
                's': 'move backwards',
                'd': 'move right',
                'r': 'reset camera'
            };
        
        guiContainer.id = 'webgl_solarsystem_gui';
        instructionsContainer.id = 'webgl_solarsystem_instructions';
        
        canvasContainer.insertBefore(instructionsContainer, canvasContainer.firstChild);
        canvasContainer.appendChild(guiContainer);

        instructionsContainer.innerHTML = '<h3>Instructions</h3>';
        instructionsContainer.innerHTML += '<p>Full screen viewing (keyboard shortcut "F") is <strong>highly recommended</strong>.</p>';
        instructionsContainer.innerHTML += '<p>Rotate your field of view by dragging the mouse over the canvas. Tweak the lighting conditions and orbital speeds using the GUI sliders. See below for keyboard shortcuts.</p>';

        instructionsContainer.innerHTML += '<h3>Keyboard controls (general)</h3>';
        for (var control in controls) {
            instructionsContainer.innerHTML += '<strong>' + control + '</strong>: ' + controls[control] + ', ';
        }

        instructionsContainer.innerHTML += '<h3>Keyboard controls (snap to planet)</h3>';
        for (var shortcut in planetShortcuts) {
            instructionsContainer.innerHTML += '<strong>' + shortcut + '</strong>: ' + planetShortcuts[shortcut].name + ', ';
        }

        createSliders(guiContainer);
    }

    /**
     * Creates the sliders in the GUI.
     * @method createSliders
     * @param  {DOMElement} guiContainer Document element to insert the sliders in.
     */
    function createSliders(guiContainer) {
        var speedContainer = document.createElement('DIV');
        var shininessContainer = document.createElement('DIV');
        var speedInfo = document.createElement('DIV');
        var separator = document.createElement('HR');
        var lightingContainerAmbient = document.createElement('DIV');
        var lightingContainerSunSpecular = document.createElement('DIV');
        var lightingContainerSunDiffuse = document.createElement('DIV');

        speedInfo.id = 'millisecondsPerDayInfo';
        speedContainer.className = 'webgl_solarsystem_gui__fieldset_container webgl_solarsystem_gui__fieldset_container--cols_2';
        shininessContainer.className = 'webgl_solarsystem_gui__fieldset_container webgl_solarsystem_gui__fieldset_container--cols_2';
        lightingContainerAmbient.className = 'webgl_solarsystem_gui__fieldset_container webgl_solarsystem_gui__fieldset_container--cols_3';
        lightingContainerSunSpecular.className = 'webgl_solarsystem_gui__fieldset_container webgl_solarsystem_gui__fieldset_container--cols_3';
        lightingContainerSunDiffuse.className = 'webgl_solarsystem_gui__fieldset_container webgl_solarsystem_gui__fieldset_container--cols_3';
        separator.setAttribute('style', 'clear: both;');

        guiContainer.appendChild(speedContainer);
        guiContainer.appendChild(shininessContainer);
        guiContainer.appendChild(separator);
        guiContainer.appendChild(lightingContainerAmbient);
        guiContainer.appendChild(lightingContainerSunSpecular);
        guiContainer.appendChild(lightingContainerSunDiffuse);

        var globals = {
            ambient:   0.4,
            specular:  0.7,
            diffuse:   0.7,
            shininess: 5
        };

        createSlider({
            label:      'Time',
            id:         'millisecondsPerDay',
            minLabel:   'Fast',
            maxLabel:   'Slow',
            min:        10,
            max:        5000,
            step:       10,
            defaultVal: 1000,
            container:  speedContainer,
            onChangeCallback: updateMillisecondsPerDay
        });
        speedContainer.appendChild(speedInfo);
        updateMillisecondsPerDay();

        createSlider({
            label:      'Planet shininess',
            id:         'planetShininess',
            min:        0,
            max:        255,
            step:       1,
            defaultVal: globals.shininess,
            container:  shininessContainer
        });

        createSlider({
            label:      'Ambient Light - Global',
            id:         'ambientGlobal',
            min:        0,
            max:        1,
            defaultVal: globals.ambient,
            step:       0.1,
            container:  lightingContainerAmbient,
            onChangeCallback: function () {
                updateValueOfSliders('ambientGlobal', ['ambientR', 'ambientG', 'ambientB']);
            }
        });

        createSlider({
            label:      'Ambient Light - Red',
            id:         'ambientR',
            min:        0,
            max:        1,
            defaultVal: globals.ambient,
            step:       0.1,
            container:  lightingContainerAmbient
        });

        createSlider({
            label:      'Ambient Light - Green',
            id:         'ambientG',
            min:        0,
            max:        1,
            defaultVal: globals.ambient,
            step:       0.1,
            container:  lightingContainerAmbient
        });

        createSlider({
            label:      'Ambient Light - Blue',
            id:         'ambientB',
            min:        0,
            max:        1,
            defaultVal: globals.ambient,
            step:       0.1,
            container:  lightingContainerAmbient
        });

        createSlider({
            label:      'Specular term - Global',
            id:         'pointGlobalSpecular',
            min:        0,
            max:        1,
            defaultVal: globals.specular,
            step:       0.1,
            container:  lightingContainerSunSpecular,
            onChangeCallback: function () {
                updateValueOfSliders('pointGlobalSpecular', ['pointRSpecular', 'pointGSpecular', 'pointBSpecular']);
            }
        });

        createSlider({
            label:      'Specular term - Red',
            id:         'pointRSpecular',
            min:        0,
            max:        1,
            defaultVal: globals.specular,
            step:       0.1,
            container:  lightingContainerSunSpecular
        });

        createSlider({
            label:      'Specular term - Green',
            id:         'pointGSpecular',
            min:        0,
            max:        1,
            defaultVal: globals.specular,
            step:       0.1,
            container:  lightingContainerSunSpecular
        });

        createSlider({
            label:      'Specular term - Blue',
            id:         'pointBSpecular',
            min:        0,
            max:        1,
            defaultVal: globals.specular,
            step:       0.1,
            container:  lightingContainerSunSpecular
        });

        createSlider({
            label:      'Diffuse term - Global',
            id:         'pointGlobalDiffuse',
            min:        0,
            max:        1,
            defaultVal: globals.diffuse,
            step:       0.1,
            container:  lightingContainerSunDiffuse,
            onChangeCallback: function () {
                updateValueOfSliders('pointGlobalDiffuse', ['pointRDiffuse', 'pointGDiffuse', 'pointBDiffuse']);
            }
        });

        createSlider({
            label:      'Diffuse term - Red',
            id:         'pointRDiffuse',
            min:        0,
            max:        1,
            defaultVal: globals.diffuse,
            step:       0.1,
            container:  lightingContainerSunDiffuse
        });

        createSlider({
            label:      'Diffuse term - Green',
            id:         'pointGDiffuse',
            min:        0,
            max:        1,
            defaultVal: globals.diffuse,
            step:       0.1,
            container:  lightingContainerSunDiffuse
        });

        createSlider({
            label:      'Diffuse term - Blue',
            id:         'pointBDiffuse',
            min:        0,
            max:        1,
            defaultVal: globals.diffuse,
            step:       0.1,
            container:  lightingContainerSunDiffuse
        });
    }

    /**
     * Creates a slider.
     * @method createSlider
     * @param  {Object} config Configuration object.
     */
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
        slider.value = config.defaultVal;

        if (config.onChangeCallback) {
            slider.oninput = function () {
                config.onChangeCallback();
                triggerAnimation();
            };
        }
        else {
            slider.oninput = triggerAnimation;
        }

        config.container.appendChild(fieldset);
        fieldset.appendChild(label);
        fieldset.appendChild(document.createTextNode(config.minLabel || slider.min));
        fieldset.appendChild(slider);
        fieldset.appendChild(document.createTextNode(config.maxLabel || slider.max));
    }

    /**
     * Updates the value displayed to users when they change the number of milliseconds per day.
     * @method updateMillisecondsPerDay
     */
    function updateMillisecondsPerDay() {
        var inputValue = document.getElementById('millisecondsPerDay').value,
            info  = document.getElementById('millisecondsPerDayInfo'),
            millisecondsPerDay = parseInt(inputValue, 10),
            secondsPerDay = millisecondsPerDay / 1000,
            html = '1 Earth day = ';

        if (secondsPerDay < 1) {
            html += millisecondsPerDay + ' milliseconds';
        }
        else {
            html += (secondsPerDay + ' ') + (secondsPerDay > 1 ? 'seconds' : 'second');
        }

        info.innerHTML = html;
    }

    /**
     * Updates the value of all the given sliders. This way we can have one 'master' slider that controls all the others.
     * @method updateValueOfSliders
     * @param  {String} globalSlider    ID of the master slider.
     * @param  {array} slidersToUpdate Array of IDs of the sliders that should be updated when the master is updated.
     */
    function updateValueOfSliders(globalSlider, slidersToUpdate) {
        var value = document.getElementById(globalSlider).value,
            currentSlider;

        for (var i = 0; i < slidersToUpdate.length; i++) {
            currentSlider = document.getElementById(slidersToUpdate[i]);
            currentSlider.value = value;
        }
    }

    /**
     * @class ControlsGUI
     */
    return {
        /**
         * Initialises the GUI.
         * @method init
         * @constructor
         */
        init: createGUI
    };
});