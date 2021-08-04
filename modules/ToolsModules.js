"use-strict";

export default class ToolsModules {
		
	addStyle(url, ...arg) {
		const LINK = document.createElement('link'); 
		LINK.href = url; 
        LINK.rel = (arg["rel"]) ? arg["rel"] : 'stylesheet'; 
        LINK.type = (arg["type"]) ? arg["type"] : 'text/css';
		if(arg["media"]) { LINK.media = arg["media"]; }
		document.head.appendChild(LINK);
	}
		
	ressourcesGET(res, callback, ...arg) {
		try{
			this.requestGET(res, arg)
			.then((resp) => { 
				callback(resp);
			});	
		} catch(Error) { console.log(Error.message); }
	}
	
	async requestGET(url, arg = {}) {
		if(arg[0]) { url += "?" + new URLSearchParams(arg[0]).toString(); }
		const RESP = await fetch(url);
		if(RESP.ok) { return await RESP.json(); } 
		else { throw new Error(RESP.status); }
	}
			
	ressourcesPOST(res, arg, callback) {
		try{
			this.requestPOST(res, arg)
			.then((resp) => { 
				callback(resp);
			});	
		} catch(Error) { console.log(Error.message); }
	}
	
	async requestPOST(url, arg) {
		
		console.log(arg);
		
		const RESP = await fetch(url, {
		 	method: "POST",
		 	body: JSON.stringify(arg),
		 	headers: {
            	'Accept': 'application/json',
            	'Content-Type': 'application/json'
            }
		})
		if(RESP.ok) { return await RESP.json(); } 
		else { throw new Error(RESP.status); }
	}

	openElement(button, funcToRemove, parent, funcToClose) {
		button.removeEventListener("click", funcToRemove);
		
		let element = {};
		
		element.child = document.createElement("div");
		parent.appendChild(element.child);
		
		const CONTENEUR = document.createElement("div");
		const HEADER = document.createElement('header');
		const VALUEBUTTON = document.createTextNode("\u274c");
		element.closeButton = document.createElement("button");
		element.closeButton.appendChild(VALUEBUTTON);
		element.closeButton.addEventListener("click", funcToClose);
		
		element.content = document.createElement("div");
	
		HEADER.appendChild(element.closeButton);
		CONTENEUR.appendChild(HEADER);
		CONTENEUR.appendChild(element.content);
		element.child.appendChild(CONTENEUR);
		return element;
	}
		
	closeElement(button, funcToOpen, parent, child) {
		button.addEventListener("click", funcToOpen);
		parent.removeChild(child);
		return null;
	}
		
	elError(obj, title) {
		let errorEl = document.createElement("div");
		errorEl.setAttribute("class", "error");
		const H = document.createElement("h1");
		const TITLE = document.createTextNode(title);
		H.appendChild(TITLE);
		const P = document.createElement("p");
		const MSG = document.createTextNode(obj.error);
		P.appendChild(MSG);
		errorEl.appendChild(H);
		errorEl.appendChild(P);
		return errorEl;
	}
		
	buildForm(lg, obj, subValue, validator) {
		let form = document.createElement("form");
		form.addEventListener("submit", (e) => { validator(e); });
		
		let fieldset = document.createElement("fieldset");
		let legend = document.createElement("legend");
		let legendText = document.createTextNode(lg);
		legend.appendChild(legendText);
		fieldset.appendChild(legend);
		
		Object.keys(obj).forEach((key)  => { 
			let label = document.createElement("label");
			let labelText = document.createTextNode(obj[key]["label"]);
			let input = document.createElement("input");

			input.setAttribute("type", obj[key]["type"]);
			input.setAttribute("name", key);
			input.setAttribute("value", obj[key]["value"]);
			
			label.appendChild(labelText);
			label.appendChild(input);
			fieldset.appendChild(label);
		});
		
		let submit = document.createElement("input");
		submit.setAttribute("type", "submit");
		submit.setAttribute("value", subValue);	
		form.appendChild(fieldset);
		form.appendChild(submit);
		return form;
	}
	
	valid(els, obj) {
		let nbError = 0;
		const data = {};
		for (const el of els) {
			if(el.tagName.toLowerCase() === "input" && el.type === "text") {
				el.classList.remove("error");
				if(el.value.search(obj[el.name]["regEx"]) == -1) {
					el.setAttribute("class", "error");
					el.classList.add("error");
					nbError++;
				} else { 
					data[el.name] = el.value;
				}
			}
		}
		return { nbError, data };
	}
} 