// JavaScript to handle lightbox opening and cycling through images
let subImages = [];
let currentIndex = 0;

// Show the lightbox with the clicked image
document.querySelectorAll('.image.fit').forEach((image) => {
    image.addEventListener('click', function (event) {
        event.preventDefault();
        
        // Retrieve the sub-images from the data attribute
        subImages = JSON.parse(this.getAttribute('data-sub-images'));
        currentIndex = 0; // Reset index for new set of images
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        
        lightboxImg.src = subImages[currentIndex]; // Set the first sub-image
        lightbox.style.display = 'flex'; // Show the lightbox
    });
});

// Update the lightbox image based on the current index
function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = subImages[currentIndex];
}

// Previous button functionality
document.getElementById('prev').addEventListener('click', function () {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : subImages.length - 1; // Wrap around to last image
    updateLightboxImage();
});

// Next button functionality
document.getElementById('next').addEventListener('click', function () {
    currentIndex = (currentIndex < subImages.length - 1) ? currentIndex + 1 : 0; // Wrap around to first image
    updateLightboxImage();
});

// Hide lightbox when clicked outside the image
document.getElementById('lightbox').addEventListener('click', function (event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});
