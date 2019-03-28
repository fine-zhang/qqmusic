(function($,root){

    var duration = 0;
    var frameId = null;
    var startTime = null;
    var lastper = 0;

    function renderAllTime(time){
        duration = time;
        time = formatTime(time);
        lastper = 0;
        $('.all-time').html(time);
    }

    function formatTime(t){
        t = Math.round(t);
        var m = Math.floor(t / 60);
        var s = t - m * 60;
        if(m < 10){
            m = '0' + m;
        }
        if(s < 10){
            s = '0' + s;
        }
        return m + ':' + s; 

    }

    function upDate (per) {
        var curtime = per * duration;
        curtime = formatTime(curtime);
        $('.cur-time').html(curtime);
        var translateX = (per - 1) * 100 + '%';
        $('.pro-top').css({
            transform:'translateX(' + translateX + ')', 
        })
    }

    function start(p){
        lastper = p === undefined ? lastper : p;
        startTime = new Date().getTime();
        function frame() {
            var curTime = new Date().getTime();
            var per = lastper + (curTime - startTime) / (duration * 1000);
            upDate(per);
            frameId = requestAnimationFrame(frame);
            
        }
        frame();
    }

    function stop() {
        cancelAnimationFrame(frameId);
        var curTime = new Date().getTime();
        var per = (curTime - startTime) / (duration * 1000);
        lastper += per;

    }

    root.pro = {
        renderAllTime:renderAllTime,
        start:start,
        stop:stop,
        upDate:upDate
    }

})(window.Zepto,window.player || (window.player = {}));