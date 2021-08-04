<?php



class Ressources {
    
    const LANG = "en";
    const EXT = ".txt";
    private $fileContent = null;
    private $values = array();
    
    public function __construct($path, $lang = null, $ref = null) {
        $lang = ($lang == null) ? self::LANG : $lang;
        $path = realpath($path)."/";
        
        try {
            if(file_exists($path.$lang.self::EXT)) { $file = $path.$lang.self::EXT; }
            elseif(file_exists($path.self::LANG.self::EXT)) { $file = $path.self::LANG.self::EXT; }
            else { throw new Exception("file : ". $path.$lang.self::EXT . " don't exist"); }
            
            if(isset($file)) { $this->getValues($file); }
            if($ref != null) { $this->getRef($ref); }
        } catch (Exception $e) { $this->values["error"] = $e->getMessage(); } 
    }
    
    public function getValues($path) {
        $file = file($path);
        foreach ($file as $s) {
            if(trim($s) != "") { $this->getLine($s); }
        }
    }
    
    private function getLine($s) {
        preg_match("#(.*)(?:\s+)?:(?:\s+)?(.*)#", $s, $matches);
        $this->values[trim($matches[1])] = trim($matches[2]);
    }
    
    private function getRef($ref) {
        if(isset($this->values[$ref])) { 
            $value = $this->values[$ref];
            $this->values =  array();
            $this->values[$ref] = $value;
        }
    }
    
    public function __get($property) {
        header('Content-Type: application/json');
        echo json_encode($this->$property);
    }
}

