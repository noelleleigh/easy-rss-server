require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const express = require("express");
const mime = require("mime");
const RSS = require("rss");

const escape = require("./escape");

const app = express();
app.set("json spaces", 2);

const STATIC_PATH = "/data";
const DATA_DIR = path.join(__dirname, ".data");
app.use(STATIC_PATH, express.static(DATA_DIR));

const makeStaticURL = (fileName) => {
  return path.posix.join(STATIC_PATH, encodeURIComponent(fileName));
};

const getFileDetails = async () => {
  const fileNames = await fsPromises.readdir(DATA_DIR);
  const fileObjects = await Promise.all(
    fileNames.map(async (name) => {
      const filePath = path.join(DATA_DIR, name);
      const handle = await fsPromises.open(filePath);
      const stats = await handle.stat();
      await handle.close();
      return {
        id: stats.ino,
        name: name,
        url: makeStaticURL(name),
        size_in_bytes: stats.size,
        mime_type: mime.getType(name),
        date_published: new Date(stats.mtimeMs),
      };
    })
  );
  return fileObjects.sort(
    (a, b) => b.date_published.getTime() - a.date_published.getTime()
  );
};

const makeJsonFeed = (title, feedUrl, homePageUrl, description, items) => {
  const feed = {
    version: "https://jsonfeed.org/version/1",
    title: title,
    feed_url: feedUrl,
    home_page_url: homePageUrl,
    description: description,
    items: items.map((item) => {
      const itemUrl = new URL(item.url, homePageUrl);
      return {
        id: item.id,
        url: itemUrl,
        title: item.name,
        content_text: `A file named ${item.name}.`,
        date_published: item.date_published,
        attachments: [
          {
            url: itemUrl,
            mime_type: item.mime_type,
            title: item.name,
            size_in_bytes: item.size_in_bytes,
          },
        ],
      };
    }),
  };
  return feed;
};

const makeRssFeed = (title, feedUrl, siteUrl, description, items) => {
  const feed = new RSS({
    title: title,
    feed_url: feedUrl,
    site_url: siteUrl,
    description: description,
    custom_namespaces: {
      itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
    },
  });
  for (const item of items) {
    const itemUrl = new URL(item.url, homePageUrl);
    feed.item({
      title: item.name,
      description: `A file named ${item.name}.`,
      url: itemUrl,
      guid: item.id,
      date: item.date_published,
      enclosure: {
        url: itemUrl,
        size: item.size_in_bytes,
        type: item.mime_type,
      },
    });
  }
  return feed;
};

app.get("/", async (request, response) => {
  // List the files in .data
  const fileObjects = await getFileDetails();
  const listElements = fileObjects.map(
    (file) =>
      `<li><a href="${file.url}">${escape(
        file.name
      )}</a> (${file.date_published.toISOString()})</li>`
  );
  response.send(`<ul>${listElements.join("\n")}</ul>`);
});

app.get("/json", async (request, response) => {
  try {
    const fileObjects = await getFileDetails();
    const host = `${request.protocol}://${request.headers.host}`;
    const feed = makeJsonFeed(
      "My cool stuff",
      `${host}/json`,
      host,
      "My cool feed",
      fileObjects
    );
    response.json(feed);
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
});

app.get("/rss", async (request, response) => {
  try {
    const fileObjects = await getFileDetails();
    const host = `${request.protocol}://${request.headers.host}`;
    const feed = makeRssFeed(
      "My cool stuff",
      `${host}/rss`,
      host,
      "My cool feed",
      fileObjects
    );
    response.type("application/rss+xml").send(feed.xml("  "));
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
  }
});

const IS_DEV = process.env.NODE_ENV === "development";
const HOST = IS_DEV ? "localhost" : undefined;
const PORT = IS_DEV ? process.env.PORT_DEV : process.env.PORT;

const listener = app.listen(PORT, HOST, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
