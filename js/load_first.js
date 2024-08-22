
const el_id = id => document.getElementById(id);

// a function to enact upon user agreeing to the disclaimer
// doing this here to have it enabled without having to wait
// for jQuery and plotly to be sourced
function landingProceed() {

    // move to the sign in page
    document.getElementById("introduction").style.display = "none";
    document.getElementById("signinform").style.display = "inherit";

    // close the video
    document.getElementById("videodiv").src = "";

};

// either skip the landing page now, or set up an event listener
// on the proceed button
if( setup.skip_landing_page ) {
    landingProceed();
} else {
    document.getElementById("proceedbutton")
        .addEventListener("click", landingProceed);
};



document.title = setup.page_title;
el_id("signin_heading").innerText = setup.page_title;
el_id("intro_heading").innerText =
    "Welcome to " + setup.page_title;
el_id("finished_heading").innerText = setup.page_title;
el_id("comments_heading").innerText = setup.page_title;


// create radio buttons for each type option
function createRadioButtons( values, texts ) {
    const parent = "radiobuttons_form";
    let parent_dom = document.getElementById( parent );
    
    // clear the existing radio buttons
    while( parent_dom.firstChild ) {
        parent_dom.removeChild(parent_dom.firstChild);
    };


    // add the new buttons
    for( let i = 0; i < values.length; i++ ) {

        // make the button itself
        let input = document.createElement( "input" );
        input.setAttribute( "type", "radio" );
        input.setAttribute( "name", "type" );
        input.setAttribute( "value", values[i] );
        parent_dom.appendChild( input );

        // add the text to display
        let text = document.createTextNode( texts[i] );
        parent_dom.appendChild( text );

        // add a line break to separate the buttons
        let linebreak = document.createElement( "br" );
        parent_dom.appendChild( linebreak );

    };
    
};
createRadioButtons( setup.type_ids, setup.labels );



// create the encessary components for the example images
function addExampleImages( types, labels, images ) {
    const parent = "example_images";
    let parent_dom = document.getElementById( parent );
    
    // clear the parent dom object
    while( parent_dom.firstChild ) {
        parent_dom.removeChild(parent_dom.firstChild);
    };


    // add the types one by one
    
    for( let i = 0; i < types.length; i++ ) {

        // make sure there's a type here to work with
        if( !types[i] ) break;
        // make sure there's an image to work with
        if( !images[i] || !images[i][0] ) break;

        // make the container div for this type
        let cont = document.createElement( "div" );
        cont.setAttribute( "class", "container" );
        cont.setAttribute( "id", "example_typeid" + types[i] );

        // put the first image in that container
        var newob = document.createElement( "img" );
        newob.setAttribute( "class", "exampleImg" );
        newob.setAttribute( "src", "images_fixed/" + images[i][0] );
        cont.appendChild( newob );

        // put a text overlay to use on hover
        newob = document.createElement( "div" );
        newob.setAttribute( "class", "overlay" );
        newob2 = document.createElement( "div" );
        newob2.setAttribute( "class", "hover_text" );

        newob2.appendChild(
            document.createTextNode( labels[i] )
        );
        newob.appendChild( newob2 );
        cont.appendChild( newob );

        // add a reveal div to reveal on hover
        newob = document.createElement( "div" );
        newob.setAttribute( "id", "example_typeid" + types[i] + "_hover" );
        newob.setAttribute( "class", "hover_reveal" );

        // add the images to that reveal div
        for( let j = 0; j < images[i].length; j++ ) {
            img_obj = document.createElement( "img" );
            img_obj.setAttribute( "class", "hover_reveal_img" );
            img_obj.setAttribute( "src", "images_fixed/" + images[i][j] );
            newob.appendChild( img_obj );
        };

        // append those images to the container
        cont.appendChild( newob );

        // set the container with a hover action
        cont.addEventListener("mouseover", function() {
            document.getElementById( "example_typeid" + types[i] + "_hover" )
                .style.display = "inherit";
        });
        cont.addEventListener("mouseout", function() {
            document.getElementById( "example_typeid" + types[i] + "_hover" )
                .style.display = "none";
        });

        //add that container to the parent div
        parent_dom.appendChild( cont );

    };

    // add the zoom div, which sits at the bottom
    let zoomdiv_dom = document.createElement( "div" );
    zoomdiv_dom.setAttribute( "id", "zoomdiv" );
    parent_dom.appendChild( zoomdiv_dom );
    
};
addExampleImages( setup.type_ids, setup.labels, setup.example_images );

// console.log( setup.type_ids );


