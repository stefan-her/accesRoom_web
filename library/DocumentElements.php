<?php

abstract class DocumentElements {
    
    protected function createTag($tagName, $attr = array()) {
        $node = $this->_dom->createElement($tagName);
        if(count($attr) > 0) {
            foreach ($attr as $k => $v) {
                $attribute = $this->_dom->createAttribute($k);
                $attribute->value = $v;
                $node->appendChild($attribute);
            }
        }
        return $node;
    }
    
    protected function createText($s) {
        $node = $this->_dom->createTextNode($s);
        return $node;
    }
    
    protected function createComment($s) {
        $node = $this->_dom->createComment($s);
        return $node;
    }
}

