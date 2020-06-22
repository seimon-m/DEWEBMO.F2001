const saveButton = document.getElementById('button');
const listDiv = document.getElementById('list');

saveButton.addEventListener('click', updateHighScore);

function updateHighScore(){
  const name = document.getElementById('name').value;
  const score = document.getElementById('score').value;

  function renderHighScoreList(hs){
    let out ="<ol>";
    hs.forEach((s) => out += "<li>" + s.score + " " + s.name + "</li>")
    out += "</ol>";
    return out;
  }

  let url = "http://127.0.0.1:8080/?score=" + score + "&name=" + name;
  fetch(url)
  .then(response => response.json())
  .then(data => listDiv.innerHTML = renderHighScoreList(data))
  .catch(error => listDiv.innerHTML = "Error: "+error);
}