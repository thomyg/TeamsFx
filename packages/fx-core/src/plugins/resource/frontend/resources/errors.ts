// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Constants, FrontendPathInfo, FrontendPluginInfo } from "../constants";
import { Logger } from "../utils/logger";
import path from "path";
import { ConfigFolderName, ArchiveFolderName, FxError } from "@microsoft/teamsfx-api";

export enum ErrorType {
  User,
  System,
}

export const tips = {
  checkLog: "Check log for more information.",
  reScaffold: `Run 'Start A New Project' again.`,
  doProvision: `Run 'Provision Resource' before this command.`,
  doLogin: "Login to Azure.",
  reLogin: "Sign out and login to Azure again.",
  reProvision: `Run 'Provision Resource' again.`,
  doNpmInstall: `Run 'npm install' in the folder: '${FrontendPathInfo.WorkingDir}'.`,
  doBuild: `Run 'npm run build' in the folder: '${FrontendPathInfo.WorkingDir}'.`,
  ensureBuildPath: `Ensure your built project exists: '${FrontendPathInfo.BuildPath}'.`,
  ensureResourceGroup: "Ensure your resource group exists.",
  ensureAppNameValid:
    "Ensure your app name only contains alphabetical and numeric characters, and does not contain trademark or reserved words.",
  deleteSameNameStorage:
    "Delete your Azure Storage Account with same name in another resource group or subscription.",
  checkNetwork: "Check your network connection.",
  checkFsPermissions: "Check if you have Read/Write permissions to your file system.",
  checkStoragePermissions: "Check if you have permissions to your Azure Storage Account.",
  checkSystemTime: "You may get expired credentials, check if your system time is correct.",
  restoreEnvironment: `If you manually updated configuration files (under directory .${ConfigFolderName}), recover them.`,
  migrateV1Project: `Rollback your project from '${ArchiveFolderName}' folder.`,
};

export class FrontendPluginError extends Error {
  public code: string;
  public message: string;
  public suggestions: string[];
  public errorType: ErrorType;
  public helpLink?: string;
  public innerError?: Error;

  constructor(
    errorType: ErrorType,
    code: string,
    message: string,
    suggestions: string[],
    helpLink?: string
  ) {
    super(message);
    this.code = code;
    this.message = message;
    this.suggestions = suggestions;
    this.errorType = errorType;
    this.helpLink = helpLink;
  }

  getMessage(): string {
    return `${this.message} Suggestions: ${this.suggestions.join(" ")}`;
  }

  setInnerError(error: Error): void {
    this.innerError = error;
  }

  getInnerError(): Error | undefined {
    return this.innerError;
  }
}

export class UnauthenticatedError extends FrontendPluginError {
  constructor() {
    super(ErrorType.User, "UnauthenticatedError", "Failed to get user login information.", [
      tips.doLogin,
    ]);
  }
}

export class InvalidConfigError extends FrontendPluginError {
  constructor(key: string, detailedErrorMessage?: string) {
    const detailedMsg = detailedErrorMessage ? ` Error message: ${detailedErrorMessage}` : "";
    super(ErrorType.User, "InvalidConfigError", `Get invalid ${key}.${detailedMsg}`, [
      tips.restoreEnvironment,
    ]);
  }
}

export class CheckResourceGroupError extends FrontendPluginError {
  constructor() {
    super(ErrorType.User, "CheckResourceGroupError", "Failed to check resource group existence.", [
      tips.checkLog,
    ]);
  }
}

export class NoResourceGroupError extends FrontendPluginError {
  constructor() {
    super(ErrorType.User, "NoResourceGroupError", "Failed to find resource group.", [
      tips.ensureResourceGroup,
    ]);
  }
}

export class CheckStorageError extends FrontendPluginError {
  constructor() {
    super(
      ErrorType.User,
      "CheckStorageError",
      "Failed to check Azure Storage Account availability.",
      [tips.checkSystemTime, tips.checkLog]
    );
  }
}

export class NoStorageError extends FrontendPluginError {
  constructor() {
    super(ErrorType.User, "NoStorageError", "Failed to find Azure Storage Account.", [
      tips.reProvision,
    ]);
  }
}

export class StaticWebsiteDisabledError extends FrontendPluginError {
  constructor() {
    super(
      ErrorType.User,
      "StaticWebsiteDisableError",
      "Static website hosting feature is disabled for Azure Storage Account.",
      [tips.reProvision],
      FrontendPluginInfo.HelpLink
    );
  }
}

export class InvalidStorageNameError extends FrontendPluginError {
  constructor() {
    super(ErrorType.User, "InvalidStorageNameError", "Azure Storage Name is invalid.", [
      tips.ensureAppNameValid,
    ]);
  }
}

export class EnableStaticWebsiteError extends FrontendPluginError {
  constructor() {
    super(
      ErrorType.User,
      "EnableStaticWebsiteError",
      "Failed to enable static website feature for Azure Storage Account.",
      [tips.checkSystemTime, tips.checkStoragePermissions],
      FrontendPluginInfo.HelpLink
    );
  }
}

export class ClearStorageError extends FrontendPluginError {
  constructor() {
    super(ErrorType.User, "ClearStorageError", "Failed to clear Azure Storage Account.", [
      tips.checkSystemTime,
      tips.checkNetwork,
    ]);
  }
}

export class UploadToStorageError extends FrontendPluginError {
  constructor() {
    super(
      ErrorType.User,
      "UploadToStorageError",
      `Failed to upload local path ${path.join(
        FrontendPathInfo.WorkingDir,
        FrontendPathInfo.BuildPath
      )} to Azure Storage Account.`,
      [tips.checkSystemTime, tips.checkNetwork]
    );
  }
}

export class GetContainerError extends FrontendPluginError {
  constructor() {
    super(
      ErrorType.User,
      "GetContainerError",
      `Failed to get container '${Constants.AzureStorageWebContainer}' from Azure Storage Account.`,
      [tips.checkSystemTime, tips.checkStoragePermissions, tips.checkNetwork]
    );
  }
}

export class UnknownScaffoldError extends FrontendPluginError {
  constructor() {
    super(
      ErrorType.System,
      "UnknownScaffoldError",
      "Failed to scaffold project causes unknown reason.",
      [tips.checkLog]
    );
  }
}

export class TemplateManifestError extends FrontendPluginError {
  constructor(msg: string) {
    super(
      ErrorType.User,
      "TemplateManifestError ",
      `Failed to find template from manifest: ${msg}`,
      [tips.checkNetwork]
    );
  }
}

export class TemplateZipFallbackError extends FrontendPluginError {
  constructor() {
    super(
      ErrorType.System,
      "TemplateZipFallbackError",
      "Failed to download zip package and open local zip package.",
      [tips.checkLog, tips.checkNetwork]
    );
  }
}

export class UnzipTemplateError extends FrontendPluginError {
  constructor() {
    super(ErrorType.User, "UnzipTemplateError", "Failed to unzip template package.", [
      tips.checkFsPermissions,
    ]);
  }
}

export class FileSystemError extends FrontendPluginError {
  constructor(message: string) {
    super(ErrorType.System, "FileSystemError", message, [tips.checkLog]);
  }
}

export class NoBuildPathError extends FrontendPluginError {
  constructor() {
    super(ErrorType.User, "NoBuildPathError", `Failed to find 'build' folder.`, [
      tips.doBuild,
      tips.ensureBuildPath,
    ]);
  }
}

export class BuildError extends FrontendPluginError {
  constructor() {
    super(ErrorType.User, "BuildError", "Failed to build Tab app.", [tips.doBuild, tips.checkLog]);
  }
}

export class NpmInstallError extends FrontendPluginError {
  constructor() {
    super(ErrorType.User, "NpmInstallError", `Failed to run 'npm install' for Tab app.`, [
      tips.doNpmInstall,
      tips.checkLog,
    ]);
  }
}

export class InvalidTabLanguageError extends FrontendPluginError {
  constructor() {
    super(
      ErrorType.User,
      "InvalidTabLanguageError",
      "The selected programming language yet is not supported by Tab.",
      [tips.restoreEnvironment, tips.reScaffold]
    );
  }
}

export class MigrateV1ProjectError extends FrontendPluginError {
  constructor() {
    super(
      ErrorType.User,
      "MigrateV1ProjectError",
      `Failed to migrate Teams Toolkit V1 project into '${FrontendPathInfo.WorkingDir}'.`,
      [tips.migrateV1Project, tips.checkLog]
    );
  }
}

export class NotImplemented extends FrontendPluginError {
  constructor() {
    super(ErrorType.System, "NotImplemented", "Not Implemented", []);
  }
}

export class UserTaskNotImplementedError extends FrontendPluginError {
  constructor(taskName: string) {
    super(
      ErrorType.System,
      "UserTaskNotImplementedError",
      `User task '${taskName}' is not implemented.`,
      []
    );
  }
}

export const UnhandledErrorCode = "UnhandledError";
export const UnhandledErrorMessage = "Unhandled error.";

export async function runWithErrorCatchAndThrow<T>(
  error: FrontendPluginError | FxError,
  fn: () => T | Promise<T>
): Promise<T> {
  try {
    const res = await Promise.resolve(fn());
    return res;
  } catch (e) {
    Logger.error(e.toString());
    if (error instanceof FrontendPluginError) error.setInnerError(e);
    throw error;
  }
}

export async function runWithErrorCatchAndWrap<T>(
  wrap: (error: any) => FrontendPluginError | FxError,
  fn: () => T | Promise<T>
): Promise<T> {
  try {
    const res = await Promise.resolve(fn());
    return res;
  } catch (e) {
    Logger.error(e.toString());
    const error = wrap(e);
    if (error instanceof FrontendPluginError) error.setInnerError(e);
    throw error;
  }
}
