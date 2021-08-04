<?php

class Tools {
    
    public static function createTempDir() {
        if(!file_exists(Globals::TEMPDIR)) {
            if(!mkdir(Globals::TEMPDIR, 0777)) {
                throw new Exception("Fail to create " . Globals::TEMPDIR . " directory");
            }
        }
    }
    
    public static function listFiles($path) {
        if(!file_exists($path)) { throw new Exception($path . " not found"); }
        $files = array_diff( scandir($path), array(".", "..") );
        return $files;
    }
    
    public static function clearDir($path) {
        $files = Tools::listFiles($path);
        foreach ($files as $file) {
            unlink($path . DIRECTORY_SEPARATOR . $file);
        }
    }
    
    public function convertConst() {
        $oClass = new ReflectionClass($this);
        $a = $oClass->getConstants();
        header('Content-Type: application/json');
        echo json_encode($a);
    }
}

