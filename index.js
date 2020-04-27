const express = require("express");
const Joi = require('@hapi/joi');

var mysql      = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Qwerty12",
    database: "sampledb"
});

db.connect((err)=>{
    if (err) {
        throw err
    }
    console.log(" Mysql connected !");
});
const  app = express();
app.use(express.json());

const  courses = [
    {id: 1, name: "Jack"}
];

app.get('/', (req, res) => {
    res.send("Hello World  !!");
});

app.get('/createdb', (req, res) => {
    res.send("Create DE");
});


app.get('/api/courses', (req, res) => {
    res.send([1,2,3, 4]);
});

app.get('/api/courses/:id', (req, res) => {
    // res.send(req.params);
    // res.send(req.query);
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if (!course) res.status(404).send("Item not found")
    res.send(req.params.id)
});

app.post("/api/courses", (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    console.log(course);
    res.send(course)
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port} ...`));

