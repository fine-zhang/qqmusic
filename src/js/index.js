
var root = window.player;
var dataList;
var len;
var audio = root.audioManager;
var control;
var timer;
var deg;
var duration = 0;

function getData(url){
    $.ajax({
        type:"GET",
        url:url,
        success:function(data){
            console.log(data);
            console.log(root);
            len = data.length;
            control = new root.controlIndex(len);
            dataList = data;
            root.render(data[0]);
            audio.getAudio(data[0].audio);
            root.pro.renderAllTime(data[0].duration);
            duration = data[0].duration;
            bindEvent();
            bindTouchEvent();
            $(".wrapper ul li").eq(0).css({
                'color':'#00cc66'
            });
        },
        error:function(){
            console.log("error");
        }
    })
}

function bindEvent(){
    $('body').on('play:change',function(e,index){
        audio.getAudio(dataList[index].audio);
        root.render(dataList[index]);
        root.pro.renderAllTime(dataList[index].duration);
        duration = dataList[index].duration;
        $(".wrapper ul li").css({
            'color':'#fff'
        });
        $(".wrapper ul li").eq(index).css({
            'color':'#00cc66'
        });
        if(audio.status == 'play'){
            audio.play();
            root.pro.start();
            rotated(0);
        } else {
            root.pro.upDate(0);
        }
        $('.img-box').attr('data-deg',0);
        $('.img-box').css({
            'transform':'rotateZ(0deg)',
            'transition':'none'
        })
    });

    $('.like').on('click',function(){
        $('.like').toggleClass('liking');
    })

    $('.prev').on('click',function(){
        var i = control.prev();
        $('body').trigger('play:change',i);
        audio.status = 'play';
        audio.play();
        root.pro.start();
        rotated(0);
        $('.play').addClass('playing');
    });

    $('.next').on('click',function(){
        var i = control.next();
        $('body').trigger('play:change',i);
        audio.status = 'play';
        audio.play();
        root.pro.start();
        rotated(0);
        $('.play').addClass('playing');
    })

    $('.play').on('click',function(){
        if(audio.status == 'pause'){
            audio.play();
            root.pro.start();
            deg = $('.img-box').attr('data-deg');
            console.log($('.img-box').attr('data-deg'))
            rotated(deg);
        }else{
            audio.pause();
            root.pro.stop();
            clearInterval(timer);

        }
        $('.play').toggleClass('playing');
    })
    
    $('.list').on('click',function(){
        $('.wrapper ul').show();
    });
    
    $('.wrapper')
    .append('<ul></ul>');

    for(var i = 0; i < len; i++){
        $('.wrapper ul').append('<li>'+ dataList[i].song+' - '+dataList[i].singer +'</li>');
    }
    $('.wrapper ul').append('<div>关闭</div>');
    $('.wrapper ul').prepend('<p>播放列表</p>');
    $('.wrapper ul').css({
        'width':'100%',
        'height':'30%',
        'font-size':'14px',
        'color':'#fff',
        'overflow':'scroll',
        'max-height':'30%',
        'background':'black',
        'position':'absolute',
        'bottom':'0px',
        'display':'none',
        'opacity':'0.8'
    });
    $('.wrapper ul li').css({
        'margin-top':'7px',
        'margin-left':'7px',
        'border-bottom':'1px solid #eee'
    });
    $('.wrapper ul li').eq(0).css({
        'margin-top':'32px'
    });
    $('.wrapper ul p').css({
        'width':'100%',
        'height':'24px',
        'color':'#fff',
        'font-size':'18px',
        'margin-bottom':'7px',
        'margin-top':'7px',
        'text-align':'center',
        'position':'absolute',
        'top':'0px'
    });
    $('.wrapper ul div').css({
        'width':'100%',
        'color':'#fff',
        'margin-bottom':'7px',
        'padding-top':'7px',
        'padding-bottom':'7px',
        'text-align':'center',
        'position':'absolute',
        'bottom':'0px'
    });
    $('.wrapper ul div').on('click',function(){
        $('.wrapper ul').hide();
    });

    $('.wrapper ul li').each(function(index,ele){
        $(ele).on('click',function(){
            audio.getAudio(dataList[index].audio);
            root.render(dataList[index]);
            root.pro.renderAllTime(dataList[index].duration);
            audio.status = 'play';
        $('.play').addClass('playing');
            $(".wrapper ul li").css({
                'color':'#fff'
            });
            $(".wrapper ul li").eq(index).css({
                'color':'#00cc66'
            });
            audio.play();
            root.pro.start();
            rotated(0);
            $('.img-box').attr('data-deg',0);
            $('.img-box').css({
                'transform':'rotateZ(0deg)',
                'transition':'none'
            })
            })
    });

}

function bindTouchEvent () {
    var left = $('.pro-bottom').offset().left;
    var width = $('.pro-bottom').offset().width;
    $('.spot').on('touchstart',function(e){
        root.pro.stop();
    })
    .on('touchmove',function(e){
        var x = e.changedTouches[0].clientX - left;
        var per = x / width;
        if(per >= 0 && per < 1){
            root.pro.upDate(per);
        }
    })
    .on('touchend',function(e){
        var x = e.changedTouches[0].clientX - left;
        var per = x / width;
        var curTime = per * duration;
        if(per >= 0 && per < 1){
            audio.playTo(curTime);
            audio.play();
            root.pro.start(per);
            $('.play').addClass('playing')
        }
    })
}

$(audio.audio).on('ended',function(){
    $('.next').trigger('click');
})

function rotated(deg) {
    clearInterval(timer);
    deg = + deg;
    timer = setInterval(function(){
        deg += 2;
        $('.img-box').attr('data-deg',deg);
        $('.img-box').css({
            'transform':'rotateZ(' + deg + 'deg)',
            'transition':'all 1s ease-out'
        });

    },200);
}



getData("../mock/data.json");