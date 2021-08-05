UPDATE `room_access`.`user` 
SET 
	`firstname` = ?, 
    `lastname` = ?, 
    `phone` = ?, 
    `email` = ?,
    `password` = ?
WHERE `user`.`id_user` = ?;