<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register("utilities");


$DbInfo = new DbInfo();
if(isset($_GET["action"]) && is_string($_GET["action"])) {
    $action = boolval($_GET["action"]);
    if($action == true) { $DbInfo->actionCreate(); }
    else { $DbInfo->actionCancel(); }
}
$DbInfo->resultAction;

?>