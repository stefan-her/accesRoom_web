<?php

class DocumentInit extends DocumentElements {
    
    protected $_dom =          null;
    
    private $_head =           null;
    private $_body =           null;
    
    private $documentFragment = null;

    
    public function __construct() {
        $this->_dom = new DOMDocument("1.0", Globals::CHARSET);
        $this->documentFragment = $this->_dom->createDocumentFragment();
        $this->createHead();
        $this->createBody();
    }
    
    private function createHead() {
        $this->_head = $this->createTag("head");
        
        $title = $this->createTag("title");
        $title->appendChild($this->createText(Globals::TITLE));
        $this->_head->appendChild($title);
        
        $node = $this->createTag("base", ["href" => Globals::BASE]);
        $this->_head->appendChild($node);
        
        $node = $this->createTag("meta", ["charset" => Globals::CHARSET]);
        $this->_head->appendChild($node);
        
        $node = $this->createTag("link", ["href" => "styles/base.css", "rel" => "stylesheet", "type" => "text/css"]);
        $this->_head->appendChild($node);
        
        // -> customElements Declaration des modules
        $node = $this->createTag("script", ["type" => "module", "src" => "modules/customElementDefine.js"]);
        $this->_head->appendChild($node);
        
        $this->documentFragment->appendChild($this->_head);
    }
    
    private function createBody() {
        $this->_body = $this->createTag("body");
        
        // -> customElements modules/Dashboard
        $node = $this->createTag("elem-dashboard", ["style" => "styles/dashboard.css"]);
        
        // -> customElements modules/InitDb
        $button = $this->createTag("action-button", ["action" => "modules/initDb", "style" => "styles/initDb.css"]);
        $node->appendChild($button);
        
        // -> customElements modules/MasterUser
        $button = $this->createTag("action-button", ["action" => "modules/masterUser", "style" => "styles/masterUser.css"]);
        $node->appendChild($button);
        
        // -> customElements modules/logViewer
        $button = $this->createTag("action-button", ["action" => "modules/insertStartLogs", "style" => "styles/insertStartLogs.css"]);
        $node->appendChild($button);
        
        // -> customElements modules/logViewer
        $button = $this->createTag("action-button", ["action" => "modules/logViewer", "style" => "styles/logViewer.css"]);
        $node->appendChild($button);
        
        $this->_body->appendChild($node);
                
        $this->documentFragment->appendChild($this->_body);
    }
    
    public function __get($property) {
        return $this->$property;
    }
}

