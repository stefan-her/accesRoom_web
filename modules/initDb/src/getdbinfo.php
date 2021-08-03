<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once("utilities/Globals.php");
require_once(Globals::AUTOLOADER);
Autoloader::register();


$DbInfo = new DbInfo();
$DbInfo->values;

?>
