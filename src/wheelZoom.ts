import {adjustEditorFontSize} from "siyuan";

const ZOOM_THRESHOLD = 20; // 累加 deltaY 达到阈值时改动一级字号，避免单次缩放触发多次事件导致跳级
const WHEEL_IDLE_MS = 200; // 单轮滚动的间隔时间，超过该时间后重置累加值
const EDITOR_FONT_SIZE_MIN = 9;
const EDITOR_FONT_SIZE_MAX = 72;

export const WHEEL_LISTENER_OPTIONS: AddEventListenerOptions = {passive: true}; // 调整字号有时候会滚动编辑器，目前使用 passive: true 没有解决方法

export class EditorFontSizeWheelZoom {
    private accumDeltaY = 0;
    private resetTimer = 0;
    private wheelActive = false; // 记录是否处于同一轮滚动中
    private modifierOnset = false; // 记录同一轮滚动的首次滚动是否按下 Ctrl

    readonly handleWheel = (event: WheelEvent) => {
        if (event.shiftKey || event.deltaY === 0) {
            // 用 event.shiftKey || event.deltaY === 0 检测横向滚动，因为触控板快速划动时 deltaX 可能很大，即使容器并不能发生横向滚动
            return;
        }
        // 用「首轮是否带修饰键 + 空闲窗口」避免惯性或残留累加误触
        // 浏览器无法区分触控板与鼠标滚轮 https://github.com/w3c/pointerevents/issues/596 ，浏览器将触控板双指捏合与张开映射为带 ctrlKey 的 wheel
        const modifierPressed = event.ctrlKey;
        if (!modifierPressed) {
            this.accumDeltaY = 0;
        }
        window.clearTimeout(this.resetTimer);
        this.resetTimer = window.setTimeout(() => {
            this.wheelActive = false;
            this.accumDeltaY = 0;
        }, WHEEL_IDLE_MS);
        if (!this.wheelActive) {
            this.wheelActive = true;
            this.modifierOnset = modifierPressed;
        }
        if (!modifierPressed || !this.modifierOnset) {
            // 触控板惯性会在松手后仍产生滚轮事件，避免划动后再按下 Ctrl 会调整字号 https://ld246.com/article/1764296257377
            // 要在单轮滚动的最后一个滚动事件触发之后等待 WHEEL_IDLE_MS 时间间隔之后再按下 Ctrl 滚动才能调整字号
            return;
        }
        event.stopPropagation();
        if (this.accumDeltaY !== 0 && Math.sign(event.deltaY) !== Math.sign(this.accumDeltaY)) {
            this.accumDeltaY = 0;
        }
        this.accumDeltaY += event.deltaY;
        const fontSize = window.siyuan.config.editor.fontSize;
        let stepped = false;
        if (this.accumDeltaY <= -ZOOM_THRESHOLD && fontSize < EDITOR_FONT_SIZE_MAX) {
            adjustEditorFontSize("increase");
            stepped = true;
        } else if (this.accumDeltaY >= ZOOM_THRESHOLD && fontSize > EDITOR_FONT_SIZE_MIN) {
            adjustEditorFontSize("decrease");
            stepped = true;
        }
        if (!stepped) {
            return;
        }
        this.accumDeltaY = 0;
    };

    destroy() {
        window.clearTimeout(this.resetTimer);
        this.resetTimer = 0;
        this.accumDeltaY = 0;
        this.wheelActive = false;
        this.modifierOnset = false;
    }
}
