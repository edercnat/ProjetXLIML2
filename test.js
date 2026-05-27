const fs = require('fs');  //sert a pouvoir crée un nouveau fichier


function deserialiserClasseComplete(JSON_data) {
    const data = JSON.parse(JSON_data);
    if (!data.est_une_classe)
    {
        return data;
    } 
    const nouveauPrototype = {};
    for (const [nomMethode, codeTexte] of Object.entries(data.methodes))
    {
        const codeCompile = eval("({" + codeTexte + "})"); 
        nouveauPrototype[nomMethode] = codeCompile[nomMethode];
    }
    const nouvelleInstance = Object.create(nouveauPrototype);
    Object.assign(nouvelleInstance, data.proprietes);
    return nouvelleInstance;
}

const contenuJson = fs.readFileSync('calque_personnage.json', 'utf8');


try {
    const data = fs.readFileSync('calque_personnage.json', 'utf8');
    const hero = deserialiserClasseComplete(data);
} catch (erreur) {
    console.error("Une erreur est survenue lors de la création du fichier :", erreur);
}

const hero2 = new Personnage(1,2,3);
hero2.attaquer();