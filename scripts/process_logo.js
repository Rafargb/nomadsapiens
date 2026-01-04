const sharp = require('sharp');
const fs = require('fs');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
    console.error("Usage: node process_logo.js <input> <output>");
    process.exit(1);
}

// Function to process image
async function processImage() {
    try {
        console.log(`Processing ${inputPath}...`);

        // Load image
        const image = sharp(inputPath);

        // Get metadata to ensure we have data
        const metadata = await image.metadata();

        // Threshold strategy: 
        // Convert to raw buffer, iterate pixels, set alpha to 0 if dark.
        const { data, info } = await image
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixelArray = new Uint8ClampedArray(data);

        for (let i = 0; i < pixelArray.length; i += 4) {
            const r = pixelArray[i];
            const g = pixelArray[i + 1];
            const b = pixelArray[i + 2];

            // Check if dark (Threshold 100)
            if (r < 100 && g < 100 && b < 100) {
                pixelArray[i + 3] = 0; // Set Alpha to 0
            }
        }

        await sharp(pixelArray, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        })
            .png()
            .toFile(outputPath);

        console.log(`Success! Saved to ${outputPath}`);

    } catch (error) {
        console.error("Error processing image:", error);
        process.exit(1);
    }
}

processImage();
