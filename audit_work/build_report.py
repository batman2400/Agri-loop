from pathlib import Path
import re, html
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

root=Path(__file__).resolve().parent.parent
out=root/'output'
pdfmetrics.registerFont(TTFont('Arial',r'C:\Windows\Fonts\arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold',r'C:\Windows\Fonts\arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='Arial-Bold',italic='Arial',boldItalic='Arial-Bold')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='ReportBody',fontName='Arial',fontSize=10,leading=14,spaceAfter=7,textColor=colors.HexColor('#25332e')))
styles.add(ParagraphStyle(name='ReportTitle',fontName='Arial-Bold',fontSize=24,leading=29,spaceAfter=14,textColor=colors.HexColor('#174f3c')))
styles.add(ParagraphStyle(name='ReportH2',fontName='Arial-Bold',fontSize=18,leading=22,spaceAfter=12,textColor=colors.HexColor('#174f3c')))
styles.add(ParagraphStyle(name='ReportH3',fontName='Arial-Bold',fontSize=11,leading=15,spaceBefore=6,spaceAfter=6,textColor=colors.HexColor('#174f3c'),keepWithNext=True))
styles.add(ParagraphStyle(name='ReportBullet',parent=styles['ReportBody'],leftIndent=12,firstLineIndent=-9,spaceAfter=5))

def markup(s):
 s=html.escape(s)
 return re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)',lambda m:'<link href="'+html.unescape(m.group(2)).replace('&','&amp;')+'" color="#176f5a"><u>'+m.group(1)+'</u></link>',s)

src=(out/'AgriLoop_Verification_Report.md').read_text(encoding='utf-8')
src=re.sub(r'(?m)^(#{1,3} .+|\[\[PAGE\]\])$',r'\n\1\n',src)
flow=[]
for block in src.split('\n\n'):
 block=block.strip()
 if not block:continue
 if block=='[[PAGE]]':flow.append(PageBreak());continue
 if block.startswith('# '):style='ReportTitle';block=block[2:]
 elif block.startswith('## '):style='ReportH2';block=block[3:]
 elif block.startswith('### '):style='ReportH3';block=block[4:]
 else:style='ReportBody'
 if block.startswith('- '):
  for line in block.splitlines():flow.append(Paragraph('&#8226; '+markup(line[2:]),styles['ReportBullet']))
 elif style=='ReportBody' and re.match(r'^(?:\d+\.|[LS]\d+\.) ',block):
  for line in block.splitlines():flow.append(Paragraph(markup(line),styles['ReportBody']))
 else:flow.append(Paragraph(markup(block).replace('\n','<br/>'),styles[style]))

def footer(c,d):
 c.setStrokeColor(colors.HexColor('#cbd8d0'));c.line(42,39,553,39)
 c.setFont('Arial',8);c.setFillColor(colors.HexColor('#52665b'))
 c.drawString(42,26,'TEAM FADE  /  AGRILOOP VERIFICATION  /  18 OCTOBER 2026')
 c.drawRightString(553,26,str(d.page))

target=out/'AgriLoop_Verification_Report.pdf'
doc=SimpleDocTemplate(str(target),pagesize=(595.28,841.89),leftMargin=42,rightMargin=42,topMargin=39,bottomMargin=52,title='AgriLoop verification and submission-readiness report',author='Document review for Team Fade')
doc.build(flow,onFirstPage=footer,onLaterPages=footer)
r=PdfReader(target)
print('Pages:',len(r.pages))
for i,p in enumerate(r.pages):print(i+1,len(p.extract_text()),p.extract_text().splitlines()[2][:100])
print('PDF:',target)
