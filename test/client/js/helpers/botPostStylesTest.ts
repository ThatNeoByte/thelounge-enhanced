import {expect} from "chai";

import {applyBotPostStyles} from "../../../../client/js/helpers/bot-post-styles/index.js";
import type {SharedMsg} from "../../../../shared/types/msg.js";

describe("bot post styles helper", () => {
	it("should add style classes for known bridged bot posts", () => {
		const message: SharedMsg = {
			id: 1,
			time: new Date(),
			text: "[nick] hello there",
			users: [],
			from: {
				mode: "",
				nick: "chatbot",
			},
		};

		const styledMessage = applyBotPostStyles(message);

		expect(styledMessage).to.not.equal(message);
		expect(styledMessage.botStyles).to.deep.equal(["bot-post--relay"]);
	});

	it("should match bridged messages by original sender", () => {
		const message: SharedMsg = {
			id: 2,
			time: new Date(),
			text: "[nick] hello there",
			users: [],
			from: {
				mode: "",
				nick: "nick",
				original_nick: "bridgebot",
				shoutbox: true,
			},
		};

		const styledMessage = applyBotPostStyles(message);

		expect(styledMessage.botStyles).to.deep.equal(["bot-post--relay"]);
	});

	it("should leave unmatched messages untouched", () => {
		const message: SharedMsg = {
			id: 3,
			time: new Date(),
			text: "plain message",
			users: [],
			from: {
				mode: "",
				nick: "regularuser",
			},
		};

		const styledMessage = applyBotPostStyles(message);

		expect(styledMessage).to.equal(message);
		expect(styledMessage.botStyles).to.be.undefined;
	});

	it("should format DarkPeers request posts", () => {
		const message: SharedMsg = {
			id: 4,
			time: new Date(),
			text: "[New-Request]-[Name: Squatters]-[Category: TV]-[Type: WEB-DL]-[Bounty: 10000.00]-[Link: https://darkpeers.org/requests/1689]",
			users: [],
			from: {
				mode: "",
				nick: "dp",
			},
		};

		const styledMessage = applyBotPostStyles(message);

		expect(styledMessage.text).to.equal(
			"<New-Request 📺> [color=#00BCD4][WEB-DL][/color] Squatters [b](10000.00 BON)[/b] - https://darkpeers.org/requests/1689"
		);
		expect(styledMessage.botStyles).to.include("bot-post--darkpeers-request");
	});
});
