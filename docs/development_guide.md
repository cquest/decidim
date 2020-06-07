# Developing Decidim

## Create a development_app

In order to start developing you will need what is called a `development_app`. This is nearly the same as a new Decidim app (that you can create with `decidim app_name`) but with a Gemfile pre-configured for local development and some other small config modifications.
You need it in order to have a Rails application configured to lookup Decidim modules from your filesystem. This way changes in your modules will be directly observed by this `development_app`.

You can create a `development_app` from inside the project's root folder with the command:

```console
git clone https://github.com/decidim/decidim.git
cd decidim
bundle install
bundle exec rake development_app
cd development_app
```

A development_app/ entry appears in the .gitignore file, so you don't have to worry about commiting the development app by mistake.

On creation, this steps are automatically invoked by the generator:

- create a `config/database.yml`
- `bundle install`
- `bin/rails decidim:upgrade`
- `bin/rails db:migrate db:seed`

If the default database.yml does not suit your needs you can always configure it at your will and run this steps manually.

Once created you are ready to:

- `bin/rails s`

## Gitflow Branching model

The Decidim respository follows the Gitflow branching model. There are good documentations on it at:

- the original post: https://nvie.com/posts/a-successful-git-branching-model/
- provided by Atlassian: https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow.

This model introduces the `develop` branch as a kind of queue for new features to enter into the next release.

In summary, Decidim developers that work on `feature/...` or `fix/...` branches will branch off from `develop` and must be merged back into `develop`.

Then, to start a new feature branch off from `develop` in the following way:

```
git checkout develop
git checkout -b feature/xxx
```

Implement the feature, and open a Pull Request as normal, but against `develop` branch. As this is the most common operation, `develop` is the default branch instead of `master`.

## Git commit messages and Pull Request titles

We recommend following [this guide](https://chris.beams.io/posts/git-commit/) for making good git commit messages. It also applies to Pull Request titles. The summary is:

1.  Separate subject from body with a blank line
1.  Limit the subject line to 50 characters
1.  Capitalize the subject line
1.  Do not end the subject line with a period
1.  Use the imperative mood in the subject line
1.  Wrap the body at 72 characters
1.  Use the body to explain what and why vs. how

## During development

When creating new migrations in Decidim's modules, you will need to "apply" this migrations to your development_app. The way to do this is by copying the migration from your module into the db/migrate dir of your development_app. Luckily we already have a script that automates this: it copies all missing migrations in development_app/db/migrate. The command is:

```console
bin/rails decidim:upgrade
```

Anyway we recommend re-creating your development_app every once in a while.

## Useful commands

### erb-lint

We use erblint gem to ensure homogeneous formatting of erb files.

```console
bundle exec erblint --lint-all --autocorrect
# shortest
bundle exec erblint --lint-all -a
# even shortest
bundle exec erblint -la -a
```

### I18n

We use i18n-tasks gem to keep translations ordered and without missing/unused keys.

```console
# from the root of the project
bundle exec i18n-tasks normalize --locales en
```

### JavaScript linter

[eslint](https://eslint.org/docs/user-guide/command-line-interface) and [tslint](https://palantir.github.io/tslint/) are used to ensure homogeneous formatting of JavaScript code.

To lint and try to fix linting errors, run:

```console
npm run lint --fix
```

### Stylelinter

[stylelint](https://stylelint.io/) is a CSS linter and fixer that helps to avoid errors and enforce consistent conventions in the stylesheets. Is an npm package, install it using:

```console
npm install -g stylelint
```

Linting a `.scss` file:

```console
stylelint [path-to-file]
```

With `--fix` option [stylelint](https://stylelint.io/user-guide/cli/#autofixing-errors) will fix as many errors as possible. The fixes are made to the actual source files. All unfixed errors will be reported.

```console
stylelint [path-to-file] --fix
```

### Rubocop

RuboCop is a code analyzer tool we use at Decidim to enforce our code formatting guidelines.

```console
# Run Rubocop
bundle exec rubocop
# Run Rubocop and automatically correct offenses
bundle exec rubocop -a
```

### Markdown linter

This project uses [markdownlint](https://github.com/markdownlint/markdownlint) to check markdown files and flag style issues.

## Good to know

- There is an application with current designs at: https://decidim-design.herokuapp.com/

## Testing

Refer to the [testing](advanced/testing.md) guide.

## Releasing new versions

In order to release new version you need to be owner of all the gems at RubyGems, ask one of the owners to add you before releasing. (Try `gem owners decidim`).

Remember to follow the Gitflow branching workflow.

### Create the release branch

1. Go to develop with `git checkout develop`
1. Create the release branch `git checkout -b release/x.y.z && git push origin release/x.y.z`, where release/x.y.z is the Gitflow release branch for this version.
1. Add the release branch to Crowdin so that any pending translations will generate a PR to this branch.

Mark `develop` as the reference to the next release:

1. Go back to develop with `git checkout develop`
1. Turn develop into the `dev` branch for the next release:
    1. Update `.decidim-version` to the new `dev` development version: `x.y.z.dev`
    1. Run `bin/rake update_versions`, this will update all references to the new version.
    1. Run `bin/rake bundle`, this will update all the `Gemfile.lock` files
    1. Run `bin/rake webpack`, this will update the JavaScript bundle.
1. Update `SECURITY.md` and change the supported version to the new version.
1. Update the `CHANGELOG.MD`. At the top you should have an `Unreleased` header with the `Added`, `Changed`, `Fixed` and `Removed` empty sections. After that, the header with the current version and link with the same beforementioned sections and a `Previous versions` header at the bottom that links to the previous minor release stable branch.

  ```markdown
  ## [Unreleased](https://github.com/decidim/decidim/tree/HEAD)

  ### Added

  ### Changed

  ### Fixed

  ### Removed

  ## [v0.XX.0](https://github.com/decidim/decidim/releases/tag/v0.XX.0)

  ### Added
  ...

  ## Previous versions

  Please check [0.XX-stable](https://github.com/decidim/decidim/blob/0.XX-stable/CHANGELOG.md) for previous changes.
  ```

1. Push the changes `git add . && git commit -m "Bump develop to next release version" && git push origin develop`

### Release Candidates

Release Candidates are the same as beta versions. They should be ready to go to production, but publicly released just before in order to be widely tested.

If this is a **Release Candidate version** release, the steps to follow are:

1. Go to the release branch `git checkout release/x.y.z`.
1. Update `.decidim-version` to the new version `x.y.z.rc1`
1. Run `bin/rake update_versions`, this will update all references to the new version.
1. Run `bin/rake bundle`, this will update all the `Gemfile.lock` files
1. Run `bin/rake webpack`, this will update the JavaScript bundle.
1. Commit all the changes: `git add . && git commit -m "Bump to rcXX version" && git push origin release/x.y.z`.
1. Follow the link resulting from the previous command to create the PR for the new version.
1. Usually, at this point, a deploy to meta-decidim is done during, at least, one week to validate the stability of the version.

#### During the validation period

1. During the validation period bugfixes will go directly to the current `release/x.y.z` branch and ported to `develop`.
1. During the validation period, translations to the officially supported languages must be added to Crowdin and when done, merged into `release/x.y.z`.

#### Major/Minor versions

Once Release Candidates have been tested, merging into `master` after the validation period can be done.

1. Go to the release branch `git checkout release/x.y.z`.
1. Update `.decidim-version` by removing the `.rcN` suffix, leaving a clean version number like `x.y.z`
1. Run `bin/rake update_versions`, this will update all references to the new version.
1. Run `bin/rake bundle`, this will update all the `Gemfile.lock` files
1. Run `bin/rake webpack`, this will update the JavaScript bundle.
1. Commit all the changes: `git add . && git commit -m "Bump to v0.XX.0 final version" && git push origin release/x.y.z`.
1. Follow the link resulting from the previous command to create the PR for the new version, but still don't merge it. The base for the PR should be `master`.
1. Before merging the PR to upgrade `master`, create the stable branch for the previous vesion. So, if this is the release of v0.22.0, branch `0.21-stable` from `master`. These stable branches will be able to receive bugfixes, backports and will be the origin of patch releases for older releases.
1. Merge the PR to `master` and remove `release/x.y.z` branch.
1. Run `git checkout master && bin/rake release_all`, this will create all the tags, push the commits and tags and release the gems to RubyGems.
1. Once all the gems are published you should create a new release at this repository, just go to the [releases page](https://github.com/decidim/decidim/releases) and create a new one.
1. Update Decidim's Docker repository as explained in the Docker images section.
1. Update Crowdin synchronization configuration with Github:
    1. Add the new `x.y-stable` branch.
    1. Remove from Crowdin branches that are not officially supported anymore. That way they don't synchronize with Github.

#### Releasing patch versions

Releasing new versions from an ***x.y-stable*** branch is quite easy. The process is very similar from releasing a new Decidim version:

1. Checkout the branch you want to release: `git checkout -b VERSION-stable`
1. Update `.decidim-version` to the new version number.
1. Run `bin/rake update_versions`, this will update all references to the new version.
1. Run `bin/rake bundle`, this will update all the `Gemfile.lock` files
1. Run `bin/rake webpack`, this will update the JavaScript bundle.
1. Update `CHANGELOG.MD`. At the top you should have an `Unreleased` header with the `Added`, `Changed`, `Fixed` and `Removed` empty sections. After that, the header with the current version and link like `## [0.20.0](https://github.com/decidim/decidim/tree/v0.20.0)` and again the headers for the `Added`, `Changed`, `Fixed` and `Removed` sections.
1. Commit all the changes: `git add . && git commit -m "Prepare VERSION release"`
1. Run `bin/rake release_all`, this will create all the tags, push the commits and tags and release the gems to RubyGems.
1. Once all the gems are published you should create a new release at this repository, just go to the [releases page](https://github.com/decidim/decidim/releases) and create a new one.
1. Update Decidim's Docker repository as explained in the Docker images section.

#### Docker images for each release

1. After each release, you should update our [Docker repository](https://github.com/decidim/docker) so new images are build for the new release. To do it, just update `DECIDIM_VERSION` at [circle.yml](https://github.com/decidim/docker/blob/master/circle.yml).