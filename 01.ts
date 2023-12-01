import { readFileSync } from 'fs';

console.log(
    readFileSync('01-input.txt')
        .toString()
        .split("\n")
        .map(line =>
            "" +
            /\d/.exec(line) + // first digit
            /\d/.exec(line.split("").reverse().join(""))) // last digit
        .map(Number)
        .reduce((a, b) => a + b)
)

console.log(
    readFileSync('01-input.txt')
        .toString()
        .split("\n")
        .map(line =>
            "" +
            /\d|one|two|three|four|five|six|seven|eight|nine/.exec(line) + // first digit
            " " + // prevent wrong replacements afterwards
            /\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/.exec(line.split("").reverse().join(""))) // last digit
        .map(line => line
            .replace('one', '1')
            .replace('two', '2')
            .replace('three', '3')
            .replace('four', '4')
            .replace('five', '5')
            .replace('six', '6')
            .replace('seven', '7')
            .replace('eight', '8')
            .replace('nine', '9')
            .replace('eno', '1')
            .replace('owt', '2')
            .replace('eerht', '3')
            .replace('ruof', '4')
            .replace('evif', '5')
            .replace('xis', '6')
            .replace('neves', '7')
            .replace('thgie', '8')
            .replace('enin', '9')
            .replace(' ', ''))
        .map(Number)
        .reduce((a, b) => a + b)
)