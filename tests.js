//-----------------------------------------------
//  Variables globales
//-----------------------------------------------
//Variables de test et globales
const date = new Date("2026-06-08T13:10:39.688Z");
const regexp = new RegExp("mot");
const chaine = "chaine";
const symbol =  Symbol("symbol");
const erreur = new Error("Erreur de chad", {cause : "rémi le goat"});
const set = new Set(["Vallet", "Dame", "Roi"]);

//Classe de test
class Test {
    constructor(nomP, prenomP) {
        this.nom = nomP;
        this.prenom = prenomP;
        this.age = 0;
        this.poches = new Map([["Cartes", set], ["Aura", Infinity]]);
        this.dateNaissance = date;
        this.typesSpeciaux = [symbol, erreur, chaine, regexp, NaN, 200n, null, undefined];
        this.objet = {"nom" : "pierre"};
        this.bool = true;
        this.liste = [1,2,3,4];
    }

    fonctionIgnoree(){
        return "rien";
    }

    fonctionInutile(){
        console.log("Je sers à rien");
    }

}


class TestHeritier extends Test{
    constructor(){
        super("lebron", "james");
        this.particularite = "TOUT SIMPLEMENT GOAT";
    }
}

class Cycle{
    constructor(){
        this.a = 2;
        this.a = this.b;
        this.b= this.a;
    }
}

const objCycle = {
    "clef1" : 1,
    "clef2" : 1
}
objCycle["clef2"] = objCycle;
let buffer = new Map();

//-------------------------------------------------------------
const DictionnairePrototypes = {};//Dico des protoypes utilisés
const instanceTest = new Test("james", "lebron");
const instanceHeritier = new TestHeritier();
//-----------------------------------------------
//  Fonctions utiles pour tests et dévéloppement
//-----------------------------------------------
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

//Fonction d'affichage du dictionnaire des prototypes
function afficheDicoProto(dico){
    for(const clef in dico){
        console.log(clef, dico[clef]);
    }
}

//Fonction qui check si le prototype est déjà stocké dans le dico
function estDejaStocke(name, dico){
    for(const clef in dico){
        if(clef == name){
            return true;
        }
    }
    return false;
}

//Fonction qui permet de vérifier les types des valeurs désérialisées
function verifDeserialisation(objet){
    for(const val in objet){
        console.log("Val :", val, "\ntype :", typeof objet[val]);
    }
}

//-----------------------------------------------
//  Fonction replacer
//-----------------------------------------------
let compteur = 0;
function newID(){
    let nID = compteur;
    compteur++;
    return "__tycle_ref_" + nID;
}
function replacer(clef, valeur){
    let valRetour = valeur;
    console.log("\n LALDOKQSKF");
    console.log(clef);
    console.log(buffer);
    if(!(buffer.has(valeur))){
        buffer.set(valeur, newID(compteur));
    }
    else{
        valRetour = buffer.get(valRetour);
    }
    return valRetour;
}


//-----------------------------------------------
//  Reviver
//-----------------------------------------------
function reviver(clef, valeur){    
    //Permet de gérer les valeurs null et undefined
    if(valeur === "__tycle_null"){
        return null;
    }
    else if(valeur === "__tycle_undefined"){
        return undefined;
    }

    let valRetour = valeur;

    //Si la valeur a été sérialisée par nos soins
    if(valeur["__tycle_value"] && typeof valeur === "object"){
        const prototypeString = valeur["__tycle_prototype"];
        const valeurBrute = valeur["__tycle_value"];
        const constructeur = DictionnairePrototypes[prototypeString];

        if(!constructeur){
            console.log(`Erreur dans reviver pour le constructeur de ${prototypeString}, il n'est pas défini`);
            return valeurBrute;
        }
        try{
            if(prototypeString === "Number" || prototypeString === "BigInt" || prototypeString === "Symbol"){
                valRetour = DictionnairePrototypes[prototypeString](valeurBrute);
            }
            else{
                //Si c'est une classe
                if(typeof valeurBrute === "object"){
                    valRetour = Object.create(DictionnairePrototypes[prototypeString].prototype);
                    Object.assign(valRetour, valeurBrute);
                }
                else{
                    valRetour = new DictionnairePrototypes[prototypeString](valeurBrute);
                }
            }
        }
        catch(err){
            console.error(`Échec critique lors de l'instanciation de ${prototypeString} :`, err.message);
            return valeurBrute;
        }
        
    }
    return valRetour;
}


//-----------------------------------------------
//  Affichage et tests
//-----------------------------------------------




const stringJSON = JSON.stringify(objCycle, replacer, 2);
console.log(stringJSON);

// console.log("Dico des prototypes");
// // afficheDicoProto(DictionnairePrototypes);

// const objParse = JSON.parse(stringJSON, reviver);
// console.log("\n-----------------------------\nRésultat");
// console.log(objParse);

// verifDeserialisation(objParse);