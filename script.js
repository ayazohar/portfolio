document.addEventListener("DOMContentLoaded", function() {
    // Array of background image URLs
    const backgroundImages = [
        'url("paintings/view-from-ravid-2023.jpg")',
        'url("paintings/view-from-muki-2024.HEIC")',
        'url("paintings/the-adventure-2024.jpg")'
    ];

    // Select a random image from the array
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

    // Apply the random image to the header's background
    const header = document.getElementById('random-header');
    header.style.backgroundImage = randomImage;
});

function updateModal(imgSrc, title, description) {
    document.getElementById('modalImage').src = imgSrc;
    document.getElementById('imageModalLabel').textContent = title;
    document.getElementById('modalDescription').textContent = description;
    console.log('Modal updated:', {imgSrc, title, description});
}