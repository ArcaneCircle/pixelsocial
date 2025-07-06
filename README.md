# PixelSocial

A small micro-blogging social network app with PixelArt aesthetics
and integrated filter to pixelate shared images.

Thanks to the [webxdc](https://webxdc.org) technology, it means
there is no login or registration needed, nor dependency on any
server, and you can have your very own independent instance of the
social network in a group chat with friends and family, your data
staying in your devices and e2e encrypted if you use it inside
Delta Chat.

It can also be wired with bots that allow importing RSS feeds
inside the network (including RSS feeds of Mastodon accounts!)
for example see: https://github.com/deltachat-bot/pixelsocial

## Contributing

### Installing Dependencies

After cloning this repo, install dependencies:

```
pnpm i
```

### Checking code format

```
pnpm check
```

### Testing the app in the browser

To test your work in your browser (with hot reloading!) while developing:

```
pnpm start
```

### Building

To package the WebXDC file:

```
pnpm build
```

To package the WebXDC with developer tools inside to debug in Delta Chat, set the `NODE_ENV`
environment variable to "debug":

```
NODE_ENV=debug pnpm build
```

The resulting optimized `.xdc` file is saved in `dist-xdc/` folder.

### Releasing

To automatically build and create a new GitHub release with the `.xdc` file:

```
git tag -a v1.0.1
git push origin v1.0.1
```

### Credits

- Pixelated fonts: [Jersey](https://fontsource.org/fonts/jersey-10) and [Unixel](https://github.com/MDarvishi5124/Unixel)
- UI Icons: [Pixelarticons](https://github.com/halfmage/pixelarticons)
- Image pixelation filter: [Pixel It](https://github.com/giventofly/pixelit)
- Color palette inspired by [Mastdon](https://github.com/mastodon/mastodon) web UI