# Versioning Guide

This project uses **Semantic Versioning** (SemVer) for releases. All versions follow the format `MAJOR.MINOR.PATCH`, prefixed with `v` when creating git tags (e.g., `v1.2.3`).

## Understanding Version Numbers

- **MAJOR**: Breaking changes that are incompatible with previous versions. Increment when you make incompatible API changes.
- **MINOR**: New features added in a backward-compatible manner. Increment when you add functionality in a backward-compatible way.
- **PATCH**: Bug fixes and other backward-compatible changes. Increment when you fix bugs or make improvements that don't affect the API.

### Examples

- `v0.1.0` → `v0.2.0`: Added new feature (MINOR bump)
- `v0.2.0` → `v0.2.1`: Fixed a bug (PATCH bump)
- `v0.2.1` → `v1.0.0`: Breaking changes (MAJOR bump)

## How to Release a New Version

### Step 1: Commit All Changes

Make sure all your changes are committed:

```bash
git add .
git commit -m "Your commit message describing the changes"
```

### Step 2: Determine the Version Type

Decide whether you're making a MAJOR, MINOR, or PATCH release based on the changes you've made.

### Step 3: Use npm version to Create a Tag

The `npm version` command automatically:

- Updates the version in `package.json`
- Creates a git tag with the version
- Creates a commit for the version bump

Run one of the following commands:

**For a PATCH release** (e.g., 0.1.0 → 0.1.1):

```bash
npm version patch
```

**For a MINOR release** (e.g., 0.1.0 → 0.2.0):

```bash
npm version minor
```

**For a MAJOR release** (e.g., 0.1.0 → 1.0.0):

```bash
npm version major
```

### Step 4: Push to GitHub

Push both the commits and the git tags:

```bash
git push origin main
git push origin --tags
```

Or push everything at once:

```bash
git push origin main --follow-tags
```

## Workflow Summary

1. **Make Changes**: Edit code, fix bugs, or add features
2. **Commit**: `git commit -m "description"`
3. **Release**: `npm version [patch|minor|major]`
4. **Push**: `git push origin main --follow-tags`
5. **Verify**: Check GitHub → Releases/Tags to see your new release

## Current Version

The current version is defined in `package.json` and is currently `0.1.0`.

## Viewing Tags

To see all existing tags locally:

```bash
git tag
```

To see all tags on GitHub, visit: https://github.com/GavrilenkoGeorgi/webgl-piece/releases
