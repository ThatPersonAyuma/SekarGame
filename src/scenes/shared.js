export const HEIGHT = 1080
export const WIDTH = 1920

export function setupTimeText(obj){
    obj.updateTimer = function() {
        const totalSeconds = obj.registry.get('totalSeconds')+1;
        obj.registry.set('totalSeconds', totalSeconds);

        obj.timerText.setText(calculateTime(totalSeconds));
    }
    var totalSeconds = 0;
    if (!obj.registry.has('totalSeconds')){
        obj.registry.set('totalSeconds', 0);
    }else{
        totalSeconds = obj.registry.get('totalSeconds');
    }
    obj.timerText = obj.add.text(1340, 177, calculateTime(totalSeconds), { 
        font: "124px NFS",
    }).setPadding(0, 0, 36, 0);
    obj.time.addEvent({
        delay: 1000,
        callback: obj.updateTimer,
        callbackScope: obj,
        loop: true
    });
    // obj.add.image(obj.scale.width/2, obj.scale.height/2, 'MainPageTopLayer');
}
function calculateTime(totalSeconds){
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    
    let minStr = minutes < 10 ? "0" + minutes : minutes;
    let secStr = seconds < 10 ? "0" + seconds : seconds;
    return `${minStr}:${secStr}`;
}