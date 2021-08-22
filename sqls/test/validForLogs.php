<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register(["utilities"]);

try {
    $res = new DBexist();
    if(isset($res->values["error"])) { throw new Exception('connect error'); }
    
    $res = new DBSelectmasterUser();
    if(empty($res->values["apikey"])) { throw new Exception('no API key'); }
    
    
    
} catch(Exception $e) { 
} finally { $res->getContent(); }

?>