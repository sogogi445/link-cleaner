# Link Cleaner

[한국어](README.ko.md)

A Chrome extension that removes tracking tails from links when you hit "Share" or "Copy link".

```
https://x.com/user/status/123?a=8fkf36ERdo&s=20   ->  https://x.com/user/status/123
https://youtu.be/dQw4w9WgXcQ?si=AbC123&t=42       ->  https://youtu.be/dQw4w9WgXcQ?t=42
https://www.instagram.com/p/ABC123/?igsh=MXx  ->  https://www.instagram.com/p/ABC123/
```

## What it cleans

- **X / Twitter**: all query parameters on tweet and profile URLs (search URLs are left alone).
- **YouTube**: `si`, `feature`, `pp`. The timestamp `t=` and `list=` are kept.
- **Everywhere**: `utm_*`, `fbclid`, `gclid`, `igsh`, `igshid`, `msclkid`, `mc_cid`, and similar.
- **AliExpress**: product pages (`/item/123.html`) lose everything after `?`, and the address bar is cleaned as soon as the page opens.
- **Instagram**: posts, reels, stories and profiles lose everything after `?` (except the carousel slide `img_index`), and the address bar is cleaned as soon as the page opens.
- **Also**: TikTok, Facebook, Amazon tracking parameters.

## How it works

A content script runs in the page context and wraps:

- `navigator.clipboard.writeText` / `write` ("Copy link" buttons)
- `navigator.share` (system share sheet)
- the `copy` event (Ctrl+C, and `execCommand('copy')` on hidden inputs)

## Copy the address bar

Copying from the address bar (Ctrl+C) is done by Chrome itself, so an extension cannot intercept it. Instead, press **Alt+C** (or click the toolbar icon) and the cleaned URL of the current tab is copied. A badge shows `OK` when done. Change the shortcut at `chrome://extensions/shortcuts`.

It makes no network requests. Permissions: `activeTab` and `scripting` (read the current tab's URL and copy to the clipboard when you press the shortcut), `clipboardWrite`.

## Install

1. [Download the latest ZIP](https://github.com/sogogi445/link-cleaner/releases/latest/download/link-cleaner-v1.2.0.zip) and unzip it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the folder.

Requires Chrome 111 or later.

## Customize

Edit the `GLOBAL` and `BY_HOST` lists at the top of `clean.js`, then reload the extension.

## License

MIT
