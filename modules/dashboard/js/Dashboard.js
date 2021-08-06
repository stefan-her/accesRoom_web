"use-strict";

import Tools from '../../ToolsModules.js';

export default class Dashboard extends HTMLElement {
	
	constructor() {
		super();
		this.tools = new Tools();
		this.node = document.createElement("header");
		this.top = document.createElement("h1");
		this.elWaiting = document.createElement("waiting-el");
		this.ressources = "modules/dashboard/src/ressources.php";
		this.lang = (document.documentElement.lang) ? document.documentElement.lang : "en";
		this.resString = null;
		this.putRessource = this.putRessource.bind(this);
		if(this.hasAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		this.initView();
	}
	
	initView() {
		let divButtons = document.createElement('div');
		this.node.appendChild(this.top);
		this.node.appendChild(divButtons);
		this.appendChild(this.node);
		this.top.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.ressources, this.putRessource, {
			"lang" : this.lang
			});
	}
	
	putRessource(res) {
		this.resString = res;
		this.top.removeChild(this.elWaiting);
		const TITLE = document.createTextNode(this.resString.tl_dashboard);
		this.top.appendChild(TITLE);
	}
}