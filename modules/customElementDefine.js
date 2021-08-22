"use-strict";

// declaration de modules
import Dashboard from '../modules/dashboard/js/Dashboard.js';
import ActionButtom from '../modules/dashboard/js/ActionButtom.js';
import InitDb from '../modules/initDb/js/InitDb.js';
import MasterUser from '../modules/masterUser/js/MasterUser.js';
import MasterUserWindow from '../modules/masterUser/js/MasterUserWindow.js';
import UserForm from '../modules/masterUser/js/UserForm.js';
import InsertStartLogs from '../modules/insertStartLogs/js/InsertStartLogs.js';
import InsertLog from '../modules/insertLog/js/InsertLog.js';
import LogViewer from '../modules/logViewer/js/LogViewer.js';
import Waiting from '../modules/waiting/js/Waiting.js';


window.addEventListener("load", function() {
	customElements.define("elem-dashboard", Dashboard);
	customElements.define("action-button", ActionButtom);
	customElements.define("elem-initdb", InitDb);
	customElements.define("elem-masteruser", MasterUser);
	customElements.define("elem-masteruserwindow", MasterUserWindow);
	customElements.define("elem-userform", UserForm);
	customElements.define("elem-insertstartlogs", InsertStartLogs);
	customElements.define("elem-insertlog", InsertLog);
	customElements.define("elem-logviewer", LogViewer);
	customElements.define("waiting-el", Waiting);
});