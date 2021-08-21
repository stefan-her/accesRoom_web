"use-strict";

import Tools from '../../ToolsModules.js';

export default class MasterUser extends HTMLElement {
	
	constructor() {
		super();
		this.tools = new Tools();
		this.buttonInit = null;
		this.masterUserForm = null;
		this.ressources = "modules/masterUser/src/ressources.php";
		this.resString = null;
		this.open = this.open.bind(this);
		this.putRessource = this.putRessource.bind(this);
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
		this.masterUserForm = document.createElement("elem-masteruserwindow");
		this.appendChild(this.masterUserForm);
		this.masterUserForm.initView();
	}

}