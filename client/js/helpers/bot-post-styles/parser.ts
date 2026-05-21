import {toRaw} from "vue";

import type {SharedMsg} from "../../../../shared/types/msg";
import {botPostStyleRules} from "./rules";
import type {BotPostStyleMatcher} from "./types";

export function applyBotPostStyles(originalMessage: SharedMsg) {
	const sender = originalMessage.from?.original_nick?.toLowerCase() ?? originalMessage.from?.nick?.toLowerCase();

	if (!sender || !originalMessage.text) {
		return originalMessage;
	}

	const classes = new Set<string>();
	let messageText = originalMessage.text;

	for (const rule of botPostStyleRules) {
		if (matchesRule(rule.when, sender, originalMessage.text, originalMessage)) {
			for (const className of rule.classes) {
				classes.add(className);
			}

			const transformResult = rule.transform?.(originalMessage);

			if (transformResult?.text) {
				messageText = transformResult.text;
			}

			if (transformResult?.classes) {
				for (const className of transformResult.classes) {
					classes.add(className);
				}
			}
		}
	}

	if (classes.size === 0) {
		return originalMessage;
	}

	const message = structuredClone(toRaw(originalMessage));

	if (messageText !== undefined) {
		message.text = messageText;
	}

	message.botStyles = [...classes];

	return message;
}

function matchesRule(
	matcher: BotPostStyleMatcher,
	sender: string,
	text: string,
	message: SharedMsg
) {
	if (typeof matcher.sender !== "undefined") {
		if (Array.isArray(matcher.sender)) {
			if (!matcher.sender.includes(sender)) {
				return false;
			}
		} else if (matcher.sender instanceof RegExp) {
			if (!matcher.sender.test(sender)) {
				return false;
			}
		} else if (!matcher.sender(sender, message)) {
			return false;
		}
	}

	if (typeof matcher.text !== "undefined") {
		if (matcher.text instanceof RegExp) {
			if (!matcher.text.test(text)) {
				return false;
			}
		} else if (!matcher.text(text, message)) {
			return false;
		}
	}

	return true;
}
