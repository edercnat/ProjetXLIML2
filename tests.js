//-----------------------------------------------
//  Variables globales
//-----------------------------------------------

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
        // // --- Primitives de base ---
        // this.chaine = "Test de sérialisation";
        // this.entier = 42;
        // this.vrai = true;
        // this.faux = false;

        // // --- Le vide et l'absence ---
        // this.valeurNulle = null;
        // this.valeurNonDefinie = undefined;

        // // --- Les Nombres spéciaux (qui cassent le JSON natif) ---
        // this.notANumber = NaN;
        // this.infiniPositif = Infinity;
        // this.infiniNegatif = -Infinity;

        // // --- Les Primitives complexes ---
        // this.grandEntier = 9007199254740992n; // BigInt
        // this.symboleCache = Symbol("symbole_secret");

        // // --- Les Objets Natifs (nécessitant leur constructeur) ---
        // this.dateAujourdhui = new Date();
        // this.expressionReguliere = /tycle[0-9]+/gi;
        // this.erreurFatale = new Error("Ceci est une erreur de test simulée");

        // // --- Les Itérables et Structures ---
        this.tableauSimple = [1, "deux", false];
        this.tableauATrous = [1, , 3]; // Sparse array (tableau avec un <empty item>)
        
        // this.maMap = new Map();
        // this.maMap.set("clef_1", "Valeur Map 1");
        // this.maMap.set("clef_2", 100);

        // this.monSet = new Set();
        // this.monSet.add("Valeur unique A");
        // this.monSet.add("Valeur unique B");

        // --- RÉFÉRENCES CIRCULAIRES ---
        // 1. Cycle Bidirectionnel (Parent <-> Enfant)
        this.enfant = new SousComposant("Composant A");
        this.enfant.parent = this; 
        this.copyDeFou = this.tableauATrous;
        // 2. Auto-référence pure (L'objet pointe vers lui-même)
        this.cloneDeMoi = this; 
    }
}
//-------------------------------------------------------------
const DictionnairePrototypes = {};//Dico des protoypes utilisés

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


// function newID(){
//     let nID = compteur;
//     compteur++;
//     return "__tycle_ref_" + nID;
// }

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
    if(typeof objetOriginal != "string" && !Array.isArray(objetOriginal) && objetOriginal.constructor.name != "Object" && objetOriginal.constructor.name != "Boolean"){


        

        //Si la valeur n'est pas déjà sous forme {
        //     "constructeur" : constructeur,
        //     "valeur" : valeur originale
        // }
        //On le met sous cette forme avec 
        if(clef !== "__tycle_value" && clef !== "__tycle_prototype"){
            valRetour = {
                "__tycle_prototype" : objetOriginal.constructor.name,
                "__tycle_value" : objetOriginal
            }
        }
        
        //Si on est dans une valeur à traiter (donc avec la clef "valeur"), on la traite selon ce que l'on veut
        else if(clef === "__tycle_value"){

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
    //On sérialise seulement les objets
    if(clef !== "__tycle_value" && clef !== "__tycle_prototype" && typeof objetOriginal === "object") {
        //Si on référence une valeur déjà enregistrée
        if(buffer.has(objetOriginal)) {
            return buffer.get(objetOriginal);
        } 
        //Sinon on l'ajoute au registre
        else {
            buffer.set(objetOriginal, ("__tycle_ref_" + compteur));
            compteur++;
        }
    }
    
    
    return valRetour;
}

const lastTest = new ObjetTestPrincipal();


let compteur = 0;
let buffer = new Map();

// console.log("---------------\n sérialisation \n ---------------\n")
// let etape = 0;
const stringJSON = JSON.stringify(lastTest, replacer, 2);
console.log(stringJSON);

console.log("-----------------\n buffer");
console.log(buffer);
// console.log("Dico des prototypes");
// afficheDicoProto(DictionnairePrototypes);
// buffer.clear();
// etape = 0;
// console.log("---------------\n désérialisation \n ---------------\n")

// const objParse = JSON.parse(stringJSON, reviver);
// console.log("\n-----------------------------\nRésultat");
// console.log(objParse);
// console.log("-----------------\n buffer");
// console.log(buffer);



// verifDeserialisation(objParse);
