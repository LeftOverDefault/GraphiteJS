let graphitejs = framework;

graphitejs.init()

graphitejs.setCanvas(document.getElementById("gameCanvas"), { width: 1920, height: 1080 });

const clock = new graphitejs.time.Clock();
const socket = new graphitejs.network.Socket("http://127.0.0.1:3000");

const menu = new graphitejs.audio.Sound("./audio/fx/start-level.wav");

socket.on("message", (data) => {
    console.log("[ NETWORK ][ DATA ]", data);
});

const mouseHandler = new graphitejs.mouse.Mouse(graphitejs.canvas);
const keyboarder = new graphitejs.keyboard.Keyboarder(graphitejs.canvas);

const surface = new graphitejs.surface.Surface({ width: 100, height: 100});
const color = new graphitejs.color.Color(255, 0, 0);
const rect = surface.getRect({ center: { x: 1920 / 2, y: 1080 / 2 } });

surface.fill(color);

menu.play();

function loop() {
    graphitejs.context.clearRect(0, 0, graphitejs.canvas.width, graphitejs.canvas.height);
    
    surface.draw(graphitejs.context, rect);

    if (keyboarder.isPressed("k")) {
        menu.play();
    }
    
    clock.tick(60);
    
    requestAnimationFrame(loop);
}

loop()



























// graphite.init();

// graphite.setCanvas(document.getElementById("gameCanvas"));

// const surf = new graphite.surface.Surface({ width: 100, height: 100})

// // surf.translate(graphite.height / 2, (-graphite.width / 2) + surf.width);
// surf.rotate(0);

// const rect = surf.getRect({ center: { x: 100, y: 100 } });

// const mouse = new graphite.Mouse(graphite.canvas);

// const keyboarder = new graphite.keyboard.Keyboarder();

// // console.log(surf);
// // console.log(rect);

// surf.image.src = "./test.png"

// function loop() {
//     graphite.ctx.clearRect(0, 0, graphite.width, graphite.height);

//     if (keyboarder.isPressed("w") === true) {
//         rect.y -= 1;
//     } else if (keyboarder.isPressed("s") === true) {
//         rect.y += 1;
//     }
//     if (keyboarder.isPressed("a") === true) {
//         rect.x -= 1;
//     } else if (keyboarder.isPressed("d") === true) {
//         rect.x += 1;
//     }

//     surf.draw(graphite.getCtx(), { rect: rect });

//     requestAnimationFrame(loop)
// }

// loop()
