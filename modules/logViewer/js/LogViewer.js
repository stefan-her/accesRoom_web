"use-strict";

import Tools from '../../ToolsModules.js';

export default class LogViewer extends HTMLElement {
	
	constructor() {
		super();
		this.tools = new Tools();
		this.limit = 5;
		this.element = null;
		this.conteneurList = null;
		this.buttonInit = null;
		this.elWaiting = null;
		this.observer_userForm = null;
		this.timeoutAction = null;
		this.dataIdUp = null;
		this.dataInDown = null;
		this.apikey = null;
		this.buttonBeforeLogs = null;
		this.lang = (document.documentElement.lang) ? document.documentElement.lang : "en";
		this.ressources = "modules/logViewer/src/ressources.php";
		this.validForLogs = "modules/logViewer/src/validForLogs.php";
		this.apiLogs = "api/get_logs.php";
		this.resString = null;
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.putLogs = this.putLogs.bind(this);
		this.putRessource = this.putRessource.bind(this);
		this.putElList = this.putElList.bind(this);
		this.closeElementInit = this.closeElementInit.bind(this);
		this.logBefore = this.logBefore.bind(this);
		if(this.hasAttribute("style")) { this.tools.addStyle(this.getAttribute("style")); }
		this.initView();
	}
	
	initView() {
		this.buttonInit = document.getElementById("bt_logviewer");
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
		const TITLE = document.createElement("h1");
		const TITLETEXT = document.createTextNode(this.resString.tl_logviewer);
		TITLE.appendChild(TITLETEXT);
		this.element.content.appendChild(TITLE);
		this.elBuilding();
	}
	
	close() {
		this.element = this.tools.closeElement(this.buttonInit, this.open, this, this.element.child);
		this.conteneurList = null;
		if(this.elWaiting) { this.elWaiting = null; }
		if(this.timeoutAction) {
			clearTimeout(this.timeoutAction);
			this.timeoutAction = null;
		}
	}
	
	elBuilding() {
		let frag = document.createDocumentFragment();
		this.buttonBeforeLogs = document.createElement("button");
		let buttonText = document.createTextNode(this.resString.bt_before);
		this.buttonBeforeLogs.appendChild(buttonText);
		this.buttonBeforeLogs.addEventListener("click", this.logBefore);
		frag.appendChild(this.buttonBeforeLogs);
		this.conteneurList = document.createElement("div");
		frag.appendChild(this.conteneurList);
		this.element.content.appendChild(frag);
		this.elWaiting = document.createElement("waiting-el");
		this.conteneurList.appendChild(this.elWaiting);
		this.tools.ressourcesGET(this.validForLogs, this.putLogs);
	}
	
	putLogs(obj) {
		if(obj.error) { 
			let errorEl = this.tools.elError(obj, this.resString.h_error); 
			this.conteneurList.replaceChild(errorEl, this.elWaiting);
		} else if(obj.empty) {
			let p = document.createElement("p");
			p.setAttribute("class", "msg");
			let pText = document.createTextNode(this.resString.p_msg_1);
			p.appendChild(pText);
			this.conteneurList.replaceChild(p, this.elWaiting);			
			
			let userForm = document.createElement("elem-userform");
			this.conteneurList.appendChild(userForm);
			
			const config = { attributes: true };
			this.observer_userForm = new MutationObserver(this.closeElementInit);
			this.observer_userForm.observe(userForm, config);
		} else { 
			this.apikey = obj.apikey;
			let url = new URL(location.protocol + "//" + location.hostname + "/" + this.apiLogs);
			url.searchParams.set('apikey', this.apikey);
			url.searchParams.set('limit', this.limit);	
			this.tools.ressourcesGET(url.toString(), this.putElList);		
		}
	}
	
	delNodesInit() {
		this.tools.removeChildren(this.conteneurList);
		if(this.timeoutAction) {
			clearTimeout(this.timeoutAction);
			this.timeoutAction = null;
		}
		this.elWaiting = document.createElement("waiting-el");
		this.conteneurList.appendChild(this.elWaiting);
		
		this.tools.ressourcesGET(this.validForLogs, this.putLogs);
	}
	
	closeElementInit() {
		this.timeoutAction = setTimeout(() => {
			this.delNodesInit();
		}, 3000);
	}
	
	createElLine(obj) {
		let node = document.createElement("p");
		let span = document.createElement("span");
		let spanText = document.createTextNode(obj.content);
		span.appendChild(spanText);
		node.appendChild(span);
		
		span = document.createElement("span");
		spanText = document.createTextNode(obj.date);
		span.appendChild(spanText);		
		node.appendChild(span);
		
		return node;
	}
	
	putElList(obj) {
		
		if(this.elWaiting) {
			this.conteneurList.removeChild(this.elWaiting);
			this.elWaiting = null;
		}
		
		if(obj.error) {this.buttonBeforeLogs.setAttribute("disabled", "disabled"); }
		else if(this.buttonBeforeLogs.hasAttribute("disabled")) { this.buttonBeforeLogs.removeAttribute("disabled"); }
		
		let frag = document.createDocumentFragment();
		if(obj.empty) { 
			let msg = this.tools.elError(obj, this.resString.h_error);
			frag.appendChild(msg);
		} else {
			for(let i = obj.length -1; i >= 0; i--) {
				this.dataIdUp = obj[i].id;
				let node = this.createElLine(obj[i]);
				if(frag.childNodes.length > 0) { frag.insertBefore(node, frag.firstChild); }
				else { frag.appendChild(node); }
			}
			if(this.dataInDown == null) { 
				this.dataIdUp; 
			}
			this.dataIdUp -= 1;
			if(this.dataIdUp == 0) { this.buttonBeforeLogs.setAttribute("disabled", "disabled"); }
		}
		
		if(this.conteneurList.childNodes.length > 0) { this.conteneurList.insertBefore(frag, this.conteneurList.firstChild); }
		else { this.conteneurList.appendChild(frag); }
	}
	
	
	logBefore() {
		this.elWaiting = document.createElement("waiting-el");
		this.conteneurList.insertBefore(this.elWaiting, this.conteneurList.firstChild);
		
		let url = new URL(location.protocol + "//" + location.hostname + "/" + this.apiLogs);
		url.searchParams.set('apikey', this.apikey);
		url.searchParams.set('start', this.dataIdUp);
		url.searchParams.set('limit', this.limit);	
		this.tools.ressourcesGET(url.toString(), this.putElList);
	}	
}