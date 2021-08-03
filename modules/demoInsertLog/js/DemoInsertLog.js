"use-strict";

import Tools from '../../ToolsModules.js';

export default class DemoSInsertLog extends HTMLElement {
		
	constructor() {
		super();
		this.tools = new Tools();
		this.node = document.body;
		this.element = null;
		this.frag = null;
		this.conteneur = null;
		this.parent = "elem-dashboard";
		this.buttonInit = document.createElement("button");
		if(this.getAttribute("data-order")) { this.buttonInit.setAttribute("data-order", this.getAttribute("data-order")); }
		this.elWaiting = null;
		this.lang = "en";
		this.minMax = [5, 30];
		this.ressources = "modules/demoInsertLog/src/ressources.php";
		this.getLogsJsonRes = "modules/demoInsertLog/src/getLogsJsonRes.php";
		this.resString = null;
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.putRecord = this.putRecord.bind(this);
		this.timeoutPutRecord = null;
		this.timeoutAction = null;
		this.putRessource = this.putRessource.bind(this);
		if(this.getAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		
		this.flag = false;
		
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
		const TITLETEXT = document.createTextNode(this.resString.tl_demoinsertlog);
		TITLE.appendChild(TITLETEXT);
		this.element.content.appendChild(TITLE);
		this.elBuilding();
	}
	
	close() {
		this.element = this.tools.closeElement(this.buttonInit, this.open, this, this.element.child);
		clearTimeout(this.timeoutPutRecord);
		clearTimeout(this.timeoutAction);
		this.timeoutPutRecord = null;
		this.timeoutAction = null;
		this.conteneur = null;
		if(this.elWaiting) { this.elWaiting = null; }
		
		if(this.flag) {
			this.buttonInit.removeAttribute("disabled");
			this.buttonInit.addEventListener("click", this.open);
		}
		
	}
	
	elBuilding() {
		this.frag = document.createDocumentFragment();
		this.conteneur = document.createElement("div");
		this.frag.appendChild(this.conteneur);
		this.element.content.appendChild(this.frag);
		this.elWaiting = document.createElement("waiting-el");
		this.conteneur.appendChild(this.elWaiting);
		this.buttonInit.setAttribute("disabled", "disabled");
		this.buttonInit.removeEventListener("click", this.open);
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