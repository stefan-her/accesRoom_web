"use-strict";

import Tools from '../../ToolsModules.js';

export default class LogViewer extends HTMLElement {
	
	constructor() {
		super();
		this.tools = new Tools();
		this.element = null;
		this.frag = null;
		this.conteneurList = null;
		this.buttonInit = null;
		this.elWaiting = null;
		this.observer_userForm = null;
		this.timeoutAction = null;
		this.lang = (document.documentElement.lang) ? document.documentElement.lang : "en";
		this.ressources = "modules/logViewer/src/ressources.php";
		this.validForLogs = "modules/logViewer/src/validForLogs.php";
		this.resString = null;
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.putLogs = this.putLogs.bind(this);
		this.putRessource = this.putRessource.bind(this);
		this.closeElementInit = this.closeElementInit.bind(this);
		if(this.hasAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		this.initView();
	}
	
	initView() {
		this.buttonInit = document.getElementById("bt_logviewer");
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
		const TITLE = document.createElement("h1");
		const TITLETEXT = document.createTextNode(this.resString.tl_logviewer);
		TITLE.appendChild(TITLETEXT);
		this.element.content.appendChild(TITLE);
		this.elBuilding();
	}
	
	close() {
		this.element = this.tools.closeElement(this.buttonInit, this.open, this, this.element.child);
		this.conteneurList = null;
		if(this.elWaiting) { this.elWaiting = null; }
		if(this.timeoutAction) {
			clearTimeout(this.timeoutAction);
			this.timeoutAction = null;
		}
	}
	
	elBuilding() {
		this.frag = document.createDocumentFragment();
		const BUTTON = document.createElement("button");
		const BUTTONTEXT = document.createTextNode(this.resString.bt_before);
		BUTTON.appendChild(BUTTONTEXT);
		BUTTON.addEventListener("click", this.logBefore);
		this.frag.appendChild(BUTTON);
		this.conteneurList = document.createElement("div");
		this.frag.appendChild(this.conteneurList);
		this.element.content.appendChild(this.frag);
		this.elWaiting = document.createElement("waiting-el");
		this.conteneurList.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.validForLogs, this.putLogs);
	}
	
	putLogs(obj) {
		if(obj.error) { 
			let errorEl = this.tools.elError(obj, this.resString.h_error); 
			this.conteneurList.replaceChild(errorEl, this.elWaiting);
		} else if(obj.empty) {
			let p = document.createElement("p");
			p.setAttribute("class", "msg");
			let pText = document.createTextNode(this.resString.p_msg_1);
			p.appendChild(pText);
			this.conteneurList.replaceChild(p, this.elWaiting);			
			
			let userForm = document.createElement("elem-userform");
			this.conteneurList.appendChild(userForm);
			
			const config = { attributes: true };
			this.observer_userForm = new MutationObserver(this.closeElementInit);
			this.observer_userForm.observe(userForm, config);
		} else { this.elList(obj); }
		
		//TODO
		// requete pour l'APIKEY
		// requete pour les logs via api/logs.php
		console.log("logged");
	}
	
	delNodesInit() {
		this.tools.removeChildren(this.conteneurList);
		if(this.timeoutAction) {
			clearTimeout(this.timeoutAction);
			this.timeoutAction = null;
		}
		this.elWaiting = document.createElement("waiting-el");
		this.conteneurList.appendChild(this.elWaiting);
		
		this.tools.ressourcesGET(this.validForLogs, this.putLogs);
	}
	
	closeElementInit() {
		this.timeoutAction = setTimeout(() => {
			this.delNodesInit();
		}, 3000);
	}
	
	elList(obj) {
		
	}
	
	logBefore() {
		console.log("the five before");
	}	
}