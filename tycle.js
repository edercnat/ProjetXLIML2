//-----------------------------------------------
//  Variables globales
//-----------------------------------------------
//Buffer et compteur qui nous sert à calculer les identifiants et à gérer les références
let buffer = new Map();
let compteur = 0;
//Dictionnaire des prototypes que l'on va utiliser
const DictionnairePrototypes = {};//Dico des protoypes utilisés

/**
 * Fonction qui vérifie si le constructeur des instances traitées sont bien déjà référencées dans le dictionnaire
 * @param  {[string]} name Nom du constructeur qui agit comme la clef de ce dernier.
 * @param  {[Object]} dico Dictionnaire qui répertorie tous les constructeurs.
 * @return {[boolean]} Retourne true si l'objet est déjà stocké dans le dictionnaire, false sinon
 */
function estDejaStocke(name, dico){
    for(const clef in dico){
        if(clef == name){
            return true;
        }
    }
    return false;
}

/**
 * Fonction passée en paramètre de JSON.strinfigy pour sérialiser les objets non-traités nativement pas Javascript
 * Elle décompose les objets non-natifs sous forme 
 * {
 *      "__tycle_prototype" : ID du prototype de l'objet dans le dictionnaire
 *      "__tycle_value" : valeur sérialisée en string
 * }
 * Les objets référencés sont eux remplacés par un identifiant de type :
 *  "__tycle_instance_XXXX" avec XXXX représentant la position de l'objet lors du traitement descendant de l'arbre
 * 
 * Cette fonction traduit tous les types en valeur primitives (bool, string ou Object de type dictionnaire).
 * Les nombres sont traités différemment pour pouvoir sérialiser les NaN et Infinity.
 * @param {[string]} clef Normalement un string qui est la clef menant à la valeur à sérialiser
 * @param {*} valeur Valeur à sérialiser qui peut être déjà modifiée(notamment pour les dates). On prefèrera donc utiliser this[clef] (this étant l'objet parent) qui donne l'objet non retouché
 * @returns Retourne la valeur sérialisée selon notre format spécifié au dessus 
 */
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
    //Parfois valeur est déjà sérialisée (par exemple déjà en string pour une date)
    //On utilise donc this[clef] (this représentant l'objet parent) pour récupérer la valeur non sérialisée
    let valRetour = valeur;
    //Nos types primitifs sont les strings, listes et les objets de type dictionnaire.
    //On ne les traite donc pas
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
            buffer.set(objetOriginal, ("__tycle_instance_" + compteur));
            compteur++;
        }
    }    
    return valRetour;
}
/**
 * Fonction qui permet de sérialiser les objets en JSON, elle remet le buffer et le compteur d'ID à zéro
 * @param {*}  obj Objet à sérialiser 
 * @param {*} functionReplacer Fonction replacer que l'on passe en paramètre de cette fonction, elle sera mise en paramètre lors de l'appel à stringify
 * @returns Elle retourne l'objet entièrement sérialisé en format JSON. La map contient les objets en clef et leur identifiants en valeur.
 */
function serialize(obj, functionReplacer){
    buffer.clear();
    compteur = 0;
    const chaineJSON = JSON.stringify(obj, functionReplacer, 2);
    return chaineJSON;
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

    // Traite les cas où la valeur a été mis en forme par le replacer, donc comportant les argument "__tycle_prototype" et "__tycle_value"
    if(valeur["__tycle_value"] && typeof valeur === "object"){
        //Recuperation de __tycle_value et __tycle_prototype
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
                valRetour = constructeur(valeurBrute);
            }
            else{
                // Dans le cas d'une recréation de class
                if(typeof valeurBrute === "object"){
                    valRetour = Object.create(constructeur.prototype);
                    Object.assign(valRetour, valeurBrute);
                }
                // Pour tous les autres types qui nécessitent un new pour la création
                else{
                    valRetour = new constructeur(valeurBrute);
                }

            }
        }
        //Levée d'erreur si l'objet posseder un type mais que l'on as pas reussie a le recrée
        catch(err){
            console.error(`Échec critique lors de l'instanciation de ${prototypeString} :`, err.message);
            return valeurBrute;
        }
        
    }
    
    return valRetour;
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
 * Fonction de lancement de la désérialisation, elle clear le Buffer et remets à 0 le compteur.
 * @param {String} chaineJSON 
 * @param {Function} functionReplacer 
 * @returns Elle retourne l'objet entierement deserialiser
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

