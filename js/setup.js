

const setup = {
    "project": "2021-2022_sealSurvey",
    "project_id": 15,
    "page_title": "Seal Spotter",
    "type_ids": [  "1", "2", "14", "3" ],
    "labels": [ "Adult/juv.",
    			"Pup",
    			"Pup (dead)",
    			"Entangled" ],
    "point_colours": [  "red",
    					"#38FF49",
    					"yellow",
    					"#799CFC" ],
    // reference for point_shapes (plotly symbol) options:
    // https://plotly.com/javascript/reference/#box-marker-symbol
    "point_shapes": [   "circle",
                        "square",
                        "star",
                        "triangle-up" ],
    "point_sizes": [6,6,8,10],
    "example_images": [
        [ "example_adjuv1.jpg",
          "example_adjuv2.jpg" ],
        [ "example_pup1.jpg",
          "example_pup2.jpg" ],
        [ "example_pupdead1.jpg",
          "example_pupdead2.jpg",
          "example_pupdead3.jpg",
          "example_pupdead4.jpg" ],
        [ "example_entangled1.jpg",
          "example_entangled2.jpg",
          "example_entangled3.jpg" ]
    ],

    "default_to_first_type": false, 
    
    "skip_landing_page": false,

    "skip_signin_page": false,

    // specify the number of replicate counts per image
    // `0` means no limit
    // "required_reps": 3

};

