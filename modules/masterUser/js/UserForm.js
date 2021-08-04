"use-strict";

import Tools from '../../ToolsModules.js';

export default class UserForm extends HTMLElement {
	
	connectedCallback() {
		this.tools = new Tools();
		this.form = null;
		this.elWaiting = null;
		this.lang = (document.documentElement.lang) ? document.documentElement.lang : "en";
		this.getRegEx = "modules/masterUser/src/getRegEx.php";
		this.ressources = "modules/masterUser/src/ressources.php";
		this.putDbUser = "modules/masterUser/src/insertDbUser.php";
		this.resString = null;
		this.resRegEx = null;
		this.putRegEx = this.putRegEx.bind(this);
		this.putRessource = this.putRessource.bind(this);
		this.validUser = this.validUser.bind(this);
		this.getRespCreateUser = this.getRespCreateUser.bind(this);
		this.initView();
	}
	
	initView() {
		this.elWaiting = document.createElement("waiting-el");
		this.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.getRegEx, this.putRegEx);
	}
	
	putRegEx(resp) {
		this.resRegEx = resp;
		this.tools.ressourcesGET(this.ressources, this.putRessource, {"lang" : this.lang});
	}	
	
	putRessource(resp) {
		this.resString = resp;
		this.askMasterUser();
	}
			
	askMasterUser() {
		this.formFields = { 
			"firstname" :	{ "label" : this.resString.lb_firstname, "regEx" : this.resRegEx["NAME"], "value" : "" , "type" : "text" },
			"lastname" :	{ "label" : this.resString.lb_lastname, "regEx" : this.resRegEx["NAME"], "value" : "", "type" : "text" },
			"phone" :		{ "label" : this.resString.lb_phone, "regEx" : this.resRegEx["NAME"], "value" : "", "type" : "text" },
			"email" :		{ "label" : this.resString.lb_email, "regEx" : this.resRegEx["NAME"], "value" : "", "type" : "text" },
			"password" :	{ "label" : this.resString.lb_password, "regEx" : this.resRegEx["NAME"], "value" : "", "type" : "text" }
		}
		
		this.form = this.tools.buildForm(this.resString.lg_master, this.formFields, this.resString.bt_adduser, this.validUser);
		this.replaceChild(this.form, this.elWaiting);	
	}

	validUser(e) {
		e.preventDefault();
		let res = this.tools.valid(e.target, this.formFields);
		if(res["nbError"] === 0) { 
			this.tools.ressourcesPOST(this.putDbUser, res["data"], this.getRespCreateUser); 
			this.form = null;
			
		}
	}
	
	getRespCreateUser(resp) {
		console.log(resp);
	}
}