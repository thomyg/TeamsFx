// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import "mocha";
import chai from "chai";
import {
  ApimPluginConfigKeys,
  TeamsToolkitComponent,
  SolutionConfigKeys,
} from "../../../../src/plugins/resource/apim/constants";
import { ApimPluginConfig, SolutionConfig } from "../../../../src/plugins/resource/apim/config";
import {
  ConfigMap,
  ConfigValue,
  EnvInfo,
  PluginIdentity,
  ReadonlyPluginConfig,
} from "@microsoft/teamsfx-api";

describe("config", () => {
  describe("SolutionConfig", () => {
    const configContent = new Map<PluginIdentity, ReadonlyPluginConfig>([
      [
        TeamsToolkitComponent.Solution,
        new Map<string, ConfigValue>([[SolutionConfigKeys.resourceNameSuffix, 1]]),
      ],
    ]);
    const envInfo: EnvInfo = {
      envName: "dev",
      config: { manifest: { appName: { short: "appname" } } },
      state: configContent,
    };

    const solutionConfig = new SolutionConfig(envInfo);

    it("Undefined property", () => {
      chai
        .expect(() => solutionConfig.teamsAppTenantId)
        .to.throw(
          `Project configuration 'teamsAppTenantId' of 'solution' is missing in 'state.dev.json'. Retry provision in the cloud or set the value manually.`
        );
    });
    it("Error type property", () => {
      chai
        .expect(() => solutionConfig.resourceNameSuffix)
        .to.throw("Property 'resourceNameSuffix' is not type 'string'");
    });
  });

  describe("ApimPluginConfig", () => {
    const configContent = ConfigMap.fromJSON({
      [ApimPluginConfigKeys.resourceGroupName]: "test-resource-group-name",
      [ApimPluginConfigKeys.serviceName]: 1,
    });

    if (!configContent) {
      throw Error("Empty test input");
    }

    const apimPluginConfig = new ApimPluginConfig(configContent, "dev");
    it("Undefined property", () => {
      chai.expect(apimPluginConfig.apiPath).to.equal(undefined);
    });
    it("Error type property", () => {
      chai
        .expect(() => apimPluginConfig.serviceName)
        .to.throw(
          "Project configuration 'serviceName' of 'fx-resource-apim' is invalid. The value can contain only letters, numbers and hyphens. The first character must be a letter and last character must be a letter or a number."
        );
    });
    it("Property with value", () => {
      chai.expect(apimPluginConfig.resourceGroupName).to.equal("test-resource-group-name");
    });
    it("Check and get undefined property", () => {
      chai
        .expect(() => apimPluginConfig.checkAndGet(ApimPluginConfigKeys.apiPath))
        .to.throw(
          `Project configuration 'apiPath' of 'fx-resource-apim' is missing in 'state.dev.json'. Retry deploy to the cloud or set the value manually.`
        );
    });
    it("Check and get error type property", () => {
      chai.expect(apimPluginConfig.checkAndGet(ApimPluginConfigKeys.serviceName)).to.equal("1");
    });
    it("Check and get property with value", () => {
      chai
        .expect(apimPluginConfig.checkAndGet(ApimPluginConfigKeys.resourceGroupName))
        .to.equal("test-resource-group-name");
    });
  });
});
