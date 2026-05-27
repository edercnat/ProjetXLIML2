
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

//Fonction qui converti une fonction en un objet
function objOfFunction(fonction){
    const str_func = fonction.toString();
    //récupération des différents truc que l'on va mettre dans l'objet
    const funcName = fonction.name; //Nom
    const funcParameters =  (str_func.slice(str_func.indexOf('(') + 1, str_func.indexOf(')'))).split(","); //Paramètres (en liste)
    const funcCode = '{' + str_func.slice(str_func.indexOf('{') + 1); //Code de la fonction

    //On construit l'objet de retour
    let returnObj = {};
    returnObj["name"] = funcName;
    returnObj["parameters"] = funcParameters;
    returnObj["code"] = funcCode;

    return returnObj;
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
const result = new Function(objet2["parameters"], objet2["code"]);
result("aaaa", "bbbbb");
//On remarque que les sauts de lignes dans le code de la fonction sont bien ignorés lors de la reconstruction de la fonction et ne gênent donc pas

