import fs from "fs";
import imageKit from "../configs/imagekit.js";

export const uploadImageOnImageKit = async (file, width = 512) => {
  const readStream = fs.createReadStream(file.path);
  const response = await imageKit.files.upload({
    file: readStream,
    fileName: file.originalname,
  });

  // URL with basic transformations
  const transformedUrl = imageKit.helper.buildSrc({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    src: response.filePath,
    transformation: [
      {
        width: width,
        quality: "auto",
        format: "webp",
      },
    ],
  });
  // Result: https://ik.imagekit.io/your_imagekit_id/path/to/image.jpg?tr=w-512,q-auto,f-webp

  return transformedUrl;
};

export default uploadImageOnImageKit;
