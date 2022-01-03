var masterFileRead = [{ title: "TITLE", author: "AUTHOR", testCases: [["INPUT", "OUTPUT"]], solution: "SOLUTION" }];

const settings = {
    maxPrintMatchesLength: 5,
};

// function processUserCommand(cmd) {
//     try {
//         const splitCmd = cmd.split(" ");
//         if (splitCmd[0] === "search") {
//             printMatchArray(splitCmd[1], splitCmd[2], filterBy(splitCmd[1], splitCmd.slice(3).join(" ")));
//         } else if (cmd === "reload") {
//             loadAnswerFile();
//         } else if (cmd === "exit" || cmd === "quit") {
//             process.exit(1);
//         } else {
//             console.log("Unknown command");
//         }
//         return;
//     } catch (err) {
//         console.error(err);
//         return;
//     }
// }

// function filterBy(mode, match) {
//     let matchesList = [];
//     if (mode === "author") {
//         masterFileRead.forEach((e) => {
//             if (e.author === match) matchesList.push(e);
//         });
//     } else if (mode === "title") {
//         masterFileRead.forEach((e) => {
//             if (e.title === match) matchesList.push(e);
//         });
//     } else if (mode === "testCases") {
//         console.log("testCase filtering not working");
//         // return
//         // log("match", match);
//         // if (!Array.isArray(eval(match))) {
//         //     // REMOVE EVAL MAKE IT BETTER
//         //     console.log(`Invalid match type (${typeof match}) with mode (testCases)`);
//         //     return [];
//         // }
//         // const matchArray = Array.from(eval(match));
//         // log("matchArray", matchArray);
//         // masterFileRead.forEach((e) => {
//         //     const testCases = e.testCases;
//         //     if (matchArray.every((v) => testCases.includes(v))) matchesList.push(e);
//         // });
//     } else {
//         console.log("Invalid filter type");
//     }
//     // console.log(matchesF);
//     return matchesList;
// }

// function printMatchArray(search, logType, matches) {
//     if (!["all", "testCases", "author", "title", "solution"].includes(logType)) {
//         console.log("Invalid logging type");
//         return;
//     }
//     console.log(`Matched ${search} ${matches.length} time(s) || Printing ${logType} information`);

//     if (matches.length > settings.maxPrintMatchesLength) {
//         console.log(`Showing first ${settings.maxPrintMatchesLength} matches`);
//         matches = matches.slice(0, settings.maxPrintMatchesLength);
//     }

//     matches.forEach((e, i) => {
//         console.log(`\n++++++++++++++\n${i + 1}.\n`);
//         if (logType === "all") console.log(e);
//         else if (logType === "testCases") {
//             e.testCases.forEach((t) => {
//                 console.log(`INPUT:\n${t[0]}\n`);
//                 console.log(`OUTPUT:\n${t[1]}\n------\n`);
//             });
//         } else console.log(eval(`e.${logType}`));
//     });
//     console.log("\n++++++++++++++\n");
// }

async function loadAnswerFile() {
    try {
        masterFileRead = await require("./answers")["ANSWERS"];
    } catch (err) {
        // console.log("Error loading data");
        // console.log(err);
        return;
    }
    // console.log("Loaded data");
    // console.log(masterFileRead);
}

function searchByAuthor(authorName) {
    let matchesList = [];
    masterFileRead.forEach((e) => {
        if (e.author === match) matchesList.push(e);
    });
    return matchesList;
}

function clearSearchResults() {
    var div = document.getElementById("results");

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    return;
}

function printResults(matchArray) {
    var div = document.getElementById("results");
    matchArray.forEach((data) => {
        var showTemp = document.createElement("div");
        showTemp.classList.add("resultCard");
        showTitle = `<p><strong>TITLE: </strong>${data.title}</p>`;
        showAuthor = `<p><strong>AUTHOR: </strong>${data.author}</p>`;
        showSolution = `<p><strong>Solution: </strong><br>${data.solution}</p>`;
        showTemp.innerHTML = showTitle + showAuthor + showSolution;
        div.appendChild(showTemp);
    });
}

async function test() {
    await clearSearchResults();
    var searchQuery = document.getElementById("authorInput").value;
    var matches = await searchByAuthor(searchQuery);
    printResults(matches);
}

//Start code
async function startCode() {
    await loadAnswerFile();
}

startCode();
