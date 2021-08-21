<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register("utilities");


if(isset($_GET["apikey"]) && is_string($_GET["apikey"])) {
    
    $res = new DBSelectTB3_apiKey($_GET["apikey"]);
    if(empty($res->values["done"])) { die(); }
    
    if(isset($_GET["id"]) && is_numeric($_GET["id"])) {
        $res = new DBSelectTB2_joinTB5($_GET["id"]);
        $res->getContent();
    } else { die(); }
}


?>