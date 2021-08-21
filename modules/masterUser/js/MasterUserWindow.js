"use-strict";

import Tools from '../../ToolsModules.js';

export default class MasterUserWindow extends HTMLElement {
		
	connectedCallback() {	
		this.tools = new Tools();
		this.element = null;
		this.buttonInit = null;
		this.elWaiting = document.createElement("waiting-el");
		this.lang = (document.documentElement.lang) ? document.documentElement.lang : "en";
		this.ressources = "modules/masterUser/src/ressources.php";
		this.resString = null;
		this.observer_userForm = null;
		this.timeoutAction = null;
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.putRessource = this.putRessource.bind(this);
		this.closeElementInit = this.closeElementInit.bind(this);
		if(this.hasAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
	}
	
	disconnectedCallback() {
		clearTimeout(this.timeoutAction);
		this.element = null;
	}
	
	initView() {
		this.buttonInit = document.getElementById("bt_masteruser");
		this.tools.ressourcesGET(this.ressources, this.putRessource, {"lang" : this.lang});
	}
	
	putRessource(res) {
		this.resString = res;
		this.open();
	}
	
	open() {
		this.element = this.tools.openElement(this.buttonInit, this.open, this, this.close);
		const VALUEBUTTON = document.createTextNode(this.resString.bt_close);
		this.element.closeButton.replaceChild(VALUEBUTTON, this.element.closeButton.childNodes[0]);
		
		let userForm = document.createElement("elem-userform");
		userForm.setAttribute("status", false);
		this.element.content.appendChild(userForm);
		
		const config = { attributes: true };
		this.observer_userForm = new MutationObserver(this.closeElementInit);
		this.observer_userForm.observe(userForm, config);
	}
	
	close() {
		this.element = this.tools.closeElement(this.buttonInit, this.open, this, this.element.child);
		this.conteneurList = null;
		this.parentNode.removeChild(this);
		if(this.elWaiting) { this.elWaiting = null; }
		if(this.timeoutAction) { clearTimeout(this.timeoutAction); }
	}
	
	closeElementInit() {
		this.parentNode.setAttribute("status", true);
		this.timeoutAction = setTimeout(() => {
			this.close();
		}, 3000);
	}
}