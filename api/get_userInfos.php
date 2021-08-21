<?php

chdir($_SERVER['DOCUMENT_ROOT']);
require_once(realpath("utilities/Globals.php"));
require_once(realpath(Globals::AUTOLOADER));
Autoloader::register("utilities");

if(isset($_GET["email"]) && isset($_GET["pwd"])) {
    $email = trim($_GET["email"]);
    $pwd =  trim($_GET["pwd"]);
    $res = new DBSelectTB3_userInfos($email, $pwd);
    $res->getContent();
}


?>