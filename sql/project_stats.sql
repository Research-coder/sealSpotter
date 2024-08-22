SELECT
	COUNT(DISTINCT(user_id)) users,
	COUNT(DISTINCT(CONCAT(imagefile_id, user_id))) images,
	SUM(CASE WHEN type_id IN (1,2,3,14) THEN 1 ELSE 0 END) seals
	FROM pinprs_sealspotter.label_points
	WHERE timestamp_client >= '2019-06-08 09:00:00';

SELECT SUM(images) FROM ( SELECT users, COUNT(*) images FROM (
	SELECT COUNT(DISTINCT(user_id)) users
		FROM pinprs_sealspotter.label_points
		WHERE timestamp_client >= '2019-06-08 09:00:00'
		GROUP BY imagefile_id
		ORDER BY users DESC
	) AS temp GROUP BY users ) AS temp2;
	

SELECT DISTINCT(user_location)
	FROM pinprs_users.sealspotter_users;

SELECT COUNT(*) FROM pinprs_sealspotter.imagefiles WHERE project_id = 9 AND include_in_portal = 1;

SELECT COUNT(*) images, reps.replicates
	FROM pinprs_sealspotter.imagefiles AS im
	JOIN (
		SELECT imagefile_id, COUNT(DISTINCT(user_id)) replicates
			FROM pinprs_sealspotter.label_points
			WHERE timestamp_client >= '2019-06-08 09:00:00'
			GROUP BY imagefile_id
	) AS reps
		ON im.imagefile_id = reps.imagefile_id
	GROUP BY reps.replicates;
	
SELECT im.imagefile_id,
			imagefile,
			COUNT( DISTINCT( lb.user_id ) ) AS counts
		FROM
			`pinprs_sealspotter`.`imagefiles` AS im
			LEFT JOIN
	    	`pinprs_sealspotter`.`label_points` AS lb
	    ON im.imagefile_id = lb.imagefile_id
	    WHERE include_in_portal = 1
	    GROUP BY im.imagefile_id
	    ORDER BY counts, RAND();
	    
	   
SELECT imagefile_id, imagefile
	FROM `pinprs_sealspotter`.`imagefiles`
	WHERE imagefile_id NOT IN (
		SELECT DISTINCT( imagefile_id )
			FROM pinprs_sealspotter.label_points
			WHERE timestamp_client >= '2019-06-08 09:00:00'
	)
	 AND project_id = 9 AND include_in_portal = 1;