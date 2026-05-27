const mapTest = new Map([["clef1", "val1"], ["clef2", "val2"]]);
const objetTest = {};
for(const clef of mapTest.keys()){
    objetTest[clef] = mapTest.get(clef);
}
console.log(JSON.stringify(objetTest));

//Fonction qui permet de convertir une map en un objet
function objOfMap(map){
    const returnObject = {};
    for(const clef of map.keys()){
        returnObject[clef] = map.get(clef);
    }
    return returnObject
}