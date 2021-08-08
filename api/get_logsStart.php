<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register("utilities");

$start = 1;

if(isset($_GET["apikey"]) && is_string($_GET["apikey"])) {
    
    $res = new DBSelectTB3_apiKey($_GET["apikey"]);
    if(empty($res->values["done"])) { die(); }
    
    if(isset($_GET["start"]) && is_numeric($_GET["start"])) { $start = intval($_GET["start"]); }
    
    $res = new DBSelectTB1_start($start);
    
    $res->getContent();
    
}


?>