SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


CREATE DATABASE IF NOT EXISTS ##DB##;

USE ##DB##;

CREATE TABLE `##DB##`.`##TB6##` 
	( 
		`id_##TB6##` INT NOT NULL AUTO_INCREMENT , 
		`name` VARCHAR(255) NOT NULL , 
		`open_close` BOOLEAN NOT NULL DEFAULT FALSE , 
		`prepared` BOOLEAN NOT NULL DEFAULT FALSE , 
		PRIMARY KEY (`id_##TB6##`)
	) 
	ENGINE = InnoDB
	COMMENT = 'table des locaux disponibles';
	
CREATE TABLE `##DB##`.`##TB2##` 
	( 
		`id_##TB2##` INT NOT NULL AUTO_INCREMENT , 
		`id_##TB6##_fk` INT NOT NULL , 
		`title` VARCHAR(255) NOT NULL , 
		`begin` DATETIME NOT NULL , 
		`end` DATETIME NULL , 
		`canceled` BOOLEAN NOT NULL DEFAULT FALSE , 
		PRIMARY KEY (`id_##TB2##`), 
		INDEX (`id_##TB6##_fk`)
	) 
	ENGINE = InnoDB
	COMMENT = 'table des reunions a venir et passees';
	
CREATE TABLE `##DB##`.`##TB4##` 
	( 
		`id_##TB4##` INT NOT NULL AUTO_INCREMENT , 
		`##TB4##` VARCHAR(255) NOT NULL , 
		PRIMARY KEY (`id_##TB4##`)
	) 
	ENGINE = InnoDB 
	COMMENT = '##TB4## des personnes dans les reunions';
	
CREATE TABLE `##DB##`.`##TB3##` 
	( 
		`id_##TB3##` INT NOT NULL AUTO_INCREMENT , 
		`firstname` VARCHAR(255) NULL , 
		`lastname` VARCHAR(255) NOT NULL , 
		`phone` VARCHAR(255) NULL , 
		`email` VARCHAR(255) NOT NULL , 
		`password` VARCHAR(255) NULL ,
		`master` BOOLEAN NOT NULL DEFAULT FALSE ,
		`apikey` CHAR(36) NULL ,
		PRIMARY KEY (`id_##TB3##`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'table des utilisateurs connus dans l\'app';
	
CREATE TABLE `##DB##`.`##TB5##` 
	( 
		`id_##TB5##` INT NOT NULL AUTO_INCREMENT , 
		`##TB5##` VARCHAR(255) NOT NULL , 
		PRIMARY KEY (`id_##TB5##`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'ensemble des outils disponibles pour les reunions';	
	
CREATE TABLE `##DB##`.`##TB2##_##TB5##_tbl` 
	( 
		`id_##TB2##_##TB5##_tbl` INT NOT NULL AUTO_INCREMENT , 
		`id_##TB2##_fk` INT NOT NULL , 
		`id_##TB5##_fk` INT NOT NULL , 
		`quantity` INT NOT NULL DEFAULT '1' , 
		PRIMARY KEY (`id_##TB2##_##TB5##_tbl`), 
		INDEX (`id_##TB2##_fk`), 
		INDEX (`id_##TB5##_fk`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'liaison entre ##TB2## et ##TB5## et la quantite de ##TB5##';	
	
CREATE TABLE `##DB##`.`##TB2##_##TB3##_##TB4##_tbl` 
	( 
		`id_##TB2##_##TB3##_##TB4##_tbl` INT NOT NULL AUTO_INCREMENT , 
		`id_##TB2##_fk` INT NOT NULL , 
		`id_##TB3##_fk` INT NOT NULL , 
		`id_##TB4##_fk` INT NOT NULL , 
		`log` BOOLEAN NOT NULL DEFAULT FALSE , 
		PRIMARY KEY (`id_##TB2##_##TB3##_##TB4##_tbl`), 
		INDEX (`id_##TB2##_fk`), 
		INDEX (`id_##TB3##_fk`), 
		INDEX (`id_##TB4##_fk`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'liaison entre ##TB2## et ##TB3## + ##TB4## check la presence';
	

CREATE TABLE `##DB##`.`##TB1##` 
	(
		`id_##TB1##` INT NOT NULL AUTO_INCREMENT ,
		`content` TEXT NOT NULL,
		`dateIn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`id_##TB3##_fk` INT DEFAULT NULL , 
		PRIMARY KEY (`id_##TB1##`)
	) 
	ENGINE = InnoDB 
	COMMENT='table des logs NFC';		
	
	
	

CREATE TRIGGER `dispatcher` AFTER INSERT ON `##TB1##` FOR EACH ROW 
	IF (
		SELECT COUNT(*) 
		FROM information_schema.TABLES 
		WHERE TABLE_NAME = JSON_UNQUOTE(JSON_EXTRACT(new.content, '$.tb'))
	) = 1 
	THEN 
		IF (
	        JSON_UNQUOTE(JSON_EXTRACT(new.content, '$.action'))
	    ) = 'insert'
	    THEN 	
	    	CASE
	
				WHEN (JSON_UNQUOTE(JSON_EXTRACT(new.content, '$.tb'))) = '##TB2##'
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
				                                    
				    IF(SELECT JSON_SEARCH(@fieldsName, 'one', '##TB6##') IS NOT NULL)
				    THEN
			        	SET @ID = JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.##TB6##'));
			           	IF(
			              	SELECT COUNT(*)
			                FROM `##TB6##`
			                WHERE `id_##TB6##` = @ID
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
			       
	               	INSERT INTO `##TB2##`(`title`, `id_##TB6##_fk`, `begin`, `end`) 
					VALUES(@title, @room, @begin, @end);
					
	        
			    WHEN (JSON_UNQUOTE(JSON_EXTRACT(new.content, '$.tb'))) = '##TB3##'
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
						SET @password = SHA1(JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.password')));
			        END IF;
			            
			        INSERT INTO `##TB3##`(`firstname`, `lastname`, `phone`, `email`, `password`) 
			        VALUES(@firstname, @lastname, @phone, @email, @password);  
	                
	 		    	
			   WHEN (JSON_UNQUOTE(JSON_EXTRACT(new.content, '$.tb'))) = '##TB5##'
			   THEN
					SET @fields = JSON_EXTRACT(new.content,'$.fields');
			        SET @fieldsName = JSON_KEYS(@fields);
			            
			        IF(SELECT JSON_SEARCH(@fieldsName, 'one', '##TB5##') IS NOT NULL)
			        THEN
			          	INSERT INTO `##TB5##`(`##TB5##`) 
			            VALUES(JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.##TB5##')));
			        END IF;
	                    
	                    
			    WHEN (JSON_UNQUOTE(JSON_EXTRACT(new.content, '$.tb'))) = '##TB4##'
			    THEN
					SET @fields = JSON_EXTRACT(new.content,'$.fields');
			        SET @fieldsName = JSON_KEYS(@fields);
			            
			        IF(SELECT JSON_SEARCH(@fieldsName, 'one', '##TB4##') IS NOT NULL)
			        THEN
			          	INSERT INTO `##TB4##`(`##TB4##`) 
			            VALUES(JSON_UNQUOTE(JSON_EXTRACT(@fields, '$.##TB4##')));
			        END IF; 
			                   
	        
			    WHEN (JSON_UNQUOTE(JSON_EXTRACT(new.content, '$.tb'))) = '##TB6##'
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
			            
			        INSERT INTO `##TB6##`(`name`, `open_close`, `prepared`) 
			        VALUES(@name, @open_close, @prepared); 
	                
	                
			END CASE;
	    END IF;
	END IF;
	
CREATE TRIGGER `verifApiKey` BEFORE INSERT ON `##TB1##` FOR EACH ROW 
	IF (
		SELECT @ID := `id_##TB3##`
		FROM `##TB3##`
		WHERE `apikey` = JSON_UNQUOTE(JSON_EXTRACT(new.content, '$.apikey'))
	) IS NOT NULL
	THEN
		SET new.id_##TB3##_fk = @ID;
	ELSE 
		SIGNAL SQLSTATE '45000';
	END IF;

COMMIT;
	
	