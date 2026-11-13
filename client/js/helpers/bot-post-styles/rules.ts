import type {BotPostStyleRule} from "./types";

const bridgeSenders = [
	"chatbot",
	"sauron",
	"aurarelay",
	"willie",
	"darkpeers",
	"dp",
	"endor",
	"bbot",
	"mellos",
	"bot",
	"luminarr",
	"msbridge",
	"bridgebot",
	"wall-e",
	"rocketnouncer",
	"ulcx",
	"yus",
];

export const botPostStyleRules: BotPostStyleRule[] = [
	{
		name: "DarkPeers request",
		when: {
			sender: ["darkpeers", "dp"],
			text: /^\[New-Request\]-\[Name: (?<name>.+?)\]-\[Category: (?<category>.+?)\]-\[Type: (?<type>.+?)\]-\[Bounty: (?<bounty>[\d.]+)\]-\[Link: (?<link>https?:\/\/\S+)\]$/iu,
		},
		classes: ["bot-post--darkpeers-request"],
		transform(message) {
			const match = message.text?.match(
				/^\[New-Request\]-\[Name: (?<name>.+?)\]-\[Category: (?<category>.+?)\]-\[Type: (?<type>.+?)\]-\[Bounty: (?<bounty>[\d.]+)\]-\[Link: (?<link>https?:\/\/\S+)\]$/iu
			);

			const groups = match?.groups;

			if (!groups) {
				return;
			}

			return {
				displayNick: "New-Request 📺",
				senderType: "bot",
				text: `\x04${"00BCD4"}[${groups.type}]\x0f ${groups.name} \x02(${groups.bounty} BON)\x0f - ${groups.link}`,
				classes: ["bot-post--darkpeers-request"],
			};
		},
	},
	{
		name: "Shoutbox bridge relay",
		when: {
			sender: bridgeSenders,
			text: /^(?:\[.*\]|<.*>|».*«)/u,
		},
		classes: ["bot-post--relay"],
	},
	{
		name: "Web relay nick",
		when: {
			sender: /-web$/iu,
		},
		classes: ["bot-post--relay-web"],
	},
];
