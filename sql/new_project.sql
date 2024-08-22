

# First, create the project in the projects table
# This will assign the project an id
INSERT INTO projects
(
	project,
	project_description
) VALUES (
	'2018-2019_sealSurvey',
	'Citizen Science program for Australian fur seals across Victoria'
);


# Add a list of types to the types table
# This won't be necessary if the types are already there.
INSERT INTO types
	( type )
VALUES
	( 'adult_juv' ),
	( 'pup' ),
	( 'pup_dead' ),
	( 'entangled' );


# Create references to that project and those types
INSERT INTO project_types
	( project_id, type_id )
VALUES
( 
    (SELECT project_id FROM projects WHERE project = '2018-2019_sealSurvey'),
    (SELECT type_id FROM types WHERE type = 'adult_juv')
),
( 
    (SELECT project_id FROM projects WHERE project = '2018-2019_sealSurvey'),
    (SELECT type_id FROM types WHERE type = 'pup')
),
( 
    (SELECT project_id FROM projects WHERE project = '2018-2019_sealSurvey'),
    (SELECT type_id FROM types WHERE type = 'pup_dead')
),
( 
    (SELECT project_id FROM projects WHERE project = '2018-2019_sealSurvey'),
    (SELECT type_id FROM types WHERE type = 'entangled')
);


