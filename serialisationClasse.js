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
const date = new Date(8.64e15);
const set = new Set(["Vallet", "Dame", "Roi"]);
const map = new Map([["clef1", 1], ["clef2", 2], [set, 157657651786n, 6.7], [NaN, Infinity], [Infinity, -Infinity]]);
const regexp = new RegExp("mot");
const chaine = "chaine";
const test = new Test(1);
const symbol =  Symbol("symbol");
const erreur = new Error("Erreur de chad", {cause : "rémi le goat"});
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

//Fonction qui renvoie true si l'objet est traité nativement
function estTraiteNativement(obj){
    return typeof obj == "string" || 
    (typeof obj == "number" && isFinite(obj) && !isNaN(obj))||
    typeof obj == "boolean" ||
    typeof obj == "object" && obj.constructor.name == "Object"
}


//-----------------------------------------------
//  Fonction replacer
//-----------------------------------------------

// function replacerSave(clef, valeur){
//     //Parfois valeur est déjà sérialisée (par exemple déjà en string pour une date)
//     //On utilise donc this[clef] (this représentant l'objet parent) pour récupérer la valeur non sérialisée
//     const objetOriginal = this[clef];
//     let valRetour = valeur;

//     console.log("Sérialisation :", objetOriginal.constructor.name, clef, valeur);

//     if(!estTraiteNativement(objetOriginal)){
//         if(clef != "valeur" && clef != "constructeur" && !Array.isArray(objetOriginal)){
//             //On ajoute la valeur dans le dico si elle n'a pas déjà été traitée
//             if(!estDejaStocke(valeur.constructor,DictionnairePrototypes)){
//                 DictionnairePrototypes[this[clef].constructor.name] = Object.getPrototypeOf(objetOriginal);
//             }
//             return {
//                 "constructeur" : objetOriginal.constructor.name,
//                 "valeur" : valRetour
//             };
//         }

//         if(clef == "valeur"){            
//             valeurRetour = Array.from(objetOriginal);
//             if(valeurRetour.length > 0){
//                 return Array.from(objetOriginal);
//             }
//             else{
//                 if(typeof valeur != "object" || typeof valeur == "regexp"){
//                     valRetour = valeur.toString();
//                 }
//             }
//         }
//     }
//     //On retourne la valeur de base si elle est traitée nativement ou déjà traité
//     return valRetour;
// }


function replacer(clef, valeur){
    const objetOriginal = this[clef];
    
    //Si c'est nul et undefined, on renvoie la chaîne de caractères pour ne pas les ignorer et éviter les erreurs
    if(objetOriginal === null){
        return "null";
    }
    else if(objetOriginal === undefined){
        return "undefined";
    }
    //Si la valeur n'est pas stockée dans notre registre des constructeurs, on l'ajoute
    if(!estDejaStocke(this[clef].constructor.name, DictionnairePrototypes)){
        DictionnairePrototypes[objetOriginal.constructor.name] = Object.getPrototypeOf(objetOriginal);
    }
    //console.log("Sérialisation :", objetOriginal.constructor.name, clef, valeur);

    //Parfois valeur est déjà sérialisée (par exemple déjà en string pour une date)
    //On utilise donc this[clef] (this représentant l'objet parent) pour récupérer la valeur non sérialisée
    let valRetour = valeur;

    //Nos types primitifs sont les strings, listes et les objets de type dictionnaire.
    //On ne les traite donc pas
    if(typeof objetOriginal != "string" && !Array.isArray(objetOriginal) && Object.prototype.toString.call(objetOriginal) != "[object Object]"){

        

        //Si la valeur n'est pas déjà sous forme {
        //     "constructeur" : constructeur,
        //     "valeur" : valeur originale
        // }
        //On le met sous cette forme avec 
        if(clef != "valeur" && clef != "constructeur"){
            valRetour = {
                "constructeur" : objetOriginal.constructor.name,
                "valeur" : objetOriginal
            }
        }

        //Si on est dans une valeur à traiter (donc avec la clef "valeur"), on la traite selon ce que l'on veut
        else if(clef == "valeur"){
            let valSerialisee = Array.from(objetOriginal);
            //Si on peut la convertir en liste
            if(valSerialisee.length > 0){
                valRetour = valSerialisee;
            }
            //Sinon, on sérialise tout le reste sauf les object de type dictionnaire et les classes
            if(valSerialisee.length == 0 && valeur.constructor.name != "Object"){
                valRetour = valeur.toString();
            }
        }
    }
    return valRetour;
}


//-----------------------------------------------
//  Affichage et tests
//-----------------------------------------------


console.log(JSON.stringify(objTest, replacer, 2));

console.log("Dico des prototypes");
afficheDicoProto(DictionnairePrototypes);
// afficheAttributs(test);
// afficheAttributs(regexp);
// afficheAttributs(symbol);