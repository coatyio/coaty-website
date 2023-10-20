# Coaty Website with Jekyll

This project contains the sources of the [Coaty website](https://coaty.io)
hosted on GitHub Pages.

## Build and Deploy

The Coaty website uses [Jekyll](https://jekyllrb.com/) as a static site
generator. As a prerequisite install Jekyll on your local machine.

To build and serve the site while developing locally, use

```sh
jekyll serve --future
```

To build the site for production (content is deployed in `docs` folder), use

```sh
jekyll build
```

Note that future posts will **not** be included in the build.

To deploy the generated website to GitHub, commit all changes and push the git
project to the remote repository at `https://github.com/coatyio/coaty-website`
on the `master` branch. Then, the GitHub Pages website will be updated
automatically from the `docs` folder.

## Remarks

This project uses a custom Jekyll theme based on a customized version of a free
to use, open source Bootstrap themes created by
[Bootswatch](https://bootswatch.com/). The Bootswatch theme is not contained in
this project, it is bundled together with Bootstrap 4 into the
`_static/css/bootstrap.min.css` file. The custom Jekyll theme is defined in
`_static/css/main.css`.

This project is **not** a Jekyll project based on a Gemfile. Therefore, it
cannot be served with `bundle exec jekyll serve`.

To pin a certain news announcement to the top of the News page, add `pin: true`
to its header.

## License

Code and media contents copyright 2018 Siemens AG.

Code is licensed under the [MIT License](https://opensource.org/licenses/MIT).

Media contents are licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).
