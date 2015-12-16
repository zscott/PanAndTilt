function requestHandler(request, response)
{
    try {
        if ("pan" in request.query) {
            device.send("pan.servo.pos", request.query["pan"])    
        }
        if ("tilt" in request.query) {
            device.send("tilt.servo.pos", request.query["tilt"])
        }
        response.send(200, "OK"); // "200: OK" is standard return message
        
    } catch (ex) {
        response.send(500, ("Agent Error: " + ex)); // Send 500 response if error occured
    }
}

// Register the callback function that will be triggered by incoming HTTP requests

http.onrequest(requestHandler);
