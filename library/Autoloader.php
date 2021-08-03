<?php

class Autoloader {
    
    static $path =		array();
    static $dirs = 		array();
    static $format =	array("%s.php", "%s.class.php", "%s.inc.php");
    
    static function register($path = null) {
        self::currentPath();
        if(is_string($path)) { $path = array($path); }
        if(is_array($path)) { self::$path = array_merge(self::$path, $path); }
        self::checkSlach();
        self::$path = array_unique(self::$path);
        spl_autoload_register(array(__CLASS__ , 'Autoloader::autoload'));
    }
    
    static function checkSlach () {
        foreach (self::$path as $k => $v) {
            self::$path[$k] = preg_replace("#[\//|\\\]#", DIRECTORY_SEPARATOR, trim($v));
            if(!preg_match("#".DIRECTORY_SEPARATOR."$#", $v)) { self::$path[$k] .= DIRECTORY_SEPARATOR; }
        }
    }
    
    static function currentPath() {
        self::$path[] = __DIR__;
    }
    
    static function autoload($className) {
        $className = explode(DIRECTORY_SEPARATOR, $className);
        $className = end($className);
        
        if(self::$path != null) {
            if(is_string(self::$path)) { self::$path = array(self::$path); }
            $paths = array();
            foreach (self::$path as $vP) {
                if(file_exists($vP)) { $paths[] = $vP; }
            }
            self::$dirs = array_merge(self::$dirs, $paths);
            self::$dirs = array_unique(self::$dirs);
        }
        
        foreach (self::$dirs as $vD) {
            foreach (self::$format as $vF) {
                $path = $vD.sprintf($vF, $className);
                if(file_exists($path)) { require_once($path); break; }
            }
        }
    }
}


?>
