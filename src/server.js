const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({
    path : "src/.env"
})
const server = http.createServer(app);
server.listen(process.env.port,()=>{
    console.log(`server is listening on port ${process.env.port}`);
})