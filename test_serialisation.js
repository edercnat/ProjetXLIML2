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







function serialiser(param) {
    const data_JSON = {
        codeDeLaClasse: param.constructor.toString(),
        proprietes: param
    };
    return JSON.stringify(data_JSON, null, 2);
}


const hero = new Personnage();
const hero_ser = serialiser(hero);

fs.writeFileSync('calque_complet.json', hero_ser, 'utf8');