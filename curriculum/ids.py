# Loads every saber from the checklists with an id and the courses (with subject) where the decree places it.
CY = {'1': ['1P','2P'], '2': ['3P','4P'], '3': ['5P','6P']}
def load():
    S = []
    def read(f, p, subj, where):
        n = 0
        for l in open(f):
            if l.startswith('#') or not l.strip(): continue
            n += 1; parts = [x.strip() for x in l.split('|')]
            if len(parts) == 2: blk, cols, txt = parts[0], None, parts[1]
            else: blk, cols, txt = parts
            S.append(dict(id=f'{p}{n}', block=blk, cols=cols, text=txt, need=where(cols)))
    read('pri_mat.txt','PM','Matemáticas', lambda c: [[(x,'Matemáticas') for x in CY[k]] for k in c.split()])
    read('pri_medio.txt','PC','Conocimiento del Medio', lambda c: [[(x,'Conocimiento del Medio') for x in CY[k]] for k in c.split()])
    EMC = {'S': [('1E','Matemáticas'),('2E','Matemáticas')], 'T': [('3E','Matemáticas')], 'A': [('4E','Matemáticas A')], 'B': [('4E','Matemáticas B')]}
    read('eso_mat.txt','EM','', lambda c: [EMC[k] for k in c.split()])
    read('eso_bg.txt','BG','', lambda c: [[(k+'E','Biología y Geología')] for k in c.split()])
    read('eso_fq.txt','FQ','', lambda c: [[(k+'E','Física y Química')] for k in c.split()])
    read('eso_tyd.txt','TD','', lambda c: [[(k+'E','Tecnología y Digitalización')] for k in c.split()])
    # 4.º Tecnología (first 5) and Digitalización (next 4)
    tc = [l for l in open('eso4_tec_dig.txt') if l.strip() and not l.startswith('#')]
    for i, l in enumerate(tc):
        blk, txt = [x.strip() for x in l.split('|')]
        if i < 5: S.append(dict(id=f'TC{i+1}', block=blk, cols='4', text=txt, need=[[('4E','Tecnología')]]))
        else: S.append(dict(id=f'DG{i-4}', block=blk, cols='4', text=txt, need=[[('4E','Digitalización')]]))
    return S
