<?php

class DBcolumnName extends DBtools {
    
    const FILE = "dbcolumnName.sql";
    private $tb = null;

    public function __construct($tableName) {
        
        $this->tb = $tableName;
        
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
        if ($stmt = $this->mysqli->prepare($this->sql)) {
            $stmt->bind_param("s", $this->tb);
            $stmt->execute();
            $r = $stmt->get_result();
            
            if(mysqli_stmt_error($stmt)) {
                $this->values["error"] = mysqli_stmt_error($stmt);
            } else {
                while ($row = $r->fetch_array(MYSQLI_ASSOC)) {
                    $this->values[$row["COLUMN_NAME"]] = $row["DATA_TYPE"];
                }
            }
            $stmt->close();
        }
    }
}

