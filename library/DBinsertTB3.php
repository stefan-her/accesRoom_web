<?php

class DBinsertTB3 extends DBtools {

    const FILE = "insertTB3.sql";
    
    public function __construct($data) {
        try {
            $path = $this->buildPath(self::FILE);
            $this->pathSqlFile = realpath($path);
            if(!$this->pathSqlFile) { throw new Exception("App not initialised");  }
            $this->getSql();
            $this->connect();
            $this->mysqli->select_db(DBtables::DB);
            $this->request($data);
        } catch (Exception $e) {
            $this->values["error"] = $e->getMessage();
        } finally {
            $this->disconnect();
        }
    }

    private function request($data) {
        $data[] = uniqid();
        $data = array_values($data);
        if ($stmt = $this->mysqli->prepare($this->sql)) {
            $bind_names[] = implode("", array_fill(0, count($data), "s"));
            for ($i = 0; $i < count($data); $i++) {
                $bind_name = 'bind' . $i;
                $$bind_name = $data[$i];
                $bind_names[] = &$$bind_name;
            }
            
            call_user_func_array(array($stmt,'bind_param'), $bind_names);

            $stmt->execute();
            
            if(mysqli_stmt_error($stmt)) {
                $this->values["error"] = mysqli_stmt_error($stmt);
            } else {
                $this->values["id"] = $stmt->insert_id;
            }
            
            $stmt->close();
            
        } else { throw new Exception($this->mysqli->error);  }
    }
}

