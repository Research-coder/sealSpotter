<?php

    $project = $_POST["project"];

    ### SETUP: input MySQL details here as per your system setup
    $servername = "localhost";
    $username = "user";
    $password = "password";


    # first work in the data table
    $dbname = "pinprs_inputs";

    # connect to the database
    $con = new mysqli( $servername, $username, $password, $dbname );

    # create the query string
    $sql_progress = "SELECT
                reps, COUNT( reps ) AS images
                FROM (
                    SELECT
                        COUNT( DISTINCT usershort ) AS reps
                        FROM sealspotter
                        WHERE project = '$project'
                        GROUP BY imagefile ) AS temp
                GROUP BY reps";
    # echo $sql_progress;

    # send the query
    $result_progress = $con->query( $sql_progress );


    # also construct a more complex query for calculating results
    # first, count each type counted in each image
    # grouping by the date and location of the survey,
    # as well as users
    $sql_calcs_byuserandimage = "SELECT imagefile,
                                        usershort,
                                        survey_date,
                                        survey_loc,
                                        type,
                                        COUNT( id ) AS count
                                FROM pinprs_inputs.sealspotter
                                WHERE project = '$project'
                                GROUP BY imagefile,
                                         usershort,
                                         type,
                                         survey_date,
                                         survey_loc";

    # take the above, and average the counts per image
    # across all users
    $sql_calcs_byimage =    "SELECT imagefile,
                                    survey_date,
                                    survey_loc,
                                    type,
                                    AVG( count )
                                AS count
                            FROM ( $sql_calcs_byuserandimage )
                                AS byuserandimage
                            GROUP BY    imagefile,
                                        type,
                                        survey_date,
                                        survey_loc";

    # now take that result and add up the averaged counts
    # these are the results per site, per survey date
    $sql_calcs = "SELECT survey_loc,
                         survey_date, type,
                         SUM( count ) AS calculated_count
                    FROM ( $sql_calcs_byimage  )
                        AS byimage
                    WHERE type NOT IN ( 'comment', 'zerocount' )
                    GROUP BY survey_loc, survey_date, type";

    $result_calcs = $con->query( $sql_calcs );

    # close the SQL connection
    $con->close();

    # convert the result_progress into an array
    $progress = array();
    if ($result_progress->num_rows > 0) {
        $progress["replicates"] = array();
        $progress["images"] = array();
        while($row = $result_progress->fetch_assoc()) {
            $progress["replicates"][] = $row["reps"];
            $progress["images"][] = $row["images"];
        }
    };

    # do the same for the calculated results
    $calcs = array();
    if ($result_calcs->num_rows > 0) {
        $calcs["survey_loc"] = array();
        $calcs["survey_date"] = array();
        $calcs["type"] = array();
        $calcs["calculated_count"] = array();
        while($row = $result_calcs->fetch_assoc()) {
            $calcs["survey_loc"][] = $row["survey_loc"];
            $calcs["survey_date"][] = $row["survey_date"];
            $calcs["type"][] = $row["type"];
            $calcs["calculated_count"][] = $row["calculated_count"];
        }
    };

    # and return the results to the user
    $output = array();
    $output["progress"] = $progress;
    $output["calcs"] = $calcs;
    echo json_encode( $output );

?>