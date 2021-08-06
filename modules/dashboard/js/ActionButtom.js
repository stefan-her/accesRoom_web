"use-strict";

import Tools from '../../ToolsModules.js';

export default class ActionButton extends HTMLElement {
	
	constructor() {
		super();
		this.tools = new Tools();
		this.buttonInit = document.createElement("button");
		this.elWaiting = document.createElement("waiting-el");
		this.elCustom = "elem-";
		this.ressources = "modules/dashboard/src/buttonRes.php";
		this.lang = (document.documentElement.lang) ? document.documentElement.lang : "en";
		this.resString = null;
		this.putRessource = this.putRessource.bind(this);
		if(this.hasAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		this.initView();
	}
	
	initView() {
		this.buttonInit.appendChild(this.elWaiting);
		this.parentNode.node.lastChild.appendChild(this.buttonInit);
		if(this.hasAttribute("action")) { 
			let action = this.getAttribute("action").split(new RegExp('[\\\/]')).pop().toLowerCase();
			this.elCustom += action;
			this.elCustom = document.createElement(this.elCustom);
			if(this.hasAttribute("style")) { this.elCustom.setAttribute("style", this.getAttribute("style")); }
			
			
			this.buttonInit.setAttribute("id", "bt_" + action);
			
			this.tools.ressourcesGET(this.ressources, this.putRessource, {
				"action" : this.getAttribute("action"), 
				"ref" : "bt_init",
				"lang" : this.lang
			}); 
		}
	}
	
	putRessource(res) {
		this.resString = res;
		if(this.resString.bt_init) {
			this.buttonInit.removeChild(this.elWaiting);
			let text = document.createTextNode(this.resString.bt_init);
			this.buttonInit.appendChild(text);
			this.addcustomElement();			
		} else { this.node.parentNode.removeChild(this.buttonInit); }
	}
	
	addcustomElement() {
		if(this.parentNode.nextSibling) {
			this.parentNode.parentNode.insertBefore(this.elCustom, this.parentNode.nextSibling);
		} else { this.parentNode.this.elCustom.appenChild(this.elCustom); }
	}
}