//-----------------------------------------------
//  Variables globales
//-----------------------------------------------
//Variables de test et globales
const date = new Date(8.64e15);
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
    }

    fonctionIgnoree(){
        return "rien";
    }

    fonctionInutile(){
        console.log("Je sers à rien");
    }

}

const instanceTest = new Test("Chan", "Jackie");
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

//-----------------------------------------------
//  Fonction replacer
//-----------------------------------------------

function replacer(clef, valeur){
    const objetOriginal = this[clef];
    
    //Si c'est nul et undefined, on renvoie la chaîne de caractères pour ne pas les ignorer et éviter les erreurs
    if(objetOriginal === null){
        return "__tycle_null";
    }
    else if(objetOriginal === undefined){
        return "__tycle_undefined";
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
        if(clef != "__tycle_value" && clef != "__tycle_prototype"){
            valRetour = {
                "__tycle_prototype" : objetOriginal.constructor.name,
                "__tycle_value" : objetOriginal
            }
        }

        //Si on est dans une valeur à traiter (donc avec la clef "valeur"), on la traite selon ce que l'on veut
        else if(clef == "__tycle_value"){
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


console.log(JSON.stringify(instanceTest, replacer, 2));

console.log("Dico des prototypes");
afficheDicoProto(DictionnairePrototypes);
// afficheAttributs(test);
// afficheAttributs(regexp);
// afficheAttributs(symbol);


//-----------------------------------------------
//  reviver
//-----------------------------------------------
function reviver(clef, valeur){
    if(valeur == "underfined"){
        return undefined;
    }
    else if (valeur == "null"){
        return null;
    }

    if(clef == "valeur"){
        return new DictionnairePrototypes[this["constructeur"]]
    }
}