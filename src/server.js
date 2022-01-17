const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const port = process.env.PORT || 8000
dotenv.config({
    path : "src/.env"
})
const server = http.createServer(app);
server.listen(port,()=>{
    console.log(`server is listening on port ${process.env.port}`);
})