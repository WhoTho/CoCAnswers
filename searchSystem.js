const settings = {
    maxPrintMatchesLength: 25,
};

function searchByAuthor(authorName, currentMatchArray) {
    return currentMatchArray.filter((e) => {
        return e.author === authorName;
    });
}

function searchByTestCase(testCaseInput, testCaseOutput, currentMatchArray) {
    return currentMatchArray.filter((e) => {
        return e.testCases.some((t) => {
            return t[0] === testCaseInput && t[1] === testCaseOutput;
        });
    });
}

function clearSearchResults() {
    try {
        var div = document.getElementById("results");

        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        return;
    } catch (err) {
        console.log(err);
        return;
    }
}

function createBoldAndText(boldedText, regularText, paramsIn = {}) {
    var params = {
        afterBoldText: paramsIn.afterBoldText ?? "",
        mainClass: paramsIn.mainClass ?? "resultInfoText",
        boldClass: paramsIn.boldClass ?? "boldedLabelText",
        textClass: paramsIn.textClass ?? "textLabelText",
    };

    //Main holder
    var showText = document.createElement("pre");
    showText.classList.add(params.mainClass);

    //Info
    if (boldedLabel !== "") {
        var boldedLabel = document.createElement("span");
        boldedLabel.classList.add(params.boldClass);
        boldedLabel.innerHTML = `<strong>${boldedText}: </strong>${params.afterBoldText}`;
        showText.appendChild(boldedLabel);
    }

    if (textLabel !== "") {
        var textLabel = document.createElement("span");
        textLabel.classList.add(params.textClass);
        textLabel.innerText = regularText;
        showText.appendChild(textLabel);
    }

    return showText;
}

function printResults(matchArray) {
    if (matchArray.length > settings.maxPrintMatchesLength) {
        document.getElementById(
            "resultAmount"
        ).innerText = `Found ${matchArray.length} results, only showing first ${settings.maxPrintMatchesLength}`;
        matchArray = matchArray.slice(0, settings.maxPrintMatchesLength);
    } else {
        document.getElementById("resultAmount").innerText = `Found ${matchArray.length} results`;
    }

    var div = document.getElementById("results");
    matchArray.forEach((data) => {
        var showAll = document.createElement("div");
        showAll.classList.add("resultCard");

        //Make it clickable with copy
        //showAll.setAttribute("onclick", `copySolution(${masterFileRead.indexOf(data)})`);

        //Title info
        showAll.appendChild(createBoldAndText("TITLE", data.title));

        //Author info
        showAll.appendChild(createBoldAndText("AUTHOR", data.author));

        //Solution label
        var cocSolutions = data.solutions;
        var solutionNoneText = "";

        //Solution info
        if (cocSolutions.length === 0) {
            solutionNoneText = "No solution avalible";
        } else {
            var showSolution = document.createElement("div");
            showSolution.classList.add("resultAllSolutions");
            //For each solution
            cocSolutions.forEach((sol) => {
                //Create solution card
                var solutionInfoCard = document.createElement("div");
                solutionInfoCard.classList.add("resultInfoSolution");

                //Make clickable
                solutionInfoCard.setAttribute(
                    "onclick",
                    `copySolution(${masterFileRead.indexOf(data)}, ${data.solutions.indexOf(sol)})`
                );

                //Add info
                solutionInfoCard.appendChild(createBoldAndText("Language", sol.lang));
                solutionInfoCard.appendChild(createBoldAndText("Characters", sol.chars));
                solutionInfoCard.appendChild(createBoldAndText("Solution", sol.solution, { afterBoldText: "<br>" }));

                showSolution.appendChild(solutionInfoCard);
            });
        }

        showAll.appendChild(createBoldAndText("SOLUTIONS", solutionNoneText));
        showAll.appendChild(showSolution);

        div.appendChild(showAll);
    });
}

async function submitSearch() {
    console.log("startting search");
    await clearSearchResults();
    console.log("clearned results");

    var searchAuthor = document.getElementById("authorInput").value;

    var searchTestCaseInput = document.getElementById("testCaseInputInput").value;
    var searchTestCaseOutput = document.getElementById("testCaseOutputInput").value;

    var currentMatches = masterFileRead;

    if (searchAuthor !== "") {
        console.log(`search author: ${searchAuthor}`);
        currentMatches = searchByAuthor(searchAuthor, currentMatches);
    }
    if (searchTestCaseInput !== "" && searchTestCaseOutput !== "") {
        console.log(`Testcase input: ${searchTestCaseInput}`);
        console.log(`Testcase output: ${searchTestCaseOutput}`);
        currentMatches = searchByTestCase(searchTestCaseInput, searchTestCaseOutput, currentMatches);
    }

    console.log("Got matches");
    //console.log(currentMatches);
    printResults(currentMatches);
}

function solutionInfoCount() {
    var amount = masterFileRead.length;
    var cocAmount = 1499;
    document.getElementById(
        "answerCountInfo"
    ).innerText = `There are currently ${amount} answers outs of ${cocAmount} (${((amount / cocAmount) * 100).toFixed(
        2
    )}%)`;
}

function copySolution(masterIndex, solutionIndex) {
    navigator.clipboard.writeText(masterFileRead[masterIndex].solutions[solutionIndex].solution);
}

const masterFileRead = [
    {
        title: "Atbash Cipher",
        author: "Bryukh",
        testCases: [
            ["zyxabc", "abczyx"],
            ["svool", "hello"],
            ["abcdefghijklmnopqrstuvwxyz", "zyxwvutsrqponmlkjihgfedcba"],
            ["nmnmnmnmnm", "mnmnmnmnmn"],
            ["xlwrmtznvwlgxlnrhiformt", "codingamedotcomisruling"],
        ],
        solutions: [
            { lang: "Python", chars: 57, solution: 's=input()\nprint("".join(chr(~(ord(c)%32)+124)for c in s))' },
            { lang: "Tests", chars: 1000, solution: 'afafdg\n"asdsad"asd\nheheheheSD{}PF_#$OT$)_T T$I T$i' },
        ],
    },
    {
        title: "Zero Strike",
        author: "Bryukh",
        testCases: [
            ["100020300001", "4"],
            ["1000000000", "9"],
            ["0", "1"],
            ["123456789", "0"],
            ["10000000000000000", "16"],
            ["1020304050", "1"],
            ["1000600007000000", "6"],
        ],
        solutions: [],
    },
];
