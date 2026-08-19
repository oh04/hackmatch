import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("uses standard Next.js and Netlify Identity", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("package.json", root), "utf8"),
  );

  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.match(packageJson.dependencies.next, /^16\./);
  assert.equal(packageJson.dependencies["@netlify/identity"], "1.2.0");
  assert.equal(packageJson.dependencies["@netlify/blobs"], "11.0.1");

  for (const removedPackage of [
    "@openai/sites-vite-plugin",
    "vinext",
    "wrangler",
    "@cloudflare/vite-plugin",
  ]) {
    assert.equal(packageJson.dependencies[removedPackage], undefined);
    assert.equal(packageJson.devDependencies[removedPackage], undefined);
  }
});

test("removes the previous platform authentication and hosting files", async () => {
  await assert.rejects(access(new URL("app/chatgpt-auth.ts", root)));
  await assert.rejects(access(new URL(".openai/hosting.json", root)));
  await assert.rejects(access(new URL("worker/index.ts", root)));
  await assert.rejects(access(new URL("vite.config.ts", root)));
});

test("includes email, password, recovery, and logout flows", async () => {
  const auth = await readFile(
    new URL("app/auth/use-netlify-auth.ts", root),
    "utf8",
  );

  assert.match(auth, /login\(email, password\)/);
  assert.match(auth, /signup\(email, password/);
  assert.match(auth, /requestPasswordRecovery\(email\)/);
  assert.match(auth, /updateUser\(\{ password \}\)/);
  assert.match(auth, /await logout\(\)/);
});

test("includes persistent profile settings and public photo uploads", async () => {
  const [page, panel, uploadRoute, photoRoute] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/profile/profile-panel.tsx", root), "utf8"),
    readFile(new URL("app/api/profile-photo/route.ts", root), "utf8"),
    readFile(new URL("app/api/profile-photo/[userId]/route.ts", root), "utf8"),
  ]);

  assert.match(page, /My public profile/);
  assert.match(page, /Personal settings/);
  assert.match(page, /<ProfilePanel/);
  assert.match(panel, /Save public profile/);
  assert.match(panel, /Save personal settings/);
  assert.match(panel, /accept="image\/jpeg,image\/png,image\/webp"/);
  assert.match(uploadRoute, /verifyRequestOrigin\(request\)/);
  assert.match(uploadRoute, /getStore\("profile-photos"\)/);
  assert.match(photoRoute, /getWithMetadata\(userId/);
});
