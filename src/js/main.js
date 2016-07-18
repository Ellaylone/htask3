const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const fps = 1000 / 60;

const controlBottomPoint = 10;
const controlTopPoint = 60;
const controlTrianglePoint = 35;
const controlRectHeight = 50;
const controlRectWidth = 20;


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
        pixels[i] = pixels[i+1] = pixels[i+2] = v;
        pixels[i] *= value;
        pixels[i+1] *= value;
        pixels[i+2] *= value;
    }

    return imageData;
};

function skratch(ctx) {
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
    video.width = canvas.width = video.offsetWidth;
    video.height = canvas.height = video.offsetHeight;
    let ctx = canvas.getContext('2d');

    let drawInterval = setInterval(() => {
        ctx.drawImage(video, 0, 0, video.width, video.height);
        
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let imageDataFiltered = grayAndGrain(imageData);
        ctx.putImageData(imageDataFiltered, 0, 0);

        ctx.fillStyle = `rgb(255, 255, 255)`;
        let strokeOpacity = Math.random() * (0.8 - 0.2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${strokeOpacity})`;

        let amountOfSkratches = Math.floor(Math.random() * (100 - 0 + 1) + 0);
        amountOfSkratches -= 98;
        if(amountOfSkratches > 0){
            for(let i = 0; i < amountOfSkratches; i++){
                skratch(ctx);
            }
        }
        
        ctx.beginPath();
        ctx.moveTo(10, canvas.height - controlBottomPoint);
        ctx.lineTo(10, canvas.height - controlTopPoint);
        ctx.lineTo(60, canvas.height - controlTrianglePoint);
        ctx.fill();

        ctx.fillRect(80, canvas.height - controlTopPoint, controlRectWidth, controlRectHeight);
        ctx.fillRect(110, canvas.height - controlTopPoint, controlRectWidth, controlRectHeight);
    }, fps);
}, false);

