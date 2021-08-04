"use-strict";

import Tools from '../../ToolsModules.js';

export default class MasterUser extends HTMLElement {
	
	constructor() {
		super();
		this.tools = new Tools();
		this.element = null;
		this.form = null;
		this.buttonInit = null;
		this.elWaiting = document.createElement("waiting-el");
		this.lang = (document.documentElement.lang) ? document.documentElement.lang : "en";
		this.ressources = "modules/masterUser/src/ressources.php";
		this.resString = null;
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.putRessource = this.putRessource.bind(this);
		if(this.getAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		this.initView();
	}
	
	initView() {
		this.buttonInit = document.getElementById("bt_masteruser");
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
		
		let userForm = document.createElement("elem-userform");
		this.element.content.appendChild(userForm);
	}
	
	close() {
		this.element = this.tools.closeElement(this.buttonInit, this.open, this, this.element.child);
		this.conteneurList = null;
		if(this.elWaiting) { this.elWaiting = null; }
	}
}