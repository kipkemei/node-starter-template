import * as admin from "firebase-admin";
const serviceAccount = require("./permissions.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kebsproj.firebaseio.com"
});

export const db = admin.firestore();
