import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

const upload = async (file) => {
    const date = new Date();
    const storageRef = ref(storage, `images/${date.getTime()}-${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error("Upload failed:", error.message);
                reject(new Error(`Something went wrong! ${error.code}: ${error.message}`));
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        console.log("File available at", downloadURL);
                        resolve(downloadURL);
                    })
                    .catch((error) => {
                        console.error("Failed to get download URL:", error.message);
                        reject(new Error(`Failed to get download URL: ${error.message}`));
                    });
            }
        );
    });
};

export default upload;
