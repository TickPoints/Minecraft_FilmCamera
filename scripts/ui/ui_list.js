import * as ui from "./module.js";
import {
    translate
}
from "../text/local.js";

export const ui_list = {
    "menu": function(player) {
        const root = new ui.ActionUI();
        root.title = "$filmcamera.scripts.ui.new.menu.title";
        root.message = "$filmcamera.scripts.ui.new.menu.message";
        root.list = [
            "$filmcamera.scripts.ui.new.menu.button1",
            "$filmcamera.scripts.ui.new.menu.button2"
        ];
        root.func = [
            function(player) {
                ui_list.editor_menu(player);
            },
            function(player) {
                player.sendMessage("Working...");
            }
        ];
        root.preventBusy();
        root.build();
        root.show(player);
    },
    "editor_menu": function(player) {
        const root = new ui.ActionUI();
        root.title = "$filmcamera.scripts.ui.new.editor_menu.title";
        root.message = "$filmcamera.scripts.ui.new.editor_menu.message";
        root.list = [
            "$filmcamera.scripts.ui.new.editor_menu.button1",
            "$filmcamera.scripts.ui.new.editor_menu.button2",
            "$filmcamera.scripts.ui.new.editor_menu.button3"
        ];
        root.func = [
            function(player) {
                ui_list.editor_new_setName(player);
            },
            function(player) {
                player.sendMessage("Working...");
            },
            function(player) {
                player.sendMessage("Working...");
            }
        ];
        root.UserClosedProcessor = function(player) {
            ui_list.menu(player);
        };
        root.build();
        root.show(player);
    },
    "editor_new_setName": function(player) {
        const root = new ui.ModalUI();
        root.title = "$filmcamera.scripts.ui.new.editor_new.title";
        root.message = "$filmcamera.scripts.ui.new.editor_new_setName.message";
        root.list = [
            ["textField", "$filmcamera.scripts.ui.new.editor_new_setName.nameInput.label", "$filmcamera.scripts.ui.new.editor_new_setName.nameInput.placeholderText"]
        ];
        root.func = function(player, values) {
            const result = values[0];
            if (!/^[a-zA-Z0-9_]+$/.test(result)) {
                root.show(player);
                return;
            }
            ui.tip(player, translate("filmcamera.scripts.ui.new.editor_new_setName.tip.message", result), function() {
                ui_list.editor_new_setting(player, result);
            }, function() {
                ui_list.editor_new_setName(player);
            });
        };
        root.UserClosedProcessor = function(player) {
            ui_list.editor_menu(player);
        };
        root.build();
        root.show(player);
    },
    "editor_new_setting": function(player, projectName) {
        const root = new ui.ModalUI();
        root.title = "$filmcamera.scripts.ui.new.editor_new_setting.title";
        root.message = "$filmcamera.scripts.ui.new.editor_new_setting.message";
        root.submitMessage = "$filmcamera.scripts.ui.new.editor_new_setting.submitMessage";
        root.list = [
            ["dropdown", "$filmcamera.scripts.ui.new.editor_new_setting.belonging_selection.label", [translate("filmcamera.scripts.ui.new.editor_new_setting.belonging_selection.public"), translate("filmcamera.scripts.ui.new.editor_new_setting.belonging_selection.private")]]
        ];
        root.func = function(player, values) {
            //
        };
        root.preventCanceled();
        root.build();
        root.show(player);
    }
};