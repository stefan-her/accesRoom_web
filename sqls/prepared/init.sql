SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


CREATE DATABASE IF NOT EXISTS room_access;

USE room_access;

CREATE TABLE `room_access`.`room` 
	( 
		`id_room` INT NOT NULL AUTO_INCREMENT , 
		`name` VARCHAR(255) NOT NULL , 
		`open_close` BOOLEAN NOT NULL DEFAULT FALSE , 
		`prepared` BOOLEAN NOT NULL DEFAULT FALSE , 
		PRIMARY KEY (`id_room`)
	) 
	ENGINE = InnoDB
	COMMENT = 'table des locaux disponibles';
	
CREATE TABLE `room_access`.`meeting` 
	( 
		`id_meeting` INT NOT NULL AUTO_INCREMENT , 
		`id_room_fk` INT NOT NULL , 
		`title` VARCHAR(255) NOT NULL , 
		`begin` DATETIME NOT NULL , 
		`end` DATETIME NULL , 
		`canceled` BOOLEAN NOT NULL DEFAULT FALSE , 
		PRIMARY KEY (`id_meeting`), 
		INDEX (`id_room_fk`)
	) 
	ENGINE = InnoDB
	COMMENT = 'table des reunions a venir et passees';
	
CREATE TABLE `room_access`.`role` 
	( 
		`id_role` INT NOT NULL AUTO_INCREMENT , 
		`role` VARCHAR(255) NOT NULL , 
		PRIMARY KEY (`id_role`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'role des personnes dans les reunions';
	
CREATE TABLE `room_access`.`members` 
	( 
		`id_members` INT NOT NULL AUTO_INCREMENT , 
		`firstname` VARCHAR(255) NULL , 
		`lastname` VARCHAR(255) NOT NULL , 
		`phone` VARCHAR(255) NULL , 
		`email` VARCHAR(255) NOT NULL , 
		`password` VARCHAR(255) NULL ,
		`master` BOOLEAN NOT NULL DEFAULT FALSE ,
		`apikey` CHAR(36) NOT NULL ,
		PRIMARY KEY (`id_members`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'table des utilisateurs connus dans l\'app';
	
CREATE TABLE `room_access`.`tool` 
	( 
		`id_tool` INT NOT NULL AUTO_INCREMENT , 
		`tool` VARCHAR(255) NOT NULL , 
		PRIMARY KEY (`id_tool`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'ensemble des outils disponibles pour les reunions';	
	
CREATE TABLE `room_access`.`meeting_tool_tbl` 
	( 
		`id_meeting_tool_tbl` INT NOT NULL AUTO_INCREMENT , 
		`id_meeting_fk` INT NOT NULL , 
		`id_tool_fk` INT NOT NULL , 
		`count` INT NOT NULL DEFAULT '1' , 
		PRIMARY KEY (`id_meeting_tool_tbl`), 
		INDEX (`id_meeting_fk`), 
		INDEX (`id_tool_fk`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'liaison entre meeting et tool et la quantite de tool';	
	
CREATE TABLE `room_access`.`meeting_members_role_tbl` 
	( 
		`id_meeting_members_role_tbl` INT NOT NULL AUTO_INCREMENT , 
		`id_meeting_fk` INT NOT NULL , 
		`id_members_fk` INT NOT NULL , 
		`id_role_fk` INT NOT NULL , 
		`log` BOOLEAN NOT NULL DEFAULT FALSE , 
		PRIMARY KEY (`id_meeting_members_role_tbl`), 
		INDEX (`id_meeting_fk`), 
		INDEX (`id_members_fk`), 
		INDEX (`id_role_fk`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'liaison entre meeting et members + role check la presence';
	

CREATE TABLE `room_access`.`log` 
	(
		`id_log` INT NOT NULL AUTO_INCREMENT ,
		`content` TEXT NOT NULL,
		`dateIn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`id_members_fk` INT DEFAULT NULL , 
		PRIMARY KEY (`id_log`)
	) 
	ENGINE = InnoDB 
	COMMENT='table des logs NFC';		
	
	
	

CREATE TRIGGER `dispatcher` AFTER INSERT ON `log` FOR EACH ROW 
	IF (
		SELECT COUNT(*) 
		FROM information_schema.TABLES 
		WHERE TABLE_NAME = JSON_UNQUOTE(new.content->'$.tb')
	) = 1 
	THEN 
		CASE   
		
			WHEN (JSON_UNQUOTE(new.content->'$.tb')) = "meeting"
		    	THEN
					SET @fields = JSON_EXTRACT(new.content,'$.fields');
		            SET @fieldsName = JSON_KEYS(@fields);
	                SET @title = null;
	                SET @room = null;
	                SET @begin = null;
	                SET @end = null;
	                
		            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'title') IS NOT NULL)
		            THEN
						SET @title = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.title'));
		            END IF;
		                                    
		            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'room') IS NOT NULL)
		            THEN
	                	SET @ID = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.room'));
	                	IF(
	                    	SELECT COUNT(*)
	                        FROM `room`
	                        WHERE `id_room` = @ID
	                    ) = 1
	                	THEN
	                    	SET @room = @ID;
	                    ELSE
	                    	SIGNAL SQLSTATE '45000';
	                    END IF;
		            END IF;
	                
	                IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'begin') IS NOT NULL)
		            THEN
	                	IF(
	                    	SELECT @D := STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.begin')), '%Y-%m-%d %H:%i:%s')
	                    ) IS NOT NULL
	                	THEN
	                		SET @begin = @D;
	                	ELSE 
							SIGNAL SQLSTATE '45000';
						END IF;
	                END IF;
	                 
	                IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'end') IS NOT NULL)
		            THEN
	                	IF(
	                    	SELECT @D := STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.end')), '%Y-%m-%d %H:%i:%s')
	                    ) IS NOT NULL
	                	THEN
	                		SET @end = @D;
	                	ELSE 
							SIGNAL SQLSTATE '45000';
						END IF;
	                END IF;               
	                INSERT INTO `meeting`(`title`, `id_room_fk`, `begin`, `end`) 
		            VALUES(@title, @room, @begin, @end);
		
	   
	    	WHEN (JSON_UNQUOTE(new.content->'$.tb')) = "members"
	    	THEN
				SET @fields = JSON_EXTRACT(new.content,'$.fields');
	            SET @fieldsName = JSON_KEYS(@fields);
	            SET @firstname = null;
	            SET @lastname = null;
	            SET @phone = null;
	            SET @email = null;
	            SET @password = null;
	            
	            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'firstname') IS NOT NULL)
	            THEN
					SET @firstname = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.firstname'));
	            END IF;
	                                    
	            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'lastname') IS NOT NULL)
	            THEN
					SET @lastname = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.lastname'));
	            END IF;
	                                                
	            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'phone') IS NOT NULL)
	            THEN
					SET @phone = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.phone'));
	            END IF;
	                                                
	            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'email') IS NOT NULL)
	            THEN
					SET @email = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.email'));
	            END IF;
	                                                
	            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'password') IS NOT NULL)
	            THEN
					SET @password = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.password'));
	            END IF;
	            
	            INSERT INTO `members`(`firstname`, `lastname`, `phone`, `email`, `password`) 
	            VALUES(@firstname, @lastname, @phone, @email, @password);
	          
	    	
	        WHEN (JSON_UNQUOTE(new.content->'$.tb')) = "tool"
	    	THEN
				SET @fields = JSON_EXTRACT(new.content,'$.fields');
	            SET @fieldsName = JSON_KEYS(@fields);
	            
	            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'tool') IS NOT NULL)
	            THEN
	            	INSERT INTO `tool`(tool) 
	                VALUES(JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.tool')));
	            END IF;
	            
	            
	    	WHEN (JSON_UNQUOTE(new.content->'$.tb')) = "role"
	    	THEN
				SET @fields = JSON_EXTRACT(new.content,'$.fields');
	            SET @fieldsName = JSON_KEYS(@fields);
	            
	            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'role') IS NOT NULL)
	            THEN
	            	INSERT INTO `role`(role) 
	                VALUES(JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.role')));
	            END IF; 
	            
	            
	    	WHEN (JSON_UNQUOTE(new.content->'$.tb')) = "room"
	    	THEN
				SET @fields = JSON_EXTRACT(new.content,'$.fields');
	            SET @fieldsName = JSON_KEYS(@fields);
	            SET @name = NULL;
	            SET @open_close = 0;
	            SET @prepared = 0;
	            
	            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'name') IS NOT NULL)
	            THEN
	                SET @name = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.name'));
	            END IF;
	                        
	            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'open_close') IS NOT NULL)
	            THEN
	                SET @open_close = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.open_close'));
	            END IF;
	                        
	            IF(SELECT JSON_SEARCH(@fieldsName, 'one', 'prepared') IS NOT NULL)
	            THEN
	                SET @prepared = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.prepared'));
	            END IF;
	            
	            INSERT INTO `room`(name, open_close, prepared) 
	            VALUES(@name, @open_close, @prepared);
	    END CASE;
	END IF;
	
CREATE TRIGGER `verifApiKey` BEFORE INSERT ON `log` FOR EACH ROW IF (
			SELECT @ID := `id_members`
			FROM `members`
			WHERE `apikey` = JSON_UNQUOTE(new.content->'$.apikey')
		) IS NOT NULL
		THEN
			SET new.id_members_fk = @ID;
		ELSE 
			SIGNAL SQLSTATE '45000';
		END IF;

COMMIT;
	
	