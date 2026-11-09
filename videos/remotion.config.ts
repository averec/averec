/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Neste container de nuvem o download do Chrome do Remotion é bloqueado pela rede;
// usa o Chromium headless já instalado quando ele existir.
import { existsSync } from "node:fs";
const localHeadlessShell =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (existsSync(localHeadlessShell)) {
  Config.setBrowserExecutable(localHeadlessShell);
}
