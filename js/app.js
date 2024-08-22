
// already created in `load_first.js`
// const el_id = id => document.getElementById(id);


// initialise global variables
let points = {
    X: [],
    Y: [],
    colour: [],
    symbol: [],
    size: [],
    type_id: [],
    time: [],
    divWidth: [],
    divHeight: []
}


var index;

let imagefile = { id: 0, filename: "" };

var imgWidth;
var imgHeight;

var userdata = {
        'user': "",
        'email': "",
        'usershort': "",
        'usershort_hash': "",
        'agegroup': "",
        'mon_experience': "",
        'usercount': 0,
        'session_count': 0,
        'imagecount': 0
};

let filelist = [];


var donefiles = [];

cacheOutput = [];
cacheFilename = [];


// set a start point for the div size
var divHeightNow = 700;
var divWidthNow = 900;
var maxDivWidth = 2000;
var maxDivHeight = 2000;



var zoomDivHeight = 240;
var zoomDivWidth = 240;

var zoomdiv = el_id("zoomdiv");
zoomdiv.style.width = zoomDivWidth + "px";
zoomdiv.style.height = zoomDivHeight + "px";

// set the zoom rate for the zoomed in image
var zoomRate = 4;

// functions for hashing usernames
function sha256(str) {
  // We transform the string into an arraybuffer.
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle
    .digest("SHA-256", buffer)
    .then( hash => hex(hash) );
}

function hex(buffer) {
  let result = "";
  let view = new DataView(buffer);
  const padding = '00000000';
  const padding_length = padding.length;
  for( let i = 0; i < view.byteLength; i += 4 ) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    // toString(16) will give the hex representation of the number without padding
    const stringValue = view.getUint32(i).toString(16)
    // We use concatenation and slice for padding
    const paddedValue = (padding + stringValue).slice(-padding_length)
    result += paddedValue;
  }

  return result;
}

function react_to_windowSize() {

    var total_buffer = 8;
    
    var divAspectRatio = divWidthNow / divHeightNow;

    
    // find the user's browser size
    var windowHeight =  isNaN( window.innerHeight ) ?
                        window.clientHeight :
                        window.innerHeight;

    var mainpageWidth = el_id("mainpage").offsetWidth;

    // set a starting main div size
    var NewDivHeight =  windowHeight > maxDivHeight - total_buffer ?
                        maxDivHeight - total_buffer :
                        windowHeight - total_buffer;
    var NewDivWidth = NewDivHeight * divAspectRatio;

    var sidepanelWidth = el_id("sidepanel").offsetWidth;

    // double check that the width still fits, and adjust if necessary
    var total_area_width = NewDivWidth + zoomDivWidth + total_buffer;
    if( total_area_width > mainpageWidth ) {
        NewDivWidth = mainpageWidth - zoomDivWidth - total_buffer;
        NewDivHeight = NewDivWidth / divAspectRatio;
    };

    // set the new div size
    divWidthNow = NewDivWidth;
    divHeightNow = NewDivHeight;
    var divs_to_adjust = [ "base", "plot_div", "click_div" ];
    for( div in divs_to_adjust ) {
        var domdiv = el_id( divs_to_adjust[div] );
        domdiv.style.width = divWidthNow + "px";
        domdiv.style.height = divHeightNow + "px";
    }


    // move the example images over as necessary
    /*var ex_div = el_id( "example_images" );
    ex_div.style.left = ( divWidthNow + 120 ) + "px";
    ex_div.style.height = divHeightNow + "px";*/

    // replot the data points onto the new axes
    // this will only work if Plotly has been loaded
    try {
    	plot_points();
    } catch(err) {
    	console.log( "Plotly isn't ready to plot yet." );
    };

    // update the background size in the zoomed image to make sure it matches
    // the new image size
    zoomdiv.style.backgroundSize =
            divWidthNow*zoomRate + "px " + divHeightNow*zoomRate + "px";

    // move the zoom div to match
    zoomdiv.style.bottom = 
            ( windowHeight - divHeightNow + total_buffer ) + "px";

};

function plot_points() {
    PLOT = el_id( 'plot_div' );
    var data = [ {
            x: points.X,
            y: points.Y,
            type: 'scatter',
            mode: 'markers',
            marker: {
                color: points.colour,
                symbol: points.symbol,
                size: points.size,
                line: { color: points.colour }
        } } ];

    var layout = {
        showlegend: false,
        xaxis: {
            range: [0,imgWidth],
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false
        },
        yaxis: {
            range: [0,imgHeight],
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
    };
    Plotly.newPlot( PLOT, data, layout, {displayModeBar: false} );
}

// script for zoom on hover
function hoverzoom( event ) {
    var element = el_id("zoomdiv");
    element.style.display = "inline-block";
    var img = el_id("click_div");
    var posX = event.offsetX ?
        (event.offsetX) :
        event.pageX - img.offsetLeft;
    var posY = event.offsetY ?
        (event.offsetY) :
        event.pageY - img.offsetTop;
    element.style.backgroundPosition =
        (-posX*zoomRate+zoomDivWidth/2)+"px "
        +(-posY*zoomRate+zoomDivHeight/2)+"px";
}
el_id("click_div").addEventListener(
        "mousemove", function(event) { hoverzoom(event) } );

// script for removing zoomed image on mouseout
function emptyzoom() {
    el_id("zoomdiv").style.display = "none";
}
el_id("click_div").addEventListener(
        "mouseout", emptyzoom.bind( this ) );


// function to react to a click on the image
function on_click(e) {

	const rowNum = points.X.length;

    // get those points as actual image pixel references as well
    const actualX = e.layerX * imgWidth / divWidthNow;
    const actualY = e.layerY * imgHeight / divHeightNow;

    let type = Array.from(
            document.getElementsByName("type") )
            .filter( x => x.checked == true );
    type.length == 0 ? type = undefined : type = type[0].value;

    // for inverting the y axis
    const height = el_id("click_div").scrollHeight;

    if (!type) {
        alert( "Please select a type before clicking." );
        return;
    };

    points.Y[ rowNum ] = Math.round( imgHeight - actualY );
    points.X[ rowNum ] = Math.round( actualX );
    points.type_id[ rowNum ] = type;

    // find what colour this point should be
    index = setup.type_ids.indexOf( type );
    points.colour[ rowNum ] = setup.point_colours[ index ];
    points.symbol[ rowNum ] = setup.point_shapes[ index ];
    points.size[ rowNum ] = setup.point_sizes[ index ];

    console.log(    "added point: "
                    + type + ":"
                    + points.X[ rowNum ] + ","
                    + points.Y[ rowNum ] )

    // current dimensions of the image div
    points.divWidth[ rowNum ] = Math.round( divWidthNow );
    points.divHeight[ rowNum ] = Math.round( divHeightNow );

    // timestamp
    const currentdate = new Date();
    points.time[ rowNum ]   =  ""
            + currentdate.getFullYear()
            + "-"
            + ('0' + (currentdate.getMonth()+1)).slice(-2)
            + "-"
            + ('0' + currentdate.getDate()).slice(-2)
            + " "
            + ('0' + currentdate.getHours()).slice(-2)
            + ":"
            + ('0' + currentdate.getMinutes()).slice(-2)
            + ":"
            + ('0' + currentdate.getSeconds()).slice(-2)
            + "."
            + ('000'+currentdate.getMilliseconds()).slice(-3);

    // replot the points
    plot_points();

    // increase the session count by one and print for user
    userdata.session_count++;
    userdata.usercount++;
    const count_txt = el_id("sess_counter");
    // count_txt.innerHTML = "Counted: " + userdata.session_count;
    count_txt.innerHTML = "Counted: " + userdata.usercount;
}
el_id("click_div").addEventListener(
	"click", e => on_click(e) );

// how to go about resizing the main image.
// In case we want to add a button for this
function img_resize( amount ) {
    // get properties of image and div
    var image = el_id( "base" );

    // adjust present width value
    var newheight = image.style.height;
    newheight = newheight.replace( "px", "" );
    newheight = Number( newheight ) + amount;
    newheight = newheight + "px";


    // apply the new width to both properties
    image.style.height = newheight;
    image.style.width = "auto";

    // also move the buttons
    el_id( "button_smaller" )
        .style.top = newheight;
    el_id( "button_submit" )
        .style.top = newheight;
    el_id( "button_rmvlst" )
        .style.top = newheight;
    el_id( "button_bigger" )
        .style.top = newheight;
};

// submit user data inputs to complete sign in
async function sign_in( form ) {
    
    var inputs = el_id( "signin" ).elements;

    var elements = [ "user",
                     "email",
                     "agegroup",
                     "experience",
                     "location" ];
    for( var i = 0; i < elements.length; i++ ) {
        userdata[elements[i]] = inputs[elements[i]].value
    };

    // also add the project title
    userdata["project_id"] = setup.project_id;
    

    var userinputel = el_id("userinput");

    // only proceed if the user field is filled
    if( userdata.user == "" ) {
        
        // alert the user if they still need to put their name in
        userinputel.style.borderColor = "red";
        userinputel.placeholder = "Please enter your name.";

    } else {

        userinputel.style.borderColor = "inherit";
        userinputel.placeholder = "Your full name";

        // modify the username to use in filenames
        userdata.usershort = userdata.user
            .replace( /[ _\.,-]/g, '' )
            .toLowerCase();

        // create a hashed version of the username for anonymisation
        // for local hosting, this won't work, so we need to do the
        // hash conversion in php on the server
        if( crypto.subtle ) {
            await sha256( userdata.usershort )
                .then( x => userdata.usershort_hash = x );
        } else {
            userdata.usershort_hash = '';
        }


        // send some debugging stuff to the console
        /*
        console.log( "username: " + userdata.user );
        console.log( "short username: " + userdata.usershort );
        console.log( "hashed username: " + userdata.usershort_hash );
        console.log( "agegroup: " + userdata.agegroup );
        console.log( "monitoring experience: " + userdata.mon_experience );
        console.log( "location: " + userdata.userlocation );
        */

        // make an ajax call to get a list of files
        // and a running count submitted by this user
        fetch( 'php/signin.php', {
            method: 'POST',
            body: JSON.stringify( userdata ),
            headers: {
                'Content-Type': 'application/json'
            } } )
	        .then( res => res.json() )
	        .then( result => {
	            filelist = result[0];

                // update the user id
                userdata.user_id = parseInt( result[3] );
				userdata.imagecount = parseInt( result[2] );
                userdata.usercount = parseInt( result[1] );
                el_id("sess_counter")
                    .innerHTML = "Seals counted: " + userdata.usercount;
                el_id("img_counter")
                    .innerHTML = "Images done: " + userdata.imagecount;

                // now render an image from the available list of images
                render_newimage();
	        } )
	        .catch( error => console.error('Error:', error) );
        

        // collapse the form
        el_id( "signinform" ).style.display = "none";

        // reveal other page elements
        el_id( "base" ).style.display = "inherit";
        el_id( "tools" ).style.display = "inherit";
        el_id( "example_images" ).style.display = "inherit";

        // scroll to top, and disable window overflow
	    window.scroll(0,0);
	    document.body.style.overflow = "hidden";

	    document.body.setAttribute( "onKeyDown", "javascript:keydown(event);" );

    };
    

};
el_id("signinbutton").addEventListener(
    "click", sign_in.bind( this ) );

// skip straight past the signin page if appropriate
if( setup.skip_signin_page ) {
    // collapse the form
    el_id( "signinform" ).style.display = "none";

    // reveal other page elements
    el_id( "base" ).style.display = "inherit";
    el_id( "tools" ).style.display = "inherit";
    el_id( "example_images" ).style.display = "inherit";

    render_newimage();
    document.body.setAttribute( "onKeyDown", "javascript:keydown(event);" );
}


// reveal the registration form if the checkbox is ticked
function registrationcheckbox() {
    var regdiv = el_id( "registerdiv" );
    var regbutt = el_id("registerbutton");
    regdiv.style.display = regbutt.checked ? "inherit" : "none";
};
el_id("registerbutton").addEventListener(
        "change", registrationcheckbox );


// when an example image is clicked, change the selected radio
// option to that type
function exampleClick( type ) {
    var el = document.getElementsByName("type");
    for( var i = 0; i < el.length; i++ ) {
        if( el[i].value == type ) {
            el[i].checked = true;
        } else {
            el[i].checked = false;
        }
    }
};

// ad event listeners to each of the type examples
for( let i = 0; i < setup.type_ids.length; i++ ) {
    const typeref = "example_typeid" + setup.type_ids[i];
    const example_image_el = el_id( typeref )

    if( example_image_el ) {
        example_image_el.addEventListener( "click",
                exampleClick.bind( this, setup.type_ids[i] )
            );
    }
};


// retrieve a new image to start anew
function render_newimage() {

    // scroll to top, and disable window overflow
    window.scroll(0,0);
    document.body.style.overflow = "hidden";

    // See if we're all done
    if( filelist.length == 0 ) {
        
        // hide all non-relevant items
        var tohide = [  "tools",
                        "example_images",
                        "commentsdiv",
                        "base" //,
                        //"imtext"
                    ];

        for( var i = 0; i < tohide.length; i++ ) {
            el_id(tohide[i]).style.display = "none";
        }

        // reveal the finished div
        el_id("finisheddiv").style.display = "inherit";

    } else {

        // return to the image div
        backToImage();

        // make the first image in the list next
        let next_img_idx = 0;

        // sample from the new (culled) list
        imagefile.id = filelist[next_img_idx][0];
        imagefile.filename = filelist[next_img_idx][1];
        console.log( "new image: " + imagefile.filename );
        imgPath = 'images/' + imagefile.filename;

        // then render the new image
        el_id( "base" )
            .style.backgroundImage = "url('" + imgPath + "')";

        // retrieve pixel dimensions from this new image
        var newimage = new Image();
        newimage.src = imgPath;
        newimage.onload = function() {
            imgWidth = this.naturalWidth;
            imgHeight = this.naturalHeight;
            console.log( "image dims: "
                        + "x " + imgWidth
                        + ", y " + imgHeight );

            // modify the example images to be at the same scale as the main image
            // this is to automatically ensure the examples match the image
            const exImages = document.getElementsByClassName("exampleImg");
            if( exImages.length > 0 ) {
                var exImgWidth = exImages[1]
                                    .naturalWidth;
                var exSize = exImgWidth * divWidthNow / imgWidth;
                el_id("example_images")
                    .style.width = '"' + exSize + 'px"';
            }
        }

        // change the text displayed
        // el_id( "imtext" ).innerHTML = imagefile;

        // reset the data input arrays
        points = {
		    X: [],
		    Y: [],
		    colour: [],
            symbol: [],
            size: [],
		    type_id: [],
		    time: [],
		    divWidth: [],
		    divHeight: []
		}


        // reset the radio buttons to be unchecked
        const radiobuttons = document.getElementsByName("type");
        for( i = 0; i < radiobuttons.length; i++ ) {
            radiobuttons[i].checked = false;
        };

        zoomdiv.style.backgroundImage = "url('" + imgPath + "')";

        // initialise the new (empty) plot
        plot_points();

        // make sure the divs are the right size for the screen
        react_to_windowSize();

        // reset the image brightness to 100%
        brightness_reset();

        // default the type selection if appropriate
        if( setup.default_to_first_type ) radiobuttons[0].checked = true;
    };

};

// when the `submit with comment` button is clicked
function proceedToComm() {
    // make sure the sign in form is still hidden
    el_id(
        "signinform" ).style.display = "none";

    // hide classifying page elements
    el_id(
        "base" ).style.display = "none";
    el_id(
        "tools" ).style.display = "none";
    el_id(
        "example_images" ).style.display = "none";
    // el_id(
    //     "imtext" ).style.display = "none";

    // reveal the comments div
    el_id(
        "commentsdiv" ).style.display = "inherit";

    // focus the comments box
    el_id("comment").focus();
    
}
el_id("button_proceed").addEventListener(
        "click", proceedToComm.bind( this ) );

// go to the main image classification portal
function backToImage() {
    el_id( "signinform" ).style.display = "none";

    // reveal other page elements
    el_id( "base" ).style.display = "inherit";
    el_id( "tools" ).style.display = "inherit";
    el_id( "example_images" ).style.display = "inherit";
    
    // hide the comments div
    el_id( "commentsdiv" ).style.display = "none";
};
el_id("backtoimage").addEventListener(
        "click", backToImage.bind( this )
    );

// submit classifications for an image to the server
function submitData() {
    console.log( "submit button pressed" ); // for testing

    // get comments from the user
    // be careful of apostrophes or quotes
    // which might cause an error
    const comment = el_id( "comment" )
        .value
        .replace( /[\'\"]/g, '' );

    // cancel the submit if they click "Cancel"
    if( comment == null ) {
        console.log( "Submit cancelled" );
    } else {

        // define a string to be written to file
        // start with the image name, in case there are no rows
        const for_sql = [];

        // append a timestamp to the header
        const currentdate = new Date();
        const timestampNowLong = ""
            + currentdate.getFullYear() + "-"
            + ('0' + (currentdate.getMonth()+1)).slice(-2) + "-"
            + ('0' + currentdate.getDate()).slice(-2) + " "
            + ('0' + currentdate.getHours()).slice(-2) + ":"
            + ('0' + currentdate.getMinutes()).slice(-2) + ":"
            + ('0' + currentdate.getSeconds()).slice(-2) + "."
            + ('000'+currentdate.getMilliseconds()).slice(-3);



        // append the data points row by row
        if( points.X.length == 0 ) {

            // put a zerocount line in if no points were marked
            for_sql[ for_sql.length ] = {
                timestamp_client_submit: timestampNowLong,
                timestamp_client_point_click: timestampNowLong,
                imagefile_id: imagefile.id,
                type_id: 16,
				point_x: 0,
				point_y: 0,
				div_width: divWidthNow,
                div_height: divHeightNow,
				image_width: imgWidth,
				image_height: imgHeight,
                comments: ''
            };

        } else {          

            // add each point one at a time
            for( i = 0; i < points.X.length; i++ ) {

                for_sql[ for_sql.length ] = {
                    timestamp_client_submit: timestampNowLong,
                    timestamp_client_point_click: points.time[i],
                    imagefile_id: imagefile.id,
                    type_id: points.type_id[i],
                    point_x: points.X[i],
                    point_y: points.Y[i],
                    div_width: points.divWidth[i],
                    div_height: points.divHeight[i],
                    image_width: imgWidth,
                    image_height: imgHeight,
                    comments: ''
                };

            }

        }

        // append a comments row if needed
        if( comment != "" ) {

            for_sql[ for_sql.length ] = {
                timestamp_client_submit: timestampNowLong,
                timestamp_client_point_click: timestampNowLong,
                imagefile_id: imagefile.id,
                type_id: 15,
                point_x: 0,
                point_y: 0,
                div_width: divWidthNow,
                div_height: divHeightNow,
                image_width: imgWidth,
                image_height: imgHeight,
                comments: comment
            };
        }

        // call the php submit script to write the data to the server

        fetch( 'php/submit.php', {
            method: 'POST',
            body: JSON.stringify( {
				user_id: userdata.user_id,
                project_id: setup.project_id,
                for_sql: for_sql
          	} ),
            headers: {
                'Content-Type': 'application/json'
            } } )
	        .then( res => res.json() )
	        .then( confirm => {
	            if( confirm == "submit success" ) {
	                console.log( confirm );
				} else {
					console.log( confirm );
					console.log( "caching submission data" );
					cacheOutput[ cacheOutput.length ] = output;
					cacheFilename[ cacheFilename.length ] = filename;
				}
	        } )
	        .catch( error => console.error('Error:', error) );
        

        
        // clear the comment box
        el_id("comment").value = ""
        
        // first remove the image we just analysed from the list
        const index = filelist
            .findIndex(x => x[1] == imagefile.filename);
        if( index > -1 ) filelist.splice( index, 1 );

        // update the user's image count
        userdata.imagecount += 1;
        el_id("img_counter")
            .innerHTML = "Images done: " + userdata.imagecount;

        // then pull up a new image to classify
        render_newimage();

    };

};
el_id("button_submit").addEventListener(
        "click", submitData.bind( this ) );
el_id("button_submitnow").addEventListener(
        "click", submitData.bind( this ) );

// remove the most recently clicked point on the image
function removelast() {

    if( points.X.length == 0 ) {
        console.log( "No points left to remove" );
        return;
    };

    // output to console for debugging
    console.log( "removing point: "
                + points.type_id[ points.type_id.length - 1 ] + ","
                + points.X[ points.X.length - 1 ] + ","
                + points.Y[ points.Y.length - 1 ] );

    // remove from the relevant plot dataset
    // if( lasttype == 'adult_juv' ) {
    //     pointsXadultjuv.pop();
    //     pointsYadultjuv.pop();
    // } else if( lasttype == 'pup' ) {
    //     pointsXpups.pop();
    //     pointsYpups.pop();
    // } else if( lasttype == 'entangled' ) {
    //     pointsXentangled.pop();
    //     pointsYentangled.pop();
    // }

    // remove from the main output dataset
    for( i in points ) {
        points[i].pop();
    };

    // reduce the session count by one and print for user
    userdata.session_count--;
    userdata.usercount--;
    el_id("sess_counter")
        .innerHTML = "Counted: " + userdata.usercount;

    // with the last point removed, replot the data
    plot_points();
};
el_id("button_rmvlst").addEventListener(
        "click", removelast.bind( this )
    );

function removeall() {
    while( points.X.length > 0 ) {
        removelast();
    }
};
el_id("button_rmvall").addEventListener(
        "click", removeall.bind( this )
    );

// load the image to the div background
var imgPath;
var base_var;

// set the size of the div
base_var = el_id( "base" );
base_var.style.height = divHeightNow + "px";
base_var.style.width = divWidthNow + "px";

// adjust the plot range to match the image dimensions
/* var update = {
    'yaxis.range':[0,700],
    'xaxis.range':[0,700]
};
Plotly.restyle( plot_div, update ); */
react_to_windowSize();
window.addEventListener( "resize", react_to_windowSize );



// function for adjusting image brightness
function brightness_adjust( id, adjustment ) {
    console.log( "Brightness adjust pressed" );
    var img_div = el_id(id);
    var filter_value = parseInt(
        img_div.style.filter.replace( "brightness(", "" ).replace("%)","")
    );
    filter_value *= adjustment;

    // limit the brightness to +/- 5 stops from original
    var max_brightness = 100 * Math.pow(1.5,5);
    var min_brightness = 100 * Math.pow((1/1.5),5);

    filter_value =  filter_value >= max_brightness ?
                    max_brightness :
                    filter_value;
    filter_value =  filter_value <= min_brightness ?
                    min_brightness :
                    filter_value;

    img_div.style.filter = 'brightness(' + filter_value + '%)';
    
    // Adjust the brightness of the zoom div to match
    el_id("zoomdiv")
        .style.filter = 'brightness(' + filter_value + '%)';
};
el_id("button_brightness_increase").addEventListener(
        "click", brightness_adjust.bind( this, "base", 1.5 )
    );
el_id("button_brightness_decrease").addEventListener(
        "click", brightness_adjust.bind( this, "base", 1/1.5 )
    );

// function to reset image brightness
function brightness_reset() {
    el_id("base").style.filter = "brightness(100%)";
    el_id("zoomdiv").style.filter = "brightness(100%)";
};
brightness_reset();


// A function to skip counting the current image.
// Not for use by volunteers
function skipImage() {
    console.log( "skip button pressed" ); // for testing

    // clear the comment box
    el_id("comment").value = ""
    
    // first remove the image we just analysed from the list
    // note the same image will reappear in this user's list next session
    var index = filelist.findIndex(x => x[1] == imagefile.filename);
    if( index > -1 ) filelist.splice( index, 1 );

    // then pull up a new image to classify
    render_newimage();

};


// define a function to invoke on key press
function keydown( event ) {
    const keycode = event.which;
    //console.log( keycode );

    // change the selected type with number keys
    if( keycode >= 49 && keycode <= 49 + setup.type_ids.length - 1 ) {
        const newtype = setup.type_ids[ keycode - 49 ];
        exampleClick( newtype );
    };
};




/*
 * after a period of inactivity, reset all the points
 * This is specifically for the Nobbies installation
 */
/*
// create a timer for reload
const reload_delay_ms = 60000;
let reload_timer = setInterval( removeall, reload_delay_ms );

// reset that timer when there's any user activity
window.addEventListener( "click", () => {
    clearInterval( reload_timer );
    reload_timer = setInterval( removeall, reload_delay_ms );
} );
*/
