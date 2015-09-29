var net = require('net');

var tabClient = [];
var serverMsg = {
    'user': 'Server',
    'message': '',
    'type': 'info'
};

var server = net.createServer(function (socket) {

    console.log("Connection from " + socket.remoteAddress);
    serverMsg.message = 'Successfully connected';
    socket.write(JSON.stringify(serverMsg));

    tabClient.push(socket);

    socket.on('data', function (data) {
        var newData = String(data);
        var dataJson = JSON.parse(newData);

        if (dataJson.type == "serverLog") {
            console.log("Message from: " + dataJson.user + " - " + dataJson.message);
        } else {
            for (var i = 0; i < tabClient.length; i++) {
                tabClient[i].write(JSON.stringify(dataJson));
            }
        }
    });

    socket.on('error', function (exc) {
        if (exc.code == "ECONNRESET") {
            console.log("Connection Lost/reset")
        } else {
            console.log("ignoring exception: " + exc);
        }
    });

    socket.on('end', function () {
        tabClient.splice(tabClient.indexOf(socket), 1);
        tabClient.forEach(function () {
            serverMsg.message = 'Someon left chat';
            socket.write(serverMsg);
        });
    })

});

server.listen(7000, "localhost");

console.log("TCP server listening on port 7000 at localhost.");

server.on("error", function (err) {
    if (err) throw err;
});