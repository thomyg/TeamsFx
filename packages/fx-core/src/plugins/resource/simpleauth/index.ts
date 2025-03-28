// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  Plugin,
  PluginContext,
  SystemError,
  UserError,
  err,
  AzureSolutionSettings,
} from "@microsoft/teamsfx-api";
import { HostTypeOptionAzure, TabOptionItem } from "../../solution/fx-solution/question";
import { Messages, Telemetry, Constants } from "./constants";
import { UnhandledError } from "./errors";
import { SimpleAuthPluginImpl } from "./plugin";
import { SimpleAuthResult, ResultFactory } from "./result";
import { DialogUtils } from "./utils/dialog";
import { TelemetryUtils } from "./utils/telemetry";
import { Service } from "typedi";
import { ResourcePlugins } from "../../solution/fx-solution/ResourcePluginContainer";
import "./v2";
@Service(ResourcePlugins.SimpleAuthPlugin)
export class SimpleAuthPlugin implements Plugin {
  name = "fx-resource-simple-auth";
  displayName = "Simple Auth";
  activate(solutionSettings: AzureSolutionSettings): boolean {
    if (solutionSettings?.activeResourcePlugins?.includes(Constants.SimpleAuthPlugin.id)) {
      return true;
    } else {
      return false;
    }
  }
  simpleAuthPluginImpl = new SimpleAuthPluginImpl();

  public async localDebug(ctx: PluginContext): Promise<SimpleAuthResult> {
    return this.runWithSimpleAuthError(
      () => this.simpleAuthPluginImpl.localDebug(ctx),
      ctx,
      Messages.EndLocalDebug.telemetry
    );
  }

  public async postLocalDebug(ctx: PluginContext): Promise<SimpleAuthResult> {
    return this.runWithSimpleAuthError(
      () => this.simpleAuthPluginImpl.postLocalDebug(ctx),
      ctx,
      Messages.EndPostLocalDebug.telemetry
    );
  }

  public async provision(ctx: PluginContext): Promise<SimpleAuthResult> {
    return ResultFactory.Success();
  }

  public async postProvision(ctx: PluginContext): Promise<SimpleAuthResult> {
    return this.runWithSimpleAuthError(
      () => this.simpleAuthPluginImpl.postProvision(ctx),
      ctx,
      Messages.EndPostProvision.telemetry
    );
  }

  public async updateArmTemplates(ctx: PluginContext): Promise<SimpleAuthResult> {
    return this.runWithSimpleAuthError(
      () => this.simpleAuthPluginImpl.updateArmTemplates(ctx),
      ctx,
      Messages.EndUpdateArmTemplates.telemetry
    );
  }

  public async generateArmTemplates(ctx: PluginContext): Promise<SimpleAuthResult> {
    return this.runWithSimpleAuthError(
      () => this.simpleAuthPluginImpl.generateArmTemplates(ctx),
      ctx,
      Messages.EndGenerateArmTemplates.telemetry
    );
  }

  private async runWithSimpleAuthError(
    fn: () => Promise<SimpleAuthResult>,
    ctx: PluginContext,
    stage: string
  ): Promise<SimpleAuthResult> {
    try {
      return await fn();
    } catch (e) {
      await DialogUtils.progressBar?.end(false);

      if (!(e instanceof Error || e instanceof SystemError || e instanceof UserError)) {
        e = new Error(e.toString());
      }
      ctx.logProvider?.error(e.message);
      TelemetryUtils.init(ctx);

      if (e instanceof SystemError || e instanceof UserError) {
        TelemetryUtils.sendErrorEvent(
          stage,
          e.name,
          e instanceof UserError ? Telemetry.userError : Telemetry.systemError,
          e.message
        );
        return err(e);
      } else {
        TelemetryUtils.sendErrorEvent(
          stage,
          UnhandledError.name,
          Telemetry.systemError,
          UnhandledError.message(e?.message)
        );
        return err(
          ResultFactory.SystemError(UnhandledError.name, UnhandledError.message(e?.message), e)
        );
      }
    }
  }
}

export default new SimpleAuthPlugin();
