"use-strict";

import Tools from '../../ToolsModules.js';

export default class InitDb extends HTMLElement {
	
	constructor() {
		super();
		this.tools = new Tools();
		this.element = null;
		this.frag = null;
		this.buttonInit = null;
		this.elWaiting = null;
		this.msg = null;
		this.lang = (document.documentElement.lang) ? document.documentElement.lang : "en";
		this.getRegEx = "modules/initDb/src/getRegEx.php";
		this.getDbinfo = "modules/initDb/src/getdbinfo.php";
		this.putDbinfo = "modules/initDb/src/createdbinfo.php";
		this.confirmDbinfo = "modules/initDb/src/confirmdbinfo.php";
		this.ressources = "modules/initDb/src/ressources.php";
		this.resRegEx = null;
		this.resString = null;
		this.formFields = null;
		this.timeoutAction = null;
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.putRessource = this.putRessource.bind(this);
		this.putRegEx = this.putRegEx.bind(this);
		this.askConfirmToCreateDb = this.askConfirmToCreateDb.bind(this);
		this.putIndoDb = this.putIndoDb.bind(this);
		this.validDb = this.validDb.bind(this);
		this.cancelResp = this.cancelResp.bind(this);
		this.validResp = this.validResp.bind(this);
		if(this.getAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		this.initView();
	}
	
	initView() {
		this.buttonInit = document.getElementById("bt_initdb");
		this.tools.ressourcesGET(this.getRegEx, this.putRegEx);
	}
	
	putRegEx(resp) {
		this.resRegEx = resp;
		this.tools.ressourcesGET(this.ressources, this.putRessource, {"lang" : this.lang});
	}
	
	putRessource(res) {
		this.resString = res;
		this.buttonInit.addEventListener("click", this.open);
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
		this.buttonInit.addEventListener("click", this.open);
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

	askFieldDB(obj) {
		this.formFields = {};
		Object.keys(obj).forEach((element)  => { 
			this.formFields[element.trim()] = { 
				"label" : this.resString[element.trim()], 
				"value" : obj[element], 
				"type" : "text",
				"regEx" : this.resRegEx["TABLE"] };
		});
		
		let form = this.tools.buildForm(this.resString.lg_info, this.formFields, this.resString.bt_initdb, this.validDb);
		this.frag.appendChild(form);
	}
		
	validDb(e) {
		e.preventDefault();
		this.element.closeButton.removeEventListener("click", this.close);
		this.element.closeButton.setAttribute("disabled", "disabled");
		
		let res = this.tools.valid(e.target, this.formFields);
		if(res["nbError"] === 0) { 
			this.tools.ressourcesPOST(this.putDbinfo, res["data"], this.askConfirmToCreateDb); 
			this.formFields = null;
		}
	}

	askConfirmToCreateDb(resp) {
		const MSG = (resp.db) ? this.resString.t_dropdb : this.resString.t_newdb;
		let cf = confirm(MSG);
		if(cf) { this.initDb(); }
		else { this.closeElementInit(); }
	}
	
	removeWaiting() {
		this.element.content.removeChild(this.elWaiting);
		this.elWaiting = null;	
	}
	
	cancelResp(resp) {
		this.tools.putStatus(this.msg, resp.resp);
		this.removeWaiting();
		if(resp.resp == "ok") {
			this.timeoutAction = setTimeout(() => {
				this.close();
			}, 3000);
		}
				
		this.element.closeButton.addEventListener("click", this.close);
		this.element.closeButton.removeAttribute("disabled");
	}
	
	validResp(resp) {
		this.tools.putStatus(this.msg, resp.resp);	
		this.removeWaiting();
		if(resp.resp == "ok") { 
			let userForm = document.createElement("elem-userform");
			this.element.content.appendChild(userForm); 
		} 
	}

	closeElementInit() {
		this.msg = this.tools.createMsgStatus(this.resString.t_canceldb);
		this.tools.removeChildren(this.element.content);
		this.element.content.appendChild(this.msg);
		this.elWaiting = document.createElement("waiting-el");
		this.element.content.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.confirmDbinfo, this.cancelResp, {"action" : 0});
	}
	
	initDb() {
		this.msg = this.tools.createMsgStatus(this.resString.t_createdb);
		this.tools.removeChildren(this.element.content);
		this.element.content.appendChild(this.msg);
		this.elWaiting = document.createElement("waiting-el");
		this.element.content.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.confirmDbinfo, this.validResp, {"action" : 1});
	}
}