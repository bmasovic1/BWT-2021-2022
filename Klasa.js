class TestoviParser{
 
  constructor(){}

  TestoviParserF(){
    return new TestoviParser();
  }

  //Zadatak1

 TestoviParserF(){
    return new TestoviParser();
  }

  //Zadatak1

  dajTacnost(str){

      try {

          JSON.parse(str);
          
      } catch (error) {

          return(JSON.parse(`{"tacnost":"0%","greske":["Testovi se ne mogu izvršiti"]}`));
          
      }

      const obj = JSON.parse(str);
    
      let ukupno = obj.stats.tests;
      let prosli = obj.stats.passes;
      let pali = obj.stats.failures;
    
      let rez = prosli/ukupno * 100 ;

      rez = Math.round(rez * 10) / 10;
    
      let rjes =`{"tacnost":"${rez}%","greske":[`;
    
      let br=0;
      
      for(let element of obj.failures){
    
        br++;
        rjes+=`"${element.fullTitle}"`;
        if(br!=pali){
          rjes+=`,`;
        }
    
      }
    
     rjes+=`]}`;
     const objR = JSON.parse(rjes);


     return objR;  
    
  }   

  //Zadatak 3

  porediRezultate(rezultat1, rezultat2){


    const obj1 = JSON.parse(rezultat1);
    const obj2 = JSON.parse(rezultat2);

    let ukupno1 = obj1.stats.tests;
    //let prosli1 = obj1.stats.passes;
    let pali1 = obj1.stats.failures;

    let ukupno2 = obj2.stats.tests;
    let prosli2 = obj2.stats.passes;
    let pali2 = obj2.stats.failures;


      let test=1;
      let a=0;

        for(let i=0; i<ukupno1; i++){

          for(let j=0; j<ukupno2; j++){

            if(obj1.tests[i].fullTitle==obj2.tests[j].fullTitle){
            a++;
            break;
            }

          }            

        }

        if(a!=ukupno1){
          test=0;
        }
      

      if(ukupno1!=ukupno2){
        test=0;
      }
      
      if(test==1){

        let rez1 = prosli2/ukupno2 * 100 ;
        rez1 = Math.round(rez1 * 10) / 10;

        let rjs =`{"promjena":"${rez1}%","greske":[`;

        let br=0;
      
        for(let element of obj1.failures){
      
          br++;
          rjs+=`"${element.fullTitle}"`;
          if(br!=pali1){
            rjs+=`,`;
          }
      
        }


        rjs+=`]}`;

        const objR1 = JSON.parse(rjs)

        return objR1;

      }

      if(test==0){

        let test2=0;
        let br1=0;
        
        for(let i=0; i<pali1; i++){

          test2=0;

          for(let j=0; j<ukupno2; j++){

            if(obj1.failures[i].fullTitle==obj2.tests[j].fullTitle){

              test2=1;
              break;

            }

          }

          if(test2==0){
            br1++;
          }

        }

        let rez2 =  (br1+pali2)/(br1+ukupno2) * 100 ;
        rez2 = Math.round(rez2 * 10) / 10;
        
        let brr=0;
        let rjs2 =`{"promjena":"${rez2}%","greske":[`;

        for(let i=0; i<pali1; i++){

          test2=0;

          for(let j=0; j<ukupno2; j++){

            if(obj1.failures[i].fullTitle==obj2.tests[j].fullTitle){

              test2=1;
              break;

            }

          }

          if(test2==0){
           
            if(brr==0){
              rjs2+=`"${obj1.failures[i].fullTitle}"`;
            }
            else{
              rjs2+=`,"${obj1.failures[i].fullTitle}"`;
            }

            brr++;

          }

        }

      
        for(let element of obj2.failures){
    
          rjs2+=`,"${element.fullTitle}"`;
      
        }
      

        rjs2+=`]}`;

        const objR2 = JSON.parse(rjs2)

        return objR2;

      }

  }





///////////  DODATCI ZA SPIRALU 2 //////////////




  dajTestove(str){


    const obj = JSON.parse(str);
  
    let ukupno = obj.stats.tests;
      
    let rjes =``;
  
    let br=0;
    for(let element of obj.failures){
  
      br++;
      rjes+=`{"fullTitle":"${element.fullTitle}","status":"fail"}`;
      if(br!=ukupno){
        rjes+=`,`;
      }
  
    }
    for(let element of obj.passes){
  
      br++;
      rjes+=`{"fullTitle":"${element.fullTitle}","status":"pass"}`;
      if(br!=ukupno){
        rjes+=`,`;
      }
  
    }
  
   return rjes;  
  
}   


dajPromjenu(rezultat1, rezultat2){


const obj1 = rezultat1.split("},{");
obj1[0]=obj1[0].replace("{", "");
obj1[obj1.length-1]=obj1[obj1.length-1].replace("}", "");

const obj2 = JSON.parse(rezultat2);

let ukupno1 = parseInt(obj1[0]);
let pali1 = parseInt(obj1[1]);

obj1.splice(0, 1);
obj1.splice(0, 1);

let ukupno2 = obj2.stats.tests;
let prosli2 = obj2.stats.passes;
let pali2 = obj2.stats.failures;

  let test=1;
  let a=0;

   for(let i=0; i<ukupno1; i++){

      let st="{"+obj1[i]+"}";
      const obj = JSON.parse(st);

      for(let j=0; j<ukupno2; j++){

        if(obj.fullTitle==obj2.tests[j].fullTitle){
        a++;
        break;
        }

      }            

    }

    if(a!=ukupno1){
      test=0;
    }
  

  if(ukupno1!=ukupno2){
    test=0;
  }

  
  if(test==1){

    let rez1 = prosli2/ukupno2 * 100 ;
    rez1 = Math.round(rez1 * 10) / 10;

    let rjs =`{"promjena":"${rez1}%","greske":"identicni"}`;

    return rjs;

  }

  if(test==0){

    let test2=0;
    let br1=0;
    
    for(let i=0; i<pali1; i++){

      test2=0;
      let st="{"+obj1[i]+"}";
      const obj = JSON.parse(st);

      for(let j=0; j<ukupno2; j++){

        if(obj.status=="fail")

        if(obj.fullTitle==obj2.tests[j].fullTitle){

          test2=1;
          break;

        }

      }

      if(test2==0){
        br1++;
      }
    
    }

    let rez2 =  (br1+pali2)/(br1+ukupno2) * 100 ;
    rez2 = Math.round(rez2 * 10) / 10;
    
    let brr=0;
    let rjs2 =`{"promjena":"${rez2}%","greske":[`;

    for(let i=0; i<pali1; i++){

      test2=0;
      let st="{"+obj1[i]+"}";
      const obj = JSON.parse(st);

      for(let j=0; j<ukupno2; j++){

        if(obj.status=="fail")

        if(obj.fullTitle==obj2.tests[j].fullTitle){

          test2=1;
          break;

        }

      }

      if(test2==0){
       
        if(brr==0){
          rjs2+=`"${obj.fullTitle}"`;
        }
        else{
          rjs2+=`,"${obj.fullTitle}"`;
        }

        brr++;

      }

    }
  
    for(let element of obj2.failures){

      rjs2+=`,"${element.fullTitle}"`;
  
    }
  
    rjs2+=`]}`;

    return rjs2;

  }

}

}

module.exports.TestoviParser = TestoviParser;