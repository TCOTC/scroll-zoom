export {};

declare module "*.scss" {
    const content: Record<string, string>;
    export default content;
}

declare module "siyuan" {
    export function adjustEditorFontSize(
        action: "increase" | "decrease" | "reset",
        options?: {notify?: boolean;},
    ): number;
}
