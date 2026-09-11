import { MarkdownView, Plugin } from "obsidian";

export function isWritingFile(view: MarkdownView): boolean {
	if (!view.file) {
		return false;
	}

	const cache = view.app.metadataCache.getFileCache(view.file);

	return cache?.frontmatter?.type === "writing";
}

export function updateWritingMode(view: MarkdownView): void {
	if (isWritingFile(view)) {
		view.containerEl.addClass("writing-mode");
	} else {
		view.containerEl.removeClass("writing-mode");
	}
}

export function updateActiveWritingMode(plugin: Plugin): void {
	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);

	if (view) {
		updateWritingMode(view);
	}
}