let video, canvas, audio;

const controlBottomPoint = 10;
const controlTopPoint = 60;
const controlTrianglePoint = 35;
const controlRectHeight = 50;
const controlRectWidth = 20;
const fps = 1000 / 60;

let videoWidth,
    videoHeight,
    videoSizeRatio;

let controlElements = [];

let reader = new FileReader();
let srt;


function showPlayer () {
    linksEl.classList.add('hidden');
    playerEl.classList.remove('hidden');
}

function initCanvas () {
    canvas = document.querySelector('.player__canvas');
    canvasStartState();

    canvas.addEventListener('click', (e) => {
        let clickedX = e.pageX - e.target.offsetLeft;
        let clickedY = e.pageY - e.target.offsetTop;
        controlElements.some((el) => {
            if (clickedX < el.right && clickedX > el.left && clickedY > el.top && clickedY < el.bottom) {
                if(el.type == 'pause'){
                    if(!isSubtitleShown){
                        video.pause();
                        audio.pause();
                        stopDrawLoop();
                    } else {
                        stopSubTimeout();
                        audio.pause();
                    }
                    controlElements = [];
                    createStartElement();
                } else {
                    if(!isSubtitleShown) {
                        video.play();
                        audio.play();
                        createPauseElement();
                    } else {
                        startSubTimeout();
                        audio.play();
                    }
                }
            }
        });
    }, false);
}

function createStartElement () {
    controlElements = [{
        type: 'start',
        top: 0,
        left: 0,
        right: canvas.width,
        bottom: canvas.width - 20
    }];
}

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
