
//-------------------------------------
//  Sérialisation de Map
//-------------------------------------
const map1 = new Map([["clef1", "val1"], ["clef2", "val2"]]);
//Fonction qui permet de convertir une map en un objet
function objOfMap(map){
    const returnObject = {};
    for(const clef of map.keys()){
        returnObject[clef] = map.get(clef);
    }
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

//On récupère la fonction et on voit si ça marche
const result = registreFonctions[objet2["name"]];
//On remarque que les sauts de lignes dans le code de la fonction sont bien ignorés lors de la reconstruction de la fonction et ne gênent donc pas
result("lala","lele");
//-------------------------------------
//  Tests d'utilisation avec le
//  paramètre replacer
//-------------------------------------

//Objet nous permettant de faire des tests sur nos avancées actuelles
let obj3 = {
    "val" : 1,
    "val1" : "unechaine",
    "map" : map1,
    "fonction" : testeur
}

//Fonction replacer qui sera appelée dans notre JSON.stringify
function replacer1(clef, valeur){
    if(typeof valeur == 'function'){
        return objOfFunction(valeur);
    }
    else if(valeur instanceof Map){
        return objOfMap(valeur);
    }
    else{
        return valeur;
    }
}

const strReplacer = JSON.stringify(obj3, replacer1);
console.log(strReplacer);

const lala = '\\de';