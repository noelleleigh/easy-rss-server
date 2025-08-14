**Archived: [Moved to Sourcehut](https://git.sr.ht/~noelle/easy-rss-server)**

# easy-rss-server

Easily host static files from an RSS feed! Just upload them, and they're instantly available for download from an RSS feed that you can subscribe to in your podcast app.

## Setup

### Easy way

Remix on Glitch!

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/easy-rss-server)

### Manual way

If you want to run the server locally, you can install it from GitHub:

1. Clone the repository:

    ```bash
    git clone https://github.com/noelleleigh/easy-rss-server.git
    ```

2. Navigate to the folder:

    ```bash
    cd ./easy-rss-server
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Run the server

    ```bash
    $ node .\server.js
    Your app is listening on port 54775
    ```

## Usage

You can configure the app using a `.env` file. Here's a sample one with the defaults in place:

```ini
# The network port you want the server to run on locally
PORT=8000
```
