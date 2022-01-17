const cli = require('nodemon/lib/cli');
const { Pool } = require('pg');
const client = new Pool({
  connectionString : "postgres://rkmasdgtoskyan:8382b21eb9fd239494addd2364cd05edd029f4410cbcf6bd42223abd9f40efa0@ec2-34-239-196-254.compute-1.amazonaws.com:5432/d9dc5eb9o4pij3",
  ssl : {rejectUnauthorized : false}
});

client.connect()
// client.query("SELECT * FROM UserProfile",(err,result)=>{
//   console.log(result);
// })

// client.connect();

module.exports = client;