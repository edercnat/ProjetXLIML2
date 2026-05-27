const fs = require('fs');  //sert a pouvoir crée un nouveau fichier


//------------------Class d'exemple---------------------------
class Personnage {
    constructor(pseudo, niveau, classeArmure) {
        this.pseudo = pseudo;
        this.niveau = niveau;
        this.classeArmure = classeArmure;
    }
    attaquer()
    {
        console.log(`${this.pseudo} lance une attaque !`);
    }
    LevelUp()
    {
        console.log(`${this.pseudo} est niveau ${this.niveau}, il va passer au niveau supérieur`);
        this.niveau++;
    }
}


//----------Fonction de serialisation-------------------

//Fonction Qui extrait les parametre d'un fonction donné
function extractNamesParameters(codeTexte) {
    const resultatRegex = codeTexte.match(/\(([^)]*)\)/);  //expression reguliere qui recupere le contenu de la premiere parenthese
    if (resultatRegex && resultatRegex[1]) {
        return resultatRegex[1].split(',').map(param => param.trim()).filter(p => p !== "");
        //       .split = Decoupe la chaine a chaque virgule
        //       .map = agis comme un boucle prend chaque argument precedament decouper
        //       .trim = enleve les espace
        //       .filter(...) = enlever les argument vide ("")
    }
    return []; 
}

//Fonction qui extrait le corp d'une fonction donnée
function extractCorpsFonction(codeTexte, nomMethode) {
    let texteAAnalyser = codeTexte;

    //probleme quand on cherche a recuperer le code du "constructor", on recuperer le code de la class entiere
    //ce if est pour regler ce probleme, en partant bien de constructor
    if (nomMethode === "constructor" && codeTexte.startsWith("class")) {
        const indexConstructor = codeTexte.indexOf("constructor"); //on cherche la position exacte du mot constructor
        if (indexConstructor !== -1) {
            texteAAnalyser = codeTexte.substring(indexConstructor); //enleve de textAAnalyser le code avant constructor
        } else {
            return ""; 
        }
    }

    //recuperation de la position de la premiere acolade, donc le debut du code de la fonction
    const premierIndex = texteAAnalyser.indexOf('{');
    if (premierIndex === -1) return "";

    //Initialisation du compteur d'acolade
    let compteurAccolades = 0;
    let dernierIndex = -1;

    // On fais une boucle caractère par caractère à partir de la première accolade en incrementant le compteur d'acolade
    //afin de ne pas s'arreter si il y a d'autre acolade a l'interieur (Ex: utilisation d'un if)
    for (let i = premierIndex; i < texteAAnalyser.length; i++) {
        if (texteAAnalyser[i] === '{') {
            compteurAccolades++;
        } else if (texteAAnalyser[i] === '}') {
            compteurAccolades--;
        }

        // Dès que le compteur retombe à 0, c'est que l'on as trouver l'acolade fermante
        if (compteurAccolades === 0) {
            dernierIndex = i;
            break;
        }
    }

    if (dernierIndex !== -1) {
        return texteAAnalyser.substring(premierIndex + 1, dernierIndex).trim(); //on ne garde que le corp et on met en forme avec trim
    }

    return "";
}

//-------main fonction pour la serialisation
function serialiserClasseComplete(param)
{
    const prototype = Object.getPrototypeOf(param);
    const nom_classe = prototype.constructor.name;
    const noms_methodes = Object.getOwnPropertyNames(prototype);

    const calqueMethodes = {};

    noms_methodes.forEach(nom => {
      const fonction = prototype[nom]; //On recupere le code de la fonction traité
      
      const codeTexte = fonction.toString(); //On transforme le code recuperer en string
    
      const parametres = extractNamesParameters(codeTexte); //Utilisation de la fonction extraireNomsParametres, pour recuperer
                                                            //tout les argument de la fonction

      const corps = extractCorpsFonction(codeTexte, nom);
      
      calqueMethodes[nom] = {  //On enregistre le résultat dans un objet special
          parametres: parametres,
          corps: corps
      };
    });

    const objetFinal = {
        nomDeLaClasse: nom_classe,
        methodes: calqueMethodes
    };

    const resultatString = JSON.stringify(objetFinal, null, 2);

    return resultatString;
}

const hero = new Personnage("Arthur", 12, 12);
const stringJsonText = serialiserClasseComplete(hero);

//-----ecriture en sorti d'un fichier JSON
try {
    // Paramètres : (Nom du fichier, Contenu à écrire, Encodage)
    fs.writeFileSync('calque_personnage.json', stringJsonText, 'utf8');
    console.log("Succès : Le fichier 'calque_personnage.json' a été généré !");
} catch (erreur) {
    console.error("Une erreur est survenue lors de la création du fichier :", erreur);
}


