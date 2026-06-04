

//Classe de test
class Test {
    constructor(parameter) {
        this.age = 0;
        this.taille = 1.8;
        this.name = "Laurent";
    }

    nom(){
        return this.name;
    }

}

const date = new Date(8.64e15);
const map = new Map([["clef1", 1], ["clef2", 2]]);
const set = new Set();
const chaine = "chaine";
const test = new Test(1);
const objTest = {
    "date" : date,
    "map" : map,
    "set" : set,
    "chaine" : chaine,
    "test" : test
}
function replacer(clef, valeur){
    //Si on n'est pas dans la partie type
    if(clef != "valeur" && clef != "type"){
        const returnObject = {};
        returnObject["type"] = this[clef].constructor.name;
        returnObject["valeur"] = valeur;

        return returnObject;
    }
    
    return valeur;
}


function replacerAffiche(clef, valeur){
    console.log(clef, valeur, this[clef]);
    return valeur;
}
console.log(JSON.stringify(objTest, replacer, 2));
// console.log(map.toJSON == undefined);
// console.log(date.toJSON == undefined);
console.log(NaN.toString());