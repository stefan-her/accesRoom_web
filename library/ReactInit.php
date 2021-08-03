<?php

class ReactInit extends DocumentElements {
    
    private $documentFragmentHead =  null;
    private $documentFragmentBody =  null;
    
    protected $_dom =               null;
    
    public function __construct() {
        $this->_dom = new DOMDocument("1.0", Globals::CHARSET);
        $this->documentFragmentHead = $this->_dom->createDocumentFragment();
        $this->documentFragmentBody = $this->_dom->createDocumentFragment();
        $this->createApp();
    }
    
    private function createApp() {
        $node = $this->createComment(Globals::REACT_MANIFEST_COMMENT);
        $this->documentFragmentHead->appendChild($node);
        
        $node = $this->createTag("link", ["rel" => "manifest", "href" => "%PUBLIC_URL%/manifest.json"]);
        $this->documentFragmentHead->appendChild($node);
                
        
        $node = $this->createTag("meta", ["name" => "viewport", "content" => "width-device-width, initial-scale=1"]);
        $this->documentFragmentHead->appendChild($node);
        
        $node = $this->createTag("meta", ["name" => "theme-color", "content" => "#000000"]);
        $this->documentFragmentHead->appendChild($node);
        
        
        $node = $this->createTag("meta", ["name" => "description", "content" => Globals::DESC]);
        $this->documentFragmentHead->appendChild($node);

        
        $node = $this->createTag("noscript");
        $node->appendChild($this->createText(Globals::NOSCRIPT));
        $this->documentFragmentBody->appendChild($node);
        
        $node = $this->createTag("div", ["id" => "root"]);
        $this->documentFragmentBody->appendChild($node);
        
        $node = $this->createComment(Globals::REACT_ROOT_COMMENT);
        $this->documentFragmentBody->appendChild($node);
    }
    
    public function __get($property) {
        return $this->$property;
    }
}

