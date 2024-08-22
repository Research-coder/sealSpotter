

# A view to associate types with projects
CREATE VIEW project_types_text AS
    SELECT proj.project_id, project, typ.type_id, type
    	FROM project_types AS pt
        INNER JOIN projects AS proj
        	ON pt.project_id = proj.project_id
        INNER JOIN types AS typ
        	ON pt.type_id = typ.type_id;

# A view to associate images with projects
CREATE VIEW imagefiles_current_text AS
    SELECT proj.project_id, project, ic.imagefile_id, imagefile
    	FROM imagefiles_current AS ic
        INNER JOIN projects AS proj
        	ON ic.project_id = proj.project_id
        INNER JOIN imagefiles AS im
        	ON ic.imagefile_id = im.imagefile_id;
