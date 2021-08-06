<?php

class DBSelectTB3_apiKey extends DBtools {
    
    const FILE = "selectTB3_apiKey.sql";
    
    
    public function __construct($key) {
        
        try {
            $path = $this->buildPath(self::FILE);
            if($this->sql == null && !realpath($path)) { throw new Exception("App not initialised");  }
            $this->pathSqlFile = realpath($path);
            $this->getSql();
            $this->connect();
            $this->mysqli->select_db(DBtables::DB);
            $this->request($key);
        } catch (Exception $e) {
            $this->values["error"] = $e->getMessage();
        } finally {
            $this->disconnect();
        }
    }
    
    private function request($key) {
        if ($stmt = $this->mysqli->prepare($this->sql)) {
            $stmt->bind_param("s", $key);
            $stmt->execute();
            $stmt->store_result();
            if($stmt->num_rows == 1) { $this->values["done"] = true; }
            $stmt->close();
        } else { throw new Exception($this->sql . " -> " . $this->mysqli->error); }
    }
}

