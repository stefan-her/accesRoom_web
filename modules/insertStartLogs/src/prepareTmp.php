<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register(["utilities"]);


if($_GET["apikey"]) {
    
    try {
        
        $res = new DBSelectTB3_apiKey($_GET["apikey"]);
        if(empty($res->values["done"])) { throw new Exception('API key not found'); }
        
        Tools::createTempDir();
        $temp_dir = realpath(Globals::TEMPDIR);
        
        // fichier ressource pour le test
        $path = realpath("modules/insertStartLogs/res/" . Globals::INSERTSTARTLOGS_FILE);
        $v = file_get_contents($path);
        $v = preg_replace("#((\"apikey\"(?:\s+)?\:(?:\s+)?)\".*?\")#", '$2"'.$_GET["apikey"].'"', $v);
        file_put_contents($temp_dir . DIRECTORY_SEPARATOR . Globals::INSERTSTARTLOGS_FILE, $v, LOCK_NB);
        
        $b = true;
        while($b) {
            sleep(1);
            if(file_exists($temp_dir . DIRECTORY_SEPARATOR . Globals::INSERTSTARTLOGS_FILE)) {
                $b = false;
                $res->getContent();
                break;
            }
        }
        
    } catch(Exception $e) {
        echo $e->getMessage();
    }
    
}


?>