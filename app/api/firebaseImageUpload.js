import uuid from "react-native-uuid";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

async function firebaseUpload(uri) {
  const imgSize = await getImgSize(uri);
  let img = uri;
  if (imgSize > 300000) {
    img = await compressImage(uri);
    img = img.uri;
  }
  let imageName = uuid.v4() + ".jpg";
  const storage = getStorage();
  const reference = ref(storage, imageName);

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log("error");
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", img, true);
    xhr.send(null);
  });

  let imageUrl;

  // God is good!
  await uploadBytes(reference, blob);
  await getDownloadURL(reference).then((x) => {
    imageUrl = x;
    console.log(imageUrl);
  });
  blob.close();
  return imageUrl;
}

async function getImgSize(uri) {
  let imgInfo = await FileSystem.getInfoAsync(uri);
  return imgInfo.size;
}

async function compressImage(uri) {
  let compressedImg = ImageManipulator.manipulateAsync(uri, [{ rotate: 360 }], {
    compress: 0.1,
    format: "jpeg",
  });
  return compressedImg;
}

export default firebaseUpload;
