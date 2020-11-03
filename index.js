var VideoIds = {
    videoIds: [
        "lR7XZH-8U_A",
        "SDddvPHkmmY",
        "jxiPMVQantQ",
        "f06866miRHc",
        "sKyEHNPNK-c",
        "Wyr-KKwYlM4",
        "NJIO_W_vEl4",
        "YOCUjEUn8DQ",
        "SIBQ7Ssj-Jw",
        "P8ywSnXUO58",
        "ueinBaUWehQ",
        "5T1j5DzmqNM",
        "UnQyHwQ5JsM"
    ]
};
var URL = [];
for (var i = 0; i < VideoIds.videoIds.length; i++) {
    var ID = VideoIds.videoIds[i];
    URL[i] = 'https://www.youtube.com/embed/' + ID;
}
// console.log(URL);

var videos = document.querySelectorAll('iframe[src^="https://www.youtube.com/"], iframe[src^="https://player.vimeo.com"], iframe[src^="https://www.youtube-nocookie.com/"], iframe[src^="https://www.nytimes.com/"]'); //get video iframes for regular youtube, privacy+ youtube, and vimeo
videos.forEach(function (video) {
    let wrapper = document.createElement('div'); //create wrapper 
    wrapper.classList.add("video-responsive"); //give wrapper the class      
    video.parentNode.insertBefore(wrapper, video); //insert wrapper      
    wrapper.appendChild(video); // move video into wrapper
});