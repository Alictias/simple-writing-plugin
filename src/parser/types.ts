export type WritingLineType =
	| "chapter"
	| "indented"
	| "dialogue"
	| "paragraph"
	| "empty";

export interface WritingLine {
	type: WritingLineType;
	content: string;
}