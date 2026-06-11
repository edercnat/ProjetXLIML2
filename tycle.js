
//-------------------------------------------------------------
const DictionnairePrototypes = {};//Dico des protoypes utilisés
let buffer = new Map();
let compteur = 0;

//Fonction qui check si le prototype est déjà stocké dans le dico
function estDejaStocke(name, dico){
    for(const clef in dico){
        if(clef == name){
            return true;
        }
    }
    return false;
}

//Fonction qui permet de vérifier les types des valeurs désérialisées
function verifDeserialisation(objet){
    for(const val in objet){
        console.log("Val :", val, "\ntype :", typeof objet[val]);
    }
}

//-----------------------------------------------
//  Fonction replacer
//-----------------------------------------------


function replacer(clef, valeur){
    const objetOriginal = this[clef];

    //Si c'est nul et undefined, on renvoie la chaîne de caractères pour ne pas les ignorer et éviter les erreurs
    if(objetOriginal === null){
        return "__tycle_null";
    }
    else if(objetOriginal === undefined){
        return "__tycle_undefined";
    }

    //Si la valeur n'est pas stockée dans notre registre des constructeurs, on l'ajoute
    if(!estDejaStocke(this[clef].constructor.name, DictionnairePrototypes)){
        DictionnairePrototypes[objetOriginal.constructor.name] = objetOriginal.constructor;
    }
    //console.log("Sérialisation :", objetOriginal.constructor.name, clef, valeur);

    
    //Parfois valeur est déjà sérialisée (par exemple déjà en string pour une date)
    //On utilise donc this[clef] (this représentant l'objet parent) pour récupérer la valeur non sérialisée
    let valRetour = valeur;


        
    //Nos types primitifs sont les strings, listes et les objets de type dictionnaire.
    //On ne les traite donc pas
    //Condition peut être utile plus tard : Object.prototype.toString.call(objetOriginal) != "[object Object]"
    if(typeof objetOriginal != "string" && !Array.isArray(objetOriginal) && objetOriginal.constructor.name != "Object" && objetOriginal.constructor.name != "Boolean"){


        

        //Si la valeur n'est pas déjà sous forme {
        //     "constructeur" : constructeur,
        //     "valeur" : valeur originale
        // }
        //On le met sous cette forme avec 
        if(clef !== "__tycle_value" && clef !== "__tycle_prototype"){
            valRetour = {
                "__tycle_prototype" : objetOriginal.constructor.name,
                "__tycle_value" : objetOriginal
            }
        }
        
        //Si on est dans une valeur à traiter (donc avec la clef "valeur"), on la traite selon ce que l'on veut
        else if(clef === "__tycle_value"){

            let valSerialisee = Array.from(objetOriginal);
            //Si on peut la convertir en liste
            if(valSerialisee.length > 0){
                valRetour = valSerialisee;
            }
            //Sinon, on sérialise tout le reste sauf les object de type dictionnaire et les classes
            if(valSerialisee.length == 0 && Object.prototype.toString.call(objetOriginal) != "[object Object]"){
                if(objetOriginal.constructor.name === "Symbol"){
                    valRetour = objetOriginal.description;
                }
                else{
                    valRetour = valeur.toString();
                }
            }
        }
    }
    //On sérialise seulement les objets
    if(clef !== "__tycle_value" && clef !== "__tycle_prototype" && typeof objetOriginal === "object") {
        //Si on référence une valeur déjà enregistrée
        if(buffer.has(objetOriginal)) {
            return buffer.get(objetOriginal);
        } 
        //Sinon on l'ajoute au registre
        else {
            buffer.set(objetOriginal, ("__tycle_ref_" + compteur));
            compteur++;
        }
    }    
    return valRetour;
}

/**
 * Désérialisation d'un fichier JSON en JavaScript, en rétablissant tous les types et les références circulaires.
 * @param {string} clef 
 * @param {String | Object | Boolean} valeur La valeur brute en sortie de JSON.parse avant sa transformation par le reviver.
 * @returns Tous les types possibles.
 */
function reviver(clef, valeur){   
    // Gestion des cas particuliers null | undefined | -0
    if(valeur === "__tycle_null"){
        return null;
    }
    else if(valeur === "__tycle_undefined"){
        return undefined;
    }

    let valRetour = valeur;

    // Traite les cas où la valeur a été sérialisée par tycle
    if(valeur["__tycle_value"] && typeof valeur === "object"){
        const prototypeString = valeur["__tycle_prototype"];
        const valeurBrute = valeur["__tycle_value"];
        // Récupération du constructeur grâce au dictionnaire "DictionnairePrototypes"
        const constructeur = DictionnairePrototypes[prototypeString];

        // Levée d'erreur si aucun constructeur n'est trouvé
        if(!constructeur){
            console.log(`Erreur dans reviver pour le constructeur de ${prototypeString}, il n'est pas défini`);
            return valeurBrute;
        }

        try{
            // Recréation des types Number, BigInt, Symbol
            if(prototypeString === "Number" || prototypeString === "BigInt" || prototypeString === "Symbol"){
                valRetour = DictionnairePrototypes[prototypeString](valeurBrute);
            }
            else{
                // Dans le cas d'une création de class
                if(typeof valeurBrute === "object"){
                    valRetour = Object.create(DictionnairePrototypes[prototypeString].prototype);
                    Object.assign(valRetour, valeurBrute);
                }
                // Pour tous les autres types qui nécessitent un new pour la création
                else{
                    valRetour = new DictionnairePrototypes[prototypeString](valeurBrute);
                }

            }
        }
        catch(err){
            console.error(`Échec critique lors de l'instanciation de ${prototypeString} :`, err.message);
            return valeurBrute;
        }
        
    }
    
    return valRetour;
}

function serialize(obj, functionReplacer){
    buffer.clear();
    compteur = 0;
    const chaineJSON = JSON.stringify(obj, functionReplacer, 2);

    return chaineJSON;
}

 
/**
 * Fonction qui permet de remplacer les références par les objets référencés.
 * @param {*} obj Objet précédemment désérialisé par le reviver.
 * @returns Objet avec toutes les références recréées.
 */
function remplacementReference(obj){
    let valRetour = obj;
    // Si c'est un objet référençable, on l'ajoute au buffer et on augmente le compteur
    if(typeof valRetour == "object"){
        buffer.set(("__tycle_ref_" + compteur), valRetour);
        compteur++;
        // On rappelle la fonction sur chacun de ses fils
        for(const fils in valRetour){
            valRetour[fils] = remplacementReference(valRetour[fils]);
        }
    }
    // Si la valeur est la chaîne correspondant à "__tycle_ref_ID", alors on remplace la valeur par l'objet référencé
    else if(typeof valRetour === "string" && valRetour.includes("__tycle_ref_")){
        valRetour = buffer.get(valRetour);
    }

    return valRetour;
}

/**
 * Fonction de lancement de la désérialisation.
 * @param {String} chaineJSON 
 * @param {Function} functionReplacer 
 * @returns L'objet final entièrement recréé.
 */
function deserialize(chaineJSON, functionReplacer){    
    buffer.clear();
    compteur = 0;
    // Resérialisation des objets qui ne sont pas référencés
    let objRetour = JSON.parse(chaineJSON, functionReplacer);
    objRetour = remplacementReference(objRetour);
    return objRetour;
}




export { serialize, deserialize, replacer, reviver };