UPDATE `room_access`.`members` 
SET 
	`firstname` = ?, 
    `lastname` = ?, 
    `phone` = ?, 
    `email` = ?
WHERE `members`.`id_members` = ?;