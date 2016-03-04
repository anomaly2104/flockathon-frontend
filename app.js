$(document).ready(function() {
    var namespaceID = "flockster-";
    var host = "172.16.44.96:5000";

    function log(msg) {
        console.log(msg);
    }

    function loge(msg) {
        log(msg);
    }

    function logi(msg) {
        log(msg);
    }

    function newDivWithID(id) {
        return $("<div>").attr("id", id);
    }

    function newDivWithClass(divClass) {
        return $("<div>").addClass(divClass);
    }

    function showStartChatButton(id) {
        var plusDiv = newDivWithID(id).html("Support chat");
        $("body").append(plusDiv);
    }
    

    function configureChatPopUpHeader(chatPopUpID, chatPopUpHeader) {
        var closeButton = $("<button>").addClass(namespaceID + "close-button").text("X");
        chatPopUpHeader.append(closeButton);

        closeButton.on("click", function() {
            toggleChat(chatPopUpID);
        });
    }

    function toggleChat(chatPopUpID) {
        var headerSelector = "#" + chatPopUpID + " .flockster-header";
        var contentSelector = "#" + chatPopUpID + " .flockster-content";
        var footerSelector = "#" + chatPopUpID + " .flockster-footer";

        logi(contentSelector);
        $(headerSelector).toggleClass("minimized");
        $(headerSelector).removeClass("should-blink");
        $(contentSelector).toggleClass("minimized");
        $(footerSelector).toggleClass("minimized");
    }

    function configureChatPopUpFooter(chatPopUpID, chatPopUpFooter) {
        var inputTextArea = $("<textarea>").addClass(namespaceID + "text-input").attr("placeholder", "Enter your message here.");
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
        configureChatPopUpHeader(chatPopUpID, chatPopUpHeader);
        configureChatPopUpFooter(chatPopUpID, chatPopUpFooter);
        
        chatPopUp.append(chatPopUpHeader, chatPopUpContent, chatPopUpFooter);

        $("body").append(chatPopUp);
        setSendMessageOnPressingEnter(chatPopUpID);
    }

    var ws = null;
    var token = null;

    function newToken() {
        return "user" + Math.floor((Math.random() * 1000) + 1);
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    function assignToken() {
        logi("Assigning token");
        token = getCookie("token");
        if (token == "") {
            token = newToken();
            setCookie("token", token, 365);
        }
        logi("Token assigned: " + token);
    }

    function initWebSocket() {
        var scheme   = "ws://";
        var uri      = scheme + host + "/";
        return new WebSocket(uri);
    }

    function startChat(chatPopUpID) {
        assignToken();
        logi("Initializing web socket");
        ws = initWebSocket();
        ws.onopen = function() {
            logi("Websocket opened");
            sendToken(chatPopUpID);
        };

        ws.onmessage = function(message) {
            var data = JSON.parse(message.data);
            logi("Parsed message received: ");
            logi(data);
            receivedMessage(chatPopUpID, data);
        };
    }

    function sendToken(chatPopUpID) {
        logi("Sending token: " + token);
        writeToWebSocket({handle: token});
    }


    function showMessageOnScreen(chatPopUpID, message, direction) {
        logi("Showing message on screen, direction: " + direction);
        logi(message);

        var label = message.handle;
        var text = message.text;

        if(label == token) {
            label = "You";
        }

        var directionClass = "outgoing";
        if(direction === "incoming") {
            directionClass = "incoming";
        }
        var contentSelector = "#" + chatPopUpID + " .flockster-content";
        $(contentSelector).append(
            "<div class='message " + directionClass +"'><span class='text'>" + text + "</span></div>");
        $(contentSelector).stop().animate({
            scrollTop: $(contentSelector)[0].scrollHeight
        }, 800);
    }

    function receivedMessage(chatPopUpID, message) {
        $("#"+chatPopUpID+" .flockster-header.minimized").addClass("should-blink");
        showMessageOnScreen(chatPopUpID, message, "incoming");
    }

    function sendMessageClicked(chatPopUpID) {
        var textArea = $("#" + chatPopUpID + " .flockster-footer .flockster-text-input");
        var text = textArea.val().trim();
        if(text == "") {
            return;
        }
        logi(text);
        sendMessage(chatPopUpID, text)
        textArea.val("");
    }

    function sendMessage(chatPopUpID, text) {
        var message = { handle: token, text: text };
        logi("Sending message: ");
        logi(message);
        writeToWebSocket(message);
        showMessageOnScreen(chatPopUpID, message, "outgoing");
    }

    function writeToWebSocket(JSONData) {
        if(ws == null || token == null) {
            //TODO: may be show some warning or error
            loge("Could not write. Websocket or token invalid");
            return;
        }
        ws.send(JSON.stringify(JSONData));
        logi("Written to websocket: ");
        logi(JSONData);
    }

    function setSendMessageOnPressingEnter(chatPopUpID) {
        logi($(".flockster-footer textarea"));
        $(".flockster-footer textarea").keyup(function(event) {
            logi(event.keyCode);
            if(event.keyCode == 13 && !event.altKey && !event.shiftKey) {
                sendMessageClicked(chatPopUpID);
            }
        });
    }

    var startChatButtonID = namespaceID + "start-chat";
    showStartChatButton(startChatButtonID);

    $("#" + startChatButtonID).on("click", function() {
        var chatPopUpID = namespaceID + "chat-pop-up";
        showChatPopUp(chatPopUpID);
        startChat(chatPopUpID);
    });

    function timeoutBlink() {
        $(".flockster-header.minimized.should-blink").toggleClass("blink");
        setTimeout(function(){
            timeoutBlink();
        }, 1000);
    }
    timeoutBlink();

});