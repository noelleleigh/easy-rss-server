// server.js
// where your node app starts

// init project
const fs = require("fs");
const url = require("url");
const path = require("path");
const express = require("express");
const app = express();
const RSS = require("rss");

app.use(express.static("public"));
app.set("json spaces", "  ");

// Return an array of asset objects for files that haven't been deleted
const parseGlitchAssets = async () => {
  const handle = await fs.promises.open(".glitch-assets");
  const contents = await handle.readFile({ encoding: "utf8" });
  const lines = contents.split("\n").filter(line => line.length);
  const records = lines.map(line => {
    try {
      return JSON.parse(line);
    } catch (err) {
      console.error(err);
      return {};
    }
  });
  const assets = new Map();
  // Iterate through the records to obtain the current set of assets
  for (const record of records) {
    if (record.deleted) {
      assets.delete(record.uuid);
    } else {
      assets.set(record.uuid, record);
    }
  }
  await handle.close();
  return assets;
};

// Make a feed item out of an asset.
const assetToFeedItem = asset => {
  const title = path.parse(asset.name).name
  return {
    title: title,
    description: `A file named ${title}`,
    url: asset.url,
    guid: asset.uuid,
    date: asset.date,
    enclosure: {
      url: asset.url,
      size: asset.size,
      type: asset.type
    },
    custom_elements: [
      {
        "itunes:image": {
          _attr: {
            href: asset.thumbnail
          }
        }
      }
    ]
  };
};

// Show the items in JSON format
app.get("/", async function(request, response) {
  parseGlitchAssets()
    .then(assets => {
      const responseArray = [...assets.values()].map(assetToFeedItem)
      response.json(responseArray)
    })
    .catch(err => {
      console.error(err);
      response.status(500).send(err);
    });
});

const makeURL = (req, pathname = req.path) => {
  return url.format({
    protocol: req.protocol,
    hostname: req.hostname,
    pathname: pathname
  });
};

const makeFeed = async request => {
  const feed = new RSS({
    title: "Noelle's Goodies",
    feed_url: makeURL(request),
    site_url: makeURL(request, ""),
    custom_namespaces: {
      itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd"
    }
  });

  const assets = await parseGlitchAssets();
  for (const asset of assets.values()) {
    feed.item(assetToFeedItem(asset));
  }
  return feed;
};

app.get("/feed", async function(request, response) {
  makeFeed(request)
    .then(feed => response.type("application/rss+xml").send(feed.xml("  ")))
    .catch(err => {
      console.error(err);
      response.status(500).send(err);
    });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
