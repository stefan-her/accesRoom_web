<?php

class DBexist extends DBtools {
    
    const FILE = "dbexist.sql";


    public function __construct($sql = null) {
        
        if($sql) { $this->sql = $sql; }
        
        try {
            $path = $this->buildPath(self::FILE);
            if($this->sql == null && !realpath($path)) { throw new Exception("App not initialised");  }
            $this->pathSqlFile = realpath($path);
            $this->getSql();
            $this->connect();
            $this->request();
        } catch (Exception $e) { 
            $this->values["error"] = $e->getMessage(); 
        } finally {
            $this->disconnect();
        }
    }

    private function request() {
        if ($r = $this->mysqli->query($this->sql)) {
            if($r->num_rows == 1) {
                $this->values["db"] = true;
            } else { throw new Exception("Database not found :-;"); }
            $r->free();
        } else { 
            $this->values["db"] = false;
            throw new Exception($this->sql . " -> " . $this->mysqli->error); 
        }
    }
}

