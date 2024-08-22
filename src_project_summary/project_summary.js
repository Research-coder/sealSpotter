

function create_summary_table( summary_stats ) {

    const total_images = filelist.length;
    console.log( total_images );

    var summary_page = document.getElementById("summarytable");

    // empty the summary_page if there's already one there
    summary_page.innerHTML = "";

    var heading = document.createElement("h1");
    var heading_text = document.createTextNode(
            "Project: " + setup.project
        );
    heading.appendChild( heading_text );
    summary_page.appendChild( heading );

    // before making a table, deal with the case where
    // no data was found
    if( summary_stats.progress.length == 0 ) {
        var no_data = document
            .createTextNode( "No data found..." );
        summary_page.appendChild( no_data );
        return;
    }

    // Add a title for the first summary_page
    summary_page.appendChild( document.createElement("br") );
    summary_page.appendChild( document.createElement("br") );
    var heading = document.createElement("h2");
    var heading_text = document.createTextNode(
            "Classification progress"
        );
    heading.appendChild( heading_text );
    summary_page.appendChild( heading );


    // build the first table
    var tbody = document.createElement("tbody");
    var columns = [ "replicates", "images" ];

    // add the header row, treating date specially
    var row = document.createElement("tr");
    var cell = document.createElement("th");

    for( let j = 0; j < columns.length; j++ ) {
        var cell = document.createElement("th");
        cell.textContent = columns[j];
        row.appendChild(cell);
    }
    tbody.appendChild( row );

    // find the number of images not yet counted
    const counted = summary_stats.progress['images']
            .reduce( function(acc,curr) {
                return( parseInt(acc) + parseInt(curr) )
            } );
    // only display positive numbers here
    const not_counted = total_images - counted < 0 ?
                        0 :
                        total_images - counted;

    // and add it as the first row
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.textContent = "0";
    row.appendChild(cell);
    var cell = document.createElement("td");
    cell.textContent = not_counted;
    row.appendChild(cell);
    tbody.appendChild( row );


    // add the data rows one by one
    for( let i = 0; i < summary_stats.progress[columns[0]].length; i++ ) {
        var row = document.createElement("tr");
        for( let j = 0; j < columns.length; j++ ) {
            var cell = document.createElement("td");
            cell.textContent = summary_stats.progress[columns[j]][i];
            row.appendChild(cell);
        }
        tbody.appendChild( row );
    }

    summary_page.appendChild(tbody);


    // do the same for the calculated data across all surveys

    // start with a heading
    summary_page.appendChild( document.createElement("br") );
    summary_page.appendChild( document.createElement("br") );
    var heading = document.createElement("h2");
    var heading_text = document.createTextNode(
            "Running results (so far)..."
        );
    heading.appendChild( heading_text );
    summary_page.appendChild( heading );

    // build the second table
    var tbody = document.createElement("tbody");
    var columns = [ "survey_loc",
                    "survey_date",
                    "type",
                    "calculated_count" ];

    // add the header row, treating date specially
    var row = document.createElement("tr");
    var cell = document.createElement("th");

    for( let j = 0; j < columns.length; j++ ) {
        var cell = document.createElement("th");
        cell.textContent = columns[j];
        row.appendChild(cell);
    }
    tbody.appendChild( row );

    // add the data rows one by one
    for( let i = 0;
         i < summary_stats.calcs[columns[0]].length;
         i++ ) {
        var row = document.createElement("tr");
        for( let j = 0; j < columns.length; j++ ) {
            var cell = document.createElement("td");
            cell.textContent = summary_stats.calcs[columns[j]][i];
            row.appendChild(cell);
        }
        tbody.appendChild( row );
    }

    summary_page.appendChild(tbody);


    // finally, add a little disclaimer that these results
    // are based on simplified calculations
    const data_disc = [
        "Note: the results shown here are based on",
        "simplified calculations. For your final analysis,",
        "make sure you analyse the raw data properly."
    ];
    // start with a heading
    summary_page.appendChild( document.createElement("br") );
    summary_page.appendChild( document.createElement("br") );
    var pleasenote = document.createElement("h3");
    var pleasenote_text = document.createTextNode(
            data_disc.join( " " )
        );
    pleasenote.appendChild( pleasenote_text );
    summary_page.appendChild( pleasenote );


};

$.ajax({
    type: "POST",
    url: "src_project_summary/get_summary.php",
    data: {
              project: setup.project
          },
    dataType: "json",
    
    success: function( result ) {

        // console.log( result );
        
        create_summary_table( result );

    },

    error: function( error ) {
        console.log( "retrieval failed" );
        console.log( error );
        document.getElementById("summarytable").innerHTML = 
            "Error retrieving data.";
    }

});

