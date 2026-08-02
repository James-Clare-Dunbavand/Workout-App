const cloudinary = require("cloudinary");
const fs = require("fs");

const uploadImage = async (req, res) => {
    console.log(req.files);
    const fileName = req.files.image.name.split(".")[0];
    console.log(fileName);

    const result = await cloudinary.v2.uploader.upload(
        req.files.image.tempFilePath,
        {
            display_name: fileName,
            public_id: fileName,
            asset_folder: "workout-app-images",
        },
    );
    await fs.promises.unlink(req.files.image.tempFilePath);
    res.status(200).json({ image: { src: result.secure_url } });
};

module.exports = { uploadImage };
