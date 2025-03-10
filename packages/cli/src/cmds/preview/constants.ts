// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";

import { FolderName } from "@microsoft/teamsfx-core";

export enum Browser {
  chrome = "chrome",
  edge = "edge",
  default = "default",
}

export const sideloadingUrl =
  "https://teams.microsoft.com/l/app/${teamsAppId}?installAppPackage=true&webjoin=true&${account-hint}";
export const teamsAppIdPlaceholder = "${teamsAppId}";
export const accountHintPlaceholder = "${account-hint}";

export const serviceLogHintMessage = "The log of this task can be found in:";
export const openBrowserHintMessage =
  "WARN: Failed to open the browser, please copy the preview url and paste it into your browser.";
export const waitCtrlPlusC =
  "WARN: Closing browser will not terminate the preview process, please press Ctrl+C to terminate.";

export const frontendHostingPluginName = "fx-resource-frontend-hosting";
export const functionPluginName = "fx-resource-function";
export const botPluginName = "fx-resource-bot";
export const solutionPluginName = "solution";
export const appstudioPluginName = "fx-resource-appstudio";
export const spfxPluginName = "fx-resource-spfx";

export const teamsAppTenantIdConfigKey = "teamsAppTenantId";
export const remoteTeamsAppIdConfigKey = "teamsAppId";

export const frontendStartPattern = /Compiled|Failed/g;
export const backendStartPattern =
  /Worker process started and initialized|Host lock lease acquired by instance ID/g;
export const backendWatchPattern = /.*/g;
export const authStartPattern = /.*/g;
export const ngrokStartPattern = /started tunnel|failed to reconnect session/g;
export const botStartPattern = /listening|[nodemon] app crashed/g;
export const gulpServePattern = /^.*Finished subtask 'reload'.*/g;

export const spfxInstallStartMessage = `executing 'npm install' under ${FolderName.SPFx} folder.`;
export const gulpCertTitle = "gulp trust-dev-cert";
export const gulpCertStartMessage = `executing 'gulp trust-dev-cert' under ${FolderName.SPFx} folder.`;
export const gulpServeTitle = "gulp serve";
export const gulpServeStartMessage = `executing 'gulp serve' under ${FolderName.SPFx} folder.`;
export const frontendInstallStartMessage = `executing 'npm install' under ${FolderName.Frontend} folder.`;
export const frontendStartStartMessage = `executing 'react-scripts start' under ${FolderName.Frontend} folder.`;
export const authStartStartMessage = "starting auth service.";
export const backendInstallStartMessage = `executing 'npm install' under ${FolderName.Function} folder.`;
export const backendExtensionsInstallStartMessage =
  "installing Azure Functions binding extensions.";
export const backendStartStartMessage = `executing 'func start' under ${FolderName.Function} folder.`;
export const backendWatchStartMessage = `executing 'tsc --watch' under ${FolderName.Function} folder.`;
export const botInstallStartMessage = `executing 'npm install' under ${FolderName.Bot} folder.`;
export const botStartStartMessage = "starting bot.";
export const ngrokStartStartMessage = `executing 'ngrok http' under ${FolderName.Bot} folder.`;

export const previewTitle = "preview";
export const previewStartMessage = "opening Teams web client.";
export const previewSPFxTitle = "spfx preview";
export const previewSPFxStartMessage = "opening SharePoint workbench.";

export const frontendLocalEnvPrefix = "FRONTEND_";
export const backendLocalEnvPrefix = "BACKEND_";
export const authLocalEnvPrefix = "AUTH_";
export const authServicePathEnvKey = "AUTH_SERVICE_PATH";
export const botLocalEnvPrefix = "BOT_";

export const automaticNpmInstallHintMessage =
  'Automatically installing packages required for your project. You can disable this by setting the global config "automatic-npm-install" to "off".';
