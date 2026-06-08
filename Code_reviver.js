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
const bint = 200n
const mmap = new Map([["Cartes", set], ["Aura", Infinity]]);
const oobjet = {"nom" : "pierre"}

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
    }

    fonctionIgnoree(){
        return "rien";
    }

    fonctionInutile(){
        console.log("Je sers à rien");
    }

}

class Personnage {
    constructor(pseudo, niveau, classeArmure) {
        this.pseudo = pseudo;
        this.niveau = niveau;
        this.classeArmure = classeArmure;
    }
    test()
    {
        console.log('Hello world');
    }
}

const hero = new Personnage("Arthur", 15, 5);


const instTeanceTest = new Test("Chan", "Jackie");
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

function reviver(clef, valeur) {

    console.log(clef);
    
    
    if (typeof valeur !== 'object' || valeur === null) {
        return valeur;
    }

    if ('__tycle_prototype' in valeur) {
        const constructor = DictionnairePrototypes[valeur.__tycle_prototype];
        console.log("prototype :")
        console.log(constructor)

        if (constructor) {
            if ('__tycle_value' in valeur) {
                const valeurBrute = valeur.__tycle_value;

                if (typeof valeurBrute === 'object' && valeurBrute !== null) {
                    Object.setPrototypeOf(valeurBrute, constructor.prototype);
                    return valeurBrute;
                }
                else if (constructor === Number || constructor === String || constructor === Boolean || constructor === BigInt || constructor === Symbol) {
                    return constructor(valeurBrute);
                
                } 
                else {
                    console.log("nooooooo")
                    return new constructor(valeurBrute);
                }
            } 
            
            else {
                Object.setPrototypeOf(valeur, constructor.prototype);
                delete valeur.__tycle_prototype;
                return valeur;
            }
            
        } else {
            console.error(`Erreur: le prototype "${valeur.__tycle_prototype}" n'est pas reconnu.`);
        }
    }

    return valeur;
}
//-----------------------------------------------
//  Affichage et tests
//-----------------------------------------------
console.log(hero);

const test_replacer = JSON.stringify( instTeanceTest, replacer, 2)
console.log(test_replacer);


const test_reviver = JSON.parse(test_replacer, reviver, 2)
console.log("objet recrée :")
console.log(test_reviver);
console.log(test_reviver.poches);



console.log("Dico des prototypes");
afficheDicoProto(DictionnairePrototypes);
// afficheAttributs(test);
// afficheAttributs(regexp);
// afficheAttributs(symbol);

console.log(test_reviver);

console.log(test_reviver.constructor.name);

function aaa(objet){
    for(const val in objet){
        console.log(val, typeof objet[val]);
    }
}

aaa(test_reviver);