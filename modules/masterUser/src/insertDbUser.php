<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register("utilities");


try {
    $res = new DBexist();
    if(isset($res->values["error"])  &&  $res->values["error"]) { throw new Exception($res->values["error"]); }
    
    $res = new DBSelectmasterUser();
    
    $data = json_decode(file_get_contents('php://input'), true);
    if(isset($res->values["id_".DBtables::TB3])) {
        $res = new DBupdateTB3($data, $res->values["id_".DBtables::TB3]);
    } else {
        $res = new DBinsertTB3($data);
        if(isset($res->values["id"])) {
            $res = new DBupdateMasterTB3(true, $res->values["id"]);
        }
    }

    
} catch (Exception $e) {
    
} finally { $res->getContent(); }


?>
