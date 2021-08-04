<?php

class DBSelectmasterUser extends DBtools {
    
    const FILE = "selectTB3_ifMaster.sql";


    public function __construct() {
        
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
                $this->values = $r->fetch_array(MYSQLI_ASSOC);
            } else { $this->values["empty"] = true; }
            $r->free();
        } else { throw new Exception($this->sql . " -> " . $this->mysqli->error); }
    }
}

