

-- The main table for output data
CREATE TABLE label_points (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  timestamp_server TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  timestamp_client TIMESTAMP(3),
  imagefile_id MEDIUMINT UNSIGNED DEFAULT NULL,
  user_id MEDIUMINT UNSIGNED DEFAULT NULL,
  type_id TINYINT UNSIGNED DEFAULT NULL,
  point_x SMALLINT UNSIGNED DEFAULT NULL,
  point_y SMALLINT UNSIGNED DEFAULT NULL,
  div_width SMALLINT UNSIGNED DEFAULT NULL,
  div_height SMALLINT UNSIGNED DEFAULT NULL,
  image_width SMALLINT UNSIGNED DEFAULT NULL,
  image_height SMALLINT UNSIGNED DEFAULT NULL,
  comments VARCHAR(255) DEFAULT NULL,
  project_id TINYINT UNSIGNED DEFAULT NULL,

  PRIMARY KEY (`id`),
  FOREIGN KEY (imagefile_id) REFERENCES imagefiles(imagefile_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (type_id) REFERENCES types(type_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



-- A table of images to associate with the points data
CREATE TABLE imagefiles (
  imagefile_id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
  timestamp_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  imagefile VARCHAR(255),
  image_width SMALLINT UNSIGNED,
  image_height SMALLINT UNSIGNED,
  survey_loc VARCHAR(255),
  survey_date DATE,
  project_id TINYINT UNSIGNED,
  include_in_portal BIT,

  PRIMARY KEY (`imagefile_id`),
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



-- A table of images for retrieval in creating a session file list
CREATE TABLE imagefiles_current (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id TINYINT UNSIGNED NOT NULL,
  imagefile_id MEDIUMINT UNSIGNED NOT NULL,

  PRIMARY KEY (`id`),
  FOREIGN KEY (project_id) REFERENCES projects(project_id),
  FOREIGN KEY (imagefile_id) REFERENCES imagefiles(imagefile_id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



-- A table of user ids (no personal information here)
CREATE TABLE users (
  user_id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
  timestamp_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  usershort_hash VARCHAR(255),

  PRIMARY KEY (`user_id`),
  UNIQUE KEY `usershort_hash` (`usershort_hash`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;




-- A table of projects
CREATE TABLE projects (
  project_id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  timestamp_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  project VARCHAR(255),
  project_description VARCHAR(255),

  PRIMARY KEY (`project_id`),
  UNIQUE KEY `project` (`project`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


-- A table of types for classifications
CREATE TABLE types (
  type_id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  type VARCHAR(255),
  type_description VARCHAR(255),

  PRIMARY KEY (`type_id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


-- A table for project setup
CREATE TABLE project_types (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id TINYINT UNSIGNED,
  type_id TINYINT UNSIGNED,

  PRIMARY KEY (`id`),
  FOREIGN KEY (`project_id`) REFERENCES projects(`project_id`),
  FOREIGN KEY (`type_id`) REFERENCES types(`type_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

