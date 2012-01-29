/**
 * Extension Template for the Cloud9 IDE client
 * 
 * Inserts a context menu item under the "Edit" menu, which, upon being
 * clicked displays a simple window with a "Close" button
 * 
 * This file is stripped of comments from extension_template.js in order to
 * provide a quick template for future extensions. Please reference
 * extension_template.js to see comprehensive documentation of extension
 * functionality
 * 
 * @copyright 2011, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */
 
define(function(require, exports, module) {

var ext = require("core/ext");
var ide = require("core/ide");
var util = require("core/util");
var editors = require("ext/editors/editors");
var Range = require("ace/range").Range;
var markup = require("text!ext/formatjson2/formatjson2.xml");

module.exports = ext.register("ext/formatjson2/formatjson2", {
    name     : "Format JSON2",
    dev      : "tanaka_733",
    alone    : true,
    type     : ext.GENERAL,
    markup   : markup,
    commands  : {
        "format2": {hint: "reformat 2 the current JSON document"}
    },
    
    nodes : [],

    format : function(indent){
        //We fetch the current editor from the editors extension
        var editor = editors.currentEditor;

        //We get the selection object from the current editor
        var sel   = editor.getSelection();
        
        //We also get a reference to the current document
        var doc   = editor.getDocument();
        
        //We fetch the range object of the current selection
        var range = sel.getRange();
        
        //We use this range object to get the string value of 
        //the selection in the context of the document.
        var value = doc.getTextRange(range);
        
        //We try to convert the value to JSON, format it 
        //and convert it back to a string. If this fails the user is notified.
        try{
            value = JSON.stringify(JSON.parse(value), null, indent);
        }
        catch(e){
            util.alert(
                "Invalid JSON", 
                "The selection contains an invalid or incomplete JSON string",
                "Please correct the JSON and try again");
            return;
        }
        
        //We replace the range with the new value
        var end = doc.replace(range, value);
        
        //We update the selection with the new position
        sel.setSelectionRange(Range.fromPoints(range.start, end));
    },
    
    init : function(amlNode){
        this.winFormat = winFormat;
    },

    hook : function(){
        var _self = this;
        this.nodes.push(
            ide.mnuEdit.appendChild(new apf.item({
                caption : "Format JSON",
                onclick : function(){
                    ext.initExtension(_self);
                    _self.winExtensionTemplate.show();
                }
            }))
        );
    },

    enable : function(){
        this.nodes.each(function(item){
            item.enable();
        });
    },

    disable : function(){
        this.nodes.each(function(item){
            item.disable();
        });
    },

    destroy : function(){
        this.nodes.each(function(item){
            item.destroy(true, true);
        });
        this.nodes = [];
    },

     closeExtensionTemplateWindow : function(){
        this.winExtensionTemplate.hide();
     }
});

});