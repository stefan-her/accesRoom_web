<?php

class Regex extends Tools {
    const TABLE =   "^[a-z_]+$";
    const TEXT =    "[\w\s]+";
    const NAME =    "^[a-zA-Z\-çéèê']+(?:\s[a-zA-Z\-çéèê']+)?";
    const EMAIL =   "^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$";
    const PHONE =   "^0[0-9]{3}(?:[\s-_/]?[0-9]{2}){3}$";
}

