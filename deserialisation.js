const fs = require('fs');

const jsonTexte = fs.readFileSync('calque_personnage.json', 'utf8');

const calqueData = JSON.parse(jsonTexte);

//function de reconstruction
function reconstruireClasse(calque) {
    // On isole les données du constructeur
    const constructeurDef = calque.methodes.constructor;

    const ConstructeurDynamique = new Function(...constructeurDef.parametres, constructeurDef.corps);
    
    Object.defineProperty(ConstructeurDynamique, 'name', { value: calque.nomDeLaClasse });

    for (const [nomMethode, details] of Object.entries(calque.methodes)) {
        if (nomMethode === 'constructor') continue;
        const methodeReconstruite = new Function(...details.parametres, details.corps);
        ConstructeurDynamique.prototype[nomMethode] = methodeReconstruite;
    }
    return ConstructeurDynamique;
}



console.log("Reconstruction de la classe à partir du JSON...");
const ClassePersonnageReconstruite = reconstruireClasse(calqueData);

const nouveauHero = new ClassePersonnageReconstruite("Lancelot", 5, 20);

console.log(nouveauHero);

nouveauHero.attaquer();
nouveauHero.LevelUp(2, 50);