const fs = require('fs');  //sert a pouvoir crée un nouveau fichier

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


function serialiserClasseComplete(param) 
{
    const prototype = Object.getPrototypeOf(param);
    const methodesTexte = {};
    console.log(Object.getOwnPropertyNames(prototype));
    Object.getOwnPropertyNames(prototype).forEach(nom => 
    {
            if (nom !== "constructor" && typeof prototype[nom] === "function") 
            {
                methodesTexte[nom] = prototype[nom].toString();
                // console.log(prototype[nom].toString());
                // console.log("\n");
            }
    });
    const data_JSON = 
    {
        est_une_classe : true,
        className: param.constructor.name,
        constructor : param.constructor.toString(),
        proprietes: param,
        methodes: methodesTexte
    };
    return JSON.stringify(data_JSON, null,2);
}


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


console.log("\n");
const hero = new Personnage(1,12, 12);
const hero_ser = serialiserClasseComplete(hero);

try {
    // Paramètres : (Nom du fichier, Contenu à écrire, Encodage)
    fs.writeFileSync('calque_personnage.json', hero_ser, 'utf8');
    console.log("Succès : Le fichier 'calque_personnage.json' a été généré !");
} catch (erreur) {
    console.error("Une erreur est survenue lors de la création du fichier :", erreur);
}

const hero_Deser = deserialiserClasseComplete(hero_ser);
console.log(hero_Deser);
console.log("\n");
// hero_Deser.LevelUp();
// hero_Deser.est