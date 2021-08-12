<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register("utilities");

// fichier ressource pour le test
$path = realpath("modules/insertStartLogs/res/json");

$res = new DBexist();
if(empty($res->values["error"]) || !$res->values["error"]) {
    
    Tools::createTempDir();
    $temp_dir = realpath(Globals::TEMPDIR);
    
    if(file_exists($temp_dir . DIRECTORY_SEPARATOR . Globals::DEMOINSERTLOG_INSERTED)) {
        $v = file_get_contents($temp_dir . DIRECTORY_SEPARATOR . Globals::DEMOINSERTLOG_INSERTED);
        $line = (is_numeric($v)) ? intval($v) +1 : null;
    } else { $line = (isset($_GET["line"])) ? intval($_GET["line"]) : 0; }
    
    $content = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    if(count($content) > ($line)) {

        $a = array("str" => false, "status" => "no");
        if(isset($content[$line])) {
            $res = new DBinsertTB1($content[$line]);
            if(isset($res->values["done"])) {
                $a["status"] = "ok";
                file_put_contents($temp_dir . DIRECTORY_SEPARATOR . Globals::DEMOINSERTLOG_INSERTED, $line);
            }
            else { $a["status"] = "no"; }
            
            $a["str"] = $content[$line];
            if(isset($content[$line +1])) { $a["line"] = $line +1; }
        }
        
        
    } else { $a["done"] = true; }
    
    header('Content-Type: application/json');
    echo json_encode($a);
    
} else { $res->getContent(); }


?>