function resizeAndDownload() {
    const imageInput = document.getElementById('imageInput');
  
    if (imageInput.files && imageInput.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
        const image = new Image();
        image.src = event.target.result;
        image.onload = function () {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
  
          // Set the canvas dimensions to match the original image
          canvas.width = image.width;
          canvas.height = image.height;
  
          // Preserve image quality during resizing
          context.imageSmoothingEnabled = true;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
  
          // Define desired sizes for resizing
          const sizes = [
            { width: image.width * 0.5, height: image.height * 0.5 },
            { width: image.width, height: image.height },
            { width: image.width * 2, height: image.height * 2 },
          ];
  
          // Create a ZIP file using JSZip library
          const zip = new JSZip();
  
          sizes.forEach((size) => {
            const { width, height } = size;
  
            // Create a new canvas for resizing each image
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = width;
            resizedCanvas.height = height;
            const resizedContext = resizedCanvas.getContext('2d');
  
            // Perform the resizing without losing quality
            resizedContext.drawImage(canvas, 0, 0, width, height);
  
            // Convert the resized canvas image to a data URL
            const resizedDataUrl = resizedCanvas.toDataURL('image/jpeg', 1.0);
  
            // Add the resized image to the ZIP file
            zip.file(
              `resized_${width}x${height}.jpg`,
              resizedDataUrl.substr(resizedDataUrl.indexOf(',') + 1),
              { base64: true }
            );
          });
  
          // Generate the ZIP file
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            // Create a download link for the ZIP file
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(content);
            downloadLink.download = 'resized_images.zip';
  
            // Trigger the download
            downloadLink.click();
          });
        };
      };
      fileReader.readAsDataURL(imageInput.files[0]);
    } else {
      alert('Please add an image');
    }
  }

  window.addEventListener('DOMContentLoaded', function() {
    // Adjust the height of the background to match the document height
    var backgroundElement = document.querySelector('.background');
    backgroundElement.style.height = document.documentElement.scrollHeight + 'px';
  });