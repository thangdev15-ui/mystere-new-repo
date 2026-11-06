from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent))
from build_handover_doc import (
    OUT as _IGNORE, LOGO, RED, INK, MUTED, CREAM,
    set_font, set_cell_shading, set_table_widths, set_repeat_table_header,
    set_no_cell_borders, add_page_field, add_rule, text_para, bullet,
    heading, add_callout, configure_styles,
)
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt, RGBColor


OUT = Path("output/Bao_cao_kiem_thu_production_Mystere_Shop_2026-10-25.docx")


def status_table(doc, rows):
    table = doc.add_table(rows=1, cols=3)
    table.style = "Table Grid"
    set_table_widths(table, [2430, 1350, 5580])
    for cell, text in zip(table.rows[0].cells, ("Hạng mục", "Kết quả", "Bằng chứng / phạm vi")):
        set_cell_shading(cell, RED)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        set_font(r, size=9.5, color="FFFFFF", bold=True)
    set_repeat_table_header(table.rows[0])
    for subject, status, evidence in rows:
        cells = table.add_row().cells
        color = "E9F1EB" if status == "ĐẠT" else "FFF1DE" if status == "CẦN XỬ LÝ" else "F1F0EC"
        set_cell_shading(cells[1], color)
        for cell, value, bold in ((cells[0], subject, True), (cells[1], status, True), (cells[2], evidence, False)):
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.15
            r = p.add_run(value)
            set_font(r, size=9.5, color=INK, bold=bold)
    doc.add_paragraph().paragraph_format.space_after = Pt(1)


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
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p.add_run("Mystère Shop | Báo cáo kiểm thử production | Trang ")
    set_font(r, size=8.5, color=MUTED)
    add_page_field(p)

    # Cover
    cover = doc.add_paragraph()
    cover.paragraph_format.space_before = Pt(18)
    cover.paragraph_format.space_after = Pt(16)
    if LOGO.exists():
        cover.add_run().add_picture(str(LOGO), width=Inches(0.8))
    kicker = doc.add_paragraph()
    kicker.paragraph_format.space_after = Pt(3)
    r = kicker.add_run("MYSTÈRE SHOP · HUYỀN BÍ")
    set_font(r, size=10, color=RED, bold=True)
    title = doc.add_paragraph()
    title.paragraph_format.space_after = Pt(6)
    r = title.add_run("BÁO CÁO KIỂM THỬ PRODUCTION")
    set_font(r, size=25, color=INK, bold=True)
    subtitle = doc.add_paragraph()
    subtitle.paragraph_format.space_after = Pt(18)
    r = subtitle.add_run("Website công khai, responsive mobile và hệ thống CMS")
    set_font(r, size=13, color=MUTED)
    rule = doc.add_paragraph()
    add_rule(rule)
    meta = doc.add_table(rows=4, cols=2)
    set_table_widths(meta, [2100, 7260])
    for row in meta.rows:
        for cell in row.cells:
            set_no_cell_borders(cell)
    for row, (label, value) in zip(meta.rows, [
        ("Website", "https://www.mystereshop.com/"),
        ("CMS", "https://www.mystereshop.com/#/admin"),
        ("Thời điểm", "25/10/2026 · Giờ Việt Nam"),
        ("Phạm vi", "Production, giao diện desktop/mobile và CMS với tài khoản được cấp"),
    ]):
        for cell, text, bold in ((row.cells[0], label, True), (row.cells[1], value, False)):
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(4)
            r = p.add_run(text)
            set_font(r, size=10.5, color=INK, bold=bold)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    add_callout(doc, "KẾT LUẬN", "CMS đã đăng nhập và đọc dữ liệu production được; website công khai không còn lỗi trắng màn hình trong các kiểm tra đã thực hiện. Newsletter hiện chưa phù hợp để thu thập dữ liệu production vì danh sách đăng ký chỉ lưu trong trình duyệt của người đang dùng.")
    doc.add_page_break()

    heading(doc, "1. Phạm vi và cách kiểm thử")
    text_para(doc, "Kiểm thử trực tiếp trên tên miền production, không dùng dữ liệu mẫu. Không chỉnh sửa, xóa hay lưu lại nội dung của khách trong CMS để tránh làm thay đổi bản nội dung chính thức.")
    bullet(doc, "Website công khai: trang chủ, About, Projects, Craft, hai trang chi tiết Project và các trang Craft liên quan.")
    bullet(doc, "Responsive: các bề rộng 320 px, 390 px, 430 px, 768 px và 1440 px; kiểm tra tràn ngang, màn hình trắng và khả năng hiển thị nội dung chính.")
    bullet(doc, "Mobile: menu, menu con, tìm kiếm, header/logo và ảnh trong bài LIVE.")
    bullet(doc, "CMS: đăng nhập bằng tài khoản admin được cấp, mở 9 phần quản trị, kiểm tra kết nối Supabase và mở editor dự án có trường ảnh.")
    add_callout(doc, "GIỚI HẠN", "Kiểm thử mobile thực hiện bằng giả lập Chrome iPhone 13. Chưa phải phép thử vật lý trên Safari/iPhone thật. Nút Save changes không được bấm vì cần bảo toàn nguyên trạng dữ liệu khách; do đó chưa thực hiện kiểm thử ghi/xóa dữ liệu production.")

    heading(doc, "2. Kết quả website công khai")
    status_table(doc, [
        ("Điều hướng công khai", "ĐẠT", "13 đường dẫn chính/trang chi tiết đã tải được, không có trang trắng trong kiểm thử."),
        ("Ảnh công khai", "ĐẠT", "Toàn bộ ảnh trên các trang kiểm thử tải thành công sau khi cuộn đến vùng lazy-load."),
        ("Lỗi trắng màn hình", "ĐẠT", "Không tái hiện lỗi khi tải trang production trên mobile mô phỏng. Cơ chế bảo vệ lỗi bộ nhớ trình duyệt đã có mặt trên production."),
        ("Menu & tìm kiếm mobile", "ĐẠT", "Menu, menu con và ô tìm kiếm mở được; tìm kiếm trả kết quả với từ khóa LIVE."),
        ("Responsive core pages", "ĐẠT", "Không có tràn ngang thực tế ở các bề rộng 320/390/430/768/1440 px trên trang chủ, About, Projects, LIVE, CraftBelt và Craft index."),
        ("Chú thích ảnh LIVE", "ĐẠT", "Đã hiển thị chú thích Red Dao & H’mong, Lolo và Money Dao dưới đúng ảnh."),
        ("Craft approved artwork", "LƯU Ý", "Một số trang Craft hiển thị nội dung bằng ảnh artwork toàn trang; đây là cách thiết kế hiện tại nên chữ trong ảnh không thể chỉnh riêng bằng CMS."),
    ])
    text_para(doc, "Ghi nhận kỹ thuật: có một cảnh báo console 404 xuất hiện một lần khi tải trang chủ. Kiểm tra network không tìm thấy yêu cầu ảnh/trang chính nào trả 404; website vẫn hiển thị bình thường. Nên theo dõi và truy vết thêm trong lần bảo trì kế tiếp.")

    heading(doc, "3. Kết quả CMS production")
    status_table(doc, [
        ("Tài khoản admin@mystere.com", "ĐẠT", "Đăng nhập thành công với thông tin đã được cấp cho kiểm thử."),
        ("Kết nối dữ liệu", "ĐẠT", "Mục Settings hiển thị trạng thái “Supabase connected”."),
        ("Các khu vực CMS", "ĐẠT", "Đã mở Dashboard, Page content, Projects, Communities, Events, Craft & Products, Newsletter, Logo & Contact và Settings."),
        ("Editor dự án", "ĐẠT", "Mở/đóng editor thành công; trường Image hiển thị trong editor."),
        ("Nút Save changes", "CHƯA GHI", "Nút hiển thị nhưng chưa bấm để không ghi đè hoặc làm thay đổi dữ liệu khách khi chưa có bản sao lưu/ủy quyền cho kiểm thử ghi."),
        ("Quên mật khẩu", "CẦN XỬ LÝ", "Hiện mở email mailto tới shop, chưa có quy trình reset mật khẩu tự động từ Supabase."),
        ("Đăng nhập Google", "CẦN XỬ LÝ", "Nút có hiển thị nhưng đang bị vô hiệu hóa do chưa cấu hình Google OAuth."),
    ])

    heading(doc, "4. Hạng mục cần xử lý trước khi dùng để vận hành đầy đủ")
    heading(doc, "4.1 Newsletter - ưu tiên cao", level=2)
    text_para(doc, "Form Newsletter hiện chỉ thêm người đăng ký vào bộ nhớ trình duyệt của khách truy cập. Dữ liệu không được gửi vào Supabase, không gửi email, và admin khác/thiết bị khác không xem được danh sách. Vì vậy không nên dùng form này để thu thập email khách hàng thật.")
    bullet(doc, "Cách xử lý khuyến nghị: tạo bảng subscribers trong Supabase, lưu đăng ký qua chính sách bảo mật phù hợp, và kết nối dịch vụ email như Resend, Brevo hoặc Mailchimp để có danh sách tập trung và gửi email hợp lệ.")
    heading(doc, "4.2 Khôi phục mật khẩu - ưu tiên trung bình", level=2)
    text_para(doc, "Thay liên kết mailto hiện tại bằng luồng “Quên mật khẩu” của Supabase để người quản trị có thể tự nhận email đặt lại mật khẩu.")
    heading(doc, "4.3 Lưu dữ liệu CMS - cần kiểm thử có kiểm soát", level=2)
    text_para(doc, "Kết nối Supabase đã đạt. Để xác nhận thao tác ghi dữ liệu end-to-end, cần xuất JSON sao lưu trước, sửa một trường thử nghiệm được phê duyệt, Save changes, kiểm tra website rồi phục hồi ngay. Kiểm thử này chưa làm vì nguyên tắc bảo toàn nội dung khách.")

    heading(doc, "5. Khuyến nghị vận hành")
    bullet(doc, "Đổi mật khẩu ban đầu của admin@mystere.com sau khi nhận bàn giao và bật 2FA cho Supabase, GitHub, email quản trị và hosting/tên miền.")
    bullet(doc, "Trước mỗi đợt cập nhật lớn: vào Settings → Export JSON để lưu bản sao dữ liệu có ngày tháng.")
    bullet(doc, "Sau khi cập nhật ảnh hoặc nội dung: kiểm tra English/Tiếng Việt, desktop và điện thoại; mở website ở cửa sổ ẩn danh để loại trừ cache cũ.")
    bullet(doc, "Không tự ý rút gọn, đổi thứ tự hoặc viết lại nội dung khách đã chỉnh trong CMS nếu không có yêu cầu bằng văn bản.")
    bullet(doc, "Mật khẩu không được lưu trong báo cáo, source code, ảnh chụp màn hình hay chat nhóm công khai.")

    heading(doc, "6. Tóm tắt trạng thái bàn giao")
    add_callout(doc, "SẴN SÀNG", "Website và CMS đã sẵn sàng cho việc xem, đăng nhập, duyệt dữ liệu và biên tập nội dung. Mobile core pages không có lỗi vỡ bố cục/trắng màn hình trong phạm vi kiểm thử.")
    add_callout(doc, "CHƯA ĐỦ", "Newsletter chưa phải hệ thống thu thập email production. Chức năng reset mật khẩu và Google OAuth chưa được cấu hình. Kiểm thử Save changes cần thực hiện với bản sao lưu và một thay đổi được phê duyệt.")

    props = doc.core_properties
    props.title = "Báo cáo kiểm thử production Mystère Shop"
    props.subject = "Kết quả kiểm tra website, mobile và CMS production"
    props.author = "Mystère Shop"
    doc.save(OUT)
    print(OUT)


if __name__ == "__main__":
    main()
