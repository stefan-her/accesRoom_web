<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register("utilities");

$start = null;
$limit = 5;

if(isset($_GET["apikey"]) && is_string($_GET["apikey"])) {
    
    $res = new DBSelectTB3_apiKey($_GET["apikey"]);
    if(empty($res->values["done"])) { die(); }
    
    $res = new DBSelectTB1_lastIn();
    if(isset($res->values["empty"])) { die(); }
    $start = $res->values[0];
    if(isset($_GET["start"]) && is_numeric($_GET["start"])) { $start = intval($_GET["start"]); }
    if(isset($_GET["limit"]) && is_numeric($_GET["limit"])) { $limit = intval($_GET["limit"]); }
    
    $start = $start - $limit;
    if($start <= 0) { 
        $limit = $limit - abs($start);
        $start = 0;
    }
    
    $res = new DBSelectTB1_grp($start, $limit);
    if(isset($res->values["empty"])) { die(); }

    $res->getContent();
    
}


?>