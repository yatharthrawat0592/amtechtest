CREATE TRIGGER `tblccsunitdata_BEFORE_INSERT` BEFORE INSERT ON `tblccsunitdata` FOR EACH ROW
SET NEW.updatereceived = IFNULL(NEW.updatereceived, UTC_TIMESTAMP());

CREATE TRIGGER `tblccsunit_BEFORE_INSERT` BEFORE INSERT ON `tblccsunit` FOR EACH ROW
SET NEW.unitId = IFNULL(NEW.unitId, UUID()),
NEW.dateAdded = IFNULL(NEW.dateAdded, UTC_TIMESTAMP());

CREATE TRIGGER `tblccssystem_BEFORE_INSERT` BEFORE INSERT ON `tblccssystem` FOR EACH ROW
SET NEW.systemId = IFNULL(NEW.systemId, UUID()),
NEW.dateCreated = IFNULL(NEW.dateCreated, UTC_TIMESTAMP());

CREATE TRIGGER `ccs`.`ccs_tblCcsusersession_BEFORE_INSERT` BEFORE INSERT ON `ccs_tblCcsusersession` FOR EACH ROW
	SET New.count = (SELECT Count(email) from ccs_tblCcsusersession where email = New.email) + 1;

CREATE TRIGGER `ccs`.`tblccsunit_BEFORE_INSERT` BEFORE INSERT ON `tblccsunit` FOR EACH ROW
SET new.unitId = uuid();

CREATE TRIGGER `ccs`.`tblccssystem_BEFORE_INSERT` BEFORE INSERT ON `tblccssystem` FOR EACH ROW
SET new.systemId = uuid();