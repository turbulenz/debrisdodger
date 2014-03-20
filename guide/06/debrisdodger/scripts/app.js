// Copyright (c) 2014 Turbulenz Limited
/* global Protolib: false*/
/* global Config: false*/
/* global Physics2DDevice: false*/
/* global Physics2DDebugDraw: false*/

function Application() {}
Application.prototype =
{
    // Use the properties from Config by default, otherwise use these defaults
    protolibConfig: Protolib.extend(true, {
        fps: 60,
        useShadows: true
    },
    Config),

    init: function initFn()
    {
        // Locally referenced variables to use for this function
        var protolib = this.protolib;
        var mathDevice = protolib.getMathDevice();
        var graphicsDevice = protolib.getGraphicsDevice();
        var draw2D = protolib.globals.draw2D;

        // Set the background color to clear during protolib.beginFrame
        protolib.setClearColor(mathDevice.v3Build(0.3, 0.3, 0.3));

        // Initialization code goes here

        var viewWidth = this.viewWidth = 20;
        var viewHeight = this.viewHeight = 10;
        var viewportRectangle = [0, 0, viewWidth, viewHeight];

        var phys2D = this.phys2D = Physics2DDevice.create();
        var phys2DDebug = this.phys2DDebug = Physics2DDebugDraw.create({
            graphicsDevice: graphicsDevice
        });

        phys2DDebug.setPhysics2DViewport(viewportRectangle);
        draw2D.configure({
            viewportRectangle: viewportRectangle,
            scaleMode: 'scale'
        });

        var world = this.world = phys2D.createWorld({
            gravity: [-1, 0]
        });

        var box = this.box = {
            width: 1,
            height: 1,
            position: [viewWidth, viewHeight / 2 + 0.1]
        };
        box.shape = phys2D.createPolygonShape({
            vertices: phys2D.createBoxVertices(box.width, box.height)
        });
        box.rigidBody = phys2D.createRigidBody({
            type: 'dynamic',
            shapes: [
                box.shape
            ],
            position: box.position
        });
        world.addRigidBody(box.rigidBody);
        box.sprite = {
            texture: "textures/crate.jpg",
            position: [box.position[0] - box.width / 2, box.position[1] - box.height / 2],
            width: box.width,
            height: box.height,
            rotation: box.rigidBody.getRotation()
        };

        var ship = this.ship = {
            width: 3,
            height: 1.75,
            position: [ viewWidth / 2, viewHeight / 2]
        };
        ship.shape = phys2D.createPolygonShape({
            vertices: [ [ship.width / 2, 0],
                        [-ship.width / 2, ship.height / 2],
                        [-ship.width / 2, -ship.height / 2],
                        [ship.width / 2, 0] ]
        });
        ship.rigidBody = phys2D.createRigidBody({
            type: 'kinematic',
            shapes: [ship.shape],
            position: ship.position
        });
        world.addRigidBody(ship.rigidBody);

        protolib.setPostDraw(function postDrawFn() {
            if (protolib.globals.config.enablePhysicsDebug)
            {
                phys2DDebug.setScreenViewport(draw2D.getScreenSpaceViewport());
                phys2DDebug.begin();
                phys2DDebug.drawWorld(world);
                phys2DDebug.end();
            }
        });

        this.realTime = 0;
    },

    update: function updateFn()
    {
        var protolib = this.protolib;
        var delta = protolib.time.app.delta;
        var world = this.world;

        if (protolib.beginFrame())
        {
            // Update code goes here
            this.realTime += delta;
            while (world.simulatedTime < this.realTime)
            {
                world.step(1 / 60);
            }

            // Render code goes here
            var box = this.box;
            var sprite = box.sprite;
            var boxRigidBody = box.rigidBody;
            if (boxRigidBody)
            {
                boxRigidBody.getPosition(box.position);
                sprite.position[0] = box.position[0] - box.width / 2;
                sprite.position[1] = box.position[1] - box.height / 2;
                sprite.rotation = boxRigidBody.getRotation();

                protolib.draw2DSprite(sprite);
            }
            protolib.endFrame();
        }
    },

    destroy: function destroyFn()
    {
        var protolib = this.protolib;
        if (protolib)
        {
            // Destruction code goes here
            protolib.destroy();
            this.protolib = null;
        }
    }
};

// Application constructor function
Application.create = function applicationCreateFn(params)
{
    var app = new Application();
    app.protolib = params.protolib;
    if (!app.protolib)
    {
        var console = window.console;
        if (console)
        {
            console.error("Protolib could not be found");
        }
        return null;
    }
    app.init();
    return app;
};
