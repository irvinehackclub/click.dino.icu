import { readFileSync } from 'fs';
import path, { parse } from 'path';

const parseMarkdown = (markdown) => {;function mmd(s){var h='';function E(s){return new Option(s).innerHTML}function I(s){return E(s).replace(/!\[([^\]]*)]\(([^(]+)\)/g,'<img alt="$1"src="$2">').replace(/\[([^\]]+)]\(([^(]+)\)/g,'$1'.link('$2')).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>')}s.replace(/^\s+|\r|\s+$/g,'').replace(/\t/g,'    ').split(/\n\n+/).forEach(function(b,f,R){R={'*':[/\n\* /,'<ul><li>','</li></ul>'],1:[/\n[1-9]\d*\.? /,'<ol><li>','</li></ol>'],' ':[/\n    /,'<pre><code>','</code></pre>','\n'],'>':[/\n> /,'<blockquote>','</blockquote>','\n']}[f=b[0]];h+=R?R[1]+('\n'+b).split(R[0]).slice(1).map(R[3]?E:I).join(R[3]||'</li>\n<li>')+R[2]:f=='#'?'<h'+(f=b.indexOf(' '))+'>'+I(b.slice(f+1))+'</h'+f+'>':f=='<'?b:'<p>'+I(b)+'</p>'});return h};return(mmd(markdown));};

const landingPage = markdown => /*html*/`<!DOCTYPE html><html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>click.dino.icu</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
    </head>
    <body>
        <h1>click.dino.icu</h1>
        <p>Short URLs for Dinosaurs</p>
        <hr />
        ${parseMarkdown(markdown)}
    </body>
</html>`;

export default function handler (request, response) {
    const query = request.url.split("?")[0].substring(1);

    if (query === "") {
        const readme = path.join(process.cwd(), 'README.md');
        const readmeString = readFileSync(readme, 'utf8');

        response.setHeader("Content-Type", "text/html");
        return response.end(landingPage(readmeString));
    }

    const file = path.join(process.cwd(), `LINKS.txt`);
    const fileString = readFileSync(file, 'utf8');

    const lines = fileString.split("\n").map(line => line.trim()).filter(line => line !== "");
    const links = Object.fromEntries(lines.map(line => line.split(" ")));

    const destination = links[query];

    if (!destination) {
        response.statusCode = 404;
        return response.end("Not Found");
    }

    response.redirect(307, destination);

    response.send(query);
}
