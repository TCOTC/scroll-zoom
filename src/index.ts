import {
    Plugin,
    adjustEditorFontSize,
    getAllEditor,
    showMessage,
} from "siyuan";
import type zhCN from "./i18n/zh-CN.json";
import {
    EditorFontSizeWheelZoom,
    WHEEL_LISTENER_OPTIONS,
} from "./wheelZoom";

export default class ScrollZoomPlugin extends Plugin {
    declare i18n: typeof zhCN;

    private readonly wheelZoom = new EditorFontSizeWheelZoom();
    private readonly boundElements = new Set<HTMLElement>();

    onload() {
        if (typeof adjustEditorFontSize !== "function") {
            showMessage(`${this.displayName}: ${this.i18n.needAdjustEditorFontSize}`);
            return;
        }
        this.eventBus.on("loaded-protyle-static", this.onLoadedProtyle);
        this.eventBus.on("destroy-protyle", this.onDestroyProtyle);
    }

    onLayoutReady() {
        if (typeof adjustEditorFontSize !== "function") {
            return;
        }
        getAllEditor().forEach((editor) => {
            this.bindContentElement(editor.protyle?.contentElement);
        });
    }

    onunload() {
        this.eventBus.off("loaded-protyle-static", this.onLoadedProtyle);
        this.eventBus.off("destroy-protyle", this.onDestroyProtyle);
        this.unbindAll();
        this.wheelZoom.destroy();
    }

    private readonly onLoadedProtyle = ({detail}: CustomEvent<{protyle?: {contentElement?: HTMLElement;};}>) => {
        this.bindContentElement(detail.protyle?.contentElement);
    };

    private readonly onDestroyProtyle = ({detail}: CustomEvent<{protyle?: {contentElement?: HTMLElement;};}>) => {
        this.unbindContentElement(detail.protyle?.contentElement);
    };

    private bindContentElement(element?: HTMLElement) {
        if (!element || this.boundElements.has(element)) {
            return;
        }
        element.addEventListener("wheel", this.wheelZoom.handleWheel, WHEEL_LISTENER_OPTIONS);
        this.boundElements.add(element);
    }

    private unbindContentElement(element?: HTMLElement) {
        if (!element || !this.boundElements.has(element)) {
            return;
        }
        element.removeEventListener("wheel", this.wheelZoom.handleWheel, WHEEL_LISTENER_OPTIONS);
        this.boundElements.delete(element);
    }

    private unbindAll() {
        this.boundElements.forEach((element) => {
            element.removeEventListener("wheel", this.wheelZoom.handleWheel, WHEEL_LISTENER_OPTIONS);
        });
        this.boundElements.clear();
    }
}
