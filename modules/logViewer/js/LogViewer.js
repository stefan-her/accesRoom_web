"use-strict";

import Tools from '../../ToolsModules.js';

export default class LogViewer extends HTMLElement {
	
	constructor() {
		super();
		this.tools = new Tools();
		this.node = document.body;
		this.element = null;
		this.frag = null;
		this.conteneurList = null;
		this.parent = "elem-dashboard";
		this.buttonInit = document.createElement("button");
		if(this.getAttribute("data-order")) { this.buttonInit.setAttribute("data-order", this.getAttribute("data-order")); }
		this.elWaiting = null;
		this.lang = "en";
		this.ressources = "modules/logViewer/src/ressources.php";
		this.getLogs = "modules/logViewer/src/getLogs.php";
		this.resString = null;
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.putLogs = this.putLogs.bind(this);
		this.putRessource = this.putRessource.bind(this);
		if(this.getAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		this.initView();
	}
	
	initView() {
		this.elWaiting = document.createElement("waiting-el");
		this.node = document.getElementsByTagName(this.parent)[0].firstChild.lastChild;
		if(this.node.childNodes) { this.node.insertBefore(this.elWaiting, this.node.firstChild); }
		this.node.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.ressources, this.putRessource, {"lang" : this.lang});
	}
	
	putRessource(res) {
		this.resString = res;
		this.node.removeChild(this.elWaiting);
		const VALUEBUTTON = document.createTextNode(this.resString.bt_init);
		this.buttonInit.addEventListener("click", this.open);
		this.buttonInit.appendChild(VALUEBUTTON);
		this.node.appendChild(this.buttonInit);
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
		this.tools.ressourcesGET(this.getLogs, this.putLogs);
	}
	
	putLogs(obj) {
		if(obj.error) { 
			let errorEl = this.tools.elError(obj, this.resString.h_error); 
			this.conteneurList.replaceChild(errorEl, this.elWaiting);
			this.elWaiting = null;
		} else { this.elList(obj); }
	}
	
	elList(obj) {
		
	}
	
	logBefore() {
		console.log("the ten before");
	}	
}