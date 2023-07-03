const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Handle all fetch requests
async function getJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json(); //await for the response to resolve or reject
  } catch (error) {
    throw error; 

  }
}


//This function is like getProfiles function in promises.js and fetch.js. It is going to return
//an array of promise objects saved to variable profiles.
async function getPeopleInSpace(url) { 
  //const peopleResponse = await fetch(url); //wait for a resolved promise returned by fetch and get value
  //const peopleJSON = await peopleResponse.json(); //read the response and await the JSON
    const peopleJSON = await getJSON(url);

  //Based on the return names
  const profiles = peopleJSON.people.map(async person => { //The callback needs to be marked as async for await to be used.
    const craft = person.craft;
    //const profileResponse = await fetch(wikiUrl + person.name);
    const profileJSON = await getJSON(wikiUrl + person.name);

    return {...profileJSON, craft};
  });

  return Promise.all(profiles);

}

// Generate the markup for each profile
function generateHTML(data) {
  data.map( person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    // Check if request returns a 'standard' page from Wiki
    if (person.type === 'standard') {
      section.innerHTML = `
        <img src=${person.thumbnail.source}>
        <span>${person.craft}</span>
        <h2>${person.title}</h2>
        <p>${person.description}</p>
        <p>${person.extract}</p>
      `;
    } else {
      section.innerHTML = `
        <img src="img/profile.jpg" alt="ocean clouds seen from space">
        <h2>${person.title}</h2>
        <p>Results unavailable for ${person.title}</p>
        ${person.extract_html}
      `;
    }
  });
}

// btn.addEventListener('click', async (event) => {
//   event.target.textContent = "Loading...";
//   const astros = await getPeopleInSpace(astrosUrl);
//   generateHTML(astros);
//   event.target.remove();

//Alternative
btn.addEventListener('click', (event) => {
  event.target.textContent = "Loading...";
  getPeopleInSpace(astrosUrl)
    .then(generateHTML)
    .catch( err => {
      peopleList.innerHTML = '<h3>Something went wrong!</h3>';
      console.error(err);
    })
    .finally(() => event.target.remove())

});