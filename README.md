# AnimatedEngagementInvitation

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Invitation asset structure

Invitation assets live under `src/assets/engagement`:

```text
src/assets/engagement/
  images/
    couple-main.webp
    couple-secondary.webp
    floral-top.webp
    floral-bottom.webp
    whatsapp-thumbnail.png
  music/
    background-music.mp3
  decorative/
```

Keep invitation photos optimized for mobile sharing:

- Prefer WebP or AVIF, with JPEG fallback only when needed.
- Keep the main couple portrait near 250 KB or less when possible.
- Resize images to the largest display size the invitation needs before adding them under `src/assets/engagement/images`.
- Avoid background videos and oversized full-resolution camera originals.

## Personalizing the invitation

Update engagement details in `src/app/config/invitation.config.ts`. The reusable components read names, photos, date, time, venue, map link, messages, family names, theme colors, music settings, feature visibility, and editable UI labels from that single config object.

Replace image or audio files under `src/assets/engagement`, then update the matching paths in `invitation.config.ts`.

## WhatsApp link preview

The project includes a share thumbnail at `src/assets/engagement/images/whatsapp-thumbnail.png`.
The static Open Graph tags in `src/index.html` point to the IIS URL:

```text
http://192.168.1.34:8087/assets/engagement/images/whatsapp-thumbnail.png
```

If you publish the invitation under a different domain, IP, port, or HTTPS URL, update the `og:url`, `og:image`, `twitter:image`, and `image_src` values in `src/index.html`, then rebuild and redeploy.

For WhatsApp sharing outside your local Wi-Fi network, use a public URL whenever possible. A `192.168.x.x` address is private to your local network, so some recipients and preview crawlers may not be able to fetch the thumbnail.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
