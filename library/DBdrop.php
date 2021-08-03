<?php

class DBdrop extends DBtools {

    const FILE = "dbdrop.sql";
    
    public function __construct() {
        try {
            $path = $this->buildPath(self::FILE);
            $this->pathSqlFile = realpath($path);
            if(!$this->pathSqlFile) { throw new Exception("App not initialised");  }
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
        if ($this->mysqli->query($this->sql) === true) {
            $this->values["done"] = true;
        } else { throw new Exception($this->sql . " -> " . $this->mysqli->error); }
    }
}

