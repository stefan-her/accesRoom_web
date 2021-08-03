<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once("utilities/Globals.php");
require_once(Globals::AUTOLOADER);
Autoloader::register("utilities");

$res = new DBexist();
if(empty($res->values["error"])  ||  !$res->values["error"]) {
    //suite de requetes pour avoir les logs
    
    
    //TODO
    // retour provisoir a enlever pour continuer
    // remettre dans DBtools protected à la place de public la propriété $this->values
    $res->values["db"] = false;
    $res->values["error"] = "Database not actived";
    $res->getContent();
    // a enlever ----^
    
} else { $res->getContent(); }

?>