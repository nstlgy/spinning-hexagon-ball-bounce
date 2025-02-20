// Import Matter.js
const { Engine, Render, Runner, World, Bodies } = Matter;

// Create engine and world
const engine = Engine.create();
const { world } = engine;

// Create renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Create a hexagon (6 sides)
const hexagon = Bodies.polygon(400, 300, 6, 200, {
  isStatic: true,
  render: {
    lineWidth: 5,
  },
});

// Create red ball
const ball = Bodies.circle(400, 300, 30, {
  restitution: 0.9,
  friction: 0.001,
  render: {
    fillStyle: "red",
  },
});

// Add hexagon and ball to world
World.add(world, [hexagon, ball]);

// Give ball initial velocity
Matter.Body.setVelocity(ball, { x: 5, y: -5 });

// Spin the hexagon and keep ball contained
Matter.Events.on(engine, "beforeUpdate", function () {
  Matter.Body.rotate(hexagon, 0.015);

  // Keep ball inside hexagon by checking distance from center
  const distanceFromCenter = Matter.Vector.magnitude(
    Matter.Vector.sub(ball.position, hexagon.position),
  );
  if (distanceFromCenter > 150) {
    const normalVector = Matter.Vector.normalise(
      Matter.Vector.sub(hexagon.position, ball.position),
    );
    Matter.Body.setPosition(
      ball,
      Matter.Vector.add(hexagon.position, Matter.Vector.mult(normalVector, -150)),
    );
    Matter.Body.setVelocity(ball, Matter.Vector.mult(normalVector, -ball.velocity.x));
  }
});
