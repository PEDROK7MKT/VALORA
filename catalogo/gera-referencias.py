import json, random, csv, sys
# dados lidos da loja (id do produto, id da variante, tipo, foto) — Produto N
P = {
1:("16074800136573","58909420749181","Anéis","IMG_3732.JPG"),
2:("16074800234877","58909420847485","Anéis","IMG_3735.JPG"),
3:("16074800333181","58909420945789","Anéis","IMG_3737.JPG"),
4:("16074800464253","58909421076861","Anéis","04596605-23EA-4907-8319-F1B6A6A3BB88.png"),
5:("16074800562557","58909421175165","Anéis","601412D4-B9CC-47C4-809D-160582D00D94.png"),
6:("16074801250685","58909422354813","Anéis","8AD432C1-26E8-4F98-8B29-1125B2D1D1E3.png"),
7:("16074801283453","58909422387581","Anéis","CAE6D718-8BD1-45DA-A3D1-D042A87FAD26.png"),
8:("16074801316221","58909422420349","Anéis","0B9FEF88-CD50-4A32-A82C-72E3C2AD1AD9.png"),
9:("16074801348989","58909422453117","Anéis","13A1BFCC-6599-4B2C-A638-AA1AFC889BDD.png"),
10:("16074801381757","58909422485885","Anéis","21A18F0D-F0EC-4300-B70F-5A8BECEEA008.png"),
11:("16074801414525","58909422518653","Anéis","24B7665E-E092-4D7B-A358-B15F9702135B.png"),
12:("16074801578365","58909422551421","Anéis","2F202679-D989-4709-896C-3163BD3260F0.png"),
13:("16074800169341","58909420781949","Anéis","499A9875-3CBA-4E6E-870D-61910A40776C.png"),
14:("16074800267645","58909420880253","Anéis","6CDFE315-06EC-4450-B038-7772AECC1372.png"),
15:("16074800365949","58909420978557","Anéis","7E8578FC-C580-4FF8-B658-64A52126A1DC.png"),
16:("16074800398717","58909421011325","Anéis","8A10C0E6-2C4A-44C1-8BB1-B7117B5916AD.png"),
17:("16074800497021","58909421109629","Anéis","9B188443-79F4-49C1-9196-DDF68B661849.png"),
18:("16074800660861","58909421764989","Anéis","A5CC5D49-4B5A-4E5B-B5D7-3F8A1C2D9E7F.png"),
19:("16074800693629","58909421797757","Anéis","CA3711F8-9D2E-4A1B-8C6F-5E7D3B4A2C1F.png"),
20:("16074800726397","58909421830525","Anéis","D19ECB12-7F3A-4B2C-9D8E-6A5C4B3D2E1F.png"),
21:("16074800791933","58909421896061","Brincos","IMG_3730.JPG"),
22:("16074800824701","58909421928829","Brincos","IMG_3731.JPG"),
23:("16074800857469","58909421961597","Brincos","IMG_3734.JPG"),
24:("16074800890237","58909421994365","Brincos","IMG_3736.JPG"),
25:("16074800202109","58909420814717","Brincos","IMG_3738.JPG"),
26:("16074800300413","58909420913021","Brincos","7059BED2-D8F6-4BA6-AE36-15AB711CCE0E.png"),
27:("16074800431485","58909421044093","Brincos","A9B22F61-18E0-4469-9F87-F4F4B8CD24C0.png"),
28:("16074800529789","58909421142397","Brincos","BDD521E8-71B6-4A24-8FD3-E989D4D97781.png"),
29:("16074800595325","58909421207933","Colares","EC0D9AEF-C93B-46F6-B311-A50163632122.png"),
30:("16074800988541","58909422092669","Colares","4B0BB19D-F526-42FA-90DD-D3E1C4288208.png"),
31:("16074801054077","58909422158205","Colares","744A3FE8-A946-4073-8704-70657EB1194D.png"),
32:("16074801086845","58909422190973","Colares","0630F02A-9501-44B6-88CA-0EBFB6DE2132.png"),
33:("16074801119613","58909422223741","Colares","AA66F268-0680-460A-9CC5-7AF4D6CDCE45.png"),
34:("16074801152381","58909422256509","Colares","E4C207C9-3A93-494A-9EC2-2C2F2FE649E4.png"),
35:("16074801217917","58909422322045","Pulseiras","0DAD7081-E717-44CF-A2B9-A1B75817E801.png"),
}
NOME = {"Anéis":"Anel","Brincos":"Brincos","Colares":"Colar","Pulseiras":"Pulseira"}
rng = random.Random(20261017)
refs = rng.sample([n for n in range(100, 1000) if n != 666], len(P))
rows=[]
for (n,(pid,vid,typ,foto)),r in zip(sorted(P.items()), refs):
    ref=f"SH-{r}"
    title=f"{NOME[typ]} {ref}"
    handle=f"{NOME[typ].lower()}-sh-{r}"
    rows.append(dict(n=n,pid=pid,vid=vid,type=typ,foto=foto,ref=ref,title=title,handle=handle))
out=sys.argv[1]
with open(f"{out}/referencias.csv","w",newline="",encoding="utf-8") as f:
    w=csv.writer(f); w.writerow(["antes","referencia","nome_na_loja","categoria","foto_no_drive","endereco"])
    for x in rows: w.writerow([f"Produto {x['n']}",x['ref'],x['title'],x['type'],x['foto'],f"/products/{x['handle']}"])
# mutation 1: produtos (título, endereço com redirecionamento, descrição vazia, tag com a foto)
vars1={}; body1=[]; decl1=[]
for x in rows:
    k=f"p{x['n']}"
    decl1.append(f"${k}: ProductUpdateInput!")
    body1.append(f"{k}: productUpdate(product: ${k}) {{ product {{ handle title }} userErrors {{ field message }} }}")
    vars1[k]={"id":f"gid://shopify/Product/{x['pid']}","title":x['title'],"handle":x['handle'],"redirectNewHandle":True,"descriptionHtml":"","tags":[f"foto:{x['foto']}","referencia-provisoria"]}
q1="mutation(" + ", ".join(decl1) + ") {\n" + "\n".join(body1) + "\n}"
json.dump({"query":q1,"variables":vars1},open(f"{out}/m1.json","w"),ensure_ascii=False)
# mutation 2: SKU = referência
vars2={}; body2=[]; decl2=[]
for x in rows:
    k=f"v{x['n']}"
    decl2.append(f"${k}p: ID!, ${k}: [ProductVariantsBulkInput!]!")
    body2.append(f"{k}: productVariantsBulkUpdate(productId: ${k}p, variants: ${k}) {{ productVariants {{ sku }} userErrors {{ field message }} }}")
    vars2[f"{k}p"]=f"gid://shopify/Product/{x['pid']}"
    vars2[k]=[{"id":f"gid://shopify/ProductVariant/{x['vid']}","inventoryItem":{"sku":x['ref']}}]
q2="mutation(" + ", ".join(decl2) + ") {\n" + "\n".join(body2) + "\n}"
json.dump({"query":q2,"variables":vars2},open(f"{out}/m2.json","w"),ensure_ascii=False)
for x in rows: print(x['n'], x['ref'], x['title'], x['handle'])
