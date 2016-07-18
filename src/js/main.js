const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const fps = 1000 / 60;

const controlBottomPoint = 10;
const controlTopPoint = 60;
const controlTrianglePoint = 35;
const controlRectHeight = 50;
const controlRectWidth = 20;


function grayscale (imageData) {
    // получаем одномерный массив, описывающий все пиксели изображения
    var pixels = imageData.data;

    // циклически преобразуем массив, изменяя значения красного, зеленого и синего каналов
    for (var i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i+1];
        var b = pixels[i+2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var v = 0.2126*r + 0.7152*g + 0.0722*b;
        pixels[i] = pixels[i+1] = pixels[i+2] = v;
    }

    return imageData;
    
};

video.addEventListener('play', () => {
    video.width = canvas.width = video.offsetWidth;
    video.height = canvas.height = video.offsetHeight;
    let ctx = canvas.getContext('2d');

    let drawInterval = setInterval(() => {
        ctx.drawImage(video, 0, 0, video.width, video.height);
        
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let imageDataFiltered = grayscale(imageData);
        ctx.putImageData(imageDataFiltered, 0, 0);

        ctx.fillStyle = 'white';
        
        ctx.beginPath();
        ctx.moveTo(10, canvas.height - controlBottomPoint);
        ctx.lineTo(10, canvas.height - controlTopPoint);
        ctx.lineTo(60, canvas.height - controlTrianglePoint);
        ctx.fill();

        ctx.fillRect(80, canvas.height - controlTopPoint, controlRectWidth, controlRectHeight);
        ctx.fillRect(110, canvas.height - controlTopPoint, controlRectWidth, controlRectHeight);
    }, fps);
}, false);

