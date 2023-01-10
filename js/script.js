const randomButton = document.querySelector('.random');
const dogList = document.getElementById('doggoDropDown');
const listButton = document.querySelector('.list');
const subListButton = document.querySelector('.sub');

window.addEventListener('load', populateList);
dogList.addEventListener('change', getBreedImage);
listButton.addEventListener('click', getBreedImage);

function getRandomDoggo(){
  fetch('https://dog.ceo/api/breeds/image/random')
    .then(checkStatus)
    .then(response => response.json())
    .then(data => handleData(data))
    .catch(error => notifyUser(error))
}

function getSubList () {
    fetch('https://dog.ceo/dog-api/documentation/sub-breed')
    .then(checkStatus)
    .then(response => response.json())
    .then(data => subList(data))
    .catch(error => notifyUser(error))
}

function populateList(){
  fetch('https://dog.ceo/api/breeds/list/all')
    .then(checkStatus)
    .then(response => response.json())
    .then(data => createListItems(data.message))
    .catch(error => notifyUser(error))
}
function getBreedImage(){
  let selectedBreed = dogList.options[dogList.selectedIndex].value;
  let url = `https://dog.ceo/api/breed/${selectedBreed}/images`;
  fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .then(data => getImageURL(data.message))
    .catch(error => console.log(error))
}
function checkStatus(response){
  if(response.ok){
    return Promise.resolve(response);
  }else{
    return Promise.reject(new Error(response.statusText));
  }
}

function handleData(data){
  let url = data.message;
  console.log(url)
  let regex = /https:\/\/images\.dog\.ceo\/breeds\/(\w+\-?\w+)\/.+/g;
  let breedName = regex.exec(url);
  document.getElementById('randomImageContainer').innerHTML = `<img alt="random image of a ${fixBreed(breedName[1])}" src='${url}'/>`;

}

function getImageURL(data){
  let randomNumberURL = data[Math.floor(Math.random()*data.length)+1];
  listImageContainer.innerHTML = `<img src="${randomNumberURL}" alt="${extractBreedName(data)}"/>`;
}

function subList(data) {

}

function createListItems(data){
  let output = '';
  Object.keys(data).forEach(key => output+=`<option value="${key}">${fixBreed(key)}</option>`);
  document.getElementById('doggoDropDown').innerHTML = output;
}

function notifyUser(error){
  const errorContainer = document.querySelector('.alert');
  errorContainer.innerHTML = `There was an error with the server request (${error}). <br> Click the button again.`;
  errorContainer.style.display = 'block';
  setTimeout(()=>{
    errorContainer.innerHTML = '';
    errorContainer.style.display ='none';
  },4000)
}

function fixBreed(breedName){
  if(breedName === 'germanshepherd'){
    return 'German Shepherd';
  }else if(breedName === 'mexicanhairless'){
    return 'Mexican Hairless';
  }else if(breedName === 'stbernard'){
    return 'St. Bernard';
  }else if(breedName === "african"){
    return 'African Wild Dog';
  }else if(breedName === 'bullterrier'){
    return 'Bull Terier';
  }
  return capitalize(breedName);
}

function capitalize(breedName){
  return breedName.replace(/\-/g,' ')
                  .split(" ")
                  .map(word => word.charAt(0).toUpperCase()+word.slice(1))
				          .join(" ");
}

function extractBreedName(data){
  let regex = /https:\/\/images\.dog\.ceo\/breeds\/(\w+-?\w+)\/\w+\.\w+/g;
  let match = regex.exec(data);
  return fixBreed(match[1]);
}