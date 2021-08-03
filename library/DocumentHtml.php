<?php

class DocumentHtml {
    
    private $dom =				null;
    private $root = 			null;
    
    private $_html =			null;
    
    public function __construct() {
        $imp = new DOMImplementation();
        $dtd = $imp->createDocumentType("html");
        $this->dom = $imp->createDocument("", "html", $dtd);
        
        $this->dom->formatOutput = true;
        $this->dom->preserveWhiteSpace = true;
        
        $this->root = $this->dom->documentElement;
        $this->dom->appendChild($this->root);  
    }
    
    public function save() {
        $this->_html = mb_convert_encoding($this->dom->saveHTML(), Globals::CHARSET, 'HTML-ENTITIES');
        echo $this->_html;
    }
    
    public function __get($property) {
        return $this->$property;
    }
}

?>