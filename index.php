<?php

require_once("utilities/Globals.php");
require_once(Globals::AUTOLOADER);
Autoloader::register();  // -> array(list path of DIRECTORIES)

$documentHtml = new DocumentHtml();
$documentInit = new DocumentInit(); // -> ajout des éléments personnalisés
$reactInit =    new ReactInit();

$documentHtml->root->setAttribute("lang", "fr");

$node = $documentHtml->dom->importNode($documentInit->documentFragment, true);

$reactBody = $documentHtml->dom->importNode($reactInit->documentFragmentHead, true);
$node->firstChild->appendChild($reactBody);

$reactBody = $documentHtml->dom->importNode($reactInit->documentFragmentBody, true);
$node->lastChild->appendChild($reactBody);

$documentHtml->root->appendChild($node);
$documentHtml->save();

?> 
