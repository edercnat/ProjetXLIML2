import { describe, it, expect } from 'vitest';
import { serialize, deserialize } from './tycle.js';

// --- Classes de test ---
class Node { constructor(id) { this.id = id; this.edges = []; } }
class Animal { constructor(name) { this.name = name; } crier() { return "Grr"; } }
class Chien extends Animal { constructor(name, race) { super(name); this.race = race; } aboyer() { return "Wouf"; } }
class DataWrapper { constructor(data) { this.data = data; } }

describe('Tycle - Batterie complète de tests (25 cas)', () => {

    describe('Section 1 : Les bases (Types Primitifs et Natifs) [1-5]', () => {
        it('1. Doit gérer les entiers et flottants', () => {
            const data = { a: 42, b: -10.5, c: 0, d: -0 };
            expect(deserialize(serialize(data))).toEqual(data);
        });

        it('2. Doit gérer les chaînes de caractères complexes', () => {
            const data = { vide: "", normal: "texte", special: "éàç!@#\n\t", emoji: "🔥" };
            expect(deserialize(serialize(data))).toEqual(data);
        });

        it('3. Doit gérer les booléens', () => {
            const data = { vrai: true, faux: false };
            expect(deserialize(serialize(data))).toEqual(data);
        });

        it('4. Doit gérer nul et undefined dans des structures', () => {
            const data = { a: null, b: undefined, c: [null, undefined] };
            const restored = deserialize(serialize(data));
            expect(restored.a).toBeNull();
            expect(restored.b).toBeUndefined();
            expect(restored.c[0]).toBeNull();
            expect(restored.c[1]).toBeUndefined();
        });

        it('5. Doit gérer BigInt et Symbol', () => {
            const sym = Symbol("mon_symbole");
            const data = { grandNombre: 9007199254740991n, symbole: sym };
            const restored = deserialize(serialize(data));
            expect(typeof restored.grandNombre).toBe('bigint');
            expect(restored.grandNombre).toBe(9007199254740991n);
            // Les symboles perdent leur unicité à la sérialisation, on vérifie juste la restauration
            expect(typeof restored.symbole).toBe('symbol');
            expect(restored.symbole.description).toBe("mon_symbole");
        });
    });

    describe('Section 2 : Structures standards et imbrications [6-10]', () => {
        it('6. Doit gérer les tableaux simples et imbriqués', () => {
            const data = [1, [2, 3], [[4]]];
            expect(deserialize(serialize(data))).toEqual(data);
        });

        it('7. Doit gérer les dictionnaires imbriqués', () => {
            const data = { a: { b: { c: { d: 1 } } } };
            expect(deserialize(serialize(data))).toEqual(data);
        });

        it('8. Doit gérer les objets contenant des tableaux et inversement', () => {
            const data = { liste: [{ id: 1 }, { id: 2 }] };
            expect(deserialize(serialize(data))).toEqual(data);
        });

        it('9. Doit préserver les instances de Date', () => {
            const date = new Date("2026-06-11T12:00:00Z");
            const restored = deserialize(serialize({ d: date }));
            expect(restored.d).toBeInstanceOf(Date);
            expect(restored.d.getTime()).toBe(date.getTime());
        });

        it('10. Doit gérer les tableaux denses avec des valeurs vides (sparse arrays)', () => {
            const arr = [1, , 3]; // Le deuxième élément n'est pas défini
            const restored = deserialize(serialize(arr));
            expect(restored.length).toBe(3);
            expect(restored[0]).toBe(1);
            expect(restored[2]).toBe(3);
        });
    });

    describe('Section 3 : Prototypes et Objets personnalisés [11-15]', () => {
        it('11. Doit conserver le prototype d\'une classe simple', () => {
            const animal = new Animal("Lion");
            const restored = deserialize(serialize(animal));
            expect(restored).toBeInstanceOf(Animal);
            expect(restored.name).toBe("Lion");
        });

        it('12. Doit conserver le prototype avec de l\'héritage', () => {
            const dog = new Chien("Rex", "Berger");
            const restored = deserialize(serialize(dog));
            expect(restored).toBeInstanceOf(Chien);
            expect(restored).toBeInstanceOf(Animal);
            expect(restored.name).toBe("Rex");
            expect(restored.race).toBe("Berger");
        });

        it('13. Doit lier les méthodes de la classe après restauration', () => {
            const dog = new Chien("Rex", "Berger");
            const restored = deserialize(serialize(dog));
            expect(restored.aboyer()).toBe("Wouf");
            expect(restored.crier()).toBe("Grr"); // Hérité
        });

        it('14. Doit gérer de multiples instances de la même classe sans mélanger', () => {
            const a1 = new Animal("A");
            const a2 = new Animal("B");
            const restored = deserialize(serialize([a1, a2]));
            expect(restored[0].name).toBe("A");
            expect(restored[1].name).toBe("B");
            expect(restored[0]).not.toBe(restored[1]);
        });

        it('15. Doit traiter correctement les paramètres passés au constructeur custom', () => {
            const obj = new DataWrapper({ x: 10, y: 20 });
            const restored = deserialize(serialize(obj));
            expect(restored).toBeInstanceOf(DataWrapper);
            expect(restored.data).toEqual({ x: 10, y: 20 });
        });
    });

    describe('Section 4 : Graphes de mémoire et Références (Buffer) [16-20]', () => {
        it('16. Doit conserver une référence partagée (pas de duplication)', () => {
            const shared = { valeur: 42 };
            const obj = { a: shared, b: shared };
            const restored = deserialize(serialize(obj));
            expect(restored.a).toBe(restored.b); // Doit pointer vers la MÊME adresse mémoire
        });

        it('17. Doit résoudre une référence circulaire directe', () => {
            const a = { nom: "A" };
            a.self = a;
            const restored = deserialize(serialize(a));
            expect(restored.self).toBe(restored);
        });

        it('18. Doit résoudre une référence circulaire dans un tableau', () => {
            const arr = [1, 2];
            arr.push(arr);
            const restored = deserialize(serialize(arr));
            expect(restored[2]).toBe(restored);
        });

        it('19. Doit résoudre un graphe complexe et croisé avec des classes', () => {
            const n1 = new Node("1");
            const n2 = new Node("2");
            const n3 = new Node("3");
            n1.edges.push(n2, n3);
            n2.edges.push(n3, n1);
            n3.edges.push(n1);

            const restored = deserialize(serialize(n1));
            expect(restored.id).toBe("1");
            expect(restored.edges[0].id).toBe("2");
            expect(restored.edges[0].edges[1]).toBe(restored); // n2 pointe vers n1
            expect(restored.edges[1]).toBe(restored.edges[0].edges[0]); // L'instance n3 est partagée
        });

        it('20. Doit réussir la désérialisation séquentielle de multiples cycles (test d\'état global)', () => {
            const obj1 = {}; obj1.self = obj1;
            const obj2 = {}; obj2.self = obj2;
            
            // Si le buffer n'est pas bien nettoyé, ce test explose
            deserialize(serialize(obj1));
            const restored2 = deserialize(serialize(obj2));
            expect(restored2.self).toBe(restored2);
        });
    });
    describe('Section 5 : Les Failles et Crash Tests de l\'Algorithme [21-26]', () => {
        it('21. Faille Prototype : Objet sans prototype natif (Object.create(null))', () => {
            // Un tel objet n'a pas de `.constructor`. Ton code "this[clef].constructor.name" va planter.
            const objSansProto = Object.create(null);
            objSansProto.clef = "valeur";
            
            expect(() => serialize(objSansProto)).not.toThrow();
            const restored = deserialize(serialize(objSansProto));
            expect(restored.clef).toBe("valeur");
        });
        it('22. Faille Native : Structure Map (Perte des données ou crash reviver)', () => {
            // Map n'est pas un Object standard. Object.create(Map.prototype) + Object.assign ne suffit pas.
            const carte = new Map();
            carte.set("clef", "valeur");
            
            const restored = deserialize(serialize({ c: carte }));
            expect(restored.c).toBeInstanceOf(Map);
            expect(restored.c.get("clef")).toBe("valeur");
        });
        it('23. Faille Native : Structure Set (Perte des données)', () => {
            const ensemble = new Set([1, 2, 3]);
            const restored = deserialize(serialize({ s: ensemble }));
            
            expect(restored.s).toBeInstanceOf(Set);
            expect(restored.s.has(2)).toBe(true);
        });
        it('24. Faille Native : Objets Error (La pile d\'exécution)', () => {
            // Les propriétés d'une Error (message, stack) sont souvent non énumérables
            const err = new Error("Mon erreur système");
            const restored = deserialize(serialize(err));
            
            expect(restored).toBeInstanceOf(Error);
            expect(restored.message).toBe("Error: Mon erreur système");
        });
        it('25. Faille d\'Injection : Collision de clés réservées (Tycle poisoning)', () => {
            // Si un utilisateur stocke légitimement des données dans une clé portant le même nom que tes balises internes
            const objMalveillant = {
                "__tycle_value": "Je suis un hacker",
                "__tycle_prototype": "Array",
                "normal": true
            };
            const restored = deserialize(serialize(objMalveillant));
            expect(restored.normal).toBe(true);
            expect(typeof restored).toBe("object");
            expect(Array.isArray(restored)).toBe(false); // Ne doit pas être converti en tableau par erreur
        });
        it('26. Faille Native : Structure Map (perte de data sur Map)', () => {
            const mp = new Map();
            const ensemble = new Set([1, 2, 3]);
            mp.set("clef", ensemble);
            const restored = deserialize(serialize(mp));
            expect(restored).toBeInstanceOf(Map);
            expect(restored.has("clef")).toBe(true);
            const restoredSet = restored.get("clef");
            expect(restoredSet).toBeInstanceOf(Set);
            expect(restoredSet.size).toBe(3);
            expect(restoredSet.has(1)).toBe(true);
            expect(restoredSet.has(2)).toBe(true);
            expect(restoredSet.has(3)).toBe(true);
            expect(restored).not.toBe(mp);
            expect(restoredSet).not.toBe(ensemble);
        });
    });
    describe('Section 6 : Les Failles et Crash Tests de l\'Algorithme sur des classes complexes [27]', () => {
        it('27. Faille De l\'algo : Classe complexe niv pro (test ref circ, héritage, ref inst, map, set,...', () => {
            class SousComposant {
                constructor(nom) {
                    this.nom = nom;
                    this.parent = null;
                }
            }
            class ObjetTestPrincipal {
                constructor() {
                    // // --- Primitives de base ---
                    this.chaine = "Test de sérialisation";
                    this.entier = 42;
                    this.vrai = true;
                    this.faux = false;

                    // --- Le vide et l'absence ---
                    this.valeurNulle = null;
                    this.valeurNonDefinie = undefined;

                    // --- Les Nombres spéciaux (qui cassent le JSON natif) ---
                    this.notANumber = NaN;
                    this.infiniPositif = Infinity;
                    this.infiniNegatif = -Infinity;

                    // --- Les Primitives complexes ---
                    this.grandEntier = 9007199254740992n; // BigInt
                    this.symboleCache = Symbol("symbole_secret");

                    // --- Les Objets Natifs (nécessitant leur constructeur) ---
                    this.dateAujourdhui = new Date();
                    this.expressionReguliere = /tycle[0-9]+/gi;
                    this.erreurFatale = new Error("Ceci est une erreur de test simulée");

                    // // --- Les Itérables et Structures ---
                    this.tableauSimple = [1, "deux", false];
                    this.tableauATrous = [1, , 3]; // Sparse array (tableau avec un <empty item>)
                    
                    this.maMap = new Map();
                    this.maMap.set("clef_1", "Valeur Map 1");
                    this.maMap.set("clef_2", 100);

                    this.monSet = new Set();
                    this.monSet.add("Valeur unique A");
                    this.monSet.add("Valeur unique B");

                    // --- RÉFÉRENCES CIRCULAIRES ---
                    // 1. Cycle Bidirectionnel (Parent <-> Enfant)
                    this.enfant = new SousComposant("Composant A");
                    this.enfant.parent = this; 
                    this.copyDeFou = this.tableauATrous;
                    // 2. Auto-référence pure (L'objet pointe vers lui-même)
                    this.cloneDeMoi = this; 
                }
            }
            const objOriginal = new ObjetTestPrincipal();
            const restored = deserialize(serialize(objOriginal));

            // --- 1. Intégrité de la classe principale ---
            expect(restored).toBeInstanceOf(ObjetTestPrincipal);
            expect(restored).not.toBe(objOriginal); // Garantit que c'est une vraie copie profonde, pas l'objet d'origine

            // --- 2. Primitives de base ---
            expect(restored.chaine).toBe("Test de sérialisation");
            expect(restored.entier).toBe(42);
            expect(restored.vrai).toBe(true);
            expect(restored.faux).toBe(false);

            // --- 3. Le vide et l'absence ---
            expect(restored.valeurNulle).toBeNull();
            expect(restored.valeurNonDefinie).toBeUndefined();

            // --- 4. Primitives complexes ---
            expect(typeof restored.grandEntier).toBe("bigint");
            expect(restored.grandEntier).toBe(9007199254740992n);
            expect(typeof restored.symboleCache).toBe("symbol");
            expect(restored.symboleCache.description).toBe("symbole_secret");

            // --- 5. Objets Natifs complexes ---
            expect(restored.dateAujourdhui).toBeInstanceOf(Date);
            expect(restored.dateAujourdhui.getTime()).toBe(objOriginal.dateAujourdhui.getTime());
            expect(restored.erreurFatale).toBeInstanceOf(Error);
            expect(restored.erreurFatale.message).toBe("Error: Ceci est une erreur de test simulée");

            // --- 6. Itérables et Structures ---
            expect(restored.tableauSimple).toEqual([1, "deux", false]);
            expect(restored.tableauATrous.length).toBe(3);
            expect(restored.tableauATrous[0]).toBe(1);
            expect(restored.tableauATrous[1]).toBeUndefined();
            expect(restored.tableauATrous[2]).toBe(3);

            expect(restored.maMap).toBeInstanceOf(Map);
            expect(restored.maMap.get("clef_1")).toBe("Valeur Map 1");
            expect(restored.maMap.get("clef_2")).toBe(100);

            expect(restored.monSet).toBeInstanceOf(Set);
            expect(restored.monSet.has("Valeur unique A")).toBe(true);
            expect(restored.monSet.has("Valeur unique B")).toBe(true);

            // --- 7. RÉFÉRENCES CIRCULAIRES ET POINTEURS (Le plus critique) ---
            
            // A. Vérification de l'instance enfant
            expect(restored.enfant).toBeInstanceOf(SousComposant);
            expect(restored.enfant.nom).toBe("Composant A");
            
            // B. Le cycle enfant -> parent
            // L'enfant doit pointer vers l'instance "restored" elle-même, et non une nouvelle copie !
            expect(restored.enfant.parent).toBe(restored);

            // C. Référence partagée
            // copyDeFou et tableauATrous doivent partager la MÊME adresse mémoire
            expect(restored.copyDeFou).toBe(restored.tableauATrous);

            // D. Auto-référence pure
            // L'objet pointe vers lui-même
            expect(restored.cloneDeMoi).toBe(restored);


            // --- 8. LES NOMBRES SPÉCIAUX ET REGEX (Crash tests attendus) ---
            expect(Number.isNaN(restored.notANumber)).toBe(true);
            expect(restored.infiniPositif).toBe(Infinity);
            expect(restored.infiniNegatif).toBe(-Infinity);

            expect(restored.expressionReguliere).toBeInstanceOf(RegExp);
            expect(restored.expressionReguliere.source).toBe("\\/tycle[0-9]+\\/gi");
        });
    });
});