<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once("utilities/Globals.php");
require_once(Globals::AUTOLOADER);
Autoloader::register("utilities");

try {
    $res = new DBexist();
    if(isset($res->values["error"])  &&  $res->values["error"]) { throw new Exception($res->values["error"]); }
    
    $res = new DBcolumnName("user");
    if(isset($res->values["error"])  &&  $res->values["error"]) { throw new Exception($res->values["error"]); }
    
} catch (Exception $e) {
    
} finally { $res->getContent(); }

?>