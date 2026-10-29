# Link Cleaner

[한국어](README.ko.md)

A Chrome extension that removes tracking tails from links when you hit "Share" or "Copy link".

```
https://x.com/user/status/123?a=8fkf36ERdo&s=20   ->  https://x.com/user/status/123
https://youtu.be/dQw4w9WgXcQ?si=AbC123&t=42       ->  https://youtu.be/dQw4w9WgXcQ?t=42
```

## What it cleans

- **X / Twitter**: all query parameters on tweet and profile URLs (search URLs are left alone).
- **YouTube**: `si`, `feature`, `pp`. The timestamp `t=` and `list=` are kept.
- **Everywhere**: `utm_*`, `fbclid`, `gclid`, `igsh`, `igshid`, `msclkid`, `mc_cid`, and similar.
- **Also**: TikTok, Facebook, Instagram, Amazon tracking parameters.

## How it works

A content script runs in the page context and wraps:

- `navigator.clipboard.writeText` / `write` ("Copy link" buttons)
- `navigator.share` (system share sheet)
- the `copy` event (Ctrl+C, and `execCommand('copy')` on hidden inputs)

It needs no permissions and makes no network requests.

## Install

1. [Download the latest ZIP](https://github.com/sogogi445/link-cleaner/releases/latest/download/link-cleaner-v1.0.0.zip) and unzip it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the folder.

Requires Chrome 111 or later.

## Customize

Edit the `GLOBAL` and `BY_HOST` lists at the top of `clean.js`, then reload the extension.

## License

MIT
