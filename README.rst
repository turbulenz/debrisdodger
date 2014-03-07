Debris Dodger
=============

.. image:: https://raw.github.com/ianballantyne/debrisdodger/master/img/release_0.1.0_screenshot01.png

+-------------+---------------------------+
| Author      | Ian Ballantyne            |
+-------------+---------------------------+
| Game type   | 2D/3D Space Side Scroller |
+-------------+---------------------------+
| Language    | JavaScript                |
+-------------+---------------------------+
| Technology  | Turbulenz Engine          |
+-------------+---------------------------+
| Target      | HTML5/WebGL               |
+-------------+---------------------------+

Description
-----------

Written as simple introduction to the Turbulenz HTML5 Game Engine.
The game was written live in 40 minutes as a demonstration during the Turbulenz Livestream event: "`An Introduction to the Turbulenz Engine <https://new.livestream.com/turbulenz/turbulenz-engine-intro>`__".
The video of the event can be found on `YouTube <http://www.youtube.com/watch?v=O5wgSe77k2I>`__
The purpose is to demonstrate:

- An simple application based structure for games.
- An introduction to `2D Physics API <http://docs.turbulenz.com/jslibrary_api/physics2ddevice_api.html>`__ and 3D mesh rendering.
- The use of `Protolib API <http://docs.turbulenz.com/protolib/protolib_api.html>`__ as a prototyping library.
- How to use the code and asset building system included with the turbulenz_engine repository.

Requirements
------------

- `Turbulenz Engine <https://github.com/turbulenz/turbulenz_engine>`__ - The Turbulenz open source repository with prerequisites correctly configured.
- Latest Chrome/Firefox.

Build
-----

1) Git clone the `turbulenz_engine <https://github.com/turbulenz/turbulenz_engine>`__ Github repository::

    git clone git://github.com/turbulenz/turbulenz_engine.git

2) Install the `prerequisites <https://github.com/turbulenz/turbulenz_engine/blob/master/README.rst#pre-requisites>`__ and run the commands in the `README <https://github.com/turbulenz/turbulenz_engine/blob/master/README.rst#setup>`__ (Up to and including the 'apps' command).

3) Git clone the Debris Dodger Github repository into the turbulenz_engine/apps directory::

    git clone git://github.com/turbulenz/debrisdodger.git

   Note: If you want to clone to somewhere else, you need to change the TZROOT argument in the `Makefile <Makefile>`__.

4) With the Turbulenz environment activated in the turbulenz_engine root directory run the following command to build the project::

    python manage.py apps apps/debrisdodger

5) Initialise and launch the `Turbulenz local server <https://github.com/turbulenz/turbulenz_local>`__, which is included with turbulenz_engine. With the Turbulenz environment activated in the turbulenz_engine root directory run the following commands to initialize and launch the local server::

    local_server --init

    local_server --launch

6) Navigate to `127.0.0.1 <http://127.0.0.1:8070>`__ in Chrome/Firefox

7) Add the project to the local server by clicking the '+' icon and specifying the game directory with an absolute path. Select the 'use' option. e.g. absolute/path/to/turbulenz_engine/apps/debrisdodger

8) To run the game, click the 'Play' button and select:

+-------------------------+---------------------------------------------------------------+
| app.debug.canvas.html   | Debug build with standard HTML template and debug UI controls |
+-------------------------+---------------------------------------------------------------+
| app.release.canvas.html | Release build with standard HTML template                     |
+-------------------------+---------------------------------------------------------------+
| app.canvas.js           | Release build full window                                     |
+-------------------------+---------------------------------------------------------------+

How to play
-----------

Move the ship to dodge the flying space debris of a passing cargo vessel that has strangely dropped wooden crates into orbit.
Avoid getting hit by the boxes that inflict damage on the ship reducing the health.
Avoid all boxes to survive and win the game!

Controls
--------

* Arrow keys (Up/Down/Left/Right) - Move the ship

(NEW Feature!)

* Touch - Touch an area for the ship to move towards.

Editing
-------

The main application code is located in 'scripts/app.js'.
To add additional APIs to use, edit the 'templates/app.js'.
To add additional assets, edit the 'deps.yaml'.

+------------------+-----------------------+-------------------------+---------------+
| Files modified   | app.canvas.debug.html | app.canvas.release.html | app.canvas.js |
+==================+=======================+=========================+===============+
| deps.yaml        | Rebuild               | Rebuild                 | Rebuild       |
+------------------+-----------------------+-------------------------+---------------+
| assets/*         | Rebuild               | Rebuild                 | Rebuild       |
+------------------+-----------------------+-------------------------+---------------+
| js/*             | Reload                | Reload                  | N\A           |
+------------------+-----------------------+-------------------------+---------------+
| img/*            | Reload                | Reload                  | N\A           |
+------------------+-----------------------+-------------------------+---------------+
| css/*            | Reload                | Reload                  | N\A           |
+------------------+-----------------------+-------------------------+---------------+
| scripts/*.js     | Reload                | Rebuild                 | Rebuild       |
+------------------+-----------------------+-------------------------+---------------+
| templates/*.js   | Rebuild               | Rebuild                 | Rebuild       |
+------------------+-----------------------+-------------------------+---------------+
| templates/*.html | Rebuild               | Rebuild                 | N\A           |
+------------------+-----------------------+-------------------------+---------------+
| cover_art.jpg    | Local                                                           |
+------------------+-----------------------+-------------------------+---------------+
| manifest.yaml    | Local                                                           |
+------------------+-----------------------+-------------------------+---------------+

Key:

+---------+----------------------------------------------------------+
| Local   | Save the settings in the manage tab of the local server  |
+---------+----------------------------------------------------------+
| Reload  | Reload the page in the local server                      |
+---------+----------------------------------------------------------+
| Rebuild | Run the 'manage.py apps' command specified above         |
+---------+----------------------------------------------------------+

Changelog
---------

**2014-03-07 - Tutorial Improvements - 0.2.0**

* Updated to be a clearer example as a tutorial
* Cached sprites to be more efficient with memory
* Mesh position added to the ship
* Updated protolib to 0.2.1, required for pre/post renderer and draw behavior
* Velocity used for 2D physics as a better example
* Remove rigid bodies that have gone off screen
* Various style and layout improvements
* Corrected text rendering and scaling at end of game
* Compatible with SDK 0.28.0

**2013-05-22 - Touch controls - 0.1.1**

* Added touch controls as mentioned during talk.

**2013-05-21 - Initial Release - 0.1.0**

* The code demonstrated in the Turbulenz Livestream event.
* Uses Protolib, prototyping library to render 2D/3D content together.
* Basic features:

  - 2D physics simulation of boxes.
  - Sprite rendering using protolib.draw2DSprite.
  - 3D mesh loading and rendering of a space ship model and texture.
  - Simple keyboard controls.
  - 2D physics debug rendering for dynamic and kinematic objects.
  - Text rendering using Protolib.
  - Ship takes damage to health from collisions with boxes (via physics callback).
  - Basic 'survive' or 'game over' game logic.
* Advanced features:

  - The use of setPreDraw, setPostRendererDraw callbacks to manipulate the 3D viewport (for aligning with the 2D rendering).

License
-------

This project is licensed under the `MIT license <LICENSE>`__

Attribution
-----------

The following files are authored by "Little Killy" and available under `Creative Commons Attribution License 3.0 <http://creativecommons.org/licenses/by/3.0/>`__:

* assets/textures/ship.dae
* assets/textures/ship.png
