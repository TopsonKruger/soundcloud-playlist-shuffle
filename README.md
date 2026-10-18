# soundcloud-playlist-shuffle
Browser extension that permanently shuffles the track order of your SoundCloud playlists with one click.
Playlist Shuffle for SoundCloud adds a "Shuffle playlist" button to SoundCloud playlist pages. One click randomizes the actual order of the tracks in your playlist and saves it to your account. This is different from the built-in shuffle in the player, which only changes playback order.

How to use:
1. Log in to SoundCloud and open one of your own playlists.
2. Click the orange "Shuffle playlist" button in the bottom-right corner.
3. The page reloads with your tracks in a new random order.

Notes:
- Works only with playlists you own.
- The change is permanent. If you want to keep your current order, duplicate the playlist first.
- Everything runs locally in your browser. The extension does not collect, store, or send any data to third parties.

This extension is not affiliated with, endorsed by, or sponsored by SoundCloud. SoundCloud is a trademark of its respective owner.
## Installation

### Option 1: From the Chrome Web Store
Coming soon.

### Option 2: Manual install (Chrome, Edge, Brave, Opera, other Chromium browsers)

1. Download this repository: click Code → Download ZIP, then unzip it.
   (Or run: git clone https://github.com/YOUR_USERNAME/soundcloud-playlist-shuffle.git)
2. Open the extensions page:
   - Chrome: chrome://extensions
   - Edge: edge://extensions
   - Brave: brave://extensions
3. Turn on Developer mode (toggle in the top-right corner).
4. Click Load unpacked and select the folder that contains manifest.json.
5. Open soundcloud.com and log in.

## Usage

1. Open one of your own playlists (the URL looks like soundcloud.com/your-name/sets/playlist-name).
2. Click the orange "Shuffle playlist" button in the bottom-right corner.
3. Wait a second. The page reloads with the tracks in a new random order.

## Troubleshooting

- "Couldn't get keys" error: refresh the page, click around the site for a few seconds, and try again.
- Error 403 / nothing happens: make sure the playlist is yours (you can't edit other people's playlists), and that you're logged in.
- After updating the extension files: click the reload icon on the extensions page, then hard-refresh SoundCloud (Ctrl+Shift+R).
- Requires Chromium 111 or newer.

## Note

The shuffle is permanent. If you want to keep your current track order, duplicate the playlist first.
Created by claude Sonnet 5.5
