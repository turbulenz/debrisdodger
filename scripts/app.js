// Copyright (c) 2013 Turbulenz Limited
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
        var protolib = this.protolib;
        var mathDevice = protolib.getMathDevice();
        var graphicsDevice = protolib.getGraphicsDevice();
        var draw2D = protolib.globals.draw2D;

        protolib.setClearColor(mathDevice.v3Build(0.3, 0.3, 0.3));

        // Intialization code goes here

        var viewWidth = this.viewWidth = 20;
        var viewHeight = this.viewHeight = 10;

        var phys2D = this.phys2D = Physics2DDevice.create();
        var phys2DDebug = this.phys2DDebug = Physics2DDebugDraw.create({
            graphicsDevice: graphicsDevice
        });

        phys2DDebug.setPhysics2DViewport([0, 0, viewWidth, viewHeight]);
        draw2D.configure({
            viewportRectangle: [0, 0, viewWidth, viewHeight],
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

        var boxCount = this.boxCount = 30;
        var boxes = this.boxes = [];
        var boxSize;
        var newBox;

        for (var i = 0; i < boxCount; i += 1)
        {
            boxSize = 0.5 + Math.random() * 0.7;
            newBox = {
                width: boxSize,
                height: boxSize,
                position: [ 20 + (i * 10) + Math.random() * 0.7, Math.random() * viewHeight ]
            };
            newBox.shape = phys2D.createPolygonShape({
                vertices: phys2D.createBoxVertices(newBox.width, newBox.height)
            });
            newBox.rigidBody = phys2D.createRigidBody({
                type: 'dynamic',
                shapes: [
                    newBox.shape
                ],
                position: newBox.position,
                rotation: Math.PI * 2 * Math.random()
            });
            world.addRigidBody(newBox.rigidBody);
            boxes[i] = newBox;
        }

        var ship = this.ship = {
            width: 3,
            height: 1.75,
            position: [ viewWidth / 2, viewHeight / 2],
            health: 100
        };
        ship.shape = phys2D.createPolygonShape({
            vertices: [[ship.width / 2, 0], [-ship.width / 2, ship.height / 2], [-ship.width / 2, -ship.height / 2], [ship.width / 2, 0]]
        });
        ship.rigidBody = phys2D.createRigidBody({
            type: 'kinematic',
            shapes: [ship.shape],
            position: ship.position
        });
        world.addRigidBody(ship.rigidBody);

        ship.shape.addEventListener('begin', function (arbiter, shape)
        {
            ship.health -= shape.body.getInertia() * 10;
        });

        this.meshPosition = mathDevice.v3Build(0, 0, 0);
        this.mesh = protolib.loadMesh({
            mesh: "models/ship.dae",
            v3Position: this.meshPosition,
            v3Size: mathDevice.v3Build(3, 3, 3)
        });

        this.meshRotationMatrix = mathDevice.m43BuildIdentity();
        this.meshRotateY = Math.PI * 2 - Math.PI / 2;
        protolib.addWatchVariable({
            title: "Mesh Y Rotate",
            object: this,
            property: "meshRotateY",
            group: "Debug",
            type: protolib.watchTypes.SLIDER,
            options: {
                min: 0,
                max: Math.PI * 2,
                step: Math.PI * 2 / 360
            }
        });
        this.yAxis = mathDevice.v3BuildYAxis();

        protolib.setNearFarPlanes(0.1, 1000);
        protolib.setCameraPosition(mathDevice.v3Build(0, 0, -1));
        protolib.setCameraDirection(mathDevice.v3Build(0, 0, 1));
        protolib.setAmbientLightColor(mathDevice.v3Build(1, 1, 1));

        if (protolib.globals.config.enablePhysicsDebug)
        {
            protolib.setPostDraw(function drawPhys2DDebugFn()
            {
                phys2DDebug.setScreenViewport(draw2D.getScreenSpaceViewport());
                phys2DDebug.begin();
                phys2DDebug.drawWorld(world);
                phys2DDebug.end();
            });
        }

        function setRendererViewportFn()
        {
            var x = draw2D.scissorX;
            var y = draw2D.scissorY;
            var width = draw2D.scissorWidth;
            var height = draw2D.scissorHeight;
            graphicsDevice.setViewport(x, y, width, height);
            graphicsDevice.setScissor(x, y, width, height);
        }
        this.setRendererViewport = setRendererViewportFn;

        function setSpriteViewportFn()
        {
            graphicsDevice.setViewport(0, 0, protolib.width, protolib.height);
        }
        protolib.setPostRendererDraw(setSpriteViewportFn);

        this.realTime = 0;

        this.white = mathDevice.v3Build(1, 1, 1);
    },

    update: function updateFn()
    {
        var protolib = this.protolib;
        var delta = protolib.time.app.delta;
        var world = this.world;
        var mathDevice = protolib.getMathDevice();
        var viewWidth = this.viewWidth;
        var viewHeight = this.viewHeight;

        // Update code goes here

        if (protolib.beginFrame())
        {
            if (this.ship.health < 0)
            {
                protolib.drawText({
                    text: "Game Over!",
                    position: [protolib.width / 2, protolib.height / 2],
                    scale: 4,
                    alignment: protolib.textAlignment.CENTER,
                    v3Color: this.white
                });
                protolib.endFrame();
                return;
            }

            if (this.boxCount <= 0)
            {
                protolib.drawText({
                    text: "You survived!",
                    position: [protolib.width / 2, protolib.height / 2],
                    scale: 4,
                    alignment: protolib.textAlignment.CENTER,
                    v3Color: this.white
                });
                protolib.endFrame();
                return;
            }

            this.realTime += delta;
            while (world.simulatedTime < this.realTime)
            {
                world.step(1 / 60);
            }

            // Render code goes here

            mathDevice.m43SetAxisRotation(this.meshRotationMatrix, this.yAxis, this.meshRotateY);
            this.mesh.setRotationMatrix(this.meshRotationMatrix);

            var shipPosition = this.ship.rigidBody.getPosition();
            if (protolib.isKeyDown(protolib.keyCodes.UP))
            {
                shipPosition[1] -= delta * 3;
            }
            if (protolib.isKeyDown(protolib.keyCodes.DOWN))
            {
                shipPosition[1] += delta * 3;
            }
            if (protolib.isKeyDown(protolib.keyCodes.LEFT))
            {
                shipPosition[0] -= delta * 6;
            }
            if (protolib.isKeyDown(protolib.keyCodes.RIGHT))
            {
                shipPosition[0] += delta * 6;
            }
            shipPosition[0] = protolib.utils.clamp(shipPosition[0], 1, 19);
            shipPosition[1] = protolib.utils.clamp(shipPosition[1], 1, 9);
            shipPosition[0] = protolib.utils.clamp(shipPosition[0], 1, viewWidth - 1);
            shipPosition[1] = protolib.utils.clamp(shipPosition[1], 1, viewHeight - 1);
            this.ship.rigidBody.setPosition(shipPosition);

            this.meshPosition[0] = (-shipPosition[0] * 0.1) + 1;
            this.meshPosition[1] = (-shipPosition[1] * 0.15) + 0.8;
            this.mesh.setPosition(this.meshPosition);

            var box = this.box;
            var boxRigidBody = box.rigidBody;
            if (boxRigidBody)
            {
                boxRigidBody.getPosition(box.position);
                protolib.draw2DSprite({
                    texture: "textures/crate.jpg",
                    position: [box.position[0] - box.width / 2, box.position[1] - box.height / 2],
                    width: box.width,
                    height: box.height,
                    rotation: boxRigidBody.getRotation()
                });
            }

            var boxes = this.boxes;
            for (var i = 0; i < boxes.length; i += 1)
            {
                box = boxes[i];
                boxRigidBody = box.rigidBody;
                boxRigidBody.getPosition(box.position);
                protolib.draw2DSprite({
                    texture: "textures/crate.jpg",
                    position: [box.position[0] - box.width / 2, box.position[1] - box.height / 2],
                    width: box.width,
                    height: box.height,
                    rotation: boxRigidBody.getRotation()
                });

                if (!box.avoided && box.position[0] < -5)
                {
                    this.boxCount -= 1;
                    box.avoided = true;
                }
            }

            protolib.drawText({
                text: "Health: " + Math.floor(this.ship.health) + ", Boxes: " + this.boxCount,
                position: [protolib.width / 2, 20],
                scale: 3,
                alignment: protolib.textAlignment.CENTER,
                v3Color: this.white
            });

            protolib.draw3DSprite({
                texture: "textures/nightsky_gradient.png",
                v3Position: mathDevice.v3Build(0, 0, 1),
                size: 2
            });

            this.setRendererViewport();
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
