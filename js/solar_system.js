define(['astronomical_object'], function (AstronomicalObject) {

    var galaxy = new AstronomicalObject({
        name:          "Galaxy",
        origin:        [0, 0, 0],
        radius:        6000000,
        texture:       "textures/galaxy.jpg"
    });

    var theSun = new AstronomicalObject({
        name:          "Sun",
        origin:        [0, 0, 0],
        radius:        432500,
        axis:          7.25,
        texture:       "textures/sunmap.jpg"
    });

    var mercury = new AstronomicalObject({
        name:          "Mercury",
        orbits:        theSun,
        orbitDistance: 36000000,
        radius:        1516,
        axis:          0,
        texture:       "textures/mercurymap.jpg"
    });

    var venus = new AstronomicalObject({
        name:          "Venus",
        orbits:        theSun,
        orbitDistance: 67000000,
        radius:        3761,
        axis:          177.36,
        texture:       "textures/venusmap.jpg"
    });

    var earth = new AstronomicalObject({
        name:          "Earth",
        orbits:        theSun,
        orbitDistance: 93000000,
        radius:        3959,
        axis:          23.45,
        texture:       "textures/earthmap1k.jpg"
    });

    var mars = new AstronomicalObject({
        name:          "Mars",
        orbits:        theSun,
        orbitDistance: 141000000,
        radius:        2460,
        axis:          25.19,
        texture:       "textures/marsmap1k.jpg"
    });

    var jupiter = new AstronomicalObject({
        name:          "Jupiter",
        orbits:        theSun,
        orbitDistance: 483000000,
        radius:        43441,
        axis:          3.13,
        texture:       "textures/jupitermap.jpg"
    });

    var saturn = new AstronomicalObject({
        name:          "Saturn",
        orbits:        theSun,
        orbitDistance: 886000000,
        radius:        36184,
        axis:          26.73,
        texture:       "textures/saturnmap.jpg"
    });

    var uranus = new AstronomicalObject({
        name:          "Uranus",
        orbits:        theSun,
        orbitDistance: 1782000000,
        radius:        15759,
        axis:          97.77,
        texture:       "textures/uranusmap.jpg"
    });

    var neptune = new AstronomicalObject({
        name:          "Neptune",
        orbits:        theSun,
        orbitDistance: 2794000000,
        radius:        15299,
        axis:          28.32,
        texture:       "textures/neptunemap.jpg"
    });

    var earthsMoon = new AstronomicalObject({
        name:          "Earth's Moon",
        orbits:        earth,
        orbitDistance: 2400000,
        radius:        1000,
        axis:          1.5
    });

    var jupiterGalileanMoon1 = new AstronomicalObject({
        name:          "Io",
        orbits:        jupiter,
        orbitDistance: 220000,
        radius:        1075,
        axis:          0.050
    });

    var jupiterGalileanMoon2 = new AstronomicalObject({
        name:          "Europa",
        orbits:        jupiter,
        orbitDistance: 420000,
        radius:        970,
        axis:          0.471
    });

    var jupiterGalileanMoon3 = new AstronomicalObject({
        name:          "Ganymede",
        orbits:        jupiter,
        orbitDistance: 664000,
        radius:        1635,
        axis:          0.204
    });

    var jupiterGalileanMoon4 = new AstronomicalObject({
        name:          "Callisto",
        orbits:        jupiter,
        orbitDistance: 1170000,
        radius:        1497.5,
        axis:          0.205
    });

    var solarSystem = [galaxy, theSun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, earthsMoon, jupiterGalileanMoon1, jupiterGalileanMoon2, jupiterGalileanMoon3, jupiterGalileanMoon4];

    return solarSystem;
});