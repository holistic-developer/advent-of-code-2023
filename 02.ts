import { readFileSync } from "fs";

type Game = {
  id: number;
  reveals: Reveal[];
};

type Reveal = {
  red: number;
  green: number;
  blue: number;
};

function parseGames(gameString: string): Game {
  const [gamePrefix, revealedList] = gameString.split(": ");
  return {
    id: Number(gamePrefix.slice(5)),
    reveals: revealedList.split("; ").map(parseReveal),
  };
}

function parseReveal(revealString: string): Reveal {
  let red = 0;
  let green = 0;
  let blue = 0;
  const picks = revealString.split(", ");
  picks.forEach((pick) => {
    const [countString, color] = pick.split(" ");
    let count = Number(countString);
    if (color.startsWith("r")) {
        red = count;
    } else if (color.startsWith("g")) {
        green = count;
    } else if (color.startsWith("b"))
        blue = count;
    }
  );

  return { red, green, blue };
}

console.log(
  readFileSync("02-input.txt")
    .toString()
    .split("\n")
    .map(parseGames)
    .filter((game) =>
      game.reveals.every((r) => r.red <= 12 && r.green <= 13 && r.blue <= 14)
    )
    .map((game) => game.id)
    .reduce((a, b) => a + b)
);

console.log(
    readFileSync("02-input.txt")
      .toString()
      .split("\n")
      .map(parseGames)
      .map((game) => {
        let maxRed = 0;
        let maxGreen = 0;
        let maxBlue = 0;

        game.reveals.forEach(r => {
            maxRed = Math.max(maxRed, r.red)
            maxGreen = Math.max(maxGreen, r.green)
            maxBlue = Math.max(maxBlue, r.blue)
        })
        return {maxRed, maxGreen, maxBlue}
      })
      .map((game) => game.maxRed * game.maxGreen * game.maxBlue)
      .reduce((a, b) => a + b)
  );