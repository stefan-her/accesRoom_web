<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register("utilities");




try {
    
    $res = new DBexist();
    if(isset($res->values["error"])  &&  $res->values["error"]) { throw new Exception($res->values["error"]); }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $res = new DBSelectmasterUser();
    if($res->values["apikey"]) {
        
        $data["apikey"] = $res->values["apikey"]; 
        $data = json_encode($data);
        $res = new DBinsertTB1($data);
    }
} catch (Exception $e) { echo $e->getMessage();
} finally { $res->getContent(); }

?>
