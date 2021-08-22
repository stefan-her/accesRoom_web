<?php

abstract class DBtools {
    
    protected $pathSqlFile = false;
    
    // TODO
    // remettre public en protected!!!
    protected $values = array();
    protected $mysqli = null;
    protected $sql = null;
    
    protected function connect() {
        $this->mysqli = new mysqli(MysqlConnect::SERVER, MysqlConnect::USER, MysqlConnect::PWD);
        if ($this->mysqli->connect_errno) {
            throw new Exception("connect fail");
        }
        
    }
    
    protected function disconnect() {
        if($this->mysqli != null) {
            $this->mysqli->close();
        }
    }
    
    protected function getSql() {
        if($this->sql == null) {
            $this->sql = file_get_contents($this->pathSqlFile);
        }
    }
    
    protected function buildPath($file) {
        return Globals::SQLSDIR . DIRECTORY_SEPARATOR . Globals::SQLDIR_PREPARED. DIRECTORY_SEPARATOR . $file;
    }

    public function getContent() {
        header('Access-Controle-Allow-Origin:*');
        header('Access-Controle-Allow-Header: Origin, X-Requested-With, Content-type, Accept');
        header('Access-Controle-Allow-Header: GET, POST, PUT, DELETE');
        header('Content-Type: application/json');
        echo json_encode($this->values);
    }
    
    public function __get($property) {
        return $this->$property;
    }
    
}

