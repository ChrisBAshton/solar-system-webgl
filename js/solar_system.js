define(['astronomical_object'], function (AstronomicalObject) {

    var galaxy = new AstronomicalObject({
        name:          "Galaxy",
        origin:        [0, 0, 0],
        radius:        40000,
        texture:       "textures/galaxy.jpg"
    });

    var theSun = new AstronomicalObject({
        name:          "Sun",
        origin:        [0, 0, 0],
        radius:        432.45,
        axis:          7.25,
        texture:       "textures/sunmap.jpg"
    });

    var mercury = new AstronomicalObject({
        name:          "Mercury",
        orbits:        theSun,
        orbitDistance: 36000,
        radius:        1.516,
        axis:          0,
        texture:       "textures/mercurymap.jpg"
    });

    var venus = new AstronomicalObject({
        name:          "Venus",
        orbits:        theSun,
        orbitDistance: 67000,
        radius:        3.761,
        axis:          177.36,
        texture:       "textures/venusmap.jpg"
    });

    var earth = new AstronomicalObject({
        name:          "Earth",
        orbits:        theSun,
        orbitDistance: 93000,
        radius:        3.959,
        axis:          23.45,
        texture:       "textures/earthmap1k.jpg"
    });

    var mars = new AstronomicalObject({
        name:          "Mars",
        orbits:        theSun,
        orbitDistance: 141000,
        radius:        2.460,
        axis:          25.19,
        texture:       "textures/marsmap1k.jpg"
    });

    var jupiter = new AstronomicalObject({
        name:          "Jupiter",
        orbits:        theSun,
        orbitDistance: 483000,
        radius:        43.441,
        axis:          3.13,
        texture:       "textures/jupitermap.jpg"
    });

    var saturn = new AstronomicalObject({
        name:          "Saturn",
        orbits:        theSun,
        orbitDistance: 886000,
        radius:        36.184,
        axis:          26.73,
        texture:       "textures/saturnmap.jpg"
    });

    var uranus = new AstronomicalObject({
        name:          "Uranus",
        orbits:        theSun,
        orbitDistance: 1782000,
        radius:        15.759,
        axis:          97.77,
        texture:       "textures/uranusmap.jpg"
    });

    var neptune = new AstronomicalObject({
        name:          "Neptune",
        orbits:        theSun,
        orbitDistance: 2794000,
        radius:        15.299,
        axis:          28.32,
        texture:       "textures/neptunemap.jpg"
    });

    var earthsMoon = new AstronomicalObject({
        name:          "Earth's Moon",
        orbits:        earth,
        orbitDistance: 2400,
        radius:        1,
        axis:          1.5
    });

    var jupiterGalileanMoon1 = new AstronomicalObject({
        name:          "Io",
        orbits:        jupiter,
        orbitDistance: 220,
        radius:        1.075,
        axis:          1.5
    });

    var jupiterGalileanMoon2 = new AstronomicalObject({
        name:          "Europa",
        orbits:        jupiter,
        orbitDistance: 420,
        radius:        0.97,
        axis:          1.5
    });

    var jupiterGalileanMoon3 = new AstronomicalObject({
        name:          "Ganymede",
        orbits:        jupiter,
        orbitDistance: 664,
        radius:        1.635,
        axis:          1.5
    });

    var jupiterGalileanMoon4 = new AstronomicalObject({
        name:          "Callisto",
        orbits:        jupiter,
        orbitDistance: 1170,
        radius:        1.4975,
        axis:          1.5
    });

    var solarSystem = [galaxy, theSun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, earthsMoon, jupiterGalileanMoon1, jupiterGalileanMoon2, jupiterGalileanMoon3, jupiterGalileanMoon4];

    return solarSystem;
});