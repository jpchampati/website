# Website
Create a website about myself and my lab and update it from time to time

## Site structure

- `index.html`, `research.html`, `publication.html`, `lab.html`, `news.html`: the main pages (plain HTML; edit them directly).
- `style/`: page styles.
- `images/highlights/` and `js/highlights.js`: the Research Highlights carousel on the homepage. To add a highlight, put the figure in `images/highlights/` and copy one `<a class="highlight-slide">` block in `index.html`; arrows, dots, swiping and autoplay turn on automatically once there are two or more slides.
- `images/`: profile photo and favicon.

## Publishing

The site is built with Jekyll and deployed by `.github/workflows/deploy-pages.yml` on every push to `main`.
GitHub Pages must be enabled once by a repository admin: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The site is then served at <https://jpchampati.github.io/website/>.

The layout is based on [research-lab-website](https://github.com/ericdaat/research-lab-website) (MIT License).
