# Rebellion Test Backender

## Steps to run and test the code

1. `git clone git@github.com:marcosantar93/cloudinary-microservice.git`
2. `cd cloudinary-microservice && npm install`
3. Add file `config/cloudinary.js` with your configuration, it should have the following format:
```
module.exports = {
  cloud_name: "[your_cloud_name]",
  api_key: "[your_api_key]",
  api_secret: "[your_api_secret]",
}
```
4. `npm start`
5. Open Postman or a web browser and send GET requests to `localhost:3000/cloudinary/statistics` and `localhost:3000/cloudinary/csv`

## Description
We would like to start to use Cloudinary to save some public photos, but we are afraid about the use some people could do of this platform.

We need a Microservice with 2 calls made with Node.js.

## Get some statistics
Sample URL: `SOME_URL/cloudinary/statistics`

Showing the info (sample):

```

{
totalImages: 1000,
formats: {
jpg: 23,
png: 300,
svg: 677
},
biggestPicture: 'https://res.cloudinary.com/dbnuvqzms/image/upload/v1580932194/wallhdpic_20_fsou0u.jpg',
smallestPicutre: 'https://res.cloudinary.com/dbnuvqzms/image/upload/v1580932187/wallhdpic_1_gwkxuu.jpg',
avgSize: 3002
}

```

## Get a csv
Sample URL: `SOME_URL/cloudinary/csv`

Returns a CSV file with a list of All images hosted in Cloudinary (sample):

```

public_id,folder,filename,format,version,resource_type,type,created_at,uploaded_at,bytes,backup_bytes,width,height,aspect_ratio,pixels,url,secure_url,status,access_mode,access_control,etag,created_by/0,uploaded_by/0
wallhdpic_1_gwkxuu,,wallhdpic_1_gwkxuu,jpg,1580932187,image,upload,2020-02-05T19:49:47+00:00,2020-02-05T19:49:47+00:00,467357,0,1920,1080,1.77778,2073600,http://res.cloudinary.com/dbnuvqzms/image/upload/v1580932187/wallhdpic_1_gwkxuu.jpg,https://res.cloudinary.com/dbnuvqzms/image/upload/v1580932187/wallhdpic_1_gwkxuu.jpg,active,public,,cfd15df0cbe6bfebe8bfd6abd596e75e,,

```
