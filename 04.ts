import { readFileSync } from "fs";

const inputString = readFileSync("04-input.txt").toString();

const matches = inputString
	.split("\n")
	.map((line) => {
		const [winningString, actualString] = line.split(": ")[1].split(" | ");
		return {
			winning: winningString.trim().split(/\s+/).map(Number),
			actual: actualString.trim().split(/\s+/).map(Number),
		};
	})
	.map(
		({ winning, actual }) =>
			actual.filter((v) => winning.some((w) => w == v)).length
	);

console.log(
	matches
		.map((score) => (score > 1 ? Math.pow(2, score - 1) : score))
		.reduce((a, b) => a + b)
);

const cards = matches.map((m) => {
	return {
		count: 1,
		matches: m,
	};
});

for (let cardNumber = 0; cardNumber < cards.length; cardNumber++) {
	const card = cards[cardNumber];
	if (card.matches != 0) {
		for (let index = 0; index < card.matches; index++) {
			cards[cardNumber + index + 1].count += card.count;
		}
	}
}

console.log(cards.map((c) => c.count).reduce((a, b) => a + b));
