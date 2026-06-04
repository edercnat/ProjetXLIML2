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

    // Affichage de toutes les infos
    // console.log();
    // console.log("clef :", clef);
    // console.log("val :", valeur);
    // console.log("obj original :", objetOriginal);
    //On ne modifie pas le comportement des null, underfined, NaN et des objets natifs pour l'instant
    if(valeur == null || valeur == undefined || valeur == NaN || Object.getPrototypeOf(objetOriginal) === objetOriginal.prototype){
        return valeur;
    }
    //Si l'objet n'est pas traité nativement et qu'il n'est pas déjà traité
    if(!estTraiteNativement(objetOriginal)){
        const returnObject = {};
        const nomConstructeur = objetOriginal.constructor.name;
        
        //On ajoute la valeur dans le dico si elle n'a pas déjà été traitée
        if(!estDejaStocke(valeur.constructor,DictionnairePrototypes)){
            DictionnairePrototypes[nomConstructeur] = Object.getPrototypeOf(objetOriginal);
        }

        returnObject["constructeur"] = nomConstructeur;;
        console.log(objetOriginal);
        returnObject["valeur"] = [...objetOriginal];
        console.log("returnObject : ", returnObject["constructeur"], returnObject["valeur"]);
        return returnObject;
    }

    //On retourne la valeur de base si elle est traitée nativement ou déjà traité
    return valeur;
}

//-----------------------------------------------
//  Affichage et tests
//-----------------------------------------------
// const stringDate = JSON.stringify(date1, replacer);
// console.log(stringDate);
const stringTest = JSON.stringify(test1, replacer);
console.log(stringTest);
const mapTest = JSON.stringify(map1, replacer);
console.log(mapTest);
const nullTest = JSON.stringify(null1, replacer);

afficheDicoProto(DictionnairePrototypes);
console.log(estTraiteNativement(mapTest));