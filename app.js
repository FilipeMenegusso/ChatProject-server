const express = require('express');

const http = require('http');

const socketIO = require('socket.io');
const consign = require('consign');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const csurf = require('csurf');
const expressSession = require('express-session');
const config = require('./config');
const redisAdapter = require('socket.io-redis');
const RedisStore = require('connect-redis')(expressSession)


const app = express();
const server = http.Server(app);
const io = socketIO(server);


app.disable('x-powered-by');
app.use(expressSession({
  store,
  resave: true,
  saveUninitialized: true,
  name: config.sessionKey,
  secret: config.sessionSecret
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(csurf());
app.use((req, res, next) => {
  res.locals._csrf = req.csrfToken();
  next();
});

io.adapter(redisAdapter(config.redis));
io.use((socket, next) => {
  const cookieData = socket.request.headers.cookie;
  const cookieObj = cookie.parse(cookieData);
  const sessionHash = cookieObj[config.sessionKey] || '';
  const sessionID = sessionHash.split('.')[0].slice(2);
  store.get(sessionID, (err, currentSession) => {
    if (err) {
      return next(new Error('Acesso negado!'));
    }
    socket.handshake.session = currentSession;
    return next();
  });
  return true;
});

consign({ verbose: false })
  .include('events')
  .into(app, io);


server.listen(3000, () => console.log('Chat Banco Safra rodando.'));

module.exports = app;
