
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

document.addEventListener("DOMContentLoaded", function () {
    // Fetch the paintings data
    fetch("paintings.json")
      .then(response => response.json())
      .then(paintings => {
        const galleryContainer = document.querySelector(".gallery-container");
  
        paintings.forEach(painting => {
          // Create an <img> element for each painting
          const img = document.createElement("img");
          img.src = painting.src;
          img.alt = painting.title;
          img.classList.add("gallery-item");
          img.setAttribute("data-bs-toggle", "modal");
          img.setAttribute("data-bs-target", "#imageModal");
          img.setAttribute("data-id", painting.id);
  
          // Append the image to the gallery container
          galleryContainer.appendChild(img);
        });
  
        // Now add event listener for the modal only after images are loaded
        const imageModal = document.getElementById("imageModal");
        if (imageModal) {
          imageModal.addEventListener("show.bs.modal", function (event) {
            const imgElement = event.relatedTarget;
            const paintingId = imgElement.getAttribute("data-id");
            const painting = paintings.find(p => p.id === paintingId);
  
            if (painting) {
              document.getElementById("modalImage").src = painting.src;
              document.getElementById("imageModalLabel").textContent = painting.title;
              document.getElementById("modalDescription").textContent = painting.description;
            } else {
              console.error(`Painting with ID "${paintingId}" not found.`);
            }
          });
        }
      })
      .catch(error => console.error("Error fetching paintings data:", error));
  });

document.addEventListener("DOMContentLoaded", function () {
    const imageModal = document.getElementById("imageModal");
    
    if (imageModal) {
      imageModal.addEventListener("show.bs.modal", function (event) {
        const imgElement = event.relatedTarget;
        document.getElementById("modalImage").src = imgElement.src;
        document.getElementById("imageModalLabel").textContent =
          imgElement.dataset.title || "Untitled";
        document.getElementById("modalDescription").textContent =
          imgElement.dataset.description || "No description available.";
      });
    } else {
      console.error("Modal element with ID 'imageModal' not found.");
    }
  });

  $(document).ready(function() {
    $('#imageModal').on('shown.bs.modal', function () {
        console.log('Modal shown');
        console.log($('#modalImage'));
      $('#modalImage').zoom({ magnify: 1.5 }); // Adjust magnify value as needed
    });
  
    $('#imageModal').on('hidden.bs.modal', function () {
        console.log('Modal hidden');
      $('#modalImage').trigger('zoom.destroy'); // Remove zoom when modal closes
    });
  }); 

