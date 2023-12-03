import { readFileSync } from "fs";

const inputString = readFileSync("03-input.txt").toString();
const schematic = inputString.split("\n");
const maxLineIndex = schematic[0].length - 1;

type NumberLocation = {
  lineNumber: number;
  startIndex: number;
  numberLength: number;
  number: number;
};

function findNumberLocations(schematic: string[]): NumberLocation[] {
  const locations: NumberLocation[] = [];

  for (let lineNumber = 0; lineNumber < schematic.length; lineNumber++) {
    const regex = /\d+/g;
    const line = schematic[lineNumber];
    let match;

    while ((match = regex.exec(line)) != null) {
      locations.push({
        lineNumber: lineNumber,
        startIndex: match.index,
        numberLength: regex.lastIndex - match.index,
        number: Number(line.substring(match.index, regex.lastIndex)),
      });
    }
  }

  return locations;
}

function hasSymbolNeighbour(location: NumberLocation): boolean {
  const lookaroundStartIndex = Math.max(0, location.startIndex - 1);
  const lookaraoundEndIndex = Math.min(
    location.startIndex + location.numberLength + 1,
    maxLineIndex
  );
  let neighbours = "";
  if (location.lineNumber > 0) {
    neighbours += schematic[location.lineNumber - 1].substring(
      lookaroundStartIndex,
      lookaraoundEndIndex
    );
  }
  if (location.lineNumber < schematic.length - 1) {
    neighbours += schematic[location.lineNumber + 1].substring(
      lookaroundStartIndex,
      lookaraoundEndIndex
    );
  }
  if (location.startIndex > 0) {
    neighbours += schematic[location.lineNumber][location.startIndex - 1];
  }
  if (location.startIndex + location.numberLength < maxLineIndex) {
    neighbours +=
      schematic[location.lineNumber][
        location.startIndex + location.numberLength
      ];
  }
  return neighbours.split("").some((c) => c != ".");
}

const numberLocations = findNumberLocations(schematic);

console.log(
  numberLocations
    .filter(hasSymbolNeighbour)
    .map((nl) => nl.number)
    .reduce((a, b) => a + b)
);

// stage 2

type GearWithNumber = {
  gearLineNumber: number;
  gearIndex: number;
  number: number;
};

function extractGear(
  line: string,
  lineNumber: number,
  startIndex: number,
  adjacentNumber: number
): GearWithNumber | null {
  return (
    line
      .split("")
      .map((c, i) => {
        if (c == "*")
          return {
            gearLineNumber: lineNumber,
            gearIndex: i + startIndex,
            number: adjacentNumber,
          };
        return null;
      })
      .filter(Boolean)[0] ?? null
  );
}

function toGearWithNumber(location: NumberLocation): GearWithNumber {
  const lookaroundStartIndex = Math.max(0, location.startIndex - 1);
  const lookaraoundEndIndex = Math.min(
    location.startIndex + location.numberLength + 1,
    maxLineIndex
  );
  let gear;

  if (location.lineNumber > 0) {
    gear = extractGear(
      schematic[location.lineNumber - 1].substring(
        lookaroundStartIndex,
        lookaraoundEndIndex
      ),
      location.lineNumber - 1,
      lookaroundStartIndex,
      location.number
    );
  }
  if (gear != null) return gear;

  if (location.lineNumber < schematic.length - 1) {
    gear = extractGear(
      schematic[location.lineNumber + 1].substring(
        lookaroundStartIndex,
        lookaraoundEndIndex
      ),
      location.lineNumber + 1,
      lookaroundStartIndex,
      location.number
    );
  }
  if (gear != null) return gear;

  if (location.startIndex > 0) {
    gear = extractGear(
      schematic[location.lineNumber][location.startIndex - 1],
      location.lineNumber,
      location.startIndex - 1,
      location.number
    );
  }
  if (gear != null) return gear;

  if (location.startIndex + location.numberLength < maxLineIndex) {
    gear = extractGear(
      schematic[location.lineNumber][
        location.startIndex + location.numberLength
      ],
      location.lineNumber,
      location.startIndex + location.numberLength,
      location.number
    );
  }
  return gear;
}

const gears = numberLocations
  .map(toGearWithNumber)
  .filter(Boolean)
  .reduce<Record<string, number[]>>((gears, g) => {
    const gearId = g.gearLineNumber + ":" + g.gearIndex;
    const gear = gears[gearId] || [];
    gear.push(g.number);
    return { ...gears, [gearId]: gear };
  }, {});

console.log(
  Object.entries(gears)
    .filter(([id, numbers]) => numbers.length == 2)
    .map(([_, numbers]) => numbers[0] * numbers[1])
    .reduce((a,b) => a+b)
);
