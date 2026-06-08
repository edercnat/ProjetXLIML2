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

//Fonction qui permet de vérifier les types des valeurs désérialisées
function verifDeserialisation(objet){
    for(const val in objet){
        console.log("Val :", val, "\ntype :", typeof objet[val]);
    }
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
        DictionnairePrototypes[objetOriginal.constructor.name] = objetOriginal.constructor;
    }
    //console.log("Sérialisation :", objetOriginal.constructor.name, clef, valeur);

    //Parfois valeur est déjà sérialisée (par exemple déjà en string pour une date)
    //On utilise donc this[clef] (this représentant l'objet parent) pour récupérer la valeur non sérialisée
    let valRetour = valeur;

    //Nos types primitifs sont les strings, listes et les objets de type dictionnaire.
    //On ne les traite donc pas
    //Condition peut être utile plus tard : Object.prototype.toString.call(objetOriginal) != "[object Object]"
    if(typeof objetOriginal != "string" && !Array.isArray(objetOriginal) && objetOriginal.constructor.name != "Object"){

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
            if(valSerialisee.length == 0 && Object.prototype.toString.call(objetOriginal) != "[object Object]"){
                valRetour = valeur.toString();
            }
        }
    }
    return valRetour;
}


//-----------------------------------------------
//  Affichage et tests
//-----------------------------------------------
class testSimple{
    constructor(){
        this.nom = "tra";
        this.prenom = "lala";
    }
}

const obj = {
    "nom" : "tom",
    "prenom" : "popo",
    "age" : 2,
    "date" : date,
    "num" : NaN,
    "bigint" : 2314n,
    "set" : set
}
const stringJSON = JSON.stringify(instanceTest, replacer, 2);
// console.log(stringJSON);

//console.log("Dico des prototypes");
//afficheDicoProto(DictionnairePrototypes);



//-----------------------------------------------
//  reviver
//-----------------------------------------------
function reviver(clef, valeur){
    // console.log(clef);
    //Affichages de test
    // console.log("--------------------------------------");
    // console.log("clef :", clef, "\nvaleur : :", valeur);
    // console.log("objet parent:", this);
    
    //Permet de gérer les valeurs null et undefined
    if(valeur === "__tycle_null"){
        return null;
    }
    else if(valeur === "__tycle_undefined"){
        return undefined;
    }

    let valRetour = valeur;

    //Si la valeur a été sérialisée par nos soins
    if(valeur["__tycle_value"] && clef != ""){
        const strProto = valeur["__tycle_prototype"];
        if(strProto == "Number" || strProto == "Symbol" || strProto == "BigInt" || strProto == "Boolean"){
            valRetour = DictionnairePrototypes[strProto](valeur["__tycle_value"]);
        }
        else{
            valRetour = new DictionnairePrototypes[strProto](valeur["__tycle_value"]);
        }
    }
    return valRetour;

}

const objParse = JSON.parse(stringJSON, reviver);
console.log("\n-----------------------------\nRésultat");
console.log(objParse);

verifDeserialisation(objParse);
