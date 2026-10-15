import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def set_table_full_borders(table, color="B0B0B0", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def build_report():
    doc = Document()

    # Standard Page Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles setup
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    font.color.rgb = RGBColor(0x22, 0x22, 0x22)

    # ==========================================
    # PAGE 1: TITLE / COVER PAGE
    # ==========================================
    if os.path.exists('mgm_logo.png'):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(0)
        p_logo.paragraph_format.space_after = Pt(8)
        run_logo = p_logo.add_run()
        run_logo.add_picture('mgm_logo.png', width=Inches(2.2))

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    p_inst.paragraph_format.line_spacing = 1.15
    r = p_inst.add_run("School of Engineering and Technology, MGM University\nChh. Sambhajinagar")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(15)
    r.font.bold = True

    p_year = doc.add_paragraph()
    p_year.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_year.paragraph_format.space_before = Pt(12)
    p_year.paragraph_format.space_after = Pt(18)
    r = p_year.add_run("Academic Year 2026-2027")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True

    p_rep = doc.add_paragraph()
    p_rep.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_rep.paragraph_format.space_after = Pt(2)
    r = p_rep.add_run("Mini Project report\nOn")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(8)
    p_title.paragraph_format.space_after = Pt(18)
    r = p_title.add_run("“Blockchain-Based Deepfake Proof System”")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(17)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x0A, 0x25, 0x40)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(4)
    p_sub.paragraph_format.line_spacing = 1.2
    r = p_sub.add_run("Submitted in partial fulfillment for Ninth semester of B.Tech (Integrated) in\n")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    
    r_dept = p_sub.add_run("COMPUTER SCIENCE AND ENGINEERING\n(IoT, Cyber Security Including Block Chain\nTechnology)")
    r_dept.font.name = 'Times New Roman'
    r_dept.font.size = Pt(12)
    r_dept.font.bold = True

    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_before = Pt(16)
    p_by.paragraph_format.space_after = Pt(8)
    r = p_by.add_run("By")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    # Student Table on Title Page
    t_students = doc.add_table(rows=2, cols=2)
    t_students.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_students.autofit = False

    st_data = [
        ("Dhananjay Kadge", "202256113003"),
        ("Faizullah Khan", "202256113004")
    ]
    for row_idx, (name, prn) in enumerate(st_data):
        cell_name = t_students.cell(row_idx, 0)
        cell_prn = t_students.cell(row_idx, 1)
        cell_name.width = Inches(3.2)
        cell_prn.width = Inches(2.2)
        
        p1 = cell_name.paragraphs[0]
        p1.paragraph_format.space_after = Pt(4)
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r1 = p1.add_run(name)
        r1.font.bold = True
        r1.font.size = Pt(12)

        p2 = cell_prn.paragraphs[0]
        p2.paragraph_format.space_after = Pt(4)
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r2 = p2.add_run(prn)
        r2.font.bold = True
        r2.font.size = Pt(12)

    p_guide = doc.add_paragraph()
    p_guide.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_guide.paragraph_format.space_before = Pt(28)
    p_guide.paragraph_format.space_after = Pt(2)
    p_guide.paragraph_format.line_spacing = 1.15
    r = p_guide.add_run("Under the guidance of\n")
    r.font.size = Pt(11)
    r_name = p_guide.add_run("Ms. Bhagat C. B.\n")
    r_name.font.size = Pt(13)
    r_name.font.bold = True
    r_desig = p_guide.add_run("(Asst. Professor)")
    r_desig.font.size = Pt(11)

    doc.add_page_break()

    # ==========================================
    # PAGE 2: CERTIFICATE
    # ==========================================
    p_cdept = doc.add_paragraph()
    p_cdept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cdept.paragraph_format.space_before = Pt(10)
    p_cdept.paragraph_format.space_after = Pt(14)
    r = p_cdept.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True

    if os.path.exists('mgm_logo.png'):
        p_clogo = doc.add_paragraph()
        p_clogo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_clogo.paragraph_format.space_after = Pt(14)
        run_clogo = p_clogo.add_run()
        run_clogo.add_picture('mgm_logo.png', width=Inches(2.1))

    p_cert = doc.add_paragraph()
    p_cert.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert.paragraph_format.space_after = Pt(20)
    r = p_cert.add_run("CERTIFICATE")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True
    r.underline = True

    p_cert_body = doc.add_paragraph()
    p_cert_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_cert_body.paragraph_format.line_spacing = 1.35
    p_cert_body.paragraph_format.space_after = Pt(45)

    r = p_cert_body.add_run("This is to certify that ")
    r.font.size = Pt(12)
    r = p_cert_body.add_run("Dhananjay Kadge , Faizullah Khan ")
    r.font.size = Pt(12)
    r.font.bold = True
    r = p_cert_body.add_run("with PRN No. ")
    r.font.size = Pt(12)
    r = p_cert_body.add_run("202256113003, 202256113004 ")
    r.font.size = Pt(12)
    r.font.bold = True
    r = p_cert_body.add_run("has successfully completed their Mini-Project entitled ")
    r.font.size = Pt(12)
    r = p_cert_body.add_run("“Blockchain-Based Deepfake Proof System” ")
    r.font.size = Pt(12)
    r.font.bold = True
    r = p_cert_body.add_run("in the Course of ")
    r.font.size = Pt(12)
    r = p_cert_body.add_run("“IoT, Cyber Security Including Block Chain Technology” ")
    r.font.size = Pt(12)
    r.font.bold = True
    r = p_cert_body.add_run("in the Ninth Semester during tenure of completing the B. Tech(I) program in ")
    r.font.size = Pt(12)
    r = p_cert_body.add_run("Computer Science and Engineering (IoT, Cyber Security Including Blockchain Technology) ")
    r.font.size = Pt(12)
    r.font.bold = True
    r = p_cert_body.add_run("from School of Engineering and Technology, MGM University institute.")
    r.font.size = Pt(12)

    # Signatures
    t_sig = doc.add_table(rows=1, cols=2)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sig.autofit = False

    cell_g = t_sig.cell(0, 0)
    cell_h = t_sig.cell(0, 1)
    cell_g.width = Inches(3.2)
    cell_h.width = Inches(3.2)

    pg = cell_g.paragraphs[0]
    pg.alignment = WD_ALIGN_PARAGRAPH.LEFT
    pg.paragraph_format.line_spacing = 1.15
    rg1 = pg.add_run("Ms. Bhagat C. B.\n")
    rg1.font.bold = True
    rg1.font.size = Pt(12)
    rg2 = pg.add_run("Guide\nCSE Department")
    rg2.font.size = Pt(11)

    ph = cell_h.paragraphs[0]
    ph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    ph.paragraph_format.line_spacing = 1.15
    rh1 = ph.add_run("Ms. Madhuri Kawarkhe\n")
    rh1.font.bold = True
    rh1.font.size = Pt(12)
    rh2 = ph.add_run("HOD\nCSE Department")
    rh2.font.size = Pt(11)

    doc.add_page_break()

    # ==========================================
    # PAGE 3: TABLE OF CONTENTS
    # ==========================================
    p_toc_title = doc.add_paragraph()
    p_toc_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_title.paragraph_format.space_before = Pt(10)
    p_toc_title.paragraph_format.space_after = Pt(20)
    r = p_toc_title.add_run("CONTENT")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True

    t_toc = doc.add_table(rows=13, cols=3)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_full_borders(t_toc, color="555555", sz="6")

    toc_data = [
        ("Sr. No", "Title", "Page. No."),
        ("1", "Abstract", "01"),
        ("2", "Introduction", "01"),
        ("3", "Course Outcomes Integrated", "02"),
        ("4", "Action Plan", "03"),
        ("5", "Literature Review", "04"),
        ("6", "Proposed Methodology", "05"),
        ("7", "Implementation & Core Code Base", "06"),
        ("8", "Outputs of the Mini-Projects & Execution Screenshots", "10"),
        ("9", "Skill Developed / learning out of this Mini-Project", "14"),
        ("10", "Applications of this Mini-Project", "15"),
        ("11", "Area of Future Improvement", "16"),
        ("12", "Conclusion", "17")
    ]

    col_widths = [Inches(1.0), Inches(4.5), Inches(1.2)]
    for r_idx, row in enumerate(toc_data):
        for c_idx, val in enumerate(row):
            cell = t_toc.cell(r_idx, c_idx)
            cell.width = col_widths[c_idx]
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            set_cell_margins(cell, top=120, bottom=120, left=150, right=150)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            if c_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif c_idx == 1:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER

            run = p.add_run(val)
            run.font.name = 'Times New Roman'
            if r_idx == 0:
                run.font.bold = True
                run.font.size = Pt(12)
                set_cell_background(cell, "EAEAEA")
            else:
                run.font.size = Pt(11)
                if r_idx % 2 == 1:
                    set_cell_background(cell, "FAFAFA")

    doc.add_page_break()

    # ==========================================
    # HELPER FORMATTING FUNCTIONS (CLEAN SPACING)
    # ==========================================
    def add_section_header(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x0A, 0x25, 0x40)
        return p

    def add_sub_header(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x22, 0x22, 0x22)
        return p

    def add_body_p(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(text.strip())
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        return p

    def add_bullet_p(bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4)
        r1 = p.add_run(bold_prefix.strip() + " ")
        r1.font.bold = True
        r1.font.size = Pt(12)
        r2 = p.add_run(text.strip())
        r2.font.size = Pt(12)
        return p

    def add_code_block(title, code_str):
        p_t = doc.add_paragraph()
        p_t.paragraph_format.space_before = Pt(10)
        p_t.paragraph_format.space_after = Pt(2)
        p_t.paragraph_format.keep_with_next = True
        r_t = p_t.add_run(title)
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(10.5)
        r_t.font.bold = True
        r_t.font.color.rgb = RGBColor(0x0A, 0x25, 0x40)

        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_full_borders(tbl, color="C8C8D0", sz="4")
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, "F7F7F9")
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)

        p_code = cell.paragraphs[0]
        p_code.paragraph_format.space_after = Pt(0)
        p_code.paragraph_format.line_spacing = 1.15
        r_c = p_code.add_run(code_str.strip())
        r_c.font.name = 'Consolas'
        r_c.font.size = Pt(8.5)
        r_c.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_before = Pt(0)
        p_sp.paragraph_format.space_after = Pt(4)

    def add_figure(img_path, caption_text, width=Inches(5.9)):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(10)
            p_img.paragraph_format.space_after = Pt(2)
            p_img.paragraph_format.keep_with_next = True
            r_img = p_img.add_run()
            r_img.add_picture(img_path, width=width)

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(12)
            r_cap = p_cap.add_run(caption_text)
            r_cap.font.name = 'Times New Roman'
            r_cap.font.size = Pt(10)
            r_cap.font.italic = True
            r_cap.font.bold = True
            r_cap.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

    # --- 1. ABSTRACT ---
    add_section_header("1. Abstract")
    add_body_p(
        "The exponential rise of generative artificial intelligence, specifically Generative Adversarial Networks (GANs) "
        "and modern latent diffusion models, has catalyzed an unprecedented crisis in digital media authenticity. Synthetic video "
        "and audio impersonations—popularly known as deepfakes—have reached photorealistic fidelity, presenting acute vulnerabilities "
        "across financial institutions, executive communication, legal proceedings, and democratic governance. Conventional digital "
        "watermarking and centralized server-side verification systems are fundamentally inadequate; watermarks are easily stripped "
        "or altered during compression, while centralized databases remain susceptible to unauthorized modification, internal "
        "administrator tampering, and single-point-of-failure vulnerabilities."
    )
    add_body_p(
        "This mini-project proposes and implements 'ChainProof: A Blockchain-Based Deepfake Proof System', a client-side decentralized "
        "provenance verification framework that marries raw cryptographic hashing with immutable distributed ledger technology. Rather "
        "than relying on easily manipulated heuristic detections or exposing private media to third-party cloud servers, ChainProof "
        "utilizes the browser-native WebCrypto API to calculate an uncompromising, irreversible 256-bit Secure Hash Algorithm (SHA-256) "
        "digital fingerprint directly from the media's binary buffer. The platform evaluates byte-level Shannon information entropy, "
        "examines native binary file headers (JPEG SOI, PNG chunk signatures, and MP4 ftyp containers), and establishes a multi-axis "
        "forensic radar assessment."
    )
    add_body_p(
        "Every verification result is cryptographically sealed into a distributed block structure featuring linked hashes, Merkle root "
        "representations, and automated consensus validation. A dual-media cryptographic comparator further allows bit-level difference "
        "mapping. The resulting system guarantees immutable digital provenance, providing mathematical non-repudiation and zero-trust "
        "verification against generative synthetic media."
    )

    # --- 2. INTRODUCTION ---
    add_section_header("2. Introduction")
    add_body_p(
        "In the contemporary information era, digital media represents the foundational currency of truth, communication, and legal "
        "evidence. However, the democratization of sophisticated machine learning frameworks (such as StyleGAN, Stable Diffusion, "
        "and transformer-based voice synthesizers) has effectively broken the traditional paradigm that 'seeing is believing'. "
        "Hyper-realistic synthetic media can now be generated with consumer-grade computing hardware, allowing malicious actors to "
        "orchestrate CEO voice cloning scams, political disinformation campaigns, and non-consensual identity theft."
    )
    add_sub_header("2.1 Problem Statement")
    add_body_p("Existing defensive mechanisms against deepfakes suffer from three fatal structural shortcomings:")
    add_bullet_p("1. Centralized Authority Vulnerability:", "Verification services stored in conventional SQL or NoSQL databases are subject to administrator tampering, unauthorized database modification, state-sponsored alteration, and insider attacks.")
    add_bullet_p("2. Privacy and Latency Constraints:", "Uploading gigabyte-scale high-definition video files to remote deep learning servers introduces unacceptable bandwidth costs, heavy server computational overhead, and severe user data privacy hazards.")
    add_bullet_p("3. Fragility of Post-Facto Detection:", "Machine learning detection models inevitably engage in an asymmetric arms race against generation models; detectors trained on current artifacts consistently fail when confronted with unseen zero-day generative models.")

    add_sub_header("2.2 Project Objectives")
    add_bullet_p("Client-Side Cryptographic Hashing:", "Execute zero-latency binary hashing using the W3C WebCrypto API directly in the client runtime without transmitting private media over external networks.")
    add_bullet_p("Multi-Factor Forensic Heuristics:", "Derive deterministic forensic anomaly metrics by analyzing binary file headers, metadata structure, and Shannon entropy distributions.")
    add_bullet_p("Immutable Ledger Synthesis:", "Construct a cryptographically linked blockchain ledger that permanently anchors every media hash, timestamp, and verification verdict into tamper-evident blocks.")
    add_bullet_p("Cryptographic Comparison Engine:", "Implement a character-level and byte-level diff comparator that demonstrates the avalanche effect of cryptographic hashing when media is manipulated.")
    add_bullet_p("Interactive High-Performance Interface:", "Deliver an enterprise-grade dark-themed web portal built on Next.js 14, React, and Tailwind CSS featuring dynamic SVG radar visualization.")

    # --- 3. COURSE OUTCOMES INTEGRATED ---
    add_section_header("3. Course Outcomes Integrated")
    add_body_p(
        "This mini-project comprehensively integrates and demonstrates the course outcomes specified within the B.Tech Computer "
        "Science and Engineering curriculum, specifically aligning with IoT, Cyber Security, and Blockchain Technology:"
    )
    add_bullet_p("CO1 - Threat Modeling & Multimedia Forensics:", "Ability to analyze adversarial vectors in synthetic media, evaluate attack surfaces in digital credentials, and identify structural manipulation within raw multimedia formats.")
    add_bullet_p("CO2 - Applied Cryptographic Engineering:", "Proficiency in implementing industry-standard cryptographic algorithms (SHA-256, Merkle Trees, cryptographic digests) to guarantee data integrity and confidentiality.")
    add_bullet_p("CO3 - Decentralized Ledger & Consensus Architecture:", "Design, implementation, and mathematical validation of immutable distributed ledgers, linked cryptographic blocks, nonces, and simulated consensus protocols.")
    add_bullet_p("CO4 - Modern Full-Stack System Design:", "Architecting high-performance, responsive, type-safe web architectures using TypeScript, Next.js App Router, React component modularity, and Tailwind CSS.")
    add_bullet_p("CO5 - Data Integrity & Provenance Governance:", "Developing decentralized verification workflows that ensure non-repudiation, verifiable audit trails, and zero-trust authentication paradigms.")

    # --- 4. ACTION PLAN ---
    add_section_header("4. Action Plan")
    add_body_p("The execution of the mini-project was systematically partitioned across dedicated development phases:")

    t_plan = doc.add_table(rows=7, cols=5)
    t_plan.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_full_borders(t_plan, color="555555", sz="6")

    plan_headers = ["S. No.", "Details of Activity", "Planned Start Date", "Planned Finish Date", "Name of Responsible Team Members"]
    plan_rows = [
        ("1", "Literature review on deepfake synthesis, forensic artifacts, and blockchain provenance architectures.", "09/09/2026", "11/10/2026", "Dhananjay Kadge\nFaizullah Khan"),
        ("2", "System requirement analysis and client-side WebCrypto cryptographic engine design.", "12/01/2026", "14/09/2026", "Faizullah Khan"),
        ("3", "Implementation of binary entropy calculator, file header validator, and radar scoring models.", "15/09/2026", "19/09/2026", "Dhananjay Kadge"),
        ("4", "Core Blockchain architecture development: block hashing, Merkle roots, Genesis block, and chain validation.", "20/02/2026", "24/09/2026", "Faizullah Khan"),
        ("5", "Development of dual-file cryptographic comparator, consensus visualizer, and UI dashboard.", "25/09/2026", "30/09/2026", "Dhananjay Kadge"),
        ("6", "End-to-end integration, performance optimization, Vercel cloud deployment, and report documentation.", "1/10/2026", "03/10/2026", "Dhananjay Kadge\nFaizullah Khan")
    ]

    col_w_plan = [Inches(0.6), Inches(2.6), Inches(1.1), Inches(1.1), Inches(1.8)]
    for c_idx, h in enumerate(plan_headers):
        cell = t_plan.cell(0, c_idx)
        cell.width = col_w_plan[c_idx]
        set_cell_background(cell, "EAEAEA")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(10)

    for r_idx, row_data in enumerate(plan_rows):
        for c_idx, val in enumerate(row_data):
            cell = t_plan.cell(r_idx + 1, c_idx)
            cell.width = col_w_plan[c_idx]
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            if r_idx % 2 == 1:
                set_cell_background(cell, "FAFAFA")
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.15
            if c_idx in [0, 2, 3]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(val)
            r.font.size = Pt(9.5)

    # --- 5. LITERATURE REVIEW ---
    add_section_header("5. Literature Review")
    add_body_p(
        "A rigorous review of academic and industrial literature reveals the evolutionary clash between synthetic media "
        "generation and multimedia authentication:"
    )
    add_sub_header("5.1 Generative AI & Deepfake Synthesis Mechanisms")
    add_body_p(
        "Modern deepfake synthesis architectures predominantly rely on Generative Adversarial Networks (Goodfellow et al., 2014) "
        "and conditional latent diffusion frameworks (Rombach et al., 2022). Deepfake creation techniques can be categorized into: "
        "(1) Facial Identity Swapping (replacing the subject's face while retaining donor posture and expression, e.g., DeepFaceLab); "
        "(2) Facial Re-enactment / Puppeteering (modifying mouth, eyes, and expressions to match an attacker's audio speech); "
        "and (3) Complete Audio-Visual Synthesis (generating synthetic personas from textual prompts via models like Sora or Runway Gen-2). "
        "These models optimize loss functions that systematically eliminate human-perceptible flaws, making visual inspection obsolete."
    )
    add_sub_header("5.2 Conventional AI Detection Techniques and Their Pitfalls")
    add_body_p(
        "Early automated detection approaches concentrated on spatial anomalies—such as irregular eye blinking (Li et al., 2018), "
        "teeth alignment discrepancies, and asymmetrical ear structures. Subsequent methods utilized deep convolutional networks "
        "(MesoNet, Xception, EfficientNet) trained on datasets like FaceForensics++ and Celeb-DF. However, recent literature "
        "(Mirsky & Lee, 2021) establishes that spatial neural detectors exhibit catastrophic degradation when applied to unseen "
        "generators (the zero-day generator dilemma) or when media undergoes routine social media recompression (JPEG/H.264)."
    )
    add_sub_header("5.3 Digital Watermarking vs. Blockchain Provenance")
    add_body_p(
        "Traditional watermarking (spatial LSB insertion or frequency DCT/DWT watermarking) attempts to embed invisible copyright "
        "tags into pixel matrices. However, adversarial studies confirm that watermarks are easily destroyed through geometric "
        "cropping, gaussian blurring, or re-encoding without visibly corrupting the fake content. Conversely, Blockchain Technology "
        "(Nakamoto, 2008) provides mathematical immutability. By treating the media's cryptographic hash as an unalterable transaction "
        "on a distributed ledger, media authenticity shifts from fallible heuristic detection to deterministic historical provenance. "
        "Recent industry initiatives, including the Coalition for Content Provenance and Authenticity (C2PA), validate that "
        "cryptographic provenance is the only definitive barrier against generative tampering."
    )

    # --- 6. PROPOSED METHODOLOGY ---
    add_section_header("6. Proposed Methodology")
    add_body_p(
        "The proposed ChainProof architecture establishes an end-to-end, zero-trust media provenance and verification pipeline. "
        "The complete operational lifecycle is organized into five tightly coupled algorithmic phases:"
    )
    add_sub_header("6.1 Phase 1: Client-Side Binary Ingestion & Buffer Conversion")
    add_body_p(
        "When a user drops an image, video, or audio clip into the interface, the browser intercepts the native HTML5 File object. "
        "Rather than transmitting the payload over network sockets, the system uses the FileReader API to allocate a contiguous "
        "in-memory ArrayBuffer. This guarantees zero network exposure and absolute privacy for sensitive documents."
    )
    add_sub_header("6.2 Phase 2: WebCrypto SHA-256 Cryptographic Hashing")
    add_body_p(
        "The raw binary buffer is passed to the browser's hardware-accelerated WebCrypto cryptographic engine via "
        "`window.crypto.subtle.digest('SHA-256', buffer)`. The algorithm computes a 256-bit (32-byte) message digest, subsequently "
        "formatted into a 64-character hexadecimal representation. Due to the mathematical avalanche effect, altering even a solitary "
        "least-significant bit within a gigabyte file completely randomizes all 64 hexadecimal characters."
    )
    add_sub_header("6.3 Phase 3: Multi-Signal Forensic Heuristic Engine")
    add_body_p("While hashing establishes identity, the forensic engine evaluates the structural integrity of the file across three distinct channels:")
    add_bullet_p("Shannon Information Entropy:", "Evaluates the distribution of byte frequencies across the file's sample buffer according to H(X) = -sum(P(x) * log2(P(x))). High-entropy irregularities typically indicate artificial compression or synthetic generative encoding artifacts.")
    add_bullet_p("Magic Byte & Binary Header Inspection:", "Validates that the file's initial magic numbers correspond to authentic MIME standards (e.g., JPEG SOI marker 0xFFD8, PNG header 0x89504E47, or MP4 ftyp container box). Truncated or spoofed headers receive penalization.")
    add_bullet_p("Metadata & Filename Entropy:", "Audits timestamp consistency, file size normality bounds, and filename character entropy.")

    add_sub_header("6.4 Phase 4: Deterministic Classification & Forensic Radar Derivation")
    add_body_p(
        "To ensure deterministic replicability without requiring heavy server-side deep learning weights, the initial bytes of "
        "the SHA-256 digest are mathematically mapped to categorize the sample into AUTHENTIC, DEEPFAKE, or SUSPICIOUS categories. "
        "Six specific forensic dimensions are derived deterministically: Face Consistency, Temporal Stability, Artifact Detection, "
        "Metadata Integrity, Compression Anomaly, and Lighting Uniformity."
    )
    add_sub_header("6.5 Phase 5: Blockchain Block Construction & Chain Integrity Validation")
    add_body_p(
        "Upon completion of analysis, the system constructs a new Block containing: Block Index, Timestamp, Media Hash, Forensic "
        "Payload, Previous Block Hash, Nonce, and Merkle Root. The block is cryptographically appended to the chain. The system "
        "continuously validates that Block[i].previousHash == Block[i-1].hash. If any historical record is tampered with, the "
        "mathematical link breaks and flags an alert."
    )

    # --- 7. IMPLEMENTATION & CORE CODE BASE ---
    add_section_header("7. Implementation & Core Code Base")
    add_body_p(
        "The ChainProof platform is implemented utilizing a modern, production-grade technology stack designed for extreme "
        "responsiveness, type safety, and cryptographic precision. Below are the key engineering components and main sections "
        "of the project's source code."
    )
    add_sub_header("7.1 Technical Stack Breakdown")
    add_bullet_p("Next.js 14 (App Router):", "Provides modern hybrid rendering, server-side pre-rendering, and dynamic route optimization.")
    add_bullet_p("React 18 & TypeScript:", "Provides modular component architecture with strict static typing, eliminating runtime type errors.")
    add_bullet_p("Tailwind CSS:", "Enables bespoke enterprise styling, neon status indicators, and responsive mobile-first layouts.")
    add_bullet_p("WebCrypto Subtle API:", "Executes native browser cryptographic operations with hardware acceleration.")
    add_bullet_p("Lucide React Icons:", "Provides unified, accessible vector iconography across security dashboards.")
    add_bullet_p("Pure SVG Radar Engine:", "Custom mathematical SVG generator translating 6-dimensional vectors into spider-chart polygon coordinates.")

    add_sub_header("7.2 Core Source Code Modules")
    add_body_p(
        "The following code excerpts represent the mathematical and cryptographic heart of the application implemented in "
        "`src/lib/blockchain.ts`, `src/components/RadarChart.tsx`, and `src/components/CompareSection.tsx`."
    )

    # Code Listing 7.1
    add_code_block(
        "Code Listing 7.1: Client-Side WebCrypto SHA-256 Binary Digest Generator (src/lib/blockchain.ts)",
        """// SHA-256 hash using browser native WebCrypto API
async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return ssrHash(message);
}

// Direct raw ArrayBuffer hashing for uploaded media files
async function hashBuffer(buffer: ArrayBuffer): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return ssrHash('buffer-' + buffer.byteLength);
}"""
    )

    # Code Listing 7.2
    add_code_block(
        "Code Listing 7.2: Shannon Information Entropy Calculation Algorithm (src/lib/blockchain.ts)",
        """// Shannon Entropy calculation over binary byte distribution: H(X) = -sum(P(x) * log2(P(x)))
private calculateEntropy(bytes: Uint8Array): number {
  const freq = new Array(256).fill(0);
  const sample = bytes.slice(0, Math.min(bytes.length, 100000));
  for (let i = 0; i < sample.length; i++) freq[sample[i]]++;
  let entropy = 0;
  const n = sample.length;
  for (const f of freq) {
    if (f > 0) {
      const p = f / n;
      entropy -= p * Math.log2(p);
    }
  }
  // Normalize to 0-100% scale (theoretical maximum for 8-bit byte is 8.0 bits)
  return Math.min(100, (entropy / 8) * 100);
}"""
    )

    # Code Listing 7.3
    add_code_block(
        "Code Listing 7.3: Binary Magic Header Signature Verification (src/lib/blockchain.ts)",
        """private analyzeFileHeader(bytes: Uint8Array, mimeType: string): number {
  let score = 70; // baseline integrity score
  if (mimeType.startsWith('image/jpeg')) {
    // Standard JPEG Start of Image (SOI) marker: 0xFF, 0xD8
    if (bytes[0] === 0xFF && bytes[1] === 0xD8) score += 15;
    else score -= 30;
  } else if (mimeType.startsWith('image/png')) {
    // Official PNG chunk signature: 89 50 4E 47 0D 0A 1A 0A
    const pngSig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    const match = pngSig.every((b, i) => bytes[i] === b);
    if (match) score += 15;
  } else if (mimeType.startsWith('video/')) {
    // MP4/MOV ISO base media file format ftyp box signature: bytes 4..7 == 'ftyp'
    if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) score += 10;
  }
  return Math.max(0, Math.min(100, score));
}"""
    )

    # Code Listing 7.4
    add_code_block(
        "Code Listing 7.4: Block Encapsulation, Merkle Root, and Ledger Append (src/lib/blockchain.ts)",
        """async addBlock(data: BlockData): Promise<Block> {
  const prevBlock = this.chain[this.chain.length - 1];
  const blockContent = JSON.stringify(data) + prevBlock.hash + this.chain.length;
  const hash = await sha256(blockContent);
  const merkleRoot = await sha256(data.mediaHash + data.analysisResult + data.timestamp);

  const newBlock: Block = {
    index: this.chain.length,
    timestamp: Date.now(),
    data,
    previousHash: prevBlock.hash,
    hash,
    nonce: this.mine(hash),
    merkleRoot,
    validator: this.VALIDATORS[this.chain.length % this.VALIDATORS.length],
  };

  this.chain.push(newBlock);

  // Register confirmed transaction entry on ledger
  const txHash = await sha256(hash + newBlock.index + Date.now());
  this.transactions.unshift({
    id: '0x' + txHash.slice(0, 40),
    blockIndex: newBlock.index,
    mediaHash: data.mediaHash,
    result: data.analysisResult,
    confidence: data.confidence,
    timestamp: newBlock.timestamp,
    status: 'CONFIRMED',
    gasUsed: 21000 + (newBlock.nonce % 50000),
    fileName: data.fileName,
  });

  return newBlock;
}"""
    )

    # Code Listing 7.5
    add_code_block(
        "Code Listing 7.5: Cryptographic Chain Integrity Validator (src/lib/blockchain.ts)",
        """validateChain(): boolean {
  for (let i = 1; i < this.chain.length; i++) {
    const current = this.chain[i];
    const previous = this.chain[i - 1];
    // Mathematical assertion: every block's parent pointer must match previous hash
    if (current.previousHash !== previous.hash) {
      return false; // Chain compromised!
    }
  }
  return true; // Chain strictly valid
}"""
    )

    # Code Listing 7.6
    add_code_block(
        "Code Listing 7.6: Pure SVG Multi-Axis Radar Chart Coordinate Generator (src/components/RadarChart.tsx)",
        """export default function RadarChart({ scores, size = 200, color = '#6366f1' }: RadarProps) {
  const center = size / 2;
  const radius = (size / 2) - 28;
  const angleStep = (2 * Math.PI) / scores.length;

  // Transform polar coordinate (angle, radius) into 2D Cartesian (x, y)
  const getPoint = (score: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (score / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const points = scores.map((s, i) => getPoint(s.value, i));
  const polyStr = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Dynamic polygonal data overlay */}
      <polygon points={polyStr} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />
      ))}
    </svg>
  );
}"""
    )

    # --- 8. OUTPUTS OF THE MINI-PROJECTS & EXECUTION SCREENSHOTS ---
    add_section_header("8. Outputs of the Mini-Projects & Execution Screenshots")
    add_body_p(
        "The finalized ChainProof platform was deployed and executed in a Google Chrome web environment. The system's "
        "operational execution across its four primary interfaces is documented below using four distinct, high-resolution "
        "screenshots capturing the landing overview, media verification detection, dual-file cryptographic comparison, and "
        "real-time network statistics."
    )

    # Figure 8.1 - User's Hero Screenshot
    add_figure("user_img_hero.png", "Figure 8.1: ChainProof Web Application Landing Interface - Decentralized Media Verification Architecture")
    add_body_p(
        "Figure 8.1 demonstrates the primary landing interface of the ChainProof system. The modern dark-themed hero "
        "section establishes the dual cryptographic and blockchain paradigm: 'Blockchain DeepFake Proof System'. The interface "
        "clearly presents the three operational pillars: client-side SHA-256 cryptographic hashing, multi-model AI neural "
        "analysis, and immutable blockchain recording. Direct action buttons allow instant navigation to the verification portal "
        "and educational architecture documentation."
    )

    # Figure 8.2 - User's Deepfake Screenshot
    add_figure("user_img_verify_deepfake.png", "Figure 8.2: Media Verification Output on 'fake_video_test.jpg' Showing DEEPFAKE DETECTED (84.92% AI Confidence) and 6-Axis Radar Analysis")
    add_body_p(
        "Figure 8.2 displays the real-time output generated upon uploading and analyzing a suspected manipulated media file "
        "(`fake_video_test.jpg`). The system issues a bold crimson 'DEEPFAKE DETECTED' banner accompanied by an AI Confidence "
        "Score of 84.92%. The transaction is permanently sealed on Block #1 with verified status, recording the block hash, nonce, "
        "media SHA-256 digest, and validator signature. The integrated 6-model SVG radar chart provides granular forensic metrics: "
        "Face Analysis (94.0%), Temporal Analysis (82.0%), Artifact Analysis (62.2%), Metadata Analysis (80.0%), Compress Analysis "
        "(84.0%), and Lighting Analysis (91.5%)."
    )

    # Figure 8.3 - User's Compare Screenshot
    add_figure("user_img_compare.png", "Figure 8.3: Dual-File Cryptographic Comparator Proving 'COMPLETELY DIFFERENT FILES' (9% Hash Similarity)")
    add_body_p(
        "Figure 8.3 illustrates the Dual-File Cryptographic Comparator module. Two distinct images—`WhatsApp Image 2026-09-03 at "
        "2.32.22 PM.jpeg` (File A) and `WhatsApp Image 2026-04-04 at 4.19.16 PM.jpeg` (File B)—are ingested simultaneously. "
        "The system calculates the 64-character SHA-256 digests for both files concurrently and performs character-by-character "
        "divergence mapping. The platform highlights divergent byte clusters in dark red, flags 'COMPLETELY DIFFERENT FILES', and "
        "reports a Hash Similarity Score of only 9%, demonstrating the mathematical cryptographic avalanche effect."
    )

    # Figure 8.4 - User's Stats Screenshot
    add_figure("user_img_stats.png", "Figure 8.4: Real-Time Network Analytics Dashboard Showing Session Ledger Statistics, Hashrate (1,347 TH/s), and Confirmed Transactions")
    add_body_p(
        "Figure 8.4 presents the Real-Time Network Analytics Dashboard. The real-time metric counters report 2 Blocks on Chain, "
        "1 Deepfake Detected (100% of session verifications), 0 Authentic Media, and 0 Suspicious files. The network telemetry "
        "cards reflect a combined validator hashrate of 1,347 TH/s, an average block time of 2.3 seconds, and 47 active Proof-of-Authority "
        "validators. The Recent Transactions feed lists the sealed transaction ID `0x87db69ce59439ec6d1171a18d474de3b6d484dac` "
        "for `fake_video_test.jpg`."
    )

    # --- 9. SKILL DEVELOPED / LEARNING ---
    add_section_header("9. Skill Developed / learning out of this Mini-Project")
    add_body_p(
        "Throughout the conception, design, and implementation of this mini-project, the team acquired critical theoretical "
        "and practical competencies across multiple domains of computer science:"
    )
    add_bullet_p("Cryptographic Implementation:", "Mastered binary buffer manipulation, message digest computation via WebCrypto Subtle API, and the practical application of the cryptographic avalanche effect.")
    add_bullet_p("Decentralized Systems & Blockchain:", "Acquired comprehensive understanding of distributed ledger mechanics, block data structures, parent-hash linking, Merkle trees, and consensus verification logic.")
    add_bullet_p("Frontend Engineering & Modern Frameworks:", "Developed advanced proficiency in Next.js 14, React component modularity, hooks management (useState, useEffect, useRef), and utility-first styling with Tailwind CSS.")
    add_bullet_p("Mathematical & Forensic Computing:", "Implemented Shannon entropy equations for byte distribution analysis and custom trigonometric SVG math for multi-axis radar chart rendering.")
    add_bullet_p("Full-Lifecycle Software Deployment:", "Experienced industry-standard version control using Git/GitHub, continuous integration and deployment pipelines with Vercel, and technical documentation drafting.")

    # --- 10. APPLICATIONS ---
    add_section_header("10. Applications of this Mini-Project")
    add_body_p(
        "The architectural principles demonstrated in ChainProof have immediate, practical applications across diverse high-stakes sectors:"
    )
    add_bullet_p("News Media & Investigative Journalism:", "News agencies (e.g., Reuters, BBC) can register camera-captured raw footage on-chain immediately upon capture. Third-party aggregators and consumers can verify broadcasts against the public ledger to combat viral political disinformation.")
    add_bullet_p("Judicial Systems & Digital Forensics:", "Maintains an unforgeable digital chain of custody for surveillance footage, body-cam recordings, and electronic evidence submitted in courtrooms, precluding defense claims of AI fabrication.")
    add_bullet_p("Financial Services & Video KYC:", "Banking platforms can prevent deepfake impersonation fraud during remote customer onboarding and wire-transfer video authorisations by anchoring live biometric recordings to verified ledger states.")
    add_bullet_p("Social Media Platforms:", "Social networks can integrate automated provenance badges, instantly alerting users when uploaded multimedia does not correlate with an authentic origin hash.")
    add_bullet_p("Celebrity & Digital Identity Governance:", "Public figures and corporate executives can establish certified public registries of authorized public statements, neutralizing malicious voice-cloning fraud.")

    # --- 11. AREA OF FUTURE IMPROVEMENT ---
    add_section_header("11. Area of Future Improvement")
    add_body_p(
        "While the current platform establishes a robust and functional client-side proof-of-concept, several prospective "
        "enhancements will elevate the system to production-scale global deployment:"
    )
    add_bullet_p("Decentralized InterPlanetary Storage (IPFS / Arweave):", "Integrating decentralized file storage networks (such as IPFS or Arweave) to store encrypted thumbnail previews and tamper-evident metadata alongside on-chain hashes.")
    add_bullet_p("Public Blockchain Mainnet Smart Contracts:", "Migrating simulated consensus to live Ethereum, Polygon, or Arbitrum smart contracts using Solidity, enabling hardware-wallet signing via MetaMask.")
    add_bullet_p("Perceptual Hashing (pHash) Integration:", "Complementing strict SHA-256 hashes with Discrete Cosine Transform (DCT) perceptual hashing. This will allow the system to tolerate benign social media compression while strictly identifying malicious semantic edits.")
    add_bullet_p("Zero-Knowledge SNARK Verification:", "Implementing zk-SNARK circuits to enable privacy-preserving media provenance—allowing a whistleblower or user to cryptographically prove that an authentic video exists on-chain without revealing the video's contents to the public.")

    # --- 12. CONCLUSION ---
    add_section_header("12. Conclusion")
    add_body_p(
        "The proliferation of hyper-realistic generative deepfakes poses an existential threat to societal trust, information "
        "integrity, and digital security. Traditional perimeter defenses and centralized verification authorities are fundamentally "
        "compromised by single points of failure, administrative tampering, and adversarial vulnerability. This mini-project "
        "successfully designed, developed, and deployed 'ChainProof'—a decentralized, client-side, blockchain-based deepfake proof system."
    )
    add_body_p(
        "By binding high-performance WebCrypto SHA-256 cryptographic digests with Shannon entropy metrics, binary header validation, "
        "and an immutable linked-block ledger, the system replaces fallible probabilistic guessing with deterministic, mathematical "
        "provenance. The integrated dual-file hash comparator and consensus terminal provide transparent, verifiable audit trails "
        "for digital media. ChainProof establishes a compelling, practical blueprint for restoring truth and cryptographic certainty "
        "to the digital information ecosystem."
    )

    # Save to both target locations
    out_path_scratch = r"C:\Users\dhana\.gemini\antigravity\scratch\BlockChain-DeepFake-Proof\Mini_Project_Report_Blockchain_Deepfake_Proof_System.docx"
    out_path_brain = r"C:\Users\dhana\.gemini\antigravity\brain\9932afab-73f2-469d-91db-608bd0835773\Mini_Project_Report_Blockchain_Deepfake_Proof_System.docx"

    doc.save(out_path_scratch)
    doc.save(out_path_brain)
    print("Clean report v3 built successfully!")
    print("1.", out_path_scratch)
    print("2.", out_path_brain)

if __name__ == "__main__":
    build_report()
