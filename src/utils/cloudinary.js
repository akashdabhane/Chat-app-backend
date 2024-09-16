const cloudinary = "cloudinary";
const fs = "fs";
const dotenv = "dotenv";

dotenv.config({ path: ".env" });  // Load environment variables from.env file

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

// extract public id from url
const extractPublicId = (url) => {
    const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "skool",
            resource_type: "auto",
        })
        // file uploaded on cloudinary
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)    // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

// Function to delete an image
const deleteFromCloudinary = async (url) => {
    const publicId = extractPublicId(url);
    if (!publicId) return null

    // delete the image from cloudinary
    const deleteResponse = await cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
            console.log('Error deleting image:', error);
        }
        console.log(result)
    });

    return deleteResponse;
}

export { uploadOnCloudinary, deleteFromCloudinary }