document.addEventListener("DOMContentLoaded", function() {
    const backgroundImages = [
        'url("paintings/view-from-ravid-2023.jpg")',
        'url("paintings/view-from-muki-2024.HEIC")',
        'url("paintings/the-adventure-2024.jpg")'
    ];
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    const header = document.getElementById('random-header');
    header.style.backgroundImage = randomImage;
});

document.addEventListener("DOMContentLoaded", function() {
    const fadeInElements = document.querySelectorAll(".fade-in");
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, { threshold: 0.5 });
  
    fadeInElements.forEach((element) => {
      observer.observe(element);
    });
  });

document.addEventListener("DOMContentLoaded", function () {
  // Fetch the paintings data
  fetch("paintings.json")
      .then(response => response.json())
      .then(paintings => {
          const galleryContainer = document.querySelector(".gallery-container");

          // Create and append all images
          paintings.forEach(painting => {
            const container = document.createElement("div");
            container.classList.add("painting-container");
              const img = document.createElement("img");
              img.src = painting.src;
              img.alt = painting.title;
              img.classList.add("gallery-item");
              img.setAttribute("data-bs-toggle", "modal");
              img.setAttribute("data-bs-target", "#imageModal");
              img.setAttribute("data-id", painting.id);
              
        // Add ribbon if painting is available
        if (painting.available) {
            const ribbon = document.createElement("div");
            ribbon.classList.add("ribbon");
            ribbon.textContent = "זמין\nAvailable";
            container.appendChild(ribbon);
          }

        // Add image to container
        container.appendChild(img);
        
        // Add container to gallery
        galleryContainer.appendChild(container);
          });

          // Set up modal event listener 
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


          // Set up fade-in effect for painting containers
      const galleryItems = document.querySelectorAll('.painting-container');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          } else {
            entry.target.classList.remove('fade-in');
          }
        });
      }, { threshold: 0.5 });

      galleryItems.forEach((item) => {
        observer.observe(item);
      });
    })
    .catch(error => console.error("Error fetching paintings data:", error));
});

