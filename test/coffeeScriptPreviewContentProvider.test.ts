'use strict';

import * as assert from 'assert';
import * as vscode from 'vscode';
import { CoffeeScriptPreview } from '../src/cs-preview/coffeeScriptPreview';
import { CoffeeScriptPreviewContentProvider } from '../src/cs-preview/coffeeScriptPreviewContentProvider';
import { WorkspaceService } from "../src/vscode/workspaceService";
import { WindowService } from "../src/vscode/windowService";
import { workspace, window, TextDocumentChangeEvent, Uri, ViewColumn, TextDocument, TextEditor } from "vscode";
let sinon = require("sinon");

describe("CoffeeScriptPreviewContentProvider Tests", () => {

    beforeEach(()=>{
        this.windowService = new WindowService();
        this.provider = new CoffeeScriptPreviewContentProvider(this.windowService)
        this.textDoc = <TextDocument>{ fileName: "test.coffee", languageId: "coffeescript", getText: sinon.stub() };
        this.editor = <TextEditor>{ viewColumn: 4, document: this.textDoc };
    })

    it("provideTextDocumentContent() will compile the current valid document", () => {
        this.textDoc.getText.returns('"Test" is "Test"');
        let windowServiceStub = sinon.stub(this.windowService, "getActiveTextEditor").returns(this.editor);
        const result = this.provider.provideTextDocumentContent();
        assert.equal(result, '"Test" === "Test";\n');
    });

    it("provideTextDocumentContent() will generate an error when compiling an invalid document", () => {
        this.textDoc.getText.returns('new class 123');
        let windowServiceStub = sinon.stub(this.windowService, "getActiveTextEditor").returns(this.editor);
        const result = this.provider.provideTextDocumentContent();
        assert.equal(result, "Error: unexpected end of input; line: 1, column: 14]");
    });

});
