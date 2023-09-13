const JSZip = require("jszip");
const fs = require("fs/promises");

exports.compressBinFirmware = async (file) => {
  if (!file) {
    // in case we do not get a file we return
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    const errResp =
      error.httpStatusCode === 400
        ? "Please upload a file"
        : "Some other error occurs";
    console.log(errResp);
  } else {
    const zip = new JSZip();
    const content = await fs.readFile(file.path);

    zip.file(file.path, content, { binary: !0 });
    const zipped = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
    const view = new Uint8Array(zipped);
    const mappedBin = [...view]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("");

    await fs.unlink(file.path);

    return mappedBin;
  }
};
