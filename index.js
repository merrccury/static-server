const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {adminMapRouter} = require("./routers/adminRouters/adminRouterMap");
const {privateMapRouter} = require("./routers/privateRouters/privateMapRouter");
const {publicMapRouter} = require("./routers/publicRouters/publicMapRouter");
const {errorHandler, authHandler, adminHandler} = require("./middleware");
const nodeSchedule = require('node-schedule');
const {StationProxy} = require('./proxies/stationProxy')

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:8080', 'http://192.168.100.7:8080', 'http://127.0.0.1:8080',
            'http://localhost:9090', 'http://192.168.100.7:9090', 'http://127.0.0.1:9090',
            'http://localhost:3000', 'http://192.168.100.7:3000', 'http://127.0.0.1:3000', 'https://gspp.space'],
        methods: ["GET", "POST"]
    }
});

require('./socket').initialize(io);

//app.listen(9090, () => console.log('http://localhost:9090/'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
});

app.get('/stations', (req, res) => res.redirect('/'));
app.get('/admin', (req, res) => res.redirect('/admin'));
app.get('/logout', (req, res) => res.redirect('/logout'));


const corsOptions = {
    origin: ['http://localhost:8080', 'http://192.168.100.7:8080', 'http://127.0.0.1:8080',
        'http://localhost:3000', 'http://192.168.100.7:3000', 'http://127.0.0.1:3000', 'https://gspp.space'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(cookieParser())


app.use('/', express.static(__dirname + '/public'));

app.use('/api', publicMapRouter, errorHandler);
app.use(authHandler);
app.use('/api', privateMapRouter, errorHandler);
app.use(adminHandler);
app.use('/api', adminMapRouter, errorHandler);

app.use((req, res) => res.status(404).send('not file'));


server.listen(9090, () => console.log('http://localhost:9090/'));

