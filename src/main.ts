import {
	MarkdownView,
	Notice,
	Plugin,
	TFile,
} from "obsidian";

import {
    isWritingFile,
	updateActiveWritingMode,
	updateWritingMode,
} from "./editor/writing-mode";

import {
	writingKeybindings,
	writingShortcuts,
} from "./editor/keybindings";

import { writingDecorations } from "./editor/decorations";


export default class SimpleWritingPlugin extends Plugin {
	async onload() {

		this.registerEditorExtension(writingKeybindings);
		this.registerEditorExtension(writingShortcuts);
		this.registerEditorExtension(writingDecorations);

		this.addCommand({
			id: "insert-chapter",
			name: "Insert chapter",
			editorCallback: (editor) => {
				editor.replaceSelection("[chapter] ");
			},
		});

		this.addCommand({
			id: "insert-tab-marker",
			name: "Start paragraph with indentation in the line",
			editorCallback: (editor) => {
				editor.replaceSelection("[startParagraph]");
			},
		});

		// Atualiza quando mudamos de arquivo/aba
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				updateActiveWritingMode(this);
			}),
		);

		// Atualiza quando o frontmatter de um arquivo muda
		this.registerEvent(
			this.app.metadataCache.on("changed", (file) => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);

				if (view && view.file === file) {
					updateWritingMode(view);
				}
			}),
		);

		// Ícone na ribbon
		this.addRibbonIcon(
			"book-open",
			"Writing Mode: ON",
			async () => {
				await this.toggleWritingMode();
			},
		);

		// Aplica o modo ao arquivo que já estava aberto quando o plugin carregou
		updateActiveWritingMode(this);

		//console.log("Simple Writing Plugin carregado.");
	}

	private async toggleWritingMode(): Promise<void> {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);

		if (!view || !view.file) {
			new Notice("Open a Markdown file first.");
			return;
		}

		const writingFile = isWritingFile(view);

		await this.app.fileManager.processFrontMatter(
			view.file,
			(frontmatter: Record<string, unknown>) => {
				if (writingFile) {
					delete frontmatter.type;
				} else {
					frontmatter.type = "writing";
				}
			},
		);

		updateWritingMode(view);

		new Notice(
			writingFile
				? "Writing Mode disabled."
				: "Writing Mode enabled.",
		);
	}

	private async setWritingFrontmatter(file: TFile): Promise<void> {
		await this.app.fileManager.processFrontMatter(
			file,
			(frontmatter: Record<string, unknown>) => {
				frontmatter.type = "writing";
			},
		);
	}

	
}