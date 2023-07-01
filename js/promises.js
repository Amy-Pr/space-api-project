const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getJSON(url) {
  return new Promise ((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if(xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = () => reject(Error('A network error occured.')); //This is because no statusText for when there is a connectivity issue.
    xhr.send();
  });
  
}

function getProfiles(json) {
  const profiles = json.people.map( person => {
    getJSON(wikiUrl + person.name);//Don't need a callback anymore so got rid of generateHTML
  }); 
  return profiles;
}

// Generate the markup for each profile
function generateHTML(data) {
  const section = document.createElement('section');
  peopleList.appendChild(section);
  // Check if request returns a 'standard' page from Wiki
  if (data.type === 'standard') {
    section.innerHTML = `
      <img src=${data.thumbnail.source}>
      <h2>${data.title}</h2>
      <p>${data.description}</p>
      <p>${data.extract}</p>
    `;
  } else {
    section.innerHTML = `
      <img src="img/profile.jpg" alt="ocean clouds seen from space">
      <h2>${data.title}</h2>
      <p>Results unavailable for ${data.title}</p>
      ${data.extract_html}
    `;
  }
}

btn.addEventListener('click', (event) => {
  getJSON(astrosUrl) //we got rid of the callback function parameter above and replaced with a Promise constructor
    .then(getProfiles) //Now getProfiles doesn't need to be passed as a callback in the parent function, but instead chained through the 'then' method. It will be ran sequentially after info back from astroUrl
    .then(data => console.log(data)) //logs the final result
    .catch(error => console.log(error))
    event.target.remove();
});