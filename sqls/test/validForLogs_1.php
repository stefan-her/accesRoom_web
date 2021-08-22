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
    
    Tools::createTempDir();
    $temp_dir = realpath(Globals::TEMPDIR);
    
    // fichier ressource pour le test
    $path = realpath("modules/insertStartLogs/res/" . Globals::INSERTSTARTLOGS_FILE);
    $v = file_get_contents($path);
    $v = preg_replace("#((\"apikey\"(?:\s+)?\:(?:\s+)?)\".*?\")#", '$2"'.$res->values["apikey"].'"', $v);
    file_put_contents($temp_dir . DIRECTORY_SEPARATOR . Globals::INSERTSTARTLOGS_FILE, $v, LOCK_NB);  
    
    
/*
    $fp = fopen($temp_dir . DIRECTORY_SEPARATOR . Globals::INSERTSTARTLOGS_FILE, 'w');
    fwrite($fp, $v);
    fclose($fp);
*/    
    
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
?>