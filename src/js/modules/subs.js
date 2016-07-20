function parseSrt (text) {
    let timeConst = {
        sec: 1000,
        min: 60,
        hr: 60
    };
    let temp = text.split('\n\n');

    let result = temp.map((el) => {

        let res = {};
        let subtitle = el.split('\n');

        // === Get subtitle's number ===
        res.number = parseInt(subtitle[0]);

        let time = subtitle[1].split(' --> ');

        // === Convert start time to MS ===
        let startTime = time[0].split(':');
        let startTimeSec = parseInt(startTime[2].split(',').join(''));
        let startTimeMin = parseInt(startTime[1]) * timeConst.min * timeConst.sec;
        let startTimeHr = parseInt(startTime[0]) * timeConst.hr * timeConst.min * timeConst.sec;
        startTime = startTimeSec + startTimeMin	+ startTimeHr;
        res.startTime = startTime;

        // === Convert end time to MS ===
        let endTime = time[1].split(':');
        let endTimeSec = parseInt(endTime[2].split(',').join(''));
        let endTimeMin = parseInt(endTime[1]) * timeConst.min * timeConst.sec;
        let endTimeHr = parseInt(endTime[0]) * timeConst.hr * timeConst.min * timeConst.sec;
        endTime = endTimeSec + endTimeMin	+ endTimeHr;
        res.endTime = endTime;

        res.timeLength = endTime - startTime;

        // === Join subtitle content ===
        subtitle.splice(0, 2);
        res.content = subtitle;

        return res;
    });

    return result;
}

function showSub (sub) {
    isSubtitleShown = true;

    video.pause();
    drawSub(sub);
}

function drawSub (sub) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = `${canvasFontSize}px Oranienbaum, serif`;

    let textHeight = (sub.content.length * canvasFontSize) + ((sub.content.length - 1) * canvasLineHeight);
    let topPadding = (canvas.height - textHeight) / 2;

    sub.content.forEach((el, i) => {
        let top = topPadding + (canvasFontSize * i) + (canvasLineHeight * i);
        let left = (canvas.width * 0.1);
        ctx.fillText(el, left, top);
    }); 
}

function hideSub () {
    if (isSubtitleShown) {
        isSubtitleShown = false;
        subtitleIndex++;
        video.play();
    }
    clearTimeout(subTimeout);
    subTimeout = undefined;
    controlElements = [];
    createPauseElement();
}

function stopSubTimeout () {
    if(subTimeout) {
        clearTimeout(subTimeout);
        subTimeout = undefined;
    }
}

function startSubTimeout () {
    subTimeout = setTimeout(hideSub, subtitles[subtitleIndex].timeLength);
}
