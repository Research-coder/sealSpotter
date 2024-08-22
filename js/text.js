
// a function for entering text into a particular field
const insertText = ( id, text ) => {
    const stringToEnter = text.reduce((a,b) => `${a}${b}<br><br>`, '');
    document.getElementById(id).innerHTML = stringToEnter;
};


// One by one, create and insert the text for each text field
termsofusetext = [
    "By using the system provided here, you agree to the use of data entered by you for research and educational purposes. Data will be analysed and communicated in such a way as to maintain user anonymity where possible, however your contact information may be used to contact you regarding this or similar projects.",
    "Phillip Island Nature Parks ('we'/'our') reserves all rights to the data entered through this system in perpetuity. Data will be stored and analysed at our discretion. We may also deem it appropriate to share the data obtained with relevant third parties, in which case user anonymity will be maintained where possible.",
    "If using this system may place you at risk or imposes a personal cost of any kind, or if you are under the age of 13, we advise you not to use it. By proceeding, you agree to assume any and all risks and/or costs involved in or arising from your use of this system.",
    "This research is aligned with the conservation goals of Phillip Island Nature Parks and is performed under wildlife ethics and research permits."
];
insertText( "termsofuse", termsofusetext );

introtext = [
	"Australian fur seals play an important role in Australia's marine ecosystems, particularly around Phillip Island. To better understand them, we need your help.",
	"SealSpotter allows anyone with a computer to help with the management and protection of our oceans by counting seals in images captured with a UAV (a.k.a 'drone'). This allows Nature Parks scientists to analyse seal population and marine debris entanglement data faster and more accurately, leading to a greater understanding of their world and the threats they face.",
	"Start by watching the video below, then click through to get started. What are you waiting for? Dive in!"
];
insertText( "intro", introtext );

beforeproceedingtext = [
    "Before proceeding, please watch the introduction video above, and read the disclaimer agreement below.",
    'We sincerely appreciate your efforts and contribution. Should you have questions or comments, please feel free to email us at <a href="mailto:sealspotter@natureparksresearch.com.au?Subject=SealSpotter%20contact" target="_top">sealspotter@natureparksresearch.com.au </a>.'
];
insertText( "before_proceeding", beforeproceedingtext );

acknowledgementtext = [
    "We acknowledge the Traditional Custodians of this land and pay our respects to their Elders, past, present and future."
];
insertText( "acknowledgement", acknowledgementtext );

finishedtext = [
    "WOOHOO, you've counted every image for this project!!!",
    "Great job, and thank you!",
    "Listen out for more projects soon."
];
insertText( "finished", finishedtext );

disclaimertext = [
    "Any details given here will be used only to identify users for the purposes of data management and analysis. Emails may be used to contact you regarding SealSpotter. We will never pass your personal details on to any third party."
];
insertText( "disclaimer", disclaimertext );
