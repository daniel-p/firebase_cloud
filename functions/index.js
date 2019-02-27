const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.createMsg = functions.region('europe-west1').firestore
    .document('messages/{messageId}')
    .onCreate((snapshot, context) => {
        const msg = snapshot.data();
        if (msg.content.startsWith("Hey bot")) {
            return admin.firestore().collection('messages').add(
                {
                    "avatar": null,
                    "content": "Hey " + msg.from.split(" ", 1) + ", awesome you!",
                    "from": "Bot",
                    "img": null,
                    "timestamp": admin.firestore.FieldValue.serverTimestamp()
                }
            );
        }
        return null;
    });
