"use strict";

import * as vscode from "vscode";
let coffeescript = require("coffeescript");
import { TextEditor, EventEmitter, Event, TextDocumentContentProvider, Uri } from "vscode";
import { WindowService } from "../vscode/windowService";

export class CoffeeScriptPreviewContentProvider implements TextDocumentContentProvider {

    private _windowService: WindowService;
    private _onDidChange = new EventEmitter<Uri>();

    constructor(windowService: WindowService){
        this._windowService = windowService;
    }

    get onDidChange(): Event<Uri> {
        return this._onDidChange.event;
    }

    public updateContent(uri: Uri) {
        this._onDidChange.fire(uri);
    }

    public provideTextDocumentContent(uri: Uri): string {
        const editor = this._windowService.getActiveTextEditor();
        if (editor){
            return this.getDisplayContents(editor);
        }
    }

    private getDisplayContents(editor:TextEditor): string {
        let output = "";
        try {
                let text = this.getDocumentContent(editor);
                output = coffeescript.compile(text, { bare:true });
            }
        catch (error) {
            output = this.generateErrorMessage(error);
        }
        return output;
    }

    private getDocumentContent(editor:vscode.TextEditor):string{
        return editor.document.getText();
    }

    private generateErrorMessage(error):string {
        return `Error: ${error.message}; line: ${error.location.first_line + 1}, column: ${error.location.first_column + 1}]`;
    }
}
