export { serialize, deserialize, XlimDataNode };


const DictionnairePrototypes = {};




function serialize(rootObj) {
    const seenMap = new Map();
    const registry = [];
    function traverse(obj) {
        if (obj === null)
        {
            return "__tycle_null";
        }
        if (obj === undefined)
        {
            return "__tycle_undefined";
        } 
        if (typeof obj !== 'object') {
            if (typeof obj === 'bigint') 
            {
                return { __tycle_bigint: obj.toString() };
            }
            if (typeof obj === 'symbol') 
            {
                return { __tycle_symbol: obj.toString() };
            }
            if (typeof obj === 'number') 
            {
                if (Number.isNaN(obj)) return "__tycle_NaN";
                if (obj === Infinity) return "__tycle_Infinity";
                if (obj === -Infinity) return "__tycle_-Infinity";
            }
            if (typeof obj === 'function')
            {
                return null;
            } 
            return obj;
        }
        if (seenMap.has(obj)) 
        {
            return { __refID: seenMap.get(obj) };
        }
        const id = registry.length;
        seenMap.set(obj, id);
        const isArray = Array.isArray(obj);
        const isSet = obj instanceof Set;
        const isMap = obj instanceof Map;
        const isDate = obj instanceof Date;
        const isRegex = obj instanceof RegExp;
        let constructorName = "Object";
        if (obj.constructor && obj.constructor.name) 
        {
            constructorName = obj.constructor.name;
        }
        const isCustomClass = !isArray && !isSet && !isMap && !isDate && !isRegex && constructorName !== "Object";
        if (isCustomClass && !DictionnairePrototypes[constructorName]) 
        {
            DictionnairePrototypes[constructorName] = Object.getPrototypeOf(obj);
        }
        let registryEntry;
        let clone;
        if (isDate) 
        {
            registryEntry = { __tycle_prototype: "Date", __tycle_value: obj.toISOString() };
            registry.push(registryEntry);
            return { __refID: id }; // Pas besoin de creuser dans une Date
        } 
        else if (isRegex) 
        {
            registryEntry = { __tycle_prototype: "RegExp", __tycle_value: { source: obj.source, flags: obj.flags } };
            registry.push(registryEntry);
            return { __refID: id };
        } 
        else if (isSet || isMap) 
        {
            clone = [];
            registryEntry = { __tycle_prototype: constructorName, __tycle_value: clone };
        } 
        else if (isCustomClass) 
        {
            clone = {};
            registryEntry = { __tycle_prototype: constructorName, __tycle_value: clone };
        } 
        else 
        {
            clone = isArray ? [] : {};
            registryEntry = clone;
        }

        registry.push(registryEntry);
        if (isSet) {
            obj.forEach(value => clone.push(traverse(value)));
        } 
        else if (isMap) 
        {
            obj.forEach((value, key) => clone.push([traverse(key), traverse(value)]));
        } 
        else 
        {
            for (const key in obj) 
            {
                if (Object.prototype.hasOwnProperty.call(obj, key)) 
                {
                    clone[key] = traverse(obj[key]);
                }
            }
        }
        return { __refID: id };
    }

    traverse(rootObj);
    return JSON.stringify(registry, null, 2);
}












function deserialize(jsonString) 
{
    const registry = JSON.parse(jsonString);
    if (!Array.isArray(registry))
    {
        return registry;
    }
    const instances = registry.map(entry => {
        if (entry && typeof entry === 'object' && entry.__tycle_prototype) 
        {
            const protoName = entry.__tycle_prototype;
            const val = entry.__tycle_value;

            if (protoName === "Date") return new Date(val);
            if (protoName === "RegExp") return new RegExp(val.source, val.flags);
            if (protoName === "Set") return new Set();
            if (protoName === "Map") return new Map();
            const proto = DictionnairePrototypes[protoName] || Object.prototype;
            return Object.create(proto);
        }
        // Types basiques
        return Array.isArray(entry) ? [] : {};
    });
    function resolveValue(val) 
    {
        if (val === "__tycle_null") return null;
        if (val === "__tycle_undefined") return undefined;
        if (val === "__tycle_NaN") return NaN;
        if (val === "__tycle_Infinity") return Infinity;
        if (val === "__tycle_-Infinity") return -Infinity;
        
        if (val && typeof val === 'object') 
        {
            if ('__tycle_bigint' in val) 
            {
                return BigInt(val.__tycle_bigint);
            }
            if ('__tycle_symbol' in val) 
            {
                const match = val.__tycle_symbol.match(/^Symbol\((.*)\)$/);
                return Symbol(match ? match[1] : "");
            }
            if ('__refID' in val) return instances[val.__refID];
        }
        return val;
    }

    // PASSE 2 : Remplissage (On peuple les coquilles en reliant les fils)
    registry.forEach((entry, i) => {
        const instance = instances[i];
        
        // Date et RegExp sont déjà totalement construites à la Passe 1
        if (instance instanceof Date || instance instanceof RegExp) return;

        // On isole les données à traiter (soit le conteneur plat, soit ce qu'il y a dans __tycle_value)
        const dataToMap = (entry && entry.__tycle_prototype) ? entry.__tycle_value : entry;

        if (instance instanceof Set) {
            dataToMap.forEach(item => instance.add(resolveValue(item)));
        } 
        else if (instance instanceof Map) {
            dataToMap.forEach(([k, v]) => instance.set(resolveValue(k), resolveValue(v)));
        } 
        else {
            for (const key in dataToMap) {
                if (Object.prototype.hasOwnProperty.call(dataToMap, key)) {
                    instance[key] = resolveValue(dataToMap[key]);
                }
            }
        }
    });

    // La racine du graphe est toujours à l'index 0
    return instances[0];
}
















class XlimDataNode {
    constructor(id) {
        this.id = id;
        // Les structures itérables natives (le pire cauchemar de for...in)
        this.connections = new Set();
        this.cache = new Map();
        // Les objets natifs complexes
        this.timestamp = new Date();
        this.regex = /[a-z]+/ig;
    }
}

// 1. Instanciation des noeuds
const rootNode = new XlimDataNode("ROOT_001");
const childA = new XlimDataNode("CHILD_A");
const childB = new XlimDataNode("CHILD_B");

// 2. Les symboles (Types uniques invisibles)
const secretKey = Symbol("clef_secrete");
rootNode[secretKey] = "Ceci est une donnée cachée par Symbol";
rootNode.symboleValeur = Symbol("identifiant_symbole");

// 3. Les anomalies mathématiques et primitives limites
rootNode.mathLimits = {
    infiniPositif: Infinity,
    infiniNegatif: -Infinity,
    nonNombre: NaN,
    grandEntier: 9007199254740991n // BigInt (avec le 'n')
};

// 4. Les types primitifs "vides"
rootNode.missing = undefined;
rootNode.void = null;

// 5. Remplissage des Set avec des références circulaires croisées
rootNode.connections.add(childA);
rootNode.connections.add(childB);
childA.connections.add(rootNode); // Boucle dans un Set !

// 6. Remplissage des Map avec des clés objets ET des boucles
rootNode.cache.set("string_key", childA);
rootNode.cache.set(childB, "Valeur pour une clé Objet"); // Clé complexe
childB.cache.set(rootNode, rootNode); // Boucle sur la clé ET la valeur d'une Map !

// 7. L'inclassable : Les fonctions
rootNode.compute = function() { return this.id; };