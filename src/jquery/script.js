$(document).ready(function(){
  $("#btn").click(function(){
    console.log('clicked');
    $("#test").animate({
      height: 'toggle'
    });
  });
});