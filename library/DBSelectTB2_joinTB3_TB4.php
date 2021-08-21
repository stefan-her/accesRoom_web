<?php

class DBSelectTB2_joinTB3_TB4 extends DBtools {
    
    const FILE = "selectTB2_joinTB3_TB4.sql";
    
    
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
        $s1 = "organisateur";
        $s2 = "participant";
        $s3 = "preparateur";
        
        $this->mysqli->set_charset('utf8');
        if ($stmt = $this->mysqli->prepare($this->sql)) {
            $stmt->bind_param("isisisii", $id, $s1, $id, $s2, $id, $s3, $id, $id);
            $stmt->execute();
            $stmt->execute();
            $result = $stmt->get_result();
            if($result->num_rows == 1) {
                $this->values["result"] = $result->fetch_array(MYSQLI_ASSOC);
            } else {
                $this->values["empty"] = true;
                $this->values["error"] = "no user infos found";
            }
            $stmt->close();
        } else { throw new Exception($this->sql . " -> " . $this->mysqli->error); }
    }
}
