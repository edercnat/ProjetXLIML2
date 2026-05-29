
//-------------------------------------
//  Sérialisation de Map
//-------------------------------------
const map1 = new Map([["clef1", "val1"], ["clef2", "val2"]]);
//Fonction qui permet de convertir une map en un objet
function objOfMap(map){
    const returnObject= {};
    const mapObject = {};
    for(const clef of map.keys()){
        mapObject[clef] = map.get(clef);
    }

    returnObject["type"] = "Map";
    returnObject["valeur"] = mapObject;
    return returnObject
}

//Exemple de conversion d'une map en un objet sans tag
const objet1 = objOfMap(map1);
console.log(JSON.stringify(objet1));

//-------------------------------------
//  Sérialisations des fonctions
//-------------------------------------
let registreFonctions = {}; // Notre registre pour les fonctions
//Fonction qui converti une fonction en un objet
function objOfFunction(fonction){
    let returnObjet = {}; //Objet de retour

    registreFonctions[fonction.name] = fonction;
    returnObjet["type"] = "function";
    returnObjet["name"] = fonction.name;

    return returnObjet;
}

//Exemple de conversion de la fonction en un objet sans tag
//Fonction pour tester
function testeur(chaine, useless){
    console.log(chaine);
    console.log(useless);
}

//Sérialisation
const objet2 = objOfFunction(testeur);
console.log(JSON.stringify(objet2));

//On récupère la fonction depuis le registre et on voit si ça marche
const result = registreFonctions[objet2["name"]];
result("lala","lele");


//-------------------------------------
//  Gestion des valeurs constantes
//  non-traitées
//-------------------------------------

//On utilise un ID pour chaque type :
const ID_NAN = "\&NaN";
const ID_UNDEFINED = "\&undefined";
const ID_INFINITY = "\&Infinity";
const ID_MINUSINFINITY = "\&-Infinity";
const ID_NULL = "\&null";


//-------------------------------------
//  Tests d'utilisation avec le
//  paramètre replacer
//-------------------------------------

//Objet nous permettant de faire des tests sur nos avancées actuelles
let obj3 = {
    "val" : 1,
    "val1" : "unechaine",
    "map" : map1,
    "fonction" : testeur,
    "const1" : NaN,
    "const2" : -Infinity
}

//Fonction replacer qui sera appelée dans notre JSON.stringify
function replacer1(clef, valeur){
    if(typeof valeur == 'function'){
        return objOfFunction(valeur);
    }
    else if(valeur instanceof Map){
        return objOfMap(valeur);
    }
    //Pour les types constants
    else if(Number.isNaN(valeur)){
        return ID_NAN;
    }
    else if(valeur == -Infinity){
        return ID_MINUSINFINITY;
    }
    else if(valeur == Infinity){
        return ID_INFINITY;
    }
    else if(valeur == undefined){
        return ID_UNDEFINED;
    }
    else if(valeur == null){
        return ID_NULL;
    }
    else{
        return valeur;
    }
}

const strReplacer = JSON.stringify(obj3, replacer1);
console.log(strReplacer);


//On regarde le registre des fonctions à la fin
//console.log(registreFonctions["testeur"].toString());

