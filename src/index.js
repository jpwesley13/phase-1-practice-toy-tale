let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//~~                              Creating brand new toy cards
//listen for submit event
document.querySelector('.add-toy-form').addEventListener('submit', submitToy);

//create a -new- toy
function submitToy(e){
  e.preventDefault()
  let toyObject = {
    name: e.target.name.value, //remember to use commas to separate object key:value pairs
    image: e.target.image.value,
    likes: 0
  }
  createToyCard(toyObject);
  findToy(toyObject);
}

//POST toys
function findToy(toyObject){
  fetch('http://127.0.0.1:3000/toys', {
    method: 'POST', //POST needs all caps and to be a string
    headers: {
      'Content-Type': 'application/json', //seems to just be the common thing to do for POST
      Accept: 'application/json'
    },
    body: JSON.stringify(toyObject)
  })
  .then(res => res.json())
  .then(toyData => console.log(toyData))
}

//~~                     Creating the existing toy cards and PATCHing them
//Create toy cards
function createToyCard(toy){
  let card = document.createElement('div') //this adds a toy card as a listed item, but doesn't actually attach it to the div yet
  card.className = 'toy-card'
  card.innerHTML = `
<div class="card">
  <h2>${toy.name}</h2>
  <img src="${toy.image}" class="toy-avatar" />
  <p>${toy.likes} Likes</p>
  <button class="like-btn" id=${toy.id}>Like ❤️</button>
</div>
`;

//Add Likes to the cards through a PATCH method
card.querySelector('.like-btn').addEventListener('click', () => {
  toy.likes+= 1
  card.querySelector('p').textContent = `${toy.likes} Likes`;
  updateLikes(toy)
});

// document.querySelector('#toy-collection').style.display = 'flex'; //see below
// document.querySelector('#toy-collection').style.flexWrap = 'wrap'; //see the css file for what -should- be done instead of this.
document.querySelector('#toy-collection').appendChild(card) //adds the cards to the DOM by appending them to the targeted div
}

//The aforementioned PATCH method
function updateLikes(toyObject){
  fetch(`http://127.0.0.1:3000/toys/${toyObject.id}`, { //dynamically find where to PATCH
    method:'PATCH',
    headers:{
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(toyObject)
  })
  .then(res => res.json())
  .then(toy => console.log(toy))
}

//Fetch toys
function fetchAllToys(){
  fetch('http://127.0.0.1:3000/toys') //makes a GET request to server (and get a response)
  .then(res => res.json()) 
  .then(toyData => toyData.forEach(toy => createToyCard(toy)))
}
fetchAllToys() //don't forget to evoke functions