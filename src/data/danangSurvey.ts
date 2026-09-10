import { Survey } from '../types/survey';

export const DANANG_ENVIRONMENT_SURVEY_ID = 'survey-danang-environment-2026';

export const DANANG_ENVIRONMENT_SURVEY: Survey = {
  id: DANANG_ENVIRONMENT_SURVEY_ID,
  title: 'KHẢO SÁT NHẬN THỨC VÀ THỰC TRẠNG MÔI TRƯỜNG TẠI ĐÀ NẴNG',
  description: 'Mục đích: Khảo sát ý kiến của người dân về tình hình môi trường tại Đà Nẵng, các vấn đề môi trường đang được quan tâm và mức độ tham gia bảo vệ môi trường của cộng đồng.\nThời gian thực hiện: Khoảng 5–7 phút.\nLưu ý: Thông tin được thu thập nhằm phục vụ mục đích khảo sát và nghiên cứu. Vui lòng trả lời theo quan điểm và trải nghiệm thực tế của bạn.',
  status: 'published',
  version: 1,
  createdAt: '2026-09-03T00:00:00.000Z',
  updatedAt: '2026-09-03T00:00:00.000Z',
  questions: [
    // PHẦN 1. THÔNG TIN CHUNG
    {
      id: 'q1_khu_vuc',
      type: 'single_choice',
      title: 'Bạn đang sinh sống tại khu vực nào của Đà Nẵng?',
      description: 'PHẦN 1. THÔNG TIN CHUNG',
      required: true,
      order: 1,
      options: [
        { id: 'q1_1', label: 'Hải Châu', value: 'Hải Châu' },
        { id: 'q1_2', label: 'Thanh Khê', value: 'Thanh Khê' },
        { id: 'q1_3', label: 'Sơn Trà', value: 'Sơn Trà' },
        { id: 'q1_4', label: 'Ngũ Hành Sơn', value: 'Ngũ Hành Sơn' },
        { id: 'q1_5', label: 'Liên Chiểu', value: 'Liên Chiểu' },
        { id: 'q1_6', label: 'Cẩm Lệ', value: 'Cẩm Lệ' },
        { id: 'q1_7', label: 'Hòa Vang', value: 'Hòa Vang' },
        { id: 'q1_8', label: 'Hoàng Sa', value: 'Hoàng Sa' },
        { id: 'q1_9', label: 'Khác', value: 'Khác' }
      ]
    },
    {
      id: 'q2_do_tuoi',
      type: 'single_choice',
      title: 'Độ tuổi của bạn:',
      required: true,
      order: 2,
      options: [
        { id: 'q2_1', label: 'Dưới 18', value: 'Dưới 18' },
        { id: 'q2_2', label: '18–24', value: '18–24' },
        { id: 'q2_3', label: '25–34', value: '25–34' },
        { id: 'q2_4', label: '35–44', value: '35–44' },
        { id: 'q2_5', label: '45–54', value: '45–54' },
        { id: 'q2_6', label: '55 trở lên', value: '55 trở lên' }
      ]
    },
    {
      id: 'q3_nghe_nghiep',
      type: 'single_choice',
      title: 'Nghề nghiệp hiện tại:',
      required: true,
      order: 3,
      options: [
        { id: 'q3_1', label: 'Học sinh/Sinh viên', value: 'Học sinh/Sinh viên' },
        { id: 'q3_2', label: 'Nhân viên văn phòng', value: 'Nhân viên văn phòng' },
        { id: 'q3_3', label: 'Công chức/Viên chức', value: 'Công chức/Viên chức' },
        { id: 'q3_4', label: 'Kinh doanh', value: 'Kinh doanh' },
        { id: 'q3_5', label: 'Lao động tự do', value: 'Lao động tự do' },
        { id: 'q3_6', label: 'Nội trợ', value: 'Nội trợ' },
        { id: 'q3_7', label: 'Đã nghỉ hưu', value: 'Đã nghỉ hưu' },
        { id: 'q3_8', label: 'Khác', value: 'Khác' }
      ]
    },
    {
      id: 'q4_thoi_gian_song',
      type: 'single_choice',
      title: 'Bạn đã sinh sống hoặc làm việc tại Đà Nẵng bao lâu?',
      required: true,
      order: 4,
      options: [
        { id: 'q4_1', label: 'Dưới 1 năm', value: 'Dưới 1 năm' },
        { id: 'q4_2', label: '1–3 năm', value: '1–3 năm' },
        { id: 'q4_3', label: '3–5 năm', value: '3–5 năm' },
        { id: 'q4_4', label: '5–10 năm', value: '5–10 năm' },
        { id: 'q4_5', label: 'Trên 10 năm', value: 'Trên 10 năm' },
        { id: 'q4_6', label: 'Sinh ra và lớn lên tại Đà Nẵng', value: 'Sinh ra và lớn lên tại Đà Nẵng' }
      ]
    },

    // PHẦN 2. ĐÁNH GIÁ TÌNH HÌNH MÔI TRƯỜNG
    {
      id: 'q5_chat_luong_mt',
      type: 'single_choice',
      title: 'Theo bạn, chất lượng môi trường tại Đà Nẵng hiện nay như thế nào?',
      description: 'PHẦN 2. ĐÁNH GIÁ TÌNH HÌNH MÔI TRƯỜNG',
      required: true,
      order: 5,
      options: [
        { id: 'q5_1', label: 'Rất tốt', value: 'Rất tốt' },
        { id: 'q5_2', label: 'Tốt', value: 'Tốt' },
        { id: 'q5_3', label: 'Bình thường', value: 'Bình thường' },
        { id: 'q5_4', label: 'Kém', value: 'Kém' },
        { id: 'q5_5', label: 'Rất kém', value: 'Rất kém' }
      ]
    },
    {
      id: 'q6_van_de_quan_tam',
      type: 'multiple_choice',
      title: 'Theo bạn, những vấn đề môi trường nào đang đáng quan tâm nhất tại Đà Nẵng?',
      description: 'Có thể chọn nhiều đáp án',
      required: true,
      order: 6,
      options: [
        { id: 'q6_1', label: 'Rác thải sinh hoạt', value: 'Rác thải sinh hoạt' },
        { id: 'q6_2', label: 'Rác thải nhựa', value: 'Rác thải nhựa' },
        { id: 'q6_3', label: 'Ô nhiễm không khí', value: 'Ô nhiễm không khí' },
        { id: 'q6_4', label: 'Ô nhiễm nguồn nước', value: 'Ô nhiễm nguồn nước' },
        { id: 'q6_5', label: 'Ô nhiễm biển', value: 'Ô nhiễm biển' },
        { id: 'q6_6', label: 'Nước thải sinh hoạt', value: 'Nước thải sinh hoạt' },
        { id: 'q6_7', label: 'Nước thải từ hoạt động sản xuất, kinh doanh', value: 'Nước thải từ hoạt động sản xuất, kinh doanh' },
        { id: 'q6_8', label: 'Tiếng ồn', value: 'Tiếng ồn' },
        { id: 'q6_9', label: 'Ngập úng', value: 'Ngập úng' },
        { id: 'q6_10', label: 'Thiếu cây xanh', value: 'Thiếu cây xanh' },
        { id: 'q6_11', label: 'Bụi từ hoạt động xây dựng và giao thông', value: 'Bụi từ hoạt động xây dựng và giao thông' },
        { id: 'q6_12', label: 'Khác', value: 'Khác' }
      ]
    },
    {
      id: 'q7_muc_do_rac_thai',
      type: 'single_choice',
      title: 'Bạn đánh giá mức độ nghiêm trọng của vấn đề rác thải tại Đà Nẵng như thế nào?',
      required: true,
      order: 7,
      options: [
        { id: 'q7_1', label: 'Không nghiêm trọng', value: 'Không nghiêm trọng' },
        { id: 'q7_2', label: 'Ít nghiêm trọng', value: 'Ít nghiêm trọng' },
        { id: 'q7_3', label: 'Bình thường', value: 'Bình thường' },
        { id: 'q7_4', label: 'Nghiêm trọng', value: 'Nghiêm trọng' },
        { id: 'q7_5', label: 'Rất nghiêm trọng', value: 'Rất nghiêm trọng' }
      ]
    },
    {
      id: 'q8_vi_tri_rac_thai',
      type: 'multiple_choice',
      title: 'Bạn thường bắt gặp rác thải ở đâu?',
      description: 'Có thể chọn nhiều đáp án',
      required: true,
      order: 8,
      options: [
        { id: 'q8_1', label: 'Đường phố', value: 'Đường phố' },
        { id: 'q8_2', label: 'Vỉa hè', value: 'Vỉa hè' },
        { id: 'q8_3', label: 'Công viên', value: 'Công viên' },
        { id: 'q8_4', label: 'Bãi biển', value: 'Bãi biển' },
        { id: 'q8_5', label: 'Khu dân cư', value: 'Khu dân cư' },
        { id: 'q8_6', label: 'Chợ', value: 'Chợ' },
        { id: 'q8_7', label: 'Khu du lịch', value: 'Khu du lịch' },
        { id: 'q8_8', label: 'Sông, kênh, mương', value: 'Sông, kênh, mương' },
        { id: 'q8_9', label: 'Khu vực khác', value: 'Khu vực khác' }
      ]
    },
    {
      id: 'q9_o_nhiem_khong_khi',
      type: 'single_choice',
      title: 'Theo bạn, tình trạng ô nhiễm không khí tại Đà Nẵng hiện nay:',
      required: true,
      order: 9,
      options: [
        { id: 'q9_1', label: 'Không đáng kể', value: 'Không đáng kể' },
        { id: 'q9_2', label: 'Ít đáng kể', value: 'Ít đáng kể' },
        { id: 'q9_3', label: 'Trung bình', value: 'Trung bình' },
        { id: 'q9_4', label: 'Khá nghiêm trọng', value: 'Khá nghiêm trọng' },
        { id: 'q9_5', label: 'Rất nghiêm trọng', value: 'Rất nghiêm trọng' },
        { id: 'q9_6', label: 'Tôi không có đủ thông tin để đánh giá', value: 'Tôi không có đủ thông tin để đánh giá' }
      ]
    },
    {
      id: 'q10_nguon_nuoc',
      type: 'single_choice',
      title: 'Bạn cảm nhận chất lượng nguồn nước tại khu vực mình sinh sống như thế nào?',
      required: true,
      order: 10,
      options: [
        { id: 'q10_1', label: 'Rất tốt', value: 'Rất tốt' },
        { id: 'q10_2', label: 'Tốt', value: 'Tốt' },
        { id: 'q10_3', label: 'Bình thường', value: 'Bình thường' },
        { id: 'q10_4', label: 'Kém', value: 'Kém' },
        { id: 'q10_5', label: 'Rất kém', value: 'Rất kém' },
        { id: 'q10_6', label: 'Không biết/không có thông tin', value: 'Không biết/không có thông tin' }
      ]
    },
    {
      id: 'q11_mt_bien',
      type: 'single_choice',
      title: 'Theo bạn, môi trường biển và bãi biển tại Đà Nẵng hiện nay:',
      required: true,
      order: 11,
      options: [
        { id: 'q11_1', label: 'Rất sạch', value: 'Rất sạch' },
        { id: 'q11_2', label: 'Khá sạch', value: 'Khá sạch' },
        { id: 'q11_3', label: 'Bình thường', value: 'Bình thường' },
        { id: 'q11_4', label: 'Khá ô nhiễm', value: 'Khá ô nhiễm' },
        { id: 'q11_5', label: 'Rất ô nhiễm', value: 'Rất ô nhiễm' },
        { id: 'q11_6', label: 'Khó đánh giá', value: 'Khó đánh giá' }
      ]
    },

    // PHẦN 3. NHẬN THỨC VỀ BẢO VỆ MÔI TRƯỜNG
    {
      id: 'q12_muc_do_quan_tam',
      type: 'single_choice',
      title: 'Bạn đánh giá mức độ quan tâm của bản thân đối với các vấn đề môi trường như thế nào?',
      description: 'PHẦN 3. NHẬN THỨC VỀ BẢO VỆ MÔI TRƯỜNG',
      required: true,
      order: 12,
      options: [
        { id: 'q12_1', label: 'Rất quan tâm', value: 'Rất quan tâm' },
        { id: 'q12_2', label: 'Quan tâm', value: 'Quan tâm' },
        { id: 'q12_3', label: 'Bình thường', value: 'Bình thường' },
        { id: 'q12_4', label: 'Ít quan tâm', value: 'Ít quan tâm' },
        { id: 'q12_5', label: 'Không quan tâm', value: 'Không quan tâm' }
      ]
    },
    {
      id: 'q13_theo_doi_thong_tin',
      type: 'single_choice',
      title: 'Bạn có thường xuyên theo dõi thông tin về môi trường tại Đà Nẵng không?',
      required: true,
      order: 13,
      options: [
        { id: 'q13_1', label: 'Thường xuyên', value: 'Thường xuyên' },
        { id: 'q13_2', label: 'Khá thường xuyên', value: 'Khá thường xuyên' },
        { id: 'q13_3', label: 'Thỉnh thoảng', value: 'Thỉnh thoảng' },
        { id: 'q13_4', label: 'Hiếm khi', value: 'Hiếm khi' },
        { id: 'q13_5', label: 'Chưa bao giờ', value: 'Chưa bao giờ' }
      ]
    },
    {
      id: 'q14_nguon_nhan_tin',
      type: 'multiple_choice',
      title: 'Bạn thường nhận thông tin về môi trường từ đâu?',
      description: 'Có thể chọn nhiều đáp án',
      required: true,
      order: 14,
      options: [
        { id: 'q14_1', label: 'Facebook', value: 'Facebook' },
        { id: 'q14_2', label: 'TikTok', value: 'TikTok' },
        { id: 'q14_3', label: 'YouTube', value: 'YouTube' },
        { id: 'q14_4', label: 'Báo chí', value: 'Báo chí' },
        { id: 'q14_5', label: 'Truyền hình', value: 'Truyền hình' },
        { id: 'q14_6', label: 'Website của cơ quan nhà nước', value: 'Website của cơ quan nhà nước' },
        { id: 'q14_7', label: 'Trường học', value: 'Trường học' },
        { id: 'q14_8', label: 'Nơi làm việc', value: 'Nơi làm việc' },
        { id: 'q14_9', label: 'Người thân/bạn bè', value: 'Người thân/bạn bè' },
        { id: 'q14_10', label: 'Các tổ chức cộng đồng', value: 'Các tổ chức cộng đồng' },
        { id: 'q14_11', label: 'Khác', value: 'Khác' }
      ]
    },
    {
      id: 'q15_trach_nhiem',
      type: 'multiple_choice',
      title: 'Theo bạn, việc bảo vệ môi trường tại Đà Nẵng là trách nhiệm của ai?',
      description: 'Có thể chọn nhiều đáp án',
      required: true,
      order: 15,
      options: [
        { id: 'q15_1', label: 'Chính quyền địa phương', value: 'Chính quyền địa phương' },
        { id: 'q15_2', label: 'Doanh nghiệp', value: 'Doanh nghiệp' },
        { id: 'q15_3', label: 'Người dân', value: 'Người dân' },
        { id: 'q15_4', label: 'Khách du lịch', value: 'Khách du lịch' },
        { id: 'q15_5', label: 'Các tổ chức xã hội', value: 'Các tổ chức xã hội' },
        { id: 'q15_6', label: 'Trường học', value: 'Trường học' },
        { id: 'q15_7', label: 'Tất cả các bên', value: 'Tất cả các bên' }
      ]
    },

    // PHẦN 4. HÀNH VI BẢO VỆ MÔI TRƯỜNG
    {
      id: 'q16_phan_loai_rac',
      type: 'single_choice',
      title: 'Bạn có thường xuyên phân loại rác trước khi bỏ rác không?',
      description: 'PHẦN 4. HÀNH VI BẢO VỆ MÔI TRƯỜNG',
      required: true,
      order: 16,
      options: [
        { id: 'q16_1', label: 'Luôn luôn', value: 'Luôn luôn' },
        { id: 'q16_2', label: 'Thường xuyên', value: 'Thường xuyên' },
        { id: 'q16_3', label: 'Thỉnh thoảng', value: 'Thỉnh thoảng' },
        { id: 'q16_4', label: 'Hiếm khi', value: 'Hiếm khi' },
        { id: 'q16_5', label: 'Chưa bao giờ', value: 'Chưa bao giờ' }
      ]
    },
    {
      id: 'q17_giam_rac_nhua',
      type: 'multiple_choice',
      title: 'Bạn thường làm gì để giảm lượng rác thải nhựa của mình?',
      description: 'Có thể chọn nhiều đáp án',
      required: true,
      order: 17,
      options: [
        { id: 'q17_1', label: 'Sử dụng túi vải/túi tái sử dụng', value: 'Sử dụng túi vải/túi tái sử dụng' },
        { id: 'q17_2', label: 'Sử dụng bình nước cá nhân', value: 'Sử dụng bình nước cá nhân' },
        { id: 'q17_3', label: 'Hạn chế dùng ống hút nhựa', value: 'Hạn chế dùng ống hút nhựa' },
        { id: 'q17_4', label: 'Hạn chế mua đồ dùng nhựa dùng một lần', value: 'Hạn chế mua đồ dùng nhựa dùng một lần' },
        { id: 'q17_5', label: 'Tái sử dụng hộp/túi đựng', value: 'Tái sử dụng hộp/túi đựng' },
        { id: 'q17_6', label: 'Phân loại và tái chế rác', value: 'Phân loại và tái chế rác' },
        { id: 'q17_7', label: 'Chưa thực hiện', value: 'Chưa thực hiện' },
        { id: 'q17_8', label: 'Khác', value: 'Khác' }
      ]
    },
    {
      id: 'q18_tu_choi_nhua_1_lan',
      type: 'single_choice',
      title: 'Khi đi ăn uống hoặc mua hàng, bạn có chủ động từ chối đồ nhựa dùng một lần không?',
      required: true,
      order: 18,
      options: [
        { id: 'q18_1', label: 'Luôn luôn', value: 'Luôn luôn' },
        { id: 'q18_2', label: 'Thường xuyên', value: 'Thường xuyên' },
        { id: 'q18_3', label: 'Thỉnh thoảng', value: 'Thỉnh thoảng' },
        { id: 'q18_4', label: 'Hiếm khi', value: 'Hiếm khi' },
        { id: 'q18_5', label: 'Không bao giờ', value: 'Không bao giờ' }
      ]
    },
    {
      id: 'q19_tham_gia_hoat_dong',
      type: 'single_choice',
      title: 'Bạn có tham gia các hoạt động bảo vệ môi trường không?',
      required: true,
      order: 19,
      options: [
        { id: 'q19_1', label: 'Thường xuyên', value: 'Thường xuyên' },
        { id: 'q19_2', label: 'Thỉnh thoảng', value: 'Thỉnh thoảng' },
        { id: 'q19_3', label: 'Hiếm khi', value: 'Hiếm khi' },
        { id: 'q19_4', label: 'Chưa bao giờ', value: 'Chưa bao giờ' }
      ]
    },
    {
      id: 'q20_cac_hoat_dong_da_tham_gia',
      type: 'multiple_choice',
      title: 'Nếu có, bạn từng tham gia hoạt động nào?',
      description: 'Có thể chọn nhiều đáp án',
      required: false,
      order: 20,
      options: [
        { id: 'q20_1', label: 'Dọn rác tại bãi biển', value: 'Dọn rác tại bãi biển' },
        { id: 'q20_2', label: 'Trồng cây', value: 'Trồng cây' },
        { id: 'q20_3', label: 'Thu gom và phân loại rác', value: 'Thu gom và phân loại rác' },
        { id: 'q20_4', label: 'Hoạt động tái chế', value: 'Hoạt động tái chế' },
        { id: 'q20_5', label: 'Chiến dịch làm sạch khu dân cư', value: 'Chiến dịch làm sạch khu dân cư' },
        { id: 'q20_6', label: 'Hoạt động tuyên truyền môi trường', value: 'Hoạt động tuyên truyền môi trường' },
        { id: 'q20_7', label: 'Hoạt động khác', value: 'Hoạt động khác' }
      ]
    },

    // PHẦN 5. ĐÁNH GIÁ GIẢI PHÁP VÀ CHÍNH SÁCH
    {
      id: 'q21_danh_gia_chinh_quyen',
      type: 'single_choice',
      title: 'Theo bạn, chính quyền Đà Nẵng đang thực hiện công tác bảo vệ môi trường ở mức độ nào?',
      description: 'PHẦN 5. ĐÁNH GIÁ GIẢI PHÁP VÀ CHÍNH SÁCH',
      required: true,
      order: 21,
      options: [
        { id: 'q21_1', label: 'Rất tốt', value: 'Rất tốt' },
        { id: 'q21_2', label: 'Tốt', value: 'Tốt' },
        { id: 'q21_3', label: 'Khá', value: 'Khá' },
        { id: 'q21_4', label: 'Chưa tốt', value: 'Chưa tốt' },
        { id: 'q21_5', label: 'Rất chưa tốt', value: 'Rất chưa tốt' },
        { id: 'q21_6', label: 'Không biết', value: 'Không biết' }
      ]
    },
    {
      id: 'q22_giai_phap_uu_tien',
      type: 'multiple_choice',
      title: 'Theo bạn, giải pháp nào cần được ưu tiên nhất để cải thiện môi trường Đà Nẵng?',
      description: 'Chọn tối đa 3 đáp án',
      required: true,
      order: 22,
      options: [
        { id: 'q22_1', label: 'Tăng cường thu gom rác', value: 'Tăng cường thu gom rác' },
        { id: 'q22_2', label: 'Phân loại rác tại nguồn', value: 'Phân loại rác tại nguồn' },
        { id: 'q22_3', label: 'Giảm rác thải nhựa', value: 'Giảm rác thải nhựa' },
        { id: 'q22_4', label: 'Tăng diện tích cây xanh', value: 'Tăng diện tích cây xanh' },
        { id: 'q22_5', label: 'Kiểm soát khí thải phương tiện giao thông', value: 'Kiểm soát khí thải phương tiện giao thông' },
        { id: 'q22_6', label: 'Kiểm soát nước thải', value: 'Kiểm soát nước thải' },
        { id: 'q22_7', label: 'Tăng cường xử phạt hành vi xả rác', value: 'Tăng cường xử phạt hành vi xả rác' },
        { id: 'q22_8', label: 'Nâng cao ý thức người dân', value: 'Nâng cao ý thức người dân' },
        { id: 'q22_9', label: 'Tăng cường kiểm tra doanh nghiệp', value: 'Tăng cường kiểm tra doanh nghiệp' },
        { id: 'q22_10', label: 'Cải thiện hệ thống thoát nước', value: 'Cải thiện hệ thống thoát nước' },
        { id: 'q22_11', label: 'Phát triển giao thông công cộng', value: 'Phát triển giao thông công cộng' },
        { id: 'q22_12', label: 'Tăng cường các hoạt động tái chế', value: 'Tăng cường các hoạt động tái chế' },
        { id: 'q22_13', label: 'Khác', value: 'Khác' }
      ]
    },
    {
      id: 'q23_san_sang_thay_doi',
      type: 'single_choice',
      title: 'Bạn có sẵn sàng thay đổi một số thói quen cá nhân để góp phần bảo vệ môi trường không?',
      required: true,
      order: 23,
      options: [
        { id: 'q23_1', label: 'Rất sẵn sàng', value: 'Rất sẵn sàng' },
        { id: 'q23_2', label: 'Sẵn sàng', value: 'Sẵn sàng' },
        { id: 'q23_3', label: 'Còn tùy điều kiện', value: 'Còn tùy điều kiện' },
        { id: 'q23_4', label: 'Không muốn thay đổi', value: 'Không muốn thay đổi' },
        { id: 'q23_5', label: 'Hoàn toàn không', value: 'Hoàn toàn không' }
      ]
    },
    {
      id: 'q24_tro_ngai',
      type: 'multiple_choice',
      title: 'Điều gì khiến bạn khó thực hiện các hành vi bảo vệ môi trường?',
      description: 'Có thể chọn nhiều đáp án',
      required: true,
      order: 24,
      options: [
        { id: 'q24_1', label: 'Thiếu thùng rác/phân loại rác', value: 'Thiếu thùng rác/phân loại rác' },
        { id: 'q24_2', label: 'Thiếu thông tin', value: 'Thiếu thông tin' },
        { id: 'q24_3', label: 'Mất thời gian', value: 'Mất thời gian' },
        { id: 'q24_4', label: 'Bất tiện', value: 'Bất tiện' },
        { id: 'q24_5', label: 'Chi phí cao', value: 'Chi phí cao' },
        { id: 'q24_6', label: 'Những người xung quanh không thực hiện', value: 'Những người xung quanh không thực hiện' },
        { id: 'q24_7', label: 'Chưa thấy lợi ích rõ ràng', value: 'Chưa thấy lợi ích rõ ràng' },
        { id: 'q24_8', label: 'Thiếu chính sách hỗ trợ', value: 'Thiếu chính sách hỗ trợ' },
        { id: 'q24_9', label: 'Không có trở ngại', value: 'Không có trở ngại' },
        { id: 'q24_10', label: 'Khác', value: 'Khác' }
      ]
    },

    // PHẦN 6. Ý KIẾN CỦA NGƯỜI DÂN
    {
      id: 'q25_van_de_cap_thiet',
      type: 'long_text',
      title: 'Theo bạn, vấn đề môi trường nào tại Đà Nẵng cần được giải quyết cấp thiết nhất hiện nay?',
      description: 'PHẦN 6. Ý KIẾN CỦA NGƯỜI DÂN - Trả lời tự do',
      required: true,
      order: 25,
      placeholder: 'Nhập quan điểm của bạn về vấn đề cấp thiết nhất...'
    },
    {
      id: 'q26_de_xuat',
      type: 'long_text',
      title: 'Bạn có đề xuất gì để cải thiện môi trường và chất lượng sống tại Đà Nẵng?',
      description: 'Trả lời tự do',
      required: false,
      order: 26,
      placeholder: 'Nhập đề xuất, sáng kiến của bạn...'
    },
    {
      id: 'q27_san_sang_tham_gia',
      type: 'long_text',
      title: 'Nếu chính quyền hoặc cộng đồng tổ chức các hoạt động bảo vệ môi trường, bạn có sẵn sàng tham gia không? Vì sao?',
      description: 'Trả lời tự do',
      required: false,
      order: 27,
      placeholder: 'Chia sẻ lý do và mức độ sẵn sàng tham gia của bạn...'
    },

    // PHẦN 7. GHI NHẬN THỰC ĐỊA (FIELD SURVEY NATIVE)
    {
      id: 'q28_anh_hien_truong',
      type: 'image',
      title: 'Hình ảnh hiện trường (Camera thực tế):',
      description: 'PHẦN 7. GHI NHẬN THỰC ĐỊA - Chụp ảnh rác thải, khu vực ô nhiễm hoặc điểm cần cải tạo',
      required: false,
      order: 28
    },
    {
      id: 'q29_vi_tri_gps',
      type: 'location',
      title: 'Tọa độ GPS điểm khảo sát:',
      description: 'Lấy vị trí GPS vệ tinh chính xác tại thời điểm khảo sát thực địa',
      required: false,
      order: 29
    }
  ]
};
