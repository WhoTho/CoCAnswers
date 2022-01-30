const settings = {
    maxPrintMatchesLength: 25,
};

function searchByInfo(authorName, testCaseInput, testCaseOutput) {
    if (authorName + testCaseInput + testCaseOutput === "") return masterFileRead;
    return masterFileRead.filter((e) => {
        return (
            e.author === authorName ||
            e.testCases.some((t) => {
                return (
                    (testCaseInput === "" || t[0] === testCaseInput) &&
                    (testCaseOutput === "" || t[1] === testCaseOutput) &&
                    testCaseInput + testCaseOutput !== ""
                );
            })
        );
    });
}

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
    if (boldedText !== "") {
        var boldedLabel = document.createElement("span");
        boldedLabel.classList.add(params.boldClass);
        boldedLabel.innerHTML = `<strong>${boldedText}: </strong>${params.afterBoldText}`;
        showText.appendChild(boldedLabel);
    }

    if (regularText !== "") {
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

        //Solution info
        if (cocSolutions.length === 0) {
            showAll.appendChild(createBoldAndText("SOLUTIONS", "No solution avalible"));
        } else {
            var showSolution = document.createElement("div");
            showSolution.classList.add("resultAllSolutions");
            //For each solution
            cocSolutions.forEach((sol, indexSol) => {
                //Create solution card
                var solutionInfoCard = document.createElement("div");
                solutionInfoCard.classList.add("resultInfoSolution");

                //Make clickable
                solutionInfoCard.setAttribute("onclick", `copySolution(${masterFileRead.indexOf(data)}, ${indexSol})`);

                //Add info
                solutionInfoCard.appendChild(createBoldAndText("Language", sol.lang));
                solutionInfoCard.appendChild(createBoldAndText("Characters", sol.solution.replace(/\\/g, "").length));
                solutionInfoCard.appendChild(createBoldAndText("Solution", sol.solution, { afterBoldText: "<br>" }));

                showSolution.appendChild(solutionInfoCard);
            });

            showAll.appendChild(createBoldAndText("SOLUTIONS", ""));
            showAll.appendChild(showSolution);
        }

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

    var currentMatches = searchByInfo(searchAuthor, searchTestCaseInput, searchTestCaseOutput);

    // if (searchAuthor !== "") {
    //     console.log(`search author: ${searchAuthor}`);
    //     currentMatches = searchByAuthor(searchAuthor, currentMatches);
    // }
    // if (searchTestCaseInput !== "" && searchTestCaseOutput !== "") {
    //     console.log(`Testcase input: ${searchTestCaseInput}`);
    //     console.log(`Testcase output: ${searchTestCaseOutput}`);
    //     currentMatches = searchByTestCase(searchTestCaseInput, searchTestCaseOutput, currentMatches);
    // }

    console.log("Got matches");
    //console.log(currentMatches);
    printResults(currentMatches);
}

function solutionInfoCount() {
    var hasSolution = 0;
    var cocAmount = 0;

    masterFileRead.forEach((e) => {
        if (e.solutions.length !== 0) hasSolution++;
        cocAmount++;
    });

    document.getElementById(
        "answerCountInfo"
    ).innerText = `There are currently ${hasSolution} answers outs of ${cocAmount} (${(
        (hasSolution / cocAmount) *
        100
    ).toFixed(2)}%)`;
}

function copySolution(masterIndex, solutionIndex) {
    navigator.clipboard.writeText(masterFileRead[masterIndex].solutions[solutionIndex].solution);
}
