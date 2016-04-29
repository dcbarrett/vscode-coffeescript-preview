'use strict';

import * as vscode from "vscode";
import { window, Disposable, TextDocumentChangeEvent, Uri, TextDocument, TextEditor, ViewColumn } from "vscode";

export class WindowService {

    public showTextDocument(textDoc:TextDocument, column:ViewColumn, preserveFocus:boolean): Thenable<TextEditor>{
        return window.showTextDocument(textDoc, column, preserveFocus);
    }

    public getActiveTextEditor(): TextEditor {
        return window.activeTextEditor;
    }
}
