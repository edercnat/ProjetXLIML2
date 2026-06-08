const fs = require('fs');
class Test {
    constructor(parameter)
    {
        this.age = 0;
        this.taille = 1.8;
        this.name = "Laurent";
    }
    nom()
    {
        return this.name;
    }
}
const date = new Date(8.64e15);
const set = new Set(["Vallet", "Dame", "Roi"]);
const map = new Map([["clef1", 1], ["clef2", 2], [set, 157657651786n], [NaN, Infinity], [Infinity, -Infinity]]);
const regexp = new RegExp("mot");
const chaine = "chaine";
const test = new Test(1);
const symbol =  Symbol("symbol");
const erreur = new Error("Erreur", {cause : "rémi"});
const objTest = {
    "date" : date,
    "map" : map,
    "set" : set,
    "chaine" : chaine,
    "test" : test,
    "regexp" : regexp,
    "symbol" : symbol,
    "erreur" : erreur,
    "null" : null,
    "undefined" : undefined
}



const DictionnairePrototypes = {};





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




function afficheDicoProto(dico){
    for(const clef in dico){
        console.log(clef);
    }
}




function estDejaStocke(name, dico){
    for(clef in dico){
        if(clef == name){
            return true;
        }
    }
    return false;
}




function estTraiteNativement(obj){
    return typeof obj == "string" || 
    (typeof obj == "number" && isFinite(obj) && !isNaN(obj))||
    typeof obj == "boolean" ||
    typeof obj == "object" && obj.constructor.name == "Object"
}



function replacer(clef, valeur){
    const objetOriginal = this[clef];
    if(objetOriginal === null)
    {
        return "null";
    }
    else if(objetOriginal === undefined)
    {
        return "undefined";
    }
    if(!estDejaStocke(this[clef].constructor.name, DictionnairePrototypes))
    {
        DictionnairePrototypes[objetOriginal.constructor.name] = objetOriginal.prototype
    }
    let valRetour = valeur;
    if(typeof valeur != "string" && !Array.isArray(valeur) && Object.prototype.toString.call(valeur) != "[object Object]")
    {
        if(clef != "__tycle_value" && clef != "__tycle_constructor")
        {
            valRetour = {
                "__tycle_constructor" : objetOriginal.constructor.name,
                "__tycle_value" : objetOriginal
            }
        }
        else if(clef == "valeur"){
            let valSerialisee = Array.from(objetOriginal);
            if(valSerialisee.length > 0)
            {
                valRetour = valSerialisee;
            }
            if(valSerialisee.length == 0 && valeur.constructor.name != "Object")
            {
                valRetour = valeur.toString();
            }
        }
    }
    return valRetour;
}





function reviver(clef, valeur){
    if(valeur != null)
    {
        if(values.__tycle_constructor)
        {

        }
    }
}





let coucou = JSON.stringify(objTest, replacer, 2);
let coucou_des = JSON.parse(coucou, 2);

fs.writeFileSync('calque_personnage.json', coucou, 'utf8');

// console.log(objTest);
// console.log("\n  retour à la ligne \n");
console.log(coucou);
// console.log("\n  retour à la ligne \n");
// console.log(coucou_des);
