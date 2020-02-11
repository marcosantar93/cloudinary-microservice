const cloudinary = require("../service/cloudinary");
const stringify = require("csv-stringify");

const getStatistics = (req, res) => {
  cloudinary.getResources(result => {
    const { resources, total_count } = result;
    const formats = {};
    let totalSize = 0;
    let minResource = resources[0];
    let maxResource = resources[0];

    for (let i = 0; i < resources.length; i++) {
      if (formats.hasOwnProperty(resources[i].format))
        formats[resources[i].format]++;
      else {
        formats[resources[i].format] = 1;
      }

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
    const avgSize = Math.floor(totalSize / total_count);

    res.json({
      totalImages: total_count,
      formats,
      biggestPicture: maxResource.secure_url,
      smallestPicutre: minResource.secure_url,
      avgSize
    });
  });
};

const getCsv = (req, res) => {
  cloudinary.getResources(result => {
    // adding appropriate headers, so browsers can start downloading
    // file as soon as this request starts to get served
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename='" + "download-" + Date.now() + ".csv'"
    );
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");

    // stringify returns a readable stream, that can be directly piped
    // to a writeable stream which is "res" (the response object from express.js)
    // since res is an abstraction over node http's response object which supports "streams"
    stringify(result.resources, { header: true }).pipe(res);
  });
};

module.exports = {
  getStatistics,
  getCsv
};
