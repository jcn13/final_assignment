const insert = document.getElementById('add')
const update = document.getElementById('change')
const beerDB = new PouchDB('beerdb')
let beer
let brewery
let type
let rating
let notes
let database
let html
let myId
let myRev

insert.addEventListener('submit', (e) => { 	
  	e.preventDefault()  	
  	add( input() )
})

update.addEventListener('submit', (e) => {  
    e.preventDefault()       
    addEdited( input() )
})

function input() {
	beer = document.getElementById('beer').value
	brewery = document.getElementById("brewery").value
  type = document.getElementById("type").value
	rating = document.getElementById("rating").value
	notes = document.getElementById("notes").value    
}

function add() {
    let doc = {
      _id: new Date().toISOString(),
      'beer' : beer,
      'brewery' : brewery,
      'type' : type,
      'rating' : rating,
      'notes' : notes
    }    
    beerDB.put(doc) 
    document.getElementById("add").reset()    
    getDB()             
    return false
}

function addEdited(){  
  let doc = {
      _id: myId,
      _rev: myRev,
      'beer' : beer,
      'brewery' : brewery,
      'type' : type,
      'rating' : rating,
      'notes' : notes      
      }        
    beerDB.put(doc)    
    document.getElementById("add").reset()   
    getDB()
    document.getElementById('insert').classList.toggle('displayNone')
    document.getElementById('update').classList.toggle('displayNone')             
    return false
}

function show(data){
  html = '<div class="display"><table><tr><th>Beer</th><th>Brewery</th><th>Style</th><th>Rating</th><th>Notes</th><th>Delete</th><th>Edit</th></tr>'
  for(let i=0; i<data.total_rows; i++) {         
    html += '<tr><td>' + data.rows[i].doc.beer + '</td><td>' + data.rows[i].doc.brewery +'</td><td>' + data.rows[i].doc.type + '</td><td>' + data.rows[i].doc.rating + '</td><td>' + data.rows[i].doc.notes + '</td><td><button class="delete" id="' + data.rows[i].doc._id + '"><span>Del</span></button></td><td><button class="edit" id="' + data.rows[i].doc._id + '"><span>Edit</span></button></td>'
  }
  html += '</tr></table></div>'
  console.log(data)
  document.getElementById('history').innerHTML = html
  let buttons = document.getElementsByClassName('delete')
  for (let i=0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', remove) 
  }
  let edits = document.getElementsByClassName('edit')
  for (let i=0; i < edits.length; i++) {
      edits[i].addEventListener('click', edit) 
  }
}

function remove(){
  let num = this.getAttribute('id')
    beerDB.get(num).then((doc) =>{       
    beerDB.remove(doc)
    getDB()
  })  
  return false
}

function edit(){
  let num = this.getAttribute('id')
  console.log(num) 
  beerDB.get(num).then((doc) =>{
    console.log(doc)
    document.getElementById('beer').value = doc.beer    
    document.getElementById('brewery').value = doc.brewery 
    document.getElementById('type').value = doc.type 
    document.getElementById('rating').value = doc.rating 
    document.getElementById('notes').value = doc.notes 
    document.getElementById('insert').classList.toggle('displayNone')
    document.getElementById('update').classList.toggle('displayNone')
    myId = doc._id
    myRev = doc._rev    
  })  
  return false
}


function viewdb(){
  beerDB.allDocs({include_docs : true}).then((database) => {    
    show(database)
  })
}

function getDB(){ 
  beerDB.allDocs().then((result) => {    
    let html
    if(result.total_rows === 0){    
      html = `<p>No records</p>`
      document.getElementById('history').innerHTML = html
    } else {
      viewdb()
    }
    }).catch(function (err) {
        console.log(err)
    })  
}

getDB()
