"use-strict";

import Tools from '../../ToolsModules.js';

export default class InsertStartLogs_1 extends HTMLElement {
		
	constructor() {
		super();
		this.tools = new Tools();
		this.element = null;
		this.conteneur = null;
		this.buttonInit = null;
		this.elWaiting = null;
		this.masterUserForm = null;
		this.observer = null;
		this.apikey = null;
		this.oberver = null;
		this.timeoutPutRecord = null;
		this.timeoutAction = null;
		this.lang = "en";
		this.minMax = [5, 30];
		this.ressources = "modules/insertStartLogs/src/ressources.php";
		this.getLogsJsonRes = "modules/insertStartLogs/src/getLogsJsonRes.php";
		this.validForLogs = "modules/insertStartLogs/src/validForLogs.php";
		this.resString = null;
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.putRecord = this.putRecord.bind(this);
		this.openCheckMasterUser = this.openCheckMasterUser.bind(this);
		this.checkMasterUser = this.checkMasterUser.bind(this);
		this.putRessource = this.putRessource.bind(this);
		if(this.hasAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		this.flag = false;
		this.initView();
	}
	
	
	initView() {
		this.buttonInit = document.getElementById("bt_insertstartlogs");
		this.tools.ressourcesGET(this.ressources, this.putRessource, {"lang" : this.lang});
	}	
	
	putRessource(res) {
		this.resString = res;
		this.buttonInit.addEventListener("click", this.openCheckMasterUser);
	}
	
	openCheckMasterUser() {
		if(this.observer) {
			this.observer.disconnect();
			this.observer = null;			
		}
		
		this.elWaiting = document.createElement("waiting-el");
		this.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.validForLogs, this.checkMasterUser);
	}
		
	checkMasterUser(obj) {
		this.elWaiting.parentNode.removeChild(this.elWaiting);
		this.elWaiting = null;
			
		if(obj.empty) {
			this.masterUserForm = document.createElement("elem-masteruserwindow");
			this.appendChild(this.masterUserForm);
			this.masterUserForm.initView();
			
			
			const config = { attributes: true };
			this.observer = new MutationObserver(this.openCheckMasterUser);
			this.observer.observe(this, config);
				
		} else { 
			if(this.masterUserForm) {
				this.removeChild(this.masterUserForm);
				this.masterUserForm = null;
			}
			console.log("par ici");
			if(!this.element) { this.open(); }
			 
		}
	}	
		
	open() {
		this.element = this.tools.openElement(this.buttonInit, this.open, this, this.close);
		const VALUEBUTTON = document.createTextNode(this.resString.bt_close);
		this.element.closeButton.replaceChild(VALUEBUTTON, this.element.closeButton.childNodes[0]);
		const TITLE = document.createElement("h1");
		const TITLETEXT = document.createTextNode(this.resString.tl_insertlog);
		TITLE.appendChild(TITLETEXT);
		this.element.content.appendChild(TITLE);
		
		this.buttonInit.setAttribute("disabled", "disabled");
		this.buttonInit.removeEventListener("click", this.open);
		
		
		console.log(this.element);
		this.elBuilding();
	}
	
	close() {
		
		this.element = this.tools.closeElement(this.buttonInit, this.open, this, this.element.child);
		
		this.buttonInit.removeAttribute("disabled");
		this.buttonInit.addEventListener("click", this.open);		
		
		
		
		clearTimeout(this.timeoutPutRecord);
		clearTimeout(this.timeoutAction);
		this.timeoutPutRecord = null;
		this.timeoutAction = null;
		this.conteneur = null;
		if(this.elWaiting) { 
			this.elWaiting.parentNode.removeChild(this.elWaiting);
			this.elWaiting = null; 
		}
		
		if(this.flag) {
			console.log("add this.open")
			this.buttonInit.removeAttribute("disabled");
			this.buttonInit.addEventListener("click", this.open);
		}
	}
	
	elBuilding() {
		this.conteneur = document.createElement("div");
		this.element.content.appendChild(this.conteneur);
		//this.elWaiting = document.createElement("waiting-el");
		//this.conteneur.appendChild(this.elWaiting);

		this.tools.ressourcesGET(this.getLogsJsonRes, this.putRecord);
	}
	
	putRecord(resp) {
		if(resp["str"]) {
			const P = document.createElement("p");
			
			let span = document.createElement("span");
			let spanText = document.createTextNode(resp["str"]);
			span.appendChild(spanText);
			P.appendChild(span);
			
			span = document.createElement("span");
			if(resp["status"] != "ok") { span.setAttribute("class", "error"); }
			spanText = document.createTextNode(resp["status"]);
			span.appendChild(spanText);	
			P.appendChild(span);	
			
			if(this.elWaiting) { 
				this.conteneur.removeChild(this.elWaiting);
				this.elWaiting = null;
			}
			
			this.conteneur.appendChild(P);
			this.conteneur.scrollTop = this.conteneur.scrollHeight;
			if(resp["line"]) {
				this.flag = true;
				this.timeoutPutRecord = setTimeout((() => {
					this.tools.ressourcesGET(this.getLogsJsonRes, this.putRecord, {"line" : resp["line"]});
				}), (Math.random() * (this.minMax[1] - this.minMax[0]) + this.minMax[0]) * 100);
			} else {
				this.flag = false;
			 	this.timeoutAction = setTimeout(() => {
					this.close();
				}, 3000); 
			}
		} else {
			this.flag = false;
			this.close(); 
		}
	}
}