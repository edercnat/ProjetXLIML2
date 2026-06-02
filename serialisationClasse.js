//-----------------------------------------------
//  Variables globales
//-----------------------------------------------
//Classe de test
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

//Variables de test et globales
const test1 = new Test();
const date1 = new Date();
const DictionnairePrototypes = {};//Dico des protoypes utilisés


//-----------------------------------------------
//  Fonctions utiles pour tests et traitement
//-----------------------------------------------
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

//Fonction qui renvoie true si l'objet n'est pas traité nativement
function pasTraiterNativement(objet){
    return typeof objet == "object" && objet.constructor.name != "Object"
}


//-----------------------------------------------
//  Fonction replacer
//-----------------------------------------------
function replacer(clef, valeur){
    //Parfois valeur est déjà sérialisée (par exemple déjà en string pour une date)
    //On utilise donc this[clef] (this représentant l'objet parent) pour récupérer la valeur non sérialisée
    if(pasTraiterNativement(this[clef])){
        returnObject = {};

        //On ajoute la valeur dans le dico si elle n'a pas déjà été traitée
        if(!estDejaStocke(valeur.constructor,DictionnairePrototypes)){
            DictionnairePrototypes[this[clef].constructor.name] = this[clef].constructor;
        }

        //Construction de l'objet sérialisé
        returnObject["id"] = this[clef].constructor.name;
        returnObject["value"] = valeur.toString();

        return returnObject;
    }

    //On retourne la valeur de base si elle est traitée nativement
    return valeur;
}

//-----------------------------------------------
//  Affichage et tests
//-----------------------------------------------
const stringDate = JSON.stringify(date1, replacer);
const stringTest = JSON.stringify(test1, replacer);

console.log(stringDate);
console.log(stringTest);

//Affichage du dico
//afficheDicoProto(DictionnairePrototypes);

//Désérialisation grossière
//const dateFin = new DictionnairePrototypes["Date"](JSON.parse(stringRetour)["value"]);
//console.log(dateFin);

