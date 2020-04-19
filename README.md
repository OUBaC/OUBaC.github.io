# Oxford University Badminton Club Website

This is the source for the Oxford University Badminton Club website. It is built with Jekyll and hosted using Github pages.

## Structure

Much of the structure is determined by Jekyll.

- `_data` contains data files. In particular, it contains the Varsity scores, the scores and winners of cuppers and a file containing the contact information of the president which is used throughout the website.
- `_includes` contains files which are included in other files such as the navigation elements.
- `_layouts` contains the layouts. Note that `layout.html` is separate from `default.html` as `layout.html` is used `index.html`.
- `_posts` contains posts which go on the `Latest News' blog.
- `_sass` contains snippets of CSS/SASS which are used as includes.
- `archive` contains the webpages for the old committees and the old cuppers scores.
- `assets` contains the images and documents found on the website. Files are generally stores in folders relating to the webpage where they can be found.
  - `assets/colleges` contains SVG images of the college logos.
  - `assets/documents` contains the club's compliance documents.
  - `assets/logo` contains various copies of the logo. Not all of these are used on the website but it is a convenient place to store the files.
- `latest-news` contains the blog when generated. The blog posts will automatically be split into pages of 5.
- `styles` contains ths CSS/SASS for the website. `stylesheet.scss` is included on every page and contains general styles, most other files are named after the webpage which uses them.

## Updating the website
The website has many things which occasionally need updating.

### Frequently
- Session times and the locations available on the map in [`sessions.html`](sessions.html). 
- List of college captains in [`college-captains`](college-captatins.html)
- Cuppers draw in [`cuppers.html`](cuppers.html)

### Yearly or less
- The current committee.
- Sponsors in [`the-club.html`](the-club.html)
- Cuppers 'Hall of Fame' in [`cuppers.html`](cuppers.html)
- Current prices in [`clubnight.html`](clubnight.html)
- Leagues the teams play in and the links to the current standings in [`squad.html`](squad.html)

### Updating the committee.
Each committee is a data file in the `_data/committee` folder. The files should be named `{{year}}.yml` where `{{year}}` is the year the committee took over. So the `2019.yml` contains the committee for the 2019 - 2020 committee. 

1. Create a new committee file and add the committee data. Old files should be left in place as they can be found in the archive.
2. Edit the file `variables.yml` with the details of the President and the IT Officer.
