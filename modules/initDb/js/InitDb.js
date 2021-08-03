"use-strict";

import Tools from '../../ToolsModules.js';

export default class InitDb extends HTMLElement {
	
	constructor() {
		super();
		this.tools = new Tools();
		this.node = document.body;
		this.element = null;
		this.frag = null;
		this.parent = "elem-dashboard";
		this.buttonInit = document.createElement("button");
		if(this.getAttribute("data-order")) { this.buttonInit.setAttribute("data-order", this.getAttribute("data-order")); }
		this.elWaiting = null;
		this.spanStatus = null;
		this.lang = (document.documentElement.lang) ? document.documentElement.lang : "en";
		this.getRegEx = "modules/initDb/src/getRegEx.php";
		this.getDbinfo = "modules/initDb/src/getdbinfo.php";
		this.putDbinfo = "modules/initDb/src/createdbinfo.php";
		this.confirmDbinfo = "modules/initDb/src/confirmdbinfo.php";
		this.ressources = "modules/initDb/src/ressources.php";
		this.resRegEx = null;
		this.resString = null;
		this.fieldsUser = null;
		this.timeoutAction = null;
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.putRessource = this.putRessource.bind(this);
		this.putRegEx = this.putRegEx.bind(this);
		this.getResp = this.getResp.bind(this);
		this.putIndoDb = this.putIndoDb.bind(this);
		this.validDb = this.validDb.bind(this);
		this.validUser = this.validUser.bind(this);
		this.cancelResp = this.cancelResp.bind(this);
		this.validResp = this.validResp.bind(this);
		
		if(this.getAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		this.initView();
	}
	
	initView() {
		this.elWaiting = document.createElement("waiting-el");
		this.node = document.getElementsByTagName(this.parent)[0].firstChild.lastChild;
		if(this.node.childNodes) { this.node.insertBefore(this.elWaiting, this.node.firstChild); }
		this.node.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.getRegEx, this.putRegEx);
	}
	
	putRegEx(resp) {
		this.resRegEx = resp;
		this.tools.ressourcesGET(this.ressources, this.putRessource, {"lang" : this.lang});
	}
	
	putRessource(res) {
		this.resString = res;
		this.node.removeChild(this.elWaiting);
		this.elWaiting = null;
		const VALUEBUTTON = document.createTextNode(this.resString.bt_init);
		this.buttonInit.addEventListener("click", this.open);
		this.buttonInit.appendChild(VALUEBUTTON);	
		this.node.appendChild(this.buttonInit);
	}
	
	open() {
		this.element = this.tools.openElement(this.buttonInit, this.open, this, this.close);
		const VALUEBUTTON = document.createTextNode(this.resString.bt_close);
		this.element.closeButton.replaceChild(VALUEBUTTON, this.element.closeButton.childNodes[0]);
		this.elWaiting = document.createElement("waiting-el");
		this.element.content.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.getDbinfo, this.putIndoDb);
	}
	
	close() {
		this.element = this.tools.closeElement(this.buttonInit, this.open, this, this.element.child);
		if(this.elWaiting) { this.elWaiting = null; }
		if(this.timeoutAction) {
			clearTimeout(this.timeoutAction);
			this.timeoutAction = null;
		}
	}
	
	putIndoDb(resp) {
		this.elBuilding(resp);
		this.element.content.removeChild(this.elWaiting);
		this.element.content.appendChild(this.frag);
	}
	
	elBuilding(obj) {
		this.frag = document.createDocumentFragment();
		if(obj.error) { 
			let errorEl = this.tools.elError(obj, this.resString.h_error); 
			this.frag.replaceChild(errorEl, this.elWaiting);
			this.elWaiting = null;
		} else { this.askFieldDB(obj); }
	}
	
	form(lg, obj, subValue, validator) {
		let form = document.createElement("form");
		form.addEventListener("submit", (e) => { validator(e); });
		
		let fieldset = document.createElement("fieldset");
		let legend = document.createElement("legend");
		let legendText = document.createTextNode(lg);
		legend.appendChild(legendText);
		fieldset.appendChild(legend);
		
		Object.keys(obj).forEach((key)  => { 
			let label = document.createElement("label");
			let labelText = document.createTextNode(obj[key]["label"]);
			let input = document.createElement("input");

			input.setAttribute("type", "text");
			input.setAttribute("name", key);
			input.setAttribute("value", obj[key]["value"]);
			
			label.appendChild(labelText);
			label.appendChild(input);
			fieldset.appendChild(label);
		});
		
		let submit = document.createElement("input");
		submit.setAttribute("type", "submit");
		submit.setAttribute("value", subValue);	
		form.appendChild(fieldset);
		form.appendChild(submit);
		return form;
	}

	askFieldDB(obj) {
		let fields = {};
		Object.keys(obj).forEach((element)  => { 
			fields[element.trim()] = { "label" : this.resString[element.trim()], "value" : obj[element] };
		});
		
		let form = this.form(this.resString.lg_info, fields, this.resString.bt_initdb, this.validDb);
		this.frag.appendChild(form);
	}
		
	validDb(e) {
		e.preventDefault();
		this.element.closeButton.removeEventListener("click", this.close);
		this.element.closeButton.setAttribute("disabled", "disabled");
		
		const REX = new RegExp(this.resRegEx["TABLE"], 'g');
		let nbError = 0;
		const data = {};
		for (const element of e.target) {
			if(element.tagName.toLowerCase() === "input" && element.type === "text") {
				element.classList.remove("error");
				if(element.value.search(REX) == -1) {
					element.setAttribute("class", "error");
					element.classList.add("error");
					nbError++;
				} else { 
					data[element.name] = element.value;
				}
			}
		}

		if(nbError === 0) {
			this.tools.ressourcesPOST(this.putDbinfo, data, this.getResp);
		}
	}

	getResp(resp) {
		const MSG = (resp.db) ? this.resString.t_dropdb : this.resString.t_newdb;
		let cf = confirm(MSG);
		if(cf) { this.initDb(); }
		else { this.closeElementInit(); }
	}
	
	createMsg(msg) {
		let p = document.createElement("p");
		let span = document.createElement("span");
		let spanText = document.createTextNode(msg);
		span.appendChild(spanText);
		
		p.appendChild(span);
		
		this.spanStatus = document.createElement("span");
		p.appendChild(this.spanStatus);
		return p;		
	}
	
	removeChildren(node) {
		while(node.childNodes.length > 0) {
			node.removeChild(node.firstChild);
		}
	}
	
	putStatus(msg) {
		let textNode = document.createTextNode(msg);
		this.spanStatus.appendChild(textNode);
		
		this.element.content.removeChild(this.elWaiting);
		this.elWaiting = null;	
	}
	
	cancelResp(resp) {
		this.putStatus(resp.resp);
		if(resp.resp == "ok") {
			this.timeoutAction = setTimeout(() => {
				this.close();
			}, 3000);
		} else { this.spanStatus.setAttribute("class", "error"); }
		
		this.element.closeButton.addEventListener("click", this.close);
		this.element.closeButton.removeAttribute("disabled");
	}
	
	validUser(e) {
		e.preventDefault();
		console.log(e.target);

		
	}
	
	askMasterUser() {
		this.fieldsUser = { 
			"firstname" :	{ "label" : this.resString.lb_firstname, "regEx" : this.resRegEx["NAME"], "value" : "" },
			"lastname" :	{ "label" : this.resString.lb_lastname, "regEx" : this.resRegEx["NAME"], "value" : "" },
			"phone" :		{ "label" : this.resString.lb_phone, "regEx" : this.resRegEx["PHONE"], "value" : "" },
			"email" :		{ "label" : this.resString.lb_email, "regEx" : this.resRegEx["EMAIL"], "value" : "" }
		}
		
		let form = this.form(this.resString.lg_master, this.fieldsUser, this.resString.bt_adduser, this.validUser);
		this.element.content.appendChild(form);	
	}
	
	validResp(resp) {
		this.putStatus(resp.resp);	
		if(resp.resp == "ok") { this.askMasterUser(); } 
		else { this.spanStatus.setAttribute("class", "error"); }	
	}

	closeElementInit() {
		let msg = this.createMsg(this.resString.t_canceldb);
		this.removeChildren(this.element.content);
		this.element.content.appendChild(msg);
		this.elWaiting = document.createElement("waiting-el");
		this.element.content.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.confirmDbinfo, this.cancelResp, {"action" : 0});
	}
	
	initDb() {
		let msg = this.createMsg(this.resString.t_createdb);
		this.removeChildren(this.element.content);
		this.element.content.appendChild(msg);
		this.elWaiting = document.createElement("waiting-el");
		this.element.content.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.confirmDbinfo, this.validResp, {"action" : 1});
	}
	

}