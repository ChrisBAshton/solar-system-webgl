# CS32310 - Advanced Computer Graphics assignment

The assignment, worth 50% of the module, requires visualising a 3D animated solar system in WebGL.

# Instructions

Run:

```bash

cd assignment

python -m SimpleHTTPServer
```

Then go to http://localhost:8000/source/ to see the solar system, or http://localhost:8000/api-docs/ to see the documentation.

# Maintenance

I use Grunt to make sure my JavaScript is linted and to generate my documentation. To replicate this on your machine:

* download and install Node.js, and then Grunt
* cd into this directory
* Install the node modules (`npm install`)
* You can now run `grunt` to run the automated processes.

# Acknowledgements

Orbit distances taken from:

http://www.northern-stars.com/solar_system_distance_scal.htm

Orbit periods and rotation periods taken from:

http://www.windows2universe.org/our_solar_system/planets_table.html

Planet sizes taken from:

http://www.universetoday.com/36649/planets-in-order-of-size/

Planet axes taken from:

http://www.astronomynotes.com/tables/tablesb.htm

Jupiter's Galilean moons info taken from:

http://www.daviddarling.info/encyclopedia/J/Jupitermoons.html

Saturn's rings info taken from:

http://cseligman.com/text/planets/saturnrings.htm

Planet texture maps were taken from:

http://planetpixelemporium.com/

Lots of code taken from/inspired by various lessons at:

http://learningwebgl.com/blog/?page_id=1217

Phong shading very much taken from:

http://learningwebgl.com/blog/?p=1658