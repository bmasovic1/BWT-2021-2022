let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = require("chai").expect;
let should = require("chai").should();
const server = require("./server.js");

const Sequelize = require("sequelize");
const sequelize = require('./baza.js');

const Student = require("./student.js")(sequelize);
const Grupa = require("./grupa.js")(sequelize);
const Vjezba = require("./vjezba.js")(sequelize);

Grupa.sync();
Vjezba.sync();

Grupa.hasMany(Student);
Student.hasMany(Vjezba);

//////////////////////////////////////////////////////////////////////
///////////////////////// TESTOVI ZA RUTU 1 /////////////////////////
////////////////////////////////////////////////////////////////////

describe("testiranje POST na /student", function () {

    before(function(done) {
 
       sequelize.sync({force: true}) 
       .then(()=>{
        setTimeout(done, 10);
      })

      });

    it("POST /student ce dodati novog studenta u bazu", function (done) {

        let student = {
            ime: "Berin",
            prezime: "Mašović",
            index: "111",
            grupa: "RS1",
        };

        let odgovor = {
            status: "Kreiran student!"
        };

        chai
        .request(server)
        .post("/student")
        .send(student)
        .end(function (err, res) {
            res.should.have.status(200); 
            should.not.exist(err); 
            res.body.should.eql(odgovor);
            done();
        });
    });

    it("POST /student nece dodati novog studenta u bazu jer već postoji student sa tim indexom", function (done) {

        let student = {
            ime: "Berin",
            prezime: "Mašović",
            index: "111",
            grupa: "RS1",
        };
    
        let odgovor = {
            status: "Student sa indexom 111 već postoji!"
        };
    
          chai
          .request(server)
          .post("/student")
          .send(student)
          .end(function (err, res) {
            res.should.have.status(200); 
            should.not.exist(err); 
            res.body.should.eql(odgovor);
            done();
            });
        });

    it("POST /student provjera da li je ispravno dodan student", async () =>  {

        let student = {
            ime: "Berin",
            prezime: "Mašović",
            index: "111",
            grupa: "RS1",
        };
    
        let odgovor = {
            status: "Student sa indexom 111 već postoji!"
        };

        await Student.findOne({where : {index : student.index}})
        .then((rez) => {

            rez.should.not.eql(null); // mora postojati student 
            // provjera parametara 
            rez.ime.should.eql("Berin");
            rez.prezime.should.eql("Mašović");
            rez.index.should.eql("111");
            rez.grupa.should.eql("RS1");
            rez.GrupaId.should.eql(1);// provjera da li je kreirana nova grupa 

        });

        await Grupa.findAll()
        .then((rez) => {

            rez[0].grupa.should.eql("RS1");// provjera da li je kreirana grupa sa odgovarajućim imenom

            let br=0;
            rez.forEach((osoba) => {
                br++;
            });

            br.should.eql(1);// broj redova mora biti 1 jer smo samo 1 grupu kreirali

        });

    });

});


//////////////////////////////////////////////////////////////////////
///////////////////////// TESTOVI ZA RUTU 2 /////////////////////////
////////////////////////////////////////////////////////////////////

describe("testiranje PUT na /student/:index", function () {

  it("PUT /student/:index ce promijeniti grupu studentu sa zadanim indexom", function (done) {

    let obj = {
        grupa: "NekaGrupa"
    };

    let odgovor = {
        status: "Promjenjena grupa studentu 111"
    };

    chai
      .request(server)
      .put("/student/111")
      .send(obj)
      .end(function (err, res) {
        res.should.have.status(200); 
        should.not.exist(err); 
        res.body.should.eql(odgovor);
        done();
      });

  });

  it("POST /student/:index nece vrsiti izmjene jer ne postoji student sa zadanim indexom", function (done) {

    let obj = {
        grupa: "NekaGrupa"
    };

    let odgovor = {
        status: "Student sa indexom 10 ne postoji"
    };

    chai
      .request(server)
      .put("/student/10")
      .send(obj)
      .end(function (err, res) {
        res.should.have.status(200); 
        should.not.exist(err);
        res.body.should.eql(odgovor);
        done();
      });

  });


  it("POST /student/:index provjera da li se ispravno promijenila grupa studentu ", async () =>  {

    await Student.findOne({where : {grupa : "NekaGrupa"}})
    .then((rez) => {

        rez.should.not.eql(null); // mora postojati student 
        // provjera parametara 
        rez.ime.should.eql("Berin");
        rez.prezime.should.eql("Mašović");
        rez.index.should.eql("111");
        rez.grupa.should.eql("NekaGrupa");// novo promijenji nazi grupe
        rez.GrupaId.should.eql(2);// pošto je kreirana nova grupa id mora biti 2 

    });

    await Grupa.findAll()
    .then((rez) => {

        rez[0].grupa.should.eql("RS1");
        rez[1].grupa.should.eql("NekaGrupa");// provjera da li je kreirana nova grupa: NekaGrupa

        let br=0;
        rez.forEach((osoba) => {
            br++;
        });

        br.should.eql(2);// broj redova mora biti 2 jer smo kreirali novu grupu: NekaGrupa

    });

});


});
  

//////////////////////////////////////////////////////////////////////
///////////////////////// TESTOVI ZA RUTU 3 /////////////////////////
////////////////////////////////////////////////////////////////////

describe("testiranje POST na /batch/student", function () {

  
    it("POST /batch/student biti ce dodani vi studenti", function (done) {
      
      let CSV = `Berin2,Masovic2,222,RS2\nBerin3,Masovic3,333,RS3\nBerin4,Masovic4,444,RS4`;
  
      let odgovor = {
          status: "Dodano 3 studenata!"
      };
  
      chai
        .request(server)
        .post("/batch/student")
        .set('content-type', 'text/plain')
        .send(CSV)
        .end(function (err, res) {
          res.should.have.status(200); 
          should.not.exist(err); 
          res.body.should.eql(odgovor);
          done();
        });

    });
  
    it("POST /batch/student biti ce dodana 2 studenta dok 3 neće", function (done) {
      
      let CSV = `Berin5,Masovic5,555,RS5\nBerin2,Masovic2,222,RS2\nBerin3,Masovic3,333,RS3\nBerin4,Masovic4,444,RS4\nBerin6,Masovic6,666,RS6`;
  
      let odgovor = {
          status: "Dodano 2 studenata, a studenti 222,333,444 već postoje!"
      };
  
      chai
        .request(server)
        .post("/batch/student")
        .set('content-type', 'text/plain')
        .send(CSV)
        .end(function (err, res) {
          res.should.have.status(200); 
          should.not.exist(err); 
          res.body.should.eql(odgovor);
          done();
        });

    });


    it("POST /batch/student provjera da li su ispravno dodali studenti", async () =>  {
    
        await Student.findAll()
        .then((rez) => {


            for(let i=1; i<rez.length; i++ ){

                // provjera parametara idemo od 1 jer prvog studenta u bazi smo testirali u sklopu ranijih testova

                rez[i].ime.should.eql("Berin"+(i+1));
                rez[i].prezime.should.eql("Masovic"+(i+1));
                rez[i].index.should.eql((parseInt("111")+(111*i)).toString());
                rez[i].grupa.should.eql("RS"+(i+1));
                rez[i].GrupaId.should.eql((i+2));

            }

            let br=1;

            rez.forEach((x) => {
                br++;
            });

            br.should.eql(6);// broj redova mora biti 6 jer smo imali 1 studenta i dodali novih 5
    
        });
    
        await Grupa.findAll()
        .then((rez) => {
    
            for(let i=2; i<rez.length; i++ ){

                // provjera parametara idemo od 2 jer prve 2 grupe u bazi smo testirali u sklopu ranijih testova

                rez[i].grupa.should.eql("RS"+(i));

            }
    
            let br=0;

            rez.forEach((osoba) => {
                br++;
            });
    
            br.should.eql(7);// broj redova mora biti 7 jer smo imali 2 studenta i dodali novih 5
    
        });
    
    });
  
  });



//////////////////////////////////////////////////////////////////////
///////////////////////// TESTOVI ZA RUTU 4 /////////////////////////
////////////////////////////////////////////////////////////////////

describe("testiranje POST na /vjezbe", function () {

    it("POST /vjezbe ce kreirati po 2 vjezbe za svakog studenta", function (done) {

        let brojV = {
            brojVjezbi: "2"

        };

        let odgovor = {
            status: "Kreirano 2. vježbi za svakog studenta!"
        };

        chai
        .request(server)
        .post("/vjezbe")
        .send(brojV)
        .end(function (err, res) {
            res.should.have.status(200); 
            should.not.exist(err); 
            res.body.should.eql(odgovor);
            done();
        });
    });

    it("POST /vjezbe nece kreirati vjezbe jer je poslan brojVjezbi: 0", function (done) {

        let brojV = {
            brojVjezbi: "0"
        };

        let odgovor = {
            status: "Poslan broj vježbi za kreiranje je 0. Ništa se ne dešava!"
        };
    
        chai
        .request(server)
        .post("/vjezbe")
        .send(brojV)
        .end(function (err, res) {
            res.should.have.status(200); 
            should.not.exist(err); 
            res.body.should.eql(odgovor);
            done();
        });
    });


    it("POST /vjezbe provjera da li su ispravno kreirane vjezbe", async () =>  {

        await Vjezba.findAll()
        .then((rez) => {

            let b=0;
            let b2=1;

            for(let i=0; i<rez.length; i++ ){

                // provjera parametara idemo od 1 jer prvog studenta u bazi smo testirali u sklopu ranijih testova
                
                rez[i].id.should.eql((i+1));
                rez[i].index.should.eql((parseInt("111")+(111*b)).toString());
                rez[i].vjezba.should.eql((b2).toString());
                rez[i].tacnost.should.eql("0%");
                rez[i].promjena.should.eql("0%");
                rez[i].greske.should.eql("[]");
                rez[i].testovi.should.eql("[]");
                rez[i].StudentId.should.eql((b+1));

                if((i+1)%2==0 && i!=0){
                    b++; // %2 jer imamo po 2 vježbe za svakog studenta
                }
                
                b2++;

                if(b2>2){
                    b2=1;
                }

            }
    
            let br=0;

            rez.forEach((osoba) => {
                br++;
            });
    
            br.should.eql(12);// broj redova mora biti 12 jer smo kreirali po 2 vjezbe za svakog studenta a imali smo ih 6
    
        });
    
    });

});



//////////////////////////////////////////////////////////////////////
///////////////////////// TESTOVI ZA RUTU 5 /////////////////////////
////////////////////////////////////////////////////////////////////

describe("testiranje POST na /student/:index/vjezba/:vjezba", function () {

    it("POST /student/:index/vjezba/:vjezba sračunati če se tačnost i greške i prazan niz testova će se zamijeniti sa nizom naziva (fullTitle) svih testova iz proslijeđenog reporta u zahtjevu", function (done) {

        let odgovor = `{"vjezba": "2","tacnost": "16.7%","promjena": "0%","greske": [{"fullTitle": "Krug #obim kruga Obim treba biti 10*PI kada je prečnik kruga 10"},{"fullTitle": "Krug #obim kruga Obim treba biti 0*PI kada je prečnik kruga 0"},{"fullTitle": "Krug #presjek kruga presjek treba vratiti true jer se krugovi sijeku T2"},{"fullTitle": "Papir #pravljenjePapira treba vratiti 1 kad je krug veći od papira"},{"fullTitle": "Krug #povrsina kruga treba vratiti 0 kada je prečnik kruga 0"}]}`;

        let odgovorObj=JSON.parse(odgovor);

        let testRep=`{
            "stats": {
            "suites": 8,
            "tests": 6,
            "passes": 1,
            "pending": 0,
            "failures": 5,
            "start": "2021-11-13T16:24:38.503Z",
            "end": "2021-11-13T16:24:38.510Z",
            "duration": 7
            },
            "tests": [
            {
            "title": "Obim treba biti 10*PI kada je prečnik kruga 10",
            "fullTitle": "Krug #obim kruga Obim treba biti 10*PI kada je prečnik kruga 10",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            },
            {
            "title": "treba vratiti 4PI kada je prečnik kruga 4",
            "fullTitle": "Krug #povrsina kruga treba vratiti 4PI kada je prečnik kruga 4",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            },
            {
            "title": "Obim treba biti 0*PI kada je prečnik kruga 0",
            "fullTitle": "Krug #obim kruga Obim treba biti 0*PI kada je prečnik kruga 0",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            },
            {
            "title": "presjek treba vratiti true jer se krugovi sijeku",
            "fullTitle": "Krug #presjek kruga presjek treba vratiti true jer se krugovi sijeku T2",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            },
            {
            "title": "treba vratiti 1 kad je krug veći od papira",
            "fullTitle": "Papir #pravljenjePapira treba vratiti 1 kad je krug veći od papira",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            },
            {
            "title": "treba vratiti 0 kada je prečnik kruga 0",
            "fullTitle": "Krug #povrsina kruga treba vratiti 0 kada je prečnik kruga 0",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            }
            ],
            "pending": [],
            "failures": [
                {
                "title": "Obim treba biti 10*PI kada je prečnik kruga 10",
                "fullTitle": "Krug #obim kruga Obim treba biti 10*PI kada je prečnik kruga 10",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "Obim treba biti 0*PI kada je prečnik kruga 0",
                "fullTitle": "Krug #obim kruga Obim treba biti 0*PI kada je prečnik kruga 0",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "presjek treba vratiti true jer se krugovi sijeku",
                "fullTitle": "Krug #presjek kruga presjek treba vratiti true jer se krugovi sijeku T2",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "treba vratiti 1 kad je krug veći od papira",
                "fullTitle": "Papir #pravljenjePapira treba vratiti 1 kad je krug veći od papira",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "treba vratiti 0 kada je prečnik kruga 0",
                "fullTitle": "Krug #povrsina kruga treba vratiti 0 kada je prečnik kruga 0",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                }
            ],
            "passes": [
            {
            "title": "treba vratiti 4PI kada je prečnik kruga 4",
            "fullTitle": "Krug #povrsina kruga treba vratiti 4PI kada je prečnik kruga 4",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            }
            ]
        }`;

        chai
        .request(server)
        .post("/student/111/vjezba/2")
        .send(JSON.parse(testRep))
        .end(function (err, res) {
            res.should.have.status(200); 
            should.not.exist(err); 
            res.body.should.eql(odgovorObj);
            done();
        });

    });

    it("POST /student/:index/vjezba/:vjezba neće se izvršiti nikakve izmjene jer ne postoji student sa zadanim indeksom", function (done) {

        let odgovor = {
            status: `Nije moguće ažurirati vježbe!`
        };

        let testRep=`{
            "stats": {
            "suites": 2,
            "tests": 2,
            "passes": 2,
            "pending": 0,
            "failures": 0,
            "start": "2021-11-05T15:00:26.343Z",
            "end": "2021-11-05T15:00:26.352Z",
            "duration": 9
            },
            "tests": [
            {
            "title": "should draw 3 rows when parameter are 2,3",
            "fullTitle": "Tabela crtaj() should draw 3 rows when parameter are 2,3",
            "file": null,
            "duration": 1,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            },
            {
            "title": "should draw 2 columns in row 2 when parameter are 2,3",
            "fullTitle": "Tabela crtaj() should draw 2 columns in row 2 when parameter are 2,3",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            }
            ],
            "pending": [],
            "failures": [],
            "passes": [
            {
            "title": "should draw 3 rows when parameter are 2,3",
            "fullTitle": "Tabela crtaj() should draw 3 rows when parameter are 2,3",
            "file": null,
            "duration": 1,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            },
            {
            "title": "should draw 2 columns in row 2 when parameter are 2,3",
            "fullTitle": "Tabela crtaj() should draw 2 columns in row 2 when parameter are 2,3",
            "file": null,
            "duration": 0,
            "currentRetry": 0,
            "speed": "fast",
            "err": {}
            }
            ]
        }
        `;

        chai
        .request(server)
        .post("/student/158/vjezba/2")
        .send(JSON.parse(testRep))
        .end(function (err, res) {
            res.should.have.status(200); 
            should.not.exist(err); 
            res.body.should.eql(odgovor);
            done();
        });
    });


    it("POST /student/:index/vjezba/:vjezba sračunati će se i ažurirati promjenu i greške i prethodni niz testova zamijenite sa nizom naziva testova iz proslijeđenog reporta u zahtjevu",  function (done)  {

        let odgovor = `{"vjezba": "2","tacnost": "16.7%","promjena": "50%","greske": [{"fullTitle": "Krug #presjek kruga presjek treba vratiti true jer se krugovi sijeku T2"},{"fullTitle": "Krug #obim kruga Obim treba biti 10*PI kada je prečnik kruga 10"},{"fullTitle": "Krug #obim kruga Obim treba biti 7*PI kada je prečnik kruga 7"},{"fullTitle": "Papir #pravljenjePapira treba vratiti 1 kad je krug veći od papira"}]}`;

        let odgovorObj=JSON.parse(odgovor);

        let testRep=`{
            "stats": {
            "suites": 8,
            "tests": 7,
            "passes": 4,
            "pending": 0,
            "failures": 3,
            "start": "2021-11-13T16:24:38.503Z",
            "end": "2021-11-13T16:24:38.510Z",
            "duration": 7
            },
            "tests": [
                {
                "title": "Obim treba biti 10*PI kada je prečnik kruga 10",
                "fullTitle": "Krug #obim kruga Obim treba biti 10*PI kada je prečnik kruga 10",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "Obim treba biti 7*PI kada je prečnik kruga 7",
                "fullTitle": "Krug #obim kruga Obim treba biti 7*PI kada je prečnik kruga 7",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "treba vratiti 1 kad je krug veći od papira",
                "fullTitle": "Papir #pravljenjePapira treba vratiti 1 kad je krug veći od papira",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "treba vratiti 0 kad je krug manji od papira",
                "fullTitle": "Papir #pravljenjePapira treba vratiti 0 kad je krug manji od papira",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "presjek treba vratiti true jer se krugovi sijeku",
                "fullTitle": "Krug #presjek kruga presjek treba vratiti true jer se krugovi sijeku",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "Obim treba biti 0*PI kada je prečnik kruga 0",
                "fullTitle": "Krug #obim kruga Obim treba biti 0*PI kada je prečnik kruga 0",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "treba vratiti 0 kada je prečnik kruga 0",
                "fullTitle": "Krug #povrsina kruga treba vratiti 0 kada je prečnik kruga 0",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                }
            ],
            "pending": [],
            "failures": [
            {
                "title": "Obim treba biti 10*PI kada je prečnik kruga 10",
                "fullTitle": "Krug #obim kruga Obim treba biti 10*PI kada je prečnik kruga 10",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "Obim treba biti 7*PI kada je prečnik kruga 7",
                "fullTitle": "Krug #obim kruga Obim treba biti 7*PI kada je prečnik kruga 7",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "treba vratiti 1 kad je krug veći od papira",
                "fullTitle": "Papir #pravljenjePapira treba vratiti 1 kad je krug veći od papira",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
            }
            ],
            "passes": [
            {
                "title": "treba vratiti 0 kad je krug manji od papira",
                "fullTitle": "Papir #pravljenjePapira treba vratiti 0 kad je krug manji od papira",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "presjek treba vratiti true jer se krugovi sijeku",
                "fullTitle": "Krug #presjek kruga presjek treba vratiti true jer se krugovi sijeku",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "Obim treba biti 0*PI kada je prečnik kruga 0",
                "fullTitle": "Krug #obim kruga Obim treba biti 0*PI kada je prečnik kruga 0",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
                },
                {
                "title": "treba vratiti 0 kada je prečnik kruga 0",
                "fullTitle": "Krug #povrsina kruga treba vratiti 0 kada je prečnik kruga 0",
                "file": null,
                "duration": 0,
                "currentRetry": 0,
                "speed": "fast",
                "err": {}
            }
            ]
        }`;

        chai
        .request(server)
        .post("/student/111/vjezba/2")
        .send(JSON.parse(testRep))
        .end(function (err, res) {
            res.should.have.status(200); 
            should.not.exist(err); 
            res.body.should.eql(odgovorObj);
            done();
        });
    
    });

    it("POST /student/:index/vjezba/:vjezba provjera da li su ispravno izvršile izmjene vjezbe", async () =>  {

        await Vjezba.findOne({where : {index : 111, vjezba:  2}})
        .then((rez) => {

            // provjera da li su ispravno izvršene izmjene

            rez.id.should.eql(2);
            rez.index.should.eql("111");
            rez.vjezba.should.eql("2");
            rez.tacnost.should.eql("16.7%");
            rez.promjena.should.eql("50%");
            rez.greske.should.eql(`[{"fullTitle":"Krug #presjek kruga presjek treba vratiti true jer se krugovi sijeku T2"},{"fullTitle":"Krug #obim kruga Obim treba biti 10*PI kada je prečnik kruga 10"},{"fullTitle":"Krug #obim kruga Obim treba biti 7*PI kada je prečnik kruga 7"},{"fullTitle":"Papir #pravljenjePapira treba vratiti 1 kad je krug veći od papira"}]`);
            rez.testovi.should.eql(`[{"fullTitle":"Krug #obim kruga Obim treba biti 10*PI kada je prečnik kruga 10","status":"fail"},{"fullTitle":"Krug #obim kruga Obim treba biti 7*PI kada je prečnik kruga 7","status":"fail"},{"fullTitle":"Papir #pravljenjePapira treba vratiti 1 kad je krug veći od papira","status":"fail"},{"fullTitle":"Papir #pravljenjePapira treba vratiti 0 kad je krug manji od papira","status":"pass"},{"fullTitle":"Krug #presjek kruga presjek treba vratiti true jer se krugovi sijeku","status":"pass"},{"fullTitle":"Krug #obim kruga Obim treba biti 0*PI kada je prečnik kruga 0","status":"pass"},{"fullTitle":"Krug #povrsina kruga treba vratiti 0 kada je prečnik kruga 0","status":"pass"}]`);
            rez.StudentId.should.eql(1);
    
        });
    
    });

});
