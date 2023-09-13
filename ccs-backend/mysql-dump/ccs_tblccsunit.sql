-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ccs
-- ------------------------------------------------------
-- Server version	5.7.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblccsunit`
--

DROP TABLE IF EXISTS `tblccsunit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblccsunit` (
  `unitId` varchar(50) NOT NULL,
  `serial` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `firmwareVersion` double DEFAULT NULL,
  `hardwareVersion` double DEFAULT NULL,
  `wifiVersion` double DEFAULT NULL,
  `cfmSetPoint` int(11) DEFAULT NULL,
  `elevation` int(11) DEFAULT NULL,
  `pAmbient` double DEFAULT NULL,
  `lastUpdateSent` datetime DEFAULT NULL,
  `lastUpdateReceived` datetime DEFAULT NULL,
  `rebootDateTime` datetime DEFAULT NULL,
  `errLog` int(11) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `IpAddress` varchar(200) DEFAULT NULL,
  `dateAdded` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `minimum_cfm_set_pt` int(32) DEFAULT NULL,
  `maximum_cfm_set_pt` int(32) DEFAULT NULL,
  `hepa_run_time` datetime DEFAULT NULL,
  `unit_run_time` datetime DEFAULT NULL,
  `soft_power_off` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`unitId`),
  UNIQUE KEY `description_UNIQUE` (`description`),
  UNIQUE KEY `serial` (`serial`),
  KEY `fkErrorLog_idx` (`errLog`),
  CONSTRAINT `fkErrorLog` FOREIGN KEY (`errLog`) REFERENCES `tblerror` (`errorid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblccsunit`DIALECT=mysql
--

-- LOCK TABLES `tblccsunit` WRITE;
/*!40000 ALTER TABLE `tblccsunit` DISABLE KEYS */;
INSERT INTO `tblccsunit` VALUES ('1','CCS-123456','PU1818',2.025,1.12,1.08,350,5000,10.45,'2022-12-11 18:16:11','2022-12-11 18:16:11','2022-12-11 18:16:11',NULL,'Testing Room Unit',NULL,NULL, 0);
/*!40000 ALTER TABLE `tblccsunit` ENABLE KEYS */;
-- UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-07 18:52:57
