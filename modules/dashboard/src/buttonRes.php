<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register();

$lang = (isset($_GET["lang"]) && is_string($_GET["lang"])) ? strtolower($_GET["lang"]) : null;
$module = (isset($_GET["action"]) && is_string($_GET["action"])) ? $_GET["action"] : null;
$ref = (isset($_GET["ref"]) && is_string($_GET["ref"])) ? $_GET["ref"] : null;

$res = new Ressources($module."/res", $lang, $ref);
echo $res->values;


?>
