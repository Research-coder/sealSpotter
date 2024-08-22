<?php

	# convert data from `fetch`
	$content = trim(file_get_contents("php://input"));
    $_POST = json_decode($content, true);

    # take the input
    $project_id = $_POST['project_id'];
    $user = $_POST['user'];
    $usershort = $_POST['usershort'];
    $usershort_hash = $_POST['usershort_hash'];
    $email = $_POST['email'];
    $agegroup = $_POST['agegroup'];
    $monexperience = $_POST['experience'];
    $location = $_POST['location'];

    # with local hosting (no TLS) we need to do the conversion
    # of the username here instead of client side
    if( $usershort_hash == '' ) {
        $usershort_hash = hash('sha256', $usershort);
    }

    ### SETUP: input MySQL details here as per your system setup
    $servername = "localhost";
    $username = "user";
    $password = "password";

    # preset the user counts to 0 in case they're not available
    $user_pointcount = 0;
    $user_imagecount = 0;


    # first work in the data table
    $dbname = "pinprs_sealspotter";

    # connect to the database
    $con = new mysqli( $servername, $username, $password, $dbname );

    # get a user id if there already is one
    $sql_check_user = $con->prepare(
        "SELECT user_id
        FROM users
        WHERE usershort_hash = ?
        LIMIT 1" );
    $sql_check_user->bind_param("s", $usershort_hash);
    $sql_check_user->execute();
    $result = $sql_check_user->get_result();
    if( $result->num_rows > 0 ) {
        $row = $result->fetch_row();
        $user_id = $row[0];
    } else {
    	$user_id = 0;
    }

    # in case there wasn't a user_id in there, make a new one
    if( $user_id == 0 ) {
    	$sql_insert_user = $con->prepare(
            "INSERT INTO users ( usershort_hash ) VALUES ( ? )"
        );
        $sql_insert_user->bind_param("s", $usershort_hash);
    	$sql_insert_user->execute();

        # now try getting the user id again
        $sql_check_user->execute();
    	$result = $sql_check_user->get_result();
	    if( $result->num_rows > 0 ) {
	        $row = $result->fetch_row();
	        $user_id = $row[0];
	    } else {
	    	$user_id = 0;
	    }
    } else {

    	# if the user is already there, retrieve counts
    	$sql_counts = $con->prepare(
            "SELECT
                ifnull(SUM(type_id NOT IN (15,16)), 0) points,
                COUNT( DISTINCT( imagefile_id ) ) images
            FROM label_points
            WHERE user_id = ? AND
                project_id = ?" );
        $sql_counts->bind_param("ii", $user_id, $project_id);
        $sql_counts->execute();
        $countresult = $sql_counts->get_result();
        if( $countresult->num_rows > 0 ) {
	        $row = $countresult->fetch_assoc();
            $user_pointcount = $row["points"];
            $user_imagecount = $row["images"];
	    }
    }


    /*
     Get a list of images for this user.
     We take the images for this project,
     then remove those images already done by this user
     then sort the result to put the images with the fewest
     	replicates at the top
     within each replicate group, images are randomly shuffled
     */
    $user_specific =
    $user_id == 3306 ? "im.mosaic_id in (49,50,51)" : // Jessalyn
    "s.include_in_portal is true and m.include_in_portal is true";

    $sql_imlist = $con->prepare(
        "select im.imagefile_id, imagefile
        from imagefiles im
        left join (
                select imagefile_id, count(distinct user_id) reps
                from label_points
                group by imagefile_id
            ) reps
            on im.imagefile_id = reps.imagefile_id
        inner join mosaics m
            on im.mosaic_id = m.mosaic_id
        inner join surveys s
            on m.survey_id = s.survey_id
        where ( (
                im.include_in_portal is true
                and $user_specific
                )
                or im.training_image is true
                or im.incentive_image is true
            )
            and im.imagefile_id not in (
                select distinct( imagefile_id )
                from label_points
                where user_id = ?
            )
        group by im.imagefile_id
        order by im.training_image desc, reps.reps, rand()" );
    $sql_imlist->bind_param("i", $user_id);
    $sql_imlist->execute();
    $result = $sql_imlist->get_result();


    # close the SQL connection
    $con->close();

    # convert the filelist results into an array
    if ($result->num_rows > 0) {
        $filelist = array();
        while($row = $result->fetch_assoc()) {
            $filelist[count($filelist)] =
            	array($row["imagefile_id"], $row["imagefile"]);
        }
    } else {
        $filelist = array();
    }


    # combine the results into a multi-dimensional array
    $output = array();
    $output[0] = $filelist;
    $output[1] = $user_pointcount;
    $output[2] = $user_imagecount;
    $output[3] = $user_id;

    # and return the array to the user
    echo json_encode( $output );

    # also run another query in the user database to enter user data

    # note the webuser only has INSERT access here, so we can't
    # do any SELECT queries. Just INSERT no matter what, and we'll
    # deal with duplicate records later
    $dbname = "pinprs_users";
    $con = new mysqli( $servername, $username, $password, $dbname );
    $sql_insert = $con->prepare(
        "INSERT INTO sealspotter_users ( user, usershort, usershort_hash, email, agegroup, monexperience, user_location )
        VALUES ( ?, ?, ?, ?, ?, ?, ? )"
    );
    $sql_insert->bind_param("sssssss", $user, $usershort, $usershort_hash, $email, $agegroup, $monexperience, $location);
    $sql_insert->execute();
    $con->close();



?>
