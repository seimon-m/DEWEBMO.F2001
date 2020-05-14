import express from 'express';

console.log("Server is starting...")

const app = express();

//let out = "";
// app.get('/', function(req, res){
//     out += 'newscore: ' + req.query.score + '\n';
//     out += 'name: ' + req.query.name + '\n';
//     res.send(out);
// });

app.get('/', function(request, response){
    response.json(request.query);
  });

app.listen(3000);