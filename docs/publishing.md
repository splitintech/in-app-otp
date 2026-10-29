# Publishing

See [repository release setup](repository-release.md) before enabling publishing. Configure npm trusted publishing for repository `splitintech/in-app-otp` and workflow `in-app-otp-publish.yml` for the existing npm package. Preserve package names and publish a new version only when intended. No npm token is required.

From the standalone repository root, after tests, build and packed-consumer checks pass, create a signed tag matching the package version:

```bash
version=$(node -p "require('./package.json').version")
node scripts/assert-release-tag.mjs --tag "in-app-otp-v$version" --prefix in-app-otp-v --package package.json
git tag -s "in-app-otp-v$version" -m "in-app-otp $version"
git push origin "in-app-otp-v$version"
```

Do this only with a clean working tree and configured Git signing. The workflow requires `NPM_TRUSTED_PUBLISHING_ENABLED=true`, publishes with provenance, and skips versions already in the registry. Existing hub release tags remain historical references.
