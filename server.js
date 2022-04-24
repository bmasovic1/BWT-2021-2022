let http = require('http');
let fs = require('fs');
let url = require('url');
var ss = require("./Klasa.js");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("html"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Sequelize = require("sequelize");
const sequelize = require('./baza.js');

const Student = require("./student.js")(sequelize);
const Grupa = require("./grupa.js")(sequelize);
const Vjezba = require("./vjezba.js")(sequelize);

Student.sync();
Grupa.sync();
Vjezba.sync();

Grupa.hasMany(Student);
Student.hasMany(Vjezba);
/*
sequelize
    .sync({force: true})
    //.sync()
    .then((res)=>{
      console.log(res);
    })
    .catch((err) =>{
      console.log(err);
  });
*/
  async function ProvjeraStudenta(IND){
    const result = await Student.findOne({where : {index : IND}})
        if(result === null)return 0;
        return 1;  
  }

  async function ProvjeraGrupe(GRU){
    const result = await Grupa.findOne({where : {grupa : GRU}})
        if(result === null)return 0;
        return 1;  
  }
  let SveGrupe=[];
  let brGr=0;

  function DaLiIma(x){
    if(SveGrupe.includes(x)){
    return true;
    }
    else{
    return false;
    }
  }

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// RUTA 1 ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

app.post('/student',function (req, res) {

  const obj = req.body;
  var IME=obj.ime;
  var PRE=obj.prezime;
  var IND=obj.index;
  var GRU=obj.grupa;

  ProvjeraStudenta(IND)
  .then((test) => {

    if(test==1){

      let niz2 = {
        status: `Student sa indexom ${IND} već postoji!`
      };
    
      res.writeHead(200, { 'Content-Type': 'application/json' });

      res.end(JSON.stringify(niz2));
      
    }
    else{

      ProvjeraGrupe(GRU)
      .then((test2) => {

        if(test2==0){

          Grupa.create({grupa: GRU})
          .then((grupaa) =>{

            SveGrupe[brGr]=GRU;
            brGr++;

            Grupa.findOne({
              where : {
                  grupa : req.body.grupa
              }
            })
            .then((user) => {
          
          
            user.createStudent({
          
              ime: IME,
              prezime: PRE,
              index: IND,
              grupa: GRU,
          
            })
            .then(()=>{
          
              let niz2 = {
                status: `Kreiran student!`
              };
          
               res.writeHead(200, { 'Content-Type': 'application/json' });
          
               res.end(JSON.stringify(niz2));
      
              })
              
            });

          });

        }
        else{

          Grupa.findOne({
            where : {
                grupa : req.body.grupa
            }
          })
          .then((user) => {
        
        
          user.createStudent({
        
            ime: IME,
            prezime: PRE,
            index: IND,
            grupa: GRU,
        
          })
          .then(()=>{
        
            let niz2 = {
              status: `Kreiran student!`
            };
        
             res.writeHead(200, { 'Content-Type': 'application/json' });
        
             res.end(JSON.stringify(niz2));
    
            })
            
          });

        }

      });
      
    }
  });
});


///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// RUTA 2 ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

app.put('/student/:index',function (req, res) {

  const obj = req.body;
  var GRU=obj.grupa;

  let br=0;
  let niz = [];

  var Index = req.params.index;
  var imee;
  var prezimee;
  var indexx;
  var grupaa;

  ProvjeraStudenta(Index)
  .then((test) => {

    if(test==1){

      ProvjeraGrupe(GRU)
      .then((test2) => {


        if(test2==0){
          
          Grupa.create({grupa: GRU})
          .then((grupaa) =>{
            SveGrupe[brGr]=GRU;
            brGr++;

            Grupa.findOne({
              where : {
                  grupa : req.body.grupa
              }
            })
            .then((user) => {

              Student.findOne({
                where : {
                    index : Index
                }
              })
              .then((student) => {
    
                student.update({
                  grupa: GRU,
                  GrupaId: grupaa.id
                })
                .then(()=>{
        
                  let niz2 = {
                    status: `Promjenjena grupa studentu ${Index}`
                  };
              
                    res.writeHead(200, { 'Content-Type': 'application/json' });
              
                    res.end(JSON.stringify(niz2));
          
                })
    
              });

            });

          });

        }
        else{

          Grupa.findOne({
            where : {
                grupa : req.body.grupa
            }
          })
          .then((user) => {

          Student.findOne({
            where : {
                index : Index
            }
          })
          .then((student) => {

            student.update({
              grupa: GRU,
              GrupaId: user.id
            })
            .then(()=>{
        
              let niz2 = {
                status: `Promjenjena grupa studentu ${Index}`
              };
          
                res.writeHead(200, { 'Content-Type': 'application/json' });
          
                res.end(JSON.stringify(niz2));
      
            })

          });
        });
        }


      });
      
    }
    else{

      let niz2 = {
        status: `Student sa indexom ${Index} ne postoji`
      };
    
      res.writeHead(200, { 'Content-Type': 'application/json' });

      res.end(JSON.stringify(niz2));

    }

  });

});


///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// RUTA 3 ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

async function DodajStudente(ime, prezime, indexx, grupee, st){
  for(let i=0; i<indexx.length; i++){


    await ProvjeraStudenta(indexx[i])
    .then((test) => {
      if(test==0){

        ProvjeraGrupe(grupee[i])
        .then((test2) => {
  
          if(test2==0 && !DaLiIma(grupee[i])){
            
          Grupa.create({grupa: grupee[i]})
          .then((grupaa) =>{

            SveGrupe[brGr]=grupee[i];
            brGr++;

            Grupa.findOne({
              where : {
                  grupa : grupaa.grupa
              }
            })
            .then((user) => {
                
              user.createStudent({
        
                ime: ime[i],
                prezime: prezime[i],
                index: indexx[i],
                grupa: grupee[i],
            
              })
              .then(() =>{
            });

            });


          });

          }
          else if (test2==1 && DaLiIma(grupee[i])){

            Grupa.findOne({
              where : {
                  grupa : grupee[i]
              }
            })
            .then((user) => {
                
              user.createStudent({
        
                ime: ime[i],
                prezime: prezime[i],
                index: indexx[i],
                grupa: grupee[i],
            
              })

            });

          }

        });

      }
      else{
        st+=indexx[i]+",";
      }

    })
  }

  return st;  

}

async function DodajGrupe(grupee){
  for(let i=0; i<grupee.length; i++){

    await ProvjeraGrupe(grupee[i])
    .then((test2) => {

      if(test2==0){

      }
      

    });
        

  }

}
app.use(bodyParser.text());

app.post('/batch/student',function (req, res) {

  let redd=req.body.toString().split("\n");

  let st="";
  let grupe = [];
  let indexx = [];
  let ime = [];
  let prezime = [];
  let N=redd.length;
   
  for(let i=0; i<redd.length; i++){

  let ele=redd[i].split(",")
  
    ime[i]=ele[0];
    prezime[i]=ele[1];
    indexx[i]=ele[2];
    grupe[i]=ele[3];
    grupe[i]=grupe[i].replace(`\r`, ``);

  }

  DodajStudente(ime, prezime, indexx, grupe, st)
  .then((st2) => {

    let niz2;

    let dodano = parseInt(st2.split(",").length-1);
    let dodano2=N-dodano;
    st2=st2.substring(0, st2.length - 1);

    if(0==dodano){
                  
      niz2 = {
        status: `Dodano ${N} studenata!`
      };

      }
      else{
          
        niz2 = {
          status: `Dodano ${dodano2} studenata, a studenti ${st2} već postoje!`
        };
          
      }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(niz2));

  });

});

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// RUTA 4 ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


app.use(bodyParser.json());

app.post('/vjezbe',function (req, res) {

  const obj = req.body;
  var brv=parseInt(obj.brojVjezbi);
  let niz2;

  if(brv==0){

    niz2 = {
      status: `Poslan broj vježbi za kreiranje je 0. Ništa se ne dešava!`
    };
  
  }
  else{

  Student.findAll()
  .then((sve)=>{

    sve.forEach((osoba) => {

      for(let i=1; i<=brv; i++){
      
        osoba.createVjezba({index: osoba.index, vjezba: i, tacnost: "0%", promjena: "0%", greske: "[]", testovi: "[]"}).
        then()
      }

    });

  });


  if(brv==1){

     niz2 = {
      status: `Kreirana po ${brv}. vježbe za svakog studenta!`
    };

  }
  else {

     niz2 = {
      status: `Kreirano ${brv}. vježbi za svakog studenta!`
    };

  }
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });

  res.end(JSON.stringify(niz2));

});

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// RUTA 5 ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

async function ProvjeraVjezbeIStudenta(IND, VJE){
  const result = await Vjezba.findOne({where : {index : IND, vjezba:  VJE}})
      if(result === null)return 0;
      return 1;  
}

async function Provjeratestova(IND, VJE){
  const result = await Vjezba.findOne({where : {index : IND, vjezba:  VJE, testovi: "[]"}})
      if(result === null)return 0;
      return 1;  
}

app.post('/student/:index/vjezba/:vjezba',function (req, res) {

  const obj1 = req.body;
  var unosIndex= req.params.index;
  var unosVjezba= req.params.vjezba;
  const tp = new ss.TestoviParser();
  let tacnost = tp.dajTacnost(JSON.stringify(req.body));
  let testovi = tp.dajTestove(JSON.stringify(req.body));
  let gres;
  let niztestova =`[`;
  niztestova+=testovi;
  niztestova +=`]`;
  let nizgresaka =`[{`;
    
      let brq=0;
      
      for(let element of tacnost.greske){
    
        brq++;
        nizgresaka+=`"fullTitle": "${element}"`;
        if(brq!=tacnost.greske.length){
          nizgresaka+=`},{`;
        }
    
      }

      nizgresaka +=`}]`;
    
  let tacnostProc=tacnost.tacnost;

  
  ProvjeraVjezbeIStudenta(unosIndex,unosVjezba)
  .then((test) => {

    if(test==0){

      let niz2 = {
        status: `Nije moguće ažurirati vježbe!`
      };
  
      res.writeHead(200, { 'Content-Type': 'application/json' });

      res.end(JSON.stringify(niz2));
      
    }
    else{

      Provjeratestova(unosIndex,unosVjezba)
      .then((test2) => {

        if(test2==1){

          Vjezba.findOne({where : {index : unosIndex, vjezba:  unosVjezba, testovi: "[]"}})
          .then((rez) => {

            rez.update({
              tacnost: tacnostProc,
              greske: nizgresaka,
              testovi: niztestova
            })
            .then(()=>{

              let niz2 = `{"vjezba":"${unosVjezba}","tacnost":"${tacnostProc}","promjena":"${rez.promjena}","greske":${nizgresaka}}`;
      
              res.writeHead(200, { 'Content-Type': 'application/json' });
            
              res.end(niz2);

            });

          });
        }
        else{

          Vjezba.findOne({where : {index : unosIndex, vjezba:  unosVjezba}})
          .then((rez) => {

            let niztestova2=JSON.parse(rez.testovi);
            let ukupno=0;
            let pali=0;
            
            for(let element of niztestova2){
              if(element.status=="fail")pali++;
              ukupno++;
            }
            let tes="";

            tes=JSON.stringify(niztestova2);
            tes=tes.replace(`[`, ``);
            tes=tes.replace(`]`, ``);

            let posalji="";

            posalji+="{"+ukupno+"},"+"{"+pali+"},"+tes;

            const tp2 = new ss.TestoviParser();
            let rjesenje=tp2.dajPromjenu(posalji, JSON.stringify(req.body));
            const obje= JSON.parse(rjesenje);

            let gre="";
       
            for(let i=0; i<obje.greske.length; i++){
                gre+=`{"fullTitle":"`+obje.greske[i]+`"}`;
                if(i!=obje.greske.length){
                  gre+=",";
                }
            }
            
            gre=gre.substring(0, gre.length - 1);

            let testovi2 = tp2.dajTestove(JSON.stringify(req.body));
            let rjes3 =`[`;
            rjes3+=testovi2;
            rjes3+=`]`;

            let prov="";
            prov+=obje.greske;

            if(prov=="identicni"){
    
              gres=rez.greske;
      
              rez.update({
                promjena: obje.promjena,
                testovi: rjes3
              })
              .then((re)=>{

                let niz3 = `{"vjezba":"${unosVjezba}","tacnost":"${re.tacnost}","promjena":"${obje.promjena}","greske":${gres}}`;

                res.writeHead(200, { 'Content-Type': 'application/json' });
              
                res.end(niz3);

              });

            }
            else{


              gres=rez.greske;

              rez.update({
                promjena: obje.promjena,
                greske: "["+gre+"]",
                testovi: rjes3
              })
              .then((re)=>{

                let niz3 = `{"vjezba":"${unosVjezba}","tacnost":"${re.tacnost}","promjena":"${obje.promjena}","greske":[${gre}]}`;

                res.writeHead(200, { 'Content-Type': 'application/json' });
              
                res.end(niz3);

              });

            }

          });

        }

      });

    }

  });

});


///////////////////////////////////
/////////////SPIRALA3/////////////
/////////////////////////////////

app.get("/unosStudenta.html", function (req, res) {
  res.sendFile(__dirname + "/html/" + "unosStudenta.html");
});


app.listen(3000);

module.exports = app;
