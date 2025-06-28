

const bookInfo = [];
bookInfo.push({ name: "Great", vis: true, category: "Novel", rating: 3.1, count: 2, startYear: 1970, startMonth: 1, endYear: 1981, endMonth: 4});
bookInfo.push({ name: "Laws", vis: true, category: "Novel", rating: 4.8, count: 3, startYear: 1980, startMonth: 6, endYear: 1985, endMonth: 7});
bookInfo.push({ name: "Dracula", vis: true, category: "Drama", rating: 2.3, count: 6, startYear: 1991, startMonth: 5, endYear: 1996, endMonth: 5});
bookInfo.push({ name: "Mario", vis: true, category: "Drama", rating: 3.8, count: 4, startYear: 2001, startMonth: 9, endYear: 2012, endMonth: 11});
bookInfo.push({ name: "House", vis: false, category: "Magazine", rating: 4.4, count: 1, startYear: 1987, startMonth: 7, endYear: Infinity, endMonth: Infinity});
bookInfo.push({ name: "Art1", vis: true, category: "Design", rating: 4.2, count: 2, startYear: 1985, startMonth: 6, endYear: 1991, endMonth: 7});
bookInfo.push({ name: "Art2", vis: true, category: "Design", rating: 3.0, count: 3, startYear: 1995, startMonth: 2, endYear: 2005, endMonth: 12});
bookInfo.push({ name: "Wars", vis: true, category: "Novel", rating: 4.6, count: 2, startYear: 1982, startMonth: 4, endYear: 2003, endMonth: 5});
bookInfo.push({ name: "Solo", vis: false, category: "Poem", rating: 4.9, count: 2, startYear: 2007, startMonth: 3, endYear: Infinity, endMonth: Infinity});
bookInfo.push({ name: "Lost", vis: false, category: "Web", rating: 3.2, count: 8, startYear: 1998, startMonth: 6, endYear: Infinity, endMonth: Infinity});
bookInfo.push({ name: "Ocean", vis: true, category: "Magazine", rating: 4.3, count: 1, startYear: 2005, startMonth: 2, endYear: 2020, endMonth: 6});



const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

function find(param0, param1){
    paramYear = Number(param0.slice(1, 5));
    paramMonth = Number(param0.slice(5, 7));

    tempArray = [];

    for (let book of bookInfo){
        if 
        (
            
                (
                    (
                            (book.startYear < paramYear) 
                                || 
                            (book.startYear === paramYear && paramMonth <= book.endMonth))
                    )
                        && 
                    (
                            (paramYear < book.endYear) 
                                || 
                            ((book.endYear === paramYear && paramMonth <= book.endMonth) || (book.endYear === Infinity && book.endMonth === Infinity))
                    )
                )

        
        {
            //출판 연도에 대한 비교. "현재"에 대한 처리는 0으로 함
            if (param1 <= book.count) {
                tempArray.push(book);
            }
        }
    }

    if (tempArray.length === 0) {
        process.stdout.write("!EMPTY");
        process.exit();
    }

    tempArray.sort((a, b) => {
        if (b.rating !== a.rating){
            return b.rating - a.rating;
        }
        return a.name.localeCompare(b.name);
    });

    for (let book of tempArray) {        
        let output = `${book.name}`;
        if (book.vis) {
            output += "*";
        }
        output += `(${book.category})`;
        console.log(output);
    }

    process.exit();
}

async function main() {
    const line = (await askQuestion("입력: "))
    .trim()
    .split(",");

    find(line[0], line[1]);
}

main();