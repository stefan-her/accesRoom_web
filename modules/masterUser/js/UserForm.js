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
		this.msg = null;
		this.update= false;
		this.putRegEx = this.putRegEx.bind(this);
		this.putRessource = this.putRessource.bind(this);
		this.validUser = this.validUser.bind(this);
		this.getRespCreateUser = this.getRespCreateUser.bind(this);
		this.putFieldsName = this.putFieldsName.bind(this);
		//this.putMasterValues = this.putMasterValues.bind(this);
		
		
		this.getFieldsValue = this.getFieldsValue.bind(this);
		
		if(this.hasAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
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
		this.tools.ressourcesGET(this.getMaster, this.getFieldsValue);
	}
	
	getFieldsValue(resp) {
		if(resp && !resp["error"] && !resp["empty"]) {
			this.valuesMaster = resp;
			this.update = true;
		}
		this.tools.ressourcesGET(this.getFielsName, this.putFieldsName);
	}
	
	putFieldsName(resp) {
		let els = {};
		if(this.update) {
			Object.keys(this.valuesMaster).forEach((key)  => { 
				if(resp[key]) { els[key] = resp[key]; }
			});			
		} else { els = resp; }
		
		Object.keys(els).forEach((key)  => { 
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
		
		if(this.update) {
			this.putMasterValues(this.valuesMaster);
		}
		
		this.askMasterUser();
	}	
	
	putMasterValues(resp) {
		if(resp && !resp["error"] && !resp["empty"]) {
			Object.keys(resp).forEach((key)  => { 
				if(this.formFields[key]) {
					this.formFields[key]["value"] = resp[key];
				}
			});	
		}
	}
			
	askMasterUser() {
		const lgForm = (this.update) ? this.resString.lg_updatemaster : this.resString.lg_master;
		const msgBt = (this.update) ? this.resString.bt_updateuser : this.resString.bt_adduser;
		this.form = this.tools.buildForm(lgForm, this.formFields, msgBt, this.validUser);
		this.replaceChild(this.form, this.elWaiting);	
	}

	validUser(e) {
		e.preventDefault();
		let res = this.tools.valid(e.target, this.formFields);
		if(res["nbError"] === 0) { 
			this.tools.ressourcesPOST(this.putDbUser, res["data"], this.getRespCreateUser); 
			this.removeChild(this.form);
			this.form = null;
			
			const msgTxt = (this.update) ? this.resString.p_update: this.resString.p_insert;
			this.msg = this.tools.createMsgStatus(msgTxt);
			this.appendChild(this.msg, this.elWaiting);
						
			this.elWaiting = document.createElement("waiting-el");
			this.appendChild(this.elWaiting);
		}
	}
	
	getRespCreateUser(resp) {
		let status = (resp && resp.done) ? "ok" : "no";
		this.tools.putStatus(this.msg, status);
		this.elWaiting.parentNode.removeChild(this.elWaiting);
		this.elWaiting = null;
		if(status === "ok") { 
			this.setAttribute("status", true);
		}
	}
}