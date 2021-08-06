<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register();

$lang = (isset($_GET["lang"]) && is_string($_GET["lang"])) ? strtolower($_GET["lang"]) : null;
$res = new Ressources("modules/dashboard/res", $lang);
echo $res->values;


?>
