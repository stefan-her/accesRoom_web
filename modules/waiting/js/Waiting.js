
export default class Waiting extends HTMLElement {

	
	connectedCallback() {
		this.textNode = {"default":"Waiting","en":"Waiting","fr":"Un instant svp","nl":"Een ogenblik"};
		this.dot = ".";
		this.maxDots = 5;
		this.numberAdd = 0;
		this.timeout = 200;
		this.getLang();
		this.el = document.createElement("div");
		let text = document.createTextNode(this.textNode);
		this.el.appendChild(text);
		this.span = document.createElement("span");
		this.elDot = document.createTextNode(this.dot);
		this.el.appendChild(this.span);
		this.appendChild(this.el);
		this.dots();
		this.timeOut = null;
  	}

  	disconnectedCallback() {
		clearTimeout(this.timeOut);
  	}
	
	dots() {
		this.timeOut = setTimeout(() => {
			if(this.numberAdd == this.maxDots) {
				var toDel = this.span.firstChild;
				while (toDel) {
					var next = toDel.nextSibling;
					this.span.removeChild(toDel);
					if(toDel) { toDel = next; }
				}
				this.numberAdd = 0;
			} else {
				var dot = this.elDot.cloneNode(true);
				this.span.appendChild(dot);
				this.numberAdd++;
			}
			this.dots(); 
		}, this.timeout); 
	}
	
	getLang() {
		let lang = null;
		if(this.hasAttribute("lang")) { lang = this.getAttribute("lang"); }
		else if(document.documentElement.lang) { lang = document.documentElement.lang; }
		if(lang != null && this.textNode[lang]) { this.textNode = this.textNode[lang]; }
		else { this.textNode = this.textNode["default"]; }
	}
}
