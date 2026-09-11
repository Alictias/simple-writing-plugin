import { WritingLine } from "./types";

export function parseWritingLine(line: string): WritingLine {
	if (line.trim() === "") {
		return {
			type: "empty",
			content: "",
		};
	}

	if (line.startsWith("[chapter]")) {
		return {
			type: "chapter",
			content: line.slice("[chapter]".length).trim(),
		};
	}

	if (line.startsWith("[startParagraph]")) {
		return {
			type: "indented",
			content: line.slice("[startParagraph]".length),
		};
	}

	if (line.startsWith("-")) {
		return {
			type: "dialogue",
			content: line.slice(1).trim(),
		};
	}

	return {
		type: "paragraph",
		content: line,
	};
}