$("#panTiltForm").submit(function(e) {
    $.ajax({
        type: "POST",
        url: '/position',
        data: $("#panTiltForm").serialize(),
        success: function(data) {
        }
    });
    e.preventDefault();
});

var mousedown = false;

$("#canvas").mousedown(function(event) {
    mousedown = true;
    $(this).addClass("mouseDown");
    updatePosition(event);
});

$("#canvas").bind("touchstart", function(event) {
    mousedown = true;
    event.preventDefault();
});

$("#canvas").mouseup(function(event) {
    mousedown = false;
    $(this).removeClass("mouseDown");
});

$("#canvas").bind("touchend", function(event) {
   mousedown = false;
    event.preventDefault();
});

var getPosition = function(event, canvas) {
  var x, y;
    if (event.pageX != undefined && event.pageY != undefined) {
        x = event.pageX;
        y = event.pageY;
    } else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
    }
    return { x: x - canvas.offsetLeft, y: y - canvas.offsetTop };
};

$("#canvas").bind("touchmove", function(event) {
   if (mousedown) {
       var touchobj = event.changedTouches[0];
       var canvas = $("#canvas")[0];
       var position = getPosition(event, canvas);
       updatePosition(position.x, position.y);
       event.preventDefault();
   }
});


$("#canvas").mousemove(function(event) {
    if (mousedown) {
        updatePosition(event.offsetX, event.offsetY);
    }
});

var updatePosition = function(x, y) {
    event = event || window.event;
    canvas = $("#canvas")[0];
    pan = x / canvas.width * 100;
    tilt = 100 - (y / canvas.height * 100);

    $.ajax({
        type: "POST",
        url: '/position',
        dataType: 'json',
        async: true,
        data: {pan: pan, tilt: tilt}
    });
};
