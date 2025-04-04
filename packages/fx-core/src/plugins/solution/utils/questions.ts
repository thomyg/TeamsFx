// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  MultiSelectQuestion,
  OptionItem,
  QTreeNode,
  SingleSelectQuestion,
  v3,
} from "@microsoft/teamsfx-api";
import { Container } from "typedi";
import { BotOptionItem, MessageExtensionItem, TabOptionItem } from "../fx-solution/question";

export enum SolutionV3QuestionNames {
  scaffoldTemplate = "template",
  capabilities = "capabilities",
  resource = "resource",
  module = "module",
  modules = "modules",
}

export const selectSingleModuleQuestion: SingleSelectQuestion = {
  name: SolutionV3QuestionNames.module,
  title: "Select a module",
  type: "singleSelect",
  staticOptions: [],
};

export const selectMultiModulesQuestion: MultiSelectQuestion = {
  name: SolutionV3QuestionNames.modules,
  title: "Select modules to deploy",
  type: "multiSelect",
  staticOptions: [],
};

export function createSelectModuleQuestionNode(modules: v3.Module[]): QTreeNode {
  const moduleNode = new QTreeNode(selectSingleModuleQuestion);
  const moduleOptions: OptionItem[] = [];
  let i = 0;
  for (const module of modules) {
    const option: OptionItem = {
      id: `${i++}`,
      label: JSON.stringify(module),
    };
    moduleOptions.push(option);
  }
  moduleOptions.push({ id: "none", label: "none" });
  selectSingleModuleQuestion.staticOptions = moduleOptions;
  return moduleNode;
}

export function createSelectModulesToDeployQuestionNode(modules: v3.Module[]): QTreeNode {
  const moduleNode = new QTreeNode(selectMultiModulesQuestion);
  const moduleOptions: OptionItem[] = [];
  let i = 0;
  for (const module of modules) {
    if (module.hostingPlugin) {
      const plugin = Container.get<v3.ResourcePlugin>(module.hostingPlugin);
      if (plugin.deploy) {
        const option: OptionItem = {
          id: `${i++}`,
          label: JSON.stringify(module),
        };
        moduleOptions.push(option);
      }
    }
  }
  selectMultiModulesQuestion.staticOptions = moduleOptions;
  return moduleNode;
}

export const selectCapabilitiesQuestion: MultiSelectQuestion = {
  name: SolutionV3QuestionNames.capabilities,
  title: "Select capabilities",
  type: "multiSelect",
  staticOptions: [TabOptionItem, BotOptionItem, MessageExtensionItem],
  default: [TabOptionItem.id],
  skipSingleOption: true,
};

export const selectScaffoldTemplateQuestion: SingleSelectQuestion = {
  name: SolutionV3QuestionNames.scaffoldTemplate,
  title: "Select a scaffold template",
  type: "singleSelect",
  staticOptions: [],
  returnObject: true,
};

export const selectResourceQuestion: SingleSelectQuestion = {
  name: SolutionV3QuestionNames.resource,
  title: "Select a resources",
  type: "singleSelect",
  staticOptions: [],
};
