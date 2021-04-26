const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database/database');
const userRoute = require('./route/user.route')
const port = 3000;

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', userRoute);

sequelize
    .sync({ force: true })
    .then(() => {
        app.listen(port, () => {
            console.log('Connecting to database as port: ', port)
        });
    })
    .catch(err => {
        console.log(err);
    })


