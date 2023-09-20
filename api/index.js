import { readFileSync } from 'fs';
import path, { parse } from 'path';

function parseMarkdown(n){var r=/\\([\\\|`*_{}\[\]()#+\-~])/g,t=/\n *&gt; *([^]*?)(?=(\n|$){2})/g,e=/\n( *)(?:[*\-+]|((\d+)|([a-z])|[A-Z])[.)]) +([^]*?)(?=(\n|$){2})/g,u=/(^|[^A-Za-z\d\\])(([*_])|(~)|(\^)|(--)|(\+\+)|`)(\2?)([^<]*?)\2\8(?!\2)(?=\W|_|$)/g,c=/^.*\n( *\|( *\:?-+\:?-+\:? *\|)* *\n|)/,f=/.*\n/g,l=/\||(.*?[^\\])\|/g;function o(r,t){n=n.replace(r,t)}function a(n,r){return"<"+n+">"+r+"</"+n+">"}function g(n){return n.replace(u,function(n,r,t,e,u,c,f,l,o,i){return r+a(e?o?"strong":"em":u?o?"s":"sub":c?"sup":f?"small":l?"big":"code",g(i))})}function i(n){return n.replace(r,"$1")}var p=[],s=0;return n="\n"+n+"\n",o(/</g,"&lt;"),o(/>/g,"&gt;"),o(/\t|\r|\uf8ff/g,"  "),n=function n(r){return r.replace(t,function(r,t){return a("blockquote",n(g(t.replace(/^ *&gt; */gm,""))))})}(n),o(/^([*\-=_] *){3,}$/gm,"<hr/>"),n=function n(r){return r.replace(e,function(r,t,e,u,c,f){var l=a("li",g(f.split(RegExp("\n ?"+t+"(?:(?:\\d+|[a-zA-Z])[.)]|[*\\-+]) +","g")).map(n).join("</li><li>")));return"\n"+(e?'<ol start="'+(u?e+'">':parseInt(e,36)-9+'" style="list-style-type:'+(c?"low":"upp")+'er-alpha">')+l+"</ol>":a("ul",l))})}(n),o(/<\/(ol|ul)>\n\n<\1>/g,""),o(/\n((```|~~~).*\n?([^]*?)\n?\2|((    .*?\n)+))/g,function(n,r,t,e,u){return p[--s]=a("pre",a("code",e||u.replace(/^    /gm,""))),s+""}),o(/((!?)\[(.*?)\]\((.*?)( ".*")?\)|\\([\\`*_{}\[\]()#+\-.!~]))/g,function(n,r,t,e,u,c,f){return p[--s]=u?t?'<img src="'+u+'" alt="'+e+'"/>':'<a href="'+u+'">'+i(g(e))+"</a>":f,s+""}),o(/\n(( *\|.*?\| *\n)+)/g,function(n,r){var t=r.match(c)[1];return"\n"+a("table",r.replace(f,function(n,r){return n==t?"":a("tr",n.replace(l,function(n,e,u){return u?a(t&&!r?"th":"td",i(g(e||""))):""}))}))}),o(/(?=^|>|\n)([>\s]*?)(#{1,6}) (.*?)( #*)? *(?=\n|$)/g,function(n,r,t,e){return r+a("h"+t.length,i(g(e)))}),o(/(?=^|>|\n)\s*\n+([^<]+?)\n+\s*(?=\n|<|$)/g,function(n,r){return a("p",i(g(r)))}),o(/-\d+\uf8ff/g,function(n){return p[parseInt(n)]}),n.trim()}

const landingPage = markdown => /*html*/`<!DOCTYPE html><html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>click.dino.icu</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
    </head>
    <body>
        ${parseMarkdown(markdown)}
    </body>
</html>`;

const notFoundPage = () => /*html*/`<!DOCTYPE html><html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>click.dino.icu</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
    </head>
    <body>
        <div style="height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; text-align: center;">
            <div>
                <h1>Link Not Found</h1>
                <p>Perhaps there's a typo?</p>
            </div>
        </div>
        <div style="position: fixed; bottom: 0px; right: 50%; transform: translateX(-50%); text-align: center; padding: 1rem;">
            <p>click.dino.icu</p>
            <a href="https://click.dino.icu"><small>hey, what's that?</small></a>
        </div>
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
        response.setHeader("Content-Type", "text/html");
        return response.end(notFoundPage());
    }

    response.redirect(307, destination);
}
