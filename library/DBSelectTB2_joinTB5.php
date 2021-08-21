<?php

class DBSelectTB2_joinTB5 extends DBtools {
    
    const FILE = "selectTB2_joinTB5.sql";
    
    
    public function __construct($id) {
        
        try {
            $path = $this->buildPath(self::FILE);
            if($this->sql == null && !realpath($path)) { throw new Exception("App not initialised");  }
            $this->pathSqlFile = realpath($path);
            $this->getSql();
            $this->connect();
            $this->mysqli->select_db(DBtables::DB);
            $this->request($id);
        } catch (Exception $e) {
            $this->values["error"] = $e->getMessage();
        } finally {
            $this->disconnect();
        }
    }
    
    private function request($id) {
        if ($stmt = $this->mysqli->prepare($this->sql)) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $r = $stmt->get_result();
            if(mysqli_stmt_error($stmt)) {
                $this->values["error"] = mysqli_stmt_error($stmt);
            } elseif($r->num_rows == 0) {
                $this->values["empty"] = true;
            } else {
                while ($row = $r->fetch_array(MYSQLI_ASSOC)) {
                    $this->values["result"][] = array_map("utf8_encode", $row);
                }
            }
            $stmt->close();
            $r->free();
        } else { throw new Exception($this->sql . " -> " . $this->mysqli->error); }
    }
}
