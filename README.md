# Scroll Zoom Font Size

Hold <kbd>Ctrl</kbd> and use the mouse wheel or a trackpad pinch to adjust the SiYuan editor font size. Changes go through SiYuan's native API, same as changing the editor font size in settings.

Works on desktop, desktop windows, and browser desktop.

## Usage

Operate over the editor content area:

- **Mouse**: hold <kbd>Ctrl</kbd>, scroll up to increase the font size, scroll down to decrease it
- **Trackpad**: hold <kbd>Ctrl</kbd> and swipe with two fingers; or pinch / spread directly (browsers map pinch gestures to wheel events with <kbd>Ctrl</kbd>)

The font size range is **9–72**, matching SiYuan's editor settings.

## Notes

- <kbd>Ctrl</kbd> must be held from the start of a scroll gesture; pressing it midway does nothing. Trackpad inertia keeps emitting wheel events after you lift your fingers, so this avoids accidentally changing the font size if you press <kbd>Ctrl</kbd> after a swipe
- After a scroll gesture ends, wait about 200ms before holding <kbd>Ctrl</kbd> and scrolling again
- Horizontal scrolling does not change the font size
- Only the editor font size is adjusted; the UI is not zoomed
