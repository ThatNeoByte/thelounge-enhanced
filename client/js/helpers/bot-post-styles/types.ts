import type {SharedMsg} from "../../../../shared/types/msg";

export type BotPostStyleMatcher = {
	sender?: string[] | RegExp | ((sender: string, message: SharedMsg) => boolean);
	text?: RegExp | ((text: string, message: SharedMsg) => boolean);
};

export type BotPostStyleTransformResult = {
	text?: string;
	classes?: string[];
	displayNick?: string;
	senderType?: "bot";
};

export type BotPostStyleRule = {
	name: string;
	when: BotPostStyleMatcher;
	classes: string[];
	transform?: (message: SharedMsg) => BotPostStyleTransformResult | void;
};
