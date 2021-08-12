<?php

class DBinit extends DBtools  {
    
    const FILE = "init.sql";

    public function __construct() {
        try {
            $path = $this->buildPath(self::FILE);
            $this->pathSqlFile = realpath($path);
            if(!$this->pathSqlFile) { throw new Exception("App not initialised");  }
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
        if ($this->mysqli->multi_query($this->sql)) {
            do {
                $this->mysqli->store_result();
            } while ($this->mysqli->more_results() && $this->mysqli->next_result());
        } else { throw new Exception($this->mysqli->error); }
        $this->values["done"] = true;
    }
}

