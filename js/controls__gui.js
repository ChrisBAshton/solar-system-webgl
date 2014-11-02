define(function () {

    function createGUI() {

        var canvasContainer = document.getElementById('canvas_solar_system__container');
        var guiContainer = document.createElement('DIV');
        guiContainer.id = 'webgl_solarsystem_gui';
        canvasContainer.insertBefore(guiContainer, canvasContainer.firstChild);

        guiContainer.innerHTML = '<h3>Instructions</h3>';
        guiContainer.innerHTML += '<p>Rotate your field of view by dragging the mouse over the canvas. Tweak the lighting conditions and orbital speeds using the sliders below.</p>';
        guiContainer.innerHTML += '<p><strong>Keyboard controls:</strong> "p": pause, "f": full screen, "w": move camera forwards, "a": move camera to the left, "s": move camera backwards, "d": move camera to the right</p>';

        var speedContainer = document.createElement('DIV');
        var lightingContainerAmbient = document.createElement('DIV');
        var lightingContainerSun = document.createElement('DIV');

        speedContainer.className = 'webgl_solarsystem_gui__speed';
        lightingContainerAmbient.className = 'webgl_solarsystem_gui__lighting--ambient';
        lightingContainerSun.className = 'webgl_solarsystem_gui__lighting--sun';
        guiContainer.appendChild(speedContainer);
        guiContainer.appendChild(lightingContainerAmbient);
        guiContainer.appendChild(lightingContainerSun);

        createSlider({
            label:     'Time',
            id:        'millisecondsPerDay',
            minLabel:  'Fast',
            maxLabel:  'Slow',
            min:       5,
            max:       5000,
            default:   1000,
            container: speedContainer
        });

        createSlider({
            label:     'Ambient Light - Red',
            id:        'ambientR',
            min:       0,
            max:       1,
            default:   0.3,
            step:      0.1,
            container: lightingContainerAmbient
        });

        createSlider({
            label:     'Ambient Light - Green',
            id:        'ambientG',
            min:       0,
            max:       1,
            default:   0.3,
            step:      0.1,
            container: lightingContainerAmbient
        });

        createSlider({
            label:     'Ambient Light - Blue',
            id:        'ambientB',
            min:       0,
            max:       1,
            default:   0.3,
            step:      0.1,
            container: lightingContainerAmbient
        });

        createSlider({
            label:     'Sunlight Emission Color - Red',
            id:        'pointR',
            min:       0,
            max:       1,
            default:   0.8,
            step:      0.1,
            container: lightingContainerSun
        });

        createSlider({
            label:     'Sunlight Emission Color - Green',
            id:        'pointG',
            min:       0,
            max:       1,
            default:   0.8,
            step:      0.1,
            container: lightingContainerSun
        });

        createSlider({
            label:     'Sunlight Emission Color - Blue',
            id:        'pointB',
            min:       0,
            max:       1,
            default:   0.8,
            step:      0.1,
            container: lightingContainerSun
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

    return {
        init: createGUI
    }

});