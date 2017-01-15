'use strict';

import * as os from "os";
import * as vscode from "vscode";
import { TextDocumentChangeEvent, Uri, ViewColumn, TextDocument, TextEditor, Disposable } from "vscode";
import * as utility from "./utility";
import { CoffeeScriptPreviewContentProvider } from "./coffeeScriptPreviewContentProvider";
import { WorkspaceService } from "../vscode/workspaceService";
import { WindowService } from "../vscode/windowService";

export class CoffeeScriptPreview {

    private _delay = 500;
    private _provider: CoffeeScriptPreviewContentProvider;
    private _workspaceService: WorkspaceService;
    private _windowService: WindowService;

    constructor(provider: CoffeeScriptPreviewContentProvider, workspaceService: WorkspaceService, windowService: WindowService){
        this._provider = provider;
        this._workspaceService = workspaceService;
        this._windowService = windowService;
    }

    public start(): Disposable {
        const debouncedUpdateContent = utility.debounce(this.updateContent, this._delay, this);
        return this._workspaceService.registerOnDocumentChangeListener((event: TextDocumentChangeEvent) => {
            if (this.isValidDocument(event.document)){
                debouncedUpdateContent(event.document.fileName);
            }
        });
    }

    public updateContent(fileName:string): void {
        const uri = this.generatePreviewUri(fileName)
        this._provider.updateContent(uri)
    }

    public isValidDocument(document: TextDocument): boolean {
        const activeTextEditor = this._windowService.getActiveTextEditor();
        return document.languageId === "coffeescript" && ( activeTextEditor && document === activeTextEditor.document);
    }

    public previewDocument(): PromiseLike<TextEditor> {
        let editor = this._windowService.getActiveTextEditor();
        const previewUri = this.generatePreviewUri(editor.document.fileName);
        return this._workspaceService.openTextDocument(previewUri).then((textDoc)=>{ return this.showTextDocument(textDoc); });
    }

    private showTextDocument(textDoc:TextDocument): Thenable<TextEditor>{
        let editor = this._windowService.getActiveTextEditor();
        const displayColumn = this.getDisplayColumn(editor.viewColumn);
        return this._windowService.showTextDocument(textDoc, displayColumn, true);
    }

    private generatePreviewUri = (baseUrl:string): Uri => {
        const separator = os.platform() === "win32" ? "\\" : "//";
        return Uri.parse(`coffeescript-preview:${separator}${baseUrl}.js`);
    }

    private getDisplayColumn(currentColummn: ViewColumn): number {
        return (currentColummn === ViewColumn.Three ? ViewColumn.Two : currentColummn + 1);
    }
}
