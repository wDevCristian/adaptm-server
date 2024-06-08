import * as uuid from "uuid";
import * as path from "path";
import * as fs from "fs";

class FileService {
  static savePicture(picture, type) {
    try {
      const fileName = uuid.v4() + `.${picture.mimetype.split("/")[1]}`;
      const filePath = path.resolve(`./static/${type}`, fileName);

      console.log(fileName);
      console.log(filePath);

      picture.mv(filePath);

      return fileName;
    } catch (error) {
      console.log(error);
    }
  }

  static deletePicture(fileName, type) {
    try {
      const filePath = path.resolve(`./static/${type}`, fileName);

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(`File ${filePath} does not exist`);
        } else {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filePath}:`, err);
            } else {
              console.log(`File ${filePath} deleted successfully`);
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default FileService;
