

/*
	Functionality to detect Internet Explorer.
	If IE is detected, a warning is displayed, and
	the user is recommended to install Chrome.
*/




// detect Internet Explorer
function detect_IE() {

	// older versions of IE need to be detected
	// separately from IE11
	// also detect Edge explicitly, since it might use Trident
	var ua = navigator.userAgent;
	if( !ua.match( /Edge/ )
		&&( !!ua.match( /MSIE / )
			|| !!ua.match( /Trident\/7\./ ) ) ) {
		
		display_IE_warning();
	}
}


// display a bloody big warning over the current page
function display_IE_warning() {

	// a div to dim the entire page
	var ie_warn_overlay = document.createElement("div");
	ie_warn_overlay.style.position = "absolute";
	ie_warn_overlay.style.width = "100%";
	ie_warn_overlay.style.height = "100%";
	ie_warn_overlay.style.left = 0;
	ie_warn_overlay.style.top = 0;
	ie_warn_overlay.style.opacity = 0.7;
	ie_warn_overlay.style.backgroundColor = "black";

	// a div to hold the warning box with text
	var ie_warn_container = document.createElement("div");
	ie_warn_container.style.position = "absolute";
	ie_warn_container.style.width = "100%";
	ie_warn_container.style.height = "100%";
	ie_warn_container.style.left = 0;
	ie_warn_container.style.top = 0;
	ie_warn_container.style.textAlign = "center";

	// a rectangular white background to hold the text
	var ie_warn_textbox = document.createElement("div")
	ie_warn_textbox.style.padding = "50px";
	ie_warn_textbox.style.width = "50%";
	ie_warn_textbox.style.margin = "auto";
	ie_warn_textbox.style.marginTop = "40px";
	ie_warn_textbox.style.backgroundColor = "white";
	ie_warn_textbox.style.textAlign = "center";

	// the text, with links to download browsers
	var ie_warn_text = document.createElement("h2");
	ie_warn_text.innerHTML
		= "Sorry, Internet Explorer "
		+ " is not supported.<br><br>We recommend "
		+ '<a href="https://chrome.google.com">'
		+ 'Chrome</a>, '
		+ '<a href="https://www.mozilla.org/en-US/firefox/new/">'
		+ 'Firefox</a>, or '
		+ '<a href="https://www.microsoft.com/en-au/windows/microsoft-edge">'
		+ 'Edge</a>.';

	// put the text in the textbox, and the textbox in the container
	ie_warn_textbox.appendChild( ie_warn_text );
	ie_warn_container.appendChild( ie_warn_textbox );
	
	// add both the dimming div and the warning div to the page
	document.body.appendChild( ie_warn_overlay );
	document.body.appendChild( ie_warn_container );
}


detect_IE();
