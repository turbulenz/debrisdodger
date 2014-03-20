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
        protolib.setClearColor(mathDevice.v3Build(0, 0, 0));

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

        var world = this.world = phys2D.createWorld({});

        var box = this.box = {
            width: 1,
            height: 1,
            position: [viewWidth / 2, viewHeight / 2]
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
