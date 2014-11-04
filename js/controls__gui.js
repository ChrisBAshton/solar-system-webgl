define(function () {

    var triggerAnimation;

    function createGUI(planetShortcuts, triggerAnimationParameter) {
        triggerAnimation = triggerAnimationParameter;
        var canvasContainer = document.getElementById('canvas_solar_system__container');
        var guiContainer = document.createElement('DIV');
        var keyboardControlsInfo = document.createElement('DIV');
        guiContainer.id = 'webgl_solarsystem_gui';
        canvasContainer.insertBefore(guiContainer, canvasContainer.firstChild);
        canvasContainer.appendChild(keyboardControlsInfo);

        guiContainer.innerHTML = '<h3>Instructions</h3>';
        guiContainer.innerHTML += '<p>Rotate your field of view by dragging the mouse over the canvas. Tweak the lighting conditions and orbital speeds using the sliders below. See below the canvas for keyboard shortcuts.</p>';

        var controls = {
            'p': 'pause',
            'f': 'full screen',
            'w': 'move forwards',
            'a': 'move left',
            's': 'move backwards',
            'd': 'move right',
            'r': 'reset camera'
        };

        keyboardControlsInfo.innerHTML = '<h3>Keyboard controls (general)</h3>';
        for (var control in controls) {
            keyboardControlsInfo.innerHTML += '<strong>' + control + '</strong>: ' + controls[control] + ', ';
        }

        keyboardControlsInfo.innerHTML += '<h3>Keyboard controls (snap to planet)</h3>';
        for (var shortcut in planetShortcuts) {
            keyboardControlsInfo.innerHTML += '<strong>' + shortcut + '</strong>: ' + planetShortcuts[shortcut].name + ', ';
        }

        createSliders(guiContainer);
    }

    function createSliders(guiContainer) {
        var speedContainer = document.createElement('DIV');
        var speedInfo = document.createElement('DIV');
        var lightingContainerAmbient = document.createElement('DIV');
        var lightingContainerSunSpecular = document.createElement('DIV');
        var lightingContainerSunDiffuse = document.createElement('DIV');

        speedInfo.id = 'millisecondsPerDayInfo';
        speedContainer.className = 'webgl_solarsystem_gui__fieldset_container webgl_solarsystem_gui__fieldset_container--speed';
        lightingContainerAmbient.className = 'webgl_solarsystem_gui__fieldset_container webgl_solarsystem_gui__fieldset_container--ambient';
        lightingContainerSunSpecular.className = 'webgl_solarsystem_gui__fieldset_container webgl_solarsystem_gui__fieldset_container--sun_specular';
        lightingContainerSunDiffuse.className = 'webgl_solarsystem_gui__fieldset_container webgl_solarsystem_gui__fieldset_container--sun_diffuse';
        guiContainer.appendChild(speedContainer);
        guiContainer.appendChild(lightingContainerAmbient);
        guiContainer.appendChild(lightingContainerSunSpecular);
        guiContainer.appendChild(lightingContainerSunDiffuse);

        var globals = {
            ambient:   0.3,
            specular:  0.9,
            diffuse:   1.0,
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
            label:      'shininess',
            id:         'planetShininess',
            min:        0,
            max:        100,
            step:       1,
            defaultVal: globals.shininess,
            container:  speedContainer
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
            label:      'Sunlight Emission (Specular) - Global',
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
            label:      'Sunlight Emission (Specular)  Color - Red',
            id:         'pointRSpecular',
            min:        0,
            max:        1,
            defaultVal: globals.specular,
            step:       0.1,
            container:  lightingContainerSunSpecular
        });

        createSlider({
            label:      'Sunlight Emission (Specular)  Color - Green',
            id:         'pointGSpecular',
            min:        0,
            max:        1,
            defaultVal: globals.specular,
            step:       0.1,
            container:  lightingContainerSunSpecular
        });

        createSlider({
            label:      'Sunlight Emission (Specular)  Color - Blue',
            id:         'pointBSpecular',
            min:        0,
            max:        1,
            defaultVal: globals.specular,
            step:       0.1,
            container:  lightingContainerSunSpecular
        });

        createSlider({
            label:      'Sunlight Emission (Diffuse) - Global',
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
            label:      'Sunlight Emission (Diffuse)  Color - Red',
            id:         'pointRDiffuse',
            min:        0,
            max:        1,
            defaultVal: globals.diffuse,
            step:       0.1,
            container:  lightingContainerSunDiffuse
        });

        createSlider({
            label:      'Sunlight Emission (Diffuse)  Color - Green',
            id:         'pointGDiffuse',
            min:        0,
            max:        1,
            defaultVal: globals.diffuse,
            step:       0.1,
            container:  lightingContainerSunDiffuse
        });

        createSlider({
            label:      'Sunlight Emission (Diffuse)  Color - Blue',
            id:         'pointBDiffuse',
            min:        0,
            max:        1,
            defaultVal: globals.diffuse,
            step:       0.1,
            container:  lightingContainerSunDiffuse
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

    function updateValueOfSliders(globalSlider, slidersToUpdate) {
        var value = document.getElementById(globalSlider).value,
            currentSlider;

        for (var i = 0; i < slidersToUpdate.length; i++) {
            currentSlider = document.getElementById(slidersToUpdate[i]);
            currentSlider.value = value;
        }
    }

    return {
        init: createGUI
    };
});