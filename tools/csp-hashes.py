#!/usr/bin/env python3
"""Confere os hashes da Content-Security-Policy do vercel.json.

A CSP só deixa rodar um <script> ou <style> escrito dentro do HTML se o sha256 do bloco
estiver listado no vercel.json. Editou um bloco desses (hoje só existem em lancamento/)?
Rode na raiz do repositório:

    python3 tools/csp-hashes.py           # confere e aponta o que falta
    python3 tools/csp-hashes.py --write   # regrava script-src e style-src no vercel.json

Arquivos .js e .css separados não precisam de hash: entram pelo 'self'.
"""
import base64
import hashlib
import json
import pathlib
import sys
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
JS_TYPES = {'', 'module', 'text/javascript', 'application/javascript'}


class Blocks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.cur, self.buf, self.found, self.attrs = None, [], [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for k, _ in attrs:
            if k.startswith('on') or k == 'style':
                self.attrs.append((self.getpos()[0], tag, k))
        if tag in ('script', 'style') and 'src' not in a:
            kind = 'style' if tag == 'style' else ('script' if (a.get('type') or '').lower() in JS_TYPES else None)
            self.cur, self.buf = (tag, kind, self.getpos()[0]), []

    def handle_endtag(self, tag):
        if self.cur and tag == self.cur[0]:
            if self.cur[1]:
                digest = hashlib.sha256(''.join(self.buf).encode('utf-8')).digest()
                self.found.append((self.cur[1], self.cur[2], f"'sha256-{base64.b64encode(digest).decode()}'"))
            self.cur = None

    def handle_data(self, data):
        if self.cur:
            self.buf.append(data)


def main():
    write = '--write' in sys.argv
    need = {'script': [], 'style': []}
    problems = 0
    for page in sorted(ROOT.rglob('*.html')):
        if '.git' in page.parts or 'tools' in page.parts:
            continue
        p = Blocks()
        p.feed(page.read_text(encoding='utf-8'))
        rel = page.relative_to(ROOT)
        for kind, line, h in p.found:
            need[kind].append(h)
            print(f'{rel}:{line}  <{kind}>  {h}')
        for line, tag, attr in p.attrs:
            problems += 1
            print(f'{rel}:{line}  ✗ atributo {attr}="…" em <{tag}>: a CSP bloqueia — mova para o .css/.js')

    cfg_path = ROOT / 'vercel.json'
    cfg = json.loads(cfg_path.read_text(encoding='utf-8'))
    header = next(h for rule in cfg['headers'] for h in rule['headers'] if h['key'] == 'Content-Security-Policy')
    directives = [d.strip() for d in header['value'].split(';') if d.strip()]
    for kind in ('script', 'style'):
        name = f'{kind}-src'
        idx = next(i for i, d in enumerate(directives) if d.split()[0] == name)
        have = set(directives[idx].split()[1:])
        missing = [h for h in need[kind] if h not in have]
        stale = [h for h in have if h.startswith("'sha256-") and h not in need[kind]]
        for h in missing:
            problems += 1
            print(f'✗ {name}: falta {h}')
        for h in stale:
            print(f'· {name}: {h} não corresponde a nenhum bloco (pode sair)')
        directives[idx] = ' '.join([name, "'self'"] + list(dict.fromkeys(need[kind])))

    if write:
        header['value'] = '; '.join(directives)
        cfg_path.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
        print('vercel.json atualizado.')
    elif problems:
        print(f'{problems} problema(s). Rode com --write para regravar os hashes.')
        sys.exit(1)
    else:
        print('OK: todos os blocos embutidos estão liberados na CSP.')


if __name__ == '__main__':
    main()
