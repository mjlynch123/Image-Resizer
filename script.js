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
    
            // Define desired sizes for resizing
            const sizes = [
            { width: 2560, height: 1080 },
            { width: 1280, height: 720 },
            { width: 640, height: 360 }
            ];
    
            // Create a ZIP file using JSZip library
            const zip = new JSZip();
    
            sizes.forEach((size) => {
            const { width, height } = size;
    
            // Resize the image
            canvas.width = width;
            canvas.height = height;
            context.drawImage(image, 0, 0, width, height);
    
            // Convert the canvas image to a data URL
            const resizedDataUrl = canvas.toDataURL('image/jpeg');
    
            // Add the resized image to the ZIP file
            zip.file(`resized_${width}x${height}.jpg`, resizedDataUrl.substr(resizedDataUrl.indexOf(',') + 1), { base64: true });
            });
    
            // Generate the ZIP file
            zip.generateAsync({ type: 'blob' }).then(function (content) {
            // Create a download link for the ZIP file
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(content);
            downloadLink.download = 'resized_images.zip';
    
            // Trigger the download
            downloadLink.click();
            alert("Downloading...");
            });
        };
        };
        fileReader.readAsDataURL(imageInput.files[0]);
    }
}