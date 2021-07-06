var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var debug = require("debug")("server:server");
var http = require("http");

let myMidd = require("./midleware/myMiddleware");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var borrarRouter = require("./routes/borrar");
var vehiculoRouter = require("./routes/vehiculo");
var asignadoRouter = require("./routes/asignado");

var app = express();
let session = require("express-session");

var mongoose = require("mongoose");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
  console.log("modo dev");
}
const dbUrl = process.env.MONGODB_URI
  ? process.env.MONGODB_URI
  // : "mongodb://127.0.0.1:27017/streaming_v0";
  : "mongodb+srv://mac1:eucalipto@cluster0.wc1ua.mongodb.net/streaming_v0?retryWrites=true&w=majority"
try {
  mongoose.connect(
    dbUrl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => console.log("mongoose ok")
  );
} catch (error) {
  console.log("errorMongoose", error);
}
//mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on("error", console.error.bind(console, "Error Mongo::"));
db.once("open", function () {
  console.log("open db now");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
console.log('holaaa')
app.use(cors());
app.use(
  session({
    secret: "streamingHash",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//app.use("/public",express.static('public')); // para leer archivos estaticos

app.use(myMidd.auth);
app.use("/", indexRouter);
app.use("/usuario", usersRouter);
app.use("/borrar", borrarRouter);
app.use("/vehiculo", vehiculoRouter);
app.use("/asignado", asignadoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error",{sesion:req.session.user, });
});

///////////////// configuracinoes adicionales antes de lanzar el server

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

var io = require("socket.io")(server, {
  cors: { origin: "*" },
});
var sockets = require("./socket/socket")(io);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
