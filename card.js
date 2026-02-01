document.addEventListener("DOMContentLoaded", () => {
    const videoCards = document.querySelectorAll(".video-card"); // Select all video cards

    videoCards.forEach(videoCard => {
        const glare = videoCard.querySelector(".glare");

        const calculateAngle = (e, item, parent) => {
            let dropShadowColor = "rgba(0, 0, 0, 0.3)";

            parent.classList.add("animated");

            let x = Math.abs(item.getBoundingClientRect().x - e.clientX);
            let y = Math.abs(item.getBoundingClientRect().y - e.clientY);

            let halfWidth = item.getBoundingClientRect().width / 2;
            let halfHeight = item.getBoundingClientRect().height / 2;

            let calcAngleX = (x - halfWidth) / 6;
            let calcAngleY = (y - halfHeight) / 14;

            let gX = (1 - (x / (halfWidth * 2))) * 100;
            let gY = (1 - (y / (halfHeight * 2))) * 100;

            glare.style.background = `radial-gradient(circle at ${gX}% ${gY}%, rgba(255, 255, 255, 0.3), transparent)`;

            parent.style.perspective = `${halfWidth * 6}px`;
            item.style.perspective = `${halfWidth * 6}px`;

            item.style.transform = `rotateY(${calcAngleX}deg) rotateX(${-calcAngleY}deg) scale(1.04)`;

            let calcShadowX = (x - halfWidth) / 3;
            let calcShadowY = (y - halfHeight) / 6;

            item.style.filter = `drop-shadow(${-calcShadowX}px ${-calcShadowY}px 15px ${dropShadowColor})`;
        };

        videoCard.addEventListener("mousemove", (e) => {
            calculateAngle(e, videoCard, videoCard.parentElement);
        });

        videoCard.addEventListener("mouseleave", () => {
            videoCard.classList.remove("animated");
            videoCard.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
            videoCard.style.filter = "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3))";
        });
    });
});
