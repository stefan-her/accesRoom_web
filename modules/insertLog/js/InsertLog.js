"use-strict";

import Tools from '../../ToolsModules.js';

export default class InserttLog extends HTMLElement {
		
	constructor() {
		super();
		this.tools = new Tools();
		this.element = null;
		this.conteneur = null;
		this.buttonInit = null;
		this.elWaiting = null;
		this.masterUserForm = null;
		this.observer = null;
		this.apikey = null;
		this.oberver = null;
		this.timeoutAction = null;
		this.msg = null;
		this.lang = "en";
		this.ressources = "modules/insertLog/src/ressources.php";
		this.validForLogs = "api/get_validForLogs.php";
		this.confirmInsert = "modules/insertLog/src/confirminsert.php"
		this.resString = null;
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.openCheckMasterUser = this.openCheckMasterUser.bind(this);
		this.checkMasterUser = this.checkMasterUser.bind(this);
		this.putRessource = this.putRessource.bind(this);
		this.eventKeyDown = this.eventKeyDown.bind(this);
		this.putConfirm = this.putConfirm.bind(this);
		this.valid = this.valid.bind(this);
		this.removeErrorStyle = this.removeErrorStyle.bind(this);
		if(this.hasAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		this.flag = false;
		this.initView();
	}
	
	initView() {
		this.buttonInit = document.getElementById("bt_insertlog");
		this.tools.ressourcesGET(this.ressources, this.putRessource, {"lang" : this.lang});
	}	
	
	putRessource(res) {
		this.resString = res;
		this.buttonInit.addEventListener("click", this.openCheckMasterUser);
		window.addEventListener("keydown", this.eventKeyDown); 
	}
	
	eventKeyDown(e) {
		if(e.key == "i") { this.openCheckMasterUser(); }
	}
	
	openCheckMasterUser() {
		if(this.observer) {
			this.observer.disconnect();
			this.observer = null;			
		}
		
		this.elWaiting = document.createElement("waiting-el");
		this.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.validForLogs, this.checkMasterUser);
	}
		
	checkMasterUser(obj) {
		if(this.elWaiting) {
			this.elWaiting.parentNode.removeChild(this.elWaiting);
			this.elWaiting = null;			
		}
			
		if(obj.empty) {
			this.masterUserForm = document.createElement("elem-masteruserwindow");
			this.appendChild(this.masterUserForm);
			this.masterUserForm.initView();
			
			const config = { attributes: true };
			this.observer = new MutationObserver(this.openCheckMasterUser);
			this.observer.observe(this, config);
				
		} else { 
			if(window.masterUser) { window.masterUser = true; }	
			if(this.masterUserForm) {
				this.removeChild(this.masterUserForm);
				this.masterUserForm = null;
			}
			if(!this.element) { this.open() }
		}
	}	
			
	open() {
		this.element = this.tools.openElement(this.buttonInit, this.open, this, this.close);
		const VALUEBUTTON = document.createTextNode(this.resString.bt_close);
		this.element.closeButton.replaceChild(VALUEBUTTON, this.element.closeButton.childNodes[0]);
		const TITLE = document.createElement("h1");
		const TITLETEXT = document.createTextNode(this.resString.tl_insertlog);
		TITLE.appendChild(TITLETEXT);
		this.element.content.appendChild(TITLE);
		
		this.buttonInit.setAttribute("disabled", "disabled");
		this.buttonInit.removeEventListener("click", this.open);
		window.removeEventListener("keydown", this.eventKeyDown); 
		
		this.elBuilding();
	}
	
	close() {
		
		this.element = this.tools.closeElement(this.buttonInit, this.open, this, this.element.child);
		
		this.buttonInit.removeAttribute("disabled");
		this.buttonInit.addEventListener("click", this.open);		
		
		console.log("InsertLog -- close")
		
		clearTimeout(this.timeoutAction);
		this.timeoutAction = null;
		this.conteneur = null;
		if(this.elWaiting) { 
			this.elWaiting.parentNode.removeChild(this.elWaiting);
			this.elWaiting = null; 
		}
		
		if(this.flag) {
			console.log("add this.open")
			this.buttonInit.removeAttribute("disabled");
			this.buttonInit.addEventListener("click", this.open);
			window.addEventListener("keydown", this.eventKeyDown); 
		}
	}
	
	elBuilding() {
		this.conteneur = document.createElement("div");
		this.element.content.appendChild(this.conteneur);
		const field = {"json" : {"label" : "", "type":  "text", "value" : ""}};
		const form = this.tools.buildForm("", field, this.resString.bt_submit, this.valid);
		this.conteneur.appendChild(form);
	}
	
	valid(e) {
		e.preventDefault();
		
		if(this.msg) {
			this.conteneur.removeChild(this.msg);
			this.msg = null;
			e.target["json"].removeAttribute("class");
		}
		
		e.target["json"].addEventListener("focus", this.removeErrorStyle);
		
		try {
		 	const json = JSON.parse(e.target["json"].value);
			this.tools.ressourcesPOST(this.confirmInsert, json, this.putConfirm); 
		} catch (error) {
		  	e.target["json"].setAttribute("class", "error");
	
			this.msg = document.createElement("p");
			const txtMsg = document.createTextNode(this.resString.p_errorMsg);
			this.msg.appendChild(txtMsg);
			this.conteneur.appendChild(this.msg);
		}
	}
	
	removeErrorStyle(e) {
		e.target.removeAttribute("class");
	}
	
	putConfirm(resp) {
		if(this.msg) { 
			this.conteneur.removeChild(this.msg); 
			this.msg = null;
		}		
		
		this.msg = document.createElement("p");
		const txtMsg = (resp.done) ? this.resString.p_insertMsg : this.resString.p_errorReturnMsg;
		const txtNode = document.createTextNode(txtMsg);
		this.msg.appendChild(txtNode);
		this.conteneur.appendChild(this.msg);
		
		if(resp.done) { 
			this.timeoutAction = setTimeout(() => {
				this.close();
			}, 3000); 
		}
	}
}