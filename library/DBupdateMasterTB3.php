<?php

class DBupdateMasterTB3 extends DBtools {
    
    const FILE = "updateMasterTB3.sql";
    
    public function __construct($bool, $id) {
        try {
            $path = $this->buildPath(self::FILE);
            $this->pathSqlFile = realpath($path);
            if(!$this->pathSqlFile) { throw new Exception("App not initialised");  }
            $this->getSql();
            $this->connect();
            $this->mysqli->select_db(DBtables::DB);
            $this->request($bool, $id);
        } catch (Exception $e) {
            $this->values["error"] = $e->getMessage();
        } finally {
            $this->disconnect();
        }
    }
    
    private function request($bool, $id) {
        $v = ($bool) ? 1 : 0;
        if ($stmt = $this->mysqli->prepare($this->sql)) {
            $stmt->bind_param("ii", $v, $id);
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