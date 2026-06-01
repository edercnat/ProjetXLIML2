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

//Variables de test
const test1 = new Test();
const date1 = new Date();

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
const DictionnairePrototypes = {};//Dico des protoypes utilisés

function replacer(clef, valeur){
    if(clef == ""){
        returnObject = {};
        if(!estDejaStocke(valeur.constructor,DictionnairePrototypes)){
            DictionnairePrototypes[this[clef].constructor.name] = this[clef].constructor;
        }
        returnObject["id"] = this[clef].constructor.name;
        returnObject["value"] = valeur.toString();

        return returnObject;
    }

    return valeur;
}


const stringRetour = JSON.stringify(date1, replacer);

console.log(stringRetour);

//Affichage du dico
afficheDicoProto(DictionnairePrototypes);

const dateFin = new DictionnairePrototypes["Date"](JSON.parse(stringRetour)["value"]);
console.log(dateFin);

