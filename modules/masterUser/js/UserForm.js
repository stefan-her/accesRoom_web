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
		this.getFielsName = "modules/masterUser/src/getColumnName.php";
		this.putDbUser = "modules/masterUser/src/insertDbUser.php";
		this.getMaster = "modules/masterUser/src/getMaster.php";
		this.formFields = {};
		this.masterValues = null;
		this.resString = null;
		this.resRegEx = null;
		this.putRegEx = this.putRegEx.bind(this);
		this.putRessource = this.putRessource.bind(this);
		this.validUser = this.validUser.bind(this);
		this.getRespCreateUser = this.getRespCreateUser.bind(this);
		this.putFieldsName = this.putFieldsName.bind(this);
		this.putMasterValues = this.putMasterValues.bind(this);
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
		this.tools.ressourcesGET(this.getFielsName, this.putFieldsName);
	}
	
	putFieldsName(resp) {
		Object.keys(resp).forEach((key)  => { 
			if(this.resString["lb_"+key]) {
				let reg = (this.resRegEx[key.toUpperCase()]) ? this.resRegEx[key.toUpperCase()] : this.resRegEx["TEXT"];
				this.formFields[key] = { 
					"label" : this.resString["lb_"+key], 
					"regEx" : reg, 
					"value" : "" , 
					"type" : "text" 
					};
			}			
		});
		this.tools.ressourcesGET(this.getMaster, this.putMasterValues);
	}
	
	putMasterValues(resp) {
		Object.keys(resp).forEach((key)  => { 
			if(this.formFields[key]) {
				this.formFields[key]["value"] = resp[key];
			}		
		});		
		this.askMasterUser();
	}
			
	askMasterUser() {
		this.form = this.tools.buildForm(this.resString.lg_master, this.formFields, this.resString.bt_adduser, this.validUser);
		this.replaceChild(this.form, this.elWaiting);	
	}

	validUser(e) {
		e.preventDefault();
		let res = this.tools.valid(e.target, this.formFields);
		if(res["nbError"] === 0) { 
			this.tools.ressourcesPOST(this.putDbUser, res["data"], this.getRespCreateUser); 
			this.removeChild(this.form);
			this.form = null;
			this.elWaiting = document.createElement("waiting-el");
			this.appendChild(this.elWaiting);
		}
	}
	
	getRespCreateUser() {
		let msg = this.tools.createMsgStatus(this.resString.p_insert);
		this.appendChild(msg);
	}
}