<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register("utilities");

$data = json_decode(file_get_contents('php://input'), true);
$DbInfo = new DbInfo();
$DbInfo->createContent($data);
$DbInfo->resultCreateTemp;

?>
