///////////////////////////////////////////////////////////////////////
//////////////////////////FUNKCIJA ZA RUTU 1//////////////////////////
/////////////////////////////////////////////////////////////////////

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function posaljiStudent(studentObjekat,callback){
  
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {

      if (ajax.readyState == 4 && ajax.status == 200){
          callback(JSON.parse(ajax.responseText),null);
      }
      else if (ajax.readyState == 4){
          callback(null,"Došlo je do greške pri pozivu funkcije posaljiStudent");
      }
          
  }

  ajax.open("POST", "http://localhost:3000/student", true);
  ajax.setRequestHeader("Content-Type", "application/json");
  ajax.send(JSON.stringify(studentObjekat));

}

///////////////////////////////////////////////////////////////////////
//////////////////////////FUNKCIJA ZA RUTU 2//////////////////////////
/////////////////////////////////////////////////////////////////////

function postaviGrupu(indexStudenta,grupa,callback){

  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {

     if (ajax.readyState == 4 && ajax.status == 200){
        callback(JSON.parse(ajax.responseText),null);
     }
     else if (ajax.readyState == 4){
        callback(null,"Došlo je do greške pri pozivu funkcije postaviGrupu");
    }
         
  }

  let Grupa = {
    grupa: grupa,
  };

  ajax.open("PUT", "http://localhost:3000/student/"+indexStudenta, true);
  ajax.setRequestHeader("Content-Type", "application/json");
  ajax.send(JSON.stringify(Grupa));

}

///////////////////////////////////////////////////////////////////////
//////////////////////////FUNKCIJA ZA RUTU 3//////////////////////////
/////////////////////////////////////////////////////////////////////

function posaljiStudente(studentiCSVString,callback){

  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {

     if (ajax.readyState == 4 && ajax.status == 200){
        callback(JSON.parse(ajax.responseText),null);
     }
     else if (ajax.readyState == 4){
        callback(null,"Došlo je do greške pri pozivu funkcije posaljiStudente");
     }
         
  }

  ajax.open("POST", "http://localhost:3000/batch/student", true);
  ajax.setRequestHeader("Content-Type", "text/plain");
  ajax.send(studentiCSVString.toString());

}

///////////////////////////////////////////////////////////////////////
//////////////////////////FUNKCIJA ZA RUTU 4//////////////////////////
/////////////////////////////////////////////////////////////////////

function postaviVjezbe(brojVjezbi,callback){

  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {

      if (ajax.readyState == 4 && ajax.status == 200){
          callback(JSON.parse(ajax.responseText),null);
      }
      else if (ajax.readyState == 4){
          callback(null,"Došlo je do greške pri pozivu funkcije postaviVjezbe");
      }
          
  }

  let BrVjezbi = {
    brojVjezbi: brojVjezbi,
  };

  ajax.open("POST", "http://localhost:3000/vjezbe", true);
  ajax.setRequestHeader("Content-Type", "application/json");
  ajax.send(JSON.stringify(BrVjezbi));

}


///////////////////////////////////////////////////////////////////////
//////////////////////////FUNKCIJA ZA RUTU 5//////////////////////////
/////////////////////////////////////////////////////////////////////

function postaviTestReport(indexStudenta,nazivVjezbe,testReport,callback)
{

  var ajax = new XMLHttpRequest();
  
  ajax.onreadystatechange = function() {

      if (ajax.readyState == 4 && ajax.status == 200){
          callback(JSON.parse(ajax.responseText),null);
      }
      else if (ajax.readyState == 4){
          callback(null,"Došlo je do greške pri pozivu funkcije postaviTestReport");
      }
          
  }

  ajax.open("POST", "http://localhost:3000/student/"+indexStudenta+"/vjezba/"+nazivVjezbe, true);
  ajax.setRequestHeader("Content-Type", "application/json");
  ajax.send(JSON.stringify(testReport));

}


exports.posaljiStudent = posaljiStudent;
exports.postaviGrupu = postaviGrupu;
exports.posaljiStudente = posaljiStudente;
exports.postaviVjezbe = postaviVjezbe;
exports.postaviTestReport = postaviTestReport;