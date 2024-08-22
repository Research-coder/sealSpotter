
const images = [
    "20191213_sealRocks_x1200_y1000_-16-14",
    "20191219_skerries_x1200_y1000_-31-43",
    "20201228_sealRocks_x1200_y1000-6-42",
    "20201228_sealRocks_x1200_y1000-21-24",
    "20210108_skerries_x1200_y1000-32-29",
    "20210108_skerries_x1200_y1000-55-48"
];

let image_i = 0;

let slider_bar;

const update_images = () => {
    image_i++;
    if( image_i >= images.length ) image_i = 0;
    slider_bar = new SliderBar({
        el: '#image_slider',
        beforeImg: `images/${images[image_i]}_unlabelled.jpg`,
        afterImg: `images/${images[image_i]}_labelled.jpg`,
        width: "100%",
        height: "100%",
        line: true,
        lineColor: "rgba(0,0,0,0.5)"
    });
}

update_images();

document.getElementById("next").addEventListener("click", update_images);
