import * as fs from 'fs';

fs.readFile('highscore.json', 'utf8', (err, data) => {
   if (err) throw err;
   console.log(JSON.stringify(data));
  });