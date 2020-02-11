const cloudinary = require("../service/cloudinary");
const stringify = require("csv-stringify");

const getStatistics = async (req, res) => {
  try {
    const cloudinaryResp = await cloudinary.getResources();
    const { resources } = cloudinaryResp;

    // check if array of resources returned is empty
    if (resources && resources.length) {
      const formats = {};
      let totalSize = 0;
      let minResource = resources[0];
      let maxResource = resources[0];

      for (let i = 0; i < resources.length; i++) {
        formats[resources[i].format] = formats[resources[i].format]
          ? formats[resources[i].format] + 1
          : 1;

        // avgSize, smallest and biggest picture calculated with "bytes" field
        // instead of "pixels" because pixel number does not vary as much
        // and some filetypes may not even have this field
        totalSize += resources[i].bytes;

        if (minResource.bytes > resources[i].bytes) {
          minResource = resources[i];
        }
        if (maxResource.bytes < resources[i].bytes) {
          maxResource = resources[i];
        }
      }

      // bytes can not be fragmented, so it does not make much sense
      // leaving it with decimals
      const avgSize = Math.floor(totalSize / resources.length);

      res.json({
        totalImages: resources.length,
        formats,
        biggestPicture: maxResource.secure_url,
        smallestPicutre: minResource.secure_url,
        avgSize
      });
    } else {
      res.json({
        totalImages: 0,
        formats: {},
        biggestPicture: "",
        smallestPicutre: "",
        avgSize: 0
      });
    }
  } catch (error) {
    console.log("An error ocurred", error);
    res.json(error);
  }
};

const getCsv = async (req, res) => {
  try {
    const cloudinaryResp = await cloudinary.getResources();
    
    // adding appropriate headers, so browsers can start downloading
    // file as soon as this request starts to get served
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename='" + "download-" + Date.now() + ".csv'"
    );
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");

    // an empty csv if there are not images may be confusing to the user
    const arrayToStringify = cloudinaryResp.resources.length
      ? cloudinaryResp.resources
      : [{ "CSV empty": "No resources found" }];

    // stringify returns a readable stream, that can be directly piped
    // to a writeable stream which is "res" (the response object from express.js)
    // since res is an abstraction over node http's response object which supports "streams"
    stringify(arrayToStringify, { header: true }).pipe(res);
  } catch (error) {
    console.log("An error ocurred", error);
    res.json(error);
  }
};

module.exports = {
  getStatistics,
  getCsv
};
