 

function Funkcija(data, error) {

  if (!error) {

    if(data.status.toString()==="Kreiran student!"){
      document.getElementById("status").innerHTML = data.status;
      document.getElementById("status").style.color = 'green';
    }
    else{
      document.getElementById("status").innerHTML = data.status;
      document.getElementById("status").style.color = 'red';
    }

  } else{
     console.log(error);
  }
  
}

function Poziv(){

  var Ime = document.getElementById('imeS').value;
  var Prezime = document.getElementById('prezimeS').value;
  var Index = document.getElementById('indexS').value;
  var Grupa = document.getElementById('grupaS').value;

  let student = {
    ime: Ime,
    prezime: Prezime,
    index: Index,
    grupa: Grupa,
  };

  posaljiStudent(student, Funkcija);

}