<picture>
  <source media="(prefers-color-scheme: light)" srcset=".github/readme/banner-light.svg">
  <img src=".github/readme/banner-dark.svg" alt="Handy Player — A phone in pure CSS 3D that plays music" width="100%">
</picture>

<p>
  <a href="https://adm1nsys.github.io/handy-player/"><img alt="Live demo" src="https://img.shields.io/badge/Live_demo-070707?style=for-the-badge&logo=safari&logoColor=white"></a>
  <img alt="CSS 3D" src="https://img.shields.io/badge/CSS_3D-070707?style=for-the-badge&logo=css&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-070707?style=for-the-badge&logo=javascript&logoColor=white">
  <a href="LICENSE"><img alt="License MIT" src="https://img.shields.io/badge/License-MIT-070707?style=for-the-badge"></a>
</p>

A smartphone built from pure CSS 3D — about 370 hand-positioned elements and no 3D library — with a working music player on its screen. Made in July 2023.

![Handy Player: a CSS-3D phone playing a track](assets/readme/preview.jpg)

## What's inside

- **The phone** — body, frame, buttons, triple camera, front camera cutout and a second screen on the back, every part a `div` placed with `preserve-3d` transforms ([`src/phone.js`](src/phone.js)).
- **The player** — artwork, title and artist, progress and volume, play / previous / next, a lock-screen clock; the power and volume buttons on the side work too.
- **Rotation** — sliders for both axes, quick views (front, back, side) and drag with mouse or finger.
- **Music** — 30-second previews from Apple Music; each track links back to Apple Music.

## History

The phone was part of my former Admin Store website (2023). This repository moves it out of that site's old asset repository into a project of its own. [`src/phone.js`](src/phone.js) is kept as written — the first commit is the untouched 2023 version — and the 2026 changes are marked in the code:

- new branding: the HR monogram and “Designed by Heorhii Romanenko” on the back;
- the page around it: rotation controls, playlist, German / English switch; since November 2026 with the header and footer of my other project sites.

Run locally with any static server, for example `python3 -m http.server`.

## License

Code under [MIT](LICENSE) © Heorhii Romanenko. The song previews and artwork are streamed from Apple Music and remain the property of their rights holders.
