const video = document.querySelector('.player__video');
const canvas = document.querySelector('.player__canvas');
const audio = document.querySelector('.player__audio');

const controlBottomPoint = 10;
const controlTopPoint = 60;
const controlTrianglePoint = 35;
const controlRectHeight = 50;
const controlRectWidth = 20;
const fps = 1000 / 60;

let controlElements = [];

document.addEventListener('DOMContentLoaded', () => {
    canvasStartState();
    canvas.addEventListener('click', (e) => {
        let clickedX = e.pageX - e.target.offsetLeft;
        let clickedY = e.pageY - e.target.offsetTop;
        controlElements.some((el) => {
            if (clickedX < el.right && clickedX > el.left && clickedY > el.top && clickedY < el.bottom) {
                if(el.type == 'pause'){
                    video.pause();
                    audio.pause();
                    stopDrawLoop();
                } else {
                    video.play();
                    audio.play();
                    createPauseElement();
                }
            }
        });
    });
}, false);

function createPauseElement () {
    controlElements = [{
        type: 'pause',
        top: 0,
        left: 0,
        right: canvas.width,
        bottom: canvas.width - 20
    }];
}

function canvasStartState () {
    video.width = canvas.width = video.offsetWidth;
    video.height = canvas.height = video.offsetHeight;
    let ctx = canvas.getContext('2d');
    drawBackground(ctx, 'black');
    drawCenterPlayButton(ctx, 'white');
}

function grayAndGrain (imageData) {
    // получаем одномерный массив, описывающий все пиксели изображения
    let pixels = imageData.data;
    let value;

    // циклически преобразуем массив, изменяя значения красного, зеленого и синего каналов
    for (let i = 0; i < pixels.length; i += 4) {
        value = Math.random() + 1;
        let r = pixels[i];
        let g = pixels[i+1];
        let b = pixels[i+2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        let v = 0.2126*r + 0.7152*g + 0.0722*b;

        pixels[i] = pixels[i+1] = pixels[i+2] = v * value;
    }

    return imageData;
};

function drawBackground (ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}



function drawCenterPlayButton (ctx, color) {
    ctx.fillStyle = `${color}`;
    let triangle = {
        width: 35,
        height: 50
    };

    triangle.points = {
        top: {
            x: (canvas.width - triangle.width) / 2,
            y: (canvas.height - triangle.height) / 2
        },
        bottom: {
            x: (canvas.width - triangle.width) / 2,
            y: (canvas.height + triangle.height) / 2
        },
        right: {
            x: (canvas.width + triangle.width) / 2,
            y: canvas.height / 2
        },
    };

    controlElements.push({
        type: 'start',
        top: triangle.points.top.y,
        left: triangle.points.top.x,
        bottom: triangle.points.bottom.y,
        right: triangle.points.right.x
    });

    ctx.beginPath();
    ctx.moveTo(triangle.points.top.x, triangle.points.top.y);
    ctx.lineTo(triangle.points.bottom.x, triangle.points.bottom.y);
    ctx.lineTo(triangle.points.right.x, triangle.points.right.y);
    ctx.fill();
}

function drawControls (ctx, color) {
    ctx.fillStyle = `${color}`;

    let triangle = {
    }
    ctx.fillRect(80, canvas.height - controlTopPoint, controlRectWidth, controlRectHeight);
    ctx.fillRect(110, canvas.height - controlTopPoint, controlRectWidth, controlRectHeight);
}

function drawSkratches (ctx) {
    let strokeOpacity = Math.random() * (0.8 - 0.2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${strokeOpacity})`;

    let amountOfSkratches = Math.floor(Math.random() * (100 - 0 + 1));
    amountOfSkratches -= 98;
    if(amountOfSkratches > 0){
        for(let i = 0; i < amountOfSkratches; i++){
            skratch(ctx);
        }
    }
}

function skratch (ctx) {
    ctx.beginPath();
    let startPoint = {
        x: Math.floor(Math.random() * (canvas.width - 1)),
        y: Math.floor(Math.random() * (canvas.height - 1))
    };

    let endPoint = {
        x: startPoint.x,
        y: Math.floor(Math.random() * (canvas.height - startPoint.y))
    };

    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
}

video.addEventListener('play', () => {
    startDrawLoop();
}, false);

let loopId;

function startDrawLoop () {
    console.log('start draw');
    if(!loopId){
        loopId = setInterval(drawLoop, fps);
    }
}

function stopDrawLoop () {
    console.log('stop draw');
    if(loopId) {
        clearInterval(loopId);
        loopId = undefined;
    }
}

function drawLoop () {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log('draw');
    ctx.drawImage(video, 0, 0, video.width, video.height);
    
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let imageDataFiltered = grayAndGrain(imageData);
    ctx.putImageData(imageDataFiltered, 0, 0);

    drawSkratches(ctx);
}

