// Gera a versão web e publica no branch gh-pages (GitHub Pages).
// Rodar com: npm run publicar
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const raiz = path.join(__dirname, '..');
const dist = path.join(raiz, 'dist');
const rodar = (cmd, cwd = raiz, env = {}) => execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });

rodar('npx expo export --platform web --clear', raiz, { EXPO_BASE_URL: '/leme' });

// SPA: o GitHub Pages devolve o 404.html em links diretos, então ele vira cópia do index.
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));
// Sem isso o Pages ignora a pasta _expo.
fs.writeFileSync(path.join(dist, '.nojekyll'), '');

const remoto = execSync('git remote get-url origin', { cwd: raiz }).toString().trim();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'leme-pages-'));
fs.cpSync(dist, tmp, { recursive: true });
rodar('git init -q -b gh-pages', tmp);
rodar('git add -A', tmp);
rodar('git commit -q -m "Publica versão web"', tmp);
rodar(`git push -f ${remoto} gh-pages`, tmp);
fs.rmSync(tmp, { recursive: true, force: true });
console.log('Publicado no branch gh-pages.');
