USE WOW_TEAMS;

DROP TABLE IF EXISTS WT_Account;
DROP TABLE IF EXISTS WT_Character;
DROP TABLE IF EXISTS WT_Guild;
DROP TABLE IF EXISTS WT_raidTeam;
DROP TABLE IF EXISTS WT_mythicTeam;

CREATE TABLE WT_Account
(
	email VARCHAR(30) PRIMARY KEY,
    pass VARCHAR(30) NOT NULL,
    account_id VARCHAR (5) NOT NULL
);

CREATE TABLE WT_Guild
(
	guild_id VARCHAR(5) PRIMARY KEY,
    guild_name VARCHAR (24) NOT NULL,
    num_members VARCHAR(10) NOT NULL
);

CREATE TABLE WT_Character
(
	character_id VARCHAR (10) NOT NULL,
    guild_id VARCHAR(5) NOT NULL,
    raidTeam_id VARCHAR (6),
	mythicTeam_id VARCHAR (7),
	imagePath VARCHAR(100),
	charLevel TINYINT UNSIGNED,
	gearScore INT UNSIGNED,
    `name` VARCHAR(20),
    `class` VARCHAR(15)
        CHECK (`class` in ('Warrior', 'Paladin', 'Hunter', 'Rogue', 'Priest', 'Shaman', 'Mage', 'Warlock', 'Monk', 'Druid', 'Demon Hunter', 'Death Knight', 'Evoker')),
	`race` VARCHAR(15)
        CHECK (`race` in ('Human', 'Dwarf', 'Night Elf', 'Gnome', 'Draenei', 'Worgen', 'Orc', 'Undead', 'Tauren', 'Troll', 'Blood Elf', 'Goblin', 'Pandaren', 'Dracthyr' )),
	`faction` VARCHAR(10)
		CHECK (`faction` in ('Alliance', 'Horde')),
	
    
    PRIMARY KEY (character_id, guild_id),
	
	FOREIGN KEY (guild_id) REFERENCES WT_Guild (guild_id)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);
	
CREATE TABLE WT_raidTeam
(
	raidTeam_id VARCHAR (6) Primary Key,
    teamName VARCHAR (25) NOT NULL,
    numPlayers INT UNSIGNED,
	numBench VARCHAR(30),
	numTrials VARCHAR(30),
    CONSTRAINT WT_raidTeam UNIQUE (raidTeam_id, teamName)

);

CREATE TABLE WT_mythicTeam
(
	mythicTeam_id VARCHAR (7) Primary Key,
    teamName VARCHAR (25) NOT NULL,
	num_players INT UNSIGNED,
	bench VARCHAR(30),
	trials VARCHAR(30),
	CONSTRAINT WT_mythicTeam UNIQUE (mythicTeam_id, teamName)
);

INSERT INTO WT_Account
VALUES
('cruz.conboy@gmail.com', 'password', '00000');

INSERT INTO WT_Guild
VALUES
('00001', 'Guild Name', '1');

INSERT INTO WT_Character
VALUES
('0000000001', '00001', '000001', '0000001', 'Image-URL-path-here', '80', '6000', 'Cruz', 'Warrior', 'Orc', 'Horde');

INSERT INTO WT_raidTeam
VALUES
('000001', 'SaladBakers-R1', '25', '5', '2');

INSERT INTO WT_mythicTeam
VALUES
('0000001', 'SaladBakers-M1', '5', '0', '0');