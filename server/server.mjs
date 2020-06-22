import * as fs from 'fs';
import express from 'express';
const app = express()
 
app.get('/', (req, res) => {
 
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
 
  // Request methods you wish to allow
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
  // Request headers you wish to allow
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
 
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);
 
  // Lese File
  fs.readFile('highscores.json', 'utf8', (err, data) => {
    let highScores = [];
    let newScore = 0;
    let newName = "";
    let insertPos = 9999;
 
    if (err) {
      console.log('Error: ' + err);
      res.write('Error: '+ err);
      return;
    } else {
      highScores = JSON.parse(data);
      newScore = Number(req.query.score);
      newName = req.query.name;
      for (let i=0; i<highScores.length; i++){
        if (newScore >= highScores[i].score){
          insertPos = i;
          break
        };
      }
      // Neuer Score in Array einfügen
      highScores.splice(insertPos,0,{"score":newScore, "name": newName});
      // letzter Score wegschneiden
      highScores.splice(10,1);
      res.json(highScores);
      fs.writeFile('highscores.json', JSON.stringify(highScores) , (err) => {
        if (err){
          console.log('Error: ' + err);
          res.write('Error: '+ err);
        } else {
          console.log('Wrote new highscore');
        }
      });
    }
  });
});
 
app.listen(8080);