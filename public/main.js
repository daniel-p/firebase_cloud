'use strict';

function loadMessages() {
    var query = firebase.firestore().collection('messages').orderBy('timestamp', 'desc').limit(50);
    query.onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === 'removed') {
                deleteMessage(change.doc.id);
            } else {
                var message = change.doc.data();
                displayMessage(change.doc.id, message.timestamp, message.from,
                    message.content, message.img, message.avatar);
            }
        });
    });
}

function deleteMessage(id) {
    var div = document.getElementById(id);
    if (div) {
        div.parentNode.removeChild(div);
    }
}

var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="name"></div>' +
      '<div class="message"></div>' +
    '</div>';

function displayMessage(id, timestamp, from, content, img, avatar) {
    var messageListElement = document.getElementById('messages');
    var div = document.getElementById(id);
    if (!div) {
        var container = document.createElement('div');
        container.innerHTML = MESSAGE_TEMPLATE;
        div = container.firstChild;
        div.setAttribute('id', id);
        div.setAttribute('timestamp', timestamp);
        for (var i = 0; i < messageListElement.children.length; i++) {
            var child = messageListElement.children[i];
            var time = child.getAttribute('timestamp');
            if (time && time > timestamp) {
                break;
            }
        }
        messageListElement.insertBefore(div, child);
    }
    //div.querySelector('.name').textContent = from;
    var messageElement = div.querySelector('.message');
    if (content) {
        messageElement.textContent = content;
        messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    } else if (img) {
        var image = document.createElement('img');
        image.addEventListener('load', function () {
            messageListElement.scrollTop = messageListElement.scrollHeight;
        });
        image.src = img + '&' + new Date().getTime();
        messageElement.innerHTML = '';
        //messageElement.appendChild(image);
    }
    setTimeout(function () { div.classList.add('visible') }, 1);
    messageListElement.scrollTop = messageListElement.scrollHeight;
}
