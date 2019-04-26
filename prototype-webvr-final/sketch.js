let world;
let fishContainer;
let octopus;
let scaleChange;
let particles = [];

let bubbleSound;
let playSound = false;


function preload() {
  bubbleSound = loadSound('bubble.wav');
}


function setup() {
  // no canvas needed
  noCanvas();

  // construct the A-Frame world
  // this function requires a reference to the ID of the 'a-scene' tag in our HTML document
  world = new World('VRScene');

  let basePlane = new Plane({
    x: 0,
    y: 0,
    z: 0,
    width: 100,
    height: 100,
    asset: 'sea',
    rotationX: -90,
    repeatX: 100,
    repeatY: 100
  });

  world.add(basePlane);

  let volcano = new Cone({
    x: 3,
    y: 1,
    z: -10,
    height: 12,
    radiusBottom: 5,
    radiusTop: 1,
    asset: 'volcano'
  });
  world.add(volcano);

  fishContainer = new Container3D({
    x: 0,
    y: 1,
    z: -5
  });
  world.add(fishContainer);

  let fish1 = new OBJ({
    asset: 'fish1_obj',
    mtl: 'fish1_mtl',
    x: -5,
    y: 5,
    z: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1
  });
  fishContainer.addChild(fish1);

  let fish2 = new OBJ({
    asset: 'fish1_obj',
    mtl: 'fish1_mtl',
    x: 5,
    y: 5,
    z: 0,
    rotationY: 180,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1
  });
  fishContainer.addChild(fish2);

  octopus = new OBJ({
    asset: 'octopus_obj',
    mtl: 'octopus_mtl',
    x: 2,
    y: 0.5,
    z: 2,
    scaleX: 0.1,
    scaleY: 0.1,
    scaleZ: 0.1
  });
  world.add(octopus);

  scaleChange = 0.001;

  let textures = ['rock1', 'rock2'];

  for (let i = 0; i < 200; i++) {
    let x = random(-40, 40);
    let z = random(-40, 40);

    let t = textures[int(random(textures.length))];

    let rock = new Box({
      x: x,
      y: 1,
      z: z,
      asset: t,
      scaleX: random(0.4, 0.6),
      scaleY: random(0.4, 0.6),
      scaleZ: random(0.4, 0.6),
      clickFunction: function(theBox) {
        world.slideToObject(theBox, 2000);
      }
    });

    world.add(rock);
  }

  let teleportRing = new Ring({
    x: 10,
    y: 1,
    z: -40,
    asset: 'rock1',
    scaleX: 10,
    scaleY: 10,
    scaleZ: 10,
    clickFunction: function(theRing) {
      world.teleportToObject(theRing);
    }
  });

  world.add(teleportRing);

}



function draw() {
  fishContainer.spinY(0.5);

  let octopusScale = octopus.getScale();

  if (octopusScale.x > 0.15 || octopusScale.x < 0.05) {
    scaleChange *= -1;
  };

  octopus.setScale(octopusScale.x + scaleChange, octopusScale.y + scaleChange, octopusScale.z + scaleChange);



  let temp = new Particle(0, 0.2, -5);
  particles.push(temp);

  for (let i = 0; i < particles.length; i++) {
    let result = particles[i].move();
    if (result == "gone") {
      particles.splice(i, 1);
      i -= 1;
    }
  };

  let userPosition = world.getUserPosition();
  if (userPosition.z < 1 && userPosition.z > -8 && playSound == false) {
    bubbleSound.play();
    playSound = true;
    // console.log(playSound);
  } else if (playSound == true && (userPosition.z >= 1 || userPosition.z <= -8)) {
    bubbleSound.stop();
    playSound = false;
  }

}


function Particle(x, y, z) {
  this.myBubble = new Sphere({
    x: x,
    y: y,
    z: z,
    red: 0,
    green: random(255),
    blue: 255,
    radius: 0.5
  });
  world.add(this.myBubble);

  this.xOffset = random(500);
  this.zOffset = random(2000, 3000);

  this.move = function() {
    let yMove = 0.06;
    let xMove = map(noise(this.xOffset), 0, 1, -0.05, 0.05);
    let zMove = map(noise(this.zOffset), 0, 1, -0.05, 0.05);

    this.xOffset += 0.01;
    this.zOffset += 0.01;

    this.myBubble.nudge(xMove, yMove, zMove);

    let bubbleScale = this.myBubble.getScale();
    this.myBubble.setScale(
      bubbleScale.x - 0.005,
      bubbleScale.y - 0.005,
      bubbleScale.z - 0.005
    );

    if (bubbleScale.x <= 0) {
      world.remove(this.myBubble);
      return "gone";
    } else {
      return "ok";
    }
  }
}