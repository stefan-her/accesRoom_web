<?php

class DBinsertTB1 extends DBtools {

    const FILE = "insertTB1.sql";
    
    public function __construct($s) {
        try {
            $path = $this->buildPath(self::FILE);
            $this->pathSqlFile = realpath($path);
            if(!$this->pathSqlFile) { throw new Exception("App not initialised");  }
            $this->getSql();
            $this->connect();
            $this->mysqli->select_db(DBtables::DB);
            $this->request($s);
        } catch (Exception $e) {
            $this->values["error"] = $e->getMessage();
        } finally {
            $this->disconnect();
        }
    }

    private function request($s) {
        if ($stmt = $this->mysqli->prepare($this->sql)) {
            @$stmt->bind_param("s", utf8_decode($s));
            $stmt->execute();
            
            if(mysqli_stmt_error($stmt)) {
                $this->values["error"] = mysqli_stmt_error($stmt);
            } else {
                $this->values["done"] = true;
            }
            
            $stmt->close();
        } else { throw new Exception($this->mysqli->error);  }
    }
}

