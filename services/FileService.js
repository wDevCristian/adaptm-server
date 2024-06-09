import * as uuid from "uuid";
import * as path from "path";
import * as fs from "fs";

class FileService {
  /**
   * Saves a picture to the specified directory.
   *
   * @param {object} picture - The uploaded picture object.
   * @param {string} type - The type of picture (e.g., 'users', 'events').
   * @returns {string} The name of the saved picture file.
   * @throws Will throw an error if there is a problem saving the picture.
   */
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

  /**
   * Deletes a picture file from the specified directory.
   *
   * @param {string} fileName - The name of the picture file to be deleted.
   * @param {string} type - The type of picture (e.g., 'users', 'events').
   * @returns {void}
   * @throws Will throw an error if there is a problem deleting the picture file.
   */
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
