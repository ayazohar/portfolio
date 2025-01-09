// The locale our app first shows
const defaultLocale = 'he'
// The active locale
let locale
// Gets filled with active locale translations
let translations = {}

document.addEventListener('DOMContentLoaded', function () {
    // Random header background
    const backgroundImages = [
        'url("paintings/view-from-ravid-2023.jpg")',
        'url("paintings/view-from-muki-2024.HEIC")',
        'url("paintings/the-adventure-2024.jpg")',
        'url("paintings/for-whom-the-bell-tolls-color-2024.jpeg")',
    ]
    const randomImage =
        backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
    const header = document.getElementById('random-header')
    if (header) {
        header.style.backgroundImage = randomImage
    }

    // Translate the page to the default locale
    setLocale(defaultLocale)
    bindLocaleSwitcher(defaultLocale)

    // Fade-in effect setup
    const fadeInElements = document.querySelectorAll('.fade-in')
    const fadeInObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                } else {
                    entry.target.classList.remove('visible')
                }
            })
        },
        { threshold: 0.5 }
    )

    fadeInElements.forEach((element) => {
        fadeInObserver.observe(element)
    })
})

//TRANSLATION CODE

function bindLocaleSwitcher(initialValue) {
    const switcher = document.querySelector('[data-i18n-switcher]')
    switcher.value = initialValue
    switcher.onchange = (e) => {
        // Set the locale to the selected option[value]
        setLocale(e.target.value)
    }
}

// Load translations for the given locale and translate
// the page to this locale
async function setLocale(newLocale) {
    if (newLocale === locale) return
    const newTranslations = await fetchTranslationsFor(newLocale)
    locale = newLocale
    translations = newTranslations
    document.documentElement.dir = dir(newLocale)
    document.documentElement.lang = newLocale
    translatePage()
}
// Retrieve translations JSON object for the given
// locale over the network
async function fetchTranslationsFor(newLocale) {
    const response = await fetch(`./lang/${newLocale}.json`)
    return await response.json()
}
// Replace the inner text of each element that has a
// data-i18n-key attribute with the translation corresponding
// to its data-i18n-key
function translatePage() {
    document.querySelectorAll('[data-i18n-key]').forEach(translateElement)
}
// Replace the inner text of the given HTML element
// with the translation in the active locale,
// corresponding to the element's data-i18n-key
function translateElement(element) {
    const key = element.getAttribute('data-i18n-key')
    const translation = translations[key]
    element.innerText = translation
}

function dir(locale) {
    return locale === 'en' ? 'ltr' : 'rtl'
}

// GENERATE PAINTINGS GALLERY
document.addEventListener('DOMContentLoaded', function () {
    let paintings = [] // Store paintings data globally

    // Fetch paintings data and set up gallery
    fetch('paintings.json')
        .then((response) => response.json())
        .then((data) => {
            paintings = data // Store the paintings data
            const galleryContainer =
                document.querySelector('.gallery-container')

            if (!galleryContainer) {
                console.error('Gallery container not found')
                return
            }

            // Create and append all images
            paintings.forEach((painting) => {
                const container = document.createElement('div')
                container.classList.add('painting-container')

                const img = document.createElement('img')
                img.src = painting.src
                img.alt = painting.title
                img.classList.add('gallery-item')
                img.setAttribute('data-bs-toggle', 'modal')
                img.setAttribute('data-bs-target', '#imageModal')
                img.setAttribute('data-id', painting.id)

                // Add ribbon if painting is available
                if (painting.available) {
                    const ribbon = document.createElement('div')
                    ribbon.classList.add('ribbon')
                    ribbon.setAttribute('data-i18n-key', 'available')
                    ribbon.textContent = 'זמין'
                    container.appendChild(ribbon)
                }

                container.appendChild(img)
                galleryContainer.appendChild(container)
            })

            // Set up gallery items fade-in effect
            const galleryItems = document.querySelectorAll(
                '.painting-container'
            )
            const galleryObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('fade-in')
                        } else {
                            entry.target.classList.remove('fade-in')
                        }
                    })
                },
                { threshold: 0.5 }
            )

            galleryItems.forEach((item) => {
                galleryObserver.observe(item)
            })

            // Modal setup - moved inside the fetch.then to ensure paintings data is available
            const imageModal = document.getElementById('imageModal')
            if (imageModal) {
                imageModal.addEventListener('show.bs.modal', function (event) {
                    const imgElement = event.relatedTarget
                    const paintingId = imgElement.getAttribute('data-id')
                    const painting = paintings.find((p) => p.id === paintingId)

                    if (!painting) {
                        console.error(
                            `Painting with ID "${paintingId}" not found.`
                        )
                        return
                    }

                    const fullSizeImage = document.getElementById('modalImage')
                    if (!fullSizeImage) {
                        console.error('Modal image element not found')
                        return
                    }

                    // Set the image source
                    fullSizeImage.src = painting.src

                    // Reset zoom and transform state
                    let scale = 1
                    let startX = 0
                    let startY = 0
                    let translateX = 0
                    let translateY = 0

                    // Helper function to keep the image within bounds
                    function constrainToBounds() {
                        const container = fullSizeImage.parentElement
                        const bounds = container.getBoundingClientRect()

                        // Calculate the scaled width and height of the image
                        const scaledWidth = fullSizeImage.naturalWidth * scale
                        const scaledHeight = fullSizeImage.naturalHeight * scale

                        const maxTranslateX = Math.max(
                            0,
                            (scaledWidth - bounds.width) / 2
                        )
                        const maxTranslateY = Math.max(
                            0,
                            (scaledHeight - bounds.height) / 2
                        )

                        // Constrain translateX and translateY to within the bounds
                        translateX = Math.max(
                            -maxTranslateX,
                            Math.min(maxTranslateX, translateX)
                        )
                        translateY = Math.max(
                            -maxTranslateY,
                            Math.min(maxTranslateY, translateY)
                        )

                        fullSizeImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`
                    }

                    // Function to handle mouse movement during drag
                    function handleDrag(event) {
                        event.preventDefault()
                        translateX = event.clientX - startX
                        translateY = event.clientY - startY
                        constrainToBounds()
                    }

                    fullSizeImage.addEventListener('mousedown', (event) => {
                        startX = event.clientX - translateX
                        startY = event.clientY - translateY
                        fullSizeImage.style.cursor = 'grabbing'

                        // Add mousemove and mouseup listeners for dragging
                        document.addEventListener('mousemove', handleDrag)
                        document.addEventListener('mouseup', stopDrag)
                    })

                    // Function to stop dragging
                    function stopDrag() {
                        fullSizeImage.style.cursor = 'grab'
                        // Remove the event listeners when dragging stops
                        document.removeEventListener('mousemove', handleDrag)
                        document.removeEventListener('mouseup', stopDrag)
                    }

                    //zoom functionality

                    fullSizeImage.addEventListener('wheel', (event) => {
                        event.preventDefault()

                        const oldScale = scale
                        const delta = event.deltaY * -0.01
                        scale = Math.min(Math.max(1, scale + delta), 4)

                        // Calculate the mouse position relative to the image
                        const rect = fullSizeImage.getBoundingClientRect()
                        const mouseX = (event.clientX - rect.left) / rect.width
                        const mouseY = (event.clientY - rect.top) / rect.height

                        // Adjust translateX and translateY to zoom around the mouse position
                        translateX +=
                            (mouseX - 0.5) * rect.width * (scale - oldScale)
                        translateY +=
                            (mouseY - 0.5) * rect.height * (scale - oldScale)

                        constrainToBounds()
                    })

                    // Clean up when modal is hidden
                    imageModal.addEventListener('hide.bs.modal', () => {
                        scale = 1
                        translateX = 0
                        translateY = 0

                        fullSizeImage.style.transform = `scale(${scale}) translate(0, 0)`
                        fullSizeImage.style.cursor = 'grab'

                        // Clean up lingering event listeners
                        document.removeEventListener('mousemove', handleDrag)
                        document.removeEventListener('mouseup', stopDrag)
                    })

                    // Update modal content
                    const modalTitle =
                        document.getElementById('imageModalLabel')
                    const modalDescription =
                        document.getElementById('modalDescription')

                    if (modalTitle) modalTitle.textContent = painting.title
                    if (modalDescription)
                        modalDescription.textContent = painting.description
                })
            }
        })
        .catch((error) =>
            console.error('Error fetching paintings data:', error)
        )
})

function leftCarousel(){
  const currentPosition=document.querySelector("#carousel-strip").scrollLeft
  const newPosition = currentPosition - 392

  document.querySelector("#carousel-strip").scroll({
    top: 100,
    left: newPosition,
    behavior: "smooth",
  });
}
function rightCarousel(){
  const currentPosition=document.querySelector("#carousel-strip").scrollLeft
  const newPosition = currentPosition + 392

  document.querySelector("#carousel-strip").scroll({
    top: 100,
    left: newPosition,
    behavior: "smooth",
  });
}
/*GLIDE

const glideContainer = document.querySelector('.glide__slides')

fetch('sketches.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error(
                `Failed to fetch sketches.json: ${response.statusText}`
            )
        }
        return response.json()
    })
    .then((data) => {
        console.log('Received data:', data) // Add this line

        const images = data.images
        if (!Array.isArray(images)) {
            throw new Error('Invalid data format: "images" is not an array')
        }

        // Clear any existing slides
        glideContainer.innerHTML = ''

        // Create slides
        images.forEach((image) => {
            const slide = document.createElement('li')
            slide.className = 'glide__slide'

            const img = document.createElement('img')
            img.src = image.src
            img.alt = image.alt
            img.style.cssText =
                'width: 100%; height: auto; display: block; object-fit: cover;'

            slide.appendChild(img)
            glideContainer.appendChild(slide)
        })

        // Initialize Glide with specific options
        const glide = new Glide('.glide', {
            type: 'carousel',
            startAt: 0,
            perView: 1,
            gap: 0,
            autoplay: false,
            animationDuration: 400,
            peek: 0,
            bound: true,
        })

        // Add a callback when Glide is mounted
        glide.on('mount.after', () => {
            console.log('Glide mounted successfully')
            // Force a redraw
            glide.update()
        })

        glide.mount()
    })
    .catch((error) => {
        console.error('Error loading glide data:', error)
    })

// Create slides from JSON data

/*
//CAROUSEL

// Fetch the JSON file and initialize the carousel
fetch('sketches.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch sketches.json: ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    const images = data.images;
    if (!Array.isArray(images)) {
        throw new Error('Invalid data format: "images" is not an array');
      }

    const carouselContainer = document.querySelector('.carousel-container');
    const carousel = new Carousel(carouselContainer, images);
  })
  .catch((error) => {
    console.error('Error loading carousel data:', error);
  });

// Carousel class
class Carousel {
  constructor(container, images) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    this.images = images;
    this.currentIndex = 0;
    this.slides = [];
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.fallbackImageUrl = "/api/placeholder/400/300"; // Fallback image URL
    
    // Detect if the page is in RTL mode
  this.isRTL = getComputedStyle(this.container).direction === 'rtl';
  
    this.init();
  }

  init() {

    
    // Create slides from JSON data
    this.images.forEach((image, index) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      
      const img = document.createElement('img');
      this.setupImage(img, image, slide);
      
      slide.appendChild(img);
      this.track.appendChild(slide);
      this.slides.push(slide);
    });

    this.updateSlides();
    this.addEventListeners();
  }

  setupImage(img, imageData, slide) {
    img.alt = imageData.alt;
    img.title = imageData.title;

    // Add loading attribute
    img.loading = "lazy";

    // Error handling
    img.onerror = () => {
      console.error(`Failed to load image: ${imageData.src}`);
      img.src = this.fallbackImageUrl;
      
      // Add error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'Image failed to load';
      slide.appendChild(errorMessage);

      // Remove error message after 3 seconds
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    };

    // Set source last to trigger load
    img.src = imageData.src;
  }

  addEventListeners() {
    this.container.querySelector('.carousel-button.prev').addEventListener('click', () => {
        this.isRTL ? this.next() : this.prev();
      });
      
      this.container.querySelector('.carousel-button.next').addEventListener('click', () => {
        this.isRTL ? this.prev() : this.next();
      });
    
    // Touch events
    this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.track.addEventListener('touchend', () => this.handleTouchEnd());
  }

  updateSlides() {
    this.slides.forEach((slide, index) => {
      slide.className = 'carousel-slide';
      slide.style.display = 'flex';
      if (index === this.currentIndex) {
        slide.classList.add('current');
      } else if (index === this.getCurrentIndex(-1)) {
        slide.classList.add('prev');
      } else if (index === this.getCurrentIndex(1)) {
        slide.classList.add('next');
    } else {
        slide.style.display = 'none';
  }

});
  }

  getCurrentIndex(offset) {
    let newIndex = this.currentIndex + offset;
    if (newIndex < 0) newIndex = this.slides.length - 1;
    if (newIndex >= this.slides.length) newIndex = 0;
    return newIndex;
  }

  prev() {
    this.currentIndex = this.getCurrentIndex(-1);
    this.updateSlides();
  }

  next() {
    this.currentIndex = this.getCurrentIndex(1);
    this.updateSlides();
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }

  handleTouchMove(e) {
    this.touchEndX = e.touches[0].clientX;
  }

  handleTouchEnd() {
    const touchDiff = this.touchStartX - this.touchEndX;
    const minSwipeDistance = 50;
  
    if (Math.abs(touchDiff) > minSwipeDistance) {
      if (this.isRTL) {
        if (touchDiff > 0) {
          this.prev(); // Swipe left in RTL -> Move to previous
        } else {
          this.next(); // Swipe right in RTL -> Move to next
        }
      } else {
        if (touchDiff > 0) {
          this.next(); // Swipe left -> Move to next
        } else {
          this.prev(); // Swipe right -> Move to previous
        }
      }
    }
  }
}

*/
