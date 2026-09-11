import { EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

const shortcuts = [
	{ trigger: '/,', replacement: '[startParagraph] ' },
	{ trigger: '/-', replacement: '—' },
	{ trigger: '/+', replacement: '[chapter] ' },
	{ trigger: '/dialogue', replacement: '— ' },
];

export const writingKeybindings = EditorView.domEventHandlers({
	keydown(event, view) {
		if (event.key !== "Tab") {
			return false;
		}

		const editor = view.dom.closest(".writing-mode");

		if (!editor) {
			return false;
		}

		event.preventDefault();

		const { from, to } = view.state.selection.main;

		if (from !== to) {
			return true;
		}

		const line = view.state.doc.lineAt(from);

		if (from !== line.from) {
			return true;
		}

		const marker = "[tab]";

		view.dispatch({
			changes: {
				from: line.from,
				to: line.from,
				insert: marker,
			},
			selection: EditorSelection.cursor(
				line.from + marker.length,
			),
		});

		return true;
	},
});


export const writingShortcuts = EditorView.updateListener.of((update) => {
	if (!update.docChanged) {
		return;
	}

	const editor = update.view.dom.closest(".writing-mode");

	if (!editor) {
		return;
	}

	const view = update.view;
	const { from } = view.state.selection.main;

	for (const shortcut of shortcuts) {
		const triggerLength = shortcut.trigger.length;

		if (from < triggerLength) {
			continue;
		}

		const previousText = view.state.doc.sliceString(
			from - triggerLength,
			from,
		);

		if (previousText !== shortcut.trigger) {
			continue;
		}

		view.dispatch({
			changes: {
				from: from - triggerLength,
				to: from,
				insert: shortcut.replacement,
			},
		});

		return;
	}
});