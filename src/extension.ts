'use strict';

import * as vscode from "vscode";
import { workspace, ExtensionContext, commands } from "vscode";
import { CoffeeScriptPreviewContentProvider } from "./cs-preview/coffeeScriptPreviewContentProvider";
import { CoffeeScriptPreview } from "./cs-preview/coffeeScriptPreview";
import { WorkspaceService } from "./vscode/workspaceService";
import { WindowService } from "./vscode/windowService";

export function activate(context: ExtensionContext) {
    const windowService = new WindowService();
    const workspaceService = new WorkspaceService();
    const provider = new CoffeeScriptPreviewContentProvider(windowService);
    const csPreview = new CoffeeScriptPreview(provider, workspaceService, windowService);
    const providerRegistration = workspace.registerTextDocumentContentProvider("coffeescript-preview", provider);
    const commandRegistration = commands.registerCommand("extension.coffeescript-preview", csPreview.previewDocument, csPreview);
    const pluginStartup = csPreview.start();
    context.subscriptions.push(commandRegistration, providerRegistration, pluginStartup);
}
