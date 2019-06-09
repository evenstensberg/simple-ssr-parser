const fs = require("fs");
const path = require("path");
const libPath = path.resolve(__dirname, "posts");

module.exports = function() {
  let contents = [];

  const files = fs.readdirSync(libPath)
  files.forEach(file => {
      const metaData = path.parse(file);
      const fileData = {
        title: metaData.name,
        content: {},
        createdAt: null,
        author: null,
        tags: [],
        description: null
      };
      const filePath = path.resolve(libPath, file);

      const data = fs.readFileSync(filePath)
        const dataBuf = data.toString();
        const lookupStr = "# META";
        const startSlice = dataBuf.indexOf(lookupStr) + lookupStr.length;
        const endStr = "# ENDMETA";
        const endSlice = dataBuf.indexOf(endStr);

        const metaDataPart = dataBuf.slice(startSlice, endSlice);
        const postMetaData = metaDataPart
          .split("-")
          .filter(e => e !== "\n")
          .map(e => {
            const stripped = e.replace("\n", "").replace(" ", "");
            const dataKey = stripped.split(":");
            const key = dataKey[0];
            let val = null;
            if (key === "createdAt") {
              val = new Date(dataKey[1]);
            } else if (key === "author") {
              val = dataKey[1].trim(" ");
            } else if (key === "tags") {
              val = dataKey[1].split(",").map(e => e.trim(" "));
            } else if (key === "title") {
              val = dataKey[1].trim(" ");
            }

            return {
              [key]: val
            };
          });
        
        postMetaData.forEach(key => {
          const prop = Object.getOwnPropertyNames(key).pop();
          fileData[prop] = key[prop];
        });

        const descLookup = "# DESC";
        const startDescSlice = dataBuf.indexOf(descLookup) + descLookup.length;
        const endDescStr = "# ENDDESC";
        const endLookupSlice = dataBuf.indexOf(endDescStr);

        const descDataPart = dataBuf.slice(startDescSlice, endLookupSlice);
        fileData['description'] = descDataPart.trim("\n")
        
        
        postMetaData.forEach(key => {
          const prop = Object.getOwnPropertyNames(key).pop();
          fileData[prop] = key[prop];
        });

        const contentPart = dataBuf.slice(endLookupSlice + endDescStr.length);
        fileData['content'] = contentPart;
        contents.push(fileData);
      });
  return contents;
};