/**
 * Created by xue on 2017/10/30.
 */
$("#nav_main .container").load("header.html");
$("#nav_main").scroll(function(){
    console.log($(this));
    $(this).addClass("animated fadeInDown");
})