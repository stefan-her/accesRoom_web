<?php



class Ressources {
    
    const LANG = "en";
    const EXT = ".txt";
    private $fileContent = null;
    private $values = array();
    private $json = null;
    
    public function __construct($path, $lang = null) {
        $lang = ($lang == null) ? self::LANG : $lang;
        $path = preg_replace("#/$#", "", $path)."/";
        try {
            if(file_exists($path.$lang.self::EXT)) { $file = $path.$lang.self::EXT; }
            elseif(file_exists($path.self::LANG.self::EXT)) { $file = $path.self::LANG.self::EXT; }
            else { throw new Exception("file : ". $path.$lang.self::EXT . " don't exist"); }
            
            if(isset($file)) { $this->getValues($file); }
        } catch (Exception $e) { $this->values["error"] = $e->getMessage(); } 
        finally { $this->getContent(); }
    }
    
    public function getContent() {
        $this->json = json_encode($this->values);
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
    
    public function __get($property) {
        return $this->json;
    }
}

