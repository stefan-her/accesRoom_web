<?php

class DbInfo {
    
    const REX = "#^[a-z_]+$#";
    const SQLDBEXIST_FILE = "dbexist.sql";
    const SQLINIT_FILE = "init.sql";
    
    private $fileContent = null;
    private $sqlFiles = array();
    private $values = array();
    private $insert = array();
    private $resultCreateTemp = array();
    private $resultAction = array("resp" => "no");
    
    // paths
    private $temp_file = false;
    private $utilities_file = false;
    private $temp_dir = false;
    private $sqlsOrgs_dir = false;
    private $qlsPrepared_dir = false;
    private $sqlDbExist_file = false;

    
    public function __construct() {
        try {
            $this->sqlDbExist_file = realpath(Globals::SQLSDIR . DIRECTORY_SEPARATOR . Globals::SQLDIR_ORGS . DIRECTORY_SEPARATOR . self::SQLDBEXIST_FILE);
            $this->utilities_file = realpath(Globals::UTILITIESDIR . DIRECTORY_SEPARATOR . Globals::DBINFO_STUCTURE);
            $this->sqlsOrgs_dir = realpath(Globals::SQLSDIR . DIRECTORY_SEPARATOR . Globals::SQLDIR_ORGS);
            $this->sqlsPrepared_dir = realpath(Globals::SQLSDIR . DIRECTORY_SEPARATOR . Globals::SQLDIR_PREPARED);
            if(!$this->sqlDbExist_file || !$this->utilities_file || !$this->sqlsOrgs_dir || !$this->sqlsPrepared_dir) {
                throw new Exception("files or directory not found for initialisate"); 
            }
            
            $this->temp_file = realpath(Globals::TEMPDIR .DIRECTORY_SEPARATOR. Globals::DBINFO_STUCTURE);
            
            $this->fileContent = file_get_contents($this->utilities_file);
            $this->getValues();
        } catch (Exception $e) { $this->values["error"] = $e->getMessage(); }
        
    }
    
    private function getValues() {
        preg_match_all("#const\s+(.*)(?:\s+)?=(?:\s+)?\"(.*)\";#", $this->fileContent, $matches);
        if(count($matches) == 0) { throw new Exception("empty"); }
        else {
            for($i = 0; $i < count($matches[0]); $i++) {
                $this->values[trim($matches[1][$i])] = trim($matches[2][$i]);
            }
        }
    }
    
    private function checkValue($data) {
        foreach($data as $key => $value) {
            if(array_key_exists($key, $this->values)) {
                $this->insert[$key] = null;
            } else { throw new Exception("field unknown : " . $key); }
            
            if(preg_match(self::REX, $value)) {
                $this->insert[$key] = $value;
            } else { throw new Exception("bad format from value of : " .$key); }
        }
        
        if(count($this->insert) != count($this->values)) {
            throw new Exception("missing fields");
        }
    }
    
    private function replaceValue() {
        foreach($this->insert as $key => $value) {
            $this->fileContent = preg_replace("#(const\s+".$key."(?:\s+)?=(?:\s+)?\")(.*)(\";)#", '$1' . $value . '$3', $this->fileContent);
        }
    }
    
    private function createFile($path, $content) {
        file_put_contents($path, $content);
    }
    
    private function dbexist() {
        if(file_exists($this->sqlDbExist_file)) {
            $content = file_get_contents($this->sqlDbExist_file);
            $content = preg_replace("#\#\#DB\#\##", $this->insert["DB"], $content);
            $res = new DBexist($content);
            if(isset($res->values["error"])) { 
                $this->resultCreateTemp["db"] = $res->values["db"];
                throw new Exception($res->values["error"]); 
            }
            $this->resultCreateTemp["db"] = $res->values["db"];
        } else { throw new Exception("Fail to create SQL"); }
    }
    
    private function deleteFile($path) {
        unlink($path);
    }

    private function clearDir($path) {
        $files = Tools::listFiles($path);
        if(count($files) > 0) {
            foreach ($files as $file) {
                $this->deleteFile($path. DIRECTORY_SEPARATOR . $file);
            }
        }
    }
    
    private function replaceFlag($content) {
        foreach ($this->values as $key => $value) {
            $content = preg_replace("#\#\#" . $key . "\#\##", $value, $content);
        }
        return $content;
    }
    
    private function initSqls() {
        foreach ($this->sqlFiles as $file) {
            $content = file_get_contents($this->sqlsOrgs_dir . DIRECTORY_SEPARATOR . $file);
            $content = $this->replaceFlag($content);
            $this->createFile($this->sqlsPrepared_dir . DIRECTORY_SEPARATOR . $file, $content);
        }
    }
    
    private function runSql() {
        $content = file_get_contents($this->sqlsPrepared_dir . DIRECTORY_SEPARATOR . self::SQLDBEXIST_FILE);
        $res = new DBexist();
        if($res->values["db"]) {
            $drop = new DBdrop();
            if(!$drop->values["done"]) { throw new Exception("DB not remove"); }
        }
        
        $init = new DBinit();
        if($init->values["done"] === false) { throw new Exception($init->values["error"]); }
    }
    
    public function createContent($param) {
        try { 
            $this->checkValue($param);
            $this->replaceValue();
            Tools::createTempDir();
            $this->temp_dir = realpath(Globals::TEMPDIR);
            Tools::clearDit(Globals::TEMPDIR);
            $this->createFile($this->temp_dir . DIRECTORY_SEPARATOR . Globals::DBINFO_STUCTURE, $this->fileContent);
            $this->dbexist();
        } catch (Exception $e) { $this->resultCreateTemp["error"] = $e->getMessage(); }
    }
    
    public function actionCreate() {
        try {
            if(!$this->temp_file) { throw new Exception("problem with Temp file"); }
            $this->clearDir($this->sqlsPrepared_dir);
            rename($this->temp_file, $this->utilities_file);
            $this->fileContent = file_get_contents($this->utilities_file);
            $this->getValues();
            $this->sqlFiles = Tools::listFiles($this->sqlsOrgs_dir);
            
            if(count($this->sqlFiles) == 0) { throw new Exception("no files found in : " . $this->sqlsOrgs_dir); }
            $this->initSqls();
            $this->runSql();
            $this->resultAction["resp"] = "ok"; 
        } catch (Exception $e) { $this->resultAction["error"] = $e->getMessage(); }
    }
    
    public function actionCancel() { 
        try {
            $this->deleteFile($this->temp_file); 
            $this->resultAction["resp"] = "ok"; 
        } catch (Exception $e) { $this->resultAction["error"] = $e->getMessage(); }
    }
    
    public function __get($property) {
        header('Content-Type: application/json');
        echo json_encode($this->$property);
    }
}

