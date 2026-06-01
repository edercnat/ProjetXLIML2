class Test {
    constructor() {
        this.age = 20;
        this.taille = 1.8;
        this.name = "Laurent";
    }

    nom(){
        return this.name;
    }
}


const test1 = new Test();
const date1 = new Date();

const DictionnairePrototypes = {};

DictionnairePrototypes[date1.constructor.name] = date1.constructor;

DictionnairePrototypes[test1.constructor.name] = test1.constructor;

const returnObject = {}
returnObject["prototype"] = date1.constructor.name;
returnObject["value"] = date1.toString();


console.log(JSON.stringify(returnObject));

const datefin =  new DictionnairePrototypes["Date"](returnObject["value"]);

console.log(datefin);
console.log(typeof date1);