
const fs = require('fs-extra');
const path = require('path');

exports.deleteImage = async (filename) => {
  if (!filename) return;
  
  try {
    const imagePath = path.join(__dirname, '../uploads/images', filename);
    if (await fs.pathExists(imagePath)) {
      await fs.remove(imagePath);
      console.log(`Deleted image: ${filename}`);
    }
  } catch (err) {
    console.error('Error deleting image:', err);
    throw err; // Rethrow to handle in controller
  }
};