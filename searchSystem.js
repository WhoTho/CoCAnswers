const settings = {
    maxPrintMatchesLength: 25,
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
        showAll.setAttribute("onclick", `copySolution(${masterFileRead.indexOf(data)})`);

        //Title info
        var showTitle = document.createElement("pre");
        showTitle.classList.add("resultTitle");
        var showTitleLabelBolded = document.createElement("span");
        showTitleLabelBolded.classList.add("boldedResultInfo");
        showTitleLabelBolded.innerHTML = `<strong>TITLE: </strong>`;
        var showTitleInfo = document.createElement("span");
        showTitleInfo.classList.add("resultValue");
        showTitleInfo.innerText = data.title;
        showTitle.appendChild(showTitleLabelBolded);
        showTitle.appendChild(showTitleInfo);
        showAll.appendChild(showTitle);

        //Author info
        var showAuthor = document.createElement("pre");
        showAuthor.classList.add("resultAuthor");
        var showAuthorLabelBolded = document.createElement("span");
        showAuthorLabelBolded.classList.add("boldedResultInfo");
        showAuthorLabelBolded.innerHTML = `<strong>AUTHOR: </strong>`;
        var showAuthorInfo = document.createElement("span");
        showAuthorInfo.classList.add("resultValue");
        showAuthorInfo.innerText = data.author;
        showAuthor.appendChild(showAuthorLabelBolded);
        showAuthor.appendChild(showAuthorInfo);
        showAll.appendChild(showAuthor);

        //Solution info
        var showSolution = document.createElement("pre");
        showSolution.classList.add("resultSolution");
        var showSolutionLabelBolded = document.createElement("span");
        showSolutionLabelBolded.classList.add("boldedResultInfo");
        showSolutionLabelBolded.innerHTML = `<strong>SOLUTION: </strong><br>`;
        var showSolutionInfo = document.createElement("div");
        showSolutionInfo.classList.add("resultValueSolution");
        showSolutionInfo.innerText = data.solution;
        showSolution.appendChild(showSolutionLabelBolded);
        showSolution.appendChild(showSolutionInfo);
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
    console.log(currentMatches);
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

function copySolution(solutionIndex) {
    navigator.clipboard.writeText(masterFileRead[solutionIndex].solution);
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
        solution: 's=input()\nprint("".join(chr(~(ord(c)%32)+124)for c in s))',
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
        solution: 'import re\nprint(max([*map(len,re.findall(r"0+",input()))]or[0]))',
    },
    {
        title: "Almost anagrams",
        author: "Skywalker",
        testCases: [
            ["ABC\nABCD", "1\n0"],
            ["ABCD\nABC", "0\n1"],
            ["CBA\nBCD", "1\n1"],
            ["ABABCC\nABDCD", "2\n3"],
        ],
        solution:
            "a=input()\nb=list(input())\nr=0\nfor c in sorted(a):\n    if c in b:b.remove(c)\n    else:r+=1\nprint(f'{len(b)}\n{r}')",
    },
    {
        title: "Just sort",
        author: "SlobodanZivkovic",
        testCases: [
            ["1\n1", "1"],
            ["2\n3\n2", "2 3"],
            ["2\n3\n4", "3 4"],
            [
                "50\n117\n433\n371\n115\n426\n309\n96\n272\n84\n326\n294\n101\n111\n467\n300\n34\n245\n278\n101\n203\n147\n76\n16\n122\n315\n87\n134\n492\n235\n0\n73\n172\n258\n179\n189\n415\n485\n287\n464\n2\n194\n323\n242\n235\n184\n33\n190\n278\n8\n465",
                "0 2 8 16 33 34 73 76 84 87 96 101 101 111 115 117 122 134 147 172 179 184 189 190 194 203 235 235 242 245 258 272 278 278 287 294 300 309 315 323 326 371 415 426 433 464 465 467 485 492",
            ],
        ],
        solution: 'print(*sorted(int(input())for i in"A"*int(input())))',
    },
    {
        title: "Reshape String",
        author: "Bryukh",
        testCases: [
            ["Hello Perfect World\n5", "Hello\nPerfe\nctWor\nld"],
            ["Coding Game!\n1", "C\no\nd\ni\nn\ng\nG\na\nm\ne\n!"],
            ["One Two Six\n10", "OneTwoSix"],
            ["Z\n9", "Z"],
            [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget ligula interdum orci aliquam.\n9",
                "Loremipsu\nmdolorsit\namet,cons\necteturad\nipiscinge\nlit.Praes\nentegetli\ngulainter\ndumorcial\niquam.",
            ],
            ["AaGpttaetdtoaahpcwelknre\n4", "AaGp\nttae\ntdto\naahp\ncwel\nknre"],
        ],
        solution: 's=input().replace(" ","")\nn=int(input())\nfor i in range(0,len(s),n):print(s[i:i+n])',
    },
    {
        title: "Even Digits",
        author: "Bryukh",
        testCases: [
            ["120789466", "26"],
            ["2", "2"],
            ["135797531", "0"],
            ["864222468", "42"],
            ["1000000000", "0"],
            ["0", "0"],
            ["4294967295", "18"],
        ],
        solution: "print(sum(x for x in map(int,input())if x&1^1))",
    },
    {
        title: "Diagonal Words",
        author: "Bryukh",
        testCases: [
            ["4\nmooa\noano\notio\nioon", "main anti"],
            ["3\nxoo\noxo\noxx", "xxx oxo"],
            ["1\na", "a a"],
            ["2\ncx\ncx", "cx xc"],
            [
                "10\nloremipsum\ndolorsitam\netconsecte\nturadipisc\ningelitnul\nlavenenati\nsnisinonmi\ndictumnece\nfficiturli\nberodapibu",
                "localeoelu macpinscfb",
            ],
        ],
        solution: 'n=int(input())\ng=h=""\nfor x in range(n):\n l=input()\n g+=l[x]\n h+=l[~x]\nprint(g,h)',
    },
    {
        title: "Average speed",
        author: "Nstyrl",
        testCases: [
            ["50 50", "50"],
            ["60 40", "48"],
            ["10 190", "19"],
            ["504 840", "630"],
            ["1000 250", "400"],
        ],
        solution: "a,b=map(int,input().split())\nprint(2*a*b//(a+b))",
    },
    {
        title: "ASCII Decoder",
        author: "MandM",
        testCases: [
            ["067111100105110103", "Coding"],
            ["80137", "Error"],
            [
                "048054056049049049049049055048057056049048056049048049048051050048054053049049053048057057049048053049048053",
                "068111117098108101032065115099105105",
            ],
            ["073032064109032055051051116", "I @m 733t"],
        ],
        solution: 's=input()\nif len(s)%3:input("Error")\nfor x in range(0,len(s),3):print(end=chr(int(s[x:x+3])))',
    },
    {
        title: "Suite de Syracuse",
        author: "Delgan",
        testCases: [
            ["5", "5 16 8 4 2 1"],
            ["10", "10 5 16 8 4 2 1"],
            ["1", "1"],
            ["42", "42 21 64 32 16 8 4 2 1"],
            ["85", "85 256 128 64 32 16 8 4 2 1"],
        ],
        solution: "n=int(input())\nl=[n]\nwhile n!=1:\n if n%2:n=n*3+1\n else:n//=2\n l+=[n]\nprint(*l)",
    },
    {
        title: "Outer Ring",
        author: "Bryukh",
        testCases: [
            ["4\n1 2 2 1\n2 9 9 2\n2 9 9 2\n0 2 2 0", "18"],
            ["2\n1 2\n3 4", "10"],
            ["3\n-1 2 -3\n-2 9 3\n1 -5 5", "0"],
            ["1\n9", "9"],
            [
                "10\n24 64 -66 -10 47 1 -16 68 29 47\n-82 -19 30 -88 -41 -12 31 20 -35 -99\n36 -48 36 54 -25 -76 -14 46 -22 92\n5 -4 -20 35 18 -31 80 -60 -65 10\n9 74 -32 -20 -34 57 -74 41 98 65\n69 -53 2 -56 26 92 -61 -16 66 54\n49 -31 1 -7 -23 -98 -77 -46 54 48\n-76 -92 86 98 6 -83 -7 11 -72 74\n58 -91 -73 -83 -14 -54 10 80 -79 74\n25 96 10 -75 16 66 -20 -24 -42 -69",
                "557",
            ],
            [
                "9\n-38 18 19 -48 66 5 -79 -39 41\n45 -33 73 -57 -93 63 16 -42 56\n-19 -10 0 -29 -13 26 -7 -19 2\n98 -93 -1 -84 32 -34 32 -66 12\n-11 -58 72 11 -19 -33 -56 40 89\n-16 -35 4 75 -44 -83 98 37 -49\n-16 -37 -33 84 16 -41 64 -98 -64\n-30 94 55 -92 90 2 45 68 -52\n-27 27 -68 -88 -51 57 28 75 -95",
                "-152",
            ],
        ],
        solution:
            'n=int(input())\nb=[[*map(int,input().split())]for i in"A"*n]\nprint(sum(b[r][c] for r in range(n) for c in range(n)if not r or not c or r==n-1 or c==n-1))',
    },
    {
        title: "Lucky Tickets",
        author: "Bryukh",
        testCases: [
            ["4\n123006\n111222\n000000\n557766", "true\nfalse\ntrue\nfalse"],
            ["1\n777777", "true"],
            [
                "10\n706571\n187673\n375149\n880316\n071154\n169344\n829409\n561621\n820653\n586665",
                "true\ntrue\nfalse\nfalse\nfalse\nfalse\nfalse\nfalse\nfalse\nfalse",
            ],
            [
                "10\n476953\n392095\n924753\n744078\n108126\n893749\n837756\n744609\n093911\n815806",
                "true\ntrue\ntrue\ntrue\ntrue\ntrue\ntrue\ntrue\nfalse\ntrue",
            ],
        ],
        solution:
            'n=int(input())\nfor i in"A"*n:t=input();print(str(sum(map(int,t[:3]))==sum(map(int,t[3:]))).lower())',
    },
    {
        title: "Midpoint",
        author: "Bryukh",
        testCases: [
            ["1 2\n3 5", "2 3.5"],
            ["0 0\n10 10", "5 5"],
            ["-7 42\n42 -7", "17.5 17.5"],
            ["-99 0\n-2 -10", "-50.5 -5"],
            ["-99 -99\n99 99", "0 0"],
        ],
        solution: "I=lambda:map(int,input().split())\na,b=I()\nc,d=I()\nprint(f'{(a+c)/2:g} {(b+d)/2:g}')",
    },
    {
        title: "Word shuffling",
        author: "Jyro",
        testCases: [
            ["2\nacegikmoqsuwy\nbdfhjlnprtvxz", "abcdefghijklmnopqrstuvwxyz"],
            ["1\nCodinG@me", "CodinG@me"],
            ["3\nThat's a very large word\nS\nd", "TSdhat's a very large word"],
            ["2\nW31rD w0r&\n'é²", "W'3é1²rD w0r&"],
        ],
        solution:
            'n=int(input())\nw=[]\na=""\nm=0\nfor i in"A"*n:\n word=input()\n w+=[word]\n m=max(m,len(word))\nfor i in range(m):\n for word in w:\n  if i<len(word):\n   a+=word[i]\nprint(a)',
    },
    {
        title: "GCD",
        author: "Bryukh",
        testCases: [
            ["169 104", "13"],
            ["100 250", "50"],
            ["1 1", "1"],
            ["1000000 5", "5"],
            ["104711 104717", "1"],
            ["98304 65536", "32768"],
        ],
        solution: "import math\nprint(math.gcd(int(input()),int(input())))",
    },
    {
        title: "Double Letters",
        author: "Bryukh",
        testCases: [
            ["Double letter words are cool", "2"],
            ["One", "0"],
            ["CaSe ALl GoOD BuT RABBIT", "3"],
            ["It suddenly struck me that that tiny pea pretty and blue was the Earth", "2"],
            [
                "ball been beer beet beep bell boom boot book bull butt call cell coon  dell doll door doom fall fell feel feet foot food fool fuss full gull gall hall hell heed heel hill hull hoop hood hoof hoot Jeff jeep",
                "41",
            ],
        ],
        solution: "s=input().lower()\nprint(sum(x==y for x,y in zip(s,s[1:])))",
    },
    {
        title: "The Fastest",
        author: "Bryukh",
        testCases: [
            ["4\n10:15:46\n03:59:08\n04:00:08\n03:59:09", "03:59:08"],
            ["1\n23:59:59", "23:59:59"],
            ["5\n11:11:11\n01:01:01\n13:00:00\n00:00:00\n09:59:59", "00:00:00"],
            [
                "10\n15:41:24\n21:40:40\n05:27:01\n13:37:33\n07:40:36\n08:03:28\n03:46:47\n20:05:22\n04:04:57\n04:34:40",
                "03:46:47",
            ],
            [
                "10\n19:56:21\n13:10:22\n02:07:12\n23:29:57\n19:21:43\n16:40:14\n15:17:31\n07:37:35\n12:50:16\n16:37:28",
                "02:07:12",
            ],
        ],
        solution: 'print(min([input()for i in"A"*int(input())],key=lambda x:x.split(":")))',
    },
    {
        title: "T'as la bracket ouverte !",
        author: "[CG]BOUGA",
        testCases: [
            ["()[]{}", "true"],
            ["(", "false"],
            ["(([))]", "false"],
            ["(({([({{[{()}]}})])}))(()[{}])", "true"],
        ],
        solution:
            'import re\ns=input()\nwhile s!=(s:=re.sub(r"\\(\\)|\\[\\]|{}","",s)):pass\nprint(("false","true")[s==""])',
    },
    {
        title: "Counting Nucleotides",
        author: "ikkebr",
        testCases: [
            ["AACT", "2 1 0 1"],
            ["AGCTTTTCATTCTGACTGCAACGGGCAATATGTCTCTGTGTGGATTAAAAAAAGAGTGTCTGATAGCAGC", "20 12 17 21"],
            ["TTTTCCAAGA", "3 2 1 4"],
            [
                "GCCCGCACCTGCGGCGTCTGTTTTCCTTTCTCGTCCCTCGAGACATCCTGTAGATCGTCTGGCTGACATCGCGAAGAGCTGCAATTGGTCTCATGTCAATTGTTTCACATTTCAGGCGTATGCGACCGGTTGTGTAGCTAATTGTTTCCAGCCGGATCTCCGGCGCGTCGGCGATTTAGTTAAATCCGATGTAGAGGTTGCAGAGGCTCTATGGGTGCCGTACATTTCAAACGGGTTCTTGATGTTTAGGTCGTGGGGCGTCCATTGTCCCGTAGCGTCTGCGATCACCATCGGCGCCGTTTCCATTACGGCGATAGCTTCTGCTCACGGTGTTCAGGTTCGTCAACCCCTGGGTGAACAAGGCACGTTAGTTCCCTTGCTCCGCGTTAGAGGCTCTTTCTGGGCCCTCAGGCGGTTCGTGTGGCGGTCCGCGGTACGTCGGCTCTGTTGCCATAAGTACTGCTTTTCGTTGTCCAAACTTCACAGAGGGAGCCACTGGCGACCTTGCTTCTCTCGAGGCATGGGCCGACCCCTTGGCTTTTCAGCGCTCGTGGTATCGGATGCTGCTGGCCGCCGGGCACTTCGTCTATAGGATACGTAGTAGCGTTTT",
                "93 166 174 177",
            ],
        ],
        solution: 'a=input()\nprint(*map(a.count,"ACGT"))',
    },
    {
        title: "HexaFun",
        author: "Kwekken",
        testCases: [
            ["5", "5"],
            ["FF", "255"],
            ["ADE", "2782"],
            ["4B68", "19304"],
            ["7F9C5", "522693"],
            ["83DF47", "8642375"],
        ],
        solution: "print(int(input(),16))",
    },
    {
        title: "Les premiers",
        author: "Merome",
        testCases: [
            ["10", "1\n2\n3\n5\n7"],
            ["5", "1\n2\n3\n5"],
            ["30", "1\n2\n3\n5\n7\n11\n13\n17\n19\n23\n29"],
            ["1", "1"],
        ],
        solution: "n=int(input())\nfor x in range(1,n+1):\n    if all(x%i for i in range(2,x)):print(x)",
    },
    {
        title: "Run length encoding",
        author: "polku",
        testCases: [
            ["aaaaabbbaaabbbbb", "5a3b3a5b"],
            ["AjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjZ", "1A42j1Z"],
            ["ZzzzzZzZZZzzzzzzzzzzzzzZZZZZZZZ", "1Z4z1Z1z3Z13z8Z"],
            ["abcdefghijklmnopqrstuvwxyz", "1a1b1c1d1e1f1g1h1i1j1k1l1m1n1o1p1q1r1s1t1u1v1w1x1y1z"],
        ],
        solution: "import re\nfor c,a in re.findall(r\"((.)\\2*)\",input()):print(end=f'{len(c)}{a}')",
    },
    {
        title: "des Chiffres et des Lettres",
        author: "R4N4R4M4",
        testCases: [
            ["1a2b3c4d", "abbcccdddd"],
            ["3francs6sous", "francsfrancsfrancssoussoussoussoussoussous"],
            ["18ans2main", "ansansansansansansansansansansansansansansansansansansmainmain"],
            [
                "22rue2la30n",
                "rueruerueruerueruerueruerueruerueruerueruerueruerueruerueruerueruelalannnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
            ],
            ["10moi7un0pointe", "moimoimoimoimoimoimoimoimoimoiununununununun"],
            [
                "6cent6scies6six100six6gares",
                "centcentcentcentcentcentsciessciessciessciessciessciessixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixsixgaresgaresgaresgaresgaresgares",
            ],
        ],
        solution: 'import re\nl=re.findall(r"\\d+|\\D+",input())\nfor a,s in zip(l[::2],l[1::2]):print(end=s*int(a))',
    },
    {
        title: "Factorial",
        author: "Crownie",
        testCases: [
            ["14", "8717829120"],
            ["1", "1"],
            ["32", "2631308369"],
            ["0", "0"],
        ],
        solution: 'print(str(eval("*".join(map(str,range(1,int(input())+1)))))[:10])',
    },
    {
        title: "Inventaire",
        author: "punxxy",
        testCases: [
            ["1\n1000 250 60 308 0.15", "true"],
            ["2\n2000 245 80 297 0.3\n2000 245 80 297 0.4", "false\nfalse"],
            ["2\n4500 530 250 643 1.2\n1000 245 60 297 0.3", "true\nfalse"],
            ["2\n2000 145 60 91 0.3\n1000 245 60 297 0.3", "true\nfalse"],
        ],
        solution:
            "import math\nfor i in\"A\"*int(input()):\n t=input().split(' ')\n l,a,b,s=map(int,t[:-1])\n e=float(t[-1])\n S=((a/2)*(a/2)-(b/2)*(b/2))*math.pi/e*l/1000000\n print(str(S<=s+1 and S>=s-1).lower())",
    },
    {
        title: "L System",
        author: "Aveuh",
        testCases: [
            [
                "2\n3\nA\nA -BF+AFA+FB-\nB +AF-BFB-FA+",
                "A\n-BF+AFA+FB-\n-+AF-BFB-FA+F+-BF+AFA+FB-F-BF+AFA+FB-+F+AF-BFB-FA+-",
            ],
            ["2\n5\nA\nA AB\nB A", "A\nAB\nABA\nABAAB\nABAABABA"],
            ["1\n3\nF\nF F+F-F-F+F", "F\nF+F-F-F+F\nF+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F"],
            [
                "2\n4\nX\nX F[+X]F[-X]+X\nF FF",
                "X\nF[+X]F[-X]+X\nFF[+F[+X]F[-X]+X]FF[-F[+X]F[-X]+X]+F[+X]F[-X]+X\nFFFF[+FF[+F[+X]F[-X]+X]FF[-F[+X]F[-X]+X]+F[+X]F[-X]+X]FFFF[-FF[+F[+X]F[-X]+X]FF[-F[+X]F[-X]+X]+F[+X]F[-X]+X]+FF[+F[+X]F[-X]+X]FF[-F[+X]F[-X]+X]+F[+X]F[-X]+X",
            ],
        ],
        solution:
            "nrules=int(input())\nnite=int(input())\nx=input()\nr={}\nfor i in range(nrules):\n a,b=input().split(' ')\n r[a]=b\nfor i in range(nite):\n print(x)\n nx=''\n for c in x:\n  if c in r:nx+=r[c]\n  else:nx+=c\n x=nx",
    },
    {
        title: "Logic Analayzer",
        author: "Xtreme_Alive",
        testCases: [
            ["6", "3600"],
            ["20", "40000"],
            ["1", "100"],
            ["9", "8100"],
        ],
        solution: "print(f'{int(input())**2}00')",
    },
    {
        title: "Le chemin de dominos",
        author: "SharkyRS",
        testCases: [
            ["2\n1 2\n2 3", "true"],
            ["2\n0 0\n1 1", "false"],
            ["5\n0 1\n1 2\n2 3\n3 4\n4 5", "true"],
            ["5\n0 1\n1 2\n2 3\n3 4\n5 6", "false"],
            [
                "20\n0 1\n2 3\n5 6\n1 2\n6 4\n5 0\n3 4\n4 2\n2 1\n4 5\n1 3\n3 5\n0 5\n5 2\n0 3\n3 3\n2 6\n6 1\n1 4\n4 0",
                "true",
            ],
            ["8\n0 1\n1 2\n2 3\n3 4\n4 5\n5 6\n6 1\n2 4", "false"],
        ],
        solution: "no",
    },
    {
        title: "Octant",
        author: "Delgan",
        testCases: [
            ["4\n3 4\n-8 7\n1 -5\n-9 -2", "1\n3\n6\n4"],
            ["9\n2 6\n-28 -9\n1 1\n-11 4\n49 32\n-2 19\n9 -76\n8 -5\n-1 -59", "1\n4\nundefined\n3\n0\n2\n6\n7\n5"],
            [
                "20\n48 37\n-41 70\n-62 8\n-31 -72\n0 87\n47 -15\n-60 -72\n-44 44\n38 -45\n44 74\n24 24\n68 -10\n-33 69\n92 88\n-53 -92\n-63 -7\n12 0\n-73 -72\n7 24\n-53 -88",
                "0\n2\n3\n5\nundefined\n7\n5\nundefined\n6\n1\nundefined\n7\n2\n0\n5\n4\nundefined\n4\n1\n5",
            ],
            [
                "50\n517 518\n-517 -174\n-489 697\n-5 5\n-659 -276\n-228 -458\n773 217\n-661 -600\n0 0\n320 849\n-208 39\n842 -834\n259 -237\n-953 -116\n34 -34\n183 877\n-147 -35\n289 24\n281 -830\n756 74\n-552 0\n890 -660\n-210 319\n547 -542\n985 268\n-788 968\n-441 -999\n397 -739\n-16 -178\n-819 -819\n-44 586\n-197 528\n-512 -512\n257 506\n988 -283\n-786 108\n0 67\n452 733\n-206 580\n0 -442\n777 307\n95 -141\n726 778\n-859 -941\n-169 935\n646 646\n226 0\n275 593\n-887 -55\n-797 -996",
                "1\n4\n2\nundefined\n4\n5\n0\n4\nundefined\n1\n3\n7\n7\n4\nundefined\n1\n4\n0\n6\n0\nundefined\n7\n2\n7\n0\n2\n5\n6\n5\nundefined\n2\n2\nundefined\n1\n7\n3\nundefined\n1\n2\nundefined\n0\n6\n1\n5\n2\nundefined\nundefined\n1\n4\n5",
            ],
        ],
        solution:
            'n=int(input())\nfor i in range(n):\n    x,y=map(int,input().split())\n    if x==0 or y==0 or abs(x)==abs(y):print("undefined")\n    else:print([([0,1],[7,6]),([3,2],[4,5])][x<0][y<0][abs(x)<abs(y)])',
    },
    {
        title: "L'horloge",
        author: "Azziliz",
        testCases: [
            ["03:00", "90"],
            ["00:30", "165"],
            ["06:40", "40"],
            ["01:10", "25"],
            ["11:36", "132"],
            ["9:14", "167"],
            ["06:00", "180"],
        ],
        solution: "NO",
    },
    {
        title: "Hex ip address",
        author: "rnd495",
        testCases: [
            ["192.168.173.231", "C0A8ADE7"],
            ["255.255.255.255", "FFFFFFFF"],
            ["000.010.100.001", "000A6401"],
            ["0.0.0.0", "00000000"],
        ],
        solution: "print(\"\".join(f'{int(w):02X}'for w in input().split('.')))",
    },
    {
        title: "Lowest Common Multiple",
        author: "mahmoud.hassan",
        testCases: [
            ["4\n42 6 11 83", "38346"],
            ["10\n42 6 11 83 96 17 55 85 35 87", "1512366240"],
            ["2\n3 2", "6"],
            ["3\n15 3 5", "15"],
            ["2\n5 6", "30"],
        ],
        solution: "import math\ninput()\nt=1\nfor x in map(int,input().split()):t*=x//math.gcd(t,x)\nprint(t)",
    },
    {
        title: "Odd-appearing number.",
        author: "mahmoud.hassan",
        testCases: [
            ["5\n2 4 2 4 1", "1"],
            ["7\n1 1 2 2 3 4 3", "4"],
            ["3\n1 2 1", "2"],
            ["10\n1 3 2 4 5 4 2 3 1", "5"],
        ],
        solution: "input()\nt=input().split()\nprint(min(t,key=t.count))",
    },
    {
        title: "Bitcount",
        author: "Plopx",
        testCases: [
            ["3\n5\n2\n7", "2\n1\n3"],
            ["5\n0\n1\n1024\n1025\n1057", "0\n1\n1\n2\n3"],
            ["5\n5099\n14039\n95\n6001\n6948", "9\n10\n6\n8\n6"],
            ["4\n255\n65535\n4294967295\n18446744073709551615", "8\n16\n32\n64"],
        ],
        solution: "exec('print(bin(int(input())).count(\"1\"));'*int(input()))",
    },
    {
        title: "Simple cypher",
        author: "Peterke",
        testCases: [
            ["FF00", "FF00"],
            ["0400", "4000"],
            ["800", "080"],
            ["0", "0"],
            ["10", "01"],
            ["101010", "010101"],
        ],
        solution: 's=input()+"|"\nprint("".join(b+a for a,b in zip(s[::2],s[1::2])).replace("|",""))',
    },
    {
        title: "Trouver la base",
        author: "Orabig",
        testCases: [
            ["19\n10011", "2"],
            ["42\n132", "5"],
            ["3\n3", "4"],
            ["50000\n265526", "7"],
            ["1578\n1578", "10"],
            ["124\n42", "false"],
        ],
        solution:
            'a=int(input())\nb=input()\nfor x in range(max(map(int,b))+1,10):\n    if int(b,x)==a:input(x)\nprint("false")',
    },
    {
        title: "Find the Largest Prime",
        author: "Pedromdrp",
        testCases: [
            ["5\n1\n2\n3\n4\n5", "5"],
            ["6\n0\n0\n3\n0\n0\n1", "3"],
            ["4\n2\n4\n6\n8", "2"],
            ["4\n9\n11\n7\n3", "11"],
        ],
        solution: "print(max([*map(int,open(0))][1:],key=lambda x:(all(x%i for i in range(2,x)),x)))",
    },
    {
        title: "Expressions parenthésées",
        author: "Plopx",
        testCases: [
            ["{([]){}()}", "true"],
            ["{([{S}]]6K[()]}", "false"],
            ["{C{}[{[a]}RqhL]{y2}}", "true"],
            ["{([{(O)}]){}[([]Lql[2])]", "false"],
        ],
        solution:
            'import re\ns=re.sub(r"[^\\(\\)\\[\\]{}]","",input())\nwhile s!=(s:=re.sub(r"\\(\\)|\\[\\]|{}","",s)):pass\nprint(str(len(s)<1).lower())',
    },
    {
        title: "Print the pattern",
        author: "John2",
        testCases: [
            ["4", "1234\n+123\n++12\n+++1"],
            ["2", "12\n+1"],
            ["1", "1"],
            ["3", "123\n+12\n++1"],
        ],
        solution: 't=int(input())\nfor x in range(t):print("+"*x+"".join(map(str,range(1,t-x+1))))',
    },
    {
        title: "ASCII Art",
        author: "juan.cortes",
        testCases: [
            [
                "9,-\n(\\_/),/ @ @ \\,( > o < ),(')_(')",
                "-----------(\\_/)\n----------/ @ @ \\\n---------( > o < )\n----------(')_(')",
            ],
            ["0,*\n(\\_/),(='.'=),(\")_(\")", "*(\\_/)\n(='.'=)\n(\")_(\")"],
            [
                "9,-\n(\\_/),/ @ @ \\,( > o < ),(')_(')",
                "-----------(\\_/)\n----------/ @ @ \\\n---------( > o < )\n----------(')_(')",
            ],
            ["9,>\n.---.,|__8|,|o o|,.===.", ">>>>>>>>>.---.\n>>>>>>>>>|__8|\n>>>>>>>>>|o o|\n>>>>>>>>>.===."],
            [
                "0,.\n\\\\\\///,/ _  _ \\,(| (.)(.) |),.---.OOOo--()--oOOO.---.,|                      |,|     Coding Game!     |,|                      |,'---.oooO--------------',(   )   Oooo.,\\ (    (   ),\\_)    ) /,---------(_/---",
                ".........\\\\\\///\n......../ _  _ \\\n......(| (.)(.) |)\n.---.OOOo--()--oOOO.---\n|                      |\n|     Coding Game!     |\n|                      |\n'---.oooO--------------'\n.....(   )   Oooo\n......\\ (    (   )\n.......\\_)    ) /\n....---------(_/---",
            ],
        ],
        solution:
            'r,c=input().split(",")\nm=input().split(",")\nl=max(map(len,m))\nfor s in m:print(f\'{c*int(r)}{s:{c}^{l}}\'.rstrip(c))',
    },
    {
        title: "Recherche dichotomique",
        author: "ogr",
        testCases: [
            ["0\n1\n0", "0"],
            ["9\n3\n1 5 9", "5 9"],
            ["31\n2\n31 60", "31"],
            ["8\n10\n0 1 2 3 4 5 6 7 8 9", "4 7 8"],
            ["160\n10\n5 10 20 40 80 160 320 640 1280 2560", "80 640 160"],
            [
                "96\n30\n1 2 6 8 12 13 14 16 19 21 25 26 29 33 34 41 52 57 59 60 69 72 73 75 78 79 81 96 99 102",
                "34 73 81 99 96",
            ],
        ],
        solution:
            "x=int(input())\nn=int(input())\n*l,=map(int,input().split())\ns,e=0,n-1\nm=(s+e)//2\nr=[l[m]]\nwhile l[m]!=x:\n    if l[m]>x:e=m-1\n    else:s=m+1\n    m=(s+e)//2\n    r+=[l[m]]\nprint(*r)",
    },
    {
        title: "Conversion",
        author: "Amnesix",
        testCases: [
            ["48 65 6c 6c 6f 20 77 6f 72 6c 64 21", "Hello world!"],
            ["43 6f 64 69 6e 67 20 67 61 6d 65 20 72 6f 63 6b 27 73", "Coding game rock's"],
            [
                "54 68 65 20 48 69 74 63 68 68 69 6b 65 72 27 73 20 47 75 69 64 65 20 74 6f 20 74 68 65 20 47 61 6c 61 78 79 2e",
                "The Hitchhiker's Guide to the Galaxy.",
            ],
            [
                "61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70 71 72 73 74 75 76 77 78 79 7a 30 31 32 33 34 35 36 37 38 39",
                "abcdefghijklmnopqrstuvwxyz0123456789",
            ],
        ],
        solution: 'print("".join(chr(int(x,16))for x in input().split()))',
    },
    {
        title: "2D Pyramids",
        author: "Woofer",
        testCases: [
            ["10", "4 0"],
            ["300", "24 0"],
            ["9001", "133 90"],
            ["12345", "156 99"],
            ["0", "0 0"],
        ],
        solution: "n=int(input())\nh=int((-1+(1+n*8)**.5)/2)\nprint(h,n-(h*-~h)//2)",
    },
    {
        title: "Résistance - Niveau 1",
        author: "[CG]SaiksyApo",
        testCases: [
            ["1\n@-|4|-@", "1"],
            ["3\n   /-|10|-\\\n@-<        >-@\n   \\-|10|-/", "2"],
            ["1\n@-|7|--|18|--@", "2"],
            ["1\n@-|20||10|-@", "2"],
            ["3\n           /-|8|-\\\n@-\\       /       \\-@\n   \\-|7|-/", "2"],
            [
                "7\n       /-|30|-\\\n    /-<        >-\\\n   /   \\-|20|-/   \\    /-|30|-\\\n@-<                >--<        >-@\n   \\   /-|24|-\\   /    \\-|30|-/\n    \\-<        >-/\n       \\-|24|-/",
                "6",
            ],
        ],
        solution: 'print(open(0).read().count("|")//2)',
    },
    {
        title: "Missing Digit",
        author: "[CG]SaiksyApo",
        testCases: [
            ["1\n123456789", "0"],
            ["1\n920683475", "1"],
            ["2\n025874963\n126489570", "1\n3"],
            [
                "10\n205749368\n063981547\n032945671\n071863245\n341527968\n803751429\n190854376\n183972540\n603285791\n723695148",
                "1\n2\n8\n9\n0\n6\n2\n6\n4\n0",
            ],
        ],
        solution: 'for x in"A"*int(input()):print(45-sum(map(int,input())))',
    },
    {
        title: "Seulement un",
        author: "Pagrette",
        testCases: [
            ["1", "true"],
            ["5", "false"],
            ["7", "true"],
            ["31", "true"],
        ],
        solution: 'print(str(bin(int(input())).count("0")==1).lower())',
    },
    {
        title: "Convert RGB to CMYK",
        author: "Solid",
        testCases: [
            ["255 0 0", "0 100 100 0"],
            ["0 0 0", "0 0 0 100"],
            ["100 250 40", "60 0 84 2"],
            ["1 2 3", "67 33 0 99"],
        ],
        solution:
            "l=[int(x)/255 for x in input().split()]\nk=1-max(l)\nprint(*[round((1-x-k)/(1-k)*100 if k-1 else 0) for x in l],round(k*100))",
    },
    {
        title: "How many bits do we need?",
        author: "TristanFrichti",
        testCases: [
            ["2\n1\n6", "1\n3"],
            ["4\n5\n2\n10\n24", "3\n2\n4\n5"],
            ["1\n256", "9"],
            ["3\n0\n128\n56", "1\n8\n6"],
        ],
        solution: "exec('print(len(bin(int(input())))-2);'*int(input()))",
    },
    {
        title: "Checksum",
        author: "Woofer",
        testCases: [
            ["45\n13\n48656c6c6f2c20576f726c642104", "Hello, World!"],
            ["205\n21\n57686f206c65742074686520646f6773206f75743f43", "Who let the dogs out?"],
            ["112\n10\n633064316e3636346d3336", "c0d1n664m3"],
            ["4\n26\n446561746820476f6473206f6e6c7920656174206170706c657301", "ERROR"],
        ],
        solution:
            'k=int(input())\ninput()\np=input()\n*l,c=[int(x+y,16)for x,y in zip(p[::2],p[1::2])]\nif sum(l)%k==c:print("".join(map(chr,l)))\nelse:print("ERROR")',
    },
    {
        title: "Phone Screener",
        author: "Bob",
        testCases: [
            ["1\n12345 Mom\n1\n54321\n2\n12345\n54321", "accept Mom\nreject 54321"],
            ["1\n54321 Spam\n1\n54\n1\n54321", "reject Spam"],
            ["1\n56789 CodinGame\n1\n12\n2\n56789\n23456", "accept CodinGame\naccept 23456"],
            [
                "8\n67880 R&D\n67881 Bob\n67882 Dilbert\n67883 Wally\n67890 Administration\n67891 Pointy-haired-boss\n67892 Marketing\n67893 Accounting\n2\n67881\n6789\n7\n67882\n67883\n67884\n67881\n67891\n67892\n67899",
                "accept Dilbert\naccept Wally\naccept 67884\nreject Bob\nreject Pointy-haired-boss\nreject Marketing\nreject 67899",
            ],
        ],
        solution:
            'K=dict()\nfor i in"A"*int(input()):\n    L=input().split()\n    K[L[0]]=L[1]\nB=[input()for i in"A"*int(input())]\nfor i in"A"*int(input()):\n    n=input()\n    print(("accept","reject")[any(n.startswith(b)for b in B)],K[n]if n in K else n)',
    },
    {
        title: "Queens",
        author: "Bob",
        testCases: [
            [
                "........\n........\n........\n...Q....\n........\n........\n........\n........",
                ".PP.PP.P\nP.P.P.PP\nPP...PPP\n........\nPP...PPP\nP.P.P.PP\n.PP.PP.P\nPPP.PPP.",
            ],
            [
                "Q.......\n........\n........\n........\n........\n........\n.......Q\n........",
                "........\n...PPPP.\n.P..PPP.\n.PP..PP.\n.PPP..P.\n.PPPP...\n........\n.PPPPP..",
            ],
            [
                "Q.......\n......Q.\n........\n........\n........\n.Q......\n.......Q\n........",
                "........\n........\n........\n..P..P..\n........\n........\n........\n..P.PP..",
            ],
            [
                ".Q......\n...Q....\n.....Q..\n.......Q\n..Q.....\nQ.......\n......Q.\n........",
                "........\n........\n........\n........\n........\n........\n........\n....P...",
            ],
        ],
        solution:
            "b=[[*input()]for x in range(8)]\nr=[[\"P\"]*8for x in range(8)]\nfor y in range(8):\n for x in range(8):\n  if b[y][x]!='Q':continue\n  for i in range(8):\n   r[max(0,y-i)][x]='.'\n   r[min(7,y+i)][x]='.'\n   r[y][max(0,x-i)]='.'\n   r[y][min(7,x+i)]='.'\n   if y-i>=0:\n    if x-i>=0:r[y-i][x-i]='.'\n    if x+i<8:r[y-i][x+i]='.'\n   if y+i<8:\n    if x-i>=0:r[y+i][x-i]='.'\n    if x+i<8:r[y+i][x+i]='.'\nprint(\"\\n\".join(map(\"\".join,r)))",
    },
    {
        title: "Partial Binary",
        author: "Subject007",
        testCases: [
            ["1\n500", "244"],
            ["3\n435\n8\n7", "179\n0\n3"],
            ["5\n512\n256\n128\n64\n32", "0\n0\n0\n0\n0"],
            ["4\n8965214\n4482607\n143\n127", "576606\n288303\n15\n63"],
        ],
        solution: 'for i in"A"*int(input()):print(int(bin(int(input()))[3:],2))',
    },
    {
        title: "Pyramids",
        author: "nomeata",
        testCases: [
            ["1", "1"],
            ["2", "2\n22"],
            ["5", "5\n55\n555\n5555\n55555"],
            ["6", "6\n66\n666\n6666\n66666\n666666"],
            ["9", "9\n99\n999\n9999\n99999\n999999\n9999999\n99999999\n999999999"],
        ],
        solution: "n=input()\nfor x in range(int(n)):print(n*-~x)",
    },
    {
        title: "Not quite sudoku",
        author: "Bob",
        testCases: [
            ["8372?9514", "6"],
            ["981453?67", "2"],
            ["318?92657", "4"],
            ["1234?6789", "5"],
        ],
        solution: 'print(*({*"123456789?"}-{*input()}))',
    },
    {
        title: "Cycle encoding",
        author: "polku",
        testCases: [
            ["abcabc", "3 2"],
            ["abcabcab", "8 1"],
            ["zzzzzz", "1 6"],
            ["a", "1 1"],
            ["totototo", "2 4"],
        ],
        solution: "s=input()\nfor x in range(1,len(s)+1):\n    r=s[:x]\n    l=len(s)//x\n    if s==r*l:print(x,l);E",
    },
    {
        title: "Easy math",
        author: "Bob",
        testCases: [
            ["6 4", "210"],
            ["15 3", "1218"],
            ["9 2", "711"],
            ["2 9", "-711"],
            ["5 5", "010"],
        ],
        solution: "a,b=map(int,input().split())\nprint(f'{a-b}{a+b}')",
    },
    {
        title: "Sudoku",
        author: "Magus",
        testCases: [
            [
                "1 2 3 4 5 6 7 8 9\n2 3 4 5 6 7 8 9 1\n3 4 5 6 7 8 9 1 2\n4 5 6 7 8 9 1 2 3\n5 6 7 8 9 1 2 3 4\n6 7 8 9 1 2 3 4 5\n7 8 9 1 2 3 4 5 6\n8 9 1 2 3 4 5 6 7\n9 1 2 3 4 5 6 7 8",
                "false",
            ],
            [
                "2 1 6 9 3 8 4 5 7\n9 5 4 7 6 2 8 3 1\n3 7 8 5 1 4 2 6 9\n6 8 2 1 9 5 3 7 4\n7 3 5 4 2 6 1 9 8\n4 9 1 8 7 3 6 2 5\n8 2 9 6 5 1 7 4 3\n1 6 7 3 4 9 8 5 6\n5 4 3 2 8 7 9 1 2",
                "false",
            ],
            [
                "1 1 1 1 1 1 1 1 1\n2 2 2 2 2 2 2 2 2\n3 3 3 3 3 3 3 3 3\n4 4 4 4 4 4 4 4 4\n5 5 5 5 5 5 5 5 5\n6 6 6 6 6 6 6 6 6\n7 7 7 7 7 7 7 7 7\n8 8 8 8 8 8 8 8 8\n9 9 9 9 9 9 9 9 9",
                "false",
            ],
            [
                "1 4 9 8 3 6 7 5 2\n5 7 6 2 4 1 9 3 8\n2 3 8 5 7 9 1 6 4\n7 2 4 3 6 8 5 9 1\n6 8 3 9 1 5 4 2 7\n9 5 1 4 2 7 3 8 6\n3 6 2 7 9 4 8 1 5\n4 1 5 6 8 3 2 7 9\n8 9 7 1 5 2 6 4 3",
                "true",
            ],
            [
                "1 1 1 1 1 1 1 1 1\n1 1 1 1 1 1 1 1 1\n1 1 1 1 1 1 1 1 1\n1 1 1 1 1 1 1 1 1\n1 1 1 1 1 1 1 1 1\n1 1 1 1 1 1 1 1 1\n1 1 1 1 1 1 1 1 1\n1 1 1 1 1 1 1 1 1\n1 1 1 1 1 1 1 1 1",
                "false",
            ],
            [
                "1 5 9 3 7 6 8 4 2\n8 3 6 5 4 2 1 7 9\n7 4 2 9 1 8 5 6 3\n9 7 5 1 6 3 4 2 8\n2 8 3 4 9 7 6 5 1\n6 1 4 8 2 5 3 9 7\n3 2 8 7 5 4 9 1 6\n4 9 7 6 8 1 2 3 5\n5 6 1 2 3 9 7 8 4",
                "true",
            ],
            [
                "5 9 3 6 2 1 7 8 4\n4 1 6 5 8 7 9 3 2\n2 8 7 9 3 4 1 5 6\n6 7 2 3 5 9 8 4 1\n1 5 4 7 6 8 3 2 9\n8 3 9 4 1 2 5 6 7\n3 6 1 2 9 5 4 7 8\n9 4 5 8 7 6 2 1 3\n7 2 8 1 4 3 6 9 5",
                "true",
            ],
        ],
        solution:
            'b=[input().replace(" ","")for i in"A"*9]\nc={*"123456789"}\nT=lambda x:all({*l}^c==set()for l in x)\nh=T(b)\nv=T(zip(*b))\ns=T("".join(l[x:x+3]for l in b[y:y+3])for x in range(0,9,3)for y in range(0,9,3))\nprint(str(h&v&s).lower())',
    },
    {
        title: "Angles",
        author: "TheReclif",
        testCases: [
            ["1 1", "178"],
            ["25 45", "110"],
            ["110 69", "1"],
            ["90 89", "1"],
            ["100 70", "10"],
        ],
        solution: "print(180-int(input())-int(input()))",
    },
    {
        title: "Second degré",
        author: "Merome",
        testCases: [
            ["f(x)=2x²+2x+2\n0 2", "f(0)=2\nf(1)=6\nf(2)=14"],
            [
                "f(x)=2x²+x+1\n0 10",
                "f(0)=1\nf(1)=4\nf(2)=11\nf(3)=22\nf(4)=37\nf(5)=56\nf(6)=79\nf(7)=106\nf(8)=137\nf(9)=172\nf(10)=211",
            ],
            ["f(x)=3x²-2\n0 5", "f(0)=-2\nf(1)=1\nf(2)=10\nf(3)=25\nf(4)=46\nf(5)=73"],
            ["square(x)=x²\n-2 2", "square(-2)=4\nsquare(-1)=1\nsquare(0)=0\nsquare(1)=1\nsquare(2)=4"],
            [
                "c(x)=5\n-10 10",
                "c(-10)=5\nc(-9)=5\nc(-8)=5\nc(-7)=5\nc(-6)=5\nc(-5)=5\nc(-4)=5\nc(-3)=5\nc(-2)=5\nc(-1)=5\nc(0)=5\nc(1)=5\nc(2)=5\nc(3)=5\nc(4)=5\nc(5)=5\nc(6)=5\nc(7)=5\nc(8)=5\nc(9)=5\nc(10)=5",
            ],
            ["function(x)=-3x²+5x-4\n0 2", "function(0)=-4\nfunction(1)=-2\nfunction(2)=-6"],
            ["minus(x)=-x²-x-1\n-1 1", "minus(-1)=-1\nminus(0)=-1\nminus(1)=-3"],
            [
                "affine(x)=-5x+2\n-20 20",
                "affine(-20)=102\naffine(-19)=97\naffine(-18)=92\naffine(-17)=87\naffine(-16)=82\naffine(-15)=77\naffine(-14)=72\naffine(-13)=67\naffine(-12)=62\naffine(-11)=57\naffine(-10)=52\naffine(-9)=47\naffine(-8)=42\naffine(-7)=37\naffine(-6)=32\naffine(-5)=27\naffine(-4)=22\naffine(-3)=17\naffine(-2)=12\naffine(-1)=7\naffine(0)=2\naffine(1)=-3\naffine(2)=-8\naffine(3)=-13\naffine(4)=-18\naffine(5)=-23\naffine(6)=-28\naffine(7)=-33\naffine(8)=-38\naffine(9)=-43\naffine(10)=-48\naffine(11)=-53\naffine(12)=-58\naffine(13)=-63\naffine(14)=-68\naffine(15)=-73\naffine(16)=-78\naffine(17)=-83\naffine(18)=-88\naffine(19)=-93\naffine(20)=-98",
            ],
        ],
        solution:
            'import re\nf,e=input().split("=")\ne=e.replace("²","**2")\ne=re.sub(r"(\\d)x",r"\\1*x",e)\nfor x in range(*map(eval,(input()+"+1").split())):\n    v=eval(e.replace("x",f\'({x})\'))\n    print(f\'{f[:-2]}{x})={v}\')',
    },
    {
        title: "Traveled Distance - Unit Conversion",
        author: "Yasser",
        testCases: [
            ["1\n20 10", "120"],
            ["2\n1 60\n100 1", "36\n60"],
            ["5\n55 5\n13 10\n11 10\n100 100\n100 100000", "165\n78\n66\n6000\n6000000"],
            ["1\n0 60", "0"],
        ],
        solution: 'for i in"A"*int(input()):print(int(eval(input().replace(" ","*"))*.6))',
    },
    {
        title: "Vowels in each word",
        author: "Spikatrix",
        testCases: [
            ["CodinGame", "4"],
            ["Hi there", "1 2"],
            ["LEts SeE If yOu pasS thiS", "1 2 1 2 1 1"],
            ["-~Wh@ts up?~-", "0 1"],
            [
                "Lots and lots of words!! Hey Hi Hello oejr32 29ej^[OQ2 dajw9(*JijI Inidw9d H(J@*J NUEJ*J8o JH^@T$k23 :[wp-wdwd9,; KI9je28jdkqwskms MM9i29wsk29u83r3ur MOJIj8w90ks2oskwlk",
                "1 1 1 1 1 1 1 2 2 2 3 2 0 3 0 0 2 3 3",
            ],
        ],
        solution: 'print(*[sum(map(w.count,"aeiouAEIUO"))for w in input().split()])',
    },
    {
        title: "Min prime de N",
        author: "LBOSS",
        testCases: [
            ["15", "3"],
            ["2015", "5"],
            ["5111", "19"],
            ["17", "17"],
            ["2000000", "2"],
            ["0", "NONE"],
        ],
        solution:
            '{title:\'Min prime de N\',author:\'LBOSS\',testCases:[["15","3"],["2015","5"],["5111","19"],["17","17"],["2000000","2"],["0","NONE"]],solution:\'null\'},',
    },
    {
        title: "Lecture par rebond",
        author: "Pi-Geometry",
        testCases: [
            ["13\nH!e ldllor oW", "Hello World !"],
            ["5\nHuiob", "Hibou"],
            ["6\nPnioge", "Pigeon"],
            ["9\nCeomdaiGn", "CodinGame"],
            [
                "369\nStuebciaglepn dloe vt uarvbriad iosd nearurqainlta  vmeull etaucr briedpimse sa drieupm esnetton adtipsatre nbtaa  iproarpr imguittcuirv  stuebciaglepn dsoi igrryascsiAl iruempq usei iirny ssspAa triuat iaguitr rpoopr rtiugai tsuirl lcioulqonraartti sa vsrtai vmaamv idtiss tseenttnae gv eali tgarpasc ielniiusm qsueen mcoa mmeultocriuvm  eprearl  osminlelsi upqenra rt",
                "Subigendo turbidis errant vel turbidis adiumento distenta porrigitur subigendo graciliumque in spatia aut porrigitur coloratis stivam distenta vel graciliumque camelorum per omnes per tranquillis lare victum omnes sine spatia gentes stivam arva tranquillis aut porrigitur Assyriis per Assyriis placet victum pari ab raptantes per semper caelum aliquando arva vel placet",
            ],
            ["2\n42", "42"],
        ],
        solution: "n=int(input())\ns=input()\nprint(s[:~(n%2):2]+s[-1]*(n%2)+s[~(n%2)::-2])",
    },
    {
        title: "Range sum",
        author: "[CG]Maxime",
        testCases: [
            ["4\n4 2 5 8\n3\n0 3\n1 2\n3 3", "19\n7\n8"],
            ["1\n42\n1\n0 0", "42"],
            ["2\n0 0\n1\n0 0", "0"],
            [
                "10\n0 1 0 0 1 0 0 1 0 1\n11\n0 0\n0 1\n0 2\n0 3\n0 4\n0 5\n5 5\n5 6\n5 7\n5 8\n5 9",
                "0\n1\n1\n1\n2\n2\n0\n0\n1\n1\n2",
            ],
        ],
        solution:
            'T=lambda:[*map(int,input().split())]\nT()\nv=T()\nfor i in"A"*T()[0]:\n s,e=T()\n print(sum(v[s:e+1]))',
    },
    {
        title: "Burrows-Wheeler",
        author: "[CG]BOUGA",
        testCases: [
            ["BAHAMAS", "4BHMSAAA"],
            ["BANANA", "4NNBAAA"],
            ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "1ZABCDEFGHIJKLMNOPQRSTUVWXY"],
            [
                "ALLYOURBASEAREBELONGTOUSYOUAREONTHEWAYTODESTRUCTIONHAHAHA",
                "4HHHAEUBWREUOSRBRDHNAANTTAELOOOTLIEYYTUAATAEUNCYGSOROOESLA",
            ],
        ],
        solution:
            "s=input()\nt=sorted(s[i:]+s[:i]for i in range(len(s)))\nprint(f'{t.index(s)+1}{\"\".join(r[-1]for r in t)}')",
    },
    {
        title: "Prime Power Sequence Term",
        author: "TheNinja",
        testCases: [
            ["7", "49"],
            ["81", "243"],
            ["357911", "25411681"],
            ["32768", "65536"],
            ["819628286980801", "25408476896404831"],
        ],
        solution: "n=int(input())\np=2\nwhile n%p:p+=1\nprint(n*p)",
    },
    {
        title: "Unfair Acceleration",
        author: "DanieLlama",
        testCases: [
            ["10\n2\n3", "5"],
            ["100\n10\n10", "0"],
            ["1000\n42\n37", "223"],
            ["10000\n630\n703", "1968"],
        ],
        solution: "I=input\nd=int(I())\ns,l=sorted([int(I()),int(I())])\nI(int(d-s*s*d/l**2))",
    },
    {
        title: "Add space between each pair of letters",
        author: "nickmao",
        testCases: [
            ["Codingame", "C o d i n g a m e"],
            ["Code!", "C o d e!"],
            ["Feel Good Inc.", "F e e l G o o d I n c."],
            ["Wo0od", "W o0o d"],
            ["D1rt9", "D1r t9"],
            ["tOmorrow   cOMes      TodAY", "t O m o r r o w   c O M e s      T o d A Y"],
            ["19-2000", "19-2000"],
            ["(0|)!|\\|64/\\/\\3 RU135", "(0|)!|\\|64/\\/\\3 R U135"],
        ],
        solution: 'import re\nprint(re.sub(r"((?<=[a-zA-z]))([a-zA-z])",r"\\1 \\2",input()))',
    },
    {
        title: "Reverse Pyramids",
        author: "arscom",
        testCases: [
            ["1", "1"],
            ["3", "333\n33\n3"],
            ["5", "55555\n5555\n555\n55\n5"],
            ["7", "7777777\n777777\n77777\n7777\n777\n77\n7"],
        ],
        solution: "n=input()\nfor x in range(1,int(n)+1)[::-1]:print(n*x)",
    },
    {
        title: "Wartime Cryptography",
        author: "Dolphish",
        testCases: [
            ["5\n18\n21\n14\n14\n11", "hello"],
            ["11\n18\n11\n3\n-1\n25\n8\n21\n-1\n1\n11\n5", "how are you"],
            [
                "70\n17\n-1\n18\n21\n25\n8\n22\n-1\n6\n18\n25\n6\n-1\n3\n21\n-1\n25\n8\n21\n-1\n19\n11\n17\n12\n19\n-1\n6\n11\n-1\n25\n6\n6\n25\n23\n15\n-1\n6\n18\n21\n-1\n25\n13\n21\n8\n17\n23\n25\n12\n7\n-1\n11\n12\n-1\n6\n18\n21\n-1\n3\n21\n7\n6\n21\n8\n12\n-1\n20\n8\n11\n12\n6",
                "i heard that we are going to attack the americans on the western front",
            ],
            [
                "31\n17\n13\n-1\n24\n21\n17\n12\n19\n-1\n25\n6\n6\n25\n23\n15\n21\n22\n-1\n11\n12\n-1\n25\n14\n14\n-1\n20\n14\n25\n12\n15\n7",
                "im being attacked on all flanks",
            ],
        ],
        solution: 'al="zyxwvutsrqponmlkjihgfedcba "\nfor i in"A"*int(input()):print(end=al[int(input())])',
    },
    {
        title: "XOR 'em all",
        author: "LearningPlayer",
        testCases: [
            [
                "Given a list of [[N]] numbers, either {{1}} or {{0}}, you need to output the result of XORing over the list. To do so, you have to XOR all the elements two by two, starting at the beginning.\n\n\n\nFor example:\n\n{{1 0 1 0 0}} -> {{1 1 0 0}} -> {{0 0 0}} -> {{0 0}} -> {{0}}",
                "<<Line 1:>> The number [[N]] of elements in the list.\n\n<<Line 2:>> A list of {{1}} and {{0}}.",
            ],
            ["3\n1 0 1", "0"],
            ["5\n1 0 1 0 0", "0"],
            ["12\n1 1 1 1 1 1 1 1 1 1 1 1", "0"],
        ],
        solution: "print(input().count(“1”)%2)",
    },
    {
        title: "Hydrocarbons",
        author: "Suitangi",
        testCases: [
            [
                "In chemistry, simple alkanes consist of the element carbon and hydrogen. According to the IUPAC nomenclature system, they are named by the the number of carbons they contain (here are the first 5 alkanes):\n\nmethane CH4 (1 Carbon atom, 4 Hydrogen atoms)\nethane C2H6 (2 Carbon atoms , 6 Hydrogen atoms)\npropane C3H8 (3 Carbon atoms, 8 Hydrogen atoms)\nbutane C4H10 (4 Carbon atoms, 10 Hydrogen atoms)\npentane C5H12 (5 Carbon atoms, 12 Hydrogen atoms)\n\nGiven a diagram of a molecule of a simple alkane, first, determine if it is a simple alkane; then, find its nomenclature (its IUPAC name). \n(Hint: The number of hydrogens in a simple alkane is (C + 1)*2, where C is the  Carbon atoms.",
                "Line 1: An integer [[N]] for the number of lines used to draw the diagram of the molecule.\nNext [[N]] lines: Constructs a diagram of a molecule of alkane consisting of characters 'H' and  'C' for the element hydrogen and carbon respectively; '-' and '|' for the to represent the bonds.",
            ],
            ["5\n  H\n  |\nH-C-H\n  |\n  H", "methane"],
            ["5\n  H H\n  | |\nH-C-C-H\n  | |\n  H H", "ethane"],
            ["1\nH-C", "NONE"],
            ["8\n  H H\n  | |\nH-C-C-H\n  | |\n  H |\n  H-C-H\n    |\n    H", "propane"],
            ["5\n  H H H H H \n  | | | | |\nH-C-C-C-C-C-H\n  | | | | |\n  H H H H H", "pentane"],
            ["11\n  H\n  |\nH-C-H\n  |\nH-C-H\n  |\nH-C-H\n  |\nH-C-H\n  |\n  H", "butane"],
        ],
        solution:
            'c=h=0\nfor i in"A"*int(input())\n l=input()\n c+=l.count(\'C\')\n h+=l.count(\'H\')\nif c==0 or ((c+1)*2)!=h:print("NONE")\nelse:print(["methane","ethane","propane","butane","pentane"][c-1])',
    },
    {
        title: "Modular Sum",
        author: "Suitangi",
        testCases: [
            ["3\n4 5 8 12", "5"],
            ["9\n18 22 22 24 37 37", "16"],
            ["5\n8", "3"],
            ["4\n5 7 14 16 44 27 13 9", "11"],
            ["7\n1893 5039 4231 7735", "12"],
            ["14\n3 8 4", "15"],
        ],
        solution: "m=int(input())\nprint(sum([int(x)%m for x in input().split()]))",
    },
    {
        title: "Shifty Strings",
        author: "Suitangi",
        testCases: [
            [
                "Codingame",
                "Codingame\neCodingam\nmeCodinga\nameCoding\ngameCodin\nngameCodi\ningameCod\ndingameCo\nodingameC\nCodingame",
            ],
            ["XP", "XP\nPX\nXP"],
            [
                "TheQuickBrownFoxJumped",
                "TheQuickBrownFoxJumped\ndTheQuickBrownFoxJumpe\nedTheQuickBrownFoxJump\npedTheQuickBrownFoxJum\nmpedTheQuickBrownFoxJu\numpedTheQuickBrownFoxJ\nJumpedTheQuickBrownFox\nxJumpedTheQuickBrownFo\noxJumpedTheQuickBrownF\nFoxJumpedTheQuickBrown\nnFoxJumpedTheQuickBrow\nwnFoxJumpedTheQuickBro\nownFoxJumpedTheQuickBr\nrownFoxJumpedTheQuickB\nBrownFoxJumpedTheQuick\nkBrownFoxJumpedTheQuic\nckBrownFoxJumpedTheQui\nickBrownFoxJumpedTheQu\nuickBrownFoxJumpedTheQ\nQuickBrownFoxJumpedThe\neQuickBrownFoxJumpedTh\nheQuickBrownFoxJumpedT\nTheQuickBrownFoxJumped",
            ],
            ["AAAAAAA", "AAAAAAA\nAAAAAAA"],
            [
                "Arturia Pendragon",
                "Arturia Pendragon\nnArturia Pendrago\nonArturia Pendrag\ngonArturia Pendra\nagonArturia Pendr\nragonArturia Pend\ndragonArturia Pen\nndragonArturia Pe\nendragonArturia P\nPendragonArturia \n PendragonArturia\na PendragonArturi\nia PendragonArtur\nria PendragonArtu\nuria PendragonArt\nturia PendragonAr\nrturia PendragonA\nArturia Pendragon",
            ],
        ],
        solution: "s=input()\nn=s\ni=0\nprint(n)\nwhile s!=(n:=s[(i:=i-1):]+s[:i]):print(n)\nprint(s)",
    },
    {
        title: "Histogram",
        author: "Bob",
        testCases: [
            ["2\n1 9", "1:*\n2:\n3:\n4:\n5:\n6:\n7:\n8:\n9:*"],
            [
                "27\n1 1 1 2 2 2 3 3 3 4 4 4 5 5 5 6 6 6 7 7 7 8 8 8 9 9 9",
                "1:***\n2:***\n3:***\n4:***\n5:***\n6:***\n7:***\n8:***\n9:***",
            ],
            [
                "25\n6 1 6 5 5 4 7 2 9 3 2 8 5 5 4 7 3 6 5 4 6 4 3 8 7",
                "1:*\n2:**\n3:***\n4:****\n5:*****\n6:****\n7:***\n8:**\n9:*",
            ],
            [
                "33\n1 7 8 8 6 6 4 5 3 2 6 2 2 9 6 7 4 5 3 4 7 8 7 6 7 7 5 1 8 6 4 3 1",
                "1:***\n2:***\n3:***\n4:****\n5:***\n6:******\n7:******\n8:****\n9:*",
            ],
        ],
        solution: "input()\nl=input()\nfor i in range(1,10):print(f'{i}:{\"*\"*l.count(str(i))}')",
    },
    {
        title: "Digital root",
        author: "Bob",
        testCases: [
            ["12", "3"],
            ["0", "0"],
            ["17", "8"],
            ["71", "8"],
            ["4294967292", "9"],
            ["95018375", "2"],
            ["1850", "5"],
            ["7645", "4"],
        ],
        solution: "n=int(input())\nwhile n>9:n=sum(map(int,str(n)))\nprint(n)",
    },
    {
        title: "Pascal's Triangle",
        author: "Suitangi",
        testCases: [
            ["0", "1"],
            ["1", "1 1"],
            ["4", "1 4 6 4 1"],
            ["9", "1 9 36 84 126 126 84 36 9 1"],
            ["12", "1 12 66 220 495 792 924 792 495 220 66 12 1"],
            ["17", "1 17 136 680 2380 6188 12376 19448 24310 24310 19448 12376 6188 2380 680 136 17 1"],
        ],
        solution:
            "a=[1]\nfor i in range(int(input())):\n b=[1]\n for j in range(i):b+=a[j]+a[j+1],\n a=b+[1]\nprint(*a)",
    },
    {
        title: "Fair workloads",
        author: "Elliot",
        testCases: [
            ["2\n3\n1 2 3\n1 1 1", "2"],
            ["4\n6\n1 2 2 1 2 9\n1 2 2 2 2 1\n1 4 2 7 2 1\n6 8 1 9 0 2", "2"],
            ["3\n5\n69 41 38 36 99\n49 55 41 10 32\n42 96 86 26 52", "2"],
            [
                "7 \n7\n348 366 318 47 160 270 108\n487 390 341 331 335 183 269\n423 474 398 274 40 143 385\n63 392 120 78 247 498 426\n207 378 268 203 95 491 412\n336 359 440 315 158 477 15\n44 471 491 334 383 32 42",
                "2",
            ],
        ],
        solution:
            'import numpy\nI=input\nn=int(I())\nI()\nw=[[*map(int,I().split())]for i in"A"*n]\nI(w.index(min(w,key=numpy.var))+1)',
    },
    {
        title: "Generalized FizzBuzz",
        author: "nicola",
        testCases: [
            ["5 1\n3 Fizz", "1\n2\nFizz\n4\n5"],
            ["10 2\n3 Fizz\n5 Buzz", "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz"],
            [
                "20 3\n3 Bizz\n5 Bazz\n7 Buzz",
                "1\n2\nBizz\n4\nBazz\nBizz\nBuzz\n8\nBizz\nBazz\n11\nBizz\n13\nBuzz\nBizzBazz\n16\n17\nBizz\n19\nBazz",
            ],
            [
                "20 2\n6 Bizz\n8 Bazz",
                "1\n2\n3\n4\n5\nBizz\n7\nBazz\n9\n10\n11\nBizz\n13\n14\n15\nBazz\n17\nBizz\n19\n20",
            ],
        ],
        solution:
            'n,m=map(int,input().split())\nl=[input().split()for i in"A"*m]\nfor i in range(1,n+1):print("".join([p[1]for p in l if i%int(p[0])<1])or i)',
    },
    {
        title: "MakePalindrome",
        author: "alex.vasiu",
        testCases: [
            ["aa", "0"],
            ["abba", "1"],
            ["anncdd", "-1"],
            ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaacaaaaaaaaaaaaaaaa", "16"],
            ["abbabbabbabbabbabbabbabba", "12"],
        ],
        solution:
            's=input()\nfor x in range(len(s)):\n    t=s[:x]+"|"+s[x:]\n    if all(a==b or"|"in a+b for a,b in zip(t,t[::-1])):print(x);exit(0)\nprint(-1)',
    },
    {
        title: "Amaze Maze",
        author: "jeet-esh",
        testCases: [
            ["4", "4444444\n4333334\n4322234\n4321234\n4322234\n4333334\n4444444"],
            ["2", "222\n212\n222"],
            [
                "9",
                "99999999999999999\n98888888888888889\n98777777777777789\n98766666666666789\n98765555555556789\n98765444444456789\n98765433333456789\n98765432223456789\n98765432123456789\n98765432223456789\n98765433333456789\n98765444444456789\n98765555555556789\n98766666666666789\n98777777777777789\n98888888888888889\n99999999999999999",
            ],
            [
                "7",
                "7777777777777\n7666666666667\n7655555555567\n7654444444567\n7654333334567\n7654322234567\n7654321234567\n7654322234567\n7654333334567\n7654444444567\n7655555555567\n7666666666667\n7777777777777",
            ],
        ],
        solution:
            'n=int(input())\nG=lambda o:exec(f\'for x in range(n-1)[::{o}]:t=range(n-x,n+1);print(*t[::-1],*[n-x]*((n-x)*2-3),*t,sep="")\')\nG(1)\nt=range(1,n+1)\nprint(*t[::-1],*t[1:],sep="")\nG(-1)',
    },
    { title: "MakePalindrome2", author: "alex.vasiu", testCases: [["NO", "NO"]], solution: "NO" },
    {
        title: "Le plus grande nombre, niveau 1",
        author: "Magus",
        testCases: [
            ["9\n1 2 3 4 5 6 7 8 9", "987654321"],
            ["6\n3 8 2 9 7 5", "987532"],
            ["6\n7 9 7 5 7 2", "977752"],
            ["8\n4 8 7 7 9 0 0 2", "98774200"],
            ["4\n0 0 0 0", "0"],
        ],
        solution: 'input()\nprint(int("".join(sorted(input()[::2])[::-1])))',
    },
    {
        title: "Clean city names",
        author: "Amendil",
        testCases: [
            ["2\nMontpellier\nNew York\n3\nnew york\nNewYork\nmontpellier", "New York\nNew York\nMontpellier"],
            ["2\nKyoto\nTokyo\n1\ntokyo", "Tokyo"],
            ["2\nSaint Petersburg\nSan Francisco\n1\nSan Fran Cisco", "San Francisco"],
            ["2\nHelsinki\nHanoi\n2\nHanoi\nHelsinki", "Hanoi\nHelsinki"],
            [
                "5\nSydney\nNewcastle upon Tyne\nMarrakech\nLe Mans\nVienna\n20\nle mans\nNewcastle Upon Tyne\nMarraKech\nsydney\nLeMans\nVIENNA\nNEWCASTLEuponTYNE\nSYDNEY\nMarr a kech\nNewcastle upon Tyne\nvienna\nmarrakech\nVien na\nle Mans\nNewcastleupon Tyne\nSydney\nLemans\nm A R R A K E C H\nVIenna\nSydneY",
                "Le Mans\nNewcastle upon Tyne\nMarrakech\nSydney\nLe Mans\nVienna\nNewcastle upon Tyne\nSydney\nMarrakech\nNewcastle upon Tyne\nVienna\nMarrakech\nVienna\nLe Mans\nNewcastle upon Tyne\nSydney\nLe Mans\nMarrakech\nVienna\nSydney",
            ],
        ],
        solution:
            'n=int(input())\nd={}\nfor x in"A"*n:\n    t=input()\n    d[t.lower().replace(" ","")]=t\nm=int(input())\nfor x in"A"*m:print(d[input().lower().replace(" ","")])',
    },
    {
        title: "Ace of base",
        author: "nicola",
        testCases: [
            ["2\n10\n6\n1 0 1 0 0 1", "4 1"],
            ["10\n10\n6\n1 0 1 9 0 1", "1 0 1 9 0 1"],
            ["10\n20\n6\n1 9 1 2 0 1", "1 3 18 0 1"],
            ["10\n60\n8\n3 1 4 1 5 9 6 5", "2 25 26 39 25"],
        ],
        solution:
            "i=int(input())\nt=int(input())\ninput()\no=0\nfor c in map(int,input().split()):o=o*i+c\nl=[]\nwhile o:\n    o,r=divmod(o,t)\n    l+=[r]\nprint(*l[::-1])",
    },
    {
        title: "Happy Number",
        author: "MoonCoder",
        testCases: [
            ["404", "404 IS HAPPY"],
            ["69", "69 IS UNHAPPY"],
            ["2015", "2015 IS UNHAPPY"],
            ["2019", "2019 IS HAPPY"],
        ],
        solution:
            'o=n=int(input())\ns=[]\nwhile n!=1 and n not in s:\n    s+=[n]\n    n=sum([int(x)**2 for x in str(n)])\nprint(f\'{o} IS {("UN","")[n<2]}HAPPY\')',
    },
    {
        title: "Symmetrical substring",
        author: "B_Vaflick",
        testCases: [
            ["abcdefgdcba", "abcd"],
            ["saippuakivikauppias", "saippuaki"],
            ["a santa at nasa.", "Nothing"],
            ["Air to aria", "air"],
        ],
        solution:
            's=input().lower()\no=""\nfor a,b in zip(s[:len(s)//2],s[len(s)//2:][::-1]):\n    if a==b:o+=a\n    else:break\nprint(o or "Nothing")',
    },
    {
        title: "Mon beau sapin - O Christmas Tree",
        author: "Eldoir",
        testCases: [
            ["1", ".*.\n.*."],
            ["3", "...*...\n..***..\n.*****.\n...*..."],
            ["5", ".....*.....\n....***....\n...*****...\n..*******..\n.*********.\n.....*....."],
            [
                "12",
                "............*............\n...........***...........\n..........*****..........\n.........*******.........\n........*********........\n.......***********.......\n......*************......\n.....***************.....\n....*****************....\n...*******************...\n..*********************..\n.***********************.\n............*............",
            ],
        ],
        solution: 'n=int(input())\nfor x in range(n):print("."*(n-x)+"*"*(1+x*2)+"."*(n-x))\nprint("."*n+"*"+"."*n)',
    },
    {
        title: "My Own Prime",
        author: "Kaushal28",
        testCases: [
            ["5\n10 5 3 15 16", "5 3 16"],
            ["6\n2 3 5 7 1 11", "1"],
            ["1\n20", "20"],
            [
                "100\n4 9 17 20 22 28 29 31 39 40 48 58 68 75 85 89 99 100 101 108 111 121 124 129 135 137 141 147 156 160 161 165 173 182 189 199 205 214 215 220 229 239 243 253 261 264 268 278 281 287 293 300 307 308 311 313 315 322 332 342 344 354 358 368 378 380 381 386 388 391 401 404 409 414 416 420 428 433 436 438 440 449 450 459 460 463 473 475 476 485 489 492 493 502 504 514 516 520 525 528",
                "4 9 17 22 29 31 39 75 89 101 111 121 129 137 141 147 161 165 173 182 199 205 214 215 229 239 253 278 281 287 293 307 311 313 354 358 381 386 401 409 433 438 449 463 473 475 485 489 502 514",
            ],
        ],
        solution: "input()\n*l,=map(int,input().split())\nprint(*[x for x in l if sum(x%c==0for c in l)==1])",
    },
    {
        title: "Troll counting",
        author: "Bob",
        testCases: [
            ["1", "one"],
            ["4", "many"],
            ["7", "many-three"],
            ["8", "many-many"],
            ["16", "LOTS"],
            ["34", "LOTS-LOTS-two"],
            [
                "989",
                "LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-LOTS-many-many-many-one",
            ],
        ],
        solution:
            'n=int(input())\nl=n//16\nn%=16\nm=n//4\nn%=4\nr=["LOTS"]*l+["many"]*m\nif n>0:r+=[[0,"one","two","three"][n]]\nprint(*r,sep="-")',
    },
    {
        title: "Weak Prime",
        author: "knightmare",
        testCases: [
            ["13", "WEAK"],
            ["101", "STRONG"],
            ["1847", "STRONG"],
            ["15377", "WEAK"],
            ["53", "BALANCED"],
            ["74687", "STRONG"],
            ["96763", "BALANCED"],
        ],
        solution:
            'p=lambda x:all(x%m for m in range(2,x))&(x>1)\nl=h=n=int(input())\nh+=1\nwhile not p(h):h+=1\nm=h\nl-=1\nwhile not p(l):l-=1\nm=(l+m)/2\nprint((("BALANCED","STRONG")[n>m],"WEAK")[n<m])',
    },
    {
        title: "He's got a stammer",
        author: "Elliot",
        testCases: [
            ["Hi", "Hi"],
            ["Hi there", "Hi th-there"],
            ["My name is Marco", "My na-name is-is Ma-Ma-Marco"],
            ["Hi there my name is Marco", "Hi th-there my-my na-na-name is-is-is-is Ma-Ma-Ma-Ma-Ma-Marco"],
            [
                "Im Marco its nice to see you there",
                "Im Ma-Marco it-its ni-ni-nice to-to-to-to se-se-se-se-se-see yo-yo-yo-yo-yo-yo-yo-yo-you th-th-th-th-th-th-th-th-th-th-th-th-th-there",
            ],
        ],
        solution: 's=input().split()\na,b=0,1\no=[]\nfor x in s:\n    o+=[(x[:2]+"-")*a+x]\n    a,b=b,a+b\nprint(*o)',
    },
    {
        title: "Alphabet order",
        author: "Bob",
        testCases: [
            ["ABCDFEGH", "E"],
            ["MNOPQRTSUVWX", "S"],
            ["CEGIMKO", "K"],
            ["ACDEGHIJLNQRSUXZY", "Y"],
        ],
        solution: "s=input()\nfor a,b in zip(s,s[1:]):print(end=b*(a>b))",
    },
    {
        title: "SmAll && LarGe",
        author: "SamSi",
        testCases: [
            ["3 3", "102 987"],
            ["5 4", "10023 99876"],
            ["7 7", "1023456 9876543"],
            ["13 9", "1000002345678 9999987654321"],
        ],
        solution:
            'n,k=map(int,input().split())\ns="1"*(k>1)+"0"*(n-k+1)+"23456789"[:max(k-2,0)]\nl="9"*(n-k)+"9876543210"[:max(k,0)]\nprint(s,l)',
    },
    {
        title: "Golf code",
        author: "Bob",
        testCases: [
            ["4 4 3 4 4 5 4 3 5 4 3 4 5 4 4 3 4 5\n4 3 2 4 3 4 3 3 4 4 3 4 6 4 5 3 3 4", "-6"],
            ["4 4 3 5 3 4 5 4 4 4 5 3 4 4 5 4 3 5\n6 4 3 5 3 4 4 5 6 5 6 4 5 4 4 5 3 4", "7"],
            ["5 4 3 4 4 4 4 3 5 5 4 4 3 4 4 4 3 5\n6 5 4 4 4 4 4 3 5 5 4 4 3 4 4 4 3 6", "4"],
            ["4 4 4 5 4 3 4 3 4 4 4 5 3 4 4 4 3 4\n4 4 4 4 4 4 4 3 5 4 4 5 3 5 4 3 2 3", "-1"],
            ["5 4 3 4 4 4 4 3 5 5 4 4 3 4 4 4 3 5\n5 3 3 4 4 3 4 3 4 5 3 4 3 5 3 3 4 4", "-5"],
            ["4 4 3 5 3 4 5 4 4 4 5 3 4 4 5 4 3 5\n3 4 2 5 3 5 4 5 4 3 5 3 5 4 4 4 7 3", "0"],
        ],
        solution: 'I=input\nI(eval(("-("+I()+")+"+I()).replace(" ","+")))',
    },
    {
        title: "Sum of the odds",
        author: "helgui",
        testCases: [
            ["1", "1"],
            ["14", "196"],
            ["491", "241081"],
            ["999", "998001"],
        ],
        solution: "print(int(input())**2)",
    },
    {
        title: "Maximum 2^k divisor",
        author: "helgui",
        testCases: [
            ["1", "1"],
            ["16", "16"],
            ["123", "1"],
            ["858616", "8"],
            ["262144", "262144"],
        ],
        solution: "n=int(input())\nprint(n&-n)",
    },
    { title: "Semi-Primes", author: "TheNinja", testCases: [["NO", "NO"]], solution: "NO" },
    {
        title: "Snail",
        author: "Bob",
        testCases: [
            ["3 4", "01 02 03\n10 11 04\n09 12 05\n08 07 06"],
            ["5 5", "01 02 03 04 05\n16 17 18 19 06\n15 24 25 20 07\n14 23 22 21 08\n13 12 11 10 09"],
            [
                "9 11",
                "01 02 03 04 05 06 07 08 09\n36 37 38 39 40 41 42 43 10\n35 64 65 66 67 68 69 44 11\n34 63 84 85 86 87 70 45 12\n33 62 83 96 97 88 71 46 13\n32 61 82 95 98 89 72 47 14\n31 60 81 94 99 90 73 48 15\n30 59 80 93 92 91 74 49 16\n29 58 79 78 77 76 75 50 17\n28 57 56 55 54 53 52 51 18\n27 26 25 24 23 22 21 20 19",
            ],
            ["1 17", "01\n02\n03\n04\n05\n06\n07\n08\n09\n10\n11\n12\n13\n14\n15\n16\n17"],
        ],
        solution:
            "w,h=map(int,input().split())\nD=[(0,-1),(1,0),(0,1),(-1,0)]\ng=[[0]*w for i in\"A\"*h]\nx=y=d=0\nfor i in range(w*h):\n    g[y][x]=i+1;X=x+D[d][0];Y=y+D[d][1]\n    while i<w*h-1and(not(0<=X<w and 0<=Y<h)or g[Y][X]>0):d=-~d%4;X=x+D[d][0];Y=y+D[d][1]\n    x=X;y=Y\nfor r in g:print(*[f'{x:02}'for x in r])",
    },
    {
        title: '"OLD" is GOLD',
        author: "SamSi",
        testCases: [
            ["bob", "2266622"],
            ["the ninja", "844330664446652"],
            ["coding game rocks", "22266634446640426330777666222557777"],
            ["gods are made", "46663777702777330623 33"],
            ["hahhaaa", "44244 442 2 2"],
            [
                "the quick brown fox jumps over a lazy dog",
                "844330778844422255022777666966033366699058867 777706668883377702055529999 999036664",
            ],
        ],
        solution: "NO",
    },
    {
        title: "Square Squared",
        author: "DeVoTeD",
        testCases: [
            ["2\n┌─┐\n└─┘", "1"],
            ["3\n┌─┬─┐\n├─┼─┤\n└─┴─┘", "5"],
            ["5\n┌─┬─┬─┬─┐\n├─┼─┼─┼─┤\n├─┼─┼─┼─┤\n├─┼─┼─┼─┤\n└─┴─┴─┴─┘", "30"],
            [
                "8\n┌─┬─┬─┬─┬─┬─┬─┐\n├─┼─┼─┼─┼─┼─┼─┤\n├─┼─┼─┼─┼─┼─┼─┤\n├─┼─┼─┼─┼─┼─┼─┤\n├─┼─┼─┼─┼─┼─┼─┤\n├─┼─┼─┼─┼─┼─┼─┤\n├─┼─┼─┼─┼─┼─┼─┤\n└─┴─┴─┴─┴─┴─┴─┘",
                "140",
            ],
        ],
        solution: "print(sum(i*i for i in range(int(input()))))",
    },
    {
        title: "Rotative encryption",
        author: "VelxioRH",
        testCases: [
            ["Hello World !\nkEy@1234\n;", "7704;6969;13068;6912;5439;1600;4437;5772;12198;7452;12100;2048;1617"],
            [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\nThis key will be needed to encrypt the sentence\n|",
                "6384|11544|11970|11615|3488|3424|10605|13552|3680|13923|11445|3456|10800|3552|10584|11211|3648|3520|11615|10605|11600|3232|9700|3488|11716|12876|1408|3232|10890|10989|12540|13915|11312|11484|3712|11716|12064|11817|3648|3680|9797|11000|12180|11312|11550|11385|9999|8820|11440|10815|3680|3232|11556|10605|14036|1408|3808|12075|10908|10800|1024|9800|11211|1024|11110|10605|11817|11500|11009|11100|3200|3712|12876|3232|11009|12320|10989|12996|3872|11760|12760|3168|12180|10400|10605|3200|13455|11110|12760|3712|11817|12760|3168|10908|8148|10192|11655|13110|3232|3424|10201|14036|1024|11900|11655|11664|11988|3648|9898|3232|3488|10670|10403|11110|9700|3232|9700|3456|12180|12543|3744|9797|5060",
            ],
            [
                "RandomdfgjhJfdsgliUIAHBGTSZFFS2115fdg==@@<df\nCaSEsenSITIVE\n::::",
                "5494::::9409::::9130::::6900::::12765::::11009::::11000::::8466::::7519::::8904::::7592::::6364::::7038::::6700::::11155::::8549::::7452::::12075::::8585::::8030::::5395::::5256::::5544::::5183::::7224::::5727::::6030::::6790::::5810::::5727::::5750::::4949::::5390::::4399::::7446::::8400::::7519::::5246::::4209::::4288::::6208::::4980::::6900::::11730",
            ],
            [
                "MUCH SPACES                   .         .\n   S P A C E   \n=",
                "2464=2720=2144=5976=1024=6640=2560=4225=2144=4623=2656=2208=1024=1024=1024=1024=1024=1024=2656=1024=2560=1024=2080=1024=2144=1024=2208=1024=1024=1024=1472=1024=1024=2656=1024=2560=1024=2080=1024=2144=1472",
            ],
        ],
        solution: "I=input\nprint(*[ord(a)*ord(b)for a,b in zip(I(),I()*125)],sep=I())",
    },
    {
        title: "Change Machine",
        author: "Suitangi",
        testCases: [
            ["$4.58", "4 2 0 1 3"],
            ["$8.90", "8 3 1 1 0"],
            ["$0.49", "0 1 2 0 4"],
            ["$6.00", "6 0 0 0 0"],
            ["$0.01", "0 0 0 0 1"],
        ],
        solution:
            "l=int(float(input()[1:])*100)\nD=l//100\nl%=100\nq=l//25\nl%=25\nd=l//10\nl%=10\nprint(D,q,d,l//5,l%5)",
    },
    {
        title: "Stretchy Animals",
        author: "mIllIbyte",
        testCases: [
            ["bonobo", "bonoobbooo"],
            ["lizard", "lizard"],
            ["gorilla", "gorillla"],
            ["aaaabakangaroomoose", "aaaaaaaaaabaaaaakaaaaaangaaaaaaarooomooooooose"],
        ],
        solution: "s=input()\nfor x in range(len(s)):print(end=s[x]*s[:x+1].count(s[x]))",
    },
    {
        title: "Candies, warm up",
        author: "Elliot",
        testCases: [
            ["1 1", "1"],
            ["2 1", "1 1"],
            ["5 2", "2 2 1"],
            ["6 3", "3 3"],
            ["10 20", "10"],
            ["1000 67", "67 67 67 67 67 67 67 67 67 67 67 67 67 67 62"],
            ["10000 1000", "1000 1000 1000 1000 1000 1000 1000 1000 1000 1000"],
            ["34 7", "7 7 7 7 6"],
        ],
        solution: "n,k=map(int,input().split())\nl=n//k*[k]+[n%k]*(n%k>0)\nprint(*l)",
    },
    {
        title: "Shadok counting",
        author: "nicola",
        testCases: [
            ["0", "GA"],
            ["4", "BUGA"],
            ["156", "ZOBUMEUGA"],
            ["1420365", "BUBUBUZOZOMEUGABUGAMEUBU"],
        ],
        solution: 'n=int(input())\nc=""\nwhile n:c=["GA","BU","ZO","MEU"][n%4]+c;n//=4\nprint(c or"GA")',
    },
    {
        title: "My Branch",
        author: "ZorbaxisBtsSioSlam",
        testCases: [
            ["2", "1"],
            ["10", "1"],
            ["5", "LOST"],
            ["100", "3"],
        ],
        solution: 'print(~-int(input())%4or"LOST")',
    },
    {
        title: "Car Park Keeper",
        author: "ProYd",
        testCases: [
            ["3\n2 5\n8 13\n14 20\n", "14"],
            ["4\n3 12\n2 5\n5 13\n9 20", "18"],
            ["2\n0 1\n13 24", "12"],
            ["3\n3 3\n14 14\n15 15", "0"],
            ["4\n0 24\n1 23\n2 22\n3 21", "24"],
            ["5\n4 5\n5 6\n6 7\n7 8\n8 9", "5"],
        ],
        solution:
            't=[0]*24\nfor i in"A"*int(input()):\n    s,e=map(int,input().split())\n    t[s:e]=[1]*(e-s)\nprint(sum(t))',
    },
    {
        title: "Time flies like an arrow",
        author: "Noxilex",
        testCases: [
            ["45296789", "12 34 56 789"],
            ["0", "00 00 00 000"],
            ["3661001", "01 01 01 001"],
            ["999999999999", "277777 46 39 999"],
        ],
        solution: "n=int(input())\ni=n%1000\nn//=1000\nprint(f'{n//3600:02} {n//60%60:02} {n%60:02} {i:03}')",
    },
    {
        title: "Weak Eyes",
        author: "SamSi",
        testCases: [
            ["5 3 4", "5"],
            ["10 5 12", "13"],
            ["25 24 7", "25"],
            ["85 84 13", "85"],
        ],
        solution: "l,r,h=map(int,input().split())\nprint(int((h**2+(l-r,r)[r>l-r]**2)**.5))",
    },
    {
        title: "Rick Grimes",
        author: "PabloEscobar",
        testCases: [
            ["1 3 4 5 7", "19"],
            ["2 6 9 1 1", "10"],
            ["7 7 4 2 1", "35"],
            ["2235 2533 3635 1466 6156", "11837603"],
        ],
        solution: "b,w,x,y,z=map(int,input().split())\nprint(min(b*x+w*y,(b+w)*x+w*z,(b+w)*y+b*z))",
    },
    {
        title: "Word value",
        author: "Darmo",
        testCases: [
            ["ab", "195"],
            ["CodinGame", "871"],
            ["Hello World", "500\n520"],
            ["This is a long sentence", "408\n220\n97\n432\n853"],
            ["supercalifragilisticexpialidocious", "3643"],
        ],
        solution: 'print(*[sum(map(ord,w))for w in input().split()],sep="\\n")',
    },
    {
        title: "Binary to Hex",
        author: "SAURABH",
        testCases: [
            ["0b1010", "0xa"],
            ["0b10", "0x2"],
            ["0b0", "0x0"],
            ["0b100100110", "0x126"],
            ["0b1111111111111", "0x1fff"],
        ],
        solution: "print(hex(int(input(),2)))",
    },
    {
        title: "Median",
        author: "MadKnight",
        testCases: [
            ["5\n1 2 3 4 5", "3"],
            ["5\n2 4 1 3 5", "3"],
            ["10\n1 10 2 9 3 8 4 7 5 6", "5.5"],
            ["6\n-320 500 400 1 3 -2", "2"],
        ],
        solution: "n=int(input())\nl=sorted(map(int,input().split()))\nprint(f'{(l[n//2]+l[~n//2])/2:g}')",
    },
    {
        title: "ASCII Math",
        author: "iNF3RNO",
        testCases: [
            ["ABC", "132"],
            ["CodinGame", "661"],
            ["N0t_Y0ur_N0rm4l_5tR1nG?!", "869"],
            ["Just another Test.", "757"],
        ],
        solution: "print(sum(x%2*x for x in map(ord,input())))",
    },
    {
        title: "Race road length",
        author: "MadKnight",
        testCases: [
            ["4\n0 0\n1 0\n1 1\n0 1\n", "4"],
            ["5\n1 0\n3 2\n2 6\n1 7\n-5 3\n", "22"],
            ["6\n3 -12\n20 0\n50 10\n10 50\n-10 50\n-50 5\n", "245"],
            ["2\n0 0\n5 5", "7"],
        ],
        solution:
            'import math\nn=int(input())\np=([[*map(int,input().split())]for i in"A"*n]*2)[:n+(n>2)]\nprint(round(sum(math.dist(a,b)for a,b in zip(p,p[1:]))))',
    },
    {
        title: "SHURIKEN && BORROW",
        author: "SamSi",
        testCases: [
            ["3 17 4", "13"],
            ["1000 0 1000", "500500000"],
            ["859 453892 543", "126416972"],
            ["1 1000000000 1", "0"],
            ["20 43 3\n", "77\n"],
            ["432 10000 241\n", "12587552\n"],
            ["634 87973 214\n", "14497197\n"],
            ["1000 500499999 1000\n", "1\n"],
        ],
        solution: "m,a,n=map(int,input().split())\nprint(max(0,m*-~n*n//2-a))",
    },
    {
        title: "Birds Language",
        author: "alex.vasiu",
        testCases: [
            ["alex", "apalepex"],
            ["dsd--ds", "dsd--ds"],
            ["Ae#io", "ApAepe#ipiopo"],
            ["UUIauAAeOaCCAD", "UpUUpUIpIapaupuApAApAepeOpOapaCCApAD"],
            ["Byrd-is-here!", "Byrd-ipis-heperepe!"],
        ],
        solution:
            'import re\nprint(re.sub("([aeiouAEIOU])",r"\\1p\\1",input()))\n# $><<gets.gsub(/([aeiouAEIOU])/,\'\\1p\\1\')',
    },
    {
        title: "Candies",
        author: "Elliot",
        testCases: [
            ["0 1", "1"],
            ["5 1", "1"],
            ["3 2", "3"],
            ["18 2", "4181"],
            ["3 3", "4"],
            ["16 4", "20569"],
            ["17 6", "59448"],
            ["19 9", "259328"],
        ],
        solution:
            "C=lambda n,k:1if n==0 else C(n,n)if n<k else sum(C(n-i-1,k)for i in range(k))\nprint(C(*map(int,input().split())))",
    },
    {
        title: "IPv4",
        author: "[CG]OlogN",
        testCases: [
            ["192.168.1.1", "3232235777"],
            ["0.0.0.1", "1"],
            ["0.0.1.0", "256"],
            ["52.72.250.202", "877198026"],
            ["192.168.100.101", "3232261221"],
            ["10.0.0.20", "167772180"],
        ],
        solution: 'print(int("".join(f\'{int(x):08b}\'for x in input().split(".")),2))',
    },
    {
        title: "The king of the hill",
        author: "aCat",
        testCases: [
            ["3 3\n1 2 2\n1 3 1\n2 2 1", "3"],
            ["3 6\n10 20 44 30 12 37\n10 45 44 55 14 34\n10 20 44 29 12 34", "55"],
            ["6 5\n2 3 4 5 6\n2 3 4 5 6\n2 3 4 5 6\n2 3 4 5 6\n2 3 4 5 6\n2 3 4 5 6", "-666"],
            ["5 5\n2 2 3 -1 -10\n3 5 6 99 80\n2 3 4 99 6\n2 3 7 5 6\n2 3 4 5 6", "7"],
        ],
        solution:
            'I=input\nr,c=map(int,I().split())\nb=[[*map(int,I().split())]for i in"A"*r]\nfor y in range(1,r-1):\n for x in range(1,c-1)[::-1]:\n  if b[y][x]>max([b[y-1][x],b[y+1][x],b[y][x+1],b[y][x-1]]):I(b[y][x])\nI(-666)',
    },
    {
        title: "<Reverse>",
        author: "TheNinja",
        testCases: [
            ["1", "1"],
            ["2", "10"],
            ["6", "100"],
            ["24", "1000"],
            ["119", "4321"],
            ["777777", "212212111"],
            ["3628799", "987654321"],
            ["0", "0"],
        ],
        solution:
            'n=int(input())\na=b=1\no=[]\nwhile n>=b:\n    t=b*-~a\n    o+=[n%t//b]\n    a+=1\n    b=t\nprint(*o[::-1]or[0],sep="")',
    },
    {
        title: "Sum of the multiples of 3, 5 or 7",
        author: "[CG]OlogN",
        testCases: [
            ["15", "66"],
            ["100", "2738"],
            ["199", "10645"],
            ["999", "270067"],
            ["0", "0"],
        ],
        solution: "print(sum(x*(0 in[x%3,x%5,x%7])for x in range(int(input()))))",
    },
    {
        title: "Even sum",
        author: "Robl",
        testCases: [
            ["4", "20"],
            ["5", "30"],
            ["2", "6"],
            ["1", "2"],
            ["10", "110"],
            ["3", "12"],
            ["2000", "4002000"],
            ["1000000000", "1000000001000000000"],
        ],
        solution: "n=gets.to_i\np n*-~n",
    },
    {
        title: "FooBar",
        author: "[CG]OlogN",
        testCases: [
            [
                "36",
                "1\n2\n3\n4\nFoo\n6\nBar\n8\n9\nFoo\n11\n12\n13\nBar\nFoo\n16\n17\n18\n19\nFoo\nBar\n22\n23\n24\nFoo\n26\n27\nBar\n29\nFoo\n31\n32\n33\n34\nFooBar\n36",
            ],
            [
                "199",
                "1\n2\n3\n4\nFoo\n6\nBar\n8\n9\nFoo\n11\n12\n13\nBar\nFoo\n16\n17\n18\n19\nFoo\nBar\n22\n23\n24\nFoo\n26\n27\nBar\n29\nFoo\n31\n32\n33\n34\nFooBar\n36\n37\n38\n39\nFoo\n41\nBar\n43\n44\nFoo\n46\n47\n48\nBar\nFoo\n51\n52\n53\n54\nFoo\nBar\n57\n58\n59\nFoo\n61\n62\nBar\n64\nFoo\n66\n67\n68\n69\nFooBar\n71\n72\n73\n74\nFoo\n76\nBar\n78\n79\nFoo\n81\n82\n83\nBar\nFoo\n86\n87\n88\n89\nFoo\nBar\n92\n93\n94\nFoo\n96\n97\nBar\n99\nFoo\n101\n102\n103\n104\nFooBar\n106\n107\n108\n109\nFoo\n111\nBar\n113\n114\nFoo\n116\n117\n118\nBar\nFoo\n121\n122\n123\n124\nFoo\nBar\n127\n128\n129\nFoo\n131\n132\nBar\n134\nFoo\n136\n137\n138\n139\nFooBar\n141\n142\n143\n144\nFoo\n146\nBar\n148\n149\nFoo\n151\n152\n153\nBar\nFoo\n156\n157\n158\n159\nFoo\nBar\n162\n163\n164\nFoo\n166\n167\nBar\n169\nFoo\n171\n172\n173\n174\nFooBar\n176\n177\n178\n179\nFoo\n181\nBar\n183\n184\nFoo\n186\n187\n188\nBar\nFoo\n191\n192\n193\n194\nFoo\nBar\n197\n198\n199",
            ],
            ["21", "1\n2\n3\n4\nFoo\n6\nBar\n8\n9\nFoo\n11\n12\n13\nBar\nFoo\n16\n17\n18\n19\nFoo\nBar"],
            ["1", "1"],
        ],
        solution: "i=0\nexec(\"print(i%5//4*'Foo'+i%7//6*'Bar'or-~i);i+=1;\"*int(input()))",
    },
    {
        title: "Sum of Prime Factors",
        author: "Alextopher",
        testCases: [
            ["60", "12"],
            ["11", "11"],
            ["1086", "186"],
            ["13230", "30"],
        ],
        solution: "n=int(input())\nx=2\nt=0\nwhile x*x<=n:\n if n%x:x+=1\n else:n//=x;t+=x\nprint(t+n*(n>1))",
    },
    {
        title: "High and Low",
        author: "GrT",
        testCases: [
            ["CodinGame", "cOdInGaMe"],
            ["IYouHeIs", "IyOuHeIs"],
            ["quitJOKINGgetSERIOUS", "QuItJoKiNgGeTsErIoUs"],
            ["kjhkshuuiuhlkrgthhkugsuhkdjfksjhgdfkjghkjskjkjg", "kJhKsHuUiUhLkRgThHkUgSuHkDjFkSjHgDfKjGhKjSkJkJg"],
        ],
        solution: "$><<gets.downcase.reverse.gsub(/../){_1[0]+_1[1].upcase}.reverse",
    },
    {
        title: "The zeros at the end of the factorial",
        author: "Azar06",
        testCases: [
            ["5", "1"],
            ["23", "4"],
            ["5113056", "1278260"],
            ["51130563", "12782635"],
            ["219604096115589900", "54901024028897463"],
            ["9223372036854775807", "2305843009213693937"],
        ],
        solution: "n=gets.to_i\nt=0\n(n/=5\nt+=n)while n>0\np t",
    },
    {
        title: "Same birthdays",
        author: "Bob",
        testCases: [
            ["2", "1"],
            ["10", "12"],
            ["20", "42"],
            ["30", "71"],
        ],
        solution: "p=100\nfor i in range(int(input())):p*=1-i/365\nprint(int(100-p)+1)",
    },
    {
        title: "Parentheses",
        author: "MaximePm",
        testCases: [
            ["()()", "true"],
            ["(())()(())", "true"],
            [")()(", "false"],
            [")()(()(()))()", "false"],
            [
                "((()))()(()((()))(()(())())(((()((((()())((((((())((()(()))(()))((()())()()()()))()((()(((((((())()(()(((()(()(()()(((()))(((((()()(((()((()))())((())())((())))((())))()(())))))(()))()())(()()((()((((((((((((())()(()((())((())((((()))(())(()()()(((())((()(()()()(())))(((()())(())))((((()())))(()))((())))()())())))(((((()((((((()))(()()())((()((())((((()))()())((())(()))(())))))()()(()())))((()(())()()(()(((()()))(((((()))(()(())((()((()))(()((())))())))()())(())(())())))))(())))()(())((()())()(()))(()((((((()((())()()))())(((((())()(((())((())(()())(()()((()))()))((((()())())(()()(()()())()(()))(()))(())()())))(())((((((())((()()))(())(())()()()()()()()))()())()())()(())(())((()()(()(((()(()())(()))))))))((()()()))()))(()()))((()(()())(()()))))))))))))())((()(()()))(()))))))()(()(())(((()))()))))(())())))()((())())))(()())())()(()(()())((())())()))())))())())))()())((())(())())()(()(()))())(())()())()(()()()((((())())))))(())()((((())))()))((()())((((())(()()((()((())())(((())((()))(((",
                "false",
            ],
            [
                "(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((())))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))(((((((((((((((((((((((((((((((((((((((((((((((((())))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))",
                "true",
            ],
        ],
        solution: 's=input()\nwhile s!=(s:=s.replace("()","")):pass\nprint(str(len(s)==0).lower())',
    },
    {
        title: "The Bank",
        author: "_NikJ",
        testCases: [
            ["1234", "2 x 500, 1 x 200, 1 x 20, 1 x 10, 2 x 2€"],
            ["100000", "200 x 500€"],
            ["511.15", "IMPOSSIBLE"],
            ["5127000.5", "10254 x 500, 1 x 0.5€"],
        ],
        solution:
            'n=float(input())\nif str(n)[::-1].find(".")>1:input("IMPOSSIBLE")\nl=[]\nt=[500,200,100,50,20,10,5,2,1,0.5,0.2,0.1]\nfor x in t:\n    l+=[int(n/x)]\n    n%=x\nprint(", ".join(f\'{y} x {x}\'for x,y in zip(t,l)if y>0)+"€")',
    },
    {
        title: "The Last Survivor",
        author: "SamSi",
        testCases: [
            ["5", "3"],
            ["100", "73"],
            ["946", "869"],
            ["10000", "3617"],
        ],
        solution: "n=int(input())\na=1\nwhile a<=n:a*=2\nprint(1-a+2*n)",
    },
    {
        title: "Counting Up",
        author: "Popey",
        testCases: [
            ["B", "AB"],
            ["d", "abcd"],
            ["5", "012345"],
            ["Bd5", "ABabcd012345"],
            ["Zz9", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"],
        ],
        solution:
            'a="abcdefghijklmnopqrstuvwxyz"\no=""\nfor i in input():T=lambda l:l[:l.find(i)+1];o+=T(a)+T(a.upper())+T("0123456789")\nprint(o)',
    },
    {
        title: "Closest point to origin",
        author: "djjeck",
        testCases: [
            ["3\n2 2\n-1 1\n-3 -3", "-1 1"],
            ["4\n-1 1\n-1 -1\n1 -1\n1 1", "-1 1"],
            ["1\n6 6", "6 6"],
            [
                "72\n-370 0\n-352 -114\n-352 114\n-350 -120\n-350 120\n-306 -208\n-306 208\n-296 -222\n-296 222\n-222 -296\n-222 296\n-208 -306\n-208 306\n-120 -350\n-365 0\n-364 -27\n-364 27\n-357 -76\n-357 76\n-292 -219\n-292 219\n-275 -240\n-275 240\n-240 -275\n-240 275\n-219 -292\n-219 292\n-76 -357\n-76 357\n-27 -364\n-27 364\n0 -365\n0 365\n27 -364\n27 364\n76 -357\n76 357\n219 -292\n219 292\n240 -275\n240 275\n275 -240\n275 240\n292 -219\n292 219\n357 -76\n357 76\n364 -27\n364 27\n365 0\n-120 350\n-114 -352\n-114 352\n0 -370\n0 370\n114 -352\n114 352\n120 -350\n120 350\n208 -306\n208 306\n222 -296\n222 296\n296 -222\n296 222\n306 -208\n306 208\n350 -120\n350 120\n352 -114\n352 114\n370 0",
                "-365 0",
            ],
            ["3\n-999999 -999999\n1000000 -1000000\n1000000 -999999", "-999999 -999999"],
        ],
        solution: 'print(*min([[*map(int,input().split())]for x in"A"*int(input())],key=lambda x:x[0]**2+x[1]**2))',
    },
    {
        title: "Prime number",
        author: "knightmare",
        testCases: [
            ["1", "2"],
            ["99", "101"],
            ["1929", "1931"],
            ["4294967", "4294973"],
            ["2", "3"],
            ["42940003", "42940043"],
            ["0", "2"],
        ],
        solution: "n=int(input())+1\nwhile True:\n if all(n%i for i in range(2,n))&(n>1):input(n)\n n+=1",
    },
    {
        title: "Next term",
        author: "Paradox",
        testCases: [
            ["3\n1 3 5", "7"],
            ["4\n-7 -3 6 20", "39"],
            ["5\n8 11 19 36 66", "113"],
            ["6\n-1 1 -5 -10 -1 39", "131"],
        ],
        solution:
            "I=input\nI()\n*l,=map(int,I().split())\nt=l[-1]\nwhile len(l)>2:l=[y-x for x,y in zip(l,l[1:])];t+=l[-1]\nI(t)",
    },
    {
        title: "Binary Integer Arithmetic",
        author: "bitm0de",
        testCases: [
            ["1\n13 89", "1012102"],
            ["2\n100 87\n207 188", "2110211\n21112211"],
            ["1\n240 15", "11111111"],
            ["1\n0 0", "0"],
        ],
        solution: "for i in\"A\"*int(input()):a,b=map(int,input().split());print(eval(f'{a:b}+{b:b}'))",
    },
    {
        title: "Help Carl the Magician perform his trick",
        author: "_NikJ",
        testCases: [
            ["4\n430\n842\n972\n521", "842\n"],
            ["15\n1694\n7142\n334\n8985\n5264\n1198\n6316\n1190\n162\n9521\n2535\n3693\n4111\n1871\n5071", "9521\n"],
            [
                "78\n41615\n77108\n24237\n41626\n10158\n19960\n37805\n68738\n5592\n36951\n59712\n2940\n72117\n35674\n98594\n48329\n35857\n92592\n24758\n40029\n56091\n1546\n20986\n32057\n34972\n77763\n54741\n90634\n77983\n42713\n58485\n92469\n17634\n70470\n1303\n53537\n68048\n6077\n88281\n52645\n80876\n52905\n4667\n26786\n94418\n62244\n61280\n58590\n68624\n85324\n88439\n42815\n96702\n76868\n15272\n29466\n92612\n78721\n13373\n52019\n20433\n7449\n46145\n44079\n69568\n196\n8639\n47429\n56103\n6839\n42035\n38829\n4720\n40588\n320\n25473\n81347\n14452",
                "320\n",
            ],
            [
                "78\n65811\n74029\n47477\n82756\n43150\n56682\n57417\n63675\n8451\n24202\n67238\n30943\n23981\n24770\n55759\n92927\n49520\n61642\n36696\n19470\n48656\n99434\n90626\n85010\n84418\n56528\n57859\n47602\n62337\n21856\n32917\n41187\n51556\n43188\n59867\n1863\n99310\n58501\n52512\n97445\n68287\n34614\n16513\n73035\n8732\n64349\n15760\n97310\n58120\n99506\n78158\n65476\n62358\n74286\n35383\n7076\n35239\n75631\n7933\n46611\n47150\n25977\n11228\n40525\n62240\n49896\n31698\n58746\n18675\n17479\n29724\n5214\n66580\n21830\n86315\n78838\n66074\n75250",
                "NONE",
            ],
            ["1\n17", "NONE"],
        ],
        solution:
            'm=[]\nI=input\nexec("x=I();m+=[int(x)]*all(int(x[i])>sum(map(int,x[i+1:]))for i in range(len(x)-1));"*int(I()))\nI(max(m or["NONE"]))',
    },
    {
        title: "Find the Key",
        author: "Chapel",
        testCases: [
            ["54321X", "5"],
            ["7992739871X", "3"],
            ["123246873652189135876516876X", "7"],
            ["123246873652189135876516877651498435979513687618913576519678763546873514896X", "3"],
            ["865435798438X", "0"],
        ],
        solution: "t=i=0\nfor x in input()[~1::-1]:i+=1;t+=(a:=(i%2+1)*int(x),a-9)[a>9]\nprint(-t%10)",
    },
    {
        title: "The longest sequence of repeated digits",
        author: "aCat",
        testCases: [
            ["111", "3"],
            ["100001", "4"],
            ["5232", "1"],
            ["22344442", "4"],
            ["5666666", "6"],
        ],
        solution: "p gets.scan(/((.)\\2*)/).map{_1[0].size}.max",
    },
    {
        title: "Sum of arithmetic progression",
        author: "yamahamm",
        testCases: [
            ["3 3 5", "45"],
            ["2 1 1", "2"],
            ["10 5 7", "175"],
            ["2 3 50", "3775"],
        ],
        solution: "m,d,n=map(int,input().split())\nprint((m*2+~-n*d)*n//2)",
    },
    {
        title: "Candle problem",
        author: "dubicube",
        testCases: [
            ["9\n3", "13"],
            ["42\n0", "42"],
            ["425\n1", "IMPOSSIBLE"],
            ["1000\n4", "1333"],
            ["995\n3", "1492"],
            ["8192\n9999", "8192"],
            ["9999\n3", "14998"],
        ],
        solution: 'I=input\nc,e=int(I()),int(I())\nI(c*e//~-e-(c*e%~-e<1)if e>1else("IMPOSSIBLE",c)[e<1])',
    },
    {
        title: "Squares between two numbers",
        author: "btharper",
        testCases: [
            ["1\n9", "3"],
            ["10\n25", "2"],
            ["26\n35", "0"],
            ["32768\n46340", "34"],
            ["524288\n2097152", "724"],
            ["124288\n2099606", "1097"],
        ],
        solution: "G=lambda x:x*int(input())**.5//1\nprint(int(G(-1)+G(1)+1))",
    },
    {
        title: "Win Rock Paper Scissors",
        author: "Segse",
        testCases: [
            ["ROCK PAPER", "SCISSORS ROCK"],
            ["PAPER SCISSORS", "ROCK PAPER"],
            ["ROCK SCISSORS", "ROCK PAPER"],
            ["PAPER ROCK", "PAPER SCISSORS"],
            ["SUN PAPER", "CHEATER"],
            ["ROCK ROCK", "ROCK PAPER"],
            ["PAPER LASER", "CHEATER"],
        ],
        solution:
            "d=input().split()\nt={'ROCK':'SCISSORS','PAPER':'ROCK','SCISSORS':'PAPER'}\nif not(d[0]in t and d[1]in t):input(\"CHEATER\")\nif t[d[0]]==d[1]:o=d[0],t[d[1]]\nelif t[d[1]]==d[0]:o=t[d[0]],t[d[1]]\nelse:o=d[0],t[t[d[0]]]\nprint(*o)",
    },
    {
        title: "Problem with Doors",
        author: "Kavishankar",
        testCases: [
            ["1", "1"],
            ["100", "10"],
            ["500", "22"],
            ["5000", "70"],
        ],
        solution: "print(int(int(input())**.5))",
    },
    {
        title: "Collatz conjecture",
        author: "Tux",
        testCases: [
            ["16", "4"],
            ["27", "111"],
            ["2147483648", "31"],
            ["75128138247", "1228"],
        ],
        solution: "n=int(input())\nt=0\nwhile n!=1:n=(n//2,n*3+1)[n%2];t+=1\nprint(t)",
    },
    {
        title: "Zlobenian phone numbers",
        author: "Bob",
        testCases: [
            ["012345678901", "012 345 678 901"],
            ["0278 7759 3012", "027 877 593 012"],
            ["+879   (0)9 89 65 63 11 28", "098 965 631 128"],
            ["+879 4 8 5 7 3 3 1 0 0 2 7", "048 573 310 027"],
        ],
        solution:
            'n=input()\nfor r in[" ","+879","(0)"]:n=n.replace(r,"").zfill(12)\nprint(*[n[x:x+3]for x in[0,3,6,9]])\n# n=(\'0\'+gets.gsub(/ |\\+879|\\(0\\)/,\'\'))[-12..]\n# $><<(0..3).map{n[_1*3.._1*3+2]}*\' \'',
    },
    {
        title: "Norms of matrices",
        author: "Elliot",
        testCases: [
            ["2\n2\n0 1\n1 0", "1 1 1"],
            ["2\n2\n1 2\n2 3", "5 5 3"],
            ["4\n3\n1 2 3\n4 5 6\n7 8 9\n10 11 12", "30 33 12"],
            ["4\n3\n-1 0 -7\n0 1 10\n6 -8 1\n11 -22 -13", "31 46 22"],
        ],
        solution:
            'I=input\nn=int(I())\nm=int(I())\na=[[*map(int,I().split())]for i in"A"*n]\nA=[0]*m\nB=[0]*n\nC=0\nfor y in range(n):\n for x in range(m):v=abs(a[y][x]);A[x]+=v;B[y]+=v;C=max(C,v)\nprint(max(A),max(B),C)',
    },
    {
        title: "Radix Possibilities",
        author: "superredlark",
        testCases: [
            ["1", "2 1\n3 1\n4 1\n5 1\n6 1\n7 1\n8 1\n9 1\n10 1\n11 1\n12 1\n13 1\n14 1\n15 1\n16 1"],
            ["e", "15 14\n16 14"],
            ["ffff", "16 65535"],
            ["11", "2 3\n3 4\n4 5\n5 6\n6 7\n7 8\n8 9\n9 10\n10 11\n11 12\n12 13\n13 14\n14 15\n15 16\n16 17"],
            ["3e2", "15 887\n16 994"],
            ["0", "2 0\n3 0\n4 0\n5 0\n6 0\n7 0\n8 0\n9 0\n10 0\n11 0\n12 0\n13 0\n14 0\n15 0\n16 0"],
        ],
        solution: "n=input()\nfor x in range(max(int(max(n),16)+1,2),17):print(x,int(n,x))",
    },
    {
        title: "The Prevailing Element",
        author: "MakeItBetter",
        testCases: [
            ["5\n22\n10\n22\n11\n22", "22"],
            ["8\n1\n1\n1\n1\n1\n1\n1\n1", "1"],
            ["5\n1\n10\n22\n11\n2", "N"],
            ["10\n1\n2\n3\n5\n4\n4\n4\n4\n4\n4", "4"],
            ["10\n32\n32\n32\n32\n32\n32\n31\n31\n31\n31", "32"],
            ["20\n1\n2\n3\n123\n4\n5\n123\n7\n123\n8\n123\n8\n123\n123\n123\n9\n123\n123\n10\n123", "N"],
            [
                "100\n39\n45\n47\n16\n45\n9\n35\n24\n31\n18\n21\n48\n8\n31\n9\n34\n49\n30\n24\n44\n4\n11\n2\n33\n23\n30\n45\n12\n10\n45\n49\n42\n25\n47\n42\n42\n19\n19\n18\n20\n5\n6\n34\n23\n36\n47\n9\n40\n10\n39\n47\n16\n34\n4\n39\n23\n40\n29\n35\n31\n38\n15\n35\n42\n39\n33\n38\n42\n10\n42\n12\n7\n30\n39\n22\n41\n24\n15\n1\n2\n5\n45\n2\n26\n31\n27\n22\n37\n16\n31\n39\n39\n0\n16\n30\n18\n43\n1\n31\n0",
                "N",
            ],
        ],
        solution: 'I=input\nn=int(I())\nl=[I()for i in"A"*n]\nfor x in l:\n if l.count(x)>n//2:I(x)\nI("N")',
    },
    {
        title: "Bouncy Numbers",
        author: "Prez",
        testCases: [
            ["1\n12341", "true"],
            ["3\n1122334455\n114455\n2578", "false\nfalse\nfalse"],
            ["5\n987\n87654\n9876542\n5439\n8421", "false\nfalse\nfalse\ntrue\nfalse"],
            ["5\n2\n6\n5\n-89\n-12356", "false\nfalse\nfalse\n-89\n-12356"],
            ["7\n123456\n654\n-9875\n2\n-8547\n12398\n3645", "false\nfalse\n-9875\nfalse\n-8547\ntrue\ntrue"],
        ],
        solution:
            'for i in"A"*int(input()):\n    x=input()\n    if x[0]=="-":print(x)\n    else:print(str("".join(sorted(x))not in[x,x[::-1]]).lower())',
    },
    {
        title: "Last guess",
        author: "Merome",
        testCases: [
            ["2\n50 +\n52 -", "51"],
            ["6\n50 +\n75 -\n62 +\n68 -\n65 +\n67 -", "66"],
            ["1\n0 -", "Impossible"],
            ["3\n50 +\n75 +\n60 -", "Impossible"],
            ["1\n68 =", "68"],
            ["5\n18 +\n90 -\n95 -\n20 -\n5 +", "19"],
            ["1\n99 +", "100"],
            ["2\n30 +\n20 =", "Impossible"],
        ],
        solution:
            'I=input\nl=0\nh=100\nexec(\'a=I();v=int(a[:-2]);h,l=[[h,max(l,v+1)],[min(h,v-1),l],[min(h,v),max(l,v)]]["+-=".find(a[-1])];\'*int(I()))\nif l==h:I(l)\nI("Impossible")',
    },
    {
        title: "Caesar Box Cipher",
        author: "Niklex",
        testCases: [
            ["CiaonmdGe", "CodinGame"],
            ["SOMEFOXJUMPEDOVER THE DOG", "SOPEEOXER MJD DEUOTOFMVHG"],
            ["CYH aoEMNuAe  R?", "CaN You HEAR Me?"],
            [
                "W  gsaone rcoybi dt se areecwvit vtlla aiachaee drtltn enncd se.hcpid hei c  ear cnvnmhHvdr mooi inue tbaolc1gomrrsoyooe0hlayo dblgs0ton boieei.",
                "World in 100 years might be technological. Humans with very advanced robotic parts on their bodies and maybe even coooler technological devices.",
            ],
        ],
        solution:
            'm=input()\nl=int(len(m)**.5)\nprint(*map("".join,zip(*[m[x:x+l]for x in range(0,len(m),l)])),sep="")',
    },
    {
        title: "Point in Circles",
        author: "Fokz",
        testCases: [
            ["0 0\n2\n0 0 1\n0 0 2", "2"],
            ["2 5\n5\n2 5 1\n0 5 2\n4 5 2\n2 9 4\n2 0 5", "5"],
            [
                "42 24\n20\n298 -359 351\n-597 497 669\n-188 241 503\n193 601 904\n312 869 603\n-51 166 636\n-198 -739 607\n-321 858 735\n672 673 935\n-266 467 16\n-195 898 202\n-753 35 297\n768 -515 659\n-126 -156 376\n-791 -424 480\n221 -173 792\n-894 681 443\n383 34 251\n-933 -624 474\n-862 171 430",
                "6",
            ],
            [
                "1234 4567\n15\n-1409 -4323 7834\n1469 3057 3952\n-4227 2112 5008\n-2264 -838 1055\n-4220 -3238 7363\n-3547 2752 9503\n4222 4623 651\n-2149 -4612 7536\n1607 -604 8099\n4957 -874 3046\n136 -4905 902\n4454 3301 5285\n-2712 1054 6619\n3944 2057 3036\n-2313 -921 7622",
                "6",
            ],
        ],
        solution:
            "I=input\na,b=map(int,I().split())\nt=0\nexec('x,y,r=map(int,I().split());t+=(a-x)**2+(b-y)**2<=r**2;'*int(I()))\nI(t)",
    },
    {
        title: "Affine cryptography",
        author: "nicola",
        testCases: [
            ["1 3\n5\nHELLO", "KHOOR"],
            ["1 -3\n5\nKHOORA.RX", "HELLO YOU"],
            ["0 0\n5\nHELLO", "AAAAA"],
            ["1 13\n11\nHELLO WORLD", "URYY.KG.BYQ"],
            ["4 7\n11\nHELLO WORLD", "GXWWFYIFRWT"],
        ],
        solution:
            'I=input\na,b=map(int,I().split())\nI()\nm=I()\nA="ABCDEFGHIJKLMNOPQRSTUVWXYZ .,"*99\nI("".join(A[a*A.find(c)+b]for c in m))\n# a,b=gets.split.map(&:to_i)\n# gets\n# k=([*?A..?Z]*""+" .,")*99\n# $><<gets.chars.map{k[a*(k.index _1)+b]}*""',
    },
    {
        title: "The Elvita Network",
        author: "TONIO",
        testCases: [
            ["1\nJesus", "Jesus"],
            ["2\nJesus Prince-Charles", "conspiracy"],
            ["3\nElizabeth-II Obama Obama", "Obama"],
            [
                "10\nPrince-Charles Prince-Charles Jesus Sylvain Elizabeth Prince-Charles Prince-Charles Sylvanus Prince-Charles Prince-Charles",
                "Prince-Charles",
            ],
            [
                "10\nPrince-Charles Prince-Charles Jesus Sylvain Elizabeth Prince-Charles Prince-Charles Sylvanus Jesus Prince-Charles",
                "conspiracy",
            ],
        ],
        solution: 'I=input\nI()\nl=I().split()\nfor x in l:\n if l.count(x)>len(l)/2:I(x)\nI("conspiracy")',
    },
    {
        title: "Bi-bi-binary numeration",
        author: "nicola",
        testCases: [
            ["0", "HO"],
            ["4", "BO"],
            ["156", "KADO"],
            ["1420365", "HABAKEDOBODA"],
        ],
        solution: 'n=int(input())\no=""\nfor c in f\'{n:x}\':v=int(c,16);o+="HBKD"[v//4]+"OAEI"[v%4]\nprint(o)',
    },
    {
        title: "Lychrel number testing",
        author: "Tux",
        testCases: [
            ["10", "10 11"],
            ["1221", "1221"],
            ["97", "97 176 847 1595 7546 14003 44044"],
            ["546273", "546273 918918 1738737 9117108 17134227 89377398"],
            ["8433", "8433 11781 30492 59895"],
            [
                "9872",
                "9872 12661 29282 57574 105149 1046650 1613051 3116212 5242325 10474750 16222151 31344412 52788725",
            ],
            [
                "98",
                "98 187 968 1837 9218 17347 91718 173437 907808 1716517 8872688 17735476 85189247 159487405 664272356 1317544822 3602001953 7193004016 13297007933 47267087164 93445163438 176881317877 955594506548 1801200002107 8813200023188",
            ],
            [
                "546276",
                "546276 1218921 2517042 4924194 9838488 18686877 96555558 182111127 903222408 1707444717 8881891788 17753873676 85391709447 159882428805 668706717756 1326424325622 3591658571853 7173417133806 13256734277523 45833978042754 91558065976608 172226022062127 893486242684398",
            ],
        ],
        solution: "n=input()\no=[n]\nwhile n!=n[::-1]:o+=[n:=str(int(n)+int(n[::-1]))]\nprint(*o)",
    },
    {
        title: "Divisors of a number",
        author: "andrefboliveira",
        testCases: [
            ["1", "1"],
            ["2", "1 2"],
            ["10", "1 2 5 10"],
            ["9", "1 3 9"],
        ],
        solution: "n=int(input())\no=[]\nfor i in range(n):\n    if n%-~i==0:o+=[-~i]\nprint(*o)",
    },
    {
        title: "Inverse of opposite",
        author: "Merome",
        testCases: [
            ["5", "-5\n0.2\n-0.2"],
            ["-2", "2\n-0.5\n0.5"],
            ["0", "0\nerror\nerror"],
            ["3.458", "-3.46...\n0.29...\n-0.29..."],
            ["-3.5", "3.5\n-0.29...\n0.29..."],
        ],
        solution:
            "n=float(input())\nP=lambda x:print((f'{x:g}',f'{(X:=round(x,2))}...')[x!=X])\nif n==0:input(\"0\\nerror\\nerror\")\nP(-n)\nP(1/n)\nP(-1/n)",
    },
    {
        title: "Diamond",
        author: "SAURABH",
        testCases: [
            ["4", "####\n   #\n  ###\n #####\n#######\n#######\n #####\n  ###\n   #"],
            ["5", "#####\n    #\n   ###\n  #####\n #######\n#########\n#########\n #######\n  #####\n   ###\n    #"],
            ["1", "#\n#\n#"],
            [
                "10",
                "##########\n         #\n        ###\n       #####\n      #######\n     #########\n    ###########\n   #############\n  ###############\n #################\n###################\n###################\n #################\n  ###############\n   #############\n    ###########\n     #########\n      #######\n       #####\n        ###\n         #",
            ],
        ],
        solution: 'n=int(input())\nprint("#"*n)\nfor i in[*range(1,n+1),*range(n,0,-1)]:print(" "*(n-i)+"#"*(2*i-1))',
    },
    {
        title: "I just peel the stickers off!",
        author: "JBM",
        testCases: [
            [
                "    UUB\n    UUB\n    UUB\n\nLLL FFU RRR DBB\nLLL FFU RRR DBB\nLLL FFU RRR DBB\n\n    DDF\n    DDF\n    DDF",
                "SOLVABLE",
            ],
            [
                "    UUU\n    UUU\n    UUU\n\nLLL FFF RRR BBB\nLLL FFF RRR BBB\nLLL FFF RRR BBB\n\n    DDD\n    DDD\n    DDD",
                "SOLVABLE",
            ],
            [
                "    UUU\n    UUU\n    UUU\n\nUUU UUU UUU UUU\nUUU UUU UUU UUU\nUUU UUU UUU UUU\n\n    UUU\n    UUU\n    UUU",
                "UNSOLVABLE",
            ],
            [
                "    DUD\n    DUU\n    BDL\n\nLLL UFF ULR FBF\nLLR BFF URB DBF\nFRD BUU BFB DBR\n\n    LRR\n    DDR\n    ULR",
                "SOLVABLE",
            ],
            [
                "    UUU\n    UUU\n    UFU\n\nLLL FUF RRR BBB\nLLL FFF RRR BBB\nLLL FFF RRR BBB\n\n    DDD\n    DDD\n    DDD",
                "SOLVABLE",
            ],
            [
                "    UUU\n    UUU\n    UUF\n\nLLL FFR URR BBB\nLLL FFF RRR BBB\nLLL FFF RRR BBB\n\n    DDD\n    DDD\n    DDD",
                "SOLVABLE",
            ],
            [
                "    LRD\n    DFR\n    RBD\n\nULF LRB DBD LLB\nRLL BUU BFD FFU\nBDR URL UDF RFL\n\n    FBU\n    LRU\n    DFU",
                "UNSOLVABLE",
            ],
            [
                "    BDL\n    DBL\n    LUR\n\nBFR BBD LUFDUR\nUBR RRD DLDFUR\nRBF FUU FRFBFD\n\n    UBF\n    LLD\n    LUR",
                "UNSOLVABLE",
            ],
        ],
        solution: 's=open(0).read()\nprint("UN"*({*map(s.count,"ULFRBD")}!={9})+"SOLVABLE")',
    },
    {
        title: "Prime in factorial",
        author: "nicola",
        testCases: [
            ["10\n5", "2"],
            ["570\n11", "55"],
            ["102\n113", "0"],
            ["74896\n79", "960"],
            ["987654\n3", "493820"],
        ],
        solution: "I=input\na=n=int(I())\nP=p=int(I())\nt=0\nwhile a:=n//P:t+=a;P*=p\nI(t)",
    },
    {
        title: "ROT13 cipher",
        author: "informatics",
        testCases: [
            ["URYYB JBEYQ", "HELLO WORLD"],
            ["WNPX FVYIRE NOBEG ZVFFVBA LBH NER PBZCEBZVFRQ", "JACK SILVER ABORT MISSION YOU ARE COMPROMISED"],
            [
                "YOUR MISSION IS IF YOU ACCEPTED TO CURE ALL DECIESES FROM THE WORLD AND BRING WORLD PEACE EVERY AND EACH ONE",
                "LBHE ZVFFVBA VF VS LBH NPPRCGRQ GB PHER NYY QRPVRFRF SEBZ GUR JBEYQ NAQ OEVAT JBEYQ CRNPR RIREL NAQ RNPU BAR",
            ],
            ["THIS HACK WILL BE WAIT FOR IT LEGENDARY", "GUVF UNPX JVYY OR JNVG SBE VG YRTRAQNEL"],
        ],
        solution:
            'A="ABCDEFGHIJKLMNOPQRSTUVWXYZ"*2\nprint(*[(A[A.find(c)+13]," ")[c<"A"]for c in input()],sep="")\n# A=*?A..?Z\n# $><<gets.tr(A*\'\',A.rotate(13)*\'\')',
    },
    {
        title: "Nicely formatted table of numbers",
        author: "MMMAAANNN",
        testCases: [
            ["2\n2", " 0 1\n 2 3"],
            ["3\n4", "  0  1  2  3\n  4  5  6  7\n  8  9 10 11"],
            [
                "37\n3",
                "   0   1   2\n   3   4   5\n   6   7   8\n   9  10  11\n  12  13  14\n  15  16  17\n  18  19  20\n  21  22  23\n  24  25  26\n  27  28  29\n  30  31  32\n  33  34  35\n  36  37  38\n  39  40  41\n  42  43  44\n  45  46  47\n  48  49  50\n  51  52  53\n  54  55  56\n  57  58  59\n  60  61  62\n  63  64  65\n  66  67  68\n  69  70  71\n  72  73  74\n  75  76  77\n  78  79  80\n  81  82  83\n  84  85  86\n  87  88  89\n  90  91  92\n  93  94  95\n  96  97  98\n  99 100 101\n 102 103 104\n 105 106 107\n 108 109 110",
            ],
            [
                "9\n17",
                "   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16\n  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33\n  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50\n  51  52  53  54  55  56  57  58  59  60  61  62  63  64  65  66  67\n  68  69  70  71  72  73  74  75  76  77  78  79  80  81  82  83  84\n  85  86  87  88  89  90  91  92  93  94  95  96  97  98  99 100 101\n 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118\n 119 120 121 122 123 124 125 126 127 128 129 130 131 132 133 134 135\n 136 137 138 139 140 141 142 143 144 145 146 147 148 149 150 151 152",
            ],
            [
                "10\n10",
                "  0  1  2  3  4  5  6  7  8  9\n 10 11 12 13 14 15 16 17 18 19\n 20 21 22 23 24 25 26 27 28 29\n 30 31 32 33 34 35 36 37 38 39\n 40 41 42 43 44 45 46 47 48 49\n 50 51 52 53 54 55 56 57 58 59\n 60 61 62 63 64 65 66 67 68 69\n 70 71 72 73 74 75 76 77 78 79\n 80 81 82 83 84 85 86 87 88 89\n 90 91 92 93 94 95 96 97 98 99",
            ],
        ],
        solution:
            "h=int(input())\nw=int(input())\nfor i in range(h):print('',*[f'{x+i*w:>{len(str(h*w-1))}}'for x in range(w)])",
    },
    {
        title: "Find the middle number",
        author: "Hai",
        testCases: [
            ["5\n1 2 3\n5 3 8\n9 1 7\n4 2 4\n6 6 6", "2\n5\n7\n4\n6"],
            ["4\n1 5 3\n4 2 6\n1 100 1000\n8 9 7", "3\n4\n100\n8"],
            ["1\n-100 -50 -80", "-80"],
            ["3\n-1 1 0\n-65535 0 65535\n65534 -65534 0", "0\n0\n0"],
            ["3\n3 1 1\n-100 -100 7\n-1 -2 -1", "1\n-100\n-1"],
            ["2\n1 1 1\n-1 -1 -1", "1\n-1"],
            ["1\n0 0 0", "0"],
            [
                "20\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2\n3 1 2",
                "2\n2\n2\n2\n2\n2\n2\n2\n2\n2\n2\n2\n2\n2\n2\n2\n2\n2\n2\n2",
            ],
        ],
        solution:
            "exec('print(sorted(map(int,input().split()))[1]);'*int(input()))\n# eval('p gets.split.map(&:to_i).sort[1];'*gets.to_i)",
    },
    {
        title: "Numbers in boxes",
        author: "ValNykol",
        testCases: [
            ["3\n1 2 3\n1\n1", "1"],
            ["3\n2 1 3\n2\n1 3", "2 1"],
            ["5\n2 3 5 1 4\n3\n1 3 5", "5 5 5"],
            ["10\n4 3 2 6 5 1 9 10 8 7\n6\n3 6 7 9 1 5", "2 3 4 4 3 1"],
            [
                "100\n84 58 17 54 90 86 89 85 37 19 83 14 13 64 60 82 41 81 76 44 57 31 35 9 80 87 29 62 91 65 93 97 42 88 11 94 50 52 32 34 70 10 95 77 75 25 2 27 66 28 100 1 39 73 5 22 18 23 96 12 99 40 47 92 20 4 7 55 69 36 16 78 21 3 67 33 46 98 59 74 15 24 26 8 71 45 63 68 43 38 61 48 51 6 49 53 79 30 72 56\n20\n6 37 54 73 69 96 24 31 4 99 18 48 88 65 5 8 59 62 64 25",
                "48 22 48 48 1 7 22 6 48 48 48 48 22 48 22 22 7 22 48 48",
            ],
        ],
        solution: "NO",
    },
    {
        title: "Material advantage in chess",
        author: "seshoumara",
        testCases: [
            ["8\n.R......\nn.......\n........\nk.K.....\n........\n.......P\n........\n........", "3"],
            ["8\n.r..k...\n.....p.p\n......p.\n.r.....P\n.....QP.\n......K.\n.....P..\n........", "-1"],
            ["8\nrnbqkbnr\npppppppp\n........\n........\n........\n........\nPPPPPPPP\nRNBQKBNR", "equal"],
            ["8\nr..q...k\npn..bprp\n....pNp.\n..p.PbQ.\n...p.P..\n.....NR.\nPP....PP\n..B..RK.", "-1"],
            ["8\nq.....k.\n......q.\n.......q\n........\n........\n........\n......R.\n......K.", "-22"],
        ],
        solution:
            's=open(0).read()\np="prr"+"q"*9+"nbr"*3\nprint(sum(map(s.count,p.upper()))-sum(map(s.count,p))or\'equal\')',
    },
    {
        title: "Maximum or minimum speed",
        author: "Arglanir",
        testCases: [
            ["200 100 0.15", "561"],
            ["200 300 0.1", "2691"],
            ["300 200 1", "0"],
            ["500 0 0.1", "0"],
            ["2000 100 0.13", "669"],
            ["-1000 251 0.20", "1000"],
        ],
        solution: "s,p,d=map(float,input().split())\nwhile s!=(s:=int((s+p)*(1-d))):pass\nprint(s)",
    },
    {
        title: "Distinct letters",
        author: "aCat",
        testCases: [
            ["abc", "3"],
            ["abcabc", "3"],
            ["QWEWRTTTTYQQQE", "6"],
            ["ZabCd", "5"],
            ["abBA", "2"],
        ],
        solution: "print(len({*input().lower()}))\n# p gets.upcase.chars.uniq.size",
    },
    {
        title: "Sum of Char Codes",
        author: "Shoko84",
        testCases: [
            ["An exemple", "959"],
            ["Such abc much amaze", "1748"],
            ["Some Camel Case Are Fun", "1971"],
            [':;,=)"(]}[{>ggwpez', "1491"],
        ],
        solution: "print(sum(map(ord,input())))\n#p gets.bytes.sum",
    },
    {
        title: "Diamond",
        author: "Jajoe",
        testCases: [
            ["5", "  *  \n * * \n*   *\n * * \n  *  "],
            [
                "11",
                "     *     \n    * *    \n   *   *   \n  *     *  \n *       * \n*         *\n *       * \n  *     *  \n   *   *   \n    * *    \n     *     ",
            ],
            ["1", "*"],
            [
                "15",
                "       *       \n      * *      \n     *   *     \n    *     *    \n   *       *   \n  *         *  \n *           * \n*             *\n *           * \n  *         *  \n   *       *   \n    *     *    \n     *   *     \n      * *      \n       *       ",
            ],
        ],
        solution:
            'n=int(input())\nfor x in[*range(n//2+1),*range(n//2-1,-1,-1)]:print(f\'{"*"*(x>0)+" "*(~-x*2+1)+"*":^{n}}\')',
    },
    {
        title: "Multiply and sum",
        author: "struct",
        testCases: [
            ["4", "40"],
            ["5", "75"],
            ["15", "1800"],
            ["58", "99238"],
            ["502", "63379006"],
            ["0", "0"],
            ["5210", "70723952550"],
        ],
        solution: "n=int(input())\nprint(n*n*-~n//2)",
    },
    {
        title: "Sum of Fibonacci bits in a string",
        author: "MadKnight",
        testCases: [
            ["testcase", "7"],
            ["Hello, this cruel world!", "4"],
            [
                "Each test case has a test and a validator. Tests are visible to the participants whereas validators are hidden.",
                "7",
            ],
            [
                "Your solution will help us check the validity of tests and validators, and your contribution will be more likely to be accepted. We are currently thinking about a reputation system to reward the CodinGamers who contribute to the website. ",
                "12",
            ],
            [
                "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
                "13",
            ],
            [
                "@ @@@  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
                "4",
            ],
        ],
        solution:
            "s=\"\".join(f'{ord(x):08b}'for x in input())\na,b,o=1,2,int(s[0])\nwhile a<len(s):o+=int(s[a]);a,b=b,a+b\nprint(o)\n# s=gets.bytes.map{'%08b'%_1}*''\n# a,b,o=1,2,s[0].to_i\n# eval 'o+=s[a].to_i;a,b=b,a+b;'*16\n# p o",
    },
    {
        title: "The Legend of the Odd Sevens",
        author: "Shoko84",
        testCases: [
            ["7", "true"],
            ["13", "false"],
            ["28", "false"],
            ["21", "true"],
            ["14", "false"],
            ["119", "true"],
            ["2", "false"],
        ],
        solution: "n=int(input())\nprint(str(n%7==0 and n%2==1).lower())",
    },
    {
        title: "Duration formatting",
        author: "thesbros",
        testCases: [
            ["12000000", "3h 20m"],
            ["83521000", "23h 12m 1s"],
            ["0", "0s"],
            ["202698400", "2d 8h 18m 18s"],
            ["122000", "2m 2s"],
            ["980287204589", "11345d 22h 4s"],
        ],
        solution:
            'i=int(input())//1000\nl=[]\no=[]\nfor x in[60,60,24]:l+=[i%x];i//=x\nl+=[i]\nfor x in"dhms":o+=[str(v:=l.pop())+x]*(v!=0)\nprint(*o or["0s"])',
    },
    {
        title: "Sum Of Powers",
        author: "Niklex",
        testCases: [
            ["4", "15"],
            ["1", "1"],
            ["20", "1048575"],
            ["39", "549755813887"],
            ["2", "3"],
            ["9", "511"],
        ],
        solution: "print(2**int(input())-1)",
    },
    {
        title: "Muffins! CodeBoy Saga-1",
        author: "kurtesy",
        testCases: [
            ["1 1 1 0", "HAPPY"],
            ["23 38 8 2", "NOT HAPPY"],
            ["8888 9999 100 10", "HAPPY"],
            ["1 10000 10000 1", "NOT HAPPY"],
        ],
        solution: 'n,m,r,t=map(int,input().split())\nprint("NOT "*(n>m-r*t)+"HAPPY")',
    },
    {
        title: "ASCII Charts",
        author: "Shoko84",
        testCases: [
            [
                "6\n..#...\n..#..#\n..#..#\n..##.#\n.#####\n######\n5\n3 4 6 5 1",
                "..#.....#..\n..#..#..##.\n..#..#.###.\n..##.#####.\n.#########.\n###########",
            ],
            [
                "7\n####\n####\n####\n####\n####\n####\n####\n11\n6 5 5 4 3 3 2 1 1 0 0",
                "####...........\n#####..........\n#######........\n########.......\n##########.....\n###########....\n#############..",
            ],
            [
                "8\n....##........\n..######......\n##########....\n############..\n##############\n##############\n##############\n##############\n17\n3 3 2 2 3 3 4 4 5 5 6 6 7 7 8 8 7",
                "....##......................##.\n..######..................#####\n##########..............#######\n############..........#########\n##############......###########\n################..#############\n###############################\n###############################",
            ],
            [
                "6\n...#\n#..#\n##.#\n##.#\n####\n####\n10\n0 2 6 5 1 4 0 5 1 3",
                "...#..#.......\n#..#..##...#..\n##.#..##.#.#..\n##.#..##.#.#.#\n####.###.#.#.#\n####.#####.###",
            ],
            [
                "8\n...\n...\n...\n###\n###\n###\n###\n###\n18\n4 5 5 5 5 5 5 4 5 5 5 5 5 5 4 5 5 5",
                ".....................\n.....................\n.....................\n###.######.######.###\n#####################\n#####################\n#####################\n#####################",
            ],
        ],
        solution:
            'I=input\nn=int(I())\nb=[I()for i in"A"*n]\nI()\n*l,=map(int,I().split())\nfor x in range(n):print(b[x]+"".join("#."[x<n-i]for i in l))',
    },
    {
        title: "Objects 2D Map Reader",
        author: "Shoko84",
        testCases: [
            [
                "12345678\n8\n...1..........5.....\n...............5....\n....7....2.....5....\n...............5....\n...3............5...\n...........6........\n......4.............\n...............8....",
                "1: 3 0\n2: 9 2\n3: 3 4\n4: 6 6\n5: 14 0, 15 1, 15 2, 15 3, 16 4\n6: 11 5\n7: 4 2\n8: 15 7",
            ],
            [
                "1234\n5\n..1....4..\n..1....4..\n112....344\n..2....3..\n.22....33.",
                "1: 2 0, 2 1, 0 2, 1 2\n2: 2 2, 2 3, 1 4, 2 4\n3: 7 2, 7 3, 7 4, 8 4\n4: 7 0, 7 1, 8 2, 9 2",
            ],
            [
                "123456\n6\n.2.....1.....\n...........6.\n.....5.......\n.............\n..3..........\n.......4.....",
                "1: 7 0\n2: 1 0\n3: 2 4\n4: 7 5\n5: 5 2\n6: 11 1",
            ],
            ["12345678\n6\n..1..\n..8..\n3....\n....5\n.....\n...4.", "1: 2 0\n3: 0 2\n4: 3 5\n5: 4 3\n8: 2 1"],
            [
                "972435\n3\n2.9....333..\n2...4.37....\n.2.4337....5",
                "9: 2 0\n7: 7 1, 6 2\n2: 0 0, 0 1, 1 2\n4: 4 1, 3 2\n3: 7 0, 8 0, 9 0, 6 1, 4 2, 5 2\n5: 11 2",
            ],
            [
                "a963znc074ps2q\n9\n.app.......9...\n.ap.pppp....9..\n.a....z.z....9.\na......z..q..9.\n..9.0.z.z.q...a\n..90.0...q...a.\n...9...c.....a.\n....9...ccc..a.\n...............",
                "a: 1 0, 1 1, 1 2, 0 3, 14 4, 13 5, 13 6, 13 7\n9: 11 0, 12 1, 13 2, 13 3, 2 4, 2 5, 3 6, 4 7\nz: 6 2, 8 2, 7 3, 6 4, 8 4\nc: 7 6, 8 7, 9 7, 10 7\n0: 4 4, 3 5, 5 5\np: 2 0, 3 0, 2 1, 4 1, 5 1, 6 1, 7 1\nq: 10 3, 10 4, 9 5",
            ],
        ],
        solution:
            'I=input\ns=I()\nn=int(I())\nt=[I()for i in"A"*n]\nfor c in s:\n l=""\n for y in range(n):\n  for x in range(len(t[0])):\n   if t[y][x]==c:l+=f\'{x} {y}, \'\n if len(l):print(c+":",l[:-2])',
    },
    {
        title: "String transformation",
        author: "ValNykol",
        testCases: [
            ["bubble gum\nturtle ham", "bubble gum\ntubble gum\nturble gum\nturtle gum\nturtle hum\nturtle ham"],
            ["sayonara\nserenity", "sayonara\nseyonara\nseronara\nserenara\nserenira\nserenita\nserenity"],
            [
                "it is a miracle\ni got a monocle",
                "it is a miracle\ni  is a miracle\ni gis a miracle\ni gos a miracle\ni got a miracle\ni got a moracle\ni got a monacle\ni got a monocle",
            ],
            [
                "aren't you worried?\nprepare our troops!",
                "aren't you worried?\npren't you worried?\nprep't you worried?\nprepat you worried?\nprepar you worried?\nprepareyou worried?\nprepare ou worried?\nprepare ourworried?\nprepare our orried?\nprepare our trried?\nprepare our troied?\nprepare our trooed?\nprepare our troopd?\nprepare our troops?\nprepare our troops!",
            ],
        ],
        solution: "s=input()\nt=input()\nl=0\nfor x in range(len(s)+1):\n    if l!=(l:=t[:x]+s[x:]):print(l)",
    },
    {
        title: "Primes",
        author: "Macbeth",
        testCases: [
            ["11", "4"],
            ["5000", "669"],
            ["10000", "1229"],
            ["100000", "9592"],
        ],
        solution:
            "n=int(input())\np=[2]\nfor x in range(3,n):\n    if all(x%i for i in p):p+=[x]\nprint(len(p))\n# require'prime'\n# p Prime.each(gets.to_i-1).to_a.size",
    },
    {
        title: "Mixed up",
        author: "N.T.",
        testCases: [
            ["5\n1 2 6 5 4", "1 2 5 6 4"],
            ["7\n9 8 6 7 5 4 3", "8 9 6 7 4 5 3"],
            ["1\n1000", "1000"],
            ["10\n54 21 6 33 14 70 20 88 99 14", "21 54 6 33 14 70 20 88 14 99"],
        ],
        solution:
            "input()\n*l,=map(int,input().split())\nfor x in range(0,len(l),2):l[x:x+2]=sorted(l[x:x+2])\nprint(*l)",
    },
    {
        title: "A strange calendar",
        author: "Antoine_LurcyLeBourg",
        testCases: [
            ["2016 3 14", "2016 3 15"],
            ["2001 5 17", "2001 6 1"],
            ["-23 11 5", "-23 11 6"],
            ["155 11 17", "156 1 1"],
            ["-78 11 17", "-77 1 1"],
            ["-1 11 9", "-1 11 10"],
            ["-1 11 17", "1 1 1"],
            ["111 7 17", "111 7 18"],
            ["1001 10 23", "1001 10 24"],
            ["-5001 7 24", "-5001 8 1"],
            ["-1 10 24", "-1 11 1"],
            ["8 10 17", "8 10 18"],
        ],
        solution:
            "y,m,d=map(int,input().split())\nif d<17+7*(m in[7,10]):d+=1\nelse:\n    d=1\n    if m<11:m+=1\n    else:m=1;y+=1+(y==-1)\nprint(y,m,d)",
    },
    {
        title: "Tiles",
        author: "Racso",
        testCases: [
            ["20 15", "12"],
            ["10 10", "1"],
            ["800 400", "2"],
            ["907 613", "555991"],
            ["996211 999023", "995237701853"],
        ],
        solution: "import math\nn,m=map(int,input().split())\ng=math.gcd(n,m)\nprint(n//g*m//g)",
    },
    {
        title: "Sales on the most expensive item",
        author: "Shoko84",
        testCases: [
            ["20\n3\n100\n400\n200", "620"],
            ["10\n5\n10\n20\n5\n1\n2", "36"],
            ["50\n3\n1030\n2090\n39", "2114"],
            ["23\n5\n399\n245\n308\n123\n95", "1079"],
            ["100\n3\n301\n450\n323", "624"],
            ["40\n2\n990\n990", "1584"],
            ["0\n4\n490\n231\n599\n236", "1556"],
            ["23\n15\n923\n1009\n3499\n2375\n234\n19091\n738\n382\n69\n10\n50\n938\n23\n623\n72", "25646"],
        ],
        solution:
            "s,_,*l=map(int,open(0))\nprint(int(sum(l)-max(l)*s/100+.99))\n# s,_,*l=`dd`.split.map(&:to_i)\n# p (l.sum-l.max*s/100).to_i",
    },
    {
        title: "Bus routes",
        author: "Shoko84",
        testCases: [
            ["20\n3\n50\n20\n5", "16"],
            ["60\n4\n100\n30\n14\n33", "15"],
            ["50\n5\n30\n10\n5\n0\n3", "6"],
            ["100\n6\n0\n0\n0\n0\n0\n0", "0"],
            ["1\n2\n1\n3", "12"],
            ["55\n4\n350\n205\n310\n22", "85"],
            ["53\n14\n92\n63\n292\n82\n14\n58\n74\n127\n81\n9\n14\n32\n15\n29", "285"],
            ["20\n3\n50\n20\n10", "16"],
        ],
        solution: "c,n,*l=map(int,open(0))\ns=sum(l)\nprint((s//c+(s%c>0))*-~n)",
    },
    {
        title: "Keywords table",
        author: "Shoko84",
        testCases: [
            ["5\n7\npick\nsome\npink\nor\nreddish\ncolor\nplease\n1\n1", "pick\nsome\npink\nor\nreddish"],
            ["2\n7\nthreshold\nbreak\nengine\nnode\nmonitor\nextension\nsink\n1\n1", "threshold\nbreak"],
            [
                "3\n14\nlens\nfive\ndaily\noculus\ncondition\nedge\nrift\nholographic\ninterval\nleague\nanticipation\nfix\ncurve\nappearing\n1\n2",
                "oculus\ncondition\nedge",
            ],
            ["4\n8\nconstitution\ncentering\nrhyme\nswear\nwin\nfound\nhelmet\noil\n1\n2", "win\nfound\nhelmet\noil"],
            [
                "9\n9\ntailor\ncash\nshift\ncaps\nmoney\ndispute\nargue\nconnector\ninsurance\n1\n1",
                "tailor\ncash\nshift\ncaps\nmoney\ndispute\nargue\nconnector\ninsurance",
            ],
            [
                "4\n45\nsaving\nball\nbasket\nfootball\nblessed\ninjured\nburden\ntaking\non\nvice\ncity\ncapitalism\nwar\nsunshine\nworld\nmoon\ntoy\nstory\nsomething\nwrong\nfalse\ntrue\nestimation\ngoodness\ntransfer\nannual\nmonthly\ngenerator\nceremony\nknife\nsharp\nbadge\nfish\nsteak\npork\ninefficiency\ntemperature\ncold\nhot\ntemperate\ninside\nbody\ndiversity\nnature\nbridge\n1\n6",
                "false\ntrue\nestimation\ngoodness",
            ],
            [
                "3\n13\nsatire\ndestination\njoking\nafternoon\nargument\nsupernatural\nfather\nlot\npeculiar\nassociate\nambassador\nderivative\nrectangle\n3\n2 3 4",
                "afternoon\nargument\nsupernatural\nfather\nlot\npeculiar\nassociate\nambassador\nderivative",
            ],
            [
                "3\n10\nsing\ncloser\nautomatic\ncosting\nlodge\nenough\nlaying\nfog\ndebate\nletting\n2\n3 1",
                "laying\nfog\ndebate\nsing\ncloser\nautomatic",
            ],
            [
                "4\n45\nsaving\nball\nbasket\nfootball\nblessed\ninjured\nburden\ntaking\non\nvice\ncity\ncapitalism\nwar\nsunshine\nworld\nmoon\ntoy\nstory\nsomething\nwrong\nfalse\ntrue\nestimation\ngoodness\ntransfer\nannual\nmonthly\ngenerator\nceremony\nknife\nsharp\nbadge\nfish\nsteak\npork\ninefficiency\ntemperature\ncold\nhot\ntemperate\ninside\nbody\ndiversity\nnature\nbridge\n3\n6 3 5",
                "false\ntrue\nestimation\ngoodness\non\nvice\ncity\ncapitalism\ntoy\nstory\nsomething\nwrong\n",
            ],
        ],
        solution:
            'I=input\nm=int(I())\nl=[I()for i in"A"*int(I())]\nI()\nfor x in I().split():a=int(x)*m;print(*l[a-m:a],sep="\\n")',
    },
    {
        title: "MinusStarPlus",
        author: "GiB",
        testCases: [
            ["5\n3", "2158"],
            ["0\n0", "0"],
            ["4\n6", "-22410"],
            ["100000\n99987", "139998700000199987"],
            ["34000000\n20000000", "1400000068000000000000054000000"],
        ],
        solution:
            "I=input\nn=int(I())\nm=int(I())\nI(int(f'{n-m}{n*m}{n+m}'))\n# a=gets.to_i\n# b=gets.to_i\n# p (\"#{a-b}#{a*b}#{a+b}\").to_i",
    },
    {
        title: "Sum of vectors",
        author: "MadKnight",
        testCases: [
            ["3 2\n2 3 4\n1 1 1", "1 2 3"],
            ["4 3\n2 3 4 5\n1 1 1 1\n2 2 2 2", "3 4 5 6"],
            ["4 4\n2 3 4 5\n1 1 1 1\n2 2 2 2\n1 2 3 4", "2 2 2 2"],
            ["4 5\n2 3 4 5\n1 1 1 1\n2 2 2 2\n1 2 3 4\n5 3 6 1", "7 5 8 3"],
            [
                "7 15\n28 -5 -9 -4 8 -8 13\n20 0 10 -4 14 4 8\n18 30 15 23 6 24 -8\n-9 29 12 4 8 28 26\n-5 1 25 6 20 -1 -5\n9 -7 2 5 18 25 22\n1 22 18 29 -5 9 15\n29 14 30 22 -4 3 2\n-5 30 8 18 22 25 27\n-9 3 0 20 9 -2 11\n13 13 5 25 5 19 30\n1 12 2 20 20 5 7\n-5 21 3 22 11 5 15\n11 25 27 26 -8 22 15\n-3 -8 -9 -6 -9 -6 7",
                "-10 28 -27 20 1 -18 3",
            ],
        ],
        solution:
            "_,*l=[[*map(int,x.split())]for x in open(0)]\nprint(*[sum(x[::2])-sum(x[1::2])for x in zip(*l)])\n# gets\n# $><<[*$<].map{_1.split.map(&:to_i)}.transpose.map{b=1;_1.inject{|c,v|c+(b=-b)*v}}*' '",
    },
    {
        title: "Arithmetic Mean",
        author: "JBM",
        testCases: [
            ["5\n1 2 3 4 5", "3"],
            ["5\n2 4 1 3 5", "3"],
            ["10\n1 10 2 9 3 8 4 7 5 6", "5.5"],
            ["6\n-320 500 400 1 3 -2", "97"],
        ],
        solution:
            "I=input\nn=int(I())\nI(f'{sum(map(int,I().split()))/n:g}')\n# n=gets.to_i\n# $><<\"%g\"%(gets.split.sum(&:to_f)/n)",
    },
    {
        title: "Parallel Lines",
        author: "JBM",
        testCases: [
            [
                "20 10\n....................\n....................\n--------------------\n....................\n....................\n....................\n--------------------\n....................\n....................\n....................\n",
                "VALID",
            ],
            [
                "19 10\n..|............|...\n..|............|...\n..|............|...\n..|............|...\n..|............|...\n..|............|...\n..|............|...\n..|............|...\n..|............|...\n..|............|...\n",
                "VALID",
            ],
            [
                "19 10\n...............|...\n...............|...\n...............|...\n---------------+---\n...............|...\n...............|...\n...............|...\n...............|...\n...............|...\n...............|...\n",
                "INVALID",
            ],
            [
                "19 10\n...................\n-------............\n.......-------.....\n..............-----\n...................\n-------............\n.......-------.....\n..............-----\n...................\n...................\n",
                "INVALID",
            ],
            [
                "19 10\n........./...../...\n......../...../....\n......./...../.....\n....../...../......\n...../...../.......\n..../...../........\n.../...../.........\n../...../..........\n./...../...........\n/...../............\n",
                "INVALID",
            ],
            [
                "19 10\n...\\.....\\.........\n....\\.....\\........\n.....\\.....\\.......\n......\\.....\\......\n.......\\.....\\.....\n........\\.....\\....\n.........\\.....\\...\n..........\\.....\\..\n...........\\.....\\.\n............\\.....\\\n",
                "INVALID",
            ],
            [
                "20 10\n....................\n....................\n--------------------\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n",
                "INVALID",
            ],
            [
                "20 10\n................|...\n................|...\n................|...\n................|...\n................|...\n................|...\n................|...\n................|...\n................|...\n................|...\n",
                "INVALID",
            ],
            [
                "20 10\n....................\n....................\n--------------------\n....................\n--------------------\n....................\n....................\n....................\n--------------------\n....................\n",
                "INVALID",
            ],
            [
                "20 10\n..|.....|......|....\n..|.....|......|....\n..|.....|......|....\n..|.....|......|....\n..|.....|......|....\n..|.....|......|....\n..|.....|......|....\n..|.....|......|....\n..|.....|......|....\n..|.....|......|....\n",
                "INVALID",
            ],
            [
                "20 10\n..-...-.....-...-...\n.-...-.....-...-....\n-...-.....-...-.....\n...-.....-...-.....-\n..-.....-...-.....-.\n.-.....-...-.....-..\n-.....-...-.....-...\n.....-...-.....-...-\n....-...-.....-...-.\n...-...-.....-...-..\n",
                "INVALID",
            ],
            [
                "20 10\n....|......|........\n...|......|.........\n..|......|..........\n.|......|...........\n|......|............\n......|............|\n.....|............|.\n....|............|..\n...|............|...\n..|............|....\n",
                "INVALID",
            ],
        ],
        solution:
            'I=input\nw,h=map(int,I().split())\nb=[I()for i in"A"*h]\nI(("","IN")[[*map("".join(b).count,"-|")]not in[[0,h*2],[w*2,0]]or any(".-"in x or"-."in x for x in b)or any(".|"in x or"|."in x for x in map("".join,zip(*b)))]+"VALID")\n# w,h=gets.split.map(&:to_i)\n# b=[*$<]*\'\'\n# $><<((b=~/^((\\.{#{w}}\\n)*?-{#{w}}\\n){2}(\\.{#{w}}\\n)*$|^((\\.*\\|){2}\\.*\\n)\\4{#{h-1}}$/)==0?\'\':\'IN\')+\'VALID\'',
    },
    {
        title: "Average character",
        author: "Varnas",
        testCases: [
            ["ABC", "B"],
            ["KLMNOPQRS", "O"],
            ["QWROJA", "N"],
            ["ToavX", "P"],
            [
                "AwotIJHOAIJSRoieJHOjasOIADaoiHAOHJAOIJGOIajdOIQWJTOIGJDOINCOIASORIOGIMAOIMEORIQEMOIGMEOIFMASKDJQOWJGOJOASJOIQWOGIMASOIDMOQWIROQIGJOIAMSFOAIJGIHIWUNVNZMXCNXCKJQOWRIEOGSDGSPOKSDLAMKMROQIJRDFLKMZXOIAJSQPIRKLMAdglkaSFAJOIAJFOIQWJEOIQJKAMCLKACMALKSDLAKWEQANLEIRJRQFIJAOIVAWOTIJHOAIJSROIEJHOJASOIADAOIHAOHJAOIJGOIAJDOIQWJTOIGJDOINCOIASORIOGIMAOIMEORIQEMOIGMASODLQWKEJOIFJLKMALSKQIOWELKMZLXKMFALSFJQOIWEAOISFWIDHGPSODRJAWOPIJHOIDJOIAJTGIOJAORAJWOIJHOFMAOIFMOIPDMOAIPWJTOPIJDOIFjawoiRJOIpjmaioGJIGHAIJRHQHQIUEIvnaksJDNWIORQIOPEGHIDVNAJKNASIPHRQEUITHIUHDNAJSNWIHJQIWJQEOIGOIDVNAKOSDNAOPWPJQOPIWTJQEOIPGDPJFNASPJNQWOIRQWIOTOIVNAKSFNAIOAWOTIJHOAIJSROIEJHOJASOIADAOIHAOHJAOIJGOIAJDOIQWJTOIGJDOINCOIASORIOGIMAOIMEORIQEMOIGMASODLQWKEJOIFJLKMALSKQIOWELKMZLXKMFALSFJQOIWEAOISFWIDHGPSODRJAWOPIJHOIDJoiajTGIOJAORAJWOIJHOFMAOIFMOIPDMOAIPWJTOPIJDOIFJAWOIRJOIPJMAIOGJIGHAIJRHQHQIUEIVNAKSJDNWIORQIOPEGHIDVIPNWIHJQIWJQEOIGOIDVNAKOSDNAOPWPJQOPIWTJqeoIPGDPJFNASPJNQWJQWOIRJgonasKFAWOEJQWOIJOGALKFNASLFKqeqOFIJAOISFJAOISFJAWOI",
                "K",
            ],
        ],
        solution:
            "*l,=map(ord,input().upper())\nprint(chr(sum(l)//len(l)))\n# l=gets.chomp.upcase.bytes\n# $><<(l.sum/l.size).chr",
    },
    {
        title: "Angle between vectors",
        author: "MadKnight",
        testCases: [
            ["3 6", "3"],
            ["6 3", "3"],
            ["3 358", "5"],
            ["100 360", "100"],
            ["5777 3876322", "175"],
        ],
        solution:
            "a,b=[int(x)%360for x in input().split()]\nt=abs(a-b)\nprint(min(t,abs(360-t)))\n# a,b=gets.split.map{_1.to_i%360}\n# t=(a-b).abs\n# t=360-t if t>180\n# p t",
    },
    {
        title: "English programming language",
        author: "anonymousm",
        testCases: [
            ["write Hello World!.", "Hello World!"],
            ["write Hello World!", "Syntax Error"],
            ["3 times write hello.", "hello\nhello\nhello"],
            ["write hello. 10 times", "hello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello\nhello"],
            ["please 1 times write Done!.", "Done!"],
        ],
        solution:
            'import re\nc=input()\nif "."not in c:input("Syntax Error")\nt=int((re.search(r"(\\d+)",c)or[1])[0])\nfor i in range(t):print(re.findall(r"te (.+)\\.",c)[0])\n# c=gets.chomp\n# [(c.scan(/\\d+/))[0].to_i,1].max.times{puts c.scan(/te (.+)\\./)}\n# exit if c[\'.\']!=p\n# puts\'Syntax Error\'',
    },
    {
        title: "Simon says",
        author: "Keelhaul",
        testCases: [
            ["Simon says : write 42", "42"],
            ["Simon says : please write I love cakes", "I love cakes"],
            ["Samantha says : write 42", "..."],
            ["Simon says : write", "..."],
            ["Jack says : Simon says : write I trolled you !", "..."],
            ["Simon says : write Simon says : write I'm so meta !", "Simon says : write I'm so meta !"],
            ["Simon says : do a barrel roll !", "..."],
            ["Simoonmoon says : write wow such simon, much says !", "..."],
            ["Simon write says : what ?", "..."],
        ],
        solution:
            's=input()\nw=s.find("te")\nprint(s[w+3:]*(s[4:7]=="n s"and w>0) or"...")\n#s=gets.chomp\n#puts (s[((s=~/te/)||99)+3..]if(s=~/n s/)==4)||\'...\'',
    },
    {
        title: "Construct a square",
        author: "SahilK",
        testCases: [
            ["3", "+++\n+++\n+++"],
            ["1", "+"],
            [
                "18",
                "++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++\n++++++++++++++++++",
            ],
            ["8", "++++++++\n++++++++\n++++++++\n++++++++\n++++++++\n++++++++\n++++++++\n++++++++"],
        ],
        solution: "x=int(input())\nexec('print(\"+\"*x);'*x)\n# x=gets.to_i\n# puts ['+'*x]*x",
    },
    {
        title: "Combination of Progression",
        author: "smartdiscover17",
        testCases: [
            ["4\n2\n3", "4 6 8\n4 2 1"],
            ["81\n3\n4", "81 84 87 90\n81 27 9 3"],
            ["10\n1\n3", "10 11 12\n10 10 10"],
            ["27\n3\n3", "27 30 33\n27 9 3"],
        ],
        solution:
            "l,m,n=map(int,open(0))\na=[l+m*x for x in range(n)]\nb=[l//m**x for x in range(n)]\nprint(*a)\nprint(*b)",
    },
    {
        title: "Semi-Ellipse",
        author: "Varnas",
        testCases: [
            ["0 0 4 4", "13"],
            ["67 67 -5 -5 ", "4070"],
            ["-63 -42 11 42", "4880"],
            ["-32 -67 -70 -20", "1403"],
            ["-99 -99 99 99", "30776"],
            ["-10 50 0 10", "314"],
        ],
        solution:
            "a,b,x,y=map(int,input().split())\nprint(-int(-3.14*abs((x-a)*(y-b))//4))\n# a,b,x,y=gets.split.map(&:to_i)\n# p (3.14*(x-a)*(y-b)/4).abs.ceil",
    },
    {
        title: "Dentist",
        author: "Varnas",
        testCases: [
            ["2\n----------1---------\n----------0---------", "----------1---------\n--------------------"],
            ["2\n----1111110-1110----\n---111-10-11111-----", "----111111--111-----\n---111-1--11111-----"],
            [
                "2\n1111111---1111111100000111000111\n111100000---1111010101111111---1",
                "1111111---11111111-----111---111\n1111--------1111-1-1-1111111---1",
            ],
            [
                "5\n---11-1-01-01110-1-0-10-10-1-111\n11--0--------101-0-10----010---1\n---1-010-10-10-1-01-01-01--00111\n---1111---111---1010101011000111\n---1111---10-10-10-101-000-00111",
                "---11-1--1--111--1---1--1--1-111\n11-----------1-1---1------1----1\n---1--1--1--1--1--1--1--1----111\n---1111---111---1-1-1-1-11---111\n---1111---1--1--1--1-1-------111",
            ],
            [
                "10\n-1-01-0-10-10-10-1-01-01\n1----101-0-10---10-1-0-10-1-0111\n--------01--10-1-01-01-0-1\n-10-10-1-01-0-1-01-1-0-10-1-1-00\n-01--10-1-1-1-1-1-1-10000\n---------------\n----10-1-0-10-1-11111--0-0-0\n-01---------------1010111111----\n---------1010110101011011-1-\n----1-0-10-1-1--1-1-1-1-",
                "-1--1---1--1--1--1--1--1\n1----1-1---1----1--1---1--1--111\n---------1--1--1--1--1---1\n-1--1--1--1---1--1-1---1--1-1---\n--1--1--1-1-1-1-1-1-1----\n---------------\n----1--1---1--1-11111-------\n--1---------------1-1-111111----\n---------1-1-11-1-1-11-11-1-\n----1---1--1-1--1-1-1-1-",
            ],
        ],
        solution: "exec('print(input().replace(\"0\",\"-\"));'*int(input()))\n#puts`dd`.sub(/.+\\n/,'').tr'0','-'",
    },
    {
        title: "Parametric sequence",
        author: "Lupilum",
        testCases: [
            ["1 4 \n5 2 \n1", "111155"],
            ["3 5 \n2 7 \n2", "333332222222444443333333\n"],
            ["4 3 \n3 5 \n5", "4443333355544444666555557776666688877777"],
            ["8 2 \n7 4 \n3", "887777998888009999"],
            ["7 1\n4 3\n7\n", "7444855596660777188829993000"],
            ["6 2 \n8 1 \n4", "668779880991"],
        ],
        solution:
            "G=lambda:map(int,input().split())\na,b=G()\nc,d=G()\nfor x in range(int(input())):print(end=str((a+x)%10)*b+str((c+x)%10)*d)",
    },
    {
        title: "Find the right angle",
        author: "Entilore",
        testCases: [
            ["O 0 0\nA 1 1\nB -1 1", "O"],
            ["O 0 0\nA 1 1\nB 2 0", "A"],
            ["O 0 0\nA 4 -2\nB 1 1", "B"],
            ["A 1 2\nB 3 4\nC 5 6", "_"],
            ["A -578 238\nB 253 -815\nC 955 -261", "B"],
            ["A 0 0\nB 0 1\nC 1 0", "A"],
        ],
        solution: "NO",
    },
    {
        title: "Increment until different",
        author: "Lupilum",
        testCases: [
            ["7", "8"],
            ["20", "31"],
            ["797", "800"],
            ["5514", "6000"],
            ["256055", "311111"],
            ["3", "4"],
            ["56", "70"],
            ["759", "800"],
            ["76031", "82222"],
            ["913015", "2222222"],
            ["72819", "300000"],
        ],
        solution:
            "m=n=int(input())\nwhile{*str(n)}&{*str(m)}!=set():n+=1\nprint(n)\n# n=m=gets.to_i\n# n+=1while n.digits&m.digits!=[]\n# p n",
    },
    {
        title: "N-th number in array",
        author: "_NikJ",
        testCases: [
            ["3", "2\n"],
            ["55", "10\n"],
            ["13", "3\n"],
            ["51", "6\n"],
            ["1714636915", "29395\n"],
            ["100000000000000", "1749820\n"],
        ],
        solution: "d=int(input())\na=int((2*d)**.5-.5)\ng=int(d-a*-~a/2)\nprint((a,g)[g>0])",
    },
    {
        title: "Average ASCII value of string",
        author: "ash2620",
        testCases: [
            ["abc", "98"],
            ["Coding", "99"],
            ["Average", "99"],
            ["bored", "104"],
            ["a", "97"],
        ],
        solution: "s=input()\nprint(sum(map(ord,s))//len(s))\n# s=gets.chomp\n# p s.bytes.sum/s.size",
    },
    {
        title: "Skyline",
        author: "DaFrElUf",
        testCases: [
            ["1\n4 2 0", "##\n##\n##\n##"],
            ["3\n3 1 1\n2 2 3\n3 2 0", "#......##\n#.##...##\n#.##...##"],
            [
                "5\n4 2 1\n5 3 2\n2 2 0\n4 1 1\n3 2 0",
                "...###........\n##.###....#...\n##.###....#.##\n##.###..###.##\n##.###..###.##",
            ],
            [
                "13\n2 1 0\n3 1 0\n4 1 0\n5 1 0\n6 3 0\n5 1 0\n4 2 0\n5 1 0\n6 3 0\n5 1 0\n4 1 0\n3 1 0\n2 1 0\n",
                "....###....###....\n...#####..#####...\n..##############..\n.################.\n##################\n##################",
            ],
            [
                "13\n11 1 0\n12 2 0\n11 1 2\n2 1 0\n4 1 0\n5 9 0\n4 1 3\n13 1 0\n14 1 2\n8 1 0\n9 2 0\n8 1 4\n1 29 0",
                "......................#.......................................\n.....................##.......................................\n.##..................##.......................................\n####.................##.......................................\n####.................##.......................................\n####.................##...##..................................\n####.................##..####.................................\n####.................##..####.................................\n####.................##..####.................................\n####....#########....##..####.................................\n####...###########...##..####.................................\n####...###########...##..####.................................\n####..############...##..####.................................\n####..############...##..####....#############################",
            ],
        ],
        solution:
            't=[]\nb=[[*map(int,input().split())]for i in"A"*int(input())]\ny=max([x[0]for x in b])\nfor h,w,o in b:t+=["."*(y-h)+"#"*h]*w+["."*y]*o\nprint(*map("".join,zip(*t)),sep="\\n")',
    },
    {
        title: "Bowling Round Score",
        author: "JoshL",
        testCases: [
            ["2\nJosh 3 /\nJack - -", "Josh"],
            ["3\nJosh 3 -\nJack 2 /\nJohn 2 6", "Jack"],
            ["1\nJames X -", "James"],
            ["4\nAnna 1 1\nBarney 2 2\nClaire 3 3\nDonald 4 4", "Donald"],
            ["2\nAndrew X -\nBethany - -", "Andrew"],
        ],
        solution:
            'print(sorted([10if b=="X"or c=="/"else int(((0,c)[c!="-"],b)[b!="-"]),a]for i in"A"*int(input())for a,b,c in[input().split()])[-1][1])',
    },
    {
        title: "Reverse String Length Puzzle",
        author: "JoshL",
        testCases: [
            ["Hello, world!", "6"],
            ["Hello there, I am a string.", "13"],
            ["Can you figure out the solution to this puzzle?", "23"],
            ["You can do it! I believe in you!", "16"],
        ],
        solution: "print(len(input())//2)\n# p gets.size/2",
    },
    {
        title: "Pi is a number",
        author: "PacMann",
        testCases: [
            ["90", "P/2"],
            ["-180", "P"],
            ["-90", "3*P/2"],
            ["45", "P/4"],
            ["225", "5*P/4"],
            ["-135", "5*P/4"],
        ],
        solution:
            'x=int(input())\nif x<0:x+=360\nn,d=x//45,4\nif x%180<1:n,d=x//180,1\nelif x%90<1:n,d=x//90,2\nprint(("",f"{n}*")[n>1]+"P"+("",f"/{d}")[d>1])',
    },
    {
        title: "Point in Triangle",
        author: "Hyakumanten",
        testCases: [
            ["0 0\n2\n-340 495 -153 -910 835 -947\n-175 41 -421 -714 574 -645", "inside\noutside"],
            [
                "0 0\n4\n-330 -370 -309 -439 173 547\n-279 -829 -509 397 457 816\n331 430 943 853 -851 -942\n122 582 662 912 68 757",
                "outside\ninside\ninside\noutside",
            ],
            ["10 -100\n2\n-508 80 850 -188 483 -326\n777 -974 -57 990 74 19", "inside\noutside"],
            ["999 999\n3\n1 1 1 0 0 1\n2 0 0 2 999 998\n11 11 11 12 12 11", "outside\noutside\noutside"],
        ],
        solution:
            'x,y=map(int,input().split())\nfor i in"A"*int(input()):\n a,b,c,d,e,f=map(int,input().split())\n A=(-d*e+b*(-c+e)+a*(d-f)+c*f)\n h=(b*e-a*f+(f-b)*x+(a-e)*y)/A\n j=(a*d-b*c+(b-d)*x+(c-a)*y)/A\n print(("out","in")[h>0<j and h+j<1]+"side")',
    },
    {
        title: "The window",
        author: "Onys",
        testCases: [
            ["3", "---------\n|...|...|\n|...|...|\n|...|...|\n|---+---|\n|...|...|\n|...|...|\n|...|...|\n---------"],
            ["1", "-----\n|.|.|\n|-+-|\n|.|.|\n-----"],
            [
                "7",
                "-----------------\n|.......|.......|\n|.......|.......|\n|.......|.......|\n|.......|.......|\n|.......|.......|\n|.......|.......|\n|.......|.......|\n|-------+-------|\n|.......|.......|\n|.......|.......|\n|.......|.......|\n|.......|.......|\n|.......|.......|\n|.......|.......|\n|.......|.......|\n-----------------",
            ],
            [
                "10",
                "-----------------------\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|----------+----------|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n|..........|..........|\n-----------------------",
            ],
        ],
        solution:
            "n=int(input())\nP=lambda s,m,f,r=1:exec('print(s+f*n+m+f*n+s);'*r)\nP(*\"---\")\nP(*\"||.\",n)\nP(*\"|+-\")\nP(*\"||.\",n)\nP(*\"---\")\n# n=gets.to_i\n# t=2*n+3\n# a=[('|'+'.'*n)*2+'|']*t\n# a[0]=a[-1]=\"-\"*t\n# a[n+1]='|'+'-'*n+'+'+'-'*n+'|'\n# puts a",
    },
    {
        title: "Banner Puzzle",
        author: "JoshL",
        testCases: [
            ["Hello world!", "****************\n* Hello world! *\n****************"],
            ["Can you do it?", "******************\n* Can you do it? *\n******************"],
            ["CodinGame is cool!", "**********************\n* CodinGame is cool! *\n**********************"],
            ["1234567890", "**************\n* 1234567890 *\n**************"],
        ],
        solution:
            'a=input()\nf="*"*(len(a)+4)\nprint(f,"* "+a+" *",f,sep="\\n")\n# a=gets.chomp\n# f=\'*\'.*a.size+4\n# puts [f,\'* \'+a+\' *\',f]',
    },
    {
        title: "Maths Reverse Puzzle",
        author: "JoshL",
        testCases: [
            ["64", "4032"],
            ["128", "16256"],
            ["1", "0"],
            ["4096", "16773120"],
        ],
        solution: "a=int(input())\nprint(a*a-a)",
    },
    {
        title: "Reverse Factorial + Division",
        author: "JoshL",
        testCases: [
            ["6", "360"],
            ["7", "2520"],
            ["8", "20160"],
            ["16", "10461394944000"],
        ],
        solution: "import math\nprint(math.factorial(int(input()))//2)",
    },
    {
        title: "Username Validity",
        author: "JoshL",
        testCases: [
            ["Username123", "VALID"],
            ["123", "VALID"],
            ["A1", "INVALID"],
            ["abcdefghijklmnopqrstuvwxyz", "INVALID"],
            ["abc", "VALID"],
            ["1", "INVALID"],
            ["_Josh_", "INVALID"],
            ["HelloWorld", "VALID"],
        ],
        solution:
            "import re\nu=input()\nprint((\"INVALID\",\"VALID\")[2<len(u)<21 and not re.search(r\"[^a-zA-Z0-9]\",u)])\n# u=gets\n# $><<(2<u.size&&u.size<21&&! ~/[^a-zA-Z0-9]/?'':'IN')+'VALID'",
    },
    {
        title: "Shuffle the characters",
        author: "Blubbor",
        testCases: [
            ["4\nabcd\n4 3 2 1", "dcba"],
            ["6\nabcdef\n1 6 2 5 3 4", "afbecd"],
            ["8\nabcd1234\n5 1 6 2 7 3 8 4", "1a2b3c4d"],
            ["1\na\n1", "a"],
            ["9\ndeellnow_\n8 3 5 4 9 1 7 6 2", "well_done"],
        ],
        solution:
            "I=input\nI()\ns=I()\nfor c in I().split():print(end=s[int(c)-1])\n# _,s,*n=`dd`.split\n# n.map{$><<s[_1.to_i-1]}",
    },
    {
        title: "Gift wrap recycling",
        author: "Marqin",
        testCases: [
            ["30x30\n4\n4\n12x5x6\n8x2x14\n11x9x9\n11x22x11", "2"],
            [
                "34x40\n44\n747\n52x32x32\n72x60x78\n53x76x38\n83x39x23\n8x13x80\n54x43x12\n65x71x99\n24x41x87\n88x72x36\n37x35x34\n11x35x61\n32x39x38\n99x70x37\n99x46x7\n56x45x44\n34x70x45\n30x50x34\n79x94x71\n71x54x42\n13x88x83\n17x65x32\n72x34x22\n39x13x35\n48x18x78\n8x15x83\n37x2x43\n15x79x67\n76x31x40\n77x2x92\n26x1x69\n32x88x97\n62x41x31\n30x86x47\n6x47x58\n23x33x62\n79x4x46\n33x35x21\n42x43x81\n92x15x44\n3x75x63\n56x53x65\n57x29x95\n80x63x76\n54x36x65\n38x46x89\n72x49x83\n21x24x81\n88x18x8\n83x26x45\n53x28x62\n34x85x42\n53x48x77\n58x54x69\n62x75x60\n77x19x59\n38x78x68\n68x2x56\n67x76x10\n1x28x14\n96x45x41\n76x30x24\n67x9x29\n45x19x18\n30x64x13\n5x87x33\n45x56x32\n90x38x73\n12x12x7\n21x73x45\n24x21x82\n39x66x3\n52x67x87\n26x47x75\n73x81x65\n92x71x12\n84x56x49\n93x32x51\n97x20x68\n65x42x30\n34x46x4\n49x47x99\n53x65x5\n94x88x71\n15x42x80\n33x17x4\n58x26x36\n17x23x82\n11x27x48\n19x18x90\n40x37x67\n44x98x60\n39x11x79\n86x67x53\n22x55x2\n91x9x66\n94x10x17\n45x31x57\n44x22x81\n88x64x70\n26x82x81\n39x43x41\n77x75x59\n12x73x87\n46x60x50\n7x37x38\n46x28x30\n83x64x22\n73x55x91\n82x53x32\n6x57x79\n66x81x93\n73x44x64\n27x86x95\n38x54x67\n18x47x68\n34x10x71\n59x36x97\n70x99x26\n55x53x13\n29x99x42\n96x19x94\n92x93x9\n40x37x22\n5x70x55\n18x12x94\n54x33x75\n61x84x52\n75x80x3\n98x85x11\n90x92x10\n16x60x93\n31x74x11\n16x85x11\n62x69x20\n93x10x5\n9x91x55\n92x79x59\n37x50x91\n33x33x11\n18x68x32\n19x72x67\n68x23x27\n34x2x24\n7x22x39\n11x32x53\n49x22x97\n26x77x12\n81x56x58\n36x22x50\n6x39x90\n93x32x31\n47x96x56\n95x65x62\n38x29x6\n25x38x15\n26x89x35\n12x76x70\n41x20x12\n69x44x48\n68x47x71\n78x39x12\n12x54x47\n14x45x32\n5x46x63\n54x24x8\n22x52x71\n75x65x2\n87x99x12\n21x5x36\n28x35x55\n50x5x73\n95x38x16\n66x28x12\n40x17x38\n52x27x3\n52x17x87\n27x20x37\n23x53x13\n25x27x28\n6x1x48\n68x60x30\n72x81x71\n41x91x24\n72x39x3\n92x2x91\n73x74x62\n23x32x96\n52x3x89\n10x80x91\n40x12x91\n74x96x54\n1x83x51\n5x73x2\n20x58x4\n49x86x93\n32x15x50\n97x34x71\n28x86x74\n80x75x9\n64x50x43\n52x44x42\n15x9x44\n79x30x3\n65x85x54\n61x73x79\n73x92x1\n48x42x23\n33x96x37\n47x32x17\n12x63x83\n43x45x49\n60x82x55\n24x43x96\n95x45x18\n1x2x21\n51x6x37\n16x56x47\n59x30x24\n32x56x26\n65x21x47\n59x72x45\n89x38x15\n43x97x82\n43x87x59\n99x91x24\n25x85x88\n81x69x47\n7x17x36\n84x7x81\n27x2x95\n35x52x74\n32x56x90\n89x33x4\n71x68x67\n49x42x49\n32x90x59\n42x78x43\n33x90x68\n91x54x37\n13x23x48\n24x38x74\n77x3x69\n18x26x32\n43x66x57\n38x61x15\n6x33x83\n46x25x49\n81x5x63\n51x80x68\n73x70x57\n42x54x14\n7x30x19\n76x18x52\n9x17x47\n30x20x23\n71x69x28\n50x16x77\n53x7x62\n83x12x17\n7x60x78\n55x17x9\n27x74x93\n10x68x37\n16x43x32\n73x72x86\n88x22x95\n24x63x15\n94x72x88\n60x75x29\n13x60x7\n53x8x99\n19x35x47\n91x66x89\n29x56x4\n33x54x49\n63x78x33\n53x38x69\n36x1x62\n74x99x84\n13x30x96\n1x43x57\n20x47x57\n42x59x23\n94x79x23\n16x60x43\n54x82x76\n2x82x95\n53x7x22\n26x38x59\n54x31x30\n21x49x2\n71x95x63\n66x47x68\n70x65x91\n13x62x9\n42x46x46\n98x75x15\n9x68x8\n47x39x87\n97x81x41\n23x90x90\n96x85x29\n54x88x93\n30x25x56\n52x6x15\n85x95x54\n96x49x90\n87x10x71\n40x86x25\n55x52x50\n22x19x96\n13x4x61\n87x95x80\n60x87x14\n38x63x99\n35x7x48\n56x98x57\n75x92x14\n56x65x95\n74x68x95\n89x64x26\n98x61x96\n32x63x9\n21x95x40\n54x34x86\n54x3x17\n77x66x25\n97x86x58\n7x45x62\n66x38x90\n40x50x34\n92x45x3\n19x79x38\n26x23x97\n95x4x31\n37x89x81\n57x56x90\n11x57x2\n86x21x48\n53x18x58\n27x69x56\n89x12x5\n18x43x54\n92x92x56\n8x80x8\n40x37x21\n83x58x40\n15x84x49\n66x27x41\n70x24x19\n94x70x48\n56x54x78\n94x68x69\n85x84x56\n88x31x29\n37x45x56\n86x86x93\n31x68x99\n55x42x57\n34x89x4\n5x61x96\n30x95x44\n71x63x99\n27x51x53\n53x64x61\n32x65x1\n30x23x80\n54x31x41\n65x34x41\n52x83x33\n7x10x74\n71x65x37\n81x85x12\n19x43x85\n72x84x45\n53x13x28\n54x55x44\n98x54x70\n32x26x23\n33x86x57\n94x71x40\n64x45x86\n55x79x46\n54x19x13\n2x98x19\n23x10x87\n58x90x17\n22x86x42\n45x96x94\n5x87x88\n10x84x44\n22x44x23\n22x3x46\n4x87x85\n71x80x45\n16x47x59\n63x83x61\n11x56x75\n18x43x98\n64x32x41\n11x93x27\n76x85x35\n97x39x16\n1x70x30\n7x25x83\n85x80x44\n18x14x42\n51x10x60\n78x74x92\n54x7x91\n37x83x12\n30x47x80\n24x1x85\n78x12x43\n16x55x35\n17x17x81\n71x3x56\n46x85x43\n87x54x25\n77x34x51\n21x43x25\n49x73x17\n84x11x78\n47x60x3\n95x39x70\n76x72x21\n15x31x12\n60x13x73\n37x10x1\n83x44x94\n32x6x38\n83x33x55\n31x29x42\n61x82x20\n40x56x97\n78x24x14\n72x83x29\n73x99x66\n56x81x29\n89x51x27\n12x21x66\n30x80x93\n21x61x30\n43x7x2\n90x22x1\n91x40x51\n52x68x54\n74x53x36\n92x14x16\n5x60x4\n24x67x20\n57x11x79\n89x66x64\n57x92x69\n69x28x25\n49x17x86\n94x91x76\n17x61x36\n12x67x63\n13x55x52\n58x25x72\n90x26x84\n31x46x95\n54x3x15\n69x53x7\n30x18x43\n43x91x13\n21x41x64\n26x57x5\n93x86x89\n67x96x55\n29x59x51\n27x41x3\n53x55x25\n90x20x26\n18x91x6\n75x8x9\n7x39x61\n6x42x97\n71x19x59\n77x41x32\n32x54x20\n26x52x42\n32x97x75\n78x12x35\n65x73x39\n8x15x83\n23x46x52\n24x91x84\n18x72x92\n87x36x15\n28x98x83\n96x32x2\n69x49x53\n28x34x92\n39x81x43\n6x3x77\n94x65x10\n16x81x52\n87x31x25\n60x51x47\n83x89x48\n40x48x77\n19x56x58\n7x32x16\n69x73x28\n16x92x27\n56x87x72\n6x13x90\n47x85x32\n11x39x52\n49x55x20\n6x57x7\n59x8x48\n1x87x34\n58x34x96\n62x77x49\n16x28x70\n2x62x51\n95x30x38\n89x47x19\n36x64x18\n58x54x25\n32x9x48\n30x84x55\n96x99x2\n4x88x34\n3x43x24\n92x95x85\n53x58x30\n43x4x61\n7x86x69\n63x42x26\n97x79x96\n57x34x69\n41x98x72\n88x9x65\n3x7x1\n25x10x72\n28x17x60\n39x67x79\n72x46x19\n12x3x57\n35x55x11\n31x42x68\n32x64x66\n22x41x90\n15x56x9\n43x75x12\n64x61x23\n71x69x2\n2x70x49\n61x8x74\n85x88x24\n46x90x21\n76x8x87\n5x60x25\n40x51x18\n78x81x38\n52x50x95\n58x2x2\n47x84x92\n58x71x59\n92x64x52\n8x55x84\n36x5x45\n50x66x9\n71x14x51\n54x8x56\n28x74x64\n5x16x22\n15x11x6\n22x2x27\n72x50x47\n5x32x64\n61x21x90\n53x95x55\n64x43x94\n99x98x40\n6x8x26\n32x48x79\n70x57x78\n59x15x98\n79x39x71\n65x18x16\n42x65x16\n61x90x43\n21x27x67\n97x33x56\n72x40x48\n92x67x78\n75x96x40\n74x84x55\n8x32x60\n86x75x33\n7x94x37\n55x4x46\n65x24x65\n70x37x43\n29x69x90\n96x13x49\n51x79x69\n85x91x60\n4x94x73\n83x63x60\n31x38x19\n84x99x87\n35x51x90\n32x13x51\n94x85x81\n83x25x38\n76x65x98\n95x78x64\n9x96x6\n43x92x99\n47x55x20\n63x63x94\n93x8x2\n1x45x62\n56x22x90\n23x50x95\n5x61x66\n92x30x1\n25x47x80\n9x40x63\n2x86x97\n70x31x74\n89x48x20\n44x9x98\n64x97x49\n95x5x59\n7x30x82\n6x6x94\n99x44x10\n93x28x83\n22x80x26\n39x24x20\n78x17x36\n10x91x3\n99x60x5\n18x40x61\n26x38x91\n35x85x54\n47x66x99\n88x97x61\n23x24x22\n90x16x98\n4x25x25\n32x28x72\n3x48x81\n4x2x22\n19x44x34\n33x17x81\n74x63x58\n53x61x15\n93x33x11\n30x50x75\n34x38x76\n97x6x13\n95x95x72\n61x97x7\n73x12x29\n36x78x86\n68x65x49\n72x14x68\n95x70x56\n94x36x13\n72x30x42\n50x94x93\n74x49x57\n86x15x8\n32x40x91\n97x11x73\n11x17x79\n35x13x95\n49x64x24\n86x51x47\n1x11x48\n3x94x9\n84x68x50\n71x53x36\n14x29x33\n1x11x81\n28x19x27\n93x46x4\n18x67x83\n64x29x4\n67x94x73\n74x96x25\n44x96x79\n84x75x2\n88x36x93\n25x3x75\n50x18x67\n23x26x95\n14x44x85\n19x31x85\n8x66x80\n42x31x21\n19x1x69\n24x27x58\n41x52x26\n72x46x35\n70x1x5\n92x27x25\n52x95x18\n58x83x18\n94x46x66\n86x75x98\n32x56x54\n25x55x24\n35x92x83\n3x76x68\n85x27x38\n29x86x49\n10x77x52\n58x28x33\n86x13x59\n37x86x24\n39x61x81\n10x55x29\n27x85x76\n23x40x2\n9x19x34\n38x14x48\n26x86x70\n57x61x41\n56x34x72\n4x43x51\n71x29x96\n3x99x34\n85x1x21\n6x77x82\n88x94x16\n25x35x56\n54x63x85\n47x38x74\n58x35x59\n92x51x87\n52x27x94\n78x48x75\n2x94x36\n60x29x79\n88x27x24\n32x32x90\n28x76x87\n93x16x35",
                "732",
            ],
            [
                "43x45\n44\n258\n89x88x25\n9x18x49\n72x21x3\n36x9x51\n58x55x45\n35x46x91\n4x92x46\n94x2x12\n41x53x81\n63x20x2\n64x72x16\n52x28x73\n27x87x65\n25x86x50\n86x33x49\n77x74x37\n22x60x31\n60x64x1\n78x34x35\n7x83x29\n16x26x37\n13x65x1\n68x28x25\n17x43x81\n64x78x40\n68x36x18\n23x22x36\n7x68x61\n84x99x62\n83x61x86\n81x63x42\n19x93x88\n29x88x83\n6x84x43\n38x7x11\n68x73x92\n21x22x63\n39x42x26\n82x3x3\n5x55x53\n94x68x54\n90x68x96\n32x89x31\n46x53x72\n58x52x84\n18x16x45\n94x19x28\n44x38x1\n74x26x82\n51x52x32\n50x81x18\n7x67x58\n9x18x88\n60x17x6\n25x66x56\n45x21x94\n78x7x73\n24x48x63\n54x95x35\n75x63x29\n18x29x73\n27x69x37\n81x56x8\n84x65x15\n31x31x60\n53x77x50\n41x20x77\n62x87x32\n92x10x64\n37x54x37\n23x46x10\n86x68x14\n22x45x52\n74x3x7\n20x11x27\n51x21x18\n90x28x69\n84x94x66\n61x10x73\n88x91x46\n64x73x14\n85x47x59\n69x78x7\n43x93x44\n6x74x48\n91x64x72\n69x91x25\n12x62x44\n96x41x7\n57x20x34\n31x4x53\n37x40x82\n22x29x24\n79x52x61\n88x14x56\n80x5x35\n5x11x34\n12x41x82\n96x62x27\n31x78x89\n74x19x99\n94x94x22\n93x89x4\n83x58x1\n81x43x40\n37x68x13\n68x34x47\n27x72x57\n49x43x70\n34x57x24\n46x77x68\n34x22x25\n94x98x48\n11x4x99\n6x55x12\n80x35x36\n45x71x88\n9x18x54\n23x90x31\n81x59x9\n34x67x3\n70x58x52\n61x66x59\n83x1x52\n36x44x74\n69x82x70\n85x73x14\n34x2x73\n61x55x23\n83x81x63\n86x34x13\n74x39x82\n44x89x45\n60x98x39\n35x94x68\n6x89x99\n81x82x41\n92x50x11\n95x76x93\n2x57x3\n57x35x11\n92x28x16\n15x84x30\n95x55x19\n31x24x3\n73x27x20\n85x79x51\n93x49x76\n71x52x67\n18x71x62\n76x71x78\n53x85x54\n67x58x41\n95x78x75\n6x48x61\n60x32x86\n5x81x11\n50x25x83\n83x78x14\n97x1x70\n39x89x22\n53x87x21\n14x57x48\n14x86x35\n94x43x93\n18x88x42\n77x77x23\n53x85x49\n46x49x23\n8x56x67\n55x95x72\n95x12x72\n35x25x36\n8x54x9\n68x9x29\n10x92x66\n64x35x65\n49x66x94\n84x28x81\n88x23x43\n43x90x12\n60x21x58\n53x62x8\n30x19x67\n63x75x3\n28x63x58\n68x94x97\n10x21x61\n3x54x7\n42x19x80\n35x72x32\n23x95x6\n76x59x67\n81x12x64\n62x23x61\n5x7x84\n81x5x87\n84x56x88\n55x96x45\n13x40x91\n54x25x71\n26x92x57\n21x13x2\n51x67x42\n11x94x40\n33x32x55\n79x93x52\n59x23x30\n17x21x25\n85x84x41\n10x91x1\n71x32x37\n80x23x16\n45x19x47\n88x40x18\n71x10x95\n92x35x4\n81x37x31\n77x56x22\n18x53x48\n62x42x63\n78x33x49\n7x48x38\n49x10x54\n31x53x79\n32x88x43\n44x27x55\n45x16x79\n58x62x14\n34x45x35\n42x69x67\n37x56x95\n39x35x87\n62x33x15\n14x86x85\n97x63x60\n57x60x75\n6x10x25\n13x14x44\n88x9x14\n22x92x49\n73x48x49\n34x50x2\n82x41x75\n62x53x94\n68x92x99\n84x73x57\n9x43x28\n18x73x94\n75x88x4\n57x44x89\n84x99x14\n84x32x51\n63x96x78\n40x52x52\n49x40x8\n89x95x10\n79x29x37",
                "181",
            ],
            ["31x34\n28\n1\n2x8x12", "0"],
        ],
        solution: "NO",
    },
    {
        title: "Ostrich weight",
        author: "Rafalon",
        testCases: [
            ["F\n100", "120"],
            ["M\n120", "100"],
            ["a\n50", "UNKNOWN"],
            ["F\n101", "121"],
        ],
        solution: 'I=input\ng=I()\nw=int(I())\nI(int((w*1.2,w/1.2,0)["FM".find(g)])or"UNKNOWN")',
    },
    {
        title: "Meaning of Life",
        author: "Earthborne",
        testCases: [
            ["Math", "42"],
            ["matH", "42"],
            ["thma", "42"],
            ["life", "32"],
        ],
        solution: "print(sum([ord(x)%32 for x in input()]))\n# p gets.bytes.sum{_1%32}",
    },
    {
        title: "Hexagon pyramid",
        author: "ndc",
        testCases: [
            ["1", " _ \n/ \\\n\\_/"],
            ["2", " _   _ \n/ \\_/ \\\n\\_/ \\_/\n  \\_/"],
            ["3", " _   _   _ \n/ \\_/ \\_/ \\\n\\_/ \\_/ \\_/\n  \\_/ \\_/\n    \\_/"],
            [
                "4",
                " _   _   _   _ \n/ \\_/ \\_/ \\_/ \\\n\\_/ \\_/ \\_/ \\_/\n  \\_/ \\_/ \\_/\n    \\_/ \\_/\n      \\_/",
            ],
        ],
        solution:
            'n=int(input())\na=" "\nprint(a.join([" _ "]*n),"_".join(["/ \\\\"]*n),a.join(["\\\\_/"]*n),*[a*2*x+a.join(["\\\\_/"]*(n-x))for x in range(1,n)],sep="\\n")\n# n=gets.to_i\n# a=\' \'\n# puts [\' _ \']*n*a,[\'/ \\\\\']*n*\'_\',[\'\\\\_/\']*n*a,(1..n-1).map{a*2*_1+[\'\\\\_/\']*(n-_1)*a}',
    },
    {
        title: "or bitwise operator",
        author: "anath",
        testCases: [
            ["0001010\n0101010", "0101010\n"],
            ["1\n1", "1"],
            ["1000001010101010\n0010100000000000", "1010101010101010"],
            ["00100001\n00000011", "00100011\n"],
            ["000\n000", "000"],
        ],
        solution: 'for x,y in zip(input(),input()):print(end="10"[y<"1">x])',
    },
    {
        title: "Divisibility by primes",
        author: "Lupilum",
        testCases: [
            ["2\n10\n3 7\n998 575 987 459 54 21 63 758 132 395", "FFTFFTTFFF"],
            [
                "3\n100\n2 5 11\n932 77 369 157 320 158 875 22 443 620 590 698 464 853 406 917 255 770 557 642 423 573 644 389 746 470 71 113 450 767 564 603 660 956 31 247 295 667 179 633 236 335 998 61 831 520 896 790 456 271 65 22 618 810 81 399 936 880 834 799 434 794 34 667 81 164 766 749 487 502 133 680 841 502 361 1000 130 611 957 190 646 669 864 966 101 82 868 167 673 360 32 873 185 718 181 896 380 48 57 973",
                "FFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            ],
            [
                "4\n1000\n2 3 7 11\n420 957 452 898 250 465 396 213 266 15 192 121 845 675 208 454 871 74 881 286 349 246 516 965 644 485 655 722 319 951 946 947 260 701 1000 189 96 879 391 541 643 419 776 704 703 333 424 850 696 117 506 391 5 740 9 205 146 93 435 373 401 840 227 983 197 817 73 291 782 90 260 296 193 55 224 145 525 457 123 676 539 668 257 147 779 775 159 898 277 328 320 988 650 336 736 636 549 330 988 396 197 859 890 772 276 127 690 569 783 407 393 31 82 621 895 14 837 756 729 462 644 467 710 835 623 582 848 340 426 800 397 933 835 235 334 567 644 990 477 104 336 221 280 803 626 598 19 266 892 332 898 418 825 174 383 905 624 275 456 693 630 552 863 925 438 655 916 130 820 916 241 158 133 8 576 819 950 538 141 51 119 48 403 517 87 398 621 918 85 534 742 565 681 168 997 17 178 300 33 585 492 261 728 194 836 869 834 87 887 699 758 204 942 821 815 531 581 699 966 598 536 27 255 600 874 956 559 127 451 97 371 369 598 131 212 177 427 803 11 932 33 40 80 777 940 860 243 279 303 727 427 793 126 965 508 707 295 401 126 629 141 788 555 664 67 363 476 569 575 456 626 113 658 241 398 774 54 348 958 38 797 483 583 108 51 364 774 654 975 452 942 773 408 560 310 549 542 270 586 319 193 415 737 294 133 192 689 386 56 556 216 225 295 712 671 613 941 747 785 354 685 815 136 333 727 605 476 793 286 421 842 303 744 730 100 363 76 431 584 734 833 7 307 495 631 991 145 242 409 808 504 485 214 500 391 315 126 863 975 469 301 934 779 940 973 832 889 93 820 487 534 82 100 598 780 531 113 173 959 512 7 130 57 679 847 921 141 600 719 113 813 801 813 401 996 241 797 37 69 634 999 832 10 285 315 553 475 910 435 143 495 29 989 73 537 597 781 863 417 52 165 363 908 658 135 595 272 940 83 581 851 179 984 971 953 939 508 19 804 619 882 504 214 441 515 302 5 41 534 77 23 916 569 539 23 769 808 154 167 45 664 282 938 580 120 625 875 338 607 638 39 134 38 31 857 541 475 705 401 417 579 109 416 903 20 808 611 475 530 273 456 166 325 655 810 237 454 915 870 340 244 34 92 347 967 839 794 697 132 340 154 747 324 536 338 202 480 912 892 709 838 17 567 474 217 341 117 629 481 447 649 500 277 860 52 814 46 727 550 97 411 691 122 185 123 231 646 673 679 50 709 137 761 931 19 17 555 702 699 946 327 312 210 679 69 843 430 420 264 108 2 618 458 840 76 713 674 198 203 217 556 831 145 263 913 136 595 788 286 182 940 706 537 93 901 408 442 501 647 718 788 922 422 80 378 428 345 872 204 899 400 787 295 852 235 376 926 603 609 769 407 61 513 333 415 266 813 994 955 892 70 386 715 718 905 424 532 713 950 779 496 452 926 267 49 82 499 967 280 206 153 653 901 796 819 503 695 400 729 730 968 517 628 488 634 686 730 354 732 702 188 821 512 878 805 819 586 78 497 830 971 681 292 165 669 34 546 369 12 588 737 820 988 979 936 490 539 664 803 183 295 928 3 72 996 921 925 722 83 364 969 527 863 446 660 924 659 196 457 817 544 974 442 776 60 80 536 450 397 7 247 647 955 94 585 171 661 848 437 254 236 588 901 125 951 286 754 395 141 763 271 598 598 898 778 228 221 788 244 98 427 317 180 690 635 868 474 420 823 941 533 173 770 767 186 502 259 58 118 481 920 481 26 15 664 621 716 189 189 164 877 304 404 52 429 584 889 416 917 303 161 536 762 17 850 36 376 860 87 559 791 434 608 494 875 600 506 646 956 930 787 81 919 531 981 689 774 125 953 724 519 798 72 856 971 792 417 854 805 533 785 623 850 848 249 172 864 416 272 314 657 857 851 444 716 643 874 80 184 686 190 32 961 940 135 973 226 228 65 194 889 132 979 136 459 222 659 947 438 699 424 737 217 732 381 462 850 632 491 439 414 47 496 804 179 693 331 428 448 831 359 673 983 541 432 355 888 971 553 675 640 907 36 968 741 405 870 183 29 609 556 338 387 809 266 462 291 621 758 916 929 658 665 820 287 212 655 445 302 437 519 642 927 159 590 560 133 108 93 102 102 337 586 192 999 39 76 862 71 736 995 97 430 287 306 273 90 638 411 796 280 105 288 330 427 485 963 588 107 159 829 681 517 605 195 392 849 484 643 416 247 252 605 846 768 210 374 545 69 65",
                "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            ],
            [
                "3\n1000\n3 5 7\n740 820 879 732 361 440 612 246 154 736 664 661 692 454 619 567 742 245 306 881 721 982 236 443 746 182 730 803 3 273 865 454 881 364 70 969 479 766 88 69 893 321 872 824 275 227 33 537 932 573 508 211 741 216 180 138 732 232 566 814 895 598 990 529 838 772 304 813 203 884 755 10 270 377 154 909 40 89 100 212 213 599 907 926 855 695 429 818 617 297 242 495 701 634 303 574 210 997 804 984 343 381 873 174 837 720 916 29 633 648 281 479 832 289 47 548 637 265 49 112 2 772 785 393 443 781 752 759 976 342 803 745 614 234 887 616 324 299 188 534 705 521 220 300 157 750 325 364 317 98 761 25 633 240 372 861 373 770 245 330 781 325 752 644 502 29 501 113 504 468 308 60 129 621 616 809 19 407 731 484 91 280 720 519 816 116 76 665 866 859 914 844 267 650 962 100 297 377 272 758 992 31 708 657 862 740 811 220 805 949 302 470 301 851 493 499 119 756 706 798 637 887 344 36 537 360 434 84 917 647 331 242 70 710 110 612 856 47 529 274 645 663 391 615 796 902 764 859 503 431 1000 934 981 291 336 840 13 170 634 262 978 940 403 915 518 67 735 899 48 765 645 298 663 58 149 395 23 340 106 561 455 148 840 613 186 439 749 736 500 536 262 789 920 501 523 858 540 79 474 900 54 329 589 877 268 988 331 808 324 404 706 67 244 502 603 665 535 285 36 191 227 778 695 846 315 896 434 403 878 883 112 660 624 923 840 555 294 51 20 359 422 577 233 89 134 642 897 528 886 975 67 677 822 617 968 193 773 474 714 619 719 633 596 462 173 585 829 20 496 932 707 784 187 816 433 54 423 623 53 489 895 748 33 102 43 935 870 250 631 368 795 747 788 616 556 681 761 365 418 371 873 892 314 342 344 491 143 919 403 371 701 20 358 803 475 439 707 825 605 203 900 562 566 554 250 679 101 221 741 848 815 177 827 961 975 747 365 86 700 100 207 57 178 931 180 353 62 3 649 27 102 272 749 107 23 723 444 137 739 962 812 114 790 529 310 57 93 692 244 265 634 274 841 993 721 960 107 971 779 308 524 326 582 720 867 524 738 347 402 721 795 636 932 258 873 105 275 585 831 203 421 673 889 765 885 390 593 940 18 975 766 258 947 559 864 406 581 812 435 2 444 787 80 830 318 225 434 833 45 734 97 914 293 781 965 212 670 850 502 749 918 748 494 660 151 488 482 810 73 291 811 864 913 1000 158 258 314 943 820 659 959 161 501 862 731 234 796 673 247 166 77 465 936 10 762 605 529 571 632 956 876 166 744 525 303 838 991 738 473 302 846 900 10 601 328 830 315 822 142 662 865 86 206 108 410 325 611 943 312 565 565 648 881 28 886 203 534 72 575 237 770 724 596 754 336 919 664 712 925 224 813 192 193 851 785 221 630 644 266 949 807 732 132 457 994 978 485 328 157 338 107 30 626 925 441 741 405 153 340 551 308 459 907 750 896 501 941 177 80 370 336 879 199 449 500 382 368 28 370 562 890 181 52 657 472 652 127 206 41 293 861 607 95 412 613 36 423 934 47 125 333 457 681 262 324 133 212 659 174 794 652 739 991 601 356 489 674 857 144 695 464 850 753 225 316 188 525 540 513 912 243 959 350 707 772 347 273 185 375 242 99 407 442 530 173 262 678 905 398 154 216 300 24 61 341 99 46 95 173 32 379 89 418 756 505 787 219 608 370 192 790 122 656 417 949 167 606 673 394 166 871 670 914 998 271 546 833 549 291 63 849 787 782 6 313 351 591 894 404 51 945 990 472 325 773 214 794 391 465 179 834 224 89 53 249 609 549 423 900 588 791 984 726 600 557 498 500 516 930 577 181 611 41 737 132 658 486 778 593 489 86 356 405 654 486 737 259 321 688 587 326 450 561 525 315 207 770 107 555 11 618 319 231 226 712 288 881 424 644 661 847 752 831 529 753 557 996 963 560 863 752 421 451 230 334 934 953 697 914 593 416 833 732 467 273 458 448 659 757 203 733 526 226 545 625 239 206 406 239 838 914 881 252 634 860 836 274 71 58 582 637 106 258 682 856 841 171 575 516 438 190 255 957 881 652 661 598 207 943 417 341 463 920 919 196 864 467 255 501 59 829 702 625 857 39 758 573 690 50 843 631 149 353 565 189 642 129 685 45 213 339 770 120 432 609 47 850 792 278 127 264 983 681 768 492 803 52 379 631 846 928 164 86 816 489 909 688 155 319 322",
                "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFTFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            ],
        ],
        solution: 'I=input\nI()\nI()\np=eval(I().replace(" ","*"))\nfor a in I().split():print(end="TF"[int(a)%p>0])',
    },
    {
        title: "Mini Brainf**k Interpreter",
        author: "JoshL",
        testCases: [
            [
                "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.+++++++++++++++++++++++++++++.+++++++..+++.",
                "Hello",
            ],
            [
                "++++++++++++++++++++++++++++++++++++++++++++++++This is notation! ++++++++++++++++++++  ++++.++++++++++  ++++++++++++++++++ +++++. ",
                "Hi",
            ],
            [
                "+/+/+/++++++++++++++++++++++++++++++++\\++++++ds++++q++++++++d+++++++++++++++++++.++++/+++++++++++++++++++++++++.++++++++++/++++/+++/+++.",
                "Hey",
            ],
            [
                "+++++++++++++|++o+++++++++++++++++++++++++++++++++|+++++||++++++++++++++++++++++++++++++}++++|\\++.----------.",
                "YO",
            ],
        ],
        solution: 'v=0\nfor i in input():\n if i==".":print(end=chr(v))\n elif i in"+-":exec(f\'v{i}=1\')',
    },
    {
        title: "Letter Buckets",
        author: "Smyrna",
        testCases: [
            ["Banana", "B\naaa\nnn"],
            ["Hungry?", "?\nH\ng\nn\nr\nu\ny"],
            ["Hello world!", " \n!\nH\nd\ne\nlll\noo\nr\nw"],
            ["Open the gates, please let me in!", "      \n!\n,\nO\naa\neeeeeee\ng\nh\ni\nll\nm\nnn\npp\nss\nttt"],
            [
                "And I was thinking to myself, 'This could be heaven or this could be hell'",
                "              \n''\n,\nA\nI\nT\naa\nbb\ncc\nddd\neeeeee\nf\ng\nhhhhh\niiii\nk\nlllll\nm\nnnnn\noooo\nr\nssss\nttt\nuu\nv\nw\ny",
            ],
        ],
        solution:
            "s=input()\nfor c in sorted({*s}):print(c*s.count(c))\n# a=gets\n# a.chars.uniq.sort.map{puts _1*a.count(_1)}",
    },
    {
        title: "Binary Buddies",
        author: "pbsinclair42",
        testCases: [
            ["3", "5"],
            ["13", "14"],
            ["1", "2"],
            ["63", "95"],
            ["128", "256"],
        ],
        solution:
            "n=\"0\"+f'{int(input()):b}'\nprint(int(n[::-1].replace(\"10\",\"01\",1)[::-1],2))\n# n='0'+gets.to_i.to_s(2)\n# p n.sub(/.*\\K01/,'10').to_i(2)",
    },
    {
        title: "Headings",
        author: "Uquu",
        testCases: [
            ["N\n90", "E"],
            ["S\n-90", "E"],
            ["N\n-180", "S"],
            ["NW\n675", "W"],
            ["N\n-360", "N"],
        ],
        solution: "a='N NE E SE S SW W NW'.split()\nprint(a[(a.index(input())+int(input())//45)%8])",
    },
    {
        title: "Intersecting circles",
        author: "an Anonymous CodinGamer",
        testCases: [
            ["3", "6"],
            ["15", "210"],
            ["1000001", "1000001000000"],
            ["55", "2970"],
        ],
        solution: "x=int(input())\nprint(x*~-x)",
    },
    {
        title: "What is N?",
        author: "JoshL",
        testCases: [
            ["N+1=2", "1"],
            ["N-1=2", "3"],
            ["2N+1=3", "1"],
            ["5N+6=31", "5"],
            ["3N+3=8", "2"],
            ["21N-2=135", "7"],
        ],
        solution:
            'import re\nimport math\n*e,=map(int,re.findall(r"-?\\d+",input()))\nif len(e)==3:\n    print(math.ceil((e[2]-e[1])/e[0]))\nelse:\n    print(e[1]-e[0])\n# e=gets.chomp.scan(/-?\\d+/).map(&:to_i)\n# if e.size>2 then\n#     p ((e[2]-e[1])/e[0].to_f).ceil\n# else\n#     p e[1]-e[0]\n# end',
    },
    {
        title: "Remaining Time",
        author: "JoshL",
        testCases: [
            ["0:00 0:01", "0:01"],
            ["0:55 1:00", "0:05"],
            ["1:45 3:15", "1:30"],
            ["0:00 0:00", "0:00"],
        ],
        solution:
            'Remaining Time\nT=lambda x:int(x[0])*60+int(x[1])\nc,s=[T(x.split(":"))for x in input().split()]\ns-=c\nprint(f\'{s//60}:{s%60:02}\')\n# c,s=gets.split.map{a,b=_1.split(":");a.to_i*60+b.to_i}\n# s-=c\n# $><<"#{s/60}:%02d"%(s%60)',
    },
    {
        title: "Sum the powers!!!!",
        author: "an Anonymous CodinGamer",
        testCases: [
            ["2\n5", "31"],
            ["3\n4", "40"],
            ["10\n10", "1111111111"],
            ["17\n4", "5220"],
        ],
        solution: "n=int(input())\nprint(n**~-int(input())//~-n)",
    },
    {
        title: "Changing Digits",
        author: "Myldero",
        testCases: [
            ["123", "2"],
            ["2314", "3"],
            ["1111", "0"],
            ["33278110", "5"],
            ["112233445566778899", "8"],
            ["1111156546792222666666666878756217777777515555555597887811111155552669988888888877778785555521", "39"],
            ["0100100001100101011011000110110001101111001000000101011101101111011100100110110001100100", "46"],
        ],
        solution:
            "n=input()\nprint(sum(a!=b for a,b in zip(n,n[1:])))\n# n=gets\n# p (0..n.size-2).sum{n[_1]!=n[_1+1]?1:0}",
    },
    {
        title: "Similar Words",
        author: "IntrusivePenDesperateSword",
        testCases: [
            ["3\nBannaa\nFive\nBanana\nTree", "Banana"],
            ["5\nPnsei\nEight\nWheel\nSpine\nGrass\nSkies", "Spine"],
            ["5\nEadhpcp\nCheck\nCharred\nChapped\nKetchup\nChange", "Chapped"],
            [
                "15\nCcyeilb\nFifteen\nIsland\nBicycle\nCracked\nBite\nBickering\nStumped\nHedge\nAtmosphere\nIntroduction\nWishes\nCompressed\nUnderstand\nLactose\nSmell",
                "Bicycle",
            ],
        ],
        solution: "I=input\nn=int(I())\ns=sorted(I().lower())\nfor i in ‘a’*n:\n a=I()\n if sorted(a.lower())==s:I(a)",
    },
    {
        title: "Pythagorean triples",
        author: "yvesmocq",
        testCases: [
            ["5", "3 4"],
            ["13", "5 12"],
            ["50", "14 48\n30 40"],
            ["27", "..."],
            ["65", "16 63\n25 60\n33 56\n39 52"],
        ],
        solution:
            'n=int(input())\nprint(*[f\'{i} {j}\'for i in range(n)for j in range(i,n)if n*n==i*i+j*j]or["..."],sep="\\n")',
    },
    {
        title: "Game Money Converter",
        author: "iArcadia",
        testCases: [
            ["0\n0\n204", "0G 2S 4B"],
            ["0\n785\n0", "7G 85S 0B"],
            ["664\n0\n0", "664G 0S 0B"],
            ["105\n125\n1078", "106G 35S 78B"],
            ["5483\n1650\n89121", "5508G 41S 21B"],
        ],
        solution: "I=input\nb=int(I())*10000+int(I())*100+int(I())\nprint(f'{b//10000}G {b//100%100}S {b%100}B')",
    },
    {
        title: "Find the Sum!",
        author: "swpnl7",
        testCases: [
            ["1+3+2", "1+2+3"],
            ["9+8+7+6+5+4+3+2+1+0", "0+1+2+3+4+5+6+7+8+9"],
            [
                "3+2+3+3+2+2+1+2+1+2+3+1+2+3+2+3+2+1+2+2+1+1+2+2+3+2+1+3+1+1+3+2+2+2+2+3+3+2+2+3+3+1+1+2+3+3+2+3+3+3\n",
                "1+1+1+1+1+1+1+1+1+1+1+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+3+3+3+3+3+3+3+3+3+3+3+3+3+3+3+3+3+3",
            ],
            ["3", "3"],
            ["1+1+1+1+1", "1+1+1+1+1"],
        ],
        solution: "print(*sorted(input().split('+')),sep='+')",
    },
    {
        title: "Probaception",
        author: "Steuh",
        testCases: [
            ["4\n10 25 50 50", "75"],
            ["5\n15 25 50 15 25", "0"],
            ["4\n100 100 100 100", "100"],
            ["10\n10 5 20 15 20 25 25 40 25 5", "30"],
            ["4\n1 1 1 1", "0"],
        ],
        solution: "input()\n*v,=map(int,input().split())\na=len(v)\nprint(100*sum(i==100*v.count(i)//a for i in v)//a)",
    },
    {
        title: "sum & difference",
        author: "masterboda",
        testCases: [
            ["92\n16", "38\n54"],
            ["49\n-19", "15\n34"],
            ["49\n15", "17\n32"],
            ["-68\n92", "-80\n12"],
            ["-29\n-3", "-16\n-13"],
        ],
        solution: "s=int(input())\nd=(s+int(input()))//2\nfor i in sorted([s-d,d]):print(i)",
    },
    {
        title: "Ordinal Numbers",
        author: "Myldero",
        testCases: [
            ["1", "1st"],
            ["2", "2nd"],
            ["3", "3rd"],
            ["11", "11th"],
            ["20", "20th"],
            ["103", "103rd"],
            ["112", "112th"],
            [
                "27312832179387219837219837128937218937128936213562613528173621873621783612321632512",
                "27312832179387219837219837128937218937128936213562613528173621873621783612321632512th",
            ],
            ["999999999999", "999999999999th"],
        ],
        solution:
            'n=int(input())\nprint(str(n)+["th","st","nd","rd"][(n%10*(n%10<=3),0)[n//10%10==1]])\n# n=gets.to_i\n# $><<$_+%w(th st nd rd)[n/10%10==1||n%10>3?0:n%10]',
    },
];
