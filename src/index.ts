import express from "express";
const mongoose = require("mongoose");
import bodyParser from "body-parser";
require('dotenv/config');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
const postsRoute = require('./routes/posts');
// app.use(express.json());
const serviceAccount = require("./permissions.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kebsproj.firebaseio.com"
});
const db = admin.firestore();
app.use(cors());
app.use(bodyParser.json());


app.post('/create', (req, res) => {
    console.log("AAA");
});

app.post('/api/create', (req, res) => {
    (async () => {
        try {
            console.log("AAA");
            await db.collection('items').doc('/' + req.body.id + '/')
                .create({item: req.body.item});
            return res.status(200).json({foo: "Bar"});
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/read/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('items').doc(req.params.item_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// read all
app.get('/api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('items');
            let response: { id: any; item: any; }[] = [];
            await query.get().then((querySnapshot: { docs: any; }) => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        item: doc.data().item
                    };
                    response.push(selectedItem);
                }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// update
app.put('/api/update/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('items').doc(req.params.item_id);
            await document.update({
                item: req.body.item
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// delete
app.delete('/api/delete/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('items').doc(req.params.item_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.use('/posts', postsRoute);

interface Params {
    a: number,
    b: number
}

interface ParamInterface {
    a: number
    b?: number
    readonly c: number
    d: number
    e: number
    f: number
    g: number
    h: number
    [propName: string]: any;

}

const subtract = (x: Params) =>{
    return x.a - x.b;
};

const add = (a: number, b?: number): number => {
    // return a + b!;
    // return a + (b as number);
    if(b){
        return  a+b;
    }
    return a;
};

app.get('/', (req, resp) => {
    req.ip = "bob";
    add(1);
    let x = {a: 3, b: 6};
    subtract(x);
    resp.send("Hello")
});

mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log("Connected to DB");
});
const userCollection = 'users';

interface User {
    firstName: String,
    lastName: String,
    email: String,
    areaNumber: String,
    department: String,
    id:String,
    contactNumber:String
}

// Create new user
app.post('/users', async (req, res) => {
    console.log("kkkkk")
    try {
        const user: User = {
            firstName: req.body['firstName'],
            lastName: req.body['lastName'],
            email: req.body['email'],
            areaNumber: req.body['areaNumber'],
            department:req.body['department'],
            id:req.body['id'],
            contactNumber:req.body['contactNumber']
        };

        const newDoc = await db.collection(userCollection).add(user);
        res.status(201).send(`Created a new user: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`User should contain firstName, lastName, email, areaNumber, department, id and contactNumber!!!`)
    }
});

//get all users
app.get('/users', async (req, res) => {
    try {
        const userQuerySnapshot = await db.collection(userCollection).get();
        const users: any[] = [];
        userQuerySnapshot.forEach(
            (doc: { id: any; data: () => any; })=>{
                users.push({
                    id: doc.id,
                    data:doc.data()
                });
            }
        );
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

//get a single contact
app.get('/users/:userId', (req,res) => {

    const userId = req.params.userId;
    db.collection(userCollection).doc(userId).get()
        .then((user: { exists: any; id: any; data: () => any; }) => {
            if(!user.exists) throw new Error('User not found');
            res.status(200).json({id:user.id, data:user.data()})})
        .catch((error: any) => res.status(500).send(error));

});

// Update user
app.put('/users/:userId', async (req, res) => {
    await db.collection(userCollection).doc(req.params.userId).set(req.body,{merge:true})
        .then(()=> res.json({id:req.params.userId}))
        .catch((error: any)=> res.status(500).send(error))

});

// Delete a user
app.delete('/users/:userId', (req, res) => {
    db.collection(userCollection).doc(req.params.userId).delete()
        .then(()=>res.status(200).send("Document successfully deleted!"))
        .catch(function (error: any) {
            res.status(500).send(error);
        });
})

app.listen("3000", () => {
    console.log("Started")
});

