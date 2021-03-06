const express = require('express')
//const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const logger = require('volleyball')
const serveStatic = require('serve-static')

app.use(logger)

//app.use('/static', express.static(__dirname + '/dist'))
app.use(serveStatic(__dirname + "/dist"));
// Маршруты
// app.get('/', function (request, response) {
//     response.sendFile(path.join(__dirname, '/dist/index.html'))
// });

let ogruzki = [];
let sms = [];


io.on('connection', socket => {
    socket.on('join', data => {
        ogruzki.push({
            id: data.id,
            name: data.name,
            position: data.position,
            avatar: data.avatar
        })
        console.log(data, ogruzki)
        io.sockets.emit('state', ogruzki)
        io.sockets.emit('state2', sms)
    })
    socket.on('sebat', data => {
        console.log(data.id)
        console.log(`${data.name} ливанул нахуй`);
        ogruzki = ogruzki.filter(obj => {
            return obj.id !== data.id
        })
        io.sockets.emit('state', ogruzki)
    });
    socket.on('sms', data => {
        console.log(data);
        sms.push({
            id: data.id,
            text: data.text,
            color: data.color
        })
        io.sockets.emit('state2', sms)
    });
    socket.on('deleteSMS', data => {
        
        sms = sms.filter(obj => {
            return obj.id !== data.id
        })
        io.sockets.emit('state2', sms)
        console.log(sms)
    });
})

    
    //io.sockets.emit('state', sms)


server.listen(process.env.PORT || 5000, () => {
    console.log('Подымаю сервер с колен.....')
    setTimeout(() => {
        console.log('Сервак стоит на своих двух и 5000 порту')
    }, 1500)
    setTimeout(() => {
        console.log('А')
    }, 3000)
    setTimeout(() => {
        console.log('...')
    }, 3050)
    setTimeout(() => {
        console.log('Д')
    }, 3100)
    setTimeout(() => {
        console.log('И')
    }, 3200)
    setTimeout(() => {
        console.log('М')
    }, 3300)
    setTimeout(() => {
        console.log('А')
    }, 3400)
    setTimeout(() => {
        console.log('...')
    }, 3450)
    setTimeout(() => {
        console.log('Х')
    }, 3500)
    setTimeout(() => {
        console.log('У')
    }, 3600)
    setTimeout(() => {
        console.log('Й')
    }, 3700)
});





