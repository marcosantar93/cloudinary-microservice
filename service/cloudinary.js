const cloudinary = require("cloudinary").v2;
const MAX_RESULTS = require("../constants").MAX_RESULTS;
const cloudinaryConfig = require("../config/cloudinary");

// cloudinary service configuration
cloudinary.config(cloudinaryConfig);

const getResources = async () => {
  const resources = [];
  let response;
  do {
    // getResources uses cloudinary search method as it shows
    // all the relevant information about each resource.
    // other api methods?
    response = await cloudinary.search
      .max_results(MAX_RESULTS)
      .next_cursor(response && response.next_cursor)
      .execute();
    // other array methods?
    resources.push(...response.resources);
    // the maximum amount of records returned may not include
    // all resources, so we repeat the search until there isn't
    // a next_cursor, meaning that we have reached the end of
    // the resources available
  } while (response.next_cursor);
  response.resources = resources;
  return response;
};

module.exports = {
  getResources
};
