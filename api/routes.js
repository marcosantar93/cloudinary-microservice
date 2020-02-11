const cloudinaryCtrlr = require("../controllers/cloudinary");

module.exports = app => {
  app.route("/cloudinary/statistics").get(cloudinaryCtrlr.getStatistics);
  app.route("/cloudinary/csv").get(cloudinaryCtrlr.getCsv);
};
