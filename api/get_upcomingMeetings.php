<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register("utilities");

$start = 0;
$limit = 20;

if(isset($_GET["apikey"]) && is_string($_GET["apikey"])) {
    
    $res = new DBSelectTB3_apiKey($_GET["apikey"]);
    if(empty($res->values["done"])) { die(); }
           
        
    if(isset($_GET["start"]) && is_numeric($_GET["start"])) { $start = intval($_GET["start"]); }
    if(isset($_GET["limit"]) && is_numeric($_GET["limit"])) { $limit = intval($_GET["limit"]); }
       
    
    $res = new DBSelectTB2_joinTB6($start, $limit);
    $res->getContent();
}


?>