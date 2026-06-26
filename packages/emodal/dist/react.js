import { ajax as e, alert as t, close as n, confirm as r, iframe as i, modal as a, prompt as o, setEModalOptions as s } from "./index.js";
import { useMemo as c } from "react";
//#region src/react.ts
function l(l = {}) {
	return l.defaults && s(l.defaults), c(() => ({
		alert: t,
		confirm: r,
		prompt: o,
		ajax: e,
		iframe: i,
		modal: a,
		close: n
	}), []);
}
//#endregion
export { l as useEModal };

//# sourceMappingURL=react.js.map