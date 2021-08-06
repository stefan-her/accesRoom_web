<?php

class DBSelectTB1_lastIn extends DBtools {
    
    const FILE = "selectTB1_lastIn.sql";
    
    
    public function __construct() {
        
        try {
            $path = $this->buildPath(self::FILE);
            if($this->sql == null && !realpath($path)) { throw new Exception("App not initialised");  }
            $this->pathSqlFile = realpath($path);
            $this->getSql();
            $this->connect();
            $this->mysqli->select_db(DBtables::DB);
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
                $this->values = $r->fetch_array(MYSQLI_NUM);
            } else { $this->values["empty"] = true; }
            $r->free();
        } else { throw new Exception($this->sql . " -> " . $this->mysqli->error); }
    }
}

