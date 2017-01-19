'use strict';

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as os from 'os';
import { CoffeeScriptPreview } from '../src/cs-preview/coffeeScriptPreview';
import { CoffeeScriptPreviewContentProvider } from '../src/cs-preview/coffeeScriptPreviewContentProvider';
import { WorkspaceService } from "../src/vscode/workspaceService";
import { WindowService } from "../src/vscode/windowService";
import { workspace, window, TextDocumentChangeEvent, Uri, ViewColumn, TextDocument, TextEditor } from "vscode";
let sinon = require("sinon");

describe("CoffeeScriptPreview Tests", () => {

    beforeEach(()=>{
        this.windowService = new WindowService();
        this.workspaceService = new WorkspaceService();
        this.provider = new CoffeeScriptPreviewContentProvider(this.windowService)
        this.cspreview = new CoffeeScriptPreview(this.provider, this.workspaceService, this.windowService);
        this.textDoc = <TextDocument>{ fileName: "test.coffee", languageId: "coffeescript" };
        this.editor = <TextEditor>{ viewColumn: 4, document: this.textDoc };
    })

    it("previewDocument() will open and display a text document", (done) => {
        const workspaceServiceStub = sinon.stub(this.workspaceService, "openTextDocument").returns(Promise.resolve(this.textDoc));
        let windowServiceStub = sinon.stub(this.windowService)
        windowServiceStub.showTextDocument.returns(Promise.resolve(this.editor));
        windowServiceStub.getActiveTextEditor.returns(this.editor);

        this.cspreview.previewDocument().then((result)=>{
            const callUri = workspaceServiceStub.getCall(0).args[0];
            assert.equal(callUri.scheme, "coffeescript-preview");
            assert.equal(callUri.authority, "test.coffee.js");
            assert.equal(windowServiceStub.showTextDocument.calledWith(this.textDoc, 5, true), true);
            done();
        });
    });

    it("isValidDocument() returns true when provided with a valid text document", ()=>{
        sinon.stub(this.windowService, "getActiveTextEditor").returns(this.editor);
        const result = this.cspreview.isValidDocument(this.textDoc);
        assert.equal(result, true);
    });

    it("isValidDocument() returns false when provided with an invalid text document", ()=>{
        this.textDoc.languageId = "javascript";
        sinon.stub(this.windowService, "getActiveTextEditor").returns(this.editor);
        const result = this.cspreview.isValidDocument(this.textDoc);
        assert.equal(result, false);
    });

    it("updateContent() will call the content provider to update content", ()=>{
        const stub = sinon.stub(this.provider, "updateContent");
        this.cspreview.updateContent("new_file.coffee");
        let separator = "//";
        if (os.platform() === "win32") {
            separator = "\\";
        }
        assert.equal(stub.getCall(0).args[0].toString().includes(separator), true);
        assert.equal(stub.getCall(0).args[0].authority, "new_file.coffee.js");
    });

});
