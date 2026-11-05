# 東京・富士山 五日秋旅 2026

Independent public travel guide in Cantonese. Static HTML, CSS and JavaScript; no tracking, accounts or private booking information. All times are Japan Standard Time. Hotels, rental cars and flights are unconfirmed planning references.

## Update

Edit `trip-data.json`, then run `node build.mjs` to regenerate `index.html`. Map labels must be updated together with itinerary point numbers. Increment the cache version in `sw.js` whenever published files change. GitHub Actions validates and deploys the static site from the `main` branch using `.github/workflows/pages.yml`. Only website assets enter the Pages artifact. All paths are relative for project-site hosting.

## Offline

After all assets have cached, the page displays a ready message. Offline coverage is the guide, photos and five static maps. External Google Maps navigation, live traffic and hotel booking links require a connection. Browser storage may be evicted. Checklist state is device-local.

## Credits

Photos from Wikimedia Commons, CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/), resized and cropped in the layout; derivative image presentation shares the same license:

- Alpsdake: https://commons.wikimedia.org/wiki/File:Mount_Fuji_from_Oishi_Park.jpg
- Landry Miguel: https://commons.wikimedia.org/wiki/File:Shibuya_Crossing.jpg
- Daniel M. Dobkin: https://commons.wikimedia.org/wiki/File:The_Great_Buddha_at_Kamakura.jpg

Static maps: © OpenStreetMap contributors, https://www.openstreetmap.org/copyright . Dashed lines show stop order, not roads or navigation. Hotel points are provisional area references.

No affiliation with hotels, transport providers, or photographers.
