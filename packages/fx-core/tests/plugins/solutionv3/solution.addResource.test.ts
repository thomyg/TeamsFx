// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  FxError,
  ok,
  Platform,
  ProjectSettings,
  Result,
  TeamsAppManifest,
  v2,
} from "@microsoft/teamsfx-api";
import { assert } from "chai";
import "mocha";
import * as os from "os";
import * as path from "path";
import "reflect-metadata";
import * as uuid from "uuid";
import {
  addResource,
  getQuestionsForAddResource,
} from "../../../src/plugins/solution/fx-solution/v3/addResource";
import {
  BuiltInResourcePluginNames,
  TeamsFxAzureSolutionNameV3,
} from "../../../src/plugins/solution/fx-solution/v3/constants";
import { deleteFolder, randomAppName } from "../../core/utils";
import { MockedV2Context } from "../solution/util";
import { MockResourcePluginNames } from "./mockPlugins";
import sinon from "sinon";
import { Container } from "typedi";
import { AppStudioPluginV3 } from "../../../src/plugins/resource/appstudio/v3";
describe("SolutionV3 - addResource", () => {
  const sandbox = sinon.createSandbox();
  beforeEach(async () => {
    const appStudio = Container.get<AppStudioPluginV3>(BuiltInResourcePluginNames.appStudio);
    sandbox
      .stub<any, any>(appStudio, "loadManifest")
      .callsFake(
        async (
          ctx: v2.Context,
          inputs: v2.InputsWithProjectPath
        ): Promise<Result<{ local: TeamsAppManifest; remote: TeamsAppManifest }, FxError>> => {
          return ok({ local: new TeamsAppManifest(), remote: new TeamsAppManifest() });
        }
      );
    sandbox
      .stub<any, any>(appStudio, "saveManifest")
      .callsFake(
        async (
          ctx: v2.Context,
          inputs: v2.InputsWithProjectPath,
          manifest: { local: TeamsAppManifest; remote: TeamsAppManifest }
        ): Promise<Result<any, FxError>> => {
          return ok({ local: {}, remote: {} });
        }
      );
  });
  afterEach(async () => {
    sandbox.restore();
  });
  it("addResource", async () => {
    const projectSettings: ProjectSettings = {
      appName: "my app",
      projectId: uuid.v4(),
      solutionSettings: {
        name: TeamsFxAzureSolutionNameV3,
        version: "3.0.0",
        capabilities: ["Tab"],
        hostType: "",
        azureResources: [],
        modules: [{ capabilities: ["Tab"] }],
        activeResourcePlugins: [],
      },
    };
    const projectPath = path.join(os.tmpdir(), randomAppName());
    const ctx = new MockedV2Context(projectSettings);
    const inputs: v2.InputsWithProjectPath = {
      platform: Platform.VSCode,
      projectPath: projectPath,
      module: 0,
      resource: MockResourcePluginNames.storage,
      test: true,
    };
    const res = await addResource(ctx, inputs);
    assert.isTrue(res.isOk());
    assert.deepEqual(projectSettings.solutionSettings, {
      name: TeamsFxAzureSolutionNameV3,
      version: "3.0.0",
      capabilities: ["Tab"],
      hostType: "",
      azureResources: [],
      modules: [{ capabilities: ["Tab"], hostingPlugin: MockResourcePluginNames.storage }],
      activeResourcePlugins: [MockResourcePluginNames.storage],
    });
    deleteFolder(projectPath);
  });

  it("getQuestionsForAddResource", async () => {
    const projectSettings: ProjectSettings = {
      appName: "my app",
      projectId: uuid.v4(),
      solutionSettings: {
        name: TeamsFxAzureSolutionNameV3,
        version: "3.0.0",
        capabilities: ["Tab"],
        hostType: "",
        azureResources: [],
        modules: [{ capabilities: ["Tab"] }],
        activeResourcePlugins: [],
      },
    };
    const ctx = new MockedV2Context(projectSettings);
    const inputs: v2.InputsWithProjectPath = {
      platform: Platform.VSCode,
      projectPath: path.join(os.tmpdir(), randomAppName()),
    };
    const res = await getQuestionsForAddResource(ctx, inputs);
    assert.isTrue(res.isOk());
  });
});
