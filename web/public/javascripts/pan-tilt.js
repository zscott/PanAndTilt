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

$("#canvas").mouseup(function(event) {
    mousedown = false;
    $(this).removeClass("mouseDown");
});


$("#canvas").mousemove(function(event) {
    if (mousedown) {
        updatePosition(event);
    }
});

$("#canvas").mousedown(function(event) {
    mousedown = true;
    $(this).addClass("mouseDown");
    updatePosition(event);
});

var updatePosition = function(event) {
    event = event || window.event;
    canvas = $("#canvas")[0];
    pan = event.offsetX / canvas.width * 100;
    tilt = 100 - (event.offsetY / canvas.height * 100);

    $.ajax({
        type: "POST",
        url: '/position',
        dataType: 'json',
        async: true,
        data: {pan: pan, tilt: tilt}
    });
};
