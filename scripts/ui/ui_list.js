import * as ui from "./module.js";

export const ui_list = {
    "menu": function(player) {
        const root = new ui.ActionUI();
        root.title = "$filmcamera.scripts.ui.new.menu.title";
        root.message = "$filmcamera.scripts.ui.new.menu.message";
        root.list = [
            "Test"
        ];
        root.func = [
            function(player) {
                player.sendMessage("Test!");
            }
        ];
        root.preventBusy();
        root.build();
        root.show(player);
    }
};