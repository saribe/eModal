import e from "bootstrap/js/dist/modal";
//#region src/index.ts
var t = {
	title: "Attention",
	closeButton: !0,
	centered: !0,
	scrollable: !0,
	focus: !0,
	keyboard: !0,
	backdrop: !0,
	loadingHtml: "<div class=\"d-flex align-items-center gap-3\"><div class=\"spinner-border text-primary\" role=\"status\" aria-hidden=\"true\"></div><strong>Loading...</strong></div>"
}, n;
function r() {
	if (typeof document > "u") throw Error("eModal can only open dialogs in a browser environment.");
}
function i(e, t) {
	return typeof e == "string" || e instanceof Node ? {
		message: e,
		title: t
	} : {
		...e,
		title: e.title ?? t
	};
}
function a(e, t) {
	if (typeof t == "string") {
		e.innerHTML = t;
		return;
	}
	t && e.append(t);
}
function o(e, t, n) {
	let r = document.createElement(e);
	return t && (r.className = t), n && (r.textContent = n), r;
}
function s(e) {
	return !!(e && typeof e.then == "function");
}
function c(e) {
	let n = o("div", `modal fade ${e.className ?? ""}`.trim());
	n.tabIndex = -1, n.setAttribute("aria-hidden", "true");
	let r = ["modal-dialog"];
	e.size && r.push(`modal-${e.size}`), e.fullscreen && r.push("modal-fullscreen"), (e.centered ?? t.centered) && r.push("modal-dialog-centered"), (e.scrollable ?? t.scrollable) && r.push("modal-dialog-scrollable");
	let i = o("div", r.join(" ")), s = o("div", "modal-content"), c = o("div", "modal-header"), l = o("div"), u = o("h5", "modal-title", e.title ?? t.title);
	if (l.append(u), e.subtitle && l.append(o("div", "modal-subtitle text-body-secondary small", e.subtitle)), c.append(l), e.closeButton ?? t.closeButton) {
		let e = o("button", "btn-close");
		e.type = "button", e.setAttribute("aria-label", "Close"), e.setAttribute("data-bs-dismiss", "modal"), c.append(e);
	}
	let d = o("div", `modal-body ${e.bodyClassName ?? ""}`.trim());
	a(d, e.message);
	let f = o("div", "modal-footer");
	return s.append(c, d, f), i.append(s), n.append(i), document.body.append(n), {
		element: n,
		body: d,
		footer: f
	};
}
function l(i, a = [{
	text: "Close",
	variant: "primary",
	dismiss: !0
}]) {
	r();
	let l = {
		...t,
		...i
	}, u = c(l), d = e.getOrCreateInstance(u.element, {
		backdrop: l.backdrop,
		focus: l.focus,
		keyboard: l.keyboard
	}), f = !1, p, m, h = new Promise((e, t) => {
		p = e, m = t;
	}), g = () => d.hide(), _ = (e) => {
		f || (f = !0, p(e));
	}, v = (e) => {
		f || (f = !0, m(e));
	}, y = {
		element: u.element,
		modal: d,
		close: g,
		resolve: _,
		reject: v
	}, b = l.buttons === !1 ? [] : l.buttons ?? a;
	if (b.length === 0) u.footer.remove();
	else for (let e of b) {
		let t = o("button", `btn btn-${e.variant ?? "primary"}`, e.text);
		t.type = "button", e.dismiss !== !1 && t.setAttribute("data-bs-dismiss", "modal"), e.autofocus && (t.autofocus = !0);
		for (let [n, r] of Object.entries(e.attributes ?? {})) t.setAttribute(n, r);
		t.addEventListener("click", () => {
			try {
				let t = e.onClick?.(y), n = (t) => {
					let n = t ?? e.value;
					e.reject ? v(n) : _(n);
				};
				if (s(t)) {
					t.then(n).catch(v);
					return;
				}
				n(t);
			} catch (e) {
				v(e);
			}
		}), u.footer.append(t);
	}
	return u.element.addEventListener("hidden.bs.modal", () => {
		f || _(void 0), d.dispose(), u.element.remove(), n === h && (n = void 0);
	}), Object.assign(h, {
		element: u.element,
		modal: d,
		close: g,
		settle: _,
		fail: v
	}), n = h, d.show(), h;
}
function u(e) {
	return l(e);
}
function d(e, t) {
	return l(i(e, t), [{
		text: "OK",
		variant: "primary",
		value: void 0,
		autofocus: !0
	}]);
}
function f(e, t) {
	return l(i(e, t), [{
		text: "Cancel",
		variant: "secondary",
		value: !1,
		reject: !0
	}, {
		text: "Confirm",
		variant: "primary",
		value: !0,
		autofocus: !0
	}]);
}
function p(e, t) {
	r();
	let n = typeof e == "string" ? {
		label: e,
		title: t
	} : {
		...e,
		title: e.title ?? t
	}, i = o("form"), a = `emodal-input-${Math.random().toString(36).slice(2)}`, s = o("label", "form-label", n.label ?? "Value");
	s.setAttribute("for", a);
	let c = o("input", "form-control");
	c.id = a, c.name = "value", c.value = n.defaultValue ?? "", c.placeholder = n.placeholder ?? "", c.required = n.required ?? !1, i.append(s, c);
	let u = l({
		...n,
		message: i,
		buttons: [{
			text: "Cancel",
			variant: "secondary",
			value: "",
			reject: !0
		}, {
			text: "Submit",
			variant: "primary",
			autofocus: !0,
			onClick: () => {
				if (i.reportValidity()) return c.value;
			}
		}]
	}, []);
	return i.addEventListener("submit", (e) => {
		e.preventDefault(), i.reportValidity() && (u.element.querySelector(".modal-footer .btn-primary")?.click(), u.close());
	}), queueMicrotask(() => c.focus()), u;
}
function m(e, t) {
	let n = typeof e == "string" ? {
		url: e,
		title: t
	} : e, r = o("iframe", "emodal-frame");
	return r.src = n.url, r.loading = "lazy", r.referrerPolicy = "strict-origin-when-cross-origin", r.setAttribute("title", n.title ?? "Embedded content"), Object.assign(r.style, {
		border: "0",
		minHeight: "65vh",
		width: "100%"
	}), l({
		...n,
		message: r,
		size: n.size ?? "xl",
		bodyClassName: `p-0 ${n.bodyClassName ?? ""}`.trim()
	});
}
function h(e, n) {
	let r = typeof e == "string" ? {
		url: e,
		title: n
	} : e, i = l({
		...r,
		message: r.loadingHtml ?? t.loadingHtml,
		buttons: !1
	});
	return fetch(r.url, r.request).then(async (e) => {
		if (!e.ok) throw Error(`Request failed with ${e.status}`);
		let t = await e.text(), n = i.element.querySelector(".modal-body");
		return n && (n.innerHTML = t), i.settle(t), t;
	}).then((e) => {
		let t = i.element.querySelector(".modal-footer");
		if (t) {
			let e = o("button", "btn btn-primary", "Close");
			e.type = "button", e.setAttribute("data-bs-dismiss", "modal"), t.append(e);
		}
		return e;
	}).catch((e) => {
		let t = i.element.querySelector(".modal-body");
		t && (t.innerHTML = `<div class="alert alert-danger mb-0"><strong>${r.errorTitle ?? "Load failed"}:</strong> ${e.message}</div>`), i.fail(e);
	}), i;
}
function g() {
	let e = n?.element;
	return n?.close(), e;
}
function _(e) {
	Object.assign(t, e);
}
var v = _;
function y() {
	throw Error("eModal v2 removed label presets. Use explicit button text instead.");
}
var b = {
	sm: "sm",
	lg: "lg",
	xl: "xl",
	fullscreen: "fullscreen"
}, x = "2.0.0", S = {
	addLabel: y,
	ajax: h,
	alert: d,
	close: g,
	confirm: f,
	iframe: m,
	modal: u,
	prompt: p,
	setEModalOptions: _,
	setModalOptions: v,
	size: b,
	version: x
};
//#endregion
export { y as addLabel, h as ajax, d as alert, g as close, f as confirm, S as default, S as eModal, m as iframe, u as modal, p as prompt, _ as setEModalOptions, v as setModalOptions, b as size, x as version };

//# sourceMappingURL=index.js.map