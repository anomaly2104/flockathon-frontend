
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

$(document).ready(function() {
    var namespaceID = "flockster-";

    function log(msg) {
        console.log(msg);
    }

    function loge(msg) {
        log("ERROR: " + msg);
    }

    function logi(msg) {
        log("INFO: " + msg);
    }

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

    function configureChatPopUpFooter(chatPopUpID, chatPopUpFooter) {
        var inputTextArea = $("<textarea>").addClass(namespaceID + "text-input");
        var sendButton = $("<button>").addClass(namespaceID + "send-button").text("Send");
        sendButton.on("click", function() {
            sendMessageClicked(chatPopUpID);
        });
        chatPopUpFooter.append(inputTextArea, sendButton);
    }

    function showChatPopUp(chatPopUpID) {
        logi("start chat with popup ID: " + chatPopUpID);
        var chatPopUp = newDivWithID(chatPopUpID);

        var chatPopUpHeader = newDivWithClass(namespaceID + "header");
        var chatPopUpContent = newDivWithClass(namespaceID + "content");
        var chatPopUpFooter = newDivWithClass(namespaceID + "footer");
        configureChatPopUpFooter(chatPopUpID, chatPopUpFooter);

        chatPopUp.append(chatPopUpHeader, chatPopUpContent, chatPopUpFooter);

        $("body").append(chatPopUp);
    }

    var ws = null;
    var token = null;

    function initWebSocket() {
        var scheme   = "ws://";
        var uri      = scheme + "172.16.44.96:5000" + "/";
        return new WebSocket(uri);
    }

    function startChat(chatPopUpID) {
        logi("Initializing web socket");
        ws = initWebSocket();
        ws.onopen = function() {
            logi("Websocket opened");
        };

        ws.onmessage = function(message) {
            logi("Message received: " + message);
            var data = JSON.parse(message.data);
            logi("Parsed message received: " + data);
            receivedMessage(data);
        };
    }

    function showMessageOnScreen(message) {
        $("#" + chatPopUpID + " .flockster-content").append("<div class='message'><span class='label'>" + message.token + "</span><span class='text'>" + message.text + "</span></div>");
        //$("#chat-text").stop().animate({
        //    scrollTop: $('#chat-text')[0].scrollHeight
        //}, 800);
    }

    function receivedMessage(message) {
        showMessageOnScreen(message);
    }

    function sendMessageClicked(chatPopUpID) {
        var textArea = $("#" + chatPopUpID + " .flockster-footer .flockster-text-input");
        var text = textArea.val();
        logi(text);
        sendMessage(text)
    }

    function sendMessage(text) {
        logi("Sending message: " + text);
        if(ws == null || token == null) {
            //TODO: may be show some warning or error
            loge("Websock or token invalid");
            return;
        }
        var message = { token: token, text: text };
        ws.send(JSON.stringify(message));
        logi("Sent message: " + message);
        showMessageOnScreen(message);
    }

    var startChatButtonID = namespaceID + "start-chat";
    showStartChatButton(startChatButtonID);

    $("#" + startChatButtonID).on("click", function() {
        var chatPopUpID = namespaceID + "chat-pop-up";
        showChatPopUp(chatPopUpID);
        startChat(chatPopUpID);
    });
});