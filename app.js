var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http')
var cors = require('cors')

var app = express();
//const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server({
  cors: {
    origin: '*',
  }
})

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', (socket) => {
  console.log("connected")
  socket.on("pedidoRealizado", (pedido) => {
    //if( message === undefined) return
    io.emit("cozinhaPedido", pedido)
  });
  socket.on("pedidoCancelado",() => {
    io.emit("cozinhaCancelado")
  })
});

io.listen(3000)

module.exports = app;
