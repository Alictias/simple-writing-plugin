import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView,
	ViewPlugin,
	ViewUpdate,
} from "@codemirror/view";

const chapterMarker = Decoration.mark({
	class: "writing-chapter-marker",
});

const chapterTitle = Decoration.mark({
	class: "writing-chapter-title",
});

const tabMarker = Decoration.mark({
	class: "writing-tab-marker",
});

const indentedText = Decoration.mark({
	class: "writing-indented-text",
});

function buildDecorations(view: EditorView): DecorationSet {
	const builder = new RangeSetBuilder<Decoration>();

	for (const { from, to } of view.visibleRanges) {
		let position = from;

		while (position <= to) {
			const line = view.state.doc.lineAt(position);
			const text = line.text;

			if (text.startsWith("[startParagraph]")) {
			const markerEnd = line.from + "[startParagraph]".length;

			builder.add(
				line.from,
				markerEnd,
				tabMarker,
			);

			if (text.length > "[startParagraph]".length) {
				builder.add(
					markerEnd,
					line.to,
					indentedText,
				);
			}
		}

			if (text.startsWith("[chapter]")) {
				const markerEnd = line.from + "[chapter]".length;

				builder.add(
					line.from,
					markerEnd,
					chapterMarker,
				);

				if (text.length > "[chapter]".length) {
					builder.add(
						markerEnd,
						line.to,
						chapterTitle,
					);
				}
			}

			if (line.to >= to) {
				break;
			}

			position = line.to + 1;
		}
	}

	return builder.finish();
}

class WritingDecorations {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = buildDecorations(view);
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = buildDecorations(update.view);
		}
	}
}

export const writingDecorations = ViewPlugin.fromClass(
	WritingDecorations,
	{
		decorations: (value) => value.decorations,
	},
);