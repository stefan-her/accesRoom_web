INSERT INTO `room_access`.`members` 
(`firstname`, `lastname`, `phone`, `email`, `password`, `apikey`) 
VALUES (?,?,?,?, SHA1(?),?)