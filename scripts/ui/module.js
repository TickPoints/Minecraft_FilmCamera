// build a user-friendly UI project.
// Import original UI
import {
    ActionFormData,
    MessageFormData,
    ModalFormData
} from "@minecraft/server-ui";
import { raw } from "../text/local.js";

function splitArray(arr, n) {
    return arr.reduce((acc, _, index) => {
        let subIndex = Math.floor(index / n);
        if (!acc[subIndex]) {
            acc[subIndex] = [];
        }
        acc[subIndex].push(arr[index]);
        return acc;
    }, []);
}

// Build a new UI classes.
class ActionUI {
    constructor() {}
    _rootUI = new ActionFormData();
    UserCanceledProcessor() {}
    UserBusyProcessor() {}
    UserClosedProcessor() {}
    title = "Unknown";
    message = "Unknown";
    list = [];
    func = [];
    build() {
        const rootUI = this._rootUI;
        rootUI.title(raw(this.title));
        rootUI.body(raw(this.message));
        for (const i of this.list) {
            if (typeof i === "string") {
                rootUI.button(raw(i));
            } else {
                rootUI.button(raw(i[0]), i[1]);
            }
        }
        return this;
    }
    preventBusy() {
        this.UserBusyProcessor = function (player) {
            this.show(player);
        };
        return this;
    }
    preventCanceled() {
        this.UserCanceledProcessor = function (player) {
            this.show(player);
        };
        return this;
    }
    show(player) {
        const rootUI = this._rootUI;
        return rootUI
            .show(player)
            .then(response => {
                if (!response.canceled) {
                    this.func[response.selection](player);
                }
                switch (response.cancelationReason) {
                    case "UserBusy":
                        this.UserBusyProcessor(player);
                        break;
                    case "UserClosed":
                        this.UserClosedProcessor(player);
                        break;
                    default:
                        return;
                }
                this.UserCanceledProcessor(player);
            })
            .catch(e => console.error("UI Error: ", e, e.stack));
    }
}

class MessageUI {
    constructor() {}
    _rootUI = new MessageFormData();
    UserCanceledProcessor() {}
    UserBusyProcessor() {}
    UserClosedProcessor() {}
    title = "Unknown";
    message = "Unknown";
    list = [];
    func = [];
    build() {
        const rootUI = this._rootUI;
        rootUI.title(raw(this.title));
        rootUI.body(raw(this.message));
        rootUI.button1(raw(this.list[0]));
        rootUI.button2(raw(this.list[1]));
        return this;
    }
    preventBusy() {
        this.UserBusyProcessor = function (player) {
            this.show(player);
        };
        return this;
    }
    preventCanceled() {
        this.UserCanceledProcessor = function (player) {
            this.show(player);
        };
        return this;
    }
    show(player) {
        const rootUI = this._rootUI;
        return rootUI
            .show(player)
            .then(response => {
                if (!response.canceled) {
                    this.func[response.selection](player);
                }
                switch (response.cancelationReason) {
                    case "UserBusy":
                        this.UserBusyProcessor(player);
                        break;
                    case "UserClosed":
                        this.UserClosedProcessor(player);
                        break;
                    default:
                        return;
                }
                this.UserCanceledProcessor(player);
            })
            .catch(e => console.error("UI Error: ", e, e.stack));
    }
}

class ModalUI {
    constructor() {}
    _rootUI = new ModalFormData();
    UserCanceledProcessor() {}
    UserBusyProcessor() {}
    UserClosedProcessor() {}
    title = "Unknown";
    message = "Unknown";
    list = [];
    func = function () {};
    submitMessage = "$gui.submit"; // Defined by Minecraft
    build() {
        const rootUI = this._rootUI;
        rootUI.title(raw(this.title));
        try {
            rootUI.label(raw(this.message));
        } catch {
            // empty
        }
        rootUI.submitButton(raw(this.submitMessage));
        for (const i of this.list) {
            let args = i.slice(1);
            for (let j = 0; j < args.length; j++) args[j] = raw(args[j]);
            rootUI[i[0]](...args);
        }
        return this;
    }
    preventBusy() {
        this.UserBusyProcessor = function (player) {
            this.show(player);
        };
        return this;
    }
    preventCanceled() {
        this.UserCanceledProcessor = function (player) {
            this.show(player);
        };
        return this;
    }
    show(player) {
        const rootUI = this._rootUI;
        return rootUI
            .show(player)
            .then(response => {
                if (!response.canceled) {
                    this.func(player, response.formValues);
                }
                switch (response.cancelationReason) {
                    case "UserBusy":
                        this.UserBusyProcessor(player);
                        break;
                    case "UserClosed":
                        this.UserClosedProcessor(player);
                        break;
                    default:
                        return;
                }
                this.UserCanceledProcessor(player);
            })
            .catch(e => console.error("UI Error: ", e, e.stack));
    }
}

// Special UI
class MultiPageUI {
    constructor() {}
    _rootUIs = [];
    UserCanceledProcessor() {}
    UserBusyProcessor() {}
    UserClosedProcessor() {}
    title = "Unknown";
    message = "Unknown";
    list = [];
    func = [];
    pageValue = 10;
    preventBusy() {
        this.UserBusyProcessor = function (player, page) {
            this.show(player, page);
        };
        return this;
    }
    preventCanceled() {
        this.UserCanceledProcessor = function (player) {
            this.show(player, page);
        };
        return this;
    }
    build() {
        const lists = splitArray(this.list, this.pageValue);
        const rootUIs = this._rootUIs;
        for (let i = 0; i < lists.length; i++) {
            rootUIs[i] = new ActionFormData();
            const rootUI = rootUIs[i];
            rootUI.title({
                rawtext: [
                    raw(title),
                    {
                        text: ` [${i + 1}/${lists.length}]`
                    }
                ]
            });
            rootUI.body(raw(this.message));
            rootUI.button(raw("$filmcamera.scripts.ui.MultiPageUI.last_page"));
            for (const buttonData of lists[i]) {
                if (typeof buttonData === "string") {
                    rootUI.button(raw(buttonData));
                } else {
                    rootUI.button(raw(buttonData[0]), buttonData[1]);
                }
            }
            rootUI.button(raw("$filmcamera.scripts.ui.MultiPageUI.next_page"));
        }
        return this;
    }
    show(player, pageIndex = 0) {
        const rootUIs = this._rootUIs;
        return rootUIs[pageIndex]
            .show(player)
            .then(response => {
                if (!response.canceled) {
                    const func = splitArray(this.func, this.pageValue)[
                        pageIndex
                    ];
                    if (response.selection > 0) {
                        func[response.selection](player);
                        return;
                    }
                    if (response.selection === 0) {
                        if (pageIndex === 0)
                            return rootUIs[pageIndex].show(player);
                        return rootUIs[pageIndex - 1].show(player);
                    }
                    if (response.selection === rootUIs.length) {
                        if (pageIndex === 0)
                            return rootUIs[pageIndex].show(player);
                        return rootUIs[pageIndex + 1].show(player);
                    }
                }
                switch (response.cancelationReason) {
                    case "UserBusy":
                        this.UserBusyProcessor(player, pageIndex);
                        break;
                    case "UserClosed":
                        this.UserClosedProcessor(player, pageIndex);
                        break;
                    default:
                        return;
                }
                this.UserCanceledProcessor(player, pageIndex);
            })
            .catch(e => console.error("UI Error: ", e, e.stack));
    }
}

function tip(player, message, next, back) {
    const rootUI = new MessageUI();
    rootUI.title = "TIP";
    rootUI.message = message;
    rootUI.list = [
        "$filmcamera.scripts.ui.tip.next",
        "$filmcamera.scripts.ui.tip.back"
    ];
    rootUI.func = [next, back];
    rootUI.build();
    rootUI.show(player);
}

export { ActionUI, MultiPageUI, ModalUI, MessageUI, tip };
