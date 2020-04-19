const feed = {
  version: "https://jsonfeed.org/version/1",
  title: "easy-rss-feed",
  home_page_url: "https://easy-rss-feed.glitch.com",
  feed_url: "https://easy-rss-feed.glitch.com/feed",
  description: "A feed for easily sharing audio.",
  items: [
    {
      id: "abc",
      url: "https://easy-rss-feed.glitch.com/data/abc",
      title: "A song",
      content_text: "A song that you can listen to",
      summary: "A song that you can listen to",
      date_published: "2010-02-07T14:04:00-05:00",
      attachments: [
        {
          url: "https://easy-rss-feed.glitch.com/data/abc",
          mime_type: "audio/mpeg",
          title: "A song",
          size_in_bytes: 1234,
          duration_in_seconds: 900,
        },
      ],
    },
  ],
};
