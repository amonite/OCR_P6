/* server.js */
/* small server  */
// const http = require("http");
// const app = require("./app");

// app.set("port", process.env.PORT || 3000);

// const server = http.createServer(app);
// // const server = http.createServer((req, res) =>{
// //     res.end("le server tourne encore :)");
// // });

// server.listen(process.env.PORT || 3000);

/* server with error handling */
const http = require("http");       // import http module
const app = require("./app");       // include our app 


/* make sure port is right format */
const normalizePort = portVal =>{
    const port =  parseInt(portVal, 10);
    if(isNaN(port)){
        return portVal;
    }
    if(port >=0){
        return port;
    }
    return false;
}
/* if the PORT env variable is set by server owner or else use port 3000 */
const port = normalizePort(process.env.PORT || "3000");
app.set("port",port);   //pass port number to app 


/* error handling */
const errorHandler = error =>{
    if(error.syscall !== "listen"){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port: " + port;
    switch(error.code){
        case 'EACCES' : 
            console.error(bind + " requires elevated priviledges.");
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + " is already in use.");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/* create server with app + error handler, start the server and make it listen to given port */
const server = http.createServer(app);

server.on("error", errorHandler);

server.on("listening", () =>{
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port: "+ port;
    console.log("listening on "+ bind);
});

server.listen(port);
