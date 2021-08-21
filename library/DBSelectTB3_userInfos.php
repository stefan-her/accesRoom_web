<?php

class DBSelectTB3_userInfos extends DBtools {
    
    const FILE = "selectTB3_userInfos.sql";
    
    
    public function __construct($email, $pwd) {
        
        try {
            $path = $this->buildPath(self::FILE);
            if($this->sql == null && !realpath($path)) { throw new Exception("App not initialised");  }
            $this->pathSqlFile = realpath($path);
            $this->getSql();
            $this->connect();
            $this->mysqli->select_db(DBtables::DB);
            $this->request($email, $pwd);
        } catch (Exception $e) {
            $this->values["error"] = $e->getMessage();
        } finally {
            $this->disconnect();
        }
    }
    
    private function request($email, $pwd) {
        if ($stmt = $this->mysqli->prepare($this->sql)) {
            $stmt->bind_param("ss", $email, $pwd);
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

