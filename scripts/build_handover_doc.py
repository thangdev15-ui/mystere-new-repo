from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


OUT = Path("output/Ban_giao_website_Mystere_Shop.docx")
LOGO = Path("public/images/mystere-logo.jpg")

RED = "9B2634"
INK = "24312E"
MUTED = "61706A"
CREAM = "F7F4EE"
LINE = "DDD8CE"


def set_font(run, name="Arial", size=None, color=None, bold=None, italic=None):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:ascii"), name)
    run._element.rPr.rFonts.set(qn("w:hAnsi"), name)
    if size is not None:
        run.font.size = Pt(size)
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=100, start=140, bottom=100, end=140):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for side, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{side}"))
        if node is None:
            node = OxmlElement(f"w:{side}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_table_widths(table, widths):
    table.autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl_pr = table._tbl.tblPr
    layout = tbl_pr.first_child_found_in("w:tblLayout")
    if layout is None:
        layout = OxmlElement("w:tblLayout")
        tbl_pr.append(layout)
    layout.set(qn("w:type"), "fixed")
    tbl_w = tbl_pr.first_child_found_in("w:tblW")
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(sum(widths)))
    tbl_w.set(qn("w:type"), "dxa")
    grid = table._tbl.tblGrid
    for col, width in zip(grid.gridCol_lst, widths):
        col.set(qn("w:w"), str(width))
    for row in table.rows:
        for cell, width in zip(row.cells, widths):
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:w"), str(width))
            tc_w.set(qn("w:type"), "dxa")
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def set_no_cell_borders(cell):
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        item = OxmlElement(f"w:{edge}")
        item.set(qn("w:val"), "nil")
        borders.append(item)
    tc_pr.append(borders)


def add_page_field(paragraph):
    run = paragraph.add_run()
    fld_char1 = OxmlElement("w:fldChar")
    fld_char1.set(qn("w:fldCharType"), "begin")
    instr_text = OxmlElement("w:instrText")
    instr_text.set(qn("xml:space"), "preserve")
    instr_text.text = " PAGE "
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "end")
    run._r.append(fld_char1)
    run._r.append(instr_text)
    run._r.append(fld_char2)


def add_rule(paragraph, color=RED):
    p_pr = paragraph._p.get_or_add_pPr()
    borders = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "12")
    bottom.set(qn("w:space"), "8")
    bottom.set(qn("w:color"), color)
    borders.append(bottom)
    p_pr.append(borders)


def text_para(doc, text="", style="Normal", after=None, before=None, bold_prefix=None):
    p = doc.add_paragraph(style=style)
    if before is not None:
        p.paragraph_format.space_before = Pt(before)
    if after is not None:
        p.paragraph_format.space_after = Pt(after)
    if bold_prefix and text.startswith(bold_prefix):
        r = p.add_run(bold_prefix)
        set_font(r, size=11, color=INK, bold=True)
        r = p.add_run(text[len(bold_prefix):])
        set_font(r, size=11, color=INK)
    else:
        r = p.add_run(text)
        set_font(r, size=11, color=INK)
    return p


def bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.25
    r = p.add_run(text)
    set_font(r, size=10.5, color=INK)
    return p


def heading(doc, text, level=1):
    p = doc.add_paragraph(style=f"Heading {level}")
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    set_font(r, size={1: 16, 2: 13, 3: 12}[level], color=RED if level < 3 else INK, bold=True)
    return p


def add_info_table(doc, rows):
    table = doc.add_table(rows=1, cols=2)
    table.style = "Table Grid"
    set_table_widths(table, [2700, 6660])
    header = table.rows[0].cells
    for cell, text in zip(header, ("Hạng mục", "Thông tin")):
        set_cell_shading(cell, RED)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        set_font(r, size=10, color="FFFFFF", bold=True)
    set_repeat_table_header(table.rows[0])
    for left, right in rows:
        cells = table.add_row().cells
        set_cell_shading(cells[0], CREAM)
        for cell, text, is_label in ((cells[0], left, True), (cells[1], right, False)):
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            set_font(r, size=10.5, color=INK, bold=is_label)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


def add_callout(doc, label, text):
    table = doc.add_table(rows=1, cols=1)
    set_table_widths(table, [9360])
    cell = table.cell(0, 0)
    set_cell_shading(cell, CREAM)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(label + "  ")
    set_font(r, size=10.5, color=RED, bold=True)
    r = p.add_run(text)
    set_font(r, size=10.5, color=INK)
    doc.add_paragraph().paragraph_format.space_after = Pt(1)


def configure_styles(doc):
    normal = doc.styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.25
    for level, size, before, after in ((1, 16, 18, 8), (2, 13, 14, 6), (3, 12, 10, 5)):
        style = doc.styles[f"Heading {level}"]
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor.from_string(RED if level < 3 else INK)
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True
    list_style = doc.styles["List Bullet"]
    list_style.font.name = "Arial"
    list_style.font.size = Pt(10.5)
    list_style.paragraph_format.left_indent = Inches(0.38)
    list_style.paragraph_format.first_line_indent = Inches(-0.19)


def main():
    OUT.parent.mkdir(exist_ok=True)
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.75)
    section.left_margin = Inches(0.85)
    section.right_margin = Inches(0.85)
    section.header_distance = Inches(0.35)
    section.footer_distance = Inches(0.35)
    configure_styles(doc)

    # Quiet running footer for the handover packet.
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p.add_run("Mystère Shop | Tài liệu bàn giao | Trang ")
    set_font(r, size=8.5, color=MUTED)
    add_page_field(p)

    # Cover: customer-pack pattern.
    cover = doc.add_paragraph()
    cover.paragraph_format.space_before = Pt(18)
    cover.paragraph_format.space_after = Pt(16)
    if LOGO.exists():
        cover.add_run().add_picture(str(LOGO), width=Inches(0.8))
    cover.alignment = WD_ALIGN_PARAGRAPH.LEFT
    kicker = doc.add_paragraph()
    kicker.paragraph_format.space_after = Pt(3)
    r = kicker.add_run("MYSTÈRE SHOP · HUYỀN BÍ")
    set_font(r, size=10, color=RED, bold=True)
    title = doc.add_paragraph()
    title.paragraph_format.space_after = Pt(6)
    r = title.add_run("TÀI LIỆU BÀN GIAO WEBSITE")
    set_font(r, size=26, color=INK, bold=True)
    subtitle = doc.add_paragraph()
    subtitle.paragraph_format.space_after = Pt(18)
    r = subtitle.add_run("Hướng dẫn quản trị nội dung, vận hành và bảo mật")
    set_font(r, size=13, color=MUTED)
    rule = doc.add_paragraph()
    add_rule(rule)
    meta = doc.add_table(rows=4, cols=2)
    set_table_widths(meta, [2100, 7260])
    for cell in meta.rows[0].cells:
        set_no_cell_borders(cell)
    for row in meta.rows:
        for cell in row.cells:
            set_no_cell_borders(cell)
    cover_rows = [
        ("Website", "https://www.mystereshop.com/"),
        ("Trang quản trị", "https://www.mystereshop.com/#/admin"),
        ("Phạm vi", "Website giới thiệu Mystère Shop và hệ thống CMS song ngữ"),
        ("Cập nhật", "25/10/2026"),
    ]
    for row, (label, value) in zip(meta.rows, cover_rows):
        for cell, text, bold in ((row.cells[0], label, True), (row.cells[1], value, False)):
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(4)
            r = p.add_run(text)
            set_font(r, size=10.5, color=INK, bold=bold)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    add_callout(doc, "LƯU Ý", "Mật khẩu, khóa dịch vụ và thông tin đăng nhập nhạy cảm không được ghi trong tài liệu này; bàn giao qua kênh riêng.")
    doc.add_page_break()

    heading(doc, "1. Tổng quan hệ thống")
    text_para(doc, "Website Mystère Shop có hai phần: website công khai dành cho khách truy cập và trang quản trị (CMS) dành cho đội ngũ cập nhật nội dung. Nội dung hỗ trợ tiếng Anh và tiếng Việt.")
    add_info_table(doc, [
        ("Website công khai", "https://www.mystereshop.com/ — giới thiệu thương hiệu, câu chuyện, dự án, cộng đồng, sự kiện, sản phẩm và liên hệ."),
        ("CMS", "https://www.mystereshop.com/#/admin — cập nhật nội dung website sau khi đăng nhập."),
        ("Dữ liệu", "Nội dung được lưu trên cơ sở dữ liệu dùng chung. Hình ảnh được tối ưu khi tải lên; nên dùng ảnh dưới 5 MB để thao tác ổn định."),
        ("Ngôn ngữ", "Mỗi trường có EN và VN. Cần cập nhật đủ cả hai nếu nội dung được hiển thị song ngữ."),
    ])

    heading(doc, "2. Tài khoản và quyền truy cập")
    text_para(doc, "Người nhận bàn giao cần lưu riêng các tài khoản vận hành và chỉ cấp quyền cho người thực sự phụ trách website.")
    add_info_table(doc, [
        ("Tài khoản CMS", "Đăng nhập tại trang quản trị. Tài khoản/mật khẩu được bàn giao riêng, không chia sẻ qua nhóm công khai."),
        ("Mã nguồn", "Kho mã nguồn GitHub do bên quản lý kỹ thuật bàn giao. Không xóa kho, khóa truy cập hoặc biến môi trường khi chưa có bản sao lưu."),
        ("Cơ sở dữ liệu", "Supabase lưu nội dung và tệp hình. Chỉ cấp quyền quản trị cho người phụ trách kỹ thuật."),
        ("Tên miền/hosting", "Kiểm tra quyền sở hữu tên miền và nền tảng triển khai đang dùng trước khi thay đổi DNS hoặc cấu hình xuất bản."),
    ])
    add_callout(doc, "KHUYẾN NGHỊ", "Bật xác thực hai bước (2FA) cho GitHub, Supabase, email quản trị và nền tảng hosting/tên miền.")

    heading(doc, "3. Cập nhật nội dung trong CMS")
    text_para(doc, "Quy trình chung: đăng nhập → chọn mục bên trái → chỉnh sửa EN/VN → kiểm tra ảnh và đường dẫn → chọn Save changes → mở View site để xem lại trên website.")
    bullet(doc, "NEW · Page content: nội dung trang chủ, phần giới thiệu và các khối nội dung tổng quan.")
    bullet(doc, "What we do · Project: dự án, trang chi tiết dự án, nội dung câu chuyện, ảnh chính, PDF tham khảo và ảnh gallery.")
    bullet(doc, "What we do · Communities: các thẻ cộng đồng; mục này độc lập với danh sách Project.")
    bullet(doc, "What we do · Events: sự kiện, ảnh, tiêu đề, ngày giờ, địa điểm và đường dẫn sự kiện.")
    bullet(doc, "Craft & Products · Topics: nhóm chủ đề/sản phẩm và nội dung bài viết liên quan.")
    bullet(doc, "Logo & Contact: logo, tagline chân trang, địa chỉ, điện thoại, WhatsApp/Zalo/Viber, email, bản đồ và mạng xã hội.")
    bullet(doc, "Newsletter và Settings: nội dung đăng ký nhận tin, trạng thái kết nối và xuất bản sao lưu JSON.")

    heading(doc, "4. Quy tắc nội dung và hình ảnh")
    add_callout(doc, "NỘI DUNG", "Nội dung đã được khách tự cập nhật trong CMS là bản chính thức. Không tự ý rút gọn, viết lại, đổi thứ tự đoạn hoặc xóa câu chữ nếu chưa có yêu cầu cụ thể.")
    bullet(doc, "Giữ đúng thứ tự ảnh trong gallery nếu câu chuyện cần trình bày theo trình tự.")
    bullet(doc, "Dùng ảnh rõ nét, có bản quyền/quyền sử dụng. Ưu tiên JPG/WebP, dung lượng dưới 5 MB.")
    bullet(doc, "Đặt tên tệp không dấu, không khoảng trắng và có ý nghĩa, ví dụ: live-project-cao-bang-01.webp.")
    bullet(doc, "Sau khi thay ảnh, xem cả giao diện desktop và điện thoại để kiểm tra vùng cắt ảnh, chú thích và độ rộng nội dung.")
    bullet(doc, "Với bài LIVE, ba ảnh hiện có chú thích hiển thị bên dưới: Red Dao & H’mong; Lolo; Money Dao.")

    heading(doc, "5. Kiểm tra trước khi xuất bản")
    text_para(doc, "Thực hiện các bước dưới đây với mọi thay đổi quan trọng, đặc biệt là bài dự án hoặc hình ảnh lớn.")
    numbered = [
        "Lưu thay đổi trong CMS và chờ thông báo lưu thành công.",
        "Mở View site, kiểm tra đúng trang vừa sửa ở cả English và Tiếng Việt.",
        "Kiểm tra liên kết: PDF, Google Maps, email, điện thoại, WhatsApp/Zalo/Viber và mạng xã hội.",
        "Dùng trình duyệt hoặc điện thoại kiểm tra giao diện hẹp: menu, logo, ảnh, tiêu đề và chân trang không bị tràn ngang.",
        "Mở website ở cửa sổ ẩn danh để chắc chắn không xem nhầm dữ liệu cache cũ.",
    ]
    for item in numbered:
        p = doc.add_paragraph(style="List Number")
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.25
        r = p.add_run(item)
        set_font(r, size=10.5, color=INK)

    heading(doc, "6. Sao lưu và an toàn")
    text_para(doc, "Website đã có xử lý để việc bộ nhớ trình duyệt đầy hoặc bị chặn không làm trang công khai trắng màn hình. Tuy vậy, dữ liệu và quyền truy cập vẫn cần được quản lý cẩn thận.")
    bullet(doc, "Định kỳ vào Settings → Export JSON và lưu bản sao có ngày tháng tại nơi an toàn.")
    bullet(doc, "Không gửi mật khẩu, khóa API hoặc tệp .env qua chat nhóm, ảnh chụp màn hình hoặc email không bảo mật.")
    bullet(doc, "Không dùng chung tài khoản quản trị. Khi nhân sự rời dự án, đổi mật khẩu và thu hồi quyền truy cập ngay.")
    bullet(doc, "Trước khi sửa dữ liệu hàng loạt, xuất JSON và chụp lại màn hình phần cần sửa để có điểm khôi phục.")
    bullet(doc, "Luôn cập nhật trình duyệt; chỉ đăng nhập CMS từ thiết bị tin cậy.")

    heading(doc, "7. Xử lý sự cố thường gặp")
    add_info_table(doc, [
        ("Trang chưa thấy thay đổi", "Tải lại cứng trang (Ctrl/Cmd + Shift + R), mở ẩn danh, rồi kiểm tra đã chọn Save changes trong CMS."),
        ("Ảnh không hiển thị", "Kiểm tra ảnh đã tải lên hoàn tất, dung lượng dưới 5 MB, kết nối mạng và trạng thái Published của bài/dự án."),
        ("Trang trên điện thoại hiển thị lạ", "Mở lại bằng ẩn danh, chụp màn hình kèm đường dẫn trang và model máy/trình duyệt để đội kỹ thuật kiểm tra."),
        ("Không đăng nhập được", "Kiểm tra email/tài khoản được cấp quyền; dùng chức năng quên mật khẩu hoặc liên hệ người giữ quyền Supabase/Auth."),
        ("Không lưu được", "Kiểm tra mạng. Nếu lỗi lặp lại, không đóng tab đang chỉnh sửa; sao chép nội dung ra tệp tạm và liên hệ kỹ thuật."),
    ])

    heading(doc, "8. Checklist bàn giao")
    checklist = [
        "Quyền quản trị CMS đã được cấp và kiểm tra đăng nhập.",
        "Quyền GitHub, Supabase, tên miền và hosting đã xác định người sở hữu.",
        "Đã bàn giao kênh liên hệ kỹ thuật và thông tin khôi phục tài khoản qua kênh riêng.",
        "Đã xuất một bản sao JSON đầu tiên và lưu an toàn.",
        "Khách hàng đã thử cập nhật một nội dung EN/VN, tải ảnh và kiểm tra View site.",
        "Khách hàng đã kiểm tra website trên điện thoại và máy tính.",
    ]
    for item in checklist:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.28)
        p.paragraph_format.first_line_indent = Inches(-0.28)
        p.paragraph_format.space_after = Pt(5)
        r = p.add_run("☐  " + item)
        set_font(r, size=10.5, color=INK)

    text_para(doc, "Ngày bàn giao: ____________________    Đại diện khách hàng: ____________________    Đại diện kỹ thuật: ____________________", after=0, before=16)

    props = doc.core_properties
    props.title = "Tài liệu bàn giao website Mystère Shop"
    props.subject = "Hướng dẫn vận hành CMS, cập nhật nội dung và bảo mật"
    props.author = "Mystère Shop"
    doc.save(OUT)
    print(OUT)


if __name__ == "__main__":
    main()
