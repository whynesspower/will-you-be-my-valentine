document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById('background-music');
    const muteButton = document.getElementById('mute-button');
    const volumeSlider = document.getElementById('volume-slider');
    const icon = muteButton.querySelector("i"); // Get the icon inside the button

    // Set default volume and loop
    audio.volume = 1;
    audio.loop = true;

    // Try to play audio - browsers may block this without user interaction
    function tryPlayAudio() {
        audio.play().catch(error => {
            console.log('Autoplay was prevented. Will play on first user interaction.');
        });
    }
    
    tryPlayAudio();
    
    // Play audio on first user interaction if autoplay was blocked
    function playOnInteraction() {
        audio.play();
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
    }
    document.addEventListener('click', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction);

    // Helper to get video element (it may be hidden initially)
    function getVideo() {
        return document.querySelector(".aside.left video");
    }

    // Mute/Unmute both background music and video
    muteButton.addEventListener("click", function () {
        let isMuted = !audio.muted; // Toggle mute state

        audio.muted = isMuted;
        
        const video = getVideo();
        if (video) {
            video.muted = isMuted;
        }

        // Change mute icon dynamically
        icon.className = isMuted ? "fa fa-volume-off" : "fa fa-volume-up";

        // Sync volume slider with mute state
        volumeSlider.value = isMuted ? 0 : audio.volume;
    });

    // Volume slider functionality for both audio and video
    volumeSlider.addEventListener("input", function () {
        let volume = volumeSlider.value;

        audio.volume = volume;
        
        const video = getVideo();
        if (video) {
            video.volume = volume;
        }

        // Auto-mute when volume is at 0
        let isMuted = volume == 0;
        audio.muted = isMuted;
        if (video) {
            video.muted = isMuted;
        }

        // Update mute button icon
        icon.className = isMuted ? "fa fa-volume-off" : "fa fa-volume-up";
    });
});
