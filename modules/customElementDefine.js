"use-strict";


// declaration de modules
import Dashboard from '../modules/dashboard/js/Dashboard.js';
import InitDb from '../modules/initDb/js/InitDb.js';
import DemoInsertLog from '../modules/demoInsertLog/js/DemoInsertLog.js';
import LogViewer from '../modules/logViewer/js/LogViewer.js';
import Waiting from '../modules/waiting/js/Waiting.js';

window.addEventListener("load", function() { 
	customElements.define("elem-dashboard", Dashboard);
	customElements.define("elem-initdb", InitDb);
	customElements.define("elem-demoinsertlog", DemoInsertLog);
	customElements.define("elem-logviewer", LogViewer);
	customElements.define("waiting-el", Waiting); 
});
