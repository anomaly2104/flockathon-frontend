
//var scheme   = "ws://";
//var uri      = scheme + "172.16.44.96:5000" + "/";
//var ws       = new WebSocket(uri);
//ws.onmessage = function(message) {
//    var data = JSON.parse(message.data);
//    $("#chat-text").append("<div class='panel panel-default'><div class='panel-heading'>" + data.handle + "</div><div class='panel-body'>" + data.text + "</div></div>");
//    $("#chat-text").stop().animate({
//        scrollTop: $('#chat-text')[0].scrollHeight
//    }, 800);
//};
//
//$("#input-form").on("submit", function(event) {
//    event.preventDefault();
//    var handle = $("#input-handle")[0].value;
//    var text   = $("#input-text")[0].value;
//    ws.send(JSON.stringify({ handle: handle, text: text }));
//    $("#input-text")[0].value = "";
//});
var namespaceID = "flockster-";

function newDivWithID(id) {
    return $("<div>").attr("id", id);
}

function newDivWithClass(divClass) {
    return $("<div>").addClass(divClass);
}

function showStartChatButton(id) {
    var plusDiv = newDivWithID(id).html("+");
    $("body").append(plusDiv);
}

function showChatPopUp(chatPopUpID) {
    console.log("start chat with popup ID: " + chatPopUpID);
    var chatPopUp = newDivWithID(chatPopUpID);

    var chatPopUpHeader = newDivWithClass(namespaceID + "header");
    var chatPopUpContent = newDivWithClass(namespaceID + "content");
    var chatPopUpFooter = newDivWithClass(namespaceID + "footer");

    chatPopUp.append(chatPopUpHeader, chatPopUpContent, chatPopUpFooter);

    $("body").append(chatPopUp);
}

$(document).ready(function() {
    var startChatID = namespaceID + "start-chat";
    showStartChatButton(startChatID);

    var chatPopUpID = namespaceID + "chat-pop-up";

    $("#" + startChatID).on("click", function() {
        showChatPopUp(chatPopUpID);
    });
});