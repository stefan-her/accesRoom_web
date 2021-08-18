UPDATE `room_access`.`members` 
SET `master` = ? 
WHERE `members`.`id_members` = ?;