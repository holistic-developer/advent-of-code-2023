import { log } from "console";
import { readFileSync } from "fs";

const inputString = readFileSync("test-input.txt").toString();

const maps = inputString.split("\n\n").map((map) => map.split(/:\s/)[1]);

function getLookupFunciton(almanac: string): (number) => number {
	const mappings = almanac
		.split("\n")
		.map((line) => line.split(" ").map(Number));
	return (input) => {
		const lookup = mappings
			.filter(
				([_, source, steps]) => input >= source && input <= source + steps
			)
			.map(([dest, source, _]) => dest + (input - source));
		return lookup[0] ?? input;
	};
}

const seeds = maps[0].split(" ").map(Number);
const seedToSoil = getLookupFunciton(maps[1]);
const soilToFertilizer = getLookupFunciton(maps[2]);
const fertilzerToWater = getLookupFunciton(maps[3]);
const waterToLight = getLookupFunciton(maps[4]);
const lightToTemperature = getLookupFunciton(maps[5]);
const temperatureToHumidity = getLookupFunciton(maps[6]);
const humidityToLocation = getLookupFunciton(maps[7]);

log(
	Math.min(
		...seeds
			.map(seedToSoil)
			.map(soilToFertilizer)
			.map(fertilzerToWater)
			.map(waterToLight)
			.map(lightToTemperature)
			.map(temperatureToHumidity)
			.map(humidityToLocation)
	)
);

type Range = {
	lowerBound: number;
	higherBound: number;
	offset: number;
};

const seedRanges: Range[] = [];

for (let index = 0; index < seeds.length; index += 2) {
	seedRanges.push({
		lowerBound: seeds[index],
		higherBound: seeds[index] + seeds[index + 1],
		offset: 0,
	});
}

const mappings: Range[][] = maps.slice(1).map((mapping) =>
	mapping.split("\n").map((line) => {
		const [dest, source, length] = line.split(" ").map(Number);
		return {
			lowerBound: source,
			higherBound: source + length,
			offset: dest - source,
		};
	})
);

log(mappings);
log(seedRanges);

// lower than 20283861
// flatten mappings into 1
// use lowest bound
