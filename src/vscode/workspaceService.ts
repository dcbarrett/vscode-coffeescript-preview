'use strict';

import * as vscode from "vscode";
import { workspace, Disposable, TextDocumentChangeEvent, Uri, TextDocument, TextEditor, ViewColumn } from "vscode";

export class WorkspaceService {

    public registerOnDocumentChangeListener(func:(e:TextDocumentChangeEvent)=> void): Disposable {
        return workspace.onDidChangeTextDocument(func);
    }

    public openTextDocument(uri:Uri): Thenable<TextDocument>{
        return workspace.openTextDocument(uri);
    }
}

