document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById('background-music');
    const muteButton = document.getElementById('mute-button');
    const volumeSlider = document.getElementById('volume-slider');
    const icon = muteButton.querySelector("i");
    const videoCard = document.querySelector(".aside.left"); // Video card
    const video = videoCard.querySelector("video"); // Get video element
    const clickButton = document.querySelector(".click-box button");
    const choiceBox = document.querySelector(".choice-box");
    const threedBox = document.querySelector(".threed-box");
    const questionText = document.querySelector(".question-box h1");
    const yesButton = document.querySelector(".choice-box .yes-btn");
    const noButton = document.querySelector(".choice-box .no-btn");
    const buttonContainer = document.querySelector(".button-container");

    let partnerName = "Jan"; // Replace with dynamic value
    let noClickCount = 0; // Counter for No button clicks
    
    // Detect if device is mobile/touch
    function isMobileDevice() {
        return (('ontouchstart' in window) || 
                (navigator.maxTouchPoints > 0) || 
                (window.innerWidth <= 768));
    }
    
    // Desktop: Make No button jump away BEFORE mouse reaches it
    if (!isMobileDevice()) {
        let hasStartedJumping = false;
        const proximityThreshold = 200; // Reduced from 300 to be less aggressive
        const moveDistance = 150; // Reduced from 200 to be less jumpy
        const edgeThreshold = 50; 
        
        // Add a small transition for smoother movement
        noButton.style.transition = "all 0.2s ease-out";
        
        // Track mouse movement
        document.addEventListener('mousemove', function(e) {
            if (choiceBox.classList.contains('hide')) return;
            
            const buttonRect = noButton.getBoundingClientRect();
            const containerRect = buttonContainer.getBoundingClientRect();
            
            // Calculate center of button
            const buttonCenterX = buttonRect.left + buttonRect.width / 2;
            const buttonCenterY = buttonRect.top + buttonRect.height / 2;
            
            // Calculate distance from mouse to button center
            const distance = Math.sqrt(
                Math.pow(e.clientX - buttonCenterX, 2) + 
                Math.pow(e.clientY - buttonCenterY, 2)
            );
            
            // If mouse is near, move away
            if (distance < proximityThreshold) {
                const buttonWidth = buttonRect.width;
                const buttonHeight = buttonRect.height;
                
                // Container boundaries
                const padding = 10;
                const minX = padding;
                const maxX = containerRect.width - buttonWidth - padding;
                const minY = padding;
                const maxY = containerRect.height - buttonHeight - padding;
                
                // Current position relative to container
                const currentX = buttonRect.left - containerRect.left;
                const currentY = buttonRect.top - containerRect.top;
                
                // First time jumping - enable absolute positioning
                if (!hasStartedJumping) {
                    hasStartedJumping = true;
                    noButton.classList.add('jumping');
                    noButton.style.position = 'absolute'; 
                    // Set initial position
                    noButton.style.left = currentX + 'px';
                    noButton.style.top = currentY + 'px';
                }
                
                // Calculate direction OPPOSITE to cursor
                const angleFromCursor = Math.atan2(
                    buttonCenterY - e.clientY,
                    buttonCenterX - e.clientX
                );
                
                // Calculate new position moving away from cursor
                let newX = currentX + Math.cos(angleFromCursor) * moveDistance;
                let newY = currentY + Math.sin(angleFromCursor) * moveDistance;
                
                // Check if we're hitting edges and apply anti-clockwise movement
                const atLeftEdge = newX <= minX + edgeThreshold;
                const atRightEdge = newX >= maxX - edgeThreshold;
                const atTopEdge = newY <= minY + edgeThreshold;
                const atBottomEdge = newY >= maxY - edgeThreshold;
                
                // Anti-clockwise direction at edges logic...
                if (atTopEdge && atLeftEdge) {
                    newX = minX; newY = currentY + moveDistance;
                } else if (atTopEdge && atRightEdge) {
                    newX = currentX - moveDistance; newY = minY;
                } else if (atBottomEdge && atRightEdge) {
                    newX = maxX; newY = currentY - moveDistance;
                } else if (atBottomEdge && atLeftEdge) {
                    newX = currentX + moveDistance; newY = maxY;
                } else if (atTopEdge) {
                    newX = currentX - moveDistance; newY = minY;
                } else if (atLeftEdge) {
                    newX = minX; newY = currentY + moveDistance;
                } else if (atBottomEdge) {
                    newX = currentX + moveDistance; newY = maxY;
                } else if (atRightEdge) {
                    newX = maxX; newY = currentY - moveDistance;
                }
                
                // Clamp to container bounds
                newX = Math.max(minX, Math.min(maxX, newX));
                newY = Math.max(minY, Math.min(maxY, newY));
                
                // Apply position
                noButton.style.left = newX + 'px';
                noButton.style.top = newY + 'px';
            }
        });
        
        // Backup: if mouse somehow enters button, escape immediately
        noButton.addEventListener('mouseenter', function(e) {
            if (choiceBox.classList.contains('hide')) return;
            
            const containerRect = buttonContainer.getBoundingClientRect();
            const buttonRect = noButton.getBoundingClientRect();
            const buttonWidth = noButton.offsetWidth;
            const buttonHeight = noButton.offsetHeight;
            
            const padding = 10;
            const minX = padding;
            const maxX = containerRect.width - buttonWidth - padding;
            const minY = padding;
            const maxY = containerRect.height - buttonHeight - padding;
            
            if (!hasStartedJumping) {
                hasStartedJumping = true;
                noButton.classList.add('jumping');
            }
            
            // Current position
            const currentX = buttonRect.left - containerRect.left;
            const currentY = buttonRect.top - containerRect.top;
            
            // Emergency escape: move to opposite corner
            let newX, newY;
            if (currentX < containerRect.width / 2) {
                newX = maxX;
            } else {
                newX = minX;
            }
            if (currentY < containerRect.height / 2) {
                newY = maxY;
            } else {
                newY = minY;
            }
            
            noButton.style.left = newX + 'px';
            noButton.style.top = newY + 'px';
        });
        
        // Extra protection: also handle mouseover in case mouseenter doesn't fire
        noButton.addEventListener('mouseover', function(e) {
            // Trigger the mouseenter logic
            noButton.dispatchEvent(new Event('mouseenter'));
        });
    }

    // Function to create typewriter effect
    function typeWriterEffect(element, text, speed = 100) {
        element.innerHTML = ""; // Clear previous text
        let i = 0;
        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            } else {
                element.innerHTML += `<span class="typewriter"></span>`; // Cursor effect
            }
        }
        typing();
    }

    // Function to handle the click event
    function revealChoices() {
        audio.pause(); // Stop background music
        audio.currentTime = 0; // Reset music

        videoCard.classList.remove("hide"); // Show video card
        
        // Play the funny video with proper error handling
        video.muted = false; // Ensure video is not muted
        video.play().catch(error => {
            console.log('Video autoplay was prevented, trying muted:', error);
            // If autoplay fails, try playing muted first then unmute
            video.muted = true;
            video.play().then(() => {
                // Unmute after a short delay
                setTimeout(() => {
                    video.muted = false;
                }, 100);
            }).catch(e => console.log('Video failed to play:', e));
        });

        clickButton.style.display = "none"; // Hide the button
        choiceBox.classList.remove("hide"); // Show Yes/No options

        // Show partner name instantly
        questionText.innerHTML = `<span class="partner-name">${partnerName}</span><br><span class="typed-text"></span>`;

        // Start typewriter effect for the second line
        const typedTextElement = document.querySelector(".typed-text");
        setTimeout(() => {
            typeWriterEffect(typedTextElement, "Will you be my Valentine?");
        }, 500); // Delay to allow smooth transition
    }

    function createHearts() {
        const heartContainer = document.createElement("div");
        heartContainer.classList.add("heart-container");
        document.body.appendChild(heartContainer);
    
        for (let i = 0; i < 30; i++) {
            let heart = document.createElement("div");
            heart.classList.add("heart");
            
            // Random positioning and animation speed
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.animationDuration = Math.random() * 2 + 3 + "s";
            
            heartContainer.appendChild(heart);
        }
    
        // Remove hearts after animation ends
        setTimeout(() => {
            heartContainer.remove();
        }, 5000);
    }
    
    yesButton.addEventListener("click", function () {
        questionText.innerHTML = `<span class="partner-name">${partnerName}</span><br><span class="love-text">You are my heart baby ❤️</span>`;
        choiceBox.style.display = "none"; // Hide choices
        threedBox.classList.remove("hide");

        createHearts();
    });

      // Handle "No" button click - only shrink on mobile
    noButton.addEventListener("click", function () {
        if (isMobileDevice()) {
            noClickCount++; // Increment No click count

            if (noClickCount < 5) {
                let newNoSize = 16 - noClickCount * 2; // Reduce No button size
                let newYesSize = 18 + noClickCount * 5; // Increase Yes button size

                noButton.style.fontSize = `${newNoSize}px`;
                noButton.style.padding = `${newNoSize / 2}px ${newNoSize}px`;

                yesButton.style.fontSize = `${newYesSize}px`;
                yesButton.style.padding = `${newYesSize / 2}px ${newYesSize}px`;
            } else {
                noButton.style.display = "none"; // Hide No button after 5 clicks
                questionText.innerHTML += `<br><span class="no-choice-text">Did you really think you had a choice? 🤭</span>`;
            }
        }
        // On desktop, the button jumps away so clicking is nearly impossible
    });

    clickButton.addEventListener("click", revealChoices);
});