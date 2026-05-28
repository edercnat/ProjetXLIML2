const fs = require('fs');

function deserialiser(JSON_data) {
    const data = JSON.parse(JSON_data);
    if (!data.codeDeLaClasse) {
        throw new Error("Ce JSON ne contient pas de code de classe.");
    }
    const ClasseReconstruite = eval("(" + data.codeDeLaClasse + ")");
    return ClasseReconstruite;
}


const contenuJson = fs.readFileSync('calque_complet.json', 'utf8');
const Personnages = deserialiser(contenuJson);
const nouveauHero = new Personnages("Rémi", 99, 50);
const unAutreHero = new Personnages("Guerrier", 5, 10);
nouveauHero.attaquer(); 
unAutreHero.LevelUp();