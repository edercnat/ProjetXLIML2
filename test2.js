const fs = require('fs');



class Personnage {
    constructor(pseudo, niveau, classeArmure) {
        this.pseudo = pseudo;
        this.niveau = niveau;
        this.classeArmure = classeArmure;
    }
    attaquer() 
    {
        console.log(` ${this.pseudo} lance une attaque !`);
        console.log(`coucou`);
        console.log("salut");
    }
    LevelUp()
    {
        console.log(`${this.pseudo} est niveau ${this.niveau}, il va passer au niveau supérieur`);
        this.niveau++;
    }
    EstMort(pseudo)
    {
        console.log("oui");
    }
}






<<<<<<< Updated upstream
function serialiserPourLeNew(param) {
=======
function serialiser(param) {
>>>>>>> Stashed changes
    const data_JSON = {
        codeDeLaClasse: param.constructor.toString(),
        proprietes: param
    };
    return JSON.stringify(data_JSON, null, 2);
}


const hero = new Personnage();
<<<<<<< Updated upstream
const hero_ser = serialiserPourLeNew(hero);
=======
const hero_ser = serialiser(hero);
>>>>>>> Stashed changes
fs.writeFileSync('calque_complet.json', hero_ser, 'utf8');










<<<<<<< Updated upstream
function importerClasseDepuisJSON(JSON_data) {
=======
function deserialiser(JSON_data) {
>>>>>>> Stashed changes
    const data = JSON.parse(JSON_data);
    if (!data.codeDeLaClasse) {
        throw new Error("Ce JSON ne contient pas de code de classe.");
    }
    const ClasseReconstruite = eval("(" + data.codeDeLaClasse + ")");
    return ClasseReconstruite;
}



const contenuJson = fs.readFileSync('calque_complet.json', 'utf8');
<<<<<<< Updated upstream
const Personnages = importerClasseDepuisJSON(contenuJson);
const nouveauHero = new Personnages("Rémi", 99, 50);
const unAutreHero = new Personnages("Guerrier", 5, 10);
nouveauHero.attaquer(); 
unAutreHero.LevelUp();
=======
const Personnages = deserialiser(contenuJson);
const nouveauHero = new Personnages("Rémi", 99, 50);
const unAutreHero = new Personnages("Guerrier", 5, 10);
nouveauHero.attaquer(); 
unAutreHero.LevelUp();
>>>>>>> Stashed changes
