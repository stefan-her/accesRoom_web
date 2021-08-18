UPDATE `room_access`.`members` 
SET 
	`firstname` = ?, 
    `lastname` = ?, 
    `phone` = ?, 
    `email` = ?,
    `password` = ?
WHERE `members`.`id_members` = ?;