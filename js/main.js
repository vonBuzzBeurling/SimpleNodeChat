$(function () {
    var net = require('net');

    var client = new net.Socket();

    var localUser = prompt("Username");

    var tabMsg = [];

    $("#btConnect").on("click", function () {
        var ip = $("#inputIp").val(),
            port = $("#inputPort").val();

        client.connect(port, ip, function () {});

    });

    $("#btSend").on("click", send);
    $("#inputMessage").on("keypress", function (e) {
        if (e.which == 13) {
            prepareSend();
        }
    });

    function prepareSend() {
        var msgToSend = $("#inputMessage").val();
        console.log(msgToSend);
        if (msgToSend != "" && msgToSend != ".") {
            send(msgToSend);
            $("#inputMessage").val("");
        }
    }

    function send(message, type) {
        if (type == undefined) {
            type = "normal";
        }
        var package = {
            'user': localUser,
            'message': message,
            'type': type
        };

        client.write(JSON.stringify(package));
    }

    function postMsg(username, message, type) {
        if (type == undefined) {
            type = "normal";
        }
        var date = new Date(),
            heure = date.getHours(),
            minute = date.getMinutes();

        var tempContainer = $('<div></div>'),
            tempTime = $('<span>' + heure + ':' + minute + ' </span>'),
            tempUser = $('<span>' + username + ' - </span>'),
            tempContent = $('<span>' + message + '</span>');

        switch (type) {
        case "normal":
            tempContainer.addClass("msgContainer");
            tempTime.addClass("msgTime");
            tempUser.addClass("msgUser");
            tempContent.addClass("msgContent");
            break;
        case "info":
            tempContainer.addClass("info");
            tempTime.addClass("info");
            tempUser.addClass("info");
            tempContent.addClass("info");
            break;
        case "error":
            tempContainer.addClass("error");
            tempTime.addClass("error");
            tempUser.addClass("error");
            tempContent.addClass("error");
            break;
        }

        $("#textBoxWrapper").append(tempContainer);
        tempContainer.append(tempTime).append(tempUser).append(tempContent);
        tabMsg.push(tempContainer);
        if (tabMsg.length >= 16) {
            tabMsg[0].remove();
            tabMsg.splice(0, 1);

        }
    }

    client.on("data", function (data) {
        console.log(data.toString());
        var msg = JSON.parse(data);
        postMsg(msg.user, msg.message, msg.type);
    });

    client.on("error", function (e) {
        postMsg("Client", e, "error");
    });

});

window.onbeforeunload = function () {
    send("Good Bye", "serverLog")
    client.destroy();
    return
};