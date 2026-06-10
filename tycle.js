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


//  TESTS DE GEMINI PRIME 
// 1. Classe secondaire pour tester l'héritage et les cycles
class SousComposant {
    constructor(nom) {
        this.nom = nom;
        this.parent = null; // Accueillera une référence vers l'objet principal
    }
}

// 2. Classe principale contenant le "Crash Test"
class ObjetTestPrincipal {
    constructor() {
        // --- Primitives de base ---
        this.chaine = "Test de sérialisation";
        this.entier = 42;
        this.vrai = true;
        this.faux = false;

        // --- Le vide et l'absence ---
        this.valeurNulle = null;
        this.valeurNonDefinie = undefined;

        // --- Les Nombres spéciaux (qui cassent le JSON natif) ---
        this.notANumber = NaN;
        this.infiniPositif = Infinity;
        this.infiniNegatif = -Infinity;

        // --- Les Primitives complexes ---
        this.grandEntier = 9007199254740992n; // BigInt
        this.symboleCache = Symbol("symbole_secret");

        // --- Les Objets Natifs (nécessitant leur constructeur) ---
        this.dateAujourdhui = new Date();
        this.expressionReguliere = /tycle[0-9]+/gi;
        this.erreurFatale = new Error("Ceci est une erreur de test simulée");

        // --- Les Itérables et Structures ---
        this.tableauSimple = [1, "deux", false];
        this.tableauATrous = [1, , 3]; // Sparse array (tableau avec un <empty item>)
        
        this.maMap = new Map();
        this.maMap.set("clef_1", "Valeur Map 1");
        this.maMap.set("clef_2", 100);

        this.monSet = new Set();
        this.monSet.add("Valeur unique A");
        this.monSet.add("Valeur unique B");

        // --- RÉFÉRENCES CIRCULAIRES ---
        // 1. Cycle Bidirectionnel (Parent <-> Enfant)
        this.enfant = new SousComposant("Composant A");
        this.enfant.parent = this; 

        // 2. Auto-référence pure (L'objet pointe vers lui-même)
        this.cloneDeMoi = this; 
    }
}

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


function newID(){
    let nID = compteur;
    compteur++;
    return "__tycle_ref_" + nID;
}
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
    //Parfois valeur est déjà sérialisée (par exemple déjà en string pour une date)
    //On utilise donc this[clef] (this représentant l'objet parent) pour récupérer la valeur non sérialisée
    let valRetour = valeur;   
    //Nos types primitifs sont les strings, listes et les objets de type dictionnaire.
    //On ne les traite donc pas
    //Condition peut être utile plus tard : Object.prototype.toString.call(objetOriginal) != "[object Object]"
    if(typeof objetOriginal != "string" && !Array.isArray(objetOriginal) && objetOriginal.constructor.name != "Object" && objetOriginal.constructor.name != "Boolean"){

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
                if(objetOriginal.constructor.name === "Symbol"){
                    valRetour = objetOriginal.description;
                }
                else{
                    valRetour = valeur.toString();
                }
            }
        }
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

// instanceHeritier.bool = instanceHeritier;
// instanceHeritier.poches.set(["zzzzz", instanceHeritier.poches]);
console.log("---------------\n sérialisation \n ---------------\n")
const lastTest = new ObjetTestPrincipal();
//-------------------------------------------------------------
const DictionnairePrototypes = {};//Dico des protoypes utilisés
const instanceTest = new Test("james", "lebron");
const instanceHeritier = new TestHeritier();
let compteur = 0;
let buffer = new Map();
let etape = 0;
const stringJSON = JSON.stringify(lastTest, replacer, 2);
// console.log(stringJSON);

// console.log("-----------------\n buffer");
// console.log(buffer);
// console.log("Dico des prototypes");
// afficheDicoProto(DictionnairePrototypes);
buffer.clear();
compteur = 0;
etape = 0;
console.log("---------------\n désérialisation \n ---------------\n")

const objParse = JSON.parse(stringJSON, reviver);
// console.log("\n-----------------------------\nRésultat");
// console.log(objParse);
// console.log("-----------------\n buffer");
// console.log(buffer);
// verifDeserialisation(objParse);
