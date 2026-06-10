//#region Tycle.js
var e = {};
function t(t) {
	let n = /* @__PURE__ */ new Map(), r = [];
	function i(t) {
		if (t === null) return "__tycle_null";
		if (t === void 0) return "__tycle_undefined";
		if (typeof t != "object") {
			if (typeof t == "bigint") return { __tycle_bigint: t.toString() };
			if (typeof t == "symbol") return { __tycle_symbol: t.toString() };
			if (typeof t == "number") {
				if (Number.isNaN(t)) return "__tycle_NaN";
				if (t === Infinity) return "__tycle_Infinity";
				if (t === -Infinity) return "__tycle_-Infinity";
			}
			return typeof t == "function" ? null : t;
		}
		if (n.has(t)) return { __refID: n.get(t) };
		let a = r.length;
		n.set(t, a);
		let o = Array.isArray(t), s = t instanceof Set, c = t instanceof Map, l = t instanceof Date, u = t instanceof RegExp, d = "Object";
		t.constructor && t.constructor.name && (d = t.constructor.name);
		let f = !o && !s && !c && !l && !u && d !== "Object";
		f && !e[d] && (e[d] = Object.getPrototypeOf(t));
		let p, m;
		if (l) return p = {
			__tycle_prototype: "Date",
			__tycle_value: t.toISOString()
		}, r.push(p), { __refID: a };
		if (u) return p = {
			__tycle_prototype: "RegExp",
			__tycle_value: {
				source: t.source,
				flags: t.flags
			}
		}, r.push(p), { __refID: a };
		if (s || c ? (m = [], p = {
			__tycle_prototype: d,
			__tycle_value: m
		}) : f ? (m = {}, p = {
			__tycle_prototype: d,
			__tycle_value: m
		}) : (m = o ? [] : {}, p = m), r.push(p), s) t.forEach((e) => m.push(i(e)));
		else if (c) t.forEach((e, t) => m.push([i(t), i(e)]));
		else for (let e in t) Object.prototype.hasOwnProperty.call(t, e) && (m[e] = i(t[e]));
		return { __refID: a };
	}
	return i(t), JSON.stringify(r, null, 2);
}
function n(t) {
	let n = JSON.parse(t);
	if (!Array.isArray(n)) return n;
	let r = n.map((t) => {
		if (t && typeof t == "object" && t.__tycle_prototype) {
			let n = t.__tycle_prototype, r = t.__tycle_value;
			if (n === "Date") return new Date(r);
			if (n === "RegExp") return new RegExp(r.source, r.flags);
			if (n === "Set") return /* @__PURE__ */ new Set();
			if (n === "Map") return /* @__PURE__ */ new Map();
			let i = e[n] || Object.prototype;
			return Object.create(i);
		}
		return Array.isArray(t) ? [] : {};
	});
	function i(e) {
		if (e === "__tycle_null") return null;
		if (e !== "__tycle_undefined") {
			if (e === "__tycle_NaN") return NaN;
			if (e === "__tycle_Infinity") return Infinity;
			if (e === "__tycle_-Infinity") return -Infinity;
			if (e && typeof e == "object") {
				if ("__tycle_bigint" in e) return BigInt(e.__tycle_bigint);
				if ("__tycle_symbol" in e) {
					let t = e.__tycle_symbol.match(/^Symbol\((.*)\)$/);
					return Symbol(t ? t[1] : "");
				}
				if ("__refID" in e) return r[e.__refID];
			}
			return e;
		}
	}
	return n.forEach((e, t) => {
		let n = r[t];
		if (n instanceof Date || n instanceof RegExp) return;
		let a = e && e.__tycle_prototype ? e.__tycle_value : e;
		if (n instanceof Set) a.forEach((e) => n.add(i(e)));
		else if (n instanceof Map) a.forEach(([e, t]) => n.set(i(e), i(t)));
		else for (let e in a) Object.prototype.hasOwnProperty.call(a, e) && (n[e] = i(a[e]));
	}), r[0];
}
var r = class {
	constructor(e) {
		this.id = e, this.connections = /* @__PURE__ */ new Set(), this.cache = /* @__PURE__ */ new Map(), this.timestamp = /* @__PURE__ */ new Date(), this.regex = /[a-z]+/gi;
	}
}, i = new r("ROOT_001"), a = new r("CHILD_A"), o = new r("CHILD_B"), s = Symbol("clef_secrete");
i[s] = "Ceci est une donnée cachée par Symbol", i.symboleValeur = Symbol("identifiant_symbole"), i.mathLimits = {
	infiniPositif: Infinity,
	infiniNegatif: -Infinity,
	nonNombre: NaN,
	grandEntier: 9007199254740991n
}, i.missing = void 0, i.void = null, i.connections.add(a), i.connections.add(o), a.connections.add(i), i.cache.set("string_key", a), i.cache.set(o, "Valeur pour une clé Objet"), o.cache.set(i, i), i.compute = function() {
	return this.id;
};
//#endregion
export { r as XlimDataNode, n as deserialize, t as serialize };
