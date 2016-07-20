// делаем картинку черно белой и накладываем шум
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

function drawBackground (color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCenterPlayButton (color) {
    ctx.fillStyle = `${color}`;
    let triangle = {
        width: 35,
        height: 50
    };

    // координаты вершин отцентрированного треугольника
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

function drawSkratches () {
    let strokeOpacity = Math.random() * (0.8 - 0.2);
    // белого цвета с рандомной прозрачностью
    ctx.strokeStyle = `rgba(255, 255, 255, ${strokeOpacity})`;

    // рисуем царапины только если выпадает 99/100
    let amountOfSkratches = Math.floor(Math.random() * (100 - 0 + 1));
    amountOfSkratches -= 98;
    if(amountOfSkratches > 0){
        for(let i = 0; i < amountOfSkratches; i++){
            skratch();
        }
    }
}

function skratch () {
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

function startDrawLoop () {
    if(!loopId && !isSubtitleShown){
        loopId = setInterval(drawLoop, fps);
    } else if (typeof subtitles[subtitleIndex] !== 'undefined') {
        subTimeout = setTimeout(hideSub, subtitles[subtitleIndex].timeLength / 2);
    }
}

function stopDrawLoop () {
    if(loopId) {
        clearInterval(loopId);
        loopId = undefined;
    }
}

function drawLoop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, video.width, video.height);
    
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let imageDataFiltered = grayAndGrain(imageData);
    ctx.putImageData(imageDataFiltered, 0, 0);

    drawSkratches();
}
