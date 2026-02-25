const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = process.cwd();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function run(cmd) {
    try {
        console.log(`> ${cmd}`);
        return execSync(cmd, { cwd: REPO, stdio: 'pipe', encoding: 'utf-8' });
    } catch (e) {
        console.error(`FAIL: ${cmd}\n${e.stderr || e.message}`);
        return null;
    }
}

function ensureDir(filePath) {
    const dir = path.dirname(path.join(REPO, filePath));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
    ensureDir(filePath);
    fs.writeFileSync(path.join(REPO, filePath), content, 'utf-8');
}

function commit(filePath, message) {
    run(`git add "${filePath}"`);
    run(`git commit -m "${message}"`);
}

async function processBranch(branch) {
    const { name, prTitle, prBody, commits } = branch;
    console.log(`\n=== Branch: ${name} (${commits.length} commits) ===`);

    run('git checkout main');
    run(`git checkout -b ${name}`);

    let fileContents = {};

    for (const c of commits) {
        if (c.mode === 'create') {
            fileContents[c.file] = c.content;
        } else if (c.mode === 'append') {
            fileContents[c.file] = (fileContents[c.file] || '') + c.content;
        } else {
            fileContents[c.file] = c.content;
        }
        writeFile(c.file, fileContents[c.file] || c.content);
        commit(c.file, c.msg);
    }

    run(`git push origin ${name}`);
    await sleep(2000);

    const safeTitle = prTitle.replace(/"/g, '\\"');
    const safeBody = prBody.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    run(`gh pr create --title "${safeTitle}" --body "${safeBody}" --head ${name} --base main`);

    await sleep(2000);

    let mergeResult = run(`gh pr merge ${name} --merge --delete-branch`);
    if (!mergeResult) {
        await sleep(3000);
        mergeResult = run(`gh pr merge ${name} --merge`);
    }

    run('git checkout main');
    run('git pull origin main');
    await sleep(1000);
}

async function main() {
    writeFile('.gitkeep', '');
    run('git add -A');
    run('git commit -m "chore: initialize repository"');
    run('git push -u origin main --force');

    const partFiles = fs.readdirSync(REPO)
        .filter(f => f.startsWith('branches_part') && f.endsWith('.js'))
        .sort();

    let totalCommits = 0;
    let totalBranches = 0;

    for (const pf of partFiles) {
        console.log(`\nLoading ${pf}...`);
        const branches = require(path.join(REPO, pf));
        for (const branch of branches) {
            await processBranch(branch);
            totalBranches++;
            totalCommits += branch.commits.length + 1;
        }
    }

    console.log(`\n\nDONE! ${totalBranches} branches, ~${totalCommits} commits`);
}

main();
