import * as ui from "./module.js";

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
            ["textField", "$filmcamera.scripts.ui.new.editor_new_setName.textField1.label", "$filmcamera.scripts.ui.new.editor_new_setName.textField1.placeholderText"]
        ];
        root.func = function(values) {
            if (!/^[a-zA-Z0-9_]+$/.test(values[0])) {
                root.show(player);
                return;
            }
            
        };
        root.UserClosedProcessor = function(player) {
            ui_list.editor_menu(player);
        };
        root.build();
        root.show(player);
    },
};