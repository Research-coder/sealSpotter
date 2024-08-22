
<?php

	# convert data from `fetch`
	$content = trim(file_get_contents("php://input"));
    $_POST = json_decode($content, true);

    // $output = $_POST['output'];
    $for_sql = $_POST['for_sql'];

    # output to a csv file first
    # get rid of this step when the SQL database is stable
    // $string = "'" . implode( "'\n'", $output ) . "'";
    // $file = "outputs/" . $_POST['filename'] . ".csv";
    // file_put_contents( $file, $string );

    $project_id = $_POST['project_id'];
    $user_id = $_POST['user_id'];

    ### OUTPUT POST DATA DIRECTLY TO JSON FILE
    # parse server-side timestamps
    $now = date( 'Y-m-d H:i:s' );
    $today = date( 'Ymd' );
    # specify the output file, separating by date
    $file = "../outputs/" . $today . "_project-" . $project_id . ".js";
    # construct a complete line for the output file
    $string = '{"' . $now . '":' . json_encode( $_POST ) . "}\n";
    # print the contructed line to the output file
    file_put_contents( $file, $string, FILE_APPEND );


    # set up the SQL parameters
    ### SETUP: input MySQL details here as per your system setup
    $servername = "localhost";
    $username = "user";
    $password = "password";
    $dbname = "pinprs_sealspotter";


    # connect to the database
    $con = new mysqli( $servername, $username, $password, $dbname );

    # prepare a statement template
    $sql_points_insert = $con->prepare(
        "INSERT INTO label_points
        ( timestamp_client_submit,
          timestamp_client_point_click,
          imagefile_id,
          type_id, point_x, point_y, div_width,
          div_height, image_width, image_height,
          comments, project_id, user_id )
        VALUES
        ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )"
    );

   
    try {

        # don't commit each query, instead create a queue
        $con->autocommit(FALSE);

         # turn each element into a query
        foreach( $for_sql as $x ) {
            $sql_points_insert->bind_param(
                "ssiiiiiiiisii",
                $x['timestamp_client_submit'],
                $x['timestamp_client_point_click'],
                $x['imagefile_id'],
                $x['type_id'],
                $x['point_x'],
                $x['point_y'],
                $x['div_width'],
                $x['div_height'],
                $x['image_width'],
                $x['image_height'],
                $x['comments'],
                $project_id, $user_id
            );
            $sql_points_insert->execute();
        };

        # commit all queries
        $sql_points_insert->close();
        $con->autocommit(TRUE);

        # respond to the client
        echo json_encode( "submit success" );

    } catch(Exception $e) {

        # remove all queries from queue if error
        $con->rollback();

        # on failure, return an error string
        throw $e;
        // echo json_encode( "Error: " . $sql . " : " . $con->error );
    };

    # close the SQL connection
    $con->close();


?>
