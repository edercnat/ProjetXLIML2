const objTest = {
    "Clef1" : "val1",
    "Clef2" : "val2",
    "Date" : new Date()
}

const date = new Date(8.64e15);
const map = new Map([["clef1", 1], ["clef2", 2]]);
const set = new Set();


function replacer(clef, valeur){
    if(pasTraiterNativement(this[clef])){
        console.log("DATE");
    }
    //console.log("clef:", clef,"\n valeur :", valeur,"\n this : ",this);
    //console.log(this[clef].constructor.name, valeur.constructor.name);
}


//JSON.stringify(date, replacer);
//console.log(typeof date, date.constructor.name);

//console.log(JSON.stringify(date));

//console.log(typeof true, typeof 1, typeof "lala", typeof [1,2]);

//Classe de test
class Test {
    constructor(la, ne) {
        this.age = 0;
        this.taille = 1.8;
        this.name = "Laurent";
    }

    nom(){
        return this.name;
    }

}

//Variables de test et globales
const test1 = new Test(1,2);
function estTraiteNativement(obj){
    return typeof obj == "string" || 
    (typeof obj == "number" && isFinite(obj) && !isNaN(obj))||
    typeof obj == "boolean" ||
    typeof obj == "object" && obj.constructor.name == "Object";
}

//console.log(estTraiteNativement(NaN));

//console.log(objTest.toString());
//console.log(isFinite("lala"));

function afficheAttributs(val){
    console.log("\n");
    console.log("Nom constructeur", val.constructor.name);
    console.log("Typeof", typeof val);
    console.log("toString", val.toString());
    console.log("Keys", Object.keys(val));
    console.log("Value", val.values);
    console.log("paramètre", val);
    console.log("Tag", Object.prototype.toString.call(val));
}

function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

function serialiserTest(obj){
   if(isIterable(obj)){
        return [...obj];
   }
   else {return Number(obj);}
}



//afficheAttributs(date);
//afficheAttributs(test1);
//afficheAttributs(set);
//afficheAttributs(map);
//afficheAttributs(objTest);
console.log(serialiserTest(map));
console.log(serialiserTest(date));
console.log(Array.isArray([2,3]));

function estTraiteNativement(obj){
    return typeof obj == "string" || 
    (typeof obj == "number" && isFinite(obj) && !isNaN(obj))||
    typeof obj == "boolean" ||
    typeof obj == "object" && obj.constructor.name == "Object" ||
    typeof Array.isArray(obj);
}
console.log(Array.isArray(estTraiteNativement([2,3])));

