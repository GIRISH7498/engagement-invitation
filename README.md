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

## Changing Themes

Theme presets are configured in `src/app/config/invitation.config.ts` under `theme.presets`.
Change `theme.activeThemeId` to one of these values, then rebuild:

- `champagneRose`
- `royalWineGold`
- `lotusBlush`
- `mehendiEmerald`

Each preset controls the invitation colors through `primaryColor`, `secondaryColor`, `backgroundColor`, and `accentColor`.

## WhatsApp link preview

The project includes a share thumbnail at `src/assets/engagement/images/whatsapp-thumbnail.png`.
WhatsApp preview text is configured in `src/app/config/invitation.config.ts` under the `share` section.

Supported share text tokens include `{groomName}`, `{brideName}`, `{coupleDisplayName}`, `{eventDate}`, `{eventTime}`, `{venueName}`, and `{venueAddress}`.

The `npm run build` command updates the static Open Graph tags in `src/index.html` before Angular builds. You can also run `npm run update-share-meta` manually after changing share content.

WhatsApp always displays the domain/link row inside its preview card. The website can control the preview title, description, and thumbnail, but it cannot remove that domain row. If WhatsApp keeps showing an old preview after deployment, change the share URL slightly, such as `https://engagement-invitation-ew4.pages.dev/?v=2`, or wait for the cache to refresh.

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
