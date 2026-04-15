const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Ubah fetch functions (getAll..., get...)
    content = content.replace(/([a-zA-Z0-9_]+)\s*\(\s*\)\s*=>\s*\{\s*set([a-zA-Z0-9_]+)\(\s*(getAll[a-zA-Z0-9_]*|get[a-zA-Z0-9_]*)\(.*\)\s*\)/g, 'async $1() {\n    set$2(await $3());');
    
    // 2. Ubah handleSave/handleLogin yg panggil addUser, addMatkul dll.
    content = content.replace(/const handle([a-zA-Z0-9_]+) = \(e\) => \{/g, 'const handle$1 = async (e) => {');
    content = content.replace(/const handle([a-zA-Z0-9_]+) = \((.*)\) => \{/g, 'const handle$1 = async ($2) => {');
    
    // 3. Tambah await pada operasi DB yang dikenal
    const dbFuncs = ['getAllUsers', 'getAllMahasiswa', 'getAllDosen', 'addUser', 'updateUser', 'deleteUser', 'loginUser', 'getAllMatkuls', 'addMatkul', 'updateMatkul', 'deleteMatkul', 'getKrsUser', 'submitKrs', 'approveKrs', 'getAllNilai', 'updateNilai', 'createTicket', 'getTickets', 'replyTicket', 'getEbooks', 'addEbook', 'deleteEbook', 'getIkmUser', 'submitIkm'];
    
    dbFuncs.forEach(func => {
       // Ignore if already awaited
       const regex = new RegExp(`(?<!await\\s)(${func}\\()`, 'g');
       content = content.replace(regex, `await $1`);
    });

    // 4. Ubah useEffect yg memanggil fetch function?
    // Sebenernya useEffect ngga bisa async. Tapi kalau deklarasi fetch()-nya di dalem useEffect:
    content = content.replace(/useEffect\(\(\) => \{\s*const ([a-zA-Z0-9_]+) = (await get[a-zA-Z0-9_]*.*);/g, 'useEffect(() => {\n  const loadData = async () => {\n    const $1 = $2;');
    content = content.replace(/set([a-zA-Z0-9_]+)\(Object\.keys\(grouped\)/g, 'set$1(Object.keys(grouped)'); 
    
    fs.writeFileSync(filePath, content, 'utf8');
};

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
            filelist = walkSync(dirFile, filelist);
        } else {
            if(dirFile.endsWith('.jsx')) filelist.push(dirFile);
        }
    });
    return filelist;
};

// Also apply to App.jsx / LandingPage
walkSync(srcDir).forEach(replaceInFile);
replaceInFile(path.join(__dirname, 'src', 'pages', 'LandingPage.jsx')); // already walking src/pages, so it's duplicated, but harmless

console.log("AST Refactor kasar selesai.");
