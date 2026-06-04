//-----------------------------------------------
//  Variables globales
//-----------------------------------------------
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

//Variables de test et globales
let iterationReplacer = 0;
const test1 = new Test();
const date1 = new Date();
const map1 = new Map();
const null1 = null;
map1.set("val1", 1);
const DictionnairePrototypes = {};//Dico des protoypes utilisés


//-----------------------------------------------
//  Fonctions utiles pour tests et traitement
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
        console.log(clef);
    }
}

//Fonction qui check si le prototype est déjà stocké dans le dico
function estDejaStocke(proto, dico){
    for(clef in dico){
        if(clef == proto.name){
            return true;
        }
    }
    return false;
}

//Fonction qui renvoie true si l'objet est traité nativement
function estTraiteNativement(obj){
    return typeof obj == "string" || 
    (typeof obj == "number" && isFinite(obj) && !isNaN(obj))||
    typeof obj == "boolean" ||
    typeof obj == "object" && obj.constructor.name == "Object"
}


//Fonction qui transforme une instance en dictionnaire de clef : valeur avec tous ses attributs
function objOfInstance(inst){
    const returnObject = {};
    for(const clef in inst){
        returnObject[clef] = inst[clef];
    }
    return returnObject;
}



//-----------------------------------------------
//  Fonction replacer
//-----------------------------------------------
function replacer(clef, valeur){
    //Parfois valeur est déjà sérialisée (par exemple déjà en string pour une date)
    //On utilise donc this[clef] (this représentant l'objet parent) pour récupérer la valeur non sérialisée
    const objetOriginal = this[clef];
    
    //On ajoute la valeur dans le dico si elle n'a pas déjà été traitée
    if(!estDejaStocke(valeur.constructor,DictionnairePrototypes)){
        DictionnairePrototypes[this[clef].constructor.name] = Object.getPrototypeOf(objetOriginal);
    }

    if(clef != "valeur" && clef != "constructeur"){
        const returnObject = {};
        returnObject["constructeur"] = this[clef].constructor.name;
        returnObject["valeur"] = valeur;

        return returnObject;
    }


    //On retourne la valeur de base si elle est traitée nativement ou déjà traité
    return valeur;
}

//-----------------------------------------------
//  Affichage et tests
//-----------------------------------------------
const date = new Date(8.64e15);
const map = new Map([["clef1", 1], ["clef2", 2]]);
const set = new Set(["Vallet", "Dame", "Roi"]);
const chaine = "chaine";
const test = new Test(1);
const objTest = {
    "date" : date,
    "map" : map,
    "set" : set,
    "chaine" : chaine,
    "test" : test
}

console.log(JSON.stringify(objTest, replacer, 2));

afficheDicoProto(DictionnairePrototypes);