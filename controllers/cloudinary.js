const cloudinary = require("../service/cloudinary");
const stringify = require("csv-stringify");

const getStatistics = async (req, res) => {
  try {
    const cloudinaryResp = await cloudinary.getResources();
    const { resources } = cloudinaryResp;

    // check if array of resources returned is empty
    if (resources && resources.length) {
      const resourcesData = resources.reduce(
        (result, resource) => {
          result.formats[resource.format] = result.formats[resource.format]
            ? result.formats[resource.format] + 1
            : 1;
          // avgSize, smallest and biggest picture calculated with "bytes" field
          // instead of "pixels" because pixel number does not vary as much
          // and some filetypes may not even have this field
          if (result.minResource.bytes > resource.bytes)
            result.minResource = resource;
          if (result.maxResource.bytes < resource.bytes)
            result.maxResource = resource;
          result.totalSize += resource.bytes;
          return result;
        },
        {
          minResource: resources[0],
          maxResource: resources[0],
          totalSize: 0,
          formats: {}
        }
      );

      // bytes can not be fragmented, so it does not make much sense
      // leaving it with decimals
      const avgSize = Math.floor(resourcesData.totalSize / resources.length);

      res.json({
        totalImages: resources.length,
        formats: resourcesData.formats,
        biggestPicture: resourcesData.maxResource.secure_url,
        smallestPicutre: resourcesData.minResource.secure_url,
        avgSize: avgSize
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
  } catch (errorResp) {
    const { http_code, message } = errorResp.error;
    console.log("An error occurred: ", message);
    res.status(http_code).json(message);
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
      'attachment; filename="' + 'download-' + Date.now() + '.csv"'
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
  } catch (errorResp) {
    const { http_code, message } = errorResp.error;
    console.log("An error occurred: ", message);
    res.status(http_code).json(message);
  }
};

module.exports = {
  getStatistics,
  getCsv
};
