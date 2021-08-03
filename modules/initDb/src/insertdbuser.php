<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once("utilities/Globals.php");
require_once(Globals::AUTOLOADER);
Autoloader::register("utilities");

$data = json_decode(file_get_contents('php://input'), true);

print_r($data);

/*
$DbInfo = new DbInfo();
$DbInfo->createContent($data);
$DbInfo->resultCreateTemp;
*/
?>
