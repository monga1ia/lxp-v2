// Language order is:
// 'MN', 'EN'
export const translations = (lang) => {
    if (lang) {
        switch (lang?.toLowerCase()) {
            case 'en':
                return {
                    action: {
                        addRow: 'Add row',
                        edit: 'Edit',
                        datatable_info: 'Showing _START_ to _END_ from _TOTAL_ results',
                        delete: 'Delete',
                        loading: 'Loading',
                        view: 'View',
                        publish: 'Publish',
                        recalculate: 'Recalculate',
                        recreate: 'Recreate',
                        register: 'Register',
                        search: 'Search...',
                        setInactive: 'Set inactive',
                        setActive: 'Set active',
                        typeHere: 'Type here',
                        post: 'Post',
                        emptyTable: 'Not found',
                        calculate: 'Calculate',
                    },
                    day: 'days',
                    lessons: 'lessons',
                    result: 'Result',
                    not_registered: 'Not registered',
                    addRole: 'Add a role',
                    days: 'Days',
                    not_published: 'Not published',
                    unPublish: 'Set inactive',
                    save_success: 'Successfully saved',
                    success: 'Successfully',
                    add: 'Add new',
                    add_school_relation: 'Connect the school',
                    add_student: 'Add student',
                    all: 'All',
                    amount: 'Amount',
                    answered: 'Answered',
                    answered_percent: 'Percent',
                    undo: 'Undo',
                    back: 'Back',
                    back_to_list: 'Back to list',
                    by_class: 'By class',
                    by_student: 'By student',
                    cancel: 'Cancel',
                    please_add_template: 'Please add template',
                    certificate: {
                        title: 'Certificate',
                        download: 'Download certificate'
                    },
                    datatable: {
                        columns: 'Columns'
                    },
                    delete: 'Delete',
                    ecourse: {
                        createTopic: 'Add new topic',
                        parentTopic: 'Parent topic',
                        selectSubject: 'Select course subject',
                        title: 'E-Learning',
                        topic_code: 'Topic code',
                        topic_name: 'Topic name',
                        topic_activity: 'Хичээлийн үйл ажиллагаа',
                        topic_description: 'Дүгнэлт',
                        topics: "Topics"
                    },
                    elearning_topic: 'Topic',
                    email: 'Email address',
                    chat: {
                        createNew: 'Write new chat',
                        markAllAsRead: 'Mark all as "READ"',
                        new: 'New chat',
                        offline: 'Offline',
                        online: 'Online',
                        select_chat_description: 'Please select user to start messaging',
                        sent_chat: 'sent image'
                    },
                    online_exam: {
                        title: 'Online exam',
                        search: 'Search',
                        connect_answers: 'Connect answer',
                    },
                    student_info_missing: 'Student information missing',
                    previous: 'Previous',
                    online_exam_eq_answer: 'Please insert your answer',
                    online_exam_text_answer: 'Please insert your answer text',
                    online_exam_select_value: 'Please select values from search section located in left side then you can see question registered.',
                    online_exam_edit_question: 'Edit question',
                    online_exam_delete_question: 'Delete question',
                    online_exam_delete_course: 'Delete',
                    online_exam_edit_course: 'Edit',
                    online_exam_back_to_list: 'Back to list',
                    online_exam_subject: 'Subject',
                    copy: 'Copy',
                    show_report: 'Show report',
                    download_report: 'Download report',
                    online_exam_question: 'Insert question',
                    online_exam_subTopic: 'Subtopic',
                    online_exam_select_subTopic: 'Select subtopic',
                    insert_only_photo: 'Please insert only photo.',
                    remove_connected_answer: 'Please disconnect related answer.',
                    select_right_answer: 'Please select right answer',
                    insert_answer_photo: 'Please insert answer photo',
                    incorrect: 'Incorrect',
                    fill_general_info: 'Please fill general information',
                    fill_answer_sheet: 'Please fill answer sheet',
                    do_inactive: 'Inactive',
                    score: 'Score',
                    clear: 'Clear',
                    question_type: 'Question type',
                    question_difficulty: 'Question difficulty',
                    select_subject: 'Select subject',
                    select_topic: 'Select topic',
                    select_question_difficulty: 'Select question difficulty',
                    select_question_type: 'Select question type',
                    select_connective_answer: 'Please select answer to connect.',
                    general_info: 'General information',
                    add_question: 'Add question',
                    insert_eq_question: 'Please insert answer.',
                    connect_answers: 'Connect answer',
                    connect: 'Connect',
                    detailed_info: 'Detailed information',
                    answer: 'Answer',
                    className: 'Class',
                    code: 'Code',
                    create: 'Create',
                    show_result: 'Show result',
                    photo: 'Photo',
                    studentCode: 'Student code',
                    studentLastName: 'Student lastname',
                    studentFirstName: 'Student firstname',
                    description: 'Description',
                    insert_description: 'Insert description',
                    create_question: 'Create question',
                    course_subject: 'Subject',
                    course_code: 'Course code',
                    course_name: 'Course name',
                    course_briefDescription: 'Brief description',
                    course_result: 'Result',
                    course_criteria: 'Criteria',
                    course_select_teacher: 'Select teacher',
                    course_select_topic: 'Select topic',
                    course_add_topic: 'Add topic',
                    course_type: 'Course Type',
                    course_select_courseType: 'Select type',
                    course_insert_course_code: 'Insert course code',
                    course_insert_course_name: 'Insert course name',
                    course_insert_text: 'Insert text',
                    course_next: 'Next',
                    course_confirm: 'Confirm',
                    course_general_info: 'General info',
                    course_lesson: 'Lesson',
                    course_examination_question: 'Examination question',
                    course_upload_video: 'Upload video',
                    course_video_lesson: 'Video lesson',
                    course_select_from_question_bank: 'Select from question bank',
                    course_select_question: 'Select question',
                    course_add_course: 'Add course',
                    course_edit_course: 'Edit course',
                    course_total_topic: 'Total topics',
                    course_blueprint: 'Blueprint',
                    course_course_name: 'Course name',
                    course_not_created_user: 'No right to edit!',
                    courseName: 'Course',
                    planned_time: 'Planned hours',
                    registered_time: 'Registered hours',
                    cameStudent: 'Came',
                    cameHours: 'Came hours',
                    busDashboardTitle: 'Bus dashboard',
                    config: 'Config',
                    busConfig: 'Bus config',
                    busDiscount: 'Bus discount',
                    busInvoice: 'Bus invoices',
                    busSale: 'Bus sale',
                    search: 'Search...',
                    send: 'Send',
                    empty: 'No record was found',
                    total: 'Total',
                    date: 'Date',
                    datePickerPlaceholder: 'Year-month-day',
                    chooseSeason: 'Choose term',
                    created_date: 'Created date',
                    transaction_date: 'Transaction date',
                    select_transaction_date: 'Select transaction date',
                    check_transaction_date: 'Check transaction date',
                    created_user: 'Created user',
                    registered: 'Registered',
                    close: 'Close',
                    status: 'Status',
                    view: 'View',
                    phoneNumber: 'Phone number',
                    insert_phoneNumber: 'Insert phone number',
                    students: 'Students',
                    last_name: 'Last name',
                    first_name: 'First name',
                    insert_last_name: 'Insert last name',
                    insert_first_name: 'Insert first name',
                    insert_price: 'Insert price',
                    edit: 'Edit',
                    approve: 'Approve',
                    approve_confirmation: 'Are you sure?',
                    delete_confirmation: 'Are you sure you want to delete it?',
                    delete_confirmation_description: 'Please note that one deleted information will not be restored!',
                    download_excel: 'Download excel',
                    role: 'Role',
                    select_role: 'Select role',
                    school: 'School',
                    school_code: 'School code',
                    select: 'Select',
                    pls_select: 'Select please',
                    gender: 'Gender',
                    select_gender: 'Select gender',
                    yes: 'Yes',
                    no: 'No',
                    print: 'Print',
                    receipt_print: 'Receipt print',
                    teacher_title: 'Teacher',
                    list: 'List',
                    excel: 'Excel',
                    period: 'Period',
                    decline: 'Decline',
                    grade: 'Grade',
                    total_score: 'Total score',
                    percent: 'Percent',
                    to_take: 'To take',
                    purpose: 'Purpose',
                    result_list: 'Result list',
                    total_taken_score: 'Total taken score',
                    add_new: 'Add new',
                    start_date: 'Start date',
                    end_date: 'End date',
                    name: 'Name',
                    excel_download: 'Download as Excel',
                    information: 'Information',
                    unpaid_amount: 'Unpaid amount',
                    insert_code: 'Insert code',
                    insert_name: 'Insert name',
                    insert_order: 'Insert order',
                    insert_pay_amount: 'Insert amount',
                    register_number: 'Registration number',
                    created_by: 'Created by',
                    main_information: 'Main information',
                    disable: 'Disable',
                    enable: 'Enable',
                    change_login_name: 'Change login name',
                    clear_login_name: 'Clear login name',
                    clear_login_name_description: 'Would you like to clear login name?',
                    clear_login_name_description_1: 'Нэвтрэх нэр хассан тохиолдолд тухайн нэвтрэх нэрийг ашиглан системд нэвтрэх боломжгүйг анхаарна уу',
                    type: 'Type',
                    insert_fields_correctly: 'Enter the data correctly',
                    paid_amount: 'Paid amount',
                    class_name: 'Class',
                    confirmation: 'Confirmation',
                    select_grade: 'Select grade',
                    score_type: 'Score type',
                    select_all: 'Select all',
                    published: 'Published',
                    subjects: 'Subjects',
                    classes: 'Classes',
                    saved: 'Saved',
                    save_and_exit: 'Save and exit',
                    bonus: 'Bonus',
                    average: 'Average',
                    max: 'Maximum',
                    min: 'Minimum',
                    start_time: 'Start time',
                    end_time: 'End time',
                    school_shift: 'Schedule',
                    insert_photo: 'Insert photo',
                    upload_photo_button_label: 'Click here to upload image',
                    click_here: 'Click here...',
                    crop: 'Crop',
                    discounted_students: 'discounted of students',
                    sequence: 'Sequence',
                    insert_sequence: 'Insert sequence',
                    address: 'Address',
                    mongolia: 'Mongolia',
                    english: 'English',
                    website: 'Website',
                    lat: 'Latitude',
                    lon: 'Longitude',
                    handDistance: 'Radius in metre',
                    handDistanceMin: 'Minimum value must be 100 metres',
                    logo: 'Logo',
                    logo_horizontal: 'Horizontal logo',
                    season: 'Term',
                    gpa: 'GPA',
                    checked: 'Checked',
                    time: 'Time',
                    change_time: 'Change time',
                    by_day: 'By day',
                    by_staff: 'By staff',
                    by_dashboard: 'By dashboard',
                    assessment: 'Assessment',
                    template: 'Template',
                    total_avg: 'Total average',
                    valid: 'Valid',
                    invalid: 'Invalid',
                    remove: 'Remove',
                    male: 'Male',
                    female: 'Female',
                    e_mail: 'E-Mail',
                    existing_phone_number: 'Using mobile number',
                    new_phone_number: 'New mobile number',
                    re_enter_phone_number: 'Repeat new mobile number',
                    re_open: 'Reopen',
                    password: 'Password',
                    new_password: 'New password',
                    re_enter_new_password: 'Re-enter new password',
                    readMore: 'Read more',
                    password_empty: 'Insert password please',
                    password_length_error: 'Password must have more than 4 characters',
                    password_re_enter_mismatch: 'Password and confirmation password do not match.',
                    phone_number_re_enter_mismatch: 'Phone number and confirmation phone number do not match.',
                    insert_file: 'Insert file(s)',
                    insert_video: 'Insert video',
                    comment_receive: 'Whether to receive comments',
                    enter_exam_score: 'Please enter exam scores',
                    error_crop_button: 'Please select the image area, then press crop button.',
                    excel_import: 'Excel import',
                    active: 'Active',
                    is_active: 'Active',
                    inactive: 'Inactive',
                    content_code: 'e-content code',
                    insert_content_code: 'Insert e-content code',
                    published_date: 'Published date',
                    manage_roles: 'Manage roles',
                    add_teacher_role: 'Add teacher role',
                    class_date: 'Class date',
                    change_password: 'Change password',
                    change_password_description: 'Please note that after you change password, old password cannot be used.',
                    change_login_name_description: 'Please note that after you change login name, old one will not work.',
                    weight: 'Weight',
                    height: 'Height',
                    required: 'Required or not',
                    remove_config: 'Remove config',
                    remove_config_description: 'Would you like to remove student from app usage expiration?',
                    meaning: 'Meaning',
                    value: 'Value',
                    insert_information: 'Insert information',
                    attendance: {
                        title: 'Attendance',
                        attendance_registration: 'Attendance record',
                        delete_description: 'Ирцийн мэдээг устгах гэж байна. Устгагдсан мэдээллийг сэргээх боломжгүйг анхаарна уу',
                        sent_attendance: 'Send attendance',
                        sent_attendance_confirm: 'Send attendance',
                        sent_time: 'Sent at',
                        season_config_title: 'Ирц бүртгэл - Улирлын тохиргоо',
                        attendance_report: 'Attendance report',
                        no_log_title: 'Ирц бүртгээгүй цаг',
                        came: 'Came',
                        excused: 'Excused',
                        unexcused: 'Unexcused',
                        sick: 'Sick',
                        late: 'Late',
                        not_sent: 'Not send attendance',
                        is_request: 'Sorry, you can not change the status of request which was approved. Only you change a new request status.',
                        checkable_description: 'Сурагчийн ирцийг сонгож илгээх',
                        unable_to_delete: 'Улирлын дүн гарсан тул ирцийн мэдээг устгах боломжгүй',
                        unable_to_log_date: 'Ирц бүртгэх боломжгүй өдөр байна',
                    },
                    class: {
                        title: 'Class',
                        girls: 'Girls',
                        grade: 'Grade',
                        boys: 'Boys',
                        report: 'Class report',
                        timetableEmpty: 'There is no timetable',
                    },
                    student: {
                        create_user: 'Record e-mail',
                        title: 'Student',
                        student_code: 'Student code',
                        last_name: 'Last name',
                        first_name: 'First name',
                        family_name: 'Family name',
                        esis_qr: 'ESIS QR code',
                        status: 'Status',
                        student_status: 'Student status',
                        current_class: 'Current class',
                        gender: 'Gender',
                        register_number: 'Registration number',
                        birth_date: 'Birthday',
                        entry_date: 'Entry date',
                        insert_photo: 'Insert photo',
                        book: 'Student book',
                        book_title: 'Student\'s personal case',
                        upload_button_label: 'Click here to upload image',
                        homework_report: 'Student homework report',
                        registration_undo: 'Recover student',
                        relation: 'Parents',
                        relation_type: 'Relation type',
                        usage_time: 'Used time',
                        last_login: 'Last sign in',
                        student_information: 'Student’s information',
                        relation_other: 'Other family members',
                        change_password: 'Change student\'s password',
                        health: 'Health indicators ',
                        address_type: 'Permenant or not',
                        birth_cert: 'Birth certificate number',
                        health_num: 'Health number',
                        phone_number: 'Student phone number',
                        userRoleNotFound: 'Student user role has not been set on your school. Please contact admin'
                    },
                    studentBookNavs: {
                        student_info: 'Student’s information',
                        address: 'Address',
                        contact: 'Contact',
                        health: 'Health',
                        relation: 'Relative',
                        personal_info: 'Personal information',
                        self_info: 'Personal information',
                        student_personal_info: 'Student’s pesonal information',
                        grade: 'Grade',
                        mid_test: 'Midterm test',
                        season_grade: 'End of term grades',
                        teacher_statement: 'Teacher description',
                        progress: 'Progress',
                        punishment: 'Punishment',
                        behavior: 'Behavior',
                        behavior_status: 'Behavior status',
                        attendance: 'attendance',
                        tuition: 'Tuition fee',
                        others: 'Others',
                        bus: 'Bus',
                        bus_title: 'Автобусаар зорчсон мэдээлэл',
                        food: 'Food',
                        food_title: 'Хоолонд орсон мэдээлэл',
                        skill_status: 'Skill evaluation'
                    },
                    studentBook: {
                        healthInsuranceNumber: 'Health ID',
                        birthCertNumber: 'Birth ID',
                        ethnicity: 'Nationality',
                        date: 'Date',
                        class_name: 'Class name',
                        lesson: 'Lesson',
                        rank: 'Rank',
                        max_point: 'Maximum point',
                        min_point: 'Minimum point',
                        average: 'Average',
                        season: 'Term',
                        test_name: 'Test name',
                        point_took: 'Your point',
                        show: 'Show',
                        relation: 'Your relation',
                        parent_name: 'Parent name',
                        name: 'Your name',
                        birth_day: 'Birth date',
                        gender: 'Gender',
                        phone: 'Phone number',
                        work_place: 'Work place',
                        work_role: 'Position',
                        live_with: 'Living together',
                        reason: 'Reason for saperation',
                        student_point: 'Student point',
                        student_score: 'Student score',
                        class_average: 'Class average',
                        read_more: 'Read more',
                        learn_more: 'Learn more',
                        skill_status: 'Skill status',
                        state: 'State',
                        pay_date: 'Payment due',
                        paid_date: 'Paid date',
                        type: 'Type',
                        payment_num: 'Invoice number',
                        payment_type: 'Invoice type',
                        pay: 'Payment amount',
                        paid: 'Paid amount',
                        paid_type: 'Paid type',
                        remain: 'Remain',
                        registered_date: 'Registered date',
                        uploaded_date: 'Uploaded date',
                        student_code: 'Student code',
                        class: 'Class',
                        e_barimt: 'E-Barimt',
                        hours: 'Hours',
                        attended_hours: 'Attendance',
                        late_hours: 'Late',
                        absent_hours: 'Absent',
                        sick_hours: 'Sick',
                        free_hours: 'Excused',
                        teacher: 'Teacher',
                        bus_service_info: 'Bus service information',
                        food_service_info: 'Food service information',
                        route: 'Route',
                        driver: 'Driver',
                        female: 'Female',
                        male: 'Male',
                        no_info: 'No information found',
                        email: 'E-mail address',
                        city: 'City',
                        home_phone: 'Home phone',
                        birth_place: 'Birthplace',
                        door: 'Door number',
                        town: 'Town',
                        street: 'Street',
                        building: 'Building',
                        studying: 'Studying',
                        graduated: 'Graduated',
                        remaining: 'remaining',
                        duration: 'Duration',
                        reasonNotLivingTogether: 'Reason',
                        place: 'Place',
                        seasonScore: 'Term total score',
                        activity: 'Activity, participation',
                    },
                    dashboardAttendence: {
                        excelByTime: 'Attendance dashboard - By time',
                        excelByClass: 'Attendance dashboard - By class',
                        excelByTeacher: 'Attendance dashboard - By teacher',
                        today: 'Today',
                        week: 'This week',
                        month: 'This month',
                        primaryClass: 'Primary school',
                        secondaryClass: 'Secondary school',
                        highClass: 'Highschool',
                        season: 'This term',
                        attended: 'Came',
                        absent: 'Unexcused',
                        late: 'Late',
                        sick: 'Sick',
                        excused: 'Excused',
                        student_hour: 'Student | hour',
                        class_attendance: 'Class Attendance',
                        attendance_info: 'Attendance',
                        info_sent: 'Attendence information sent',
                        hour: 'Hour',
                        all_class_num: 'Number of classes',
                        responded_class_num: 'Number of attendance record submission',
                        students: 'Students',
                        class: 'Class',
                        class_name: 'Class name',
                        with_class_name: 'Class name',
                        with_class: 'Class',
                        with_rank: 'Rank',
                        picture: 'Picture',
                        student_code: 'Student code',
                        last_name: 'Parent name',
                        student_name: 'Student name',
                        lesson: 'Lesson',
                        teacher: 'Teacher',
                        response: 'Sent',
                        response_time: 'Sent time',
                        no_response: 'Not sent',
                        info_sent_classes: ' of attendence information sent classes',
                        all_student_hours: 'Students | hours',
                        attended_student: 'Attended students',
                        absent_student: 'Absent students',
                        late_student: 'Late students',
                        sick_student: 'Sick students',
                        excused_student: 'Excused students',
                        class_student: 'Students',
                        all_club_num: 'Number of club',
                        responded_club_num: 'Number of clubs sent attendance',
                        club_name: 'Club name',
                    },
                    dashboardSeasonGrade: {
                        with_subject: 'Subject',
                        with_teacher: 'Teacher',
                        with_class: 'Class',
                        dashboard: 'Dashboard',
                        dashboard_season: 'Term grade dashboard',
                        teacher_dashboard: 'Teacher`s term grade dashboard',
                        class_dashboard: 'Class`s term grade dashboard',
                        dashboard_curr: 'Current grade dashboard',
                        teacher_dashboard_curr: 'Teacher`s current grade dashboard',
                        class_dashboard_curr: 'Class`s current grade dashboard',
                        dashboard_year: 'Final score dashboard',
                        teacher_dashboard_year: 'Teacher`s final score dashboard',
                        class_dashboard_year: 'Class`s final score dashboard',
                        total: 'Total',
                        test: 'Test'
                    },
                    finance: {
                        add_note: 'Add note',
                        invoice: 'Invoice',
                        invoice_empty: 'No invoices has found',
                        invoice_search: 'Search invoice',
                        select_all_student: 'All student',
                        select_invoice_type: 'Please, select invoice type',
                        total_student: 'Total students',
                        number_of_incomplete_students: 'Number of incomplete students',
                        dashboard: 'Dashboard',
                        ebarimt: 'E-barimt',
                        ebarimt_created_date: 'E-barimt created date',
                        ebarimt_lottery: 'E-barimt lottery number',
                        ebarimt_lottery_insert: 'Insert E-barimt lottery number',
                        ebarimt_register: 'Register e-barimt',
                        ebarimt_register_error: 'Error has occured while registering ebarimt lottery',
                        ebarimt_type: 'E-barimt type',
                        ebarimt_type_insert: 'Select E-barimt type',
                        ebarimt_type_citizen: 'Citizen',
                        ebarimt_type_organization: 'Organization',
                        ebarimt_type_organization_register: 'Registration number of organization',
                        ebarimt_type_organization_register_insert: 'Insert Registration number of organization',
                        tuition_payment: 'Payment',
                        billed: 'Invoice amount',
                        paid: 'Paid',
                        unpaid: 'Unpaid',
                        incomplete: 'Incomplete',
                        invoice_payment_title: 'payment',
                        read_more: 'Read more',
                        overpaid: 'Overpaid',
                        className: 'Class',
                        discount_amount: 'Discounted amount',
                        duedate_amount_error: 'Amount is not matching',
                        pay_amount: 'Amount',
                        unpaid_amount: 'Unpaid amount',
                        contact: 'Contact',
                        amount: 'Amount',
                        pay: 'Pay',
                        invalid: 'Invalid',
                        disable: 'Disable',
                        view: 'View',
                        create_invoice_type: 'Create invoice type',
                        please_create_invoice_type: 'Create invoice type',
                        select_class: 'Select class',
                        fixed_amount: 'Constant amount',
                        custom_amount: 'Inconstant amount',
                        create_invoice: 'Create invoice',
                        re_create: 'Create a re-invoice',
                        edit_invoice: 'Edit invoice',
                        invoice_type: 'Invoice type',
                        invoice_type_is_default: 'Does it belong to the school?',
                        invoice_type_vat_payer: 'VAT bill enabled?',
                        invoice_type_vat_code: 'Service code',
                        invoice_type_vat_code_description: 'Service code of VAT',
                        due_date: 'Due date',
                        due_date_expired: 'Due date expired',
                        due_date_upcoming: 'Upcoming due dates',
                        insert_due_date: 'Insert due date',
                        class: 'Class',
                        bank: 'Bank name',
                        select_bank: 'Select bank',
                        account_number: 'Account number',
                        account_holder: 'Account name',
                        select_all_students: 'Select all students',
                        disable_invoice_title: 'Are you sure you want to disable the invoice?',
                        disable_invoice_description: 'Please note that it will not possible to pay the disabled invoice.',
                        note: 'Note',
                        overPaymentDescription: "Would you like to submit over payment?",
                        paid_date: 'Paid date',
                        paid_method: 'Paid method',
                        discount: 'Discount',
                        payment_graph: 'Payment graph',
                        payment_history: 'Payment history',
                        payment_information: 'Payment information',
                        invoice_number: 'Invoice number',
                        invoice_name: 'Invoice name',
                        created_date: 'Created date',
                        created_user: 'Created user',
                        paid_amount: 'Paid amount',
                        delete_invoice_type_description: 'Are you sure to delete the invoice type. Please note that once you deleted you cannot undo.',
                        edit_invoice_type: 'Edit invoice type',
                        total_amount: 'Total amount',
                        total_payment: 'Total payment',
                        discount_type: 'Discount type',
                        discount_information: 'Discount information',
                        please_insert_discount_amount: 'Insert discount amount',
                        add_discount_type: 'Add discount type',
                        discount_percent: 'Discounted percent',
                        by_percent: 'By percentage',
                        by_amount: 'By amount',
                        discount_code: 'Discount code',
                        discount_name: 'Discount name',
                        edit_discount_type: 'Edit discount type',
                        delete_discount_type_description: 'Are you sure to delete the discount. Please note that once you deleted you cannot undo.',
                        pay_graph: 'Payment graph',
                        add_discount: 'Add discount',
                        amount_not_constant: 'Amount is not constant',
                        undo: 'Undo',
                        pay_amount_less_error: 'Amount is less than total invoice amount',
                        pay_amount_more_error: 'Amount is greater than total invoice amount',
                        due_date_amount_more_error: 'Amount is not matching duedate amount',
                        due_date_check_error: 'Please select more than one due date because amount is not matching duedate amount',
                        pay_amount_error: 'Amount can not be less than 0',
                        left_amount: 'Unpaid amount',
                        payments_graph: 'Payments graph',
                        billed_amount: 'Billed amount',
                        cash_back: 'Cash back',
                        cash_back_description: 'Are you sure you want to delete the record? Note that once deleted, it cannot be restored.',
                        already_day: 'The day has already chosen.',
                        charge: 'Charge',
                        currency: 'Currency',
                        role_expire: 'Expire role',
                        statement_rows: 'Row count',
                        statement_connected: 'Connected statements with invoices',
                        statement_invoices: 'Connected invoices',
                        statement_not_connected: 'Not connected statements',
                        statement_connect_to_invoice: 'Connect to invoice',
                        statement_amount_error: 'Paid amount must be equal with invoice payment amounts',
                        view_other_invoices: 'View other invoices of student'
                    },
                    financeIncomesTrans: {
                        title: 'Income',
                        cash: 'Cash',
                        bank_statement: 'Bank statement',
                        receipt_id: 'Receipt №',
                        receipt_number: 'Receipt number',
                        invoice_id: 'Invoice №',
                        invoice_number: 'Invoice number',
                        create_cash: 'Create cash',
                        amount: 'Amount',
                        insert_amount: 'Insert amount',
                        cash_receipt: 'Cash receipt',
                        cash_receiver: 'Cash receiver',
                        cash_payer: 'Cash payer',
                        cash_description: 'Cash description',
                        cash_paid_amount: 'Cash paid amount',
                        cash_paid_amount_letter: 'Cash paid amount letter',
                        cash_received: 'Cash received',
                    },
                    foodDashboardTitle: 'Food dashboard',
                    foodConfig: 'Food config',
                    foodDiscount: 'Food discount',
                    foodDiscountUndo: 'Undo the discount',
                    foodDiscountUndoDescription: 'Are you sure to undo the discount?',
                    foodInvoice: 'Food invoices',
                    foodInvoiceCreate: 'Create invoice',
                    foodSale: 'Food sale',
                    foodAddCategory: 'Add food category',
                    foodEditCategory: 'Edit food category',
                    foodShopProductName: 'Product name',
                    foodShopProductCode: 'Product code',
                    foodShopProductPrice: 'Price',
                    insertFoodQuantity: 'Insert quantity',
                    isInactive: 'Is inactive',
                    shop: 'Shop',
                    totalProduct: 'Amounts',
                    competence: {
                        title: 'Competence',
                        add_file: 'Add file',
                        edit_file: 'Edit file',
                        select_file: 'Select file',
                        file_list: 'File list',
                        file_name: 'File Name',
                        file: 'File',
                        exam_material: 'Exam material',
                        connected_type: 'Connected type',
                        show_material: 'Show material',
                        connected_by: 'Connected manually',
                        auto_connected: 'Connected automaticly',
                        not_connected: 'Haven`t connected',
                        other_schools: 'School exam material',
                        view_by_class: 'View by class',
                        view_by_student: 'View by student'
                    },
                    blueprint: {
                        title: 'Blueprint'
                    },
                    link: {
                        title: 'Online lesson',
                        add_link: 'Add link',
                        insert_link: 'Insert link',
                        link: 'Link',
                        error_link: 'Not match URL',
                    },
                    financeSearch: {
                        title: 'Search'
                    },
                    financeSearchStudentPortfolio: {
                        status: 'Status',
                        invoice_name: 'Invoice name',
                        billed: 'Invoice amount',
                        paid: 'Paid',
                        incomplete: 'Incomplete',
                        created_date: 'Created date',
                        created_user: 'Created user',
                        male: 'Male',
                        female: 'Female',
                        family_name: 'Family name',
                        last_name: 'Last name',
                        first_name: 'First name',
                        birth_date: 'Birthday',
                        gender: 'Gender',
                        registerNumber: 'Registration number',
                        entry_date: 'Entry date',
                        current_class_name: 'Current class name',
                        finance: 'Finance',
                        food: 'Food',
                        bus: 'Bus',
                    },
                    food: {
                        add: 'Add',
                        add_new: 'Add new',
                        pay_amount: 'Amount',
                        inactive: 'Inactive',
                        active: 'Active',
                        create_invoice_type: 'Create invoice type',
                        edit_invoice_type: 'Edit invoice type',
                        name: 'Name',
                        insert_name: 'Insert name',
                        bank: 'Bank',
                        choose_bank: 'Choose bank',
                        type: 'Type',
                        choose_type: 'Choose tye',
                        amount: 'Amount',
                        insert_amount: 'Insert amount',
                        check_time_config: 'Sale dates configuration?',
                        valid_date: 'Valid date',
                        inactive_invoice_type: 'Inactive invoice type',
                        show: 'Show',
                        paidAmount: 'Paid amount',
                        inactiveSelectedInvoice: 'Inactive the selected invoice',
                        correctDataError: 'Please correct the date',
                        insertInvoiceTypeName: 'Insert invoice type name',
                        pleaseSelectInvoice: 'Please select an invoice',
                        sale_quantity: 'Sale quantity',
                        teacher_staff: 'Teacher, staff',
                        recordDiscount: 'Record discount',
                        choose_class: 'Choose class',
                        select_student: 'Select student',
                        discountAmount: 'Discount amount',
                        selectUser: 'Select user',
                        insertAmount: 'Insert amount',
                        insertTeacher: 'Insert teacher, staff',
                        paid_method: 'Paid method',
                        paid_date: 'Paid date',
                        used_date: 'Used date',
                        used_amount: 'Used amount',
                        remaining: 'Remaining',
                        quantity: 'Quantity',
                        start_date: 'Start Date',
                        end_date: 'End date',
                        paid_history: 'Payment history',
                        discount: 'Discount',
                        history: 'History',
                        no_information: 'No information available!',
                        studentFinance: 'Student financial information',
                        delete: 'Delete',
                        edit_chef: 'Edit chef information',
                        food_price_edit: 'Food price edit',
                        chef: 'Chef',
                        add_chef: 'Add chef',
                        food_type_name: 'Food type name',
                        price: 'Price',
                        food_price: 'Food price',
                        create_menu: 'Create menu',
                        food_menu: 'Food menu',
                        food_name: 'Food name',
                        insert_food_name: 'Insert food name',
                        user_role: 'User role',
                        max_loan: 'Max loan',
                        loan_settings: 'Loan settings',
                        maximum: 'maximum',
                        image_size_error: 'The image is too large to upload and needs to be resize please. Image max size 1mb.',
                        image_type_error: 'Uploaded file is not a valid image. Only JPG, PNG and GIF files are allowed.',
                        item_type_has_repeatable: 'Can use multiple daily',
                        item_type_has_schedule: 'Has schedule',
                        start_time: 'Start time',
                        end_time: 'End time',
                        select_item_type: 'Select food item type',
                        by_day: 'By day',
                        by_product: 'By product',
                        product_quantity: 'Quantity',
                        add_another_item: 'Add another item',
                        description: 'Food description'
                    },
                    foodInvoiceCreate: 'Food invoice create',
                    foodDashboard: {
                        className: 'Class',
                        totalStudents: 'Students',
                        cameStudent: 'Came',
                        students_with_sale: 'have to',
                        students_food_used: 'had lunch',
                        students_food_used_loan: 'loan',
                        students_food_not_used: 'not had lunch',
                        eater: 'Had lunch',
                        loan_eat: 'Lunch for loan',
                        payment: 'Payment',
                        select_school_shift: 'Select schedule',
                        select_time: 'Select time',
                        by_class: 'By class',
                        by_class_title: 'By class',
                        by_student: 'By student',
                        paid: 'Paid',
                        incomplete: 'Incomplete',
                    },
                    foodDashboardModal: {
                        status: 'Status',
                        student_code: 'Student code',
                        lastname: 'Last name',
                        firstname: 'First name',
                    },
                    foodDashboardFoodUsedStudent: {
                        status: '',
                        used_date: 'Used date',
                        created_date: 'Created date',
                        created_user: 'Created user',
                        class_name: 'Class',
                        student_code: 'Student code',
                        last_name: 'Last name',
                        first_name: 'First name',
                        sale_status: 'Status',
                    },
                    groupDashboard: {
                        attendance: 'Club attendance',
                        attendanceReport: 'Time report',
                        title: 'Club dashboard',
                        teachers: 'Teachers',
                        code: 'Code',
                        lastName: 'Last name',
                        firstName: 'First name',
                        groupName: 'Group/Club',
                        totalStudents: 'Students',
                        perWeek: 'Per week',
                        className: 'Class',
                        totalStudentsNumber: 'Number of students that involved in club',
                        clubCount: 'Club',
                        sportCount: 'Sport',
                        students: 'Students',
                        leftStudentCount: 'Left students',
                        timetableCount: 'Number of hours in week'
                    },
                    groupDashboardModal: {
                        student_code: 'Student code',
                        last_name: 'Last name',
                        first_name: 'First name',
                        numbers: 'Numbers',
                        clubs: 'Clubs',
                        sports: 'Sports',
                    },
                    home: 'Home',
                    invalid_date: 'Invalid date',
                    roles: {
                        admin: "Admin",
                        parent: "Parents",
                        teachers_staffs: "Teachers & staffs",
                        title: 'Roles',
                    },
                    sale: {
                        action_username: 'Username',
                        charge: 'Charge',
                        create: 'Create sale',
                        currentBalance: 'Current balance',
                        inactiveContent: 'Would you like to disable sale?',
                        inactiveTitle: 'Disable sale',
                        loan: 'Loan',
                        loanCharge: 'Loan & charge',
                        logHistory: 'Sale status history',
                        recover: 'Recover sale',
                        payment: 'Payment',
                        sale_not_found: 'Sale not found',
                        title: 'Student sale',
                        type: 'Item type',
                        usedDate: 'Used date',
                        usedFoodDate: 'Хоолонд орсон огноо'
                    },
                    save: 'Save',
                    survey: {
                        edit: 'Edit survey',
                        title: 'Survey',
                        main_information: 'Main information',
                        questions: 'Questions',
                        question_description: 'Question description',
                        confirmation: 'Confirmation',
                        next: 'Next',
                        survey_code: 'Survey code',
                        survey_name: 'Survey name',
                        insert_code: 'Insert code',
                        insert_name: 'Insert name',
                        survey_class: 'Classes to take survey',
                        choose: 'Choose',
                        start_date: 'Start date/time',
                        select_time: 'Select time',
                        end_date: 'End date/time',
                        category: 'Category',
                        survey_purpose: 'Purpose of survey',
                        start: 'Start',
                        end: 'End',
                        classes: 'Classes',
                        add_survey_category: 'Add survey category',
                        parent_category: 'Translate',
                        delete_survey_category: 'Delete survey category',
                        edit_survey_category: 'Edit survey category',
                        survey_date: 'Survey date',
                        add_question: 'Add question',
                        answers: 'Answers',
                        question_type: 'Question type',
                        answer_required: 'Require answer',
                        allow_multiple_answers: 'Allow multiple answers',
                        insert_question: 'Insert question',
                        insert_question_description: 'Insert question description',
                        insert_answer: 'Insert answer',
                        add_more_question: 'Add more question',
                        change_order: 'Change order',
                        delete_question: 'Delete question',
                        select_question_type: 'Select question type',
                        delete_survey: 'Delete survey',
                        disable_survey: 'Inactivate survey',
                        disable_survey_confirmation: 'Are you sure to inactivate?',
                        disable_survey_confirmation_description: 'Please note that you can\'t see the inactivated survey result',
                        select_category: 'Select category',
                        survey_classes: 'Classes',
                        category_not_found: 'Category not found',
                        edit_questions: 'Edit questions',
                        excel_by_students: 'Excel by students',
                    },
                    foodDashboardFinanceModalStudents: {
                        status: 'status',
                        student_code: 'Student code',
                        last_name: 'Last name',
                        first_name: 'First name',
                        amount: 'Amount',
                        unpaid_amount: 'Unpaid amount',
                        paid_amount: 'Paid amount',
                        contactParent: 'Contact us',
                    },
                    busDashboard: {
                        in_count: 'in count',
                        out_count: 'out count',
                        today: 'Today',
                        week: 'Week',
                        payment: 'Payment',
                        route_info: 'Route information',
                        passengers_information: 'Passengers information',
                        total_student_by_bus: 'Total student information by bus',
                        route: 'Route',
                        search_by_code: 'Search by student code',
                        select_route: 'Select route',
                        select_class: 'Select class',
                        select_student: 'Select student',
                        total_students: 'Total students',
                        incomplete_students: 'Incomplete students',
                        overPayment: 'Overpayment',
                        by_route: 'By routes',
                        by_student: 'By students',
                        active: 'Active',
                        loan: 'Loan',
                        loan_config: 'Loan config',
                        no_sale: 'Not registered',
                        map: 'Map',
                        price: 'Price'
                    },
                    busDashboardToday: {
                        name: 'Route name',
                        in_count: 'Used students',
                        incomplete_students: 'Incomplete students',
                        loan_students: 'By loan',
                    },
                    busDashboardTodayModal: {
                        status: 'Status',
                        class_name: 'Class',
                        student_code: 'Student code',
                        last_name: 'Last name',
                        first_name: 'First name',
                        in: 'In',
                        out: 'Out',
                        registered_driver: 'Registered by',
                        route_direction: 'Route',
                    },
                    busDashboardWeekDirectionStudents: {
                        used_date: 'Used date',
                        driver_name: 'Driver',
                        status_sit: '',
                        direction: 'Stop',
                        class_name: 'Class',
                        student_code: 'Student code',
                        last_name: 'Last name',
                        first_name: 'First name',
                        unknown: 'Status 1',
                        unknown1: 'Status 2',
                    },
                    busDashboardWeekStudents: {
                        add: 'Add bus',
                        used_date: 'Used date',
                        status_sit: '',
                        direction: 'Stop',
                        station: 'Station',
                        driver_name: 'Driver',
                        insert_driver_name: 'Insert driver',
                        route: 'Route',
                        route_number: 'Route number',
                        route_name: 'Route name',
                        insert_route_number: 'Insert route number',
                        insert_route_name: 'Insert route name',
                        stop_count: 'Bus stop number',
                        checker: '',
                        add_driver: 'Add driver',
                        edit_driver: 'Edit a driver information',
                        remove_driver: 'Delete driver',
                        remove_driver_title: 'Are you sure you want to delete the driver?',
                        number: 'Bus number',
                        insert_number: 'Insert bus number',
                        add_route: 'Add route',
                        edit_route: 'Edit route',
                        delete_bus: 'Delete bus',
                        delete_route: 'Delete route',
                        delete_bus_title: 'Are you sure you want to delete the bus?',
                        delete_route_title: 'Are you sure you want to delete the route?'
                    },
                    busNoSale: {
                        title: 'No sale students',
                        used_quantity: 'Quantity',
                        created_loan: 'Create loan',
                        no_sale: 'No sale students',
                        total_amount: 'Total amount',
                    },
                    filesDt: {
                        subject: 'Subject',
                        file: 'File',
                        file_limit: 'Must be less than 25MB',
                        image_type_error: 'Uploaded file is not a valid file type. Only /png, x-png, jpg, jpeg, gif, docx, xlsx, pptx, wmv, mp4, mp3, mpeg/ files are allowed.',
                        image_type_video_error: 'Uploaded file is not a valid file type. Only /mp4, mpeg, avi, mov, wmv/ files are allowed.',
                        file_limit_with_video: 'Please note that the file size should not exceed 25mb and the video file size should not exceed 50mb.',
                        created_date: 'Created date',
                        created_user: 'Created user',
                        delete_button: 'Delete',
                    },
                    timetable: {
                        room: 'Room',
                        add_subject: 'Add subject',
                        choose_day: 'Please, select day',
                        select_class: 'Select class',
                        select_students: 'Select students',
                        select_subject: 'Select subject',
                        title: 'Timetable',
                        club_title: 'Club timetable',
                        subject: 'Subject',
                        teacher: 'Teacher',
                        score_weight: 'Weight',
                        get_previous_season_data: 'Import timetables from previous term',
                        monday: 'Monday',
                        tuesday: 'Tuesday',
                        wednesday: 'Wednesday',
                        thursday: 'Thursday',
                        friday: 'Friday',
                        add: 'Add timetable',
                        day: 'Day',
                        time: 'Time',
                        edit: 'Edit Timetable',
                        class_all_students: 'All students of class:',
                        group_student: 'Group student',
                        day_not_empty: 'Timetable had already registered on chosen day. Please edit on date to make changes',
                        time_not_empty: 'Time had already registered on chosen day',
                        empty_timetable: 'You have no timetable. You should visit "Timetable" menu and then insert your timetable.',
                        check_group_info: 'Group information is incomplete',
                        class_student: 'Class student',
                        download_last_season_timetable: 'Download timetables from previous term',
                        select_day: 'Select day!',
                        empty: 'Timetable is not created',
                    },
                    homework: {
                        assigned: 'Homework assign',
                        assign_date: 'Assign date',
                        checked_date: 'Checked date',
                        checked: 'Homework check',
                        checkedHomework: 'Checked HW',
                        title: 'Homework',
                        totalHomework: 'total homework',
                        date_description: 'Assignment marking date',
                        delete_homework_info: 'Delete information',
                        delete_homework: 'Would you like to delete homework?',
                        delete_homework_description: 'Please note that all related contents will be unable to recover after deleting homework.',
                        delete_student_homework: 'Delete student homework data',
                        delete_student_homework_description: 'Please note that it is not possible to restore the deleted information.',
                        score: 'Score',
                        file: 'File',
                        file_loading: 'Loading files',
                        insert_file: 'Insert file(s)',
                        select_file: 'Select file(s)',
                        no_file: 'No file(s) is attached',
                        not_found: 'Homework has not assigned yet',
                        file_warning_message: 'If score is changed, student score will be re-calculated!!!',
                        homework_assigned_already: 'Homework had already assigned on chosen date',
                        homework_check: 'Homework check',
                        homework: 'Homework',
                        homework_due_date: 'Homework due date',
                        homework_due_date_error: 'The date of homework which is being checked has to be today or in the past. Please check your date.',
                        homework_sent: 'Sent',
                        toDo: 'To do',
                        complete: 'Complete',
                        incomplete: 'Incomplete',
                        homework_not_sent: 'Not sent',
                        score_higher_that_max_score: 'score is higher than maximum score',
                        score_lower_that_max_score: 'score is lower than maximum score',
                        empty_score: 'score is empty, please insert score',
                        please_select_status: 'Please select the status of homework',
                        done: 'Done',
                        not_done: 'Didn`t do',
                        not_checked: 'Haven`t checked',
                        total_score_error: 'Score is higher than total score.',
                    },
                    homeworkReport: {
                        title: 'Homework report',
                        class_club: 'Class / Club',
                        subject: 'Subject',
                        season: 'Term',
                        homework: 'Homework',
                        notChecked: 'Not checked',
                        notCheckedShortName: 'NC',
                        insert_class_club: 'select Class / Club',
                        insert_subject: 'select subject',
                        insert_season: 'select term',
                        insert_score: 'Insert score',
                        score: 'Score',
                        takenScore: 'Taken score'
                    },
                    homeworkDashboard: {
                        title: 'Homework',
                        seasonText: 'Term',
                        dateText: 'Date',
                        showText: 'SHOW',
                        errorFields: 'Please select the following fields !!!',
                        by_class: 'By class',
                        by_subject: 'By subject',
                        by_teacher: 'By teacher',
                    },
                    homeworkDashboardDtClass: {
                        class_name: 'Class',
                        total: 'Total'
                    },
                    homeworkDashboardDtClassModal: {
                        due_date: 'Due date',
                        subject_name: 'Subject',
                        first_name: 'Teacher',
                        complete: 'complete',
                        incomplete: 'incomplete',
                        no_assignment: 'no_assignment',
                    },
                    homeworkDashboardDtTeacherModal: {
                        due_date: 'Due date',
                        subject_name: 'Subject',
                        class_name: 'Class',
                        complete: 'complete',
                        incomplete: 'incomplete',
                        no_assignment: 'no_assignment',
                    },
                    nfc: {
                        title: 'NFC records'
                    },
                    notification: {
                        unreadNotification: 'There is an unread [number] notification',
                        readAll: 'Make all read'
                    },
                    teacher: {
                        add_teacher: 'Add teacher',
                        timeTableCount: 'Timetable count',
                        title: 'Teacher',
                        working: 'Active',
                        not_working: 'Dismissed',
                        add: 'Add',
                        examGroupCount: 'Result group count',
                        photo: 'Photo',
                        lastname: 'Last name',
                        name: 'First name',
                        phone_number: 'Phone number',
                        code: 'Teacher code',
                        subjects: 'Subject',
                        subjectCount: 'Subject count',
                        teacher_class: 'Classroom',
                        list: 'Teachers',
                        login_name: 'Login name',
                        current_login_name: 'Current login name',
                        new_login_name: 'New login name',
                        new_login_name_repeat: 'Please type new login name again',
                        new_lastname: 'Last name',
                        new_lastname_placeholder: 'Type your last name',
                        new_name: 'Name',
                        new_name_placeholder: 'Type your first name',
                        note: 'Teacher notes',
                        insert_phone_number: 'Enter your mobile number',
                        insert_teacher_code: 'Enter teacher code',
                        insert_teacher_title: 'Enter teacher title',
                        teacher_title: 'Teacher title',
                        role: 'Role',
                        select_role: 'Select role',
                        view: 'View',
                        info_add: 'Teacher information add',
                        insert_info: 'Insert teacher information',
                        teacher_info: 'Teacher information',
                        excuse: 'Dismiss teacher',
                        excuseStaff: 'Dismiss employee',
                        gender: 'Gender',
                        select_gender: 'Select gender',
                        select_school: 'Select school',
                        role_teacher: 'Teacher',
                        role_director: 'Direction',
                        role_staff: 'Staff',
                        role_school_staff: 'School(s) staff',
                        role_manager: 'Manager',
                        role_lead_teacher: 'Lead teacher',
                        change_photo: 'Change photo',
                        set_teacher: 'Undo',
                        set_staff: 'Change status',
                        change_status: 'Change status',
                        change_status_staff: 'Change status',
                        set_teacher_button_label: 'UNDO',
                        edit: 'Edit',
                        select_school_grade: 'Select school grade',
                        change_phone_number_description: 'Please note that the mobile number now using can\'t be used again after you change the mobile number.',
                        change_login_name_description: 'Please note that after you changed login name, before login name will not work.',
                        change_login_name_description_staff: 'Please note that after you changed login name, before login name will not work.',
                        change_phone_number: 'Change the mobile number of a teacher',
                        change_login_name: 'Change the login name',
                        change_login_name_staff: 'Change the login name',
                        change_password: 'Change password',
                        change_password_staff: 'Change password',
                        change_password_description: 'Please note that after you change your teacher\'s password, the teacher will not be able to log in with the old password',
                        change_password_description_staff: 'Please note that after you change your user\'s password, the user will not be able to log in with the old password!',
                        manage_roles: 'Change user role',
                        staff_code: 'Staff code',
                        staff_card_title: 'Teacher, staff card',
                        journal: 'Journal',
                        journalNoteEmpty: 'Please select timetable to submit note',
                        journalExcelTemplate: 'Download template',
                        hw: 'Hw',
                        classThatWillTakeExam: 'Class',
                        onlineLesson: {
                            title: 'Online lesson',
                            createCourse: 'Create course',
                            createNewCourse: 'Create new course',
                            lesson: 'Lesson',
                            group: 'Subject groups',
                            collaboratingTeacher: 'Collaborating teacher',
                            activityName: 'Activity name',
                            enrollStudents: 'Enroll students',
                            inCourse: 'Currently in course',
                            toCourse: 'Jump to course',
                            editCourse: 'Edit course',
                            courseUrl: 'Course URL',
                            changeLink: 'Change link',
                            userCode: 'User code',
                            canEdit: 'Can edit',
                            addUser: 'Add user',
                            notFound: 'Online lesson not found',
                            purpose: 'Purpose',
                            conclusion: 'Conclusion',
                            learningObjectives: 'Learning objectives',
                        }
                    },
                    group: {
                        addClass: 'Add class',
                        addStudent: 'Add student',
                        approveStudents: 'Approve students',
                        title: 'Group',
                        type: 'Type',
                        class_teacher_title: 'Class teacher',
                        student_count: 'Number of students',
                        score_type: 'Score type',
                        classroom: 'Classroom',
                        school_shift: 'Schedule',
                        grade: 'Grade',
                        select_grade: 'Select grade',
                        code: 'Class code',
                        class_teacher: 'Class teacher',
                        list: 'List',
                        edit: 'Edit',
                        year: 'Year',
                        name: 'Class',
                        calendar: 'Class calendar',
                        teacher_list: 'Teacher list',
                        group_not_found: 'Group information not found',
                        addAgain: 'Create again',
                    },
                    subject: {
                        index: 'Index',
                        credit: 'Credit',
                        name: 'Subject name',
                        code: 'Subject code',
                        teacher: 'Subject teacher',
                        subject_class: 'Class',
                        title: 'Subject',
                        type: 'Type',
                        insert_index: 'Enter subject index',
                        insert_name: 'Enter subject name',
                        insert_teacher: 'Enter teacher',
                        list: 'Subjects list',
                        subject_type: 'Subject type',
                        grade: 'Grade',
                        close_button_label: 'CLOSE',
                        edit: 'Edit subject',
                        insert_credit: 'Enter credit',
                        select_subject_type: 'Select subject type',
                        select_teacher: 'Select teacher',
                        isAll: 'Only for class all students',
                        isResult: 'To calculate the grades',
                        courseActivities: 'Course activities'
                    },
                    student_card: {
                        title: 'Student card',
                        create: 'Create a student card',
                        grade: 'Grade',
                        class_title: 'Class',
                        select_all_students: 'Select all students',
                        close_button_label: 'CLOSE',
                        order: 'Order card',
                        print: 'Print student card(s)',
                        card_recreate: 'Inactive student card and create new student card?',
                        recreate: 'Re-create',
                        printed: 'Printed',
                        printed_date: 'Printed date',
                        print_description: 'Are you sure you want to print student card(s)?',
                        print_recreate_description: 'Following students have active student cards. Are you sure you want to disable current student cards and create new students cards? Please select the students if you are sure to disable and create new ones?',
                        connect_student: 'Connect student',
                    },
                    calendar: {
                        title: 'School calendar',
                        color: 'Color',
                        add_activity: 'Add event',
                        no_event: 'There is no event',
                        activity: 'Event',
                        activity_name: 'Event name',
                        start_end_date: 'Start and end date',
                        start_end_time: 'Start and end time',
                        is_full_day: 'All day?',
                        length: 'Duration',
                        description: 'Description',
                        today: 'Today',
                        view_event: 'View',
                        start_date: 'Start date',
                        end_date: 'End date',
                        edit_event: 'Edit',
                        month: 'Month',
                        week: 'Week',
                        day: 'Day',
                        list: 'List',
                        all_day: 'All day',
                        enter_event_name: 'Enter event name',
                        enter_start_date: 'Enter start date',
                        enter_end_date: 'Enter end date',
                        enter_start_time: 'Enter start time',
                        enter_end_time: 'Enter end time',
                        time_duplicate: 'Start and end time is same',
                    },
                    parents: {
                        confirmed: 'Confirmed',
                        total_parents: 'Total parents',
                        no_parent: 'Students whose guardians are not registered in the system',
                        parent_user_expired: 'Expired',
                        parentTotalTime: 'Total parent usage time',
                        close_button_label: 'CLOSE',
                        user_name: 'User name',
                        title: 'Parents',
                        settings: 'Parent settings',
                        pendingConfirmation: 'Confirmation pending'
                    },
                    movement: {
                        between_success: 'Student transfer has successfully made',
                        title: 'Movement',
                        out_title: 'Delist',
                        entry_date: 'Enrolled date',
                        in: 'Enrollment',
                        print_register_sheet: 'Print registration sheet',
                        register_sheet: 'Registration form',
                        register_sheet_description: 'Please print the registration sheet and give one copy to parents and another to financial officers.',
                        add_student: 'Add student',
                        add_one_student: 'Add',
                        add_multiple_students: 'Add multiple',
                        add: 'Add students',
                        force_movement: 'Student has not paid invoice/sale in the above. If you want to move student with debt, please check this option. Please leave a description about payment.',
                        from_school_name: 'From school',
                        insert_code: 'Insert code',
                        last_name: 'Last name',
                        out_action: 'Delist student',
                        out_success: 'Student has delisted successfully',
                        insert_last_name: 'Insert last name',
                        insert_first_name: 'Insert first name',
                        insert_register_number: 'Insert registration number',
                        birth_date: 'Birth date',
                        from_class: 'From',
                        to_class: 'To',
                        between: 'Internal transfer',
                        between_title: 'Internal transfer',
                        view: 'View',
                        between_new: 'Add',
                        select_student: 'Select student',
                        transfer: 'Transfer',
                        up: 'Moving up',
                        up_class: 'To',
                        up_class_title: 'To class',
                        up_date: 'Created date',
                        up_title: 'Next class',
                        up_user: 'Created user',
                        no_year: 'Next school year is not created',
                        no_classes_next_year: 'Classes had not created in next year',
                        to_class_title: 'To transfer class',
                        qr_1: '1. Please scan the QR and install eParent application',
                        qr_2: '2. Insert your information',
                        qr_3: '3. Add your child then you can see the information',
                    },
                    exam: {
                        title: 'Exam',
                        subject: 'Subject',
                        flow_exam: 'Exam',
                        season_exam: 'Final grade',
                        date: 'Taken date',
                        name: 'Exam name',
                        create: 'Create exam',
                        template_name: 'Template name',
                        season: 'Term',
                        seasonToPull: 'Term to pull',
                        report: 'Report',
                        list: 'Exam list',
                        students_progress: 'Students progress',
                        insert_score: 'Insert score',
                        full_score: 'Complete',
                        exam_regard: 'Comment',
                        ranking: 'Rank',
                        score_type: 'Score type',
                        max_average: 'Maximum average',
                        max_score: 'Maximum score',
                        min_average: 'Minimum average',
                        min_score: 'Minimum score',
                        notFound: 'There is no exam',
                        score: 'Grade',
                        exam_complete: 'Complete',
                        exam_incomplete: 'Incomplete',
                        exam_no_score: 'Not done',
                        exam_all_student_count_title: 'Ungraded',
                        exam_student_count_title: 'Graded',
                        calculate_generalization: 'Calculate report',
                        calculate_ranking: 'Calculate rank',
                        performance_percent: 'Percentage',
                        publish_description: 'Please note that it will not possible to edit or delete after published.',
                        publish_title: 'Please note that it will not possible to edit or delete after published.',
                        publish_title_season: 'Please note that it will not possible to edit or delete after published.',
                        publish_title_description: 'Only approved results will be shown to parents and class teacher.',
                        insert_exam_template_question: 'Enter question(s)',
                        insert_with_percentage: 'Insert score as percentage',
                        delete_student_score_title: 'Are you sure you want to delete student’s score?',
                        delete_student_score: 'Delete student’s score',
                        taken_score: 'Taken score',
                        exam_total_score: 'Total score',
                        score_empty: 'Insert score, please',
                        score_higher_that_max_score: 'score is higher than maximum score',
                        score_lower_that_max_score: 'score is lower than maximum score',
                        empty_score: 'score is empty, please insert score',
                        warning_message: 'If exam score is changed, student score will be re-calculated!!!',
                        average_success: 'Average success',
                        changePercentage: 'Change percentage',
                        changeScore: 'Change score',
                        yearType: 'Half year',
                        weightEmpty: 'Insert weight for exam',
                        weightError: 'Total weight must equals to 100 percent'
                    },
                    evaluation: {
                        title: 'Evaluation'
                    },
                    absent: {
                        attachmentView: 'See attachment',
                        title: 'Absent',
                        created_user: 'Created by',
                        period: 'Period',
                        request: 'Absence request',
                        select_type: 'Select absence type',
                        registration: 'Absence record',
                        view: 'View',
                        register: 'Register absence',
                        request_sender: 'Sender',
                        reason: 'Description',
                        start_date: 'Start',
                        end_date: 'End',
                        description: 'Description',
                        subject_name: 'Subject',
                        user: 'User',
                        sick: 'Sick',
                        excused: 'Excused',
                        excuseSettingUser: 'Acceptance user',
                        excuseSettings: 'Excuse settings',
                        excuseSettingsCreate: 'Add excuse settings',
                        excuseSettingsEdit: 'Edit excuse settings',
                        excuseMinDay: 'min day(s)',
                        excuseMaxDay: 'max day(s)',
                        day: 'Day',
                        time: 'Time',
                        response: 'Reply',
                        decline: 'Decline',
                        approve: 'Approve',
                        select_class: 'Select class',
                        select_student: 'Select student',
                        select_subject: 'Select subject',
                        select_start_date: 'Select start date',
                        select_end_date: 'Select end date',
                        select_day: 'Select day',
                        select_reason: 'Select term',
                        dateError: 'End date must be later than start date',
                        notResponded: 'Not responded',
                        requestDate: 'Request date',
                        respondedUser: 'Responded user',
                    },
                    exam_template: {
                        question_number: 'Question №',
                        answer: 'Answer',
                        title: 'Exam template',
                        select: 'Select exam template',
                        code: 'Template code',
                        name: 'Template name',
                        exam_type: 'Exam type',
                        subject: 'Subject',
                        created_date: 'Created date',
                        created_user: 'Created by',
                        disable: 'Disable',
                        answer_disable: 'Answer disable',
                        view: 'View',
                        question: 'Question',
                        question_score: 'Question score',
                        number: 'Number',
                        insert_number: 'Insert number',
                        create_question_please: 'Асуулт ',
                        total_score: 'Total score',
                        only_me: 'Only for me',
                        not_only_me: 'All use',
                        confirmation: 'Publish',
                        task: 'Task',
                        score: 'Score',
                        insert_score: 'Insert score',
                        subject_category: 'Subject category',
                        category: 'Category',
                        select_category: 'Select category',
                        total_question: 'Total questions',
                        insert_code: 'Insert code',
                        insert_name: 'Insert name',
                        choose_template_name: 'Choose template name',
                        choose_exam_type: 'Choose exam type',
                        select_subject: 'Select subject',
                        select_exam_type: 'Select exam type',
                        exam_complete: 'Complete',
                        exam_incomplete: 'Incomplete',
                        exam_no_score: 'Not done'
                    },
                    omr_exam_template: {
                        title: 'Omr exam template',
                        file: 'Omr exam file name',
                        insert_file: 'Insert file name',
                        please_select: 'Please select exam template',
                        empty: 'empty',
                        subject_group: 'Subject group'
                    },
                    omr_exam: {
                        title: 'Omr exam'
                    },
                    season_score: {
                        calculate: 'Calculate',
                        calculated_exam_count: 'Published subject count',
                        title: 'Result',
                        total_subject_count: 'Total subject count',
                        subject_count: 'Subject count',
                        report: 'Report',
                        list: 'Exam list',
                        flow_season_score: 'End of term grades',
                        students_progress: 'Students progress',
                        student_progress: 'Student\'s progress',
                        board: 'Scoreboard',
                        board_unpublish_description: 'Would you like to unpublish selected score board?',
                        season: 'Term',
                        performance: 'Average',
                        quality: 'Percentage of above 80%',
                        success: 'Percentage of above 60%',
                        student_count: 'Number of students',
                        published_date: 'Published date',
                        method: 'Method',
                        total_average: 'Total average',
                        subject: 'Subject',
                        disable: 'Unpublish',
                        view: 'View',
                        create_class_board: 'Create',
                        published: 'Published term scores',
                        publish_description: 'Term score sheet will be unable to edit or delete after publish',
                        select_class: 'Select class',
                        select_season: 'Select term',
                        select_method: 'Select method',
                        score_template: 'Score template',
                        select_score_template: 'Select score template',
                        skill: 'Skill template',
                        total_credit: 'Total credit',
                        chooseExam: 'Choose exam',
                        examChoice: {
                            title: 'Улирлын дүнд нөлөөлөх шалгалтуудаа сонгоно уу.',
                            description: 'Таны сонгосон үнэлгээний бүтцэд шалгалтын дүн нөлөөлнө гэж тохируулсан байна.',
                        },
                        skillChoice: {
                            title: 'Улирлын дүнд нөлөөлөх үнэлгээ сонгоно уу.',
                            description: 'Таны сонгосон үнэлгээний бүтцэд ур чадварын үнэлгээ нөлөөлнө гэж тохируулсан байна.',
                        },
                        chooseOne: 'Select at least one exam'
                    },
                    school_settings: {
                        attendanceType: 'Attendance type',
                        attendanceTypeConfig: 'Attendance config',
                        attendanceTypeDescription: 'Attendance type',
                        attendanceTypeFullDescription: 'Ирцийн төлөвт оруулсан оноо нь дүн гаргах үед татагдах ирцийн оноонд нөлөөлөхийг анхаарна уу',
                        attendanceTypeScore: 'Type score',
                        capacity: 'Seat',
                        capacity_number: 'Seat number',
                        detention: 'Detention',
                        relationHasConfirmation: 'Class teacher must approve student relations',
                        room_number: 'Room number',
                        register_room: 'Add room',
                        parent: 'Belong to',
                        title: 'School setting',
                        group_type: 'Group type',
                        year: 'Year',
                        previous_year: 'Previous year',
                        current_year: 'Current year',
                        previous_season: 'Previous season',
                        parent_season: 'Parent season',
                        parent_year: 'Parent year',
                        add_year: 'Add year',
                        insert_code: 'Insert code',
                        insert_name: 'Insert name',
                        is_current_season: 'Is current term',
                        is_timetable: 'Used in timetable',
                        is_exam: 'Used in exam',
                        is_result: 'Used in grade',
                        edit_year: 'Edit year',
                        delete_season: 'Delete term',
                        delete_season_description: 'Term is about to be deleted, Please note that it is not possible to restore the deleted information.',
                        group_setting: 'Settings',
                        group_type_setting: 'Group type',
                        group_type_add: 'Add',
                        insert_current_year: 'Select parent year',
                        group_type_edit: 'Edit',
                        group_setting_add: 'Settings',
                        subject_type: 'Subject type',
                        insert_subject_type: 'Insert subject type',
                        select_group_type: 'Select the setting',
                        score_template: 'Score template',
                        score_template_edit: 'Edit score template',
                        score_template_add: 'Add score template',
                        view: 'View',
                        is_ranked: 'Calculate the rank',
                        requirement: 'Indicators',
                        is_editable: 'Is editable',
                        weight: 'Weight',
                        location: 'School location',
                        manager: 'Manager settings',
                        master_data: 'Master data',
                        maxScore: 'Max score',
                        minScore: 'Min score',
                        ordering: 'Order',
                        score_template_delete_description: 'Are you sure to delete the score template. Please note that once you deleted you cannot undo.',
                        score_template_disable_title: 'Are you sure to deactivate the score template?',
                        score_template_disable_description: 'Please note that once you deactivated the score template you cannot use it',
                        school_shift: 'Schedule',
                        delete_school_shift: 'Delete schedule',
                        delete_school_shift_description: 'School shift is about to be deleted. Please note that it is not possible to restore the deleted information.',
                        add_school_shift: 'Add schedule',
                        edit_school_shift: 'Edit schedule',
                        school_logo: 'School logo',
                        delete_school_logo: 'Delete school logo',
                        delete_school_logo_description: 'School logo is about to be deleted. Please note that it is not possible to restore the deleted information.',
                        class_type: 'Class type',
                        add_class_type: 'Add class type',
                        edit_class_type: 'Edit class type',
                        delete_class_type: 'Delete class type',
                        delete_class_type_description: 'Class type is about to be deleted. Please note that it is not possible to restore the deleted information.',
                        bell_schedule: 'Timetable',
                        add_bell_schedule: 'Add schedule of bell',
                        edit_bell_schedule: 'Edit schedule of bell',
                        delete_bell_schedule: 'Delete schedule of bell',
                        delete_bell_schedule_description: 'Schedule of bell is about to be deleted. Please note that it is not possible to restore the deleted information.',
                        add_score_type: 'Add score type',
                        edit_score_type: 'Edit score type',
                        delete_score_type: 'Delete score type',
                        delete_score_type_description: 'Score type is about to be deleted. Please note that it is not possible to restore the deleted information.',
                        add_subject_type: 'Add subject type',
                        edit_subject_type: 'Edit subject type',
                        delete_subject_type: 'Delete subject type',
                        delete_subject_type_description: 'Subject type is about to be deleted. Please note that it is not possible to restore the deleted information.',
                        add_exam_type: 'Add exam type',
                        edit_exam_type: 'Edit exam type',
                        delete_exam_type: 'Delete exam type',
                        delete_exam_type_description: 'Exam type is about to be deleted. Please note that it is not possible to restore the deleted information.',
                        short_name: 'Short name',
                        long_name: 'Long name',
                        add_class_grade: 'Add class grade',
                        edit_class_grade: 'Edit class grade',
                        edit_class: 'Edit class',
                        add_class: 'Add class',
                        select_prev_season_class: 'Please select previous term class',
                        prev_season_class: 'Previous term class',
                        current_class: 'Current class',
                        select_current_class: 'Please select current class',
                        delete_class: 'Delete class',
                        delete_class_description: 'Class is about to be deleted. Please note that it is not possible to restore the deleted information.',
                        is_class: 'All students will be participate',
                        include_exam_type: 'Include to exam type',
                        abbreviation: 'Abbreviation',
                        view_score_type: 'View score type',
                        min_score_short: 'Min',
                        max_score_short: 'Max',
                        is_club: 'Дугуйлан эсэх',
                        logout_to_see_difference: 'Saved successfully change will be shown after you sign in again.'
                    },
                    topic: {
                        current_topic: 'Related topic',
                        topic: 'Topic'
                    },
                    foodIncomes: {
                        income: 'Income',
                        cash: 'Cash',
                        current: 'Bank statement',
                        view: 'View',
                        receipt_number: 'Receipt number',
                        undo: 'Undo',
                        undo_description: 'Are you sure to undo the payment?',
                        create_cash: 'Create cash',
                        create_current: 'Bank account',
                        amount: 'Amount',
                    },
                    students_progress: {
                        title: 'Students’ progress',
                        exam_progress: 'Exam progress',
                        behavior: 'Behavioral assessment',
                        result: 'Term result',
                        increased_in_level: 'Up in level',
                        increased_over_level: 'Level up',
                        increased_subjects: 'Subjects-level-up',
                        decreased_subjects: 'Subjects-level-down',
                        decreased_in_level: 'Down in level',
                        decreased_over_level: 'Level down',
                        season_scoreboard: 'Seasonal scoreboard',
                        students_list: 'Students\' list',
                        total: 'Total',
                    },
                    err: {
                        relation_confirm_empty: 'Select user to approve confirmation',
                        select_class: 'Select class',
                        select_detention: 'Select detention type',
                        select_season: 'Select season',
                        select_student: 'Select student',
                        select_invoice: 'Select invoice',
                        select_date: 'Please, select date',
                        select_time: 'Select time, please',
                        select_type: 'Select type',
                        select_room: 'Select room',
                        select_curriculum: 'Select curriculum',
                        insert_amount: 'Insert amount',
                        insert_score: 'Insert score',
                        student_code_empty: 'Student code empty',
                        select_requirement: 'Select the indicators',
                        select_exam_type: 'Select exam type',
                        select_score_type: 'Select score type',
                        code_duplicate: 'Code is duplicated',
                        order_duplicate: 'Order is duplicated',
                        image_size_error: 'The image is too large to upload and needs to be resize please. Image max size 1mb.',
                        image_type_error: 'Uploaded file is not a valid image. Only JPG, PNG and GIF files are allowed.',
                        image_type_error_1: 'Insert only document file. If you want to upload image, please click on insert image',
                        fill_all_fields: 'Please complete fields',
                        delete_info_not_found: 'Not data was found',
                        edit_info_not_found: 'No data found for editing',
                        select_group: 'Select group',
                        select_exam: 'Select exam',
                        select_template: 'Select template',
                        insert_grade_name: 'Enter class name',
                        select_teacher: 'Select teacher',
                        select_school_shift: 'Select schedule',
                        enter_email: 'Enter E-Mail',
                        select_school: 'Select school',
                        enter_existing_phone_number: 'Please insert the mobile number now using',
                        enter_new_phone_number: 'Insert the new mobile number',
                        error_occurred: 'Error occurred',
                        enter_valid_date: 'Enter valid date',
                        select_role: 'Select role',
                        invalid_image_format: 'Invalid image format',
                        invoice_amount: 'Invoice amount can\'t be 0',
                        enter_password: 'Enter password',
                        re_enter_password: 'Reenter password',
                        info_not_found: 'No information is found',
                        file_size: 'The file size is too large to upload',
                        file_type: 'Invalid file type',
                        file_empty: 'The file is empty',
                        choose_date: 'Please choose date',
                        invalid_email: 'E-mail is invalid',
                    },
                    my: {
                        homework_report: 'Homework reports',
                        online_lesson: 'Online lesson',
                        online_lesson_report: 'Online lesson reports',
                        link: 'Link',
                        link_name: 'Link name',
                        google_driver: 'GoogleDrive',
                        upload_file: 'File upload',
                        upload_video: 'Video upload',
                        video: 'Video',
                        description_text: 'Depending on the size of the video, uploading the file to the server may take some time to complete. Click on the online lesson to make sure the file is completely uploaded.',
                        attention: 'Attention',
                        in_progress: 'In progress ...',
                        sent_file: 'Sent file',
                        sent_date: 'Sent date',
                        checked_date: 'Checked date'
                    },
                    newsfeed: {
                        title: 'Newsfeed',
                        title_error: 'Type text on newsfeed',
                        file_size_warning: 'Please note that the file size should not exceed 50MB.',
                        image_count_error: '',
                        likes: 'Likes',
                        views: 'Views',
                        comments: 'Comments',
                        see_more: 'See more',
                        reply: 'Reply',
                        reply_comment: 'Reply comment',
                        reply_view: 'Reply view',
                        post_reply: 'Reply post',
                        show_more_comment: 'More comments',
                        show_more_reply: 'More reply',
                        post_edit: 'Edit post',
                        post_delete: 'Delete post',
                        config: 'Newsfeed setting'
                    },
                    newsfeedConfig: {
                        addRecipient: 'Add recipient',
                        canSeeAllPost: 'Can see all posts',
                        canSeeOwnPost: 'Only can see own posts',
                        fromSchool: 'From school',
                        parents: 'Parents',
                        students: 'Students',
                        hdrName: 'Name',
                        parent_hdr: 'Parent board',
                        parent_hdr_type: 'Board type',
                        hdr_roles: 'User roles who can post',
                        insertNameError: 'Insert board name, please',
                        insertHdrTypeError: 'Select board type, please',
                        insertParentHdrError: 'Select parent board, please',
                        insertRolesError: 'Select roles who can post in board, please',
                        removeHdr: 'Would you like to remove board?',
                        removeRecipient: 'Would you like to remove user from board?',
                        removeRecipientDescription: 'User also will be removed from school config, if user works at school.',
                        selectHdrRecipient: 'Please, select newsfeed recipient',
                        title: 'Newsfeed config'
                    },
                    corporate: {
                        title: 'Statement',
                        show: 'Download statement',
                        qpos: 'QPOS',
                        cgw: 'CGW',
                        not_connect: 'Not connected',
                        description: 'Transaction description',
                        sent_account: 'Transferred account',
                    },
                    course: {
                        subject: 'Subject',
                        subjectCode: 'Subject code',
                        subjectName: 'Subject name',
                    },
                    student_email: {
                        title: 'Students\' E-Mail',
                        duplicate_error_title: 'Following email addresses are duplicated',
                        invalid_error_title: 'Following email addresses are invalid',
                    },
                    studentTranscript: {
                        moveOutTitle: 'Шилжсэн сурагчийн тодорхойлолт',
                        title: 'Student transcript',
                        issuedUser: 'Printed user',
                        seasons: 'Select the years for transcript:',
                        publishedLabel: 'Print only published results'
                    },
                    health: {
                        record: {
                            title: 'Health Record',
                            warning_student_health_add: 'You haven`t filled all the fields. If you wish to save it as empty please press save button again',
                            warning_class_change: 'You are changing a class of this template. It will result in deleting of every student information it has.',
                            keep_going: 'If you like to continue click on the insert button',
                            record_date: 'Record date'
                        },
                        template: {
                            title: 'Health template',
                            item: 'Health indicators',
                            template_name: 'Template name',
                            item_can_be_chosen_once: 'Indicators has already been chosen',
                            add_item: 'Add indicators',
                            duplicate_error: 'Order can not be duplicate'
                        },
                        report: {
                            title: 'Health report',
                            choose_template: 'Please choose a template'
                        }
                    },
                    userGroup: {
                        title: 'User group'
                    },
                    profile: {
                        title: 'My profile',
                        about: 'About me',
                        no_info: 'Information haven`t been inserted',
                        info_delete: 'Information delete',
                        img_delete: 'Image delete',
                        insert_photo: 'Insert photo',
                        delete_photo_not_found: 'Устгах зураг олдсонгүй',
                        old_password: 'Old password',
                        new_password: 'New password',
                        new_password_repeat: 'Confirm password',
                        old_password_err: 'Old password and new password must be diffrent'
                    },
                    skill: {
                        name: 'Skill',
                        title: 'Skills assessment',
                        assessmentTemplate: 'Assessment template',
                        createdTeacher: 'Created teacher',
                        skillAssessmentTemplate: 'Skills assessment template',
                        criteria: 'Criteria',
                        chooseAllSubject: 'Choose all subject',
                        addCriteria: 'Add criteria',
                        editCriteria: 'Edit criteria',
                        criteriaType: 'Criteria type',
                        readd: 'Readd',
                        hasScore: 'Has score',
                        hasNotValue: 'Has no value',
                        hasValue: 'Has value',
                        optionValues: 'Option values',
                        numericalAnswer: 'Numerical answer',
                        checkboxAnswer: 'Checkbox answer',
                        publish: 'Would you like to publish skill result?',
                        radioAnswer: 'Radio answer',
                        textareaAnswer: 'TextArea answer',
                        addAssessment: 'Add assessment',
                        selectTemplate: 'Select template',
                        assessmentList: 'Assessment list',
                        createNewAssessment: 'Create new assessment',
                        notFound: 'Skill not found',
                    },
                    cardOrder: {
                        title: 'Card order',
                        delivered: 'Delivered',
                        ordered: 'Ordered',
                        order: 'Order',
                        cancel: 'Cancel',
                        date: 'Order date',
                        date_delivered: 'Delivered date',
                        order_student_card: 'Student card order',
                        warning: 'Please keep in mind that students without photo will not appear in the list. If the card is lost student`s parent have to order through the App. This section is for those who are ordering for the first time.',
                        err_student: 'Please select student',
                        canceled_date: 'Canceled date',
                        canceled: 'Canceled',
                        recover: 'Recover',
                        teacher_card_warning: 'Please keep in mind that users without photo will not appear in the list.'
                    },
                    club: {
                        students: 'Club students',
                        title: 'Club',
                        register_student: 'Student register',
                        name: 'Club name',
                        no_info: 'Club information has not been found',
                        duplicateClasses: 'Classes are duplicated',
                    },
                    dashboard_info: {
                        title: 'Information exchange dashboard',
                        class_info_exchange: 'Class information exchange participation',
                        parent_info_exchange: 'Parent/Guardian information exchange participation',
                        teacher_info_exchange: 'Teacher information exchange participation',
                        parent_num: 'Parent count',
                        post_num: 'Post count',
                        comment_num: 'Comment count',
                        activity: 'Activity',
                        comment: 'Comment',
                        post: 'Post',
                        class_teacher_short: 'CT',
                        answer: 'Answer',
                        see_all: 'See all',
                        your_class: 'Class',
                        others_class: 'Other classes',
                        today_attendance: 'Today attendance',
                    },
                    evaluation_final: {
                        subject_grade: 'Subject grades',
                        sent: 'Sent',
                        name: 'Final grade',
                        not_sent: 'Not sent',
                        not_published: 'Not published',
                        send_esis: 'Send to ESIS',
                        sent_esis: 'Sent to ESIS',
                        title: 'Year final score list',
                        unpub_title: 'Final score information',
                        delete_title: 'Final grade delete',
                        final_grades: 'Final grades',
                        excel_template: 'Template for excel file',
                        calculated: 'Calculated',
                        wrote: 'Wrote',
                        not_created: 'Not created',
                        score_exists: 'Score has already been inserted',
                        publish_confirmation: 'Please note that it will not possible to edit or delete after published!',
                        publish_confirmation_description: 'Only approved results will be shown to parents and class teacher.',
                    },
                    bus_dashboard: {
                        student_title: 'Students with sale quantity that haven`t used or registered'
                    },
                    invoice_form: {
                        invoice_from: 'Invoice from',
                        bill_to: 'Bill to',
                        address: 'Address',
                        contact: 'Phone',
                        bank: 'Bank',
                        bank_account: 'Bank account',
                        state_registration_number: 'State registration number',
                        invoice_date: 'Invoice date',
                        due_date: 'Due date',
                        ceo: 'CEO',
                        accountant: 'Accountant',
                        quantity: 'Quantity',
                        unit_price: 'Unit price',
                        total_amount: 'Total amount',
                        amount: 'Amount',
                        vat: 'VAT',
                        description: 'Description',
                        employee_card: 'Employee card',
                        nomch_address: '',
                        nomch: 'Digital Edu Management LLC',
                        account_number: '413017498',
                        tdb: 'Trade development bank',
                        invoice_pdf: 'Invoice',
                        parent_contact: 'Parent contact',
                        invoice_timetable: 'Payment timetable',
                        total_unpaid: 'Remaining total',
                        billed_amount: 'Billed amount',
                        total_discount: 'Total discount',
                        discounts: 'Discounts',
                        parent_signature: 'Parent/Guardian signature'
                    },
                    analysis: {
                        title: 'Analysis',
                        list: 'Analysis list',
                        related_exam: 'Related exam',
                        calculate: 'Analyse',
                    },
                    esis: {
                        attendance_daily: 'Daily attendance',
                        attendance_daily_empty_class: 'Please, select class to send attendance information to ESIS',
                        attendance_daily_send: 'Send daily attendance',
                        class_id: 'Esis studentGroupId',
                        last_name: 'esis Last name',
                        first_name: 'esis First name',
                        birth_date: 'esis Birth date',
                        excel_file: 'Excel file',
                        excel_filesize_exceed: 'Excel file size must not greater than 5mb.',
                        elementCredit: 'Element credit hour',
                        company_code: 'Organization id',
                        academic_grade: 'Academic level',
                        academic_grade_code: 'Academic grade code',
                        academic_grade_name: 'Academic grade name',
                        academic_level_code: 'Academic level code',
                        academic_level_name: 'Academic level name',
                        curriculum_and_plan: 'Curriculum, plan',
                        curricula: 'Curricula',
                        curricula_connect: 'Connect curricula',
                        curriculaLevel: 'Curricula level',
                        curriculaPlan: 'Curricula plan',
                        curriculaSubject: 'Curricula subject',
                        curricula_code: 'Curricula code',
                        curricula_name: 'Curricula name',
                        curricula_grade_code: 'Curricula grade code',
                        curricula_grade_name: 'Curricula grade name',
                        curricula_element_code: 'Curricula element code',
                        curricula_plan_name: 'Curricula plan name',
                        curricula_plan_type: 'Curricula plan type',
                        curricula_plan_type_name: 'Curricula plan type name',
                        curricula_plan_grade_code: 'Curricula plan grade code',
                        curricula_plan_grade_name: 'Curricula plan grade name',
                        class_code: 'Group code',
                        class_name: 'Group name',
                        student_connection_remove: 'Student connection delete',
                        get: 'Show',
                        get_time: 'Show logs',
                        title: 'ESIS',
                        createClass: 'Create class',
                        createStudent: 'Create student',
                        createTeacher: 'Create teacher',
                        createUser: 'Create user',
                        shortName: 'Short name',
                        eschoolCode: 'eSchool Code',
                        eschoolLastName: 'eSchool last name',
                        eschoolFirstName: 'eSchool first name',
                        eschoolClassName: 'eSchool class name',
                        eschoolTitle: 'eSchool title',
                        linkTeacherStaff: 'Link teacher, staff',
                        selectTeacherStaff: 'Select teacher, staff!',
                        selectGrade: 'Select grade!',
                        selectStudent: 'Select student!',
                        selectOnlyOneTeacherStaff: 'Select only one teacher, staff!',
                        selectOnlyOneGrade: 'Select only one grade!',
                        selectOnlyOneStudent: 'Select only one student!',
                        sentDate: 'Sent date',
                        sentStudentCount: 'Number of student in report',
                        sentUser: 'Sent user',
                        studyTypeCode: 'Study type code',
                        studyTypeName: 'Study type name',
                        scoreSchemaCode: 'Score schema code',
                        scoreSchemaName: 'Score schema name',
                        gradeName: 'Grade name',
                        eschoolGrade: 'eSchool grade',
                        eschoolClass: 'eSchool class',
                        editClass: 'Edit class information',
                        classCode: 'Class code',
                        className: 'Class name',
                        classTeacher: 'Class teacher',
                        linkClass: 'Link class',
                        notSent: 'Not sent',
                        syncStudents: 'Synchronize student information',
                        weekPerTime: 'Weekly hour',
                    },
                    common: {
                        day: 'd',
                        hour: 'h',
                        min: 'min'
                    },
                    handToHand: {
                        classClockOut: 'Class clock out',
                        dismiss: 'Dismiss',
                        nonRepliedStudentCount: 'Тараагүй сурагчид',
                        title: 'Hand to hand',
                        report: 'Report',
                        requestDate: 'Requested date',
                        requestRelationType: 'Student relation type',
                        requestUser: 'Requested user',
                        reply: 'Reply',
                        replyEmpty: 'Please select student',
                        repliedStudentCount: 'Тарсан сурагчид',
                    },
                    timeRecord: {
                        beforeMinute: 'Early minute',
                        cameTime: 'Check-in time',
                        lateHours: 'Late hour',
                        lateMinute: 'Late minute',
                        outTime: 'Check-in time for departure',
                        overHours: 'Overtime',
                        overMinute: 'Over minute',
                        settings: 'Timekeeping setting',
                        shift: 'Shift',
                        shiftEmpty: 'Select shift',
                        title: 'Time record',
                        totalWorkHour: 'Total hours to work',
                        totalWorkedHour: 'Total hours worked'
                    },
                    faq: 'Manual',
                    scoreSchema: 'Score',
                    manager: {
                        detention: 'Detention',
                        title: 'Manager',
                        classGroups: 'Сурагчдын хамрагдалт',
                        curriculum: 'Сургалтын төлөвлөгөө',
                        curriculum_weekly_count: 'Долоо хоногт хэдэн удаа орох',
                        curriculum_weekly_count_description: 'Долоо хоногт хэдэн удаа орохыг оруулна',
                        teacher_progress: 'Багш нарын явц',
                        noGroupTitle: 'Хичээлд хамрагдахгүй байгаа',
                        season_week_count: 'Хичээллэх долоо хоног',
                        year_structure: 'Жилийн бүтэц'
                    },
                    page: {
                        notFound: 'Page not found!',
                        Forbidden: 'You are not allowed to access this page!',
                        goHome: 'Back to homepage',
                    },
                    dashboard: {
                        attendance: 'Attendance dashboard',
                        attendanceTypes: {
                            byTime: 'By time',
                            byClass: 'By class',
                            byTeacher: 'By teacher'
                        },
                        title: 'Dashboard',
                        parents_access: 'Parents access',
                        exam_today: 'Today\'s exam info',
                        parents_and_guardians: 'Parents',
                        parents_and_guardian: 'Parents',
                        accessed_parents: 'Students whose parents are using app',
                        parents_count: 'Number of parents',
                        see_all_events: 'See all events',
                        see_all_news: 'See all news',
                        announcement_today: 'Announcements entered today',
                        homework_today: 'Today\'s homework report',
                        homework_total: 'Today\'s homework',
                        homework_check: 'Homework to check today',
                        newsfeed_today: 'Events for today',
                        class_teacher: 'Class teacher',
                        teacher_journal: 'Teacher journal',
                        usage: {
                            title:  'Usage',
                            staffs: 'Most active teacher, staffs',
                            parents: 'Most active parents',
                            by_parent: 'By parents',
                            by_staff: 'By staffs',
                            eTeacher: 'Mobile',
                            totalUsed: 'Total used'
                        }
                    },
                    staff: {
                        title: 'Employee',
                        code: 'Employee code',
                        lastName: 'Last name',
                        firstName: 'First name',
                        select: 'Select employee!',
                    },
                    teacherToday: {
                        behavior: 'Behavior',
                        notification: 'Notification',
                        noNotification: 'There is no notification',
                        regular: 'Topic',
                        hw_assigned: 'Homework assigned',
                        hw_reviewed: 'Homework to check',
                        hw_assign: 'assign homework',
                        hw_review: 'check homework',
                        active: 'Active',
                    },
                    idle: {
                        title: 'Are you using?',
                        description: 'You are being not used for more than 10 minutes so you are being logged out. Please click on continue button if you want to use!',
                        continue: 'Continue',
                    },
                    sheetImport: {
                        regex: {
                            date: 'Please type date as Year-month-day!',
                            latinAndCyrillic: 'Please use cyrillic or latin!',
                            regNumber: 'Please type as АБ01234567!',
                            email: 'Please type as example@example.com!',
                        },
                        required: {
                            enrolDate: 'Enroll date can not be empty!',
                            studentLastName: 'Last name can not be empty!',
                            studentFirstName: 'First name can not be empty!',
                            gender: 'Gender can not be empty!',
                            studentCode: 'Student code can not be empty!',
                            grade: 'Class can not be empty!',
                            username: 'Login name can not be empty!',
                        },
                        unique: {
                            regNumber: 'National ID can not be same!',
                            studentCode: 'Student code can not be same!',
                            username: 'Login name can not be same!',
                        },
                        desc: {
                            gender: 'You have to select male or female!',
                            notRequired: 'Not required',
                            studentPassword: 'If you provide no password student code will be then treated as a password',
                        },
                        uploadStep: {
                            title: 'Choose file',
                            manifestTitle: 'File format',
                            manifestDescription: null,
                            dropzone: {
                                title: "File must be .xlsx, .xls or .csv",
                                errorToastDescription: "Importing file is cancelled",
                                activeDropzoneTitle: "Drop here",
                                buttonTitle: "Choose file",
                                loadingTitle: "Loading...",
                            },
                            selectSheet: {
                                title: "Please select one page because there is more than one pages and then click continue button",
                                nextButtonTitle: "Continue",
                            },
                        },
                        selectHeaderStep: {
                            title: "Select the header row",
                            nextButtonTitle: "Continue",
                        },
                        matchColumnsStep: {
                            title: "Connect columns",
                            nextButtonTitle: "Continue",
                            userTableTitle: "Your file",
                            templateTitle: "Columns for connecting",
                            selectPlaceholder: "select columns...",
                            ignoredColumnText: "columns deleted",
                            subSelectPlaceholder: "Select...",
                            matchDropdownTitle: "Connect",
                            unmatched: "not connected",
                            duplicateColumnWarningTitle: "Column is selected",
                            duplicateColumnWarningDescription: "Columns can not be same",
                        },
                        validationStep: {
                            title: "Checking data",
                            nextButtonTitle: "Import",
                            noRowsMessage: "No data found",
                            noRowsMessageWhenFiltered: "There is no invalid data",
                            discardButtonTitle: "Delete the selected rows",
                            filterSwitchTitle: "Show the invalid data",
                        },
                        alerts: {
                            confirmClose: {
                                headerTitle: "Close",
                                bodyText: "Are you sure to close? Please note that date will not be saved!",
                                cancelButtonTitle: "Cancel",
                                exitButtonTitle: "Close",
                            },
                            submitIncomplete: {
                                headerTitle: "There is invalid data",
                                bodyText: "Please note that invalid data can not imported because there are rows with invalid data.",
                                bodyTextSubmitForbidden: "Please check your data because there are invalid data",
                                cancelButtonTitle: "Cancel",
                                finishButtonTitle: "Import",
                            },
                            unmatchedRequiredFields: {
                                headerTitle: "There are columns that are not connected",
                                bodyText: "Required columns are not connected completely",
                                listTitle: "Required columns:",
                                cancelButtonTitle: "Cancel",
                                continueButtonTitle: "Continue",
                            },
                            toast: {
                                error: "Error",
                            },
                        },
                        error: {
                            studentNotExists1: 'class has no student with code:',
                            studentNotExists2: '',
                        },
                    },
                    logout: 'Logout',
                    hr: {
                        title: 'Human resource',
                        teachersAttendance: 'Teacher\'s attendance',
                        attendanceReport: 'Attendance report',
                        configStaffs: 'Belonging staffs',
                        configDeleteTitle: 'Would you like to delete?',
                        department: 'Department',
                        addStaff: 'Add staff',
                        staffCode: 'Staff code',
                        structure: 'Structure',
                        addDepartment: 'Add department',
                        editDepartment: 'Edit department',
                        parentDepartment: 'Belonging department',
                        departmentName: 'Department name',
                        departmentCode: 'Department code',
                        addEmployee: 'Add employee',
                        noConfigStaffs: 'Employees that not assigned for config',
                        noDepartment: 'Employees not assigned to a department',
                        approved: 'Approved',
                        declined: 'Declined',
                        role: 'Role'
                    },
                    behavior: {
                        title: 'Behavior',
                        positiveScore: '+ score',
                        negativeScore: '- score',
                        maturity: 'Behavior maturity'
                    },
                    subMenu: {
                        survey: 'Survey',
                        doctor: 'Doctor',
                        appointment: 'Appointment',
                        erp: 'ERP'
                    }
                }
            case 'mn':
                return {
                    action: {
                        addRow: 'Мөр нэмэх',
                        edit: 'Засах',
                        datatable_info: 'Нийт _TOTAL_ илэрцийн _START_-с _END_-г харуулж байна',
                        delete: 'Устгах',
                        loading: 'Ачааллаж байна',
                        view: 'Үзэх',
                        publish: 'Баталгаажуулах',
                        recalculate: 'Дахин бодох',
                        recreate: 'Дахин үүсгэх',
                        register: 'Бүртгэх',
                        search: 'Хайх',
                        setInactive: 'Хүчингүй болгох',
                        setActive: 'Хүчинтэй болгох',
                        typeHere: 'Энд бичнэ үү...',
                        post: 'Нийтлэх',
                        emptyTable: 'Мэдээлэл олдсонгүй',
                        calculate: 'Тооцоолох',
                    },
                    day: 'өдрүүд',
                    lessons: 'хичээлүүд',
                    result: 'Үр дүн',
                    not_registered: 'Бүртгэгдээгүй',
                    addRole: 'Эрх нэмэх',
                    days: 'Гараг',
                    not_published: 'Баталгаажуулаагүй',
                    unPublish: 'Баталгаажуулаагүй болгох',
                    save_success: 'Амжилттай хадгалагдлаа',
                    success: 'Амжилттай',
                    add: 'Нэмэх',
                    add_school_relation: 'Сургууль холбох',
                    add_student: 'Сурагчаар үүсгэх',
                    all: 'Бүгд',
                    amount: 'Дүн',
                    answered: 'Бөглөсөн',
                    answered_percent: 'Боломжит %',
                    back: 'Буцах',
                    back_to_list: 'Жагсаалт руу буцах',
                    by_class: 'Ангиар',
                    by_student: 'Сурагчаар',
                    cancel: 'Цуцлах',
                    please_add_template: 'Эрүүл мэндийн маягт нэмнэ үү',
                    chat: {
                        createNew: 'Шинэ чат бичих',
                        markAllAsRead: 'Бүгдийг "УНШСАН" гэж тэмдэглэх',
                        new: 'Шинэ чат',
                        offline: 'Офлайн',
                        online: 'Онлайн',
                        select_chat_description: 'Мессэж бичих хэрэглэгчээ сонгоно уу',
                        sent_chat: 'зураг илгээсэн',
                        selectConversation: 'Харилцан яриа сонгон чатлана уу',
                    },
                    certificate: {
                        title: 'Сертификат',
                        download: 'Сертификат татах'
                    },
                    className: 'Анги',
                    code: 'Код',
                    create: 'Үүсгэх',
                    show_result: 'Үр дүнг үзэх',
                    datatable: {
                        columns: 'Баганууд'
                    },
                    ecourse: {
                        createTopic: 'Сэдэв нэмэх',
                        parentTopic: 'Харьяалагдах сэдэв',
                        selectSubject: 'Select subject',
                        title: 'Цахим хичээл',
                        topic_code: 'Сэдвийн код',
                        topic_name: 'Сэдвийн нэр',
                        topic_activity: 'Хичээлийн үйл ажиллагаа',
                        topic_description: 'Дүгнэлт',
                        topics: "Сургалтын төлөвлөгөө"
                    },
                    elearning_topic: 'Сэдэв',
                    email: 'И-мэйл хаяг',
                    photo: 'Зураг',
                    studentCode: 'Сурагчийн код',
                    send: 'Илгээх',
                    studentLastName: 'Сурагчийн овог',
                    studentFirstName: 'Сурагчийн нэр',
                    description: 'Тайлбар',
                    weight: 'Жин',
                    height: 'Өндөр',
                    online_exam: {
                        title: 'Цахим шалгалт',
                        search: 'Хайх',
                        connect_answers: 'Хариулт холбох',
                    },
                    student_info_missing: 'Сурагчийн мэдээлэл алга байна',
                    previous: 'Өмнөх',
                    online_exam_eq_answer: 'Асуултын томъёог энд оруулна уу.',
                    online_exam_text_answer: 'Хариултын текстийг энд бичнэ үү',
                    online_exam_question: 'Асуулт',
                    online_exam_subTopic: 'Дэд сэдэв',
                    online_exam_select_subTopic: 'Дэд сэдэв сонгох',
                    online_exam_select_value: 'Та зүүн талд байрлах хайлтын хэсгээс утгуудаа сонгосноор бүртгэлтэй асуултууд харагдана.',
                    online_exam_edit_question: 'Асуултыг засах',
                    online_exam_delete_question: 'Асуултыг устгах',
                    online_exam_delete_course: 'Устгах',
                    online_exam_edit_course: 'Засах',
                    online_exam_back_to_list: 'Жагсаалт руу буцах',
                    online_exam_subject: 'Хичээл',
                    copy: 'Хуулах',
                    show_report: 'Тайлан үзэх',
                    download_report: 'Тайлан татах',
                    insert_only_photo: 'Та зөвхөн зураг оруулна уу.',
                    remove_connected_answer: 'Та холболсон асуултуудыг салгаж байж устгана уу.',
                    select_right_answer: 'Та зөв хариултыг сонгоно уу !',
                    insert_answer_photo: 'Та зугараа сонгоно уу!',
                    incorrect: 'Алдаатай',
                    fill_general_info: 'Та ерөнхий мэдээллээ бүрэн бөглөнө үү',
                    fill_answer_sheet: 'Та хариултын хуудсыг бүрэн бөглөнө үү!',
                    do_inactive: 'Идэвхгүй болгох',
                    score: 'Оноо',
                    question_type: 'Асуултын төрөл',
                    question_difficulty: 'Хүндийн зэрэг',
                    clear: 'Цэвэрлэх',
                    select_subject: 'Хичээл сонгох',
                    select_topic: 'Сэдэв сонгох',
                    select_question_difficulty: 'Хүндийн зэрэг сонгох',
                    select_question_type: 'Асуултын төрөл сонгох',
                    select_connective_answer: 'Та холбох хариултаа сонгоно уу!.',
                    detailed_info: 'Дэлгэрэнгүй мэдээлэл',
                    general_info: 'Ерөнхий мэдээлэл',
                    add_question: 'Асуулт нэмэх',
                    insert_eq_question: 'Асуултыг энд оруулна уу.',
                    answer: 'Хариулт',
                    connect_answers: 'Хариулт холбох',
                    connect: 'Холбох',
                    insert_description: 'Тайлбар оруулна уу',
                    create_question: 'Асуулт үүсгэх',
                    course_subject: 'Судлагдахуун',
                    course_code: 'Курсийн код',
                    course_name: 'Курсийн нэр',
                    course_briefDescription: 'Товч танилцуулга',
                    course_result: 'Хичээлийн үр дүн',
                    course_criteria: 'Өмнө сурсан байх мэдлэг',
                    course_select_teacher: 'Багш сонгоно уу',
                    course_select_topic: 'Сэдэв сонгох',
                    course_add_topic: 'Сэдэв нэмэх',
                    course_type: 'Төрөл',
                    course_select_courseType: 'Төрөл сонгох',
                    course_insert_course_code: 'Курсийн код оруулна уу',
                    course_insert_course_name: 'Курсийн нэр оруулна уу',
                    course_insert_text: 'Текст оруулна уу',
                    course_next: 'Дараагийнх',
                    course_confirm: 'Баталгаажуулах',
                    course_general_info: 'Ерөнхий мэдээлэл',
                    course_lesson: 'Хичээл',
                    course_examination_question: 'Шалгах асуулт',
                    course_upload_video: 'Энд дарж видео хуулна уу',
                    course_video_lesson: 'Видео хичээл',
                    course_select_from_question_bank: 'Асуултын банкнаас сонгох',
                    course_select_question: 'Асуулт сонгох',
                    course_add_course: 'Хөтөлбөр нэмэх',
                    course_edit_course: 'Хөтөлбөр засах',
                    course_total_topic: 'Сэдвийн тоо',
                    course_blueprint: 'Блюпринт',
                    course_course_name: 'Хөтөлбөрийн нэр',
                    course_not_created_user: 'Та засах эрхгүй байна.',
                    courseName: 'Хөтөлбөр',
                    planned_time: 'Төлөвлөгөөт цаг',
                    registered_time: 'Бүртгэсэн цаг',
                    cameStudent: 'Ирсэн сурагчид',
                    cameHours: 'Ирсэн цаг',
                    busDashboardTitle: 'Автобусны дашбоард',
                    config: 'Тохиргоо',
                    busConfig: 'Автобусны тохиргоо',
                    busDiscount: 'Автобусны хөнгөлөлт',
                    busInvoice: 'Автобусны нэхэмжлэх',
                    busSale: 'Автобусны эрх',
                    search: 'Хайх...',
                    empty: 'Илэрц олдсонгүй',
                    emptyStudent: 'Сурагч олдсонгүй',
                    total: 'Нийт',
                    date: 'Огноо',
                    datePickerPlaceholder: 'Он-сар-өдөр',
                    chooseSeason: 'Улирал сонгох',
                    created_date: 'Бүртгэсэн огноо',
                    totalStudent: 'Нийт сурагчид',
                    transaction_date: 'Гүйлгээний огноо',
                    select_transaction_date: 'Гүйлгээний огноо оруулна уу',
                    check_transaction_date: 'Гүйлгээний огноо сонгоно уу',
                    created_user: 'Бүртгэсэн хэрэглэгч',
                    registered: 'Бүртгэсэн',
                    close: 'Хаах',
                    status: 'Төлөв',
                    view: 'Харах',
                    phoneNumber: 'Утасны дугаар',
                    insert_phoneNumber: 'Утасны дугаар оруулна уу',
                    students: 'Сурагчид',
                    last_name: 'Овог',
                    first_name: 'Нэр',
                    insert_last_name: 'Овог оруулна уу',
                    insert_first_name: 'Нэр оруулна уу',
                    insert_user_name: 'Хэрэглэгчийн нэр оруулна уу',
                    insert_email: 'И-мэйл хаяг оруулна уу',
                    insert_price: 'Үнэ оруулна уу',
                    edit: 'Засах',
                    approve: 'Зөвшөөрөх',
                    approve_confirmation: 'Та итгэлтэй байна уу?',
                    delete: 'Устгах',
                    delete_confirmation: 'Та устгахдаа итгэлтэй байна уу?',
                    delete_confirmation_description: 'Нэг устгасан мэдээллийг дахин сэргээх боломжгүйг анхаарна уу!',
                    download_excel: 'Эксель татах',
                    role: 'Дүр',
                    select_role: 'Дүр сонгоно уу',
                    school: 'Сургууль',
                    school_code: 'Сургуулийн код',
                    select: 'Сонгох',
                    pls_select: 'сонгоно уу',
                    gender: 'Хүйс',
                    select_gender: 'Хүйс оруулна уу',
                    yes: 'Тийм',
                    no: 'Үгүй',
                    print: 'Хэвлэх',
                    receipt_print: 'Баримт хэвлэх',
                    teacher_title: 'Багш',
                    list: 'Жагсаалт',
                    excel: 'Эксель',
                    period: 'Цаг',
                    decline: 'Татгалзах',
                    grade: 'Түвшин',
                    total_score: 'Нийт оноо',
                    percent: 'Хувь',
                    to_take: 'Шалгалт авах',
                    purpose: 'Зорилго',
                    result_list: 'Дүнгийн жагсаалт',
                    total_taken_score: 'Нийт авсан оноо',
                    add_new: 'Шинээр нэмэх',
                    start_date: 'Эхлэх огноо',
                    end_date: 'Дуусах огноо',
                    name: 'Нэр',
                    excel_download: 'Эксель татах',
                    information: 'Мэдээлэл',
                    unpaid_amount: 'Төлөөгүй дүн',
                    insert_code: 'Код оруулна уу',
                    insert_name: 'Нэр оруулна уу',
                    insert_order: 'Дараалал оруулна уу',
                    insert_pay_amount: 'Төлөх дүн оруулна уу',
                    register_number: 'Регистрийн дугаар',
                    created_by: 'Бүртгэсэн',
                    main_information: 'Ерөнхий мэдээлэл',
                    insert_fields_correctly: 'Формийн утгуудыг зөв оруулна уу',
                    disable: 'Хүчингүй болгох',
                    enable: 'Идэвхжүүлэх',
                    change_login_name: 'Нэвтрэх нэр солих',
                    clear_login_name: 'Нэвтрэх нэр хасах',
                    clear_login_name_description: 'Нэвтрэх нэр хасах уу?',
                    clear_login_name_description_1: 'Нэвтрэх нэр хассан тохиолдолд тухайн нэвтрэх нэрийг ашиглан системд нэвтрэх боломжгүйг анхаарна уу',
                    type: 'Төрөл',
                    paid_amount: 'Төлсөн дүн',
                    class_name: 'Бүлэг',
                    undo: 'Буцаах',
                    confirmation: 'Баталгаажуулах',
                    select_grade: 'Түвшин сонгоно уу',
                    score_type: 'Үнэлгээний төрөл',
                    select_all: 'Бүгдийг сонгох',
                    published: 'Баталгаажуулсан',
                    subjects: 'Хичээлүүд',
                    classes: 'Бүлгүүд',
                    saved: 'Хадгалсан',
                    save_and_exit: 'Хадгалаад гарах',
                    bonus: 'Бонус',
                    average: 'Дундаж',
                    max: 'Дээд',
                    min: 'Доод',
                    start_time: 'Эхлэх цаг',
                    end_time: 'Дуусах цаг',
                    school_shift: 'Ээлж',
                    insert_photo: 'Зураг оруулах',
                    upload_photo_button_label: 'Энд дарж зургаа хуулна уу',
                    click_here: 'Энд дарна уу...',
                    crop: 'Таслах',
                    discounted_students: 'хамрагдсан сурагчид',
                    sequence: 'Дараалал',
                    insert_sequence: 'Дараалал оруулна уу',
                    address: 'Хаяг',
                    mongolia: 'Монгол',
                    english: 'Англи',
                    website: 'Вэб сайт',
                    lat: 'Өргөрөг',
                    lon: 'Уртраг',
                    handDistance: 'Радиус м',
                    handDistanceMin: 'Хамгийн багадаа 100 метр байх шаардлагатай',
                    logo: 'Лого',
                    logo_horizontal: 'Үнэмлэхний хөндлөн лого',
                    season: 'Улирал',
                    gpa: 'Голч',
                    checked: 'Шалгасан',
                    time: 'Хугацаа',
                    change_time: 'Хугацаа өөрчлөх',
                    by_day: 'Өдрөөр',
                    by_staff: 'Ажилтнаар',
                    by_dashboard: 'Нэгдсэн',
                    assessment: 'Үнэлгээ',
                    template: 'Загвар',
                    total_avg: 'Нийт дундаж',
                    valid: 'Хүчинтэй',
                    invalid: 'Хүчингүй',
                    remove: 'Хасах',
                    male: 'Эрэгтэй',
                    female: 'Эмэгтэй',
                    e_mail: 'И-мэйл',
                    existing_phone_number: 'Одоо ашиглаж байгаа дугаар',
                    new_phone_number: 'Шинэ солих дугаар',
                    re_enter_phone_number: 'Шинэ солих дугаар дахин оруулах',
                    re_open: 'Дахин нээх',
                    password: 'Нууц үг',
                    new_password: 'Шинэ нууц үг',
                    re_enter_new_password: 'Шинэ нууц үг дахин оруулах',
                    readMore: 'Цааш үзэх',
                    password_empty: 'Нууц үг оруулна уу',
                    password_length_error: 'Нууц үг 4-с дээш тэмдэгт байх шаардлагатай',
                    password_re_enter_mismatch: 'Давтан оруулсан нууц үг ижил байх ёстой.',
                    login_name_re_enter_mismatch: 'Давтан оруулсан нэвтрэх нэр ижил байх ёстой.',
                    phone_number_re_enter_mismatch: 'Давтан оруулсан дугаар ижил байх ёстой.',
                    insert_file: 'Файл оруулах',
                    insert_video: 'Видео оруулах',
                    comment_receive: 'Сэтгэгдэл хүлээн авах эсэх',
                    enter_exam_score: '0-с 100-н хооронд утга оруулна уу',
                    error_crop_button: 'Таслах хэсгийг сонгон ТАСЛАХ товчийг дарна уу.',
                    excel_import: 'Эксель импорт',
                    active: 'Идэвхтэй',
                    is_active: 'Идэвхтэй эсэх',
                    inactive: 'Идэвхгүй',
                    content_code: 'e-content код',
                    insert_content_code: 'e-content код оруулна уу',
                    published_date: 'Нийтэлсэн огноо',
                    manage_roles: 'Эрх тохируулах',
                    add_teacher_role: 'Багш эрх өгөх',
                    class_date: 'Хичээлийн огноо',
                    change_password: 'Нууц үг солих',
                    change_password_description: 'Нууц үгийг сольсноор хуучин нууц үгээрээ нэвтрэх боломжгүй болохыг анхаарна уу!',
                    change_login_name_description: 'Нэвтрэх нэрийг сольсноор өмнөх нэвтрэх нэрээр нэвтрэх боломжгүй болохыг анхаараарай.',
                    required: 'Заавал эсэх',
                    remove_config: 'Тохиргоо устгах',
                    remove_config_description: 'Эрх хаах тохиргооноос сурагчийг хасах уу?',
                    meaning: 'Утга',
                    value: 'Утга',
                    insert_information: 'Мэдээлэл оруулах',
                    attendance: {
                        title: 'Ирц',
                        attendance_registration: 'Ирц бүртгэх',
                        delete_description: 'Ирцийн мэдээг устгах гэж байна. Устгагдсан мэдээллийг сэргээх боломжгүйг анхаарна уу',
                        sent_attendance: 'Цагийн мэдээг илгээх',
                        download: 'Ирц татах',
                        download_attendance: 'Цагийн мэдээ татах',
                        delete_attendance: 'Цагийн мэдээг устгах',
                        edit_attendance: 'Цагийн мэдээг засах',
                        download_timetable: 'Татсан цаг',
                        sent_attendance_confirm: 'Ирцийн мэдээ илгээх',
                        sent_time: 'Цагийн мэдээ илгээсэн',
                        season_config_title: 'Ирц бүртгэл - Улирлын тохиргоо',
                        attendance_report: 'Ирцийн мэдээ',
                        no_log_title: 'Ирц бүртгээгүй цаг',
                        came: 'Ирсэн',
                        excused: 'Чөлөөтэй',
                        unexcused: 'Тасалсан',
                        sick: 'Өвчтэй',
                        late: 'Хоцорсон',
                        not_sent: 'Цагийн мэдээ илгээгээгүй',
                        is_request: 'чөлөө бүртгэл бүртгэгдсэн тул төлөв өөрчлөх боломжгүй. Зөвхөн ирсэн төлөвт шилжүүлж болно.',
                        checkable_description: 'Сурагчийн ирцийг сонгож илгээх',
                        unable_to_delete: 'Улирлын дүн гарсан тул ирцийн мэдээг устгах боломжгүй',
                        unable_to_log_date: 'Ирц бүртгэх боломжгүй өдөр байна',
                    },
                    class: {
                        attendance: {
                            title: 'Өдөр ирц',
                            log: 'Өдөр ирц бүртгэх',
                            report: 'Тайлан'  
                        },
                        title: 'Анги',
                        girls: 'Охид',
                        grade: 'Түвшин',
                        boys: 'Хөвгүүд',
                        report: 'Ангийн тайлан',
                        timetableEmpty: 'Хичээлийн хуваарь бүртгээгүй байна',
                    },
                    student: {
                        create_user: 'И-мэйл бүртгэх',
                        title: 'Сурагч',
                        student_code: 'Сурагчийн код',
                        last_name: 'Сурагчийн овог',
                        first_name: 'Сурагчийн нэр',
                        family_name: 'Ургийн овог',
                        esis_qr: 'ESIS QR код',
                        gender: 'Хүйс',
                        status: 'Статус',
                        student_status: 'Төлөв',
                        current_class: 'Одоо сурч байгаа бүлэг',
                        register_number: 'Регистрийн дугаар',
                        register_student: 'Сурагч бүртгэх',
                        birth_date: 'Төрсөн өдөр',
                        entry_date: 'Элссэн огноо',
                        insert_photo: 'Зураг оруулах',
                        book: 'Сурагчийн хувийн хэрэг',
                        book_title: 'Хувийн хэрэг',
                        upload_button_label: 'Энд дарж зургаа хуулна уу',
                        homework_report: 'Сурагчийн гэрийн даалгаврын мэдээлэл',
                        relation: 'Асран хамгаалагч',
                        relation_type: 'Хүүхдийн юу болох',
                        usage_time: 'Ашигласан цаг',
                        last_login: 'Сүүлд нэвтэрсэн огноо',
                        student_information: 'Хүүхдийн мэдээлэл',
                        registration_undo: 'Бүртгэл сэргээх',
                        relation_other: 'Гэр бүлийн бусад гишүүд',
                        change_password: 'Сурагчийн нууц үг солих',
                        address_type: 'Байнгын хаяг эсэх',
                        birth_cert: 'Төрсний гэрчилгээ',
                        health_num: 'ЭМДугаар',
                        phone_number: 'Сурагчийн утасны дугаар',
                        health: 'Эрүүл мэндийн үзүүлэлт',
                        userRoleNotFound: 'Сурагч эрхтэй хэрэглэгчийн тохиргоо хийгдээгүй байна. Системийн админд хандана уу'
                    },
                    studentBookNavs: {
                        student_info: 'Сурагчийн мэдээлэл',
                        address: 'Гэрийн хаяг',
                        contact: 'Холбоо барих',
                        health: 'Эрүүл мэнд',
                        relation: 'Асран хамгаалагч',
                        personal_info: 'Хувийн мэдээлэл',
                        self_info: 'Өөрийн мэдээлэл',
                        student_personal_info: 'Сурагчийн хувийн хэрэг',
                        grade: 'Сурлага',
                        mid_test: 'Явцын шалгалт',
                        season_grade: 'Улирлын дүн',
                        teacher_statement: 'Багшийн тодорхойлолт',
                        progress: 'Ахиц амжилт',
                        punishment: 'Сахилга бат',
                        behavior: 'Хүмүүжил төлөвшил',
                        skill_status: 'Чадварын үнэлгээ',
                        attendance: 'Ирц',
                        tuition: 'Төлбөр',
                        others: 'Бусад',
                        bus: 'Автобус',
                        bus_title: 'Автобусаар зорчсон мэдээлэл',
                        food: 'Хоол',
                        food_title: 'Хоолонд орсон мэдээлэл',
                    },
                    studentBook: {
                        healthInsuranceNumber: 'ЭМДугаар №',
                        birthCertNumber: 'Төрсний гэрчилгээний №',
                        ethnicity: 'Яс үндэс',
                        date: 'Огноо',
                        class_name: 'Бүлэг',
                        lesson: 'Хичээл',
                        rank: 'Чансаа',
                        max_point: 'Дээд оноо',
                        min_point: 'Доод оноо',
                        average: 'Дундаж оноо',
                        season: 'Улирал',
                        test_name: 'Шалгалтын нэр',
                        point_took: 'Авсан оноо',
                        show: 'Үзэх',
                        relation: 'Хэн нь болох',
                        parent_name: 'Эцэг/эхийн нэр',
                        name: 'Өөрийн нэр',
                        birth_day: 'Төрсөн огноо',
                        gender: 'Хүйс',
                        phone: 'Утасны дугаар',
                        work_place: 'Ажлын газар',
                        work_role: 'Албан тушаал',
                        live_with: 'Одоо цуг амьдардаг эсэх',
                        reason: 'Цуг амьдраагүйн шалгаан',
                        student_point: 'Сурагчийн оноо',
                        student_score: 'Сурагчийн дүн',
                        class_average: 'Ангийн дундаж',
                        read_more: 'Үргэлжлүүлж унших',
                        learn_more: 'Дэлгэрэнгүй харах',
                        skill_status: 'Чадварийн үнэлгээ',
                        state: 'Төлөв',
                        pay_date: 'Төлөх огноо',
                        paid_date: 'Төлсөн огноо',
                        type: 'Төрөл',
                        payment_num: 'Нэхэмжлэхийн дугаар',
                        payment_type: 'Нэхэмжлэхийн төрөл',
                        pay: 'Төлөх дүн',
                        paid: 'Төлсөн дүн',
                        paid_type: 'Төлсөн хэлбэр',
                        remain: 'Үлдэгдэл',
                        registered_date: 'Бүртгэсэн огноо',
                        uploaded_date: 'Үүсгэсэн огноо',
                        student_code: 'Сурагчийн код',
                        class: 'Анги',
                        e_barimt: 'И-Баримт',
                        hours: 'Цаг',
                        attended_hours: 'Ирсэн цаг',
                        late_hours: 'Хоцорсон цаг',
                        absent_hours: 'Тасалсан цаг',
                        sick_hours: 'Өвчтэй цаг',
                        free_hours: 'Чөлөөтэй цаг',
                        teacher: 'Багш',
                        bus_service_info: 'Автобусанд суусан мэдээлэл',
                        food_service_info: 'Хоолонд орсон мэдээлэл',
                        route: 'Чиглэл',
                        driver: 'Жолооч',
                        remove: 'Хасах',
                        female: 'Эмэгтэй',
                        male: 'Эрэгтэй',
                        no_info: 'Мэдээлэл оруулаагүй',
                        email: 'И-мэйл хаяг',
                        city: 'Хот/аймаг',
                        home_phone: 'Гэрийн утас',
                        birth_place: 'Төрсөн газар',
                        door: 'Хаалга/тоот',
                        town: 'Дүүрэг',
                        street: 'Хотхон/хороолол',
                        building: 'Байр/гудамж',
                        studying: 'Сурч байгаа',
                        graduated: 'Төгссөн',
                        remaining: 'үлдсэн байна',
                        duration: 'Хүчинтэй хугацаа',
                        reasonNotLivingTogether: 'Цуг амьдаргүй шалтгаан',
                        place: 'Байр',
                        seasonScore: 'Улирлын нэгдсэн дүн',
                        activity: 'Идэвх, оролцоо',
                    },
                    dashboardAttendence: {
                        excelByTime: 'Цагийн мэдээ - Цагаар',
                        excelByClass: 'Цагийн мэдээ - Ангиар',
                        excelByTeacher: 'Цагийн мэдээ - Багшаар',
                        primaryClass: 'Бага анги',
                        secondaryClass: 'Дунд анги',
                        highClass: 'Ахлах анги',
                        today: 'Өнөөдөр',
                        week: 'Долоо хоног',
                        month: 'Сараар',
                        season: 'Улиралаар',
                        attended: 'Ирсэн',
                        absent: 'Тасалсан',
                        late: 'Хоцорсон',
                        sick: 'Өвчтэй',
                        excused: 'Чөлөөтэй',
                        attendance_info: 'Ирцийн мэдээ',
                        class_attendance: 'Ангийн ирц',
                        student_hour: 'Сурагч | цаг',
                        info_sent: 'Цагийн мэдээ илгээсэн',
                        hour: 'Цаг',
                        all_class_num: 'Хичээлтэй ангийн тоо',
                        responded_class_num: 'Мэдээ илгээсэн ангийн тоо',
                        students: 'Сурагчид',
                        class: 'Анги',
                        class_name: 'Бүлэг',
                        with_class_name: 'Бүлгээр',
                        with_class: 'Ангиар',
                        with_rank: 'Түвшингээр',
                        picture: 'Зураг',
                        student_code: 'Сурагчийн код',
                        last_name: 'Эцгийн нэр',
                        student_name: 'Сурагчийн нэр',
                        lesson: 'Хичээл',
                        teacher: 'Багш',
                        response: 'Илгээсэн',
                        response_time: 'Илгээсэн цаг',
                        no_response: 'Илгээгээгүй',
                        info_sent_classes: ' цагийн ирцийн мэдээг илгээсэн ангиуд',
                        all_student_hours: 'Нийт сурагч | цаг',
                        attended_student: 'Ирсэн сурагч',
                        absent_student: 'Тасалсан сурагч',
                        late_student: 'Хоцорсон сурагч',
                        sick_student: 'Өвчтэй сурагч',
                        excused_student: 'Чөлөөтэй сурагч',
                        class_student: 'Ангийн сурагч',
                        all_club_num: 'Хичээлтэй дугуйлангийн тоо',
                        responded_club_num: 'Мэдээ илгээсэн дугуйлангийн тоо',
                        club_name: 'Дугуйлангийн нэр',
                        time: "цаг"
                    },
                    dashboardSeasonGrade: {
                        with_subject: 'Хичээлээр',
                        with_teacher: 'Багшаар',
                        with_class: 'Ангиар',
                        dashboard: 'Дашбоард',
                        dashboard_season: 'Улирлын дүнгийн хавтгай',
                        teacher_dashboard: 'Багшийн улирлын дүнгийн мэдээ',
                        class_dashboard: 'Ангийн улирлын дүнгийн мэдээ',
                        dashboard_curr: 'Явцын шалгалтын дүнгийн хавтгай',
                        teacher_dashboard_curr: 'Багшийн явцын шалгалтын мэдээ',
                        class_dashboard_curr: 'Ангийн явцын шалгалтын мэдээ',
                        dashboard_year: 'Жилийн эцсийн дүнгийн хавтгай',
                        teacher_dashboard_year: 'Багшийн жилийн эцсийн мэдээ',
                        class_dashboard_year: 'Ангийн жилийн эцсийн мэдээ',
                        total: 'Нийт',
                        test: 'Шалгалт'
                    },
                    finance: {
                        add_note: 'Тэмдэглэл бүртгэх',
                        invoice: 'Нэхэмжлэх',
                        invoice_empty: 'Холбоотой нэхэмжлэх олдсонгүй',
                        invoice_search: 'Нэхэмжлэх хайх',
                        select_all_student: 'Бүх сурагч',
                        select_invoice_type: 'Нэхэмжлэхийн төрөл сонгоно уу',
                        total_student: 'Нийт сурагчийн тоо',
                        number_of_incomplete_students: 'Төлбөр дутуу сурагчийн тоо',
                        dashboard: 'Дашбоард',
                        ebarimtCreated: 'Үүссэн',
                        ebarimtNotCreated: 'Үүсээгүй',
                        ebarimt: 'И-баримт',
                        ebarimt_created_date: 'И-баримт огноо',
                        ebarimt_lottery: 'И-баримт сугалааны дугаар',
                        ebarimt_lottery_insert: 'И-баримт сугалааны дугаар оруулна уу',
                        ebarimt_register: 'И-баримт бүртгэх',
                        ebarimt_register_error: 'И-баримт бүртгэхэд алдаа гарлаа',
                        ebarimt_type: 'И-баримт төрөл',
                        ebarimt_type_insert: 'И-баримт төрөл сонгоно уу',
                        ebarimt_type_citizen: 'Хувь хүн',
                        ebarimt_type_organization: 'Байгууллага',
                        ebarimt_type_organization_register: 'Байгууллагын регистр',
                        ebarimt_type_organization_register_insert: 'Байгууллагын регистр зөв оруулна уу',
                        tuition_payment: 'Төлбөрийн төлөлт',
                        billed: 'Нэхэмжилсэн',
                        paid: 'Төлсөн',
                        unpaid: 'Төлөөгүй',
                        incomplete: 'Дутуу',
                        invoice_payment_title: 'нэхэмжлэхийн төлөлт',
                        read_more: 'Дэлгэрэнгүй үзэх',
                        overpaid: 'Илүү',
                        className: 'Бүлэг',
                        discount_amount: 'Хөнгөлсөн дүн',
                        pay_amount: 'Төлөх дүн',
                        unpaid_amount: 'Үлдэгдэл',
                        contact: 'Холбоо барих',
                        duedate_amount_error: 'Төлөх дүн зөрүүтэй байна',
                        amount: 'Дүн',
                        pay: 'Төлөх',
                        invalid: 'Хүчингүй',
                        disable: 'Хүчингүй болгох',
                        view: 'Үзэх',
                        create_invoice_type: 'Нэхэмжлэхийн төрөл үүсгэх',
                        please_create_invoice_type: 'Нэхэмжлэхийн төрөл үүсгэнэ үү.',
                        select_class: 'Анги сонгоно уу',
                        fixed_amount: 'Мөнгөн дүн тогтмол',
                        custom_amount: 'Тогтмол бус дүн',
                        create_invoice: 'Нэхэмжлэх үүсгэх',
                        re_create: 'Дахин нэхэмжлэх үүсгэх',
                        edit_invoice: 'Нэхэмжлэх засах',
                        invoice_type: 'Нэхэмжлэхийн төрөл',
                        invoice_type_is_default: 'Сургуульд хамаарах эсэх?',
                        invoice_type_vat_payer: 'ИБаримт өгөх эсэх?',
                        invoice_type_vat_code: 'Үйлчилгээний код',
                        invoice_type_vat_code_description: 'НӨАТ төлөгч үйлчилгээний төрлийн код',
                        due_date: 'Төлөх хугацаа',
                        due_date_expired: 'Хугацаа хоцорсон',
                        due_date_upcoming: 'Хугацаа болж байгаа',
                        insert_due_date: 'Төлөх хугацаа оруулна уу',
                        class: 'Анги',
                        bank: 'Банк',
                        select_bank: 'Банк сонгоно уу',
                        account_number: 'Дансны дугаар',
                        account_holder: 'Дансн эзэмшигчийн нэр',
                        select_all_students: 'Ангийн бүх сурагчийг сонгох',
                        disable_invoice_title: 'Нэхэмжлэхийг хүчингүй төлөвт шилжүүлэх үү?',
                        disable_invoice_description: 'Нэхэмжлэхийг хүчингүй болгосноор тухайн нэхэмжлэхийг төлөх боломжгүй болохыг анхаарна уу!',
                        note: 'Тэмдэглэл',
                        overPaymentDescription: "Илүү төлөлт бүртгэх үү?",
                        paid_date: 'Төлсөн огноо',
                        paid_method: 'Төлсөн хэлбэр',
                        discount: 'Хөнгөлөлт',
                        payment_graph: 'Төлөх график',
                        payment_history: 'Төлөлтийн түүх',
                        payment_information: 'Төлөлтийн мэдээлэл',
                        invoice_number: 'Нэхэмжлэхийн дугаар',
                        invoice_name: 'Нэхэмжлэхийн нэр',
                        created_date: 'Үүсгэсэн огноо',
                        created_user: 'Үүсгэсэн хэрэглэгч',
                        paid_amount: 'Төлсөн дүн',
                        delete_invoice_type_description: 'Нэхэмжлэхийн төрөл устгах гэж байна. Устгасан тохиолдолд уг төрлийг дахин ашиглах боломжгүй',
                        edit_invoice_type: 'Нэхэмжлэхийн төрөл засах',
                        total_amount: 'Нийт төлөх дүн',
                        total_payment: 'Нийт төлөлт',
                        discount_type: 'Хөнгөлөлтийн төрөл',
                        please_insert_discount_amount: 'Хөнгөлөлтийн дүн оруулна уу',
                        discount_information: 'Хөнгөлөлтийн мэдээлэл',
                        add_discount_type: 'Хөнгөлөлтийн төрөл нэмэх',
                        discount_percent: 'Хөнгөлөлтийн хувь',
                        by_percent: 'Хувиар',
                        by_amount: 'Үнийн дүнгээр',
                        discount_code: 'Хөнгөлөлтийн код',
                        discount_name: 'Хөнгөлөлтийн нэр',
                        edit_discount_type: 'Хөнгөлөлтийн төрөл засах',
                        delete_discount_type_description: 'Хөнгөлөлтийн төрөл устгах гэж байна. Устгасан тохиолдолд уг төрлийг дахин ашиглах боломжгүй',
                        pay_graph: 'Төлбөрийн график',
                        add_discount: 'Хөнгөлөлт нэмэх',
                        amount_not_constant: 'Мөнгөн дүн тогтмол бус',
                        pay_amount_less_error: 'Төлөх нийт дүн нэхэмжлэхийн дүнгээс бага байна',
                        pay_amount_more_error: 'Төлөх нийт дүн нэхэмжлэхийн дүнгээс их байна',
                        due_date_amount_more_error: 'Төлөх нийт дүн сонгосон төлөх графикийн дүнгээс их байна',
                        due_date_check_error: 'Мөнгөн дүн эхний төлөлтийн графикийн төлөх дүнгээс бага байгаа тул нэг төлөлтийн график сонгоно уу, эсвэл мөнгөн дүнг ихэсгэнэ үү',
                        pay_amount_error: 'Төлөх нийт дүн хасах утгатай байж болохгүй',
                        left_amount: 'Үлдсэн дүн',
                        payments_graph: 'Төлөлтийн график',
                        billed_amount: 'Нэхэмжилсэн дүн',
                        cash_back: 'Орлого буцаах',
                        cash_back_description: 'Та дараах орлогын бүртгэлийг устгахдаа итгэлтэй байна уу. Нэг устгасан тохиолдолд дахин сэргээх боломжгүйг анхаараарай.',
                        already_day: 'Cонгосон өдөр давхар орсон байна.',
                        charge: 'Цэнэглэлт',
                        currency: 'Валютын төрөл',
                        role_expire: 'Эрх хаах',
                        statement_rows: 'Мөрийн тоо',
                        statement_connected: 'Холбогдсон нэхэмжлэхийн тоо',
                        statement_invoices: 'Холбогдсон нэхэмжлэхүүд',
                        statement_not_connected: 'Нэхэмжлэх холбогдоогүй',
                        statement_connect_to_invoice: 'Нэхэмжлэх холбох',
                        statement_amount_error: 'Төлсөн дүн нэхэмжлэхийн төлөх дүнтэй тэнцүү байх шаардлагатай',
                        view_other_invoices: 'Бусад нэхэмжлэхүүдийг үзэх'
                    },
                    financeIncomesTrans: {
                        title: 'Орлого',
                        cash: 'Касс',
                        bank_statement: 'Харилцах',
                        receipt_id: 'Баримтын №',
                        receipt_number: 'Баримтын дугаар',
                        invoice_id: 'Нэхэмжлэх №',
                        invoice_number: 'Нэхэмжлэхийн дугаар',
                        create_cash: 'Касс бүртгэх',
                        amount: 'Мөнгөн дүн',
                        insert_amount: 'Мөнгөн дүн оруулна уу',
                        cash_receipt: 'Бэлэн мөнгөний орлогын баримт',
                        cash_receiver: 'Хүлээн авагч',
                        cash_payer: 'Мөнгө тушаагч',
                        cash_description: 'Гүйлгээний утга',
                        cash_paid_amount: 'Тушаасан дүн',
                        cash_paid_amount_letter: 'Тушаасан дүн үсгээр',
                        cash_received: 'Хүлээн авсан',
                    },
                    foodDashboardTitle: 'Хоолны дашбоард',
                    foodConfig: 'Хоол тохиргоо',
                    foodDiscount: 'Хоолны хөнгөлөлт',
                    foodDiscountUndo: 'Хөнгөлөлтийг буцаах',
                    foodDiscountUndoDescription: 'Та бүртгэсэн хөнгөлөлтийг буцаахдаа итгэлтэй байна уу?',
                    foodInvoice: 'Хоолны нэхэмжлэх',
                    foodInvoiceCreate: 'Хоолны нэхэмжлэх үүсгэх',
                    foodSale: 'Хоолны эрх',
                    foodAddCategory: 'Барааны төрөл нэмэх',
                    foodEditCategory: 'Барааны төрөл засах',
                    foodShopProductName: 'Барааны нэр',
                    foodShopProductCode: 'Барааны код',
                    foodShopProductPrice: 'Үнэ',
                    insertFoodQuantity: 'Тоо ширхэг оруулна уу',
                    isInactive: 'Идэвхтэй эсэх',
                    shop: 'Дэлгүүр',
                    totalProduct: 'Тоо ширхэг',
                    competence: {
                        title: 'Эзэмшвэл зохих чадвар',
                        add_file: 'Файл нэмэх',
                        edit_file: 'Файл засах',
                        select_file: 'Файл сонгох',
                        file_list: 'Файлын жагсаалт',
                        file_name: 'Файлын нэр',
                        file: 'Файл',
                        exam_material: 'Шалгалтын материал',
                        connected_type: 'Холбосон төрөл',
                        show_material: 'Материал харах',
                        connected_by: 'Гараар холбосон',
                        auto_connected: 'Автоматаар холбогдсон',
                        not_connected: 'Сурагч холбоогүй',
                        other_schools: 'Бусад сургуулийн шалгалтын материал',
                        view_by_class: 'Ангиар харах',
                        view_by_student: 'Сурагчаар харах'
                    },
                    blueprint: {
                        title: 'Жишиг даалгавар'
                    },
                    link: {
                        title: 'Цахим хичээл',
                        add_link: 'Холбоос нэмэх',
                        insert_link: 'Холбоос оруулна уу',
                        link: 'Холбоос',
                        error_link: 'Холбоос буруу байна',
                    },
                    financeSearch: {
                        title: 'Хайлт'
                    },
                    financeSearchStudentPortfolio: {
                        status: 'Төлөв',
                        invoice_name: 'Нэхэмжлэхийн нэр',
                        billed: 'Нэхэмжилсэн',
                        paid: 'Төлсөн',
                        incomplete: 'Дутуу',
                        created_date: 'Үүсгэсэн огноо',
                        created_user: 'Үүсгэсэн хэрэглэгч',
                        male: 'Эрэгтэй',
                        female: 'Эмэгтэй',
                        family_name: 'Ургийн овог',
                        last_name: 'Эцгийн нэр',
                        first_name: 'Өөрийн нэр',
                        birth_date: 'Төрсөн өдөр',
                        gender: 'Хүйс',
                        registerNumber: 'Регистрийн дугаар',
                        entry_date: 'Элссэн огноо',
                        current_class_name: 'Одоо сурч байгаа бүлэг',
                        finance: 'Төлбөр',
                        food: 'Хоол',
                        bus: 'Автобус',
                    },
                    food: {
                        add: 'Нэмэх',
                        add_new: 'Шинээр нэмэх',
                        pay_amount: 'Төлөх дүн',
                        inactive: 'Хүчингүй болгох',
                        active: 'Хүчинтэй болгох',
                        create_invoice_type: 'Нэхэмжлэхийн төрөл үүсгэх',
                        edit_invoice_type: 'Нэхэмжлэхийн төрөл засах',
                        name: 'Нэр',
                        insert_name: 'Нэр оруулна уу',
                        bank: 'Банк',
                        choose_bank: 'Банк сонгох',
                        type: 'Төрөл',
                        choose_type: 'Төрөл сонгох',
                        amount: 'Дүн',
                        insert_amount: 'Дүн оруулна уу',
                        check_time_config: 'Эрхийн хугацаа тохируулах эсэх',
                        valid_date: 'Хүчинтэй огноо',
                        inactive_invoice_type: 'Нэхэмжлэхүүдийг хүчингүй болгох',
                        show: 'Үзэх',
                        paidAmount: 'Төлсөн дүн',
                        inactiveSelectedInvoice: 'Сонгосон нэхэмжлэхүүдийг хүчингүй болгох уу',
                        correctDataError: 'Огноо зөв оруулна уу',
                        insertInvoiceTypeName: 'Нэхэмжлэхийн төрлийн нэр оруулна уу',
                        pleaseSelectInvoice: 'Идэвхгүй болгох нэхэмжлэх сонгоно уу',
                        sale_quantity: 'Эрхийн тоо',
                        teacher_staff: 'Багш, ажилтан',
                        recordDiscount: 'Хөнгөлөлт бүртгэх',
                        choose_class: 'Анги сонгох',
                        select_student: 'Сурагч сонгох',
                        discountAmount: 'Хөнгөлөх дүн',
                        selectUser: 'Хэрэглэгч сонгох',
                        insertAmount: 'Үнийн дүн оруулна уу',
                        insertTeacher: 'Багш, ажилтан сонгоно уу',
                        paid_method: 'Төлсөн хэлбэр',
                        paid_date: 'Төлсөн огноо',
                        used_date: 'Хэрэглэсэн огноо',
                        used_amount: 'Хэрэглэсэн дүн',
                        remaining: 'Үлдсэн',
                        quantity: 'Эрх',
                        start_date: 'Эхлэх',
                        end_date: 'Дуусах',
                        paid_history: 'Төлөлтийн түүх',
                        discount: 'Хөнгөлөлт',
                        history: 'Түүх',
                        no_information: 'Мэдээлэл байхгүй байна!',
                        studentFinance: 'Сурагчийн санхүүгийн мэдээлэл',
                        delete: 'Устгах',
                        edit_chef: 'Тогоочийн мэдээллийг засах',
                        food_price_edit: 'Хоолны үнийн мэдээллийг засах',
                        chef: 'Тогооч',
                        add_chef: 'Тогооч нэмэх',
                        food_type_name: 'Хоолны төрлийн нэр',
                        price: 'Үнэ',
                        food_price: 'Хоолны үнэ',
                        create_menu: 'Меню үүсгэх',
                        food_menu: 'Хоолны меню',
                        food_name: 'Хоолны нэр',
                        insert_food_name: 'Хоолны нэр оруулна уу',
                        user_role: 'Хэрэглэгчийн дүр',
                        loan_settings: 'Зээлийн тохиргоо',
                        max_loan: 'Зээлийн дээд хэмжээ',
                        maximum: 'Дээд хэмжээ',
                        image_size_error: 'Зургийн хэмжээ их байна. Зургийн дээд хэмжээ 1 мегабайт байхаар тохируулна уу.',
                        image_type_error: 'Зургийн төрөл тохирохгүй байна. Зургийн төрөл /png, x-png, jpg, jpeg, gif/ байхаар тохируулна уу.',
                        item_type_has_repeatable: 'Өдөрт олон удаа ашиглана',
                        item_type_has_schedule: 'Цагийн хуваарьтай эсэх',
                        start_time: 'Эхлэх цаг',
                        end_time: 'Дуусах цаг',
                        select_item_type: 'Хоолны төрөл сонгоно уу',
                        by_day: 'Өдрөөр',
                        by_product: 'Бараагаар',
                        product_quantity: 'Барааны тоо',
                        add_another_item: 'Бараа дахин бүртгэх',
                        description: 'Хоолны мэдээлэл'
                    },
                    foodDashboard: {
                        className: 'Бүлэг',
                        totalStudents: 'Сурагчид',
                        cameStudent: 'Ирсэн',
                        students_with_sale: 'Эрхтэй',
                        students_food_used: 'Идсэн',
                        students_food_used_loan: 'Зээл',
                        students_food_not_used: 'Идээгүй',
                        eater: 'Хоол идсэн',
                        loan_eat: 'Хоол зээлээр идсэн',
                        payment: 'Төлбөр төлсөн',
                        select_school_shift: 'Ээлж сонгох',
                        select_time: 'Цаг сонгох',
                        by_class: 'Бүлгээр',
                        by_class_title: 'Ангиар',
                        by_student: 'Сурагчаар',
                        paid: 'Төлсөн',
                        incomplete: 'Дутуу',
                    },
                    foodDashboardModal: {
                        status: 'Төлөв',
                        student_code: 'Сурагчийн код',
                        lastname: 'Овог',
                        firstname: 'Нэр',
                    },
                    foodDashboardFoodUsedStudent: {
                        status: '',
                        used_date: 'Хэрэглэсэн огноо',
                        created_date: 'Бүртгэсэн огноо',
                        created_user: 'Бүртгэсэн хэрэглэгч',
                        class_name: 'Анги',
                        student_code: 'Код',
                        last_name: 'Овог',
                        first_name: 'Нэр',
                        sale_status: 'Төлөв',
                    },
                    groupDashboard: {
                        attendance: 'Дугуйлангийн ирц',
                        attendanceReport: 'Цагийн мэдээ',
                        title: 'Дугуйлан дашбоард',
                        teachers: 'Багш нарын мэдээлэл',
                        code: 'Код',
                        lastName: 'Овог',
                        firstName: 'Нэр',
                        groupName: 'Дугуйлан/секц',
                        totalStudents: 'Сурагчийн тоо',
                        perWeek: 'Долоо хоног',
                        className: 'Бүлэг',
                        totalStudentsNumber: 'Дугуйлан, секцэд хамрагдаж байгаа сурагчдын тоо',
                        clubCount: 'Дугуйлан',
                        sportCount: 'Секц',
                        students: 'Сурагчдын мэдээлэл',
                        leftStudentCount: 'Огт хамрагдаагүй',
                        timetableCount: 'Долоо хоногт цаг'
                    },
                    groupDashboardModal: {
                        student_code: 'Сурагчийн код',
                        last_name: 'Сурагчийн овог',
                        first_name: 'Сурагчийн нэр',
                        numbers: 'Тоо',
                        clubs: 'Дугуйлан',
                        sports: 'Секц',
                    },
                    home: 'Эхлэл',
                    invalid_date: 'Огноо буруу байна',
                    roles: {
                        admin: "Админ",
                        parent: "Эцэг эх",
                        teachers_staffs: "Багш, ажилтнууд",
                        title: 'Эрхүүд',
                    },
                    sale: {
                        action_username: 'Хэрэглэгчийн нэр',
                        charge: 'Цэнэглэлт',
                        create: 'Эрх үүсгэх',
                        currentBalance: 'Одоогийн үлдэгдэл',
                        inactiveContent: 'Сонгосон үйлчилгээний эрхийг хүчингүй болгох уу?',
                        inactiveTitle: 'Эрхийг хүчингүй болгох',
                        loan: 'Зээл',
                        loanCharge: 'Зээл & цэнэглэлт',
                        logHistory: 'Эрхийн төлвийн түүх',
                        recover: 'Эрх сэргээх',
                        payment: 'Төлөлт',
                        sale_not_found: 'Үйлчилгээний эрх олдсонгүй',
                        title: 'Үйлчилгээний эрх',
                        type: 'Үйлчилгээний төрөл',
                        usedDate: 'Ашигласан огноо',
                        usedFoodDate: 'Хоолонд орсон огноо'
                    },
                    save: 'Хадгалах',
                    survey: {
                        edit: 'Судалгаа засах',
                        title: 'Судалгаа',
                        main_information: 'Ерөнхий мэдээлэл',
                        questions: 'Асуумж',
                        question_description: 'Асуумжийн тайлбар',
                        confirmation: 'Баталгаажуулах',
                        next: 'Дараагийнх',
                        survey_code: 'Судалгааны код',
                        survey_name: 'Судалгааны нэр',
                        insert_code: 'Код оруулна уу',
                        insert_name: 'Нэр оруулна уу',
                        survey_class: 'Судалгаа авах анги',
                        choose: 'Сонгох',
                        start_date: 'Эхлэх огноо/цаг',
                        select_time: 'Цаг сонгоно уу',
                        end_date: 'Дуусах огноо/цаг',
                        category: 'Категори',
                        survey_purpose: 'Судалгааны зорилго',
                        start: 'Эхлэх',
                        end: 'Дуусах',
                        classes: 'Ангиуд',
                        add_survey_category: 'Судалгааны ангилал нэмэх',
                        parent_category: 'Харьяалагдах ангилал',
                        delete_survey_category: 'Судалгааны ангилал устгах',
                        edit_survey_category: 'Судалгааны ангилал засах',
                        survey_date: 'Судалгааны хугацаа',
                        add_question: 'Асуумж нэмэх',
                        answers: 'Хариултууд',
                        question_type: 'Асуумжийн төрөл',
                        answer_required: 'Заавал хариулт сонгоно',
                        allow_multiple_answers: 'Олон хариулт сонгоно',
                        insert_question: 'Асуумж оруулна уу',
                        insert_question_description: 'Асуумжийн тайлбар оруулна уу',
                        insert_answer: 'Хариулт оруулна уу',
                        add_more_question: 'Дахин асуумж нэмэх',
                        change_order: 'Дараалал өөрчлөх',
                        delete_question: 'Асуумж устгах',
                        select_question_type: 'Асуумжийн төрөл сонгоно уу',
                        delete_survey: 'Судалгаа устгах',
                        disable_survey: 'Судалгаа идэвхгүй болгох',
                        disable_survey_confirmation: 'Та идэвхгүй болгохдоо итгэлтэй байна уу?',
                        disable_survey_confirmation_description: 'Идэвхгүй судалгааны тайланг үзэх боломжгүйг анхаарна уу.',
                        select_category: 'Категори сонгоно уу',
                        survey_classes: 'Хамрагдах ангиуд',
                        category_not_found: 'Категори олдсонгүй',
                        edit_questions: 'Асуумжууд засах',
                        excel_by_students: 'Эксель сурагчаар',
                    },
                    foodDashboardFinanceModalStudents: {
                        status: 'Төрөл',
                        student_code: 'Сурагчийн код',
                        last_name: 'Эцэг эхийн нэр',
                        first_name: 'Сурагчийн нэр',
                        amount: 'Төлөх дүн',
                        unpaid_amount: 'Үлдэгдэл',
                        paid_amount: 'Төлсөн',
                        contactParent: 'Холбоо барих',
                    },
                    busDashboard: {
                        in_count: 'Суусан тоо',
                        out_count: 'Буусан тоо',
                        today: 'Өнөөдөр',
                        week: '14 хоног',
                        payment: 'Төлбөр төлөлт',
                        route_info: 'Маршрутын мэдээ',
                        passengers_information: 'Зорчигчдын мэдээлэл',
                        total_student_by_bus: 'Автобусаар нийт зорчсон сурагчдын мэдээлэл',
                        route: 'Маршрут',
                        search_by_code: 'Сурагчийн кодоор хайх',
                        select_route: 'Маршрут сонгох',
                        select_class: 'Бүлэг сонгох',
                        select_student: 'Сурагч сонгох',
                        total_students: 'Нийт сурагчийн тоо',
                        incomplete_students: 'Төлбөр дутуу сурагчийн тоо',
                        overPayment: 'Илүү',
                        by_route: 'Маршрутаар',
                        by_student: 'Сурагчаар',
                        active: 'Идэвхтэй',
                        loan: 'Зээл',
                        loan_config: 'Зээлийн тохиргоо',
                        no_sale: 'Эрхгүй',
                        map: 'Газрын зураг',
                        price: 'Үнэ'
                    },
                    busDashboardToday: {
                        name: 'Маршрут',
                        in_count: 'Зорчсон сурагчид',
                        incomplete_students: 'Төлбөр дутуу',
                        loan_students: 'Зээлээр зорчсон',
                    },
                    busDashboardTodayModal: {
                        status: 'Төлөв',
                        class_name: 'Бүлэг',
                        student_code: 'Код',
                        last_name: 'Овог',
                        first_name: 'Нэр',
                        in: 'Суух',
                        out: 'Буух',
                        registered_driver: 'Бүртгэсэн жолооч',
                        route_direction: 'Маршрут',
                    },
                    busDashboardWeekDirectionStudents: {
                        used_date: 'Огноо',
                        driver_name: 'Жолооч',
                        status_sit: '',
                        direction: 'Буудал',
                        class_name: 'Бүлэг',
                        student_code: 'Код',
                        last_name: 'Эцэг эхийн нэр',
                        first_name: 'Сурагч',
                        unknown: 'Төлөв1',
                        unknown1: 'Төлөв2',
                    },
                    busDashboardWeekStudents: {
                        add: 'Автобус нэмэх',
                        used_date: 'Огноо',
                        status_sit: '',
                        direction: 'Маршрут',
                        station: 'Буудал',
                        driver_name: 'Жолооч',
                        insert_driver_name: 'Жолооч оруулна уу',
                        route: 'Чиглэл',
                        route_number: 'Чиглэлийн дугаар',
                        route_name: 'Чиглэлийн нэр',
                        insert_route_number: 'Чиглэлийн дугаар оруулна уу',
                        insert_route_name: 'Чиглэлийн нэр оруулна уу',
                        stop_count: 'Буудлын тоо',
                        checker: '',
                        add_driver: 'Жолооч нэмэх',
                        edit_driver: 'Жолоочийн мэдээлэл засах',
                        remove_driver: 'Жолооч хасах',
                        remove_driver_title: 'Жолооч хасах уу?',
                        number: 'Автобусны дугаар',
                        insert_number: 'Автобусны дугаар оруулна уу',
                        add_route: 'Чиглэл нэмэх',
                        edit_route: 'Чиглэл засах',
                        delete_bus: 'Автобус устгах',
                        delete_route: 'Чиглэл устгах',
                        delete_bus_title: 'Автобусын мэдээллийг устгах уу?',
                        delete_route_title: 'Чиглэлийн мэдээллийг устгах уу?'
                    },
                    busNoSale: {
                        title: 'Автобусны эрхгүй сурагчид',
                        used_quantity: 'Зорчсон тоо',
                        created_loan: 'Зээл үүсгэх',
                        no_sale: 'Эрхгүй сурагчид',
                        total_amount: 'Нийт дүн',
                    },
                    filesDt: {
                        subject: 'Хичээл',
                        file: 'Файл',
                        file_limit: '25MB-аас бага байх шаардлагатай',
                        file_limit_with_video: 'Файлын хэмжээ нь 25mb, бичлэгийн хэмжээ 50mb -аас ихгүй байхыг анхаарна уу.',
                        image_type_error: 'Файлын төрөл тохирохгүй байна. Файлын төрөл /png, x-png, jpg, jpeg, gif, docx, xlsx, pptx, wmv, mp4, mp3, mpeg / байхаар тохируулна уу.',
                        image_type_video_error: 'Файлын төрөл тохирохгүй байна. Файлын төрөл /mp4, mpeg, avi, mov, wmv/ байхаар тохируулна уу.',
                        created_date: 'Бүртгэсэн огноо',
                        created_user: 'Бүртгэсэн хэрэглэгч',
                        delete_button: '',
                    },
                    timetable: {
                        room: 'Өрөө',
                        add_subject: 'Хичээл нэмэх',
                        choose_day: 'Гараг сонгоно уу',
                        select_class: 'Анги сонгоно уу',
                        select_students: 'Сурагч сонгоно уу',
                        select_subject: 'Хичээл сонгоно уу',
                        title: 'Хичээлийн хуваарь',
                        club_title: 'Дугуйлангийн хуваарь',
                        subject: 'Хичээл',
                        teacher: 'Багш',
                        score_weight: 'Үнэлэх хувь',
                        get_previous_season_data: 'Өмнөх улирлын мэдээллийг татах',
                        monday: 'Даваа',
                        tuesday: 'Мягмар',
                        wednesday: 'Лхагва',
                        thursday: 'Пүрэв',
                        friday: 'Баасан',
                        add: 'Хичээлийн хуваарь нэмэх',
                        day: 'Гараг',
                        time: 'Цаг',
                        edit: 'Хичээлийн хуваарь засах',
                        class_student: 'Бүгд судлах',
                        class_all_students: 'ангийн бүх сурагчид',
                        group_student: 'Группээр судлах',
                        day_not_empty: 'Сонгосон өдөр хичээлийн хуваарь бүртгэгдсэн байгаа тул хичээлийн хуваарь засах дарж өөрчлөлт оруулна уу',
                        time_not_empty: 'Сонгосон өдрийн цаг давхцаж байна',
                        empty_timetable: 'Хичээлийн хуваарь бүртгэгдээгүй байна. Та "Хичээлийн хуваарь" дэд цэс рүү орж хичээлийн хуваариа оруулна уу.',
                        check_group_info: 'Группийн мэдээллийг дутуу бөглөсөн байна',
                        download_last_season_timetable: 'ӨМНӨХ УЛИРЛЫН ХУВААРИЙГ ТАТАХ',
                        select_day: 'Өдөр сонгоно уу!',
                        empty: 'Хуваарь үүсгээгүй байна',
                    },
                    homework: {
                        assigned: 'Гэрийн даалгавар өгсөн',
                        assign_date: 'Даалгаврын огноо',
                        checked_date: 'Шалгасан огноо',
                        checked: 'Гэрийн даалгавар шалгасан',
                        checkedHomework: 'Шалгасан ГД',
                        title: 'Гэрийн даалгавар',
                        totalHomework: 'Нийт ГД',
                        date_description: 'Гэрийн даалгавар шалгах огноо',
                        delete_homework_info: 'Мэдээлэл устгах уу',
                        delete_homework: 'Гэрийн даалгаврыг устгах уу?',
                        delete_homework_description: 'Гэрийн даалгавар устгасны дараа уг гэрийн даалгавартай холбоотой мэдээллүүдийг сэргээх боломжгүйг анхаарна уу',
                        delete_student_homework: 'Сурагчийн гэрийн даалгаврын мэдээллийг устгах уу',
                        delete_student_homework_description: 'Устгасан тохиолдолд дахин сэргээх боломжгүйг анхаарна уу.',
                        score: 'Авах оноо',
                        file: 'Файл',
                        file_loading: 'Файлыг дуудаж байна',
                        insert_file: 'файл оруулах',
                        select_file: 'Файл сонгоно уу',
                        no_file: 'Файл оруулаагүй байна',
                        not_found: 'Гэрийн даалгавар өгөөгүй байна',
                        file_warning_message: 'Авах оноог өөрчилвөл сурагчийн мэдээлэл дахин бодогдохыг анхаарна уу !!!',
                        homework_assigned_already: 'Сонгосон өдөрт гэрийн даалгавар өгсөн байна',
                        homework_check: 'Гэрийн даалгавар шалгах',
                        homework: 'Гэрийн даалгавар өгөх',
                        homework_due_date: 'Шалгах огноо',
                        homework_due_date_error: 'Шалгах гэрийн даалгаврын огноо нь өнөөдөр эсвэл өмнөх үеийнх байх шаардлагатай. Та огноогоо шалгана уу.',
                        homework_sent: 'Илгээсэн',
                        toDo: 'Хийх',
                        complete: 'Бүрэн',
                        incomplete: 'Дутуу',
                        homework_not_sent: 'Илгээгээгүй',
                        score_higher_that_max_score: 'сурагчийн гэрийн даалгаврын авсан оноо авах онооноос их байна',
                        score_lower_that_max_score: 'сурагчийн гэрийн даалгаврын авсан оноо авах онооноос бага байна',
                        empty_score: 'сурагчийн гэрийн даалгаврын авсан оноо хоосон байна, оноо оруулна уу',
                        please_select_status: 'Гэрийн даалгаврын гүйцэтгэлийн төлвийг сонгоно уу.',
                        done: 'Хийсэн',
                        not_done: 'Хийгээгүй',
                        not_checked: 'Шалгаагүй',
                        total_score_error: 'Оноо нь нийт авах боломжтой онооноос их байж болохгүй',
                    },
                    homeworkReport: {
                        title: 'Гэрийн даалгаврын мэдээлэл',
                        class_club: 'Анги / Дугуйлан',
                        subject: 'Хичээл',
                        season: 'Улирал',
                        homework: 'Даалгавар',
                        notChecked: 'Шалгаагүй',
                        notCheckedShortName: 'ШГ',
                        insert_class_club: 'Анги / Дугуйлан сонгоно уу',
                        insert_subject: 'Хичээл сонгоно уу',
                        insert_season: 'Улирал сонгоно уу',
                        insert_score: 'Оноо оруулна уу',
                        score: 'Оноо',
                        takenScore: 'Авсан оноо',
                    },
                    homeworkDashboard: {
                        title: 'Гэрийн даалгавар',
                        seasonText: 'Улирал',
                        dateText: 'Огноо',
                        showText: 'ХАРАХ',
                        errorFields: 'Дараах талбаруудыг сонгон оруулна уу !!!',
                        by_class: 'Бүлгээр',
                        by_subject: 'Хичээлээр',
                        by_teacher: 'Багшаар',
                    },
                    homeworkDashboardDtClass: {
                        class_name: 'Бүлэг',
                        total: 'Нийт'
                    },
                    homeworkDashboardDtClassModal: {
                        due_date: 'Огноо',
                        subject_name: 'Хичээл',
                        first_name: 'Багш',
                        complete: 'Б',
                        incomplete: 'Д',
                        no_assignment: 'ХГ',
                    },
                    homeworkDashboardDtTeacherModal: {
                        due_date: 'Огноо',
                        subject_name: 'Хичээл',
                        class_name: 'Бүлэг',
                        complete: 'Б',
                        incomplete: 'Д',
                        no_assignment: 'ХГ',
                    },
                    nfc: {
                        title: 'NFC бүртгэл'
                    },
                    notification: {
                        unreadNotification: 'Уншаагүй [number] сонордуулга байна',
                        readAll: 'Бүгдийг уншсан болгох'
                    },
                    teacher: {
                        add_teacher: 'Багш нэмэх',
                        title: 'Багш',
                        timeTableCount: 'Хичээлтэй цаг',
                        working: 'Ажиллаж байгаа',
                        not_working: 'Ажлаас гарсан',
                        add: 'Шинээр нэмэх',
                        photo: 'Зураг',
                        lastname: 'Багшийн овог',
                        name: 'Багшийн нэр',
                        phone_number: 'Утасны дугаар',
                        examGroupCount: 'Дүн гарсан бүлгийн тоо',
                        code: 'Багшийн код',
                        subjects: 'Заадаг хичээл',
                        subjectCount: 'Хичээл ордог бүлгийн тоо',
                        teacher_class: 'Даасан анги',
                        list: 'Багш жагсаалт',
                        login_name: 'Нэвтрэх нэр',
                        current_login_name: 'Одоо ашиглаж байгаа нэвтрэх нэр',
                        new_login_name: 'Шинэ нэвтрэх нэр',
                        new_login_name_repeat: 'Шинэ нэвтрэх нэр дахин оруулах',
                        new_lastname: 'Овог',
                        new_lastname_placeholder: 'Овог оруулна уу',
                        new_name: 'Нэр',
                        new_name_placeholder: 'Нэр оруулна уу',
                        note: 'Багшийн тэмдэглэл',
                        insert_phone_number: 'Утасны дугаар оруулна уу',
                        insert_teacher_code: 'Багшийн код оруулна уу',
                        insert_teacher_title: 'Албан тушаал оруулна уу',
                        teacher_title: 'Албан тушаал',
                        role: 'Багшийн зэрэг',
                        select_role: 'Багшийн зэрэг сонгоно уу',
                        view: 'Үзэх',
                        info_add: 'Багшийн мэдээлэл нэмэх',
                        insert_info: 'Багшийн мэдээлэл оруулна уу',
                        excuse: 'Багшийг ажлаас чөлөөлөх',
                        excuseStaff: 'Ажилтныг ажлаас чөлөөлөх',
                        gender: 'Хүйс',
                        select_gender: 'Хүйс сонгох',
                        select_school: 'Сургууль сонгох',
                        teacher_info: 'Багшийн товч мэдээлэл',
                        role_teacher: 'Багш',
                        role_director: 'Захирал',
                        role_staff: 'Нийгмийн ажилтан',
                        role_school_staff: 'Сургуулийн ажилтнууд',
                        role_manager: 'Хичээлийн эрхлэгч',
                        role_lead_teacher: 'Ахлах багш',
                        change_photo: 'Зураг солих',
                        set_teacher: 'Багш төлөвт оруулах',
                        set_staff: 'Ажилтан төлөвт оруулах',
                        change_status: 'Багшийн төлөв өөрчлөх',
                        change_status_staff: 'Ажилтны төлөв өөрчлөх',
                        set_teacher_button_label: 'БАГШ ТӨЛӨВТ ОРУУЛАХ',
                        edit: 'Багш засах',
                        editInfo: 'Багшийн мэдээлэл засах',
                        select_school_grade: 'Сургуулийн түвшин сонгоно уу',
                        change_phone_number_description: 'Багшийн дугаарыг сольсноор өмнөх дугаараар нэвтрэх боломжгүй болохыг анхаараарай.',
                        change_login_name_description: 'Багшийн нэвтрэх нэрийг сольсноор өмнөх нэвтрэх нэрээр нэвтрэх боломжгүй болохыг анхаараарай.',
                        change_login_name_description_staff: 'Ажилтны нэвтрэх нэрийг сольсноор өмнөх нэвтрэх нэрээр нэвтрэх боломжгүй болохыг анхаараарай.',
                        change_phone_number: 'Багшийн дугаар солих',
                        change_login_name: 'Багшийн нэвтрэх нэр солих',
                        change_login_name_staff: 'Ажилтны нэвтрэх нэр солих',
                        change_password: 'Багшийн нууц үг солих',
                        change_password_staff: 'Ажилтны нууц үг солих',
                        change_password_description: 'Багшийн нууц үгийг сольсноор хуучин нууц үгээрээ нэвтрэх боломжгүй болохыг анхаарна уу!',
                        change_password_description_staff: 'Ажилтны нууц үгийг сольсноор хуучин нууц үгээрээ нэвтрэх боломжгүй болохыг анхаарна уу!',
                        manage_roles: 'Багшийн эрх солих',
                        staff_code: 'Ажилтны код',
                        staff_card_title: 'Багш ажилтны үнэмлэх',
                        journal: 'Журнал',
                        journalNoteEmpty: 'Хичээлийн хуваарь сонгоно уу',
                        journalExcelTemplate: 'Загвар татах',
                        hw: 'Гд',
                        classThatWillTakeExam: 'Шалгалт авах анги',
                        onlineLesson: {
                            title: 'Цахим сургалт',
                            createCourse: 'Курс үүсгэх',
                            createNewCourse: 'Шинэ курс үүсгэх',
                            lesson: 'Ээлжит хичээл',
                            group: 'Хичээлийн бүлгүүд',
                            collaboratingTeacher: 'Хамт орох багш',
                            activityName: 'Хичээлийн гарчиг',
                            enrollStudents: 'Сурагчдыг элсүүлэх',
                            inCourse: 'Хичээлд хамрагдаж байгаа',
                            toCourse: 'Курс рүү шилжих',
                            editCourse: 'Курс засах',
                            courseUrl: 'Курсийн URL',
                            changeLink: 'Линк солих',
                            userCode: 'Хэрэглэгчийн код',
                            canEdit: 'Засах эрхтэй эсэх',
                            addUser: 'Хэрэглэгч нэмэх',
                            notFound: 'Цахим хичээл одлсонгүй',
                            purpose: 'Зорилго',
                            conclusion: 'Дүгнэлт',
                            learningObjectives: 'Суралцахуйн зорилт',
                        }
                    },
                    group: {
                        addClass: 'Бүлэг нэмэх',
                        addStudent: 'Сурагч нэмэх',
                        approveStudents: 'Сурагчдыг баталгаажуулах',
                        title: 'Бүлэг',
                        type: 'Төрөл',
                        class_teacher_title: 'Анги даасан багш',
                        student_count: 'Сурагчдын тоо',
                        score_type: 'Үнэлгээний төрөл',
                        classroom: 'Өрөө',
                        school_shift: 'Ээлж',
                        grade: 'Түвшин',
                        select_grade: 'Түвшин сонгоно уу',
                        code: 'Ангийн код',
                        class_teacher: 'Ангийн багш',
                        list: 'Бүлэг жагсаалт',
                        edit: 'Бүлэг засах',
                        year: 'Он',
                        name: 'Анги',
                        calendar: 'Ангийн календарь',
                        teacher_list: 'Багшийн жагсаалт',
                        group_not_found: 'Группийн мэдээлэл олдсонгүй',
                        addAgain: 'Дахин бүлэг нэмэх',
                        integratedGroup: 'Нэгдсэн групп',
                        integratedGroupName: 'Нэгдсэн Группийн нэр'

                    },
                    subject: {
                        index: 'Индекс',
                        credit: 'Багц цаг',
                        name: 'Хичээлийн нэр',
                        code: 'Хичээлийн код',
                        teacher: 'Заах багш',
                        subject_class: 'Ордог анги',
                        title: 'Хичээл',
                        type: 'Төрөл',
                        insert_index: 'Хичээлийн индекс оруулна уу',
                        insert_name: 'Хичээлийн нэр оруулна уу',
                        insert_teacher: 'Заах багш оруулна уу',
                        list: 'Хичээлийн жагсаалт',
                        subject_type: 'Хичээлийн төрөл',
                        grade: 'Түвшин',
                        close_button_label: 'ХААХ',
                        edit: 'Хичээл засах',
                        insert_credit: 'Багц цаг оруулна уу',
                        select_subject_type: 'Хичээлийн төрөл сонгоно уу',
                        select_teacher: 'Заах багш сонгоно уу',
                        isAll: 'Бүгд судлах эсэх ',
                        isResult: 'Дүн гаргах эсэх',
                        courseActivities: 'хичээлийн үйл ажиллагаа'
                    },
                    student_card: {
                        title: 'Сурагчийн үнэмлэх',
                        create: 'Сурагчийн үнэмлэх үүсгэх',
                        grade: 'Түвшин',
                        class_title: 'Бүлэг',
                        select_all_students: 'Бүх сурагчдыг сонгох',
                        close_button_label: 'ХААХ',
                        order: 'Үнэмлэх захиалах',
                        print: 'Сурагчийн үнэмлэх хэвлэх',
                        card_recreate: 'Сурагчийн үнэмлэхийг хүчингүй болгож шинээр хэвлэх үү?',
                        recreate: 'Дахин үүсгэх',
                        printed: 'Хэвлэсэн',
                        printed_date: 'Хэвлэсэн огноо',
                        print_description: 'Сурагчдын үнэмлэхийг хэвлэх үү?',
                        print_recreate_description: 'Дараах сурагчдын одоо байгаа "Сурагчийн үнэмлэх"-ийг хүчингүй болгож шинээр хэвлэх үү? Зөвшөөрч байгаа сурагчийн нэрсийг сонгоно уу.',
                        connect_student: 'Сурагч холбох',
                    },
                    calendar: {
                        title: 'Сургуулийн календарь',
                        color: 'Өнгө',
                        add_activity: 'Үйл ажиллагаа нэмэх',
                        no_event: 'Үйл ажиллагаа олдсонгүй',
                        activity: 'Үйл ажиллагаа',
                        activity_name: 'Үйл ажиллагааны нэр',
                        start_end_date: 'Эхлэх, дуусах огноо',
                        start_end_time: 'Эхлэх, дуусах',
                        is_full_day: 'Бүтэн өдөр үргэлжлэх эсэх',
                        length: 'Үргэлжлэх цаг',
                        description: 'Тайлбар',
                        today: 'Өнөөдөр',
                        view_event: 'Үйл ажиллагаа үзэх',
                        start_date: 'Эхлэх огноо',
                        end_date: 'Дуусах огноо',
                        edit_event: 'Үйл ажиллагаа засах',
                        month: 'Сар',
                        week: '7 хоног',
                        day: 'Өдөр',
                        list: 'Жагсаалт',
                        all_day: 'Бүтэн өдөр',
                        enter_event_name: 'Үйл ажиллагааны нэр оруулна уу.',
                        enter_start_date: 'Эхлэх огноо оруулна уу',
                        enter_end_date: 'Дуусах огноо оруулна уу',
                        enter_start_time: 'Эхлэх цаг оруулна уу',
                        enter_end_time: 'Дуусах цаг оруулна уу',
                        time_duplicate: 'Цаг давхцаж байна',
                    },
                    parents: {
                        confirmed: 'Зөвшөөрсөн',
                        total_parents: 'Нийт эцэг эхчүүдийн тоо',
                        no_parent: 'Эцэг эх нь ороогүй сурагчид',
                        parent_user_expired: 'Үйлчилгээний эрх хаагдсан',
                        parentTotalTime: 'Эцэг эхчүүдийн нийт ашигласан цаг',
                        close_button_label: 'ХААХ',
                        user_name: 'Хэрэглэгчийн нэр',
                        title: 'Асран хамгаалагч',
                        settings: 'Асран хамгаалагчийн тохиргоо',
                        pendingConfirmation: 'Зөвшөөрөл хүлээж байгаа'
                    },
                    movement: {
                        between_success: 'Шилжилт хөдөлгөөн амжилттай хийгдлээ',
                        title: 'Шилжилт хөдөлгөөн',
                        out_title: 'Шилжин явах',
                        entry_date: 'Элссэн огноо',
                        in: 'Шилжин ирэх',
                        print_register_sheet: 'Бүртгэлийн хуудас хэвлэх',
                        register_sheet: 'Бүртгэлийн хуудас',
                        register_sheet_description: 'Шинээр бүртгэсэн сурагчийн мэдээлэл бүхий "Бүртгэлийн хуудас"-г хэвлэж нэг хувийг эцэг эхэд өгнө. Үлдсэн хувийг санхүү хариуцсан ажилтанд хүлээлгэн өгнө.',
                        add_student: 'Сурагч нэмэх',
                        add_one_student: 'Нэг сурагч нэмэх',
                        add_multiple_students: 'Олон сурагч нэмэх',
                        add: 'Сурагч нэмэх',
                        force_movement: 'Сурагч дээрх нэхэмжлэх/зээл төлөөгүй байна. Өртэйгээр сургуулиас шилжүүлэх тохиолдолд урдах сонголтыг сонгоно уу. Тайлбар хэсэгт төлбөрийн үлдэгдлийн талаар дэлгэрэнгүй бичнэ үү.',
                        from_school_name: 'Ирсэн сургууль',
                        insert_code: 'Код оруулна уу',
                        last_name: 'Эцгийн нэр',
                        out_action: 'Бүртгэлээс хасах',
                        out_success: 'Сурагчийг бүртгэлээс хаслаа',
                        insert_last_name: 'Овог оруулна уу',
                        insert_first_name: 'Нэр оруулна уу',
                        birth_date: 'Төрсөн өдөр',
                        insert_register_number: 'Регистрийн дугаар оруулна уу',
                        from_class: 'Явсан анги',
                        to_class: 'Очсон анги',
                        transfer: 'Шилжүүлэх',
                        between: 'Дотоод шилжилт',
                        view: 'Үзэх',
                        between_new: 'Дотоод шилжилт нэмэх',
                        between_title: 'Дотоод шилжилт хөдөлгөөн',
                        select_student: 'Сурагч сонгоно уу',
                        up: 'Анги дэвших',
                        up_class: 'Дэвшсэн анги',
                        up_class_title: 'Дэвшин орох анги',
                        up_date: 'Дэвшүүлсэн огноо',
                        up_title: 'Анги дэвшүүлэх',
                        up_user: 'Дэвшүүлсэн хэрэглэгч',
                        no_year: 'Анги дэвшүүлэх хичээлийн жил үүсээгүй байна',
                        no_classes_next_year: 'Дэвших хичээлийн жилд анги үүсээгүй байна',
                        to_class_title: 'Шилжин очих анги',
                        qr_1: '1. Зүүн талын QR кодыг уншуулан eParent апп-ийг татаж авна.',
                        qr_2: '2. Өөрийн мэдээллээр бүртгүүлнэ.',
                        qr_3: '3. Хүүхэд нэмэх хэсгээр дээрх QR кодыг уншуулснаар хүүхдийнхээ мэдээллийг харна.',
                    },
                    exam: {
                        title: 'Шалгалт',
                        subject: 'Хичээл',
                        flow_exam: 'Явцын шалгалт',
                        season_exam: 'Үр дүнгийн үнэлгээ',
                        date: 'Шалгалтын огноо',
                        name: 'Шалгалтын нэр',
                        create: 'Шалгалт үүсгэх',
                        template_name: 'Загварын нэр',
                        season: 'Улирал',
                        seasonToPull: 'Татах улирал',
                        report: 'Тайлан',
                        list: 'Жагсаалт',
                        students_progress: 'Сурагчдын ахиц',
                        insert_score: 'Дүн оруулах',
                        full_score: 'Бүтэн оноо авсан',
                        exam_regard: 'Анхаарах',
                        max_average: 'Дээд дундаж',
                        max_score: 'Дээд оноо',
                        min_average: 'Доод дундаж',
                        min_score: 'Доод оноо',
                        notFound: 'Шалгалтын мэдээлэл олдсонгүй',
                        score: 'Дүн',
                        exam_all_student_count_title: 'Дүгнэгдэх',
                        exam_student_count_title: 'Дүгнэгдсэн',
                        calculate_generalization: 'Нэгтгэл бодох',
                        calculate_ranking: 'Чансаа бодох',
                        ranking: 'Чансаа',
                        score_type: 'Үнэлгээ',
                        score_empty: 'Оноо оруулна уу',
                        exam_complete: 'Бүрэн',
                        exam_incomplete: 'Дутуу',
                        exam_no_score: 'Огт хийгээгүй',
                        performance_percent: 'Гүйцэтгэлийн хувь',
                        publish_description: 'Шалгалтыг баталгаажуулснаар таны оруулсан дүнгүүд шууд эцэг эхчүүдэд харагдах бөгөөд Та мэдээллийг засах, устгах боломжгүй болно.',
                        publish_title: 'Шалгалтын дүнг баталгаажуулснаар дахин засах, устгах боломжгүй болохыг анхаарна уу.',
                        publish_title_season: 'Дүнг баталгаажуулснаар дахин засах, устгах боломжгүй болохыг анхаарна уу.',
                        publish_title_description: 'Зөвхөн баталгаажуулсан дүнгүүд анги даасан багш болон эцэг эхчүүдэд харагдана.',
                        insert_exam_template_question: 'Шалгалтын загварын даалгавар оруулна уу',
                        insert_with_percentage: 'Дүнг бүртгэхдээ хувиар тооцох',
                        delete_student_score_title: 'Сурагчийн дүнг устгах уу?',
                        delete_student_score: 'Сурагчийн дүн устгах',
                        taken_score: 'Авсан оноо',
                        exam_total_score: 'Авах оноо',
                        score_higher_that_max_score: 'сурагчийн шалгалтын авсан оноо авах онооноос их байна',
                        score_lower_that_max_score: 'сурагчийн шалгалтын авсан оноо авах онооноос бага байна',
                        empty_score: 'сурагчийн шалгалтын авсан оноо хоосон байна, оноо оруулна уу',
                        warning_message: 'Шалгалтын авах оноог өөрчилвөл сурагчийн оноог дахин бодогдохыг анхаарна уу !!!',
                        average_success: 'Ерөнхий дүнгийн амжилт',
                        changePercentage: 'Хувийг өөрчлөх',
                        changeScore: 'Оноог өөрчлөх',
                        yearType: 'Хагас жил',
                        weightEmpty: 'Эзлэх хувь оруулна уу',
                        weightError: 'Нийт эзлэх хувь 100хувь болох шаардлагатай'
                    },
                    evaluation: {
                        title: 'Хандлага, төлөвшилт'
                    },
                    absent: {
                        attachmentView: 'Хавсралт харах',
                        title: 'Чөлөө',
                        created_user: 'Үүсгэсэн хэрэглэгч',
                        period: 'Цаг',
                        request: 'Чөлөөний хүсэлт',
                        select_type: 'Чөлөөний төрөл сонгоно уу',
                        registration: 'Чөлөө бүртгэл',
                        view: 'Үзэх',
                        register: 'Чөлөө бүртгэх',
                        request_sender: 'Хүсэлт илгээсэн',
                        reason: 'Шалтгаан',
                        start_date: 'Эхлэх',
                        end_date: 'Дуусах',
                        description: 'Тайлбар',
                        subject_name: 'Хичээл',
                        user: 'Хэрэглэгч',
                        sick: 'Өвчтэй',
                        excused: 'Чөлөөтэй',
                        excuseSettingUser: 'Зөвшөөрөх хэрэглэгч',
                        excuseSettings: 'Чөлөөний тохиргоо',
                        excuseSettingsCreate: 'Чөлөөний тохиргоо нэмэх',
                        excuseSettingsEdit: 'Чөлөөний тохиргоо засах',
                        excuseMinDay: 'min өдөр',
                        excuseMaxDay: 'max өдөр',
                        day: 'Өдөр',
                        time: 'Цаг',
                        response: 'Чөлөөний хүсэлтэнд хариу өгөх',
                        decline: 'Татгалзах',
                        approve: 'Зөвшөөрөх',
                        select_class: 'Анги сонгоно уу',
                        select_student: 'Сурагч сонгоно уу',
                        select_subject: 'Хичээл сонгоно уу',
                        select_start_date: 'Эхлэх өдөр сонгоно уу',
                        select_end_date: 'Дуусах өдөр сонгоно уу',
                        select_day: 'Өдөр сонгоно уу',
                        select_reason: 'Шалтгаан сонгоно уу',
                        dateError: 'Дуусах огноо нь эхлэх огноонос өмнө байж болохгүй',
                        notResponded: 'Хариулаагүй',
                        requestDate: 'Хүсэлтийн огноо',
                        respondedUser: 'Хариулсан хэрэглэгч',
                    },
                    exam_template: {
                        question_number: 'Асуултын №',
                        answer: 'Хариу',
                        title: 'Шалгалтын загвар',
                        select: 'Шалгалтын загвар сонгоно уу',
                        code: 'Загварын код',
                        name: 'Загварын нэр',
                        exam_type: 'Шалгалтын төрөл',
                        subject: 'Хичээл',
                        category: 'Категори',
                        subject_category: 'Хичээлийн категори',
                        select_category: 'Категори сонгоно уу',
                        total_question: 'Нийт асуулт',
                        created_date: 'Үүсгэсэн огноо',
                        created_user: 'Үүсгэсэн хэрэглэгч',
                        disable: 'Хүчингүй болгох',
                        answer_disable: 'Хариулт хүчингүй болгох',
                        view: 'Үзэх',
                        question: 'Асуулт',
                        question_score: 'Асуулт оноо',
                        number: 'Тоо',
                        insert_number: 'Тоо оруулна уу',
                        create_question_please: 'Асуулт ',
                        total_score: 'Авах оноо',
                        only_me: 'Зөвхөн би ашиглана',
                        not_only_me: 'Бүгд ашиглана',
                        confirmation: 'Баталгаажуулах',
                        task: 'Даалгавар',
                        score: 'Оноо',
                        insert_score: 'Оноо оруулна уу',
                        insert_code: 'Код оруулна уу',
                        insert_name: 'Нэр оруулна уу',
                        choose_template_name: 'Загварын нэр оруулна уу',
                        choose_exam_type: 'Шалгалтын төрөл оруулна уу',
                        select_subject: 'Хичээл сонгоно уу',
                        select_exam_type: 'Шалгалтын төрөл сонгоно уу',
                        exam_complete: 'Бүрэн хийсэн',
                        exam_incomplete: 'Дутуу хийсэн',
                        exam_no_score: 'Огт хийгээгүй'
                    },
                    omr_exam_template: {
                        title: 'Нэгдмэл шалгалтын загвар',
                        file: 'Нэгдмэл шалгалтын файлын нэр',
                        insert_file: 'Нэгдмэл шалгалтын файлын нэр оруулна уу',
                        please_select: 'Нэгдмэл шалгалтын загвар оруулна уу',
                        empty: 'Хоосон',
                        subject_group: 'Хичээлийн бүлэг'
                    },
                    omr_exam: {
                        title: 'Нэгдмэл шалгалт'
                    },
                    season_score: {
                        calculate: 'Бодох',
                        calculated_exam_count: 'Дүн баталгаажсан хичээлийн тоо',
                        title: 'Ангийн улирлын дүн',
                        total_subject_count: 'Нийт хичээлийн тоо',
                        subject_count: 'Хичээлийн тоо',
                        report: 'Тайлан',
                        list: 'Жагсаалт',
                        flow_season_score: 'Улирлын дүн',
                        students_progress: 'Сурагчдын ахиц',
                        student_progress: 'Сурагчийн ахиц',
                        board: 'Дүнгийн хавтгай',
                        board_unpublish_description: 'Дүнгийн хавтгайг хүчингүй болгох уу?',
                        season: 'Улирал',
                        performance: 'Гүйцэтгэл',
                        quality: 'Чанар',
                        success: 'Амжилт',
                        student_count: 'Сурагчийн тоо',
                        published_date: 'Баталгаажуулсан огноо',
                        method: 'Аргачлал',
                        total_average: 'Ерөнхий дүн',
                        subject: 'Хичээл',
                        disable: 'Идэвхгүй болгох',
                        view: 'Үзэх',
                        create_class_board: 'Ангийн дүнгийн хавтгай үүсгэх',
                        published: 'Улирлын дүн баталгаажсан',
                        publish_description: 'Баталгаажсан дүнгийн хавтгайг засах устгах боломжгүйг анхаарна уу',
                        select_class: 'Бүлэг сонгоно уу',
                        select_season: 'Улирал сонгоно уу',
                        select_method: 'Аргачлал сонгоно уу',
                        score_template: 'Үнэлгээний бүтэц',
                        select_score_template: 'Үнэлгээний бүтэц сонгоно уу',
                        select_score_template_dtl: 'Үнэлгээний бүтцийн задаргаа сонгоно уу',
                        skill: 'Ур чадварын үнэлгээ',
                        total_credit: 'Нийт цаг',
                        chooseExam: 'Шалгалт сонгох',
                        examChoice: {
                            title: 'Улирлын дүнд нөлөөлөх шалгалтуудаа сонгоно уу.',
                            description: 'Таны сонгосон үнэлгээний бүтцэд шалгалтын дүн нөлөөлнө гэж тохируулсан байна.',
                        },
                        skillChoice: {
                            title: 'Улирлын дүнд нөлөөлөх үнэлгээ сонгоно уу.',
                            description: 'Таны сонгосон үнэлгээний бүтцэд ур чадварын үнэлгээ нөлөөлнө гэж тохируулсан байна.',
                        },
                        chooseOne: 'Дор хаяж нэг шалгалт сонгоно уу'
                    },
                    school_settings: {
                        attendanceType: 'Ирцийн төлөв',
                        attendanceTypeConfig: 'Ирцийн тохиргоо',
                        attendanceTypeDescription: 'Ирцийн төлөвт оноо өгөх үү?',
                        attendanceTypeFullDescription: 'Ирцийн төлөвт оруулсан оноо нь дүн гаргах үед татагдах ирцийн оноонд нөлөөлөхийг анхаарна уу',
                        attendanceTypeScore: 'Төлвийн оноо',
                        capacity: 'Суудал',
                        capacity_number: 'Суудлын тоо',
                        detention: 'Сахилга бат',
                        detention_add: 'Төрөл нэмэх',
                        detention_edit: 'Төрөл засах',
                        detention_type: 'Сахилгын төрөл',
                        detention_description: 'Үүсгэсэн асуудал',
                        room_number: 'Өрөөний дугаар',
                        register_room: 'Өрөө бүртгэх',
                        parent: 'Харьяалах',
                        relationHasConfirmation: 'Ангийн багш зөвшөөрөл өгөх эсэх',
                        title: 'Сургуулийн тохиргоо',
                        group_type: 'Бүлгийн төрөл',
                        year: 'Хичээлийн жил',
                        previous_year: 'Өмнөх хичээлийн жил',
                        current_year: 'Харьяалах жил',
                        previous_season: 'Өмнөх улирал',
                        parent_season: 'Харьяалах улирал',
                        parent_year: 'Харьяалах хичээлийн жил',
                        add_year: 'Хичээлийн жил нэмэх',
                        insert_code: 'Код оруулна уу',
                        insert_name: 'Нэр оруулна уу',
                        is_current_season: 'Одоогийн улирал эсэх',
                        is_timetable: 'Хичээлийн хуваарь үүсгэх эсэх',
                        is_exam: 'Шалгалт авах эсэх',
                        is_result: 'Дүн гаргах эсэх',
                        edit_year: 'Хичээлийн жил засах',
                        delete_season: 'Улирал устгах',
                        delete_season_description: 'Улирал устгах гэж байна. Устгасан мэдээллийг дахин сэргээх боломжгүйг анхаарна уу',
                        group_setting: 'Бүлгийн тохиргоо',
                        group_type_setting: 'Бүлгийн төрөл тохиргоо',
                        group_type_add: 'Бүлгийн төрөл нэмэх',
                        insert_current_year: 'Харьяалах жил оруулна уу',
                        group_type_edit: 'Бүлгийн төрөл засах',
                        group_setting_add: 'Бүлгийн төрөл тохиргоо',
                        subject_type: 'Хичээлийн төрөл',
                        insert_subject_type: 'Хичээлийн төрөл оруулна уу',
                        select_group_type: 'Бүлгийн төрөл сонгоно уу',
                        score_template: 'Үнэлгээний бүтэц',
                        score_template_edit: 'Үнэлгээний бүтэц засах',
                        score_template_add: 'Үнэлгээний бүтэц нэмэх',
                        view: 'Үзэх',
                        is_ranked: 'Чансаа бодох эсэх',
                        requirement: 'Үзүүлэлт',
                        is_editable: 'Засах эсэх',
                        weight: 'Эзлэх хувь',
                        location: 'Байршил',
                        manager: 'Менежер тохиргоо',
                        master_data: 'Мастер дата',
                        maxScore: 'Дээд хувь',
                        minScore: 'Доод хувь',
                        ordering: 'Дараалал',
                        score_template_delete_description: 'Үнэлгээний бүтэц устгах гэж байна. Устгасан мэдээллийг дахин сэргээх боломжгүйг анхаарна уу',
                        score_template_disable_title: 'Үнэлгээний бүтэц хүчингүй төлөвт шилжүүлэх үү?',
                        score_template_disable_description: 'Үнэлгээний бүтэц хүчингүй болгосноор тухайн үнэлгээний бүтцийг ашиглах боломжгүй болохыг анхаарна уу!',
                        school_shift: 'Хичээлийн ээлж',
                        delete_school_shift: 'Ээлж устгах',
                        delete_school_shift_description: 'Ээлж устгах гэж байна. Устгасан тохиолдолд дахин сэргээх боломжгүйг анхаарна уу',
                        add_school_shift: 'Ээлж нэмэх',
                        edit_school_shift: 'Ээлж засах',
                        school_logo: 'Сургуулийн лого',
                        delete_school_logo: 'Сургуулийн лого устгах',
                        delete_school_logo_description: 'Сургуулийн лого устгах гэж байна. Устгасан тохиолдолд дахин сэргээх боломжгүйг анхаарна уу',
                        class_type: 'Ангийн төрөл',
                        add_class_type: 'Ангийн төрөл нэмэх',
                        edit_class_type: 'Ангийн төрөл засах',
                        delete_class_type: 'Ангийн төрөл устгах',
                        delete_class_type_description: 'Ангийн төрөл устгах гэж байна. Устгасан тохиолдолд дахин сэргээх боломжгүйг анхаарна уу',
                        bell_schedule: 'Хонхны хуваарь',
                        add_bell_schedule: 'Хонхны хуваарь нэмэх',
                        edit_bell_schedule: 'Хонхны хуваарь засах',
                        delete_bell_schedule: 'Хонхны хуваарь устгах',
                        delete_bell_schedule_description: 'Хонхны хуваарь устгах гэж байна. Устгасан мэдээллийг дахин сэргээх боломжгүйг анхаарна уу',
                        add_score_type: 'Үнэлгээний төрөл нэмэх',
                        edit_score_type: 'Үнэлгээний төрөл засах',
                        delete_score_type: 'Үнэлгээний төрөл засах',
                        delete_score_type_description: 'Үнэлгээний төрөл устгах гэж байна. Устгасан тохиолдолд дахин сэргээх боломжгүйг анхаарна уу',
                        add_subject_type: 'Хичээлийн төрөл нэмэх',
                        edit_subject_type: 'Хичээлийн төрөл засах',
                        delete_subject_type: 'Хичээлйин төрөл устгах',
                        delete_subject_type_description: 'Хичээлийн төрөл устгах гэж байна. Устгасан тохиолдолд дахин сэргээх боломжгүйг анхаарна уу',
                        add_exam_type: 'Шалгалтын төрөл нэмэх',
                        edit_exam_type: 'Шалгалтын төрөл засах',
                        delete_exam_type: 'Шалгалтын төрөл устгах',
                        delete_exam_type_description: 'Шалгалтын төрөл устгах гэж байна. Устгасан тохиолдолд дахин сэргээх боломжгүйг анхаарна уу',
                        short_name: 'Богино нэр',
                        long_name: 'Урт нэр',
                        add_class_grade: 'Ангийн түвшин нэмэх',
                        edit_class_grade: 'Ангийн түвшин засах',
                        edit_class: 'Анги засах',
                        add_class: 'Анги нэмэх',
                        current_class: 'Харьяалах анги',
                        select_current_class: 'Харьяалах анги сонгоно уу',
                        prev_season_class: 'Өмнөх оны анги',
                        select_prev_season_class: 'Өмнөх оны анги сонгоно уу',
                        delete_class: 'Анги устгах',
                        delete_class_description: 'Анги устгах гэж байна. Устгасан тохиолдолд дахин сэргээх боломжгүйг анхаарна уу',
                        is_class: 'Ангиар хичээллэдэг эсэх',
                        include_exam_type: 'Шалгалтын төрөл хамааруулах',
                        abbreviation: 'Товчлол',
                        view_score_type: 'Үнэлгээний төрөл үзэх',
                        min_score_short: 'Доод',
                        max_score_short: 'Дээд',
                        is_club: 'Дугуйлан эсэх',
                        logout_to_see_difference: 'Амжилттай хадгалагдлаа өөрчлөлтийг дахин нэвтэрч харна уу'
                    },
                    topic: {
                        current_topic: 'Харьяалах сэдэв',
                        topic: 'Сэдэв'
                    },
                    foodIncomes: {
                        income: 'Орлого',
                        cash: 'Касс',
                        current: 'Харилцах',
                        view: 'Үзэх',
                        receipt_number: 'Баримтын дугаар',
                        undo: 'Төлбөрийг буцаах',
                        undo_description: 'Та бүртгэсэн төлбөрийн мэдээллийг буцаахдаа итгэлтэй байна уу? Устгасан төлбөрийн нэхэмжлэхийг дахин үүсгэх шаардлагатайг анхаарна уу.',
                        create_cash: 'Касс бүртгэх',
                        create_current: 'Харилцах бүртгэх',
                        amount: 'Мөнгөн дүн',
                    },
                    students_progress: {
                        title: 'Сурагчдын ахиц',
                        exam_progress: 'Шалгалтын ахиц',
                        behavior: 'Хандлага, төлөвшилт',
                        result: 'Үр дүнгийн үнэлгээ',
                        increased_in_level: 'Түвшиндээ ахисан',
                        increased_over_level: 'Түвшин давж ахисан',
                        increased_subjects: 'Ахисан хичээлүүд',
                        decreased_subjects: 'Буурсан хичээлүүд',
                        decreased_in_level: 'Түвшиндээ буурсан',
                        decreased_over_level: 'Түвшин давж буурсан',
                        season_scoreboard: 'Дүнгийн хавтгай',
                        students_list: 'Сурагчдын жагсаалт',
                        total: 'Нэгтгэл',
                    },
                    err: {
                        select_class: 'Анги сонгоно уу',
                        select_detention: 'Сахилгын төрөл сонгоно уу',
                        select_season: 'Улирал сонгоно уу',
                        select_student: 'Сурагч сонгоно уу',
                        select_invoice: 'Нэхэмжлэх сонгоно уу',
                        select_date: 'Огноо сонгоно уу',
                        select_time: 'Цаг сонгоно уу',
                        select_type: 'Төрөл сонгоно уу',
                        select_room: 'Өрөө сонгоно уу',
                        select_curriculum: 'Хөтөлбөр сонгоно уу',
                        insert_amount: 'Мөнгөн дүн оруулна уу',
                        insert_score: 'Дүн оруулна уу',
                        student_code_empty: 'Сурагчийн код хоосон байна',
                        select_requirement: 'Үзүүлэлт сонгоно уу',
                        select_exam_type: 'Шалгалтын төрөл сонгоно уу',
                        select_score_type: 'Үнэлгээний төрөл сонгоно уу',
                        class_duplicate: 'Анги давхардсан байна',
                        code_duplicate: 'Код давхардсан байна',
                        order_duplicate: 'Дараалал давхардсан байна',
                        image_size_error: 'Зургийн хэмжээ их байна. Зургийн дээд хэмжээ 1 мегабайт байхаар тохируулна уу.',
                        image_type_error: 'Зургийн төрөл тохирохгүй байна. Зургийн төрөл /png, x-png, jpg, jpeg, gif/ байхаар тохируулна уу.',
                        image_type_error_1: 'Зөвхөн файл оруулна уу, зураг оруулах бол зураг оруулах товч дарж оруулна уу',
                        fill_all_fields: 'Мэдээллийг бүрэн бөглөнө үү',
                        delete_info_not_found: 'Устгах мэдээлэл олдсонгүй',
                        edit_info_not_found: 'Засах мэдээлэл олдсонгүй',
                        relation_confirm_empty: 'Зөвшөөрөл өгөх хэрэглэгч сонгоно уу',
                        select_group: 'Бүлэг сонгоно уу',
                        select_exam: 'Шалгалт сонгоно уу',
                        select_template: 'Загвар сонгоно уу',
                        insert_grade_name: 'Бүлгийн нэр оруулна уу',
                        select_teacher: 'Багш сонгоно уу',
                        select_school_shift: 'Ээлж сонгоно уу',
                        enter_email: 'И-мэйл оруулна уу',
                        select_school: 'Сургууль сонгоно уу',
                        enter_existing_phone_number: 'Одоо ашиглаж байгаа дугаар оруулна уу',
                        enter_new_phone_number: 'Шинэ солих дугаар оруулна уу',
                        error_occurred: 'Алдаа гарлаа',
                        enter_valid_date: 'Хугацаа зөв оруулна уу',
                        select_role: 'Эрх сонгоно уу',
                        invalid_image_format: 'Зургийн өргөтгөл буруу байна',
                        invoice_amount: 'Төлөх нэхэмжлэхийн дүн 0 байна.',
                        enter_password: 'Нууц үг оруулна уу',
                        re_enter_password: 'Нууц үг давтан оруулна уу',
                        info_not_found: 'Мэдээлэл байхгүй байна',
                        file_size: 'Файлийн хэмжээ их байна',
                        file_type: 'Файлийн төрөл буруу байна',
                        file_empty: 'Файл хоосон байна',
                        choose_date: 'Огноо сонгоно уу',
                        invalid_email: 'Буруу И-мэйл хаяг',
                    },
                    my: {
                        homework_report: 'Гэрийн даалгаварын тайлан',
                        online_lesson: 'Онлайн хичээл',
                        online_lesson_report: 'Онлайн хичээл тайлан',
                        link: 'Линк',
                        link_name: 'Линк нэр',
                        google_driver: 'GoogleDrive',
                        upload_file: 'Файл хуулах',
                        upload_video: 'Видео хуулах',
                        video: 'Видео',
                        description_text: 'Файлыг сервер лүү хуулахад видеоны хэмжээнээс хамааран бүрэн хуулагдтал тодорхой хугацаа зарцуулагдна. Та файлаа бүрэн хуулагдсан эсэхийг шалгахдаа онлайн хичээл дээрээ дарж шалгаарай.',
                        attention: 'Анхааруулга',
                        in_progress: 'Хуулж байна ...',
                        sent_file: 'Илгээсэн файл',
                        sent_date: 'Илгээсэн огноо',
                        checked_date: 'Шалгасан огноо'
                    },
                    newsfeed: {
                        title: 'Мэдээллийн самбар',
                        title_error: 'Мэдээллийн самбарт текст оруулна уу',
                        file_size_warning: 'Файлын хэмжээ нь 50MB -аас ихгүй байхыг анхаарна уу.',
                        image_count_error: 'Хамгийн ихдээ 10 зураг оруулах боломжтой',
                        likes: 'Дуртай',
                        views: 'Үзсэн',
                        comments: 'Сэтгэгдэл',
                        see_more: 'Үргэлжлүүлэн унших',
                        readNewPost: 'Шинэ мэдээ унших',
                        reply: 'Хариу',
                        reply_comment: 'Хариу бичих',
                        reply_view: 'Хариунуудыг үзэх',
                        post_reply: 'Сэтгэгдэл бичих',
                        show_more_comment: 'өмнөх сэтгэгдлүүдийг унших',
                        show_more_reply: 'өмнөх хариунуудыг унших',
                        post_edit: 'Пост засах',
                        post_delete: 'Пост устгах',
                        config: 'Самбар тохиргоо'
                    },
                    newsfeedConfig: {
                        addRecipient: 'Хүлээн авагч нэмэх',
                        canSeeAllPost: 'Бүх мэдээг харна',
                        canSeeOwnPost: 'Зөвхөн өөрийн мэдээг харна',
                        fromSchool: 'Сургуулиас',
                        parents: 'Эцэг эхчүүд',
                        students: 'Сурагчид',
                        hdrName: 'Нэр',
                        parent_hdr: 'Харьяалагдах самбар',
                        parent_hdr_type: 'Мэдээллийн самбарын төрөл',
                        hdr_roles: 'Пост бичих дүр',
                        insertNameError: 'Самбарын нэр оруулна уу',
                        insertHdrTypeError: 'Мэдээллийн самбарын төрөл сонгоно уу',
                        insertParentHdrError: 'Харьяалагдах самбар сонгоно уу',
                        insertRolesError: 'Самбарт пост бичих дүрүүдийг сонгоно уу',
                        removeHdr: 'Мэдээллийн самбарыг устгах уу?',
                        removeRecipient: 'Хэрэглэгчийг самбараас хасах уу?',
                        removeRecipientDescription: 'Хэрэв хэрэглэгч багш/ажилтан хэсэгт бүртгэлтэй тохиолдолд "Сургуулиас" хэсгээс давхар хасагдахыг анхаарна уу.',
                        selectHdrRecipient: 'Хүлээн авагч сонгоно уу',
                        title: 'Мэдээллийн самбар тохиргоо'
                    },
                    corporate: {
                        title: 'Хуулга',
                        show: 'Хуулга татах',
                        qpos: 'QPOS',
                        cgw: 'CGW',
                        not_connect: 'Холбоогүй',
                        description: 'Гүйлгээний утга',
                        sent_account: 'Шилжүүлсэн данс',
                    },
                    course: {
                        subject: 'Судлагдахуун',
                        subjectCode: 'Судлагдахууны код',
                        subjectName: 'Судлагдахууны нэр',
                    },
                    student_email: {
                        title: 'Сурагчийн и-мэйл',
                        duplicate_error_title: 'Дараахь и-мэйл хаягууд давхардсан байна',
                        invalid_error_title: 'Дараахь и-мэйл хаягууд буруу байна',
                    },
                    studentTranscript: {
                        moveOutTitle: 'Шилжсэн сурагчийн тодорхойлолт',
                        title: 'Дүнгийн тодорхойлолт',
                        issuedUser: 'Хэвлэсэн хэрэглэгч',
                        seasons: 'Дүнгийн хуудас хэвлэх жилүүд:',
                        publishedLabel: 'Зөвхөн баталгаажсан дүнгүүдийг хэвлэх'
                    },
                    health: {
                        record: {
                            title: 'Төлөвлөгөөт үзлэг',
                            warning_student_health_add: 'Та мэдээлэлийг бүрэн бөглөөгүй байна. Мэдээлэлийг бөглөлгүй үргэлжлүүлэх бол хадгалах товчийг дахин дарна уу',
                            warning_class_change: 'Та анги сольж байна. Анги солигдсон тохиолдолд уг маягтын сурагчдын мэдээлэл устгагдахыг анхаарна уу',
                            keep_going: 'Хэрвээ та үргэлжлүүлхийг хүсвэл мэдээлэл оруулах товчийг дарна уу',
                            record_date: 'Үзлэгийн огноо'
                        },
                        template: {
                            title: 'Эрүүл мэндийн маягт',
                            item: 'Эрүүл мэндийн үзүүлэлт',
                            template_name: 'Маягтны нэр',
                            item_can_be_chosen_once: 'Үзүүлэлт сонгогдсон байна',
                            add_item: 'Үзүүлэлт нэмнэ үү',
                            duplicate_error: 'Дараалал давхцаж байна',
                        },
                        report: {
                            title: 'Эрүүл мэндийн тайлан',
                            choose_template: 'Эрүүл мэндийн маягт сонгоно уу'
                        }
                    },
                    userGroup: {
                        title: 'Хэрэглэгчийн бүлэг'
                    },
                    profile: {
                        title: 'Миний профайл',
                        about: 'Миний тухай',
                        no_info: 'Мэдээлэл оруулаагүй байна',
                        info_delete: 'Мэдээлэл устгах',
                        img_delete: 'Зураг устгах',
                        insert_photo: 'Зураг оруулах',
                        delete_photo_not_found: 'Устгах зураг олдсонгүй',
                        old_password: 'Хуучин нууц үг',
                        new_password: 'Шинэ нууц үг',
                        new_password_repeat: 'Шинэ нууц үг давтах',
                        old_password_err: 'Хуучин нууц үг, шинэ нууц үг өөр байх ёстой'
                    },
                    skill: {
                        name: 'Ур чадвар',
                        title: 'Ур чадварын үнэлгээ',
                        assessmentTemplate: 'Үнэлгээний загвар',
                        createdTeacher: 'Бүртгэсэн багш',
                        skillAssessmentTemplate: 'Ур чадварын үнэлгээний загвар',
                        criteria: 'Шалгуур',
                        chooseAllSubject: 'Бүх хичээлийг сонгох',
                        addCriteria: 'Шалгуур нэмэх',
                        editCriteria: 'Шалгуур засах',
                        criteriaType: 'Шалгуурын төрөл',
                        readd: 'Дахин утга оруулах',
                        hasScore: 'Оноо өгөх эсэх',
                        hasNotValue: 'Утга бичээгүй',
                        hasValue: 'Утга бичсэн',
                        optionValues: 'Сонголтын утгууд',
                        numericalAnswer: 'Тоон хариулттай',
                        checkboxAnswer: 'Checkbox хариулттай',
                        publish: 'Ур чадварын үнэлгээг баталгаажуулах уу?',
                        radioAnswer: 'Radio хариулттай',
                        textareaAnswer: 'TextArea хариулттай',
                        addAssessment: 'Үнэлгээ оруулах',
                        selectTemplate: 'Загвар сонгох',
                        assessmentList: 'Үнэлгээний жагсаалт',
                        createNewAssessment: 'Шинэ үнэлгээ үүсгэх',
                        notFound: 'Ур чадвар олдсонгүй',
                    },
                    cardOrder: {
                        title: 'Үнэмлэх захиалга',
                        delivered: 'Хүргэгдсэн',
                        ordered: 'Захиалсан',
                        order: 'Захиалах',
                        cancel: 'Захиалга цуцлах',
                        date: 'Захиалсан огноо',
                        date_delivered: 'Хүргэсэн огноо',
                        order_student_card: 'Сурагчийн үнэмлэх захиалах',
                        warning: 'Зураггүй хүүхдүүд захиалгын жагсаалтанд гарахгүйг анхаарна уу. Мөн хаясан сурагчдын эцэг эхчүүд апп-аар захиална. Шинээр анх удаа карт авах гэж байгаа тохиолдолд энэ хэсгээр захиална.',
                        err_student: 'Сурагч сонгоно уу',
                        canceled_date: 'Цуцлагдсан огноо',
                        canceled: 'Цуцалсан',
                        recover: 'Сэргээх',
                        teacher_card_warning: 'Зураггүй хэрэглэгчийн мэдээлэл захиалгын жагсаалтанд гарахгүйг анхаарна уу.'
                    },
                    club: {
                        students: 'Дугуйлангийн сурагчид',
                        title: 'Дугуйлан',
                        register_student: 'Сурагчид бүртгэх',
                        name: 'Дугуйлангийн нэр',
                        no_info: 'Дугуйлангийн мэдээлэл олдсонгүй',
                        duplicateClasses: 'Ангиуд давхцаж байна',
                    },
                    dashboard_info: {
                        title: 'Дашбоард мэдээлэл солилцоо',
                        class_info_exchange: 'Ангийн мэдээлэл, солилцооны идэвхи',
                        parent_info_exchange: 'Эцэг эх, асран хамаалагчид',
                        teacher_info_exchange: 'Багшийн мэдээлэл, солилцооны идэвхи',
                        parent_num: 'Эцэг эхчүүдийн тоо',
                        post_num: 'Нийт постны тоо',
                        comment_num: 'Сэтгэгдлийн тоо',
                        activity: 'Үйл ажиллагаа',
                        comment: 'Сэтгэгдэл',
                        post: 'Пост',
                        answer: 'Хариу',
                        class_teacher_short: 'АУБ',
                        see_all: 'Бүгдийг харах',
                        your_class: 'Өөрийн анги',
                        others_class: 'Бусад анги',
                        today_attendance: 'Өнөөдрийн ирцийн мэдээ',
                    },
                    evaluation_final: {
                        subject_grade: 'Хичээлийн дүн',
                        sent: 'Илгээсэн',
                        not_sent: 'Илгээгээгүй',
                        not_published: 'Баталгаажуулаагүй',
                        send_esis: 'ESIS рүү илгээх',
                        sent_esis: 'ESIS рүү илгээсэн',
                        name: 'Жилийн эцэс',
                        title: 'Жилийн эцсийн дүн жагсаалт',
                        unpub_title: 'Идэвхгүй болгох жилийн эцсийн дүнгийн мэдээлэл',
                        final_grades: 'Жилийн эцсийн дүн',
                        delete_title: 'Жилийн эцсийн дүн',
                        excel_template: 'Эксель файлийн загвар',
                        score_exists: 'Дүн оруулсан байна',
                        not_created: 'Үүсээгүй',
                        calculated: 'Бодсон',
                        wrote: 'Шивсэн',
                        publish_confirmation: 'Шалгалтын дүнг баталгаажуулснаар дахин засах, устгах боломжгүй болохыг анхаарна уу!',
                        publish_confirmation_description: 'Зөвхөн баталгаажуулсан дүнгүүд анги даасан багш болон эцэг эхчүүдэд харагдана.',
                    },
                    bus_dashboard: {
                        student_title: 'Суух эрхтэй ч автобусанд суусан гэж бүртгүүлээгүй сурагчид'
                    },
                    invoice_form: {
                        invoice_from: 'Нэхэмжлэгч',
                        bill_to: 'Төлөгч',
                        address: 'Хаяг',
                        contact: 'Утас',
                        bank: 'Банкны нэр',
                        bank_account: 'Дансны дугаар',
                        state_registration_number: 'Регистр',
                        invoice_date: 'Нэхэмжилсэн огноо',
                        due_date: 'Төлбөр хийх хугацаа',
                        ceo: 'Захирал',
                        accountant: 'Нягтлан бодогч',
                        quantity: 'Тоо хэмжээ',
                        unit_price: 'Нэгжийн үнэ',
                        total_amount: 'Нийт үнэ',
                        amount: 'Дүн',
                        vat: 'НӨАТ',
                        description: 'Гүйлгээний утга',
                        employee_card: 'Ажилтны үнэмлэх',
                        nomch_address: 'УБ, ЧД, 4-р хороо, Хийморь цогцолбор, 4-7 байр, 45 тоот',
                        nomch: 'Номч Ай Ти Консалтинг ХХК',
                        account_number: '452583950',
                        tdb: 'Худалдаа Хөгжлийн банк',
                        invoice_pdf: 'НЭХЭМЖЛЭХ АВАХ',
                        parent_contact: 'Эцэг эхийн дугаар',
                        invoice_timetable: 'Төлбөрийн хуваарь',
                        total_unpaid: 'Нийт үлдэгдэл',
                        billed_amount: 'Нэхэмжилсэн дүн',
                        total_discount: 'Нийт хөнгөлөлт',
                        discounts: 'Хөнгөлөлтүүд',
                        parent_signature: 'Эцэг эх гарын үсэг'
                    },
                    analysis: {
                        add_season: 'Улирал нэмэх',
                        title: 'Анализ',
                        list: 'Анализ жагсаалт',
                        name: 'Анализ нэр',
                        related_exam: 'Үүссэн шалгалт',
                        calculate: 'Анализ бодох',
                        exam: {
                            title: 'Шалгалтын анализ',
                            examType: 'Шалгалтын төрлийн анализ'
                        },
                        exam_template: 'Загвартай шалгалт',
                        exam_template_analysis: 'Загвартай шалгалтын анализ',
                        name_placeholder: 'Загварын нэр, Хичээл',
                        season_result: 'Улирлын дүн',
                        score_board: 'Дүнгийн хавтгай',
                    },
                    esis: {
                        attendance_daily: 'Өдрийн ирц',
                        attendance_daily_empty_class: 'Өдрийн ирц илгээх анги сонгоно уу',
                        attendance_daily_send: 'Өдрийн ирц илгээх',
                        class_id: 'Esis studentGroupId',
                        last_name: 'esis Овог',
                        first_name: 'esis Нэр',
                        birth_date: 'esis Төрсөн огноо',
                        sent: 'esis илгээсэн',
                        excel_file: 'Эксель файл',
                        excel_filesize_exceed: 'Эксель файл 5mb-с их хэмжээтэй байна.',
                        elementCredit: 'Элемент багц цаг',
                        company_code: 'Байгууллагын код',
                        academic_grade: 'Боловсролын түвшин',
                        academic_grade_code: 'Боловсролын түвшин код',
                        academic_grade_name: 'Боловсролын түвшин нэр',
                        academic_level_code: 'Боловсролын зэргийн код',
                        academic_level_name: 'Боловсролын зэргийн нэр',
                        curriculum_and_plan: 'Хөтөлбөр, төлөвлөгөө',
                        curricula: 'Сургалтын хөтөлбөр',
                        curricula_connect: 'Сургалтын хөтөлбөр холбох',
                        curriculaLevel: 'Хөтөлбөрийн түвшин',
                        curriculaPlan: 'Хөтөлбөрийн төлөвлөгөө',
                        curriculaSubject: 'Хөтөлбөрийн хичээл',
                        curricula_code: 'Сургалтын хөтөлбөрийн код',
                        curricula_name: 'Сургалтын хөтөлбөрийн нэр',
                        curricula_grade_code: 'Хөтөлбөрийн ангилал код',
                        curricula_grade_name: 'Хөтөлбөрийн ангилал нэр',
                        curricula_element_code: 'Хөтөлбөрийн элемент код',
                        curricula_plan_name: 'Сургалтын төлөвлөгөөний нэр',
                        curricula_plan_type: 'Сургалтын төлөвлөгөөний төрөл',
                        curricula_plan_type_name: 'Сургалтын төлөвлөгөөний төрөл нэр',
                        curricula_plan_grade_code: 'Сургалтын төлөвлөгөөний үе шатны код',
                        curricula_plan_grade_name: 'Сургалтын төлөвлөгөөний үе шатны нэр',
                        class_code: 'Анги, бүлгийн код',
                        class_name: 'Анги, бүлгийн нэр',
                        student_connection_remove: 'Сурагчийн мэдээллийн холболт устгах',
                        get: 'Татах',
                        get_time: 'Мэдээ татах',
                        title: 'ESIS',
                        createClass: 'Бүлэг үүсгэх',
                        createStudent: 'Сурагч үүсгэх',
                        createTeacher: 'Багш үүсгэх',
                        createUser: 'Хэрэглэгч үүсгэх',
                        shortName: 'Товч нэр',
                        eschoolCode: 'eSchool код',
                        eschoolLastName: 'eSchool овог',
                        eschoolFirstName: 'eSchool нэр',
                        eschoolClassName: 'eSchool ангийн нэр',
                        eschoolTitle: 'eSchool албан тушаал',
                        linkTeacherStaff: 'Багш, ажилтан холбох',
                        selectTeacherStaff: 'Багш, ажилтан сонгоно уу!',
                        selectGrade: 'Анги сонгоно уу!',
                        selectStudent: 'Сурагч сонгоно уу!',
                        selectOnlyOneTeacherStaff: 'Зөвхөн нэг багш, ажилтан сонгоно уу!',
                        selectOnlyOneGrade: 'Зөвхөн нэг анги сонгоно уу!',
                        selectOnlyOneStudent: 'Зөвхөн нэг сурагч сонгоно уу!',
                        sentDate: 'Илгээсэн огноо',
                        sentStudentCount: 'Илгээсэн сурагчдын тоо',
                        sentUser: 'Илгээсэн хэрэглэгч',
                        studyTypeCode: 'Судлах төрөл код',
                        studyTypeName: 'Судлах төрөл нэр',
                        scoreSchemaCode: 'Дүнгийн схемийн код',
                        scoreSchemaName: 'Дүнгийн схемийн нэр',
                        gradeName: 'Ангийн нэр',
                        eschoolGrade: 'eSchool Түвшин',
                        eschoolClass: 'eSchool анги',
                        editClass: 'Бүлгийн мэдээлэл засах',
                        clearClass: 'Бүлгийн код цэвэрлэх',
                        clearStudent: 'ESIS холболт салгах',
                        classCode: 'Бүлгийн код',
                        className: 'Бүлгийн нэр',
                        classTeacher: 'Анги удирдсан багш',
                        linkClass: 'Анги холбох',
                        notSent: 'Илгээгээгүй',
                        syncStudents: 'Сурагчийн мэдээллийг ижилсүүлэх',
                        weekPerTime: '7 хоногт орох цаг',
                    },
                    common: {
                        day: 'х',
                        hour: 'ц',
                        min: 'мин'
                    },
                    handToHand: {
                        classClockOut: 'Ангиудын таралт',
                        dismiss: 'Тараах',
                        nonRepliedStudentCount: 'Тараагүй сурагчид',
                        title: 'Гараас гарт',
                        report: 'Тайлан',
                        requestDate: 'Дуудсан огноо',
                        requestRelationType: 'Сурагчийн хэн болох',
                        requestUser: 'Дуудсан хүн',
                        reply: 'Хариулах',
                        replyEmpty: 'Сурагч сонгоно уу',
                        repliedStudentCount: 'Тарсан сурагчид',
                    },
                    timeRecord: {
                        beforeMinute: 'Эрт гарсан минут',
                        cameTime: 'Ирэхдээ бүртгүүлсэн цаг',
                        lateHours: 'Хоцорсон цаг',
                        lateMinute: 'Хоцорсон минут',
                        outTime: 'Явахдаа бүртгүүлсэн цаг',
                        overHours: 'Илүү цаг',
                        overMinute: 'Илүү минут',
                        settings: 'Цаг бүртгэл тохиргоо',
                        shift: 'Цагийн ээлж',
                        shiftEmpty: 'Цагийн ээлж сонгоно уу',
                        title: 'Цаг бүртгэл',
                        totalWorkHour: 'Нийт ажиллах цаг',
                        totalWorkedHour: 'Нийт ажилласан цаг'
                    },
                    faq: 'Гарын авлага',
                    logout: 'Гарах',
                    scoreSchema: 'Үнэлгээний схем',
                    manager: {
                        detention: 'Сахилга бат',
                        detention_delete_description: 'Шийтгэлийн мэдээллийг устгах гэж байна. Устгасан мэдээллийг дахин сэргээх боломжгүйг анхаарна уу.',
                        title: 'Сургалтын менежер',
                        classGroups: 'Сурагчдын хамрагдалт',
                        curriculum: 'Сургалтын төлөвлөгөө',
                        curriculum_weekly_count: 'Долоо хоногт хэдэн удаа орох',
                        curriculum_weekly_count_description: 'Долоо хоногт хэдэн удаа орохыг оруулна',
                        teacher_progress: 'Багш нарын явц',
                        noGroupTitle: 'Хичээлд хамрагдахгүй байгаа',
                        year_structure: 'Жилийн бүтэц',
                        season_week_count: 'Хичээллэх долоо хоног'
                    },
                    page: {
                        notFound: 'Өө таны хайсан хуудас олдсонгүй!',
                        Forbidden: 'Өө та энэ хуудсанд хандах эрхгүй байна!',
                        goHome: 'Нүүр хуудасpуу очих',
                    },
                    dashboard: {
                        attendance: 'Ирцийн мэдээ',
                        attendanceTypes: {
                            byTime: 'Цагаар',
                            byClass: 'Ангиар',
                            byTeacher: 'Багшаар'
                        },
                        title: 'Хяналтын самбар',
                        parents_access: 'Эцэг эхчүүдийн хандалт',
                        exam_today: 'Өнөөдрийн шалгалтын мэдээ',
                        parents_and_guardians: 'Эцэг эх, асран хамгаалагчид',
                        parents_and_guardian: 'Эцэг эх, асран хамгаалагч',
                        accessed_parents: 'Эцэг эх нь орсон сурагчид',
                        parents_count: 'Эцэг эхийн тоо',
                        see_all_events: 'Бүх үйл ажиллагааг харах',
                        see_all_news: 'Бүх зарыг харах',
                        announcement_today: 'Өнөөдөр орсон зарлал',
                        homework_today: 'Өнөөдрийн гэрийн даалгаврын мэдээ',
                        homework_total: 'Өнөөдөр өгсөн гэрийн даалгавар',
                        homework_check: 'Өнөөдөр шалгах гэрийн даалгавар',
                        newsfeed_today: 'Өнөөдөр болох үйл явдал',
                        class_teacher: 'АУБагш',
                        teacher_journal: 'Багшийн тэмдэглэл',
                        usage: {
                            title:  'Ашиглалт',
                            staffs: 'Идэвхтэй багш, ажилтан',
                            parents: 'Идэвхтэй эцэг, эх',
                            by_parent: 'Эцэг, эхээр',
                            by_staff: 'Багш, ажилтнаар',
                            eTeacher: 'Гар утас',
                            totalUsed: 'Нийт ашигласан'
                        }
                    },
                    staff: {
                        teacher_staff: 'Багш, ажилтан',
                        title: 'Ажилтан',
                        code: 'Ажилтны код',
                        lastName: 'Ажилтны овог',
                        firstName: 'Ажилтны нэр',
                        select: 'Ажилтан сонгоно уу!',
                    },
                    teacherToday: {
                        behavior: 'Хүмүүжил',
                        notification: 'Сонордуулга',
                        noNotification: 'Одоогоор Таньд мэдэгдэл ирээгүй байна.',
                        regular: 'Ээлжит',
                        hw_assigned: 'ГД өгсөн',
                        hw_reviewed: 'ГД шалгасан',
                        hw_assign: 'ГД өгөх',
                        hw_review: 'ГД шалгах',
                        active: ' Идэвх',
                    },
                    idle: {
                        title: 'Та идэвхтэй байна уу?',
                        description: 'Та 10 болон түүнээс дээш минут идэвхгүй байсан тул таныг системээс гаргах гэж байна. Хэрэв та идэвхтэй байгаа бол үргэлжлүүлэх товч дээр даран үргэлжлүүлнэ үү!',
                        continue: 'Үргэлжлүүлэх',
                    },
                    sheetImport: {
                        regex: {
                            date: 'Он-сар-өдөр форматаар бичнэ үү!',
                            latinAndCyrillic: 'Латин болон Кирилл үсгээр бичнэ үү!',
                            regNumber: 'АБ01234567 форматаар бичнэ үү!',
                            email: 'example@example.com форматаар бичнэ үү!',
                        },
                        required: {
                            enrolDate: 'Элссэн огноо хоосон байж болохгүй!',
                            studentLastName: 'Сурагчийн овог хоосон байж болохгүй!',
                            studentFirstName: 'Сурагчийн нэр хоосон байж болохгүй!',
                            gender: 'Хүйс хоосон байж болохгүй!',
                            studentCode: 'Сурагчийн код хоосон байж болохгүй!',
                            grade: 'Анги хоосон байж болохгүй!',
                            username: 'Нэвтрэх нэр хоосон байж болохгүй!',
                        },
                        unique: {
                            regNumber: 'Регистрийн дугаар давхардаж болохгүй!',
                            studentCode: 'Сурагчийн код давхардаж болохгүй!',
                            username: 'Нэвтрэх нэр давхардаж болохгүй!',
                        },
                        desc: {
                            gender: 'Эрэгтэй эсвэл эмэгтэй аль нэг нь байх ёстой!',
                            notRequired: 'Заавал бөглөх албагүй',
                            studentPassword: 'Хэрвээ та нууц үг оруулахгүй бол оюутны код нууц үг болон ашиглагдах болно',
                        },
                        uploadStep: {
                            title: 'Файл хуулах',
                            manifestTitle: 'Хуулах файлын загвар',
                            manifestDescription: null,
                            dropzone: {
                                title: ".xlsx, .xls болон .csv файл хуулна уу",
                                errorToastDescription: "Файл хуулалт цуцлагдлаа",
                                activeDropzoneTitle: "Файлыг энд хуулна уу...",
                                buttonTitle: "Файл сонгох",
                                loadingTitle: "Уншиж байна...",
                            },
                            selectSheet: {
                                title: "Таны файл олон хуудастай байгаа тул аль нэгийг нь сонгон үргэлжлүүлнэ үү",
                                nextButtonTitle: "Үргэлжлүүлэх",
                            },
                        },
                        selectHeaderStep: {
                            title: "Толгой мөрийг сонгох",
                            nextButtonTitle: "Үргэлжлүүлэх",
                        },
                        matchColumnsStep: {
                            title: "Багануудыг холбох",
                            nextButtonTitle: "Үргэлжлүүлэх",
                            userTableTitle: "Таны файл",
                            templateTitle: "Холбох баганууд",
                            selectPlaceholder: "Багана сонгох...",
                            ignoredColumnText: "Багана хасагдсан",
                            subSelectPlaceholder: "Сонгох...",
                            matchDropdownTitle: "Холбох",
                            unmatched: "Холбогдоогүй",
                            duplicateColumnWarningTitle: "Өөр багана сонгогдлоо",
                            duplicateColumnWarningDescription: "Баганууд давхардаж болохгүй",
                        },
                        validationStep: {
                            title: "Өгөгдлийг шалгах",
                            nextButtonTitle: "Хуулах",
                            noRowsMessage: "Өгөгдөл олдсонгүй",
                            noRowsMessageWhenFiltered: "Алдаатай өгөгдөл олдсонгүй",
                            discardButtonTitle: "Сонгосон мөрүүдийг устгах",
                            filterSwitchTitle: "Алдаатай мөрүүдийг харуулах",
                        },
                        alerts: {
                            confirmClose: {
                                headerTitle: "Гарах",
                                bodyText: "Гарахдаа итгэлтэй байна уу? Таны оруулсан мэдээллүүд хадгалагдахгүй болохыг анхаарна уу!",
                                cancelButtonTitle: "Болих",
                                exitButtonTitle: "Гарах",
                            },
                            submitIncomplete: {
                                headerTitle: "Алдаа олдлоо",
                                bodyText: "Алдаатай мөрүүд олдлоо. Хуулах үед алдаатай мөрүүд хуулагдахгүйг анхаарна уу.",
                                bodyTextSubmitForbidden: "Алдаатай мөрүүд байсаар байна та мөрүүдээ дахин хянана уу.",
                                cancelButtonTitle: "Болих",
                                finishButtonTitle: "Хуулах",
                            },
                            unmatchedRequiredFields: {
                                headerTitle: "Бүх баганууд холбогдсонгүй",
                                bodyText: "Бүх холбох ёстой баганууд холбогдоогүй байна.",
                                listTitle: "Холбох ёстой баганууд:",
                                cancelButtonTitle: "Болих",
                                continueButtonTitle: "Үргэлжлүүлэх",
                            },
                            toast: {
                                error: "Алдаа",
                            },
                        },
                        error: {
                            studentNotExists1: 'бүлэгт',
                            studentNotExists2: 'кодтой сурагч байхгүй байна',
                        },
                    },
                    hr: {
                        title: 'Хүний нөөц',
                        teachersAttendance: 'Багш нарын ирц',
                        attendanceReport: 'Ирцийн тайлан',
                        configStaffs: 'Харъяалах ажилтнууд',
                        configDeleteTitle: 'Мэдээллийг устгах уу?',
                        department: 'Хэлтэс',
                        addStaff: 'Ажилтан оруулах',
                        staffCode: 'Ажилтны код',
                        structure: 'Бүтэц',
                        addDepartment: 'Хэлтэс нэмэх',
                        editDepartment: 'Хэлтэс засах',
                        parentDepartment: 'Харъяалах хэлтэс',
                        departmentName: 'Хэлтэсийн нэр',
                        departmentCode: 'Хэлтэсийн код',
                        addEmployee: 'Ажилтан нэмэх',
                        noConfigStaffs: 'Хуваарилагдаагүй ажилтнууд',
                        noDepartment: 'Хэлтэст хуваарилаагүй ажилтнууд',
                        approved: 'Зөвшөөрсөн',
                        declined: 'Татгалзсан',
                        role: 'Албан тушаал'
                    },
                    behavior: {
                        title: 'Хүмүүжил',
                        positiveScore: '+ оноо',
                        negativeScore: '- оноо',
                        maturity: 'Хүмүүжил төлөвшилт'
                    },
                    subMenu: {
                        survey: 'Судалгаа',
                        doctor: 'Эмч',
                        appointment: 'Уулзалт',
                        erp: 'ERP'
                    }
                }
            case 'ru':
                return {
                    action: {
                        addRow: 'Добавить строку',
                        edit: 'Редактировать',
                        datatable_info: 'Весь _TOTAL_ результат _ ОТ НАЧАЛА_ДО КОНЦА_ показан',
                        delete: 'Удалить',
                        loading: 'Загрузка',
                        view: 'Смотреть',
                        publish: 'Подтверждать',
                        recalculate: 'Пересчитывать',
                        recreate: 'Дахин үүсгэх',
                        register: 'Регистр',
                        search: 'Поиск...',
                        setInactive: 'Отменить',
                        setActive: 'Хүчинтэй болгох',
                        typeHere: 'Введите здесь...',
                        post: 'Публиковать',
                        emptyTable: 'Информация не найдена',
                        calculate: 'Рассчитать',
                    },
                    addRole: 'Добавить права',
                    days: 'Дни',
                    not_published: 'Не подтверждено',
                    unPublish: 'Отменить публикацию',
                    save_success: 'Успешно сохранен',
                    success: 'Успешно',
                    add: 'Добавить',
                    add_school_relation: 'Подключение школ',
                    add_student: 'Добавить ученика',
                    all: 'Все',
                    amount: 'количество',
                    answered: 'Заполнен',
                    answered_percent: 'Возможный %',
                    back: 'Назад',
                    back_to_list: 'Обратно к списку',
                    by_class: 'По классам',
                    by_student: 'По ученику',
                    cancel: 'Отменить',
                    please_add_template: 'Добавить форму здоровья',
                    chat: {
                        createNew: 'Создать новый чат',
                        markAllAsRead: 'Отметить все как “ПРОЧИТАННОЕ”',
                        new: 'Новый чат',
                        offline: 'Не в сети',
                        online: 'В сети',
                        select_chat_description: 'Выберите пользователя для чата',
                        sent_chat: 'картинка отправлена',
                        selectConversation: 'Выберите разговор',
                    },
                    className: 'Класс',
                    code: 'Код',
                    create: 'Создать',
                    show_result: 'Посмотреть результат',
                    datatable: {
                        columns: 'Столбцы'
                    },
                    ecourse: {
                        createTopic: 'Добавить тему',
                        parentTopic: 'Принадлежащая тема',
                        selectSubject: 'Выберите тему',
                        title: 'Онлайн урок',
                        topic_code: 'Код темы',
                        topic_name: 'Название темы',
                        topic_activity: 'Хичээлийн үйл ажиллагаа',
                        topic_description: 'Дүгнэлт',
                        topics: "Учебный план"
                    },
                    elearning_topic: 'Тема',
                    email: 'И-мэйл',
                    photo: 'Фото',
                    studentCode: 'Код ученика',
                    send: 'Отправить',
                    studentLastName: 'Фамилия ученика(-цы)',
                    studentFirstName: 'Имя ученика(-цы)',
                    description: 'Описание',
                    weight: 'Вес',
                    height: 'Рост',
                    online_exam: {
                        title: 'Онлайн экзамен',
                        search: 'Поиск',
                        connect_answers: 'Соединить ответы',
                    },
                    student_info_missing: 'Отсутствует информация ученика(-цы)',
                    previous: 'Предыдущий',
                    online_exam_eq_answer: 'Введите формулу вопроса здесь.',
                    online_exam_text_answer: 'Введите текст ответа здесь',
                    online_exam_question: 'Вопрос',
                    online_exam_subTopic: 'Подтема',
                    online_exam_select_subTopic: 'Выбрать подтему',
                    online_exam_select_value: 'Вы можете выбрать свои значения в поле поиска слева, чтобы отобразить зарегистрированные вопросы.',
                    online_exam_edit_question: 'Редактировать вопрос',
                    online_exam_delete_question: 'Удалить вопрос',
                    online_exam_delete_course: 'Удалить',
                    online_exam_edit_course: 'Исправить',
                    online_exam_back_to_list: 'Обратно к списку',
                    online_exam_subject: 'Урок',
                    copy: 'Копировать',
                    show_report: 'Показать отчет',
                    download_report: 'Тайлан татах',
                    insert_only_photo: 'Вставить только фото.',
                    remove_connected_answer: 'Удалите связанные вопросы, разделив их.',
                    select_right_answer: 'Выберите правильный ответ!',
                    insert_answer_photo: 'Выберите фото!',
                    incorrect: 'Ошибка',
                    fill_general_info: 'Заполните полностью Вашу общую информацию',
                    fill_answer_sheet: 'Заполните полностью лист ответов!',
                    do_inactive: 'Сделать неактивным',
                    score: 'Счет',
                    question_type: 'Тип вопроса',
                    question_difficulty: 'Сложность вопроса',
                    clear: 'Очистить',
                    select_subject: 'Выбрать урок',
                    select_topic: 'Выбрать тему',
                    select_question_difficulty: 'Выбрать уровень сложности вопроса',
                    select_question_type: 'Выбрать тип вопроса',
                    select_connective_answer: 'Выберите связующий ответ!.',
                    detailed_info: 'Подробная информация',
                    general_info: 'Общая информация',
                    add_question: 'Добавить вопрос',
                    insert_eq_question: 'Введите вопрос здесь.',
                    answer: 'Ответ',
                    connect_answers: 'Соединить ответы',
                    connect: 'Соединять',
                    insert_description: 'Вставить описание',
                    create_question: 'Создать вопрос',
                    course_subject: 'Предмет курса',
                    course_code: 'Код курса',
                    course_name: 'Название курса',
                    course_briefDescription: 'Обзор курса',
                    course_result: 'Результаты курса',
                    course_criteria: 'Критерии курса',
                    course_select_teacher: 'Выбрать учителя',
                    course_select_topic: 'Выбрать тему',
                    course_add_topic: 'Добавить тему',
                    course_type: 'Тип',
                    course_select_courseType: 'Выбрать тип',
                    course_insert_course_code: 'Введите код курса',
                    course_insert_course_name: 'Введите название курса',
                    course_insert_text: 'Введите текст',
                    course_next: 'Следующий',
                    course_confirm: 'Подтвердить',
                    course_general_info: 'Общая информация',
                    course_lesson: 'Урок',
                    course_examination_question: 'Экзаменационный вопрос',
                    course_upload_video: 'Нажмите здесь, чтобы скопировать видео',
                    course_video_lesson: 'Видео урок',
                    course_select_from_question_bank: 'Выбрать из банка вопросов',
                    course_select_question: 'Выбрать вопрос',
                    course_add_course: 'Добавить программу',
                    course_edit_course: 'Редактировать программу',
                    course_total_topic: 'Количество темы',
                    course_blueprint: 'Проект',
                    course_course_name: 'Название программы',
                    course_not_created_user: 'Вам не разрешено редактировать.',
                    courseName: 'Программа',
                    planned_time: 'Запланированное время',
                    registered_time: 'Зарегистрированное время',
                    cameStudent: 'Присутствующие ученики',
                    cameHours: 'Время прибытия',
                    busDashboardTitle: 'Название панели автобуса',
                    config: 'Настройки',
                    busConfig: 'Настройка автобуса',
                    busDiscount: 'Дисконт автобуса',
                    busInvoice: 'Иск автобуса',
                    busSale: 'Автобусные права',
                    search: 'Поиск...',
                    empty: 'Не найдено',
                    emptyStudent: 'Ученик не найден',
                    total: 'Всего',
                    date: 'Дата',
                    datePickerPlaceholder: 'Год-Месяц-День',
                    chooseSeason: 'Выбрать сезон',
                    created_date: 'Дата регистрации',
                    totalStudent: 'Всего учеников',
                    transaction_date: 'Дата транзакции',
                    select_transaction_date: 'Введите дату транзакции',
                    check_transaction_date: 'Выберите дату транзакции',
                    created_user: 'Созданный пользователь',
                    registered: 'Зарегистрировано',
                    close: 'Закрывать',
                    status: 'Состояние',
                    view: 'Смотреть',
                    phoneNumber: 'Номер телефона',
                    insert_phoneNumber: 'Введите номер телефона',
                    students: 'Ученики',
                    last_name: 'Фамилия',
                    first_name: 'Имя',
                    insert_last_name: 'Введите Фамилию',
                    insert_first_name: 'Введите Имя',
                    insert_user_name: 'Введите имя пользователя',
                    insert_email: 'Введите адрес электронной почты',
                    insert_price: 'Введите цену',
                    edit: 'Редактировать',
                    approve: 'Разрешить',
                    approve_confirmation: 'Вы уверены?',
                    delete: 'Удалить',
                    delete_confirmation: 'Вы уверены, что хотите удалить?',
                    delete_confirmation_description: 'Обратите внивание, что удаленные данные не могут быть восстановлены!',
                    download_excel: 'Скачать эксель',
                    role: 'Роль',
                    select_role: 'Выберите роль',
                    school: 'Школа',
                    school_code: 'Код школы',
                    select: 'Выбрать',
                    pls_select: 'Пожалуйста, выберите',
                    gender: 'Пол',
                    select_gender: 'Введите пол',
                    yes: 'Да',
                    no: 'Нет',
                    print: 'Распечатать',
                    receipt_print: 'Распечатать квитанцию',
                    teacher_title: 'Учитель',
                    list: 'Список',
                    excel: 'Эксель',
                    period: 'Период',
                    decline: 'Отказать',
                    grade: 'Уровень',
                    total_score: 'Общий счет',
                    percent: 'Процент',
                    to_take: 'Взять тест',
                    purpose: 'Цель',
                    result_list: 'Список оценок',
                    total_taken_score: 'Общий балл',
                    add_new: 'Добавить новое',
                    start_date: 'Дата начала',
                    end_date: 'Дата окончания',
                    name: 'Имя',
                    excel_download: 'Скачать эксель',
                    information: 'Информация',
                    unpaid_amount: 'Невыплаченная сумма',
                    insert_code: 'Введите код',
                    insert_name: 'Введите Имя',
                    insert_order: 'Введите последовательность',
                    insert_pay_amount: 'Введите смму оплаты',
                    register_number: 'Регистрационный номер',
                    created_by: 'Зарегистрировано',
                    main_information: 'Общая информация',
                    insert_fields_correctly: 'Введите правильные значения формы',
                    disable: 'Запретить',
                    enable: 'Активировать',
                    change_login_name: 'Изменить логин',
                    type: 'Тип',
                    paid_amount: 'Выплаченная сумма',
                    class_name: 'Группа',
                    undo: 'Отменить',
                    confirmation: 'Подтвердить',
                    select_grade: 'Выберите уровень',
                    score_type: 'Тип оценки',
                    select_all: 'Выбрать все',
                    published: 'Подтвержден',
                    subjects: 'Уроки',
                    classes: 'Классы',
                    saved: 'Сохранен',
                    save_and_exit: 'Сохранить и выйти',
                    bonus: 'Бонус',
                    average: 'Средний',
                    max: 'Высокий',
                    min: 'Низкий',
                    start_time: 'Время начала',
                    end_time: 'Время окончания',
                    school_shift: 'Смена',
                    insert_photo: 'Вставить фото',
                    upload_photo_button_label: 'Нажмите здесь чтобы скопировать картину',
                    click_here: 'Нажмите здесь...',
                    crop: 'Обрезать',
                    discounted_students: 'вовлеченные ученики',
                    sequence: 'Последовательность',
                    insert_sequence: 'Введите последовательность',
                    address: 'Адрес',
                    mongolia: 'Монголия',
                    english: 'Английский',
                    website: 'Вэб сайт',
                    logo: 'Лого',
                    logo_horizontal: 'Горизонтальное лого удостоверения',
                    season: 'Сезон',
                    gpa: 'Средний балл',
                    checked: 'Проверено',
                    time: 'Время',
                    change_time: 'Изменить время',
                    by_day: 'По дням',
                    by_staff: 'По сотрудникам',
                    by_dashboard: 'Объединённый',
                    assessment: 'Оценка',
                    template: 'Форма',
                    total_avg: 'Общее среднее',
                    valid: 'Действительный',
                    invalid: 'Недействительный',
                    remove: 'Удалять',
                    male: 'Мужской',
                    female: 'Женский',
                    e_mail: 'Электронная почта',
                    existing_phone_number: 'Используемый номер телефона',
                    new_phone_number: 'Новый сменный номер',
                    re_enter_phone_number: 'Повторно введите новый номер телефона для замены',
                    re_open: 'Повторно открыть',
                    password: 'Пароль',
                    new_password: 'Новый пароль',
                    re_enter_new_password: 'Повторно введите новый пароль',
                    password_empty: 'Введите пароль',
                    password_length_error: 'Пароль должен содержать менее 4 символов',
                    password_re_enter_mismatch: 'Повторяющиеся пароли должны быть одинаковыми.',
                    login_name_re_enter_mismatch: 'Повторяющееся имя для входа должна быть одинаковой.',
                    phone_number_re_enter_mismatch: 'Повторяющийся номер телефона должен быть одинаковым.',
                    insert_file: 'Вставить файл',
                    insert_video: 'Вставить видео',
                    comment_receive: 'Принятие комментариев',
                    enter_exam_score: 'Введите значение от 0 до 100',
                    error_crop_button: 'Выберите раздел, который нужно вырезать, и нажмите кнопку ОБРЕЗАТЬ.',
                    excel_import: 'Эксель импорт',
                    active: 'Активный',
                    is_active: 'Активен',
                    inactive: 'Неактивный',
                    content_code: 'e-content код',
                    insert_content_code: 'Введите код e-content',
                    published_date: 'Дата публикации',
                    manage_roles: 'Установить права',
                    add_teacher_role: 'Багш эрх өгөх',
                    class_data: 'Дата урока',
                    change_password: 'Изменить пароль',
                    change_password_description: 'Обратите внимание, что изменение пароля не позволит Вам войти в систему со старым паролем!',
                    change_login_name_description: 'Обратите внимание, что изменение вашего имени для входа не позволит Вам войти в систему с предыдущим именем.',
                    required: 'Необходимый',
                    remove_config: 'Удалить настройки',
                    remove_config_description: 'Удалить учащегося из настроек блокировки?',
                    meaning: 'Значение',
                    value: 'Значение',
                    insert_information: 'Вставить информацию',
                    attendance: {
                        title: 'Посещаемость',
                        attendance_registration: 'Регистрация посещаемости',
                        delete_description: 'Ирцийн мэдээг устгах гэж байна. Устгагдсан мэдээллийг сэргээх боломжгүйг анхаарна уу',
                        sent_attendance: 'Отправить информацию о времени',
                        sent_attendance_confirm: 'Отправить информацию посещаемости',
                        sent_time: 'Информация о времени отправлена',
                        attendance_report: 'Информация посещаемости',
                        no_log_title: 'Ирц бүртгээгүй цаг',
                        came: 'Присутствует',
                        excused: 'Освобождён',
                        unexcused: 'Отсутствует по неуважительной причине',
                        sick: 'Больной',
                        late: 'Опоздал',
                        not_sent: 'Информация о времени не отправлена',
                        is_request: 'Зарегистрированный статус «Освобождён» не может быть изменён. Может быть переведён только в прибывшее состояние.',
                        checkable_description: 'Сурагчийн ирцийг сонгож илгээх',
                        unable_to_delete: 'Улирлын дүн гарсан тул ирцийн мэдээг устгах боломжгүй',
                        unable_to_log_date: 'Ирц бүртгэх боломжгүй өдөр байна',
                    },
                    class: {
                        title: 'Класс',
                        girls: 'Девочки',
                        grade: 'Түвшин',
                        boys: 'Мальчики',
                        report: 'Отчёт класса',
                        timetableEmpty: 'Расписание занятий не зарегистрировано',
                    },
                    student: {
                        create_user: 'И-мэйл бүртгэх',
                        title: 'Ученик',
                        student_code: 'Код ученика',
                        last_name: 'Фамилия ученика',
                        first_name: 'Имя ученика',
                        family_name: 'Отчество',
                        esis_qr: 'ESIS QR код',
                        gender: 'Пол',
                        status: 'Статус',
                        student_status: 'Статус ученика',
                        current_class: 'Текущая группа',
                        register_number: 'Регистрационный номер',
                        birth_date: 'Дата рождения',
                        entry_date: 'Дата поступления',
                        insert_photo: 'Вставить фото',
                        book: 'Личное дело учащегося',
                        book_title: 'Личное дело',
                        upload_button_label: 'Нажмите здесь, чтобы скопировать картину',
                        homework_report: 'Информация о домашних заданиях учащихся',
                        relation: 'Опекун',
                        relation_type: 'Кем являетесь для ребенка',
                        usage_time: 'Время использования',
                        last_login: 'Последний Войти',
                        student_information: 'Информация ребёнка',
                        registration_undo: 'Восстановить регистрацию',
                        relation_other: 'Другие члены семьи',
                        change_password: 'Изменить пароль учащегося',
                        address_type: 'Постоянный адрес',
                        birth_cert: 'Свидетельство о рождении',
                        health_num: 'Номер здоровья',
                        phone_number: 'Номер телефона учащегося',
                        health: 'Индикатор здоровья'
                    },
                    studentBookNavs: {
                        student_info: 'Информация ученика',
                        address: 'Адрес',
                        contact: 'Контакт',
                        health: 'Здоровье',
                        relation: 'Опекун',
                        personal_info: 'Личная информация',
                        self_info: 'Информация о себе',
                        student_personal_info: 'Личные дела учащегося',
                        grade: 'Успеваемость',
                        mid_test: 'Текущий контроль',
                        season_grade: 'Итоговая оценка триместра',
                        teacher_statement: 'Характеристика учителя',
                        progress: 'Прогресс',
                        punishment: 'Дисциплинарное вызыскание',
                        behavior: 'Воспитание, самореализация',
                        skill_status: 'Оценка навыков',
                        attendance: 'Посещаемость',
                        tuition: 'Оплата',
                        others: 'Другие',
                        bus: 'Автобус',
                        bus_title: 'Автобусаар зорчсон мэдээлэл',
                        food: 'Еда',
                        food_title: 'Хоолонд орсон мэдээлэл',
                    },
                    studentBook: {
                        healthInsuranceNumber: '№ мед. страхования',
                        birthCertNumber: '№ свидетельства рождения',
                        ethnicity: 'Этническая принадлежность',
                        date: 'Дата',
                        class_name: 'Группа',
                        lesson: 'Урок',
                        rank: 'Рейтинг',
                        max_point: 'Наивысший балл',
                        min_point: 'Низкий балл',
                        average: 'Средний',
                        season: 'Сезон',
                        test_name: 'Название теста',
                        point_took: 'Полученный балл',
                        show: 'Смотреть',
                        relation: 'Кем является',
                        parent_name: 'Имя родителя',
                        name: 'Своя имя',
                        birth_day: 'Дата рождения',
                        gender: 'Пол',
                        phone: 'Номер телефона',
                        work_place: 'Рабочее место',
                        work_role: 'Должность',
                        live_with: 'Проживают ли совместно',
                        reason: 'Причина несовместного проживания',
                        student_point: 'Балл ученика',
                        student_score: 'Оценка ученика',
                        class_average: 'Среднее класса',
                        read_more: 'Продолжить чтение',
                        learn_more: 'Узнать больше',
                        skill_status: 'Оценка навыков',
                        state: 'Состояние',
                        pay_date: 'Срок оплаты',
                        paid_date: 'Дата оплаты',
                        type: 'Тип',
                        payment_num: 'Номер платежа',
                        payment_type: 'Тип платежа',
                        pay: 'Сумма к оплате',
                        paid: 'Выплаченная сумма',
                        paid_type: 'Форма оплаты',
                        remain: 'Остаток',
                        registered_date: 'Дата регистрации',
                        uploaded_date: 'Дата создания',
                        student_code: 'Код учащегося',
                        class: 'Класс',
                        e_barimt: 'е-документ',
                        hours: 'Время',
                        attended_hours: 'Время прибытия',
                        late_hours: 'Время опоздания',
                        absent_hours: 'Часы отсутствия',
                        sick_hours: 'Больничные часы',
                        free_hours: 'Свободные часы',
                        teacher: 'Учитель',
                        bus_service_info: 'Информация о посадке в автобус',
                        food_service_info: 'Информация о питании',
                        route: 'Направление',
                        driver: 'Водитель',
                        remove: 'Удалять',
                        female: 'Женский',
                        male: 'Мужской',
                        no_info: 'Информация не введена',
                        email: 'Электронная почта',
                        city: 'Город/аймак',
                        home_phone: 'Домашний телефон',
                        birth_place: 'Место рождения',
                        door: 'Номер квартиры',
                        town: 'Округ',
                        street: 'Район',
                        building: 'Дом/Улица',
                        studying: 'Обучается',
                        graduated: 'Окончил',
                        remaining: 'Оставшийся',
                        duration: 'Действительная дата',
                        reasonNotLivingTogether: 'Причина несовместного проживания',
                        place: 'Дом',
                        seasonScore: 'Итоговые оценки триместра',
                        activity: 'Активность, участие',
                    },
                    dashboardAttendence: {
                        excelByTime: 'Цагийн мэдээ - Цагаар',
                        excelByClass: 'Цагийн мэдээ - Ангиар',
                        excelByTeacher: 'Цагийн мэдээ - Багшаар',
                        today: 'Сегодня',
                        week: 'Неделя',
                        month: 'По месяцам',
                        season: 'По сезону',
                        attended: 'Присутствовал',
                        absent: 'Отсутствующий',
                        late: 'Опоздал',
                        sick: 'Больной',
                        excused: 'Освобождён',
                        attendance_info: 'Сводка посещаемости',
                        student_hour:
                            'Ученик | время',
                        info_sent:
                            'Отправлено информация',
                        hour:
                            'Время',
                        all_class_num:
                            'Количество классов, у которых занятие',
                        responded_class_num:
                            'Количество классов, которые отправили информации',
                        students: 'Ученики',
                        class: 'Класс',
                        class_name: 'Группы',
                        with_class_name:
                            'По группам',
                        with_class:
                            'По классам',
                        with_rank:
                            'По уровню',
                        picture:
                            'Фотография',
                        student_code:
                            'Код ученика',
                        last_name:
                            'Имя отца',
                        student_name:
                            'Имя ученика',
                        lesson:
                            'Урок',
                        teacher:
                            'Учитель',
                        response:
                            'Отправлено',
                        response_time:
                            'Время отправления',
                        info_sent_classes: 'Информация о посещаемости отправлено Классы',
                        all_student_hours: 'Всего | часы',
                        attended_student:
                            'Прибывший ученик',
                        absent_student:
                            'Пропустивший ученик без уважительной причины',
                        late_student:
                            'Опоздавший ученик',
                        sick_student:
                            'Болеющий ученик',
                        excused_student:
                            'Отсустующий ученик с уважительной причины',
                        class_student:
                            'Обучающий ученик',
                        all_club_num:
                            'Число кружков',
                        responded_club_num:
                            'Число кружков, которые отправили сведения',
                        club_name:
                            'Название кружка',
                    }
                    ,
                    dashboardSeasonGrade: {
                        with_subject: 'По предметам',
                        with_teacher:
                            'По учителям',
                        with_class:
                            'По классам',
                        dashboard:
                            'Дашбоард',
                        dashboard_season:
                            'Оценка по кварталам',
                        teacher_dashboard:
                            'Сведения оценок от учителя по триместрам',
                        class_dashboard:
                            'Оценка класса по триместру',
                        dashboard_curr:
                            'Оценка текущего экзамена',
                        teacher_dashboard_curr:
                            'Оценка учителя по текущему экзамену',
                        class_dashboard_curr: 'Информация оценок по текущему экзамену класса',
                        dashboard_year: 'Годовые оценки',
                        teacher_dashboard_year:
                            'Информация от учителя об годовых оценок',
                        class_dashboard_year: 'Информация об окончании учебного года',
                        total: 'Всего',
                        test: 'Экзамен'
                    }
                    ,
                    finance: {
                        add_note: 'Регистрация примечаний',
                        invoice:
                            'Счёт-фактура',
                        invoice_empty:
                            'Не найден счёт-фактура',
                        invoice_search:
                            'Найти счёт-фактуру',
                        select_all_student:
                            'Все ученики',
                        select_invoice_type:
                            'Выберите вид счёт-фактуры',
                        total_student:
                            'Общее число учеников',
                        number_of_incomplete_students:
                            'Число учеников не заплативших оплату',
                        dashboard:
                            'Дашбоард',
                        ebarimt:
                            'И-баримт',
                        ebarimt_created_date:
                            'Дата И-баримт ',
                        ebarimt_lottery:
                            'Номер И-баримт',
                        ebarimt_lottery_insert:
                            'Введите номер регистрации и-баримта',
                        ebarimt_register:
                            'Зарегистрировать И-баримт',
                        ebarimt_register_error:
                            'Вышла ошибка при регистрации И-баримт',
                        ebarimt_type:
                            'Вид И-баримта',
                        ebarimt_type_insert:
                            'Выберите вид И-баримта',
                        ebarimt_type_citizen:
                            'Частное лицо',
                        ebarimt_type_organization:
                            'Организация',
                        ebarimt_type_organization_register:
                            'Регистр организации',
                        ebarimt_type_organization_register_insert:
                            'Введите правильно регистр организации',
                        tuition_payment:
                            'Оплата',
                        billed:
                            'Счёт-фактура отправлен',
                        paid:
                            'Оплата произведена',
                        unpaid:
                            'Не оплачена',
                        incomplete:
                            'Не полностью оплачена',
                        invoice_payment_title:
                            'Оплата счётов',
                        read_more:
                            'Посмотреть ',
                        overpaid:
                            'Переплата',
                        className:
                            'Класс',
                        discount_amount:
                            'Льготная сумма',
                        pay_amount:
                            'Сумма платежа',
                        unpaid_amount:
                            'Остаток',
                        contact:
                            'Телефонный номер',
                        duedate_amount_error:
                            'Разница в сумме к оплате',
                        amount:
                            'Сумма',
                        pay:
                            'Платить',
                        invalid:
                            'Неверный',
                        disable:
                            'Отменить',
                        view:
                            'Посмотреть',
                        create_invoice_type:
                            'Создать счёт-фактуры',
                        please_create_invoice_type:
                            'Создайте вид счёт-фактуры',
                        select_class:
                            'Выберите класс',
                        fixed_amount:
                            'Постоянная денежная сумма',
                        custom_amount:
                            'Нерегулярные денежные суммы',
                        create_invoice: 'Создать счёт -фактуры',
                        re_create: 'Ещё раз создать счёт-фактуры',
                        edit_invoice:
                            'Исправить счёт-фактуры',
                        invoice_type: 'Тип счёт-фактуры',
                        invoice_type_is_default: 'Относиться ли к школе?',
                        invoice_type_vat_payer:
                            'Будете ли сдавать ИБаримт?',
                        invoice_type_vat_code:
                            'Код сервиса',
                        invoice_type_vat_code_description:
                            'Код вида услуги плательщика НӨАТ',
                        due_date:
                            'Срок оплаты',
                        due_date_expired:
                            'Опоздание в срок',
                        due_date_upcoming:
                            'Время оплаты',
                        insert_due_date:
                            'Введите срок оплаты',
                        class:
                            'Класс',
                        bank:
                            'Банк',
                        select_bank:
                            'Выберите Банк',
                        account_number:
                            'Номер счёта',
                        account_holder:
                            'Имя владельца счёта',
                        select_all_students:
                            'Выбрать всех детей класса',
                        disable_invoice_title:
                            'Аннулировать счёт-фактуру ?',
                        disable_invoice_description:
                            'Когда аннулируйте счёт-фактуру, то несможете заплатить оплату!',
                        note:
                            '”Примечание',
                        overPaymentDescription:
                            " Зарегистрировать переплату?",
                        paid_date:
                            'Дата оплаты',
                        paid_method:
                            'Вид оплаты',
                        discount:
                            'Льгота',
                        payment_graph:
                            'График оплаты',
                        payment_history:
                            'История платежей',
                        payment_information:
                            'Информация оплаты',
                        invoice_number:
                            'Номер счёт-фактуры',
                        invoice_name:
                            'Название счёт-фактуры',
                        created_date:
                            'Дата создания',
                        created_user:
                            'Пользователь создавший',
                        paid_amount:
                            'Сумма оплаты',
                        delete_invoice_type_description:
                            'Тип счет-фактуры будет удален. После удаления типа нельзя использовать повторно',
                        edit_invoice_type:
                            'Изменить счёт-фактуры',
                        total_amount:
                            'Общая сумма платежа',
                        total_payment:
                            'Всего к оплате',
                        discount_type:
                            'Вид льготы',
                        please_insert_discount_amount:
                            'Введите сумму льгота',
                        discount_information:
                            'Информация об льготе',
                        add_discount_type:
                            'Добавить тип льготы',
                        discount_percent:
                            'Процент льготы',
                        by_percent:
                            'По процентам',
                        by_amount:
                            'По стоимости',
                        discount_code:
                            'Код льготы',
                        discount_name:
                            'Название льготы',
                        edit_discount_type:
                            'Изменить категорию льготы',
                        delete_discount_type_description: 'Категория льготы будет удалена. После удаления категории нельзя использовать повторно',
                        pay_graph: 'График оплаты',
                        add_discount:
                            'Добавить льготу',
                        amount_not_constant:
                            'Денежная сумма нерегулярная',
                        pay_amount_less_error:
                            'Общая сумма оплаты ниже указанной в счёт-фактуре',
                        pay_amount_more_error: 'Общая сумма оплаты выше указанной в счёт -фактуре',
                        due_date_amount_more_error: 'Общая сумма оплаты выше суммы выбранной графики',
                        due_date_check_error: 'Сумма меньше, чем в первом графике выплат, поэтому выберите единый график выплат или увеличьте выплату',
                        pay_amount_error: 'Общая сумма к оплате не должна быть отрицательной',
                        left_amount: 'Остаток суммы',
                        payments_graph: 'График оплаты',
                        billed_amount: 'Сумма указанной в счёте',
                        cash_back:
                            'Возврат дохода',
                        cash_back_description: 'Вы уверены, что хотите удалить следующие записи о доходах? Обратите внимание, что после удаления его нельзя восстановить.',
                        already_day: 'Выбранная дата вводится дважды.',
                        charge:
                            'Зарядит',
                        currency:
                            'Вид валюты',
                        role_expire:
                            'Закрыть доступ',
                        statement_rows:
                            'Количество строк',
                        statement_connected:
                            'Количество связанных счетов',
                        statement_invoices:
                            'Соединённые счёта',
                        statement_not_connected:
                            'Счёт не подключен',
                        statement_connect_to_invoice:
                            'Соединить счёт',
                        statement_amount_error:
                            'Уплаченная сумма должна равняться сумме, подлежащей оплате в счете-фактуре',
                        view_other_invoices:
                            'Просмотреть другие счета'
                    }
                    ,
                    financeIncomesTrans: {
                        title: 'Доход',
                        cash:
                            'Касса',
                        bank_statement:
                            'Текущий счёт',
                        receipt_id:
                            'Номер счёта',
                        receipt_number: 'Номер платёжного счёта',
                        invoice_id: '№ счет-фактура',
                        invoice_number:
                            'Номер счет-фактуры',
                        create_cash:
                            'Зарегистрировать в кассу',
                        amount:
                            'Денежная сумма',
                        insert_amount: 'Введите сумму',
                        cash_receipt: 'Получение кассовых чеков',
                        cash_receiver:
                            'Получатель',
                        cash_payer:
                            'Плательщик',
                        cash_description:
                            'Назначение платежей',
                        cash_paid_amount:
                            'Оплаченная сумма',
                        cash_paid_amount_letter:
                            'Оплаченная сумма буквами',
                        cash_received:
                            'Получено',
                    },
                    foodDashboardTitle: 'Дашбоард еды',
                    foodConfig:
                        'Настройка еды',
                    foodDiscount:
                        'Льгота на еду',
                    foodDiscountUndo:
                        'Отправить обратно льготу',
                    foodDiscountUndoDescription:
                        'Вы уверены, что хотите вернуть зарегистрированную льготу?',
                    foodInvoice:
                        'Счет-фактура еды',
                    foodInvoiceCreate:
                        'Создать счет-фактуру еды',
                    foodSale:
                        'Правa на питание',
                    foodAddCategory:
                        'Добавить тип продукта',
                    foodEditCategory: 'Изменить тип продукта',
                    foodShopProductName:
                        'Наименование продукта',
                    foodShopProductCode:
                        'Код продукта',
                    foodShopProductPrice:
                        'Стоимость',
                    insertFoodQuantity:
                        'Введите количество',
                    isInactive:
                        'Активен ли',
                    shop:
                        'Магазин',
                    totalProduct:
                        'Количество',
                    competence:
                        {
                            title: 'Обязательныйе навыки',
                            add_file:
                                'Добавить файл',
                            edit_file:
                                'Изменить файл',
                            select_file:
                                'Выбрать файл',
                            file_list:
                                'Списоъ файла',
                            file_name:
                                'Наименование файла',
                            file:
                                'Файл',
                            exam_material:
                                'Экзаменационные материалы',
                            connected_type:
                                'Тип ссылки',
                            show_material:
                                'Посмотреть материалы',
                            connected_by:
                                'Связан вручную',
                            auto_connected:
                                'Связан автоматически',
                            not_connected:
                                'Нет подключения к учащемуся',
                            other_schools:
                                'Экзаменационные материалы других школ',
                            view_by_class:
                                'Просмотр по классам',
                            view_by_student:
                                'Посмотреть по ученикам'
                        }
                    ,
                    blueprint: {
                        title: 'Пример задания'
                    }
                    ,
                    link: {
                        title: 'Онлайн урок',
                        add_link:
                            'Добавить ссылку',
                        insert_link:
                            'Введите ссылку',
                        link:
                            'Ссылка',
                        error_link:
                            'Неправильная ссылка',
                    }
                    ,
                    financeSearch: {
                        title: 'Поиск'
                    }
                    ,
                    financeSearchStudentPortfolio: {
                        status: 'Статус',
                        invoice_name:
                            'Название счёта',
                        billed:
                            'Выставлен счёт',
                        paid:
                            'Оплачен',
                        incomplete:
                            'Неполный',
                        created_date:
                            'Даа создания',
                        created_user:
                            'Пользователь',
                        male:
                            'Мужской',
                        female:
                            'Женский',
                        family_name:
                            'Отчество',
                        last_name:
                            'Фамилия',
                        first_name:
                            'Имя',
                        birth_date:
                            'Дата рождения',
                        gender:
                            'Пол',
                        registerNumber:
                            'Регистрационный №',
                        entry_date:
                            'Дата поступления',
                        current_class_name:
                            'Текущая группа класса',
                        finance:
                            'Оплата',
                        food:
                            'Еда',
                        bus:
                            'Автобус',
                    }
                    ,
                    food: {
                        add: 'Добавить',
                        add_new:
                            'Добавить новое',
                        pay_amount:
                            'Сумма к оплате',
                        inactive:
                            'Отменить',
                        active:
                            'Подтвердить',
                        create_invoice_type:
                            'Создать тип счёта',
                        edit_invoice_type:
                            'Изменить тип счёта',
                        name:
                            'Имя',
                        insert_name:
                            'Введите имя',
                        bank:
                            'Банк',
                        choose_bank:
                            'Выбрать банк',
                        type:
                            'Тип',
                        choose_type:
                            'Выбрать тип',
                        amount:
                            'Сумма',
                        insert_amount:
                            'Введите сумму',
                        check_time_config:
                            'Устанавливать период действия прав?',
                        valid_date:
                            'Действительная дата',
                        inactive_invoice_type:
                            'Неактивизировать счета',
                        show:
                            'Смотреть',
                        paidAmount:
                            'Выплаченная сумма',
                        inactiveSelectedInvoice:
                            'Аннулировать выбранные счета',
                        correctDataError:
                            'Введите правильную дату',
                        insertInvoiceTypeName:
                            'Введите название типа счета-фактуры',
                        pleaseSelectInvoice:
                            'Выберите счет для деактивации',
                        sale_quantity:
                            'Количество прав',
                        teacher_staff:
                            'Учителя, сотрудники',
                        recordDiscount:
                            'Регистрация скидки',
                        choose_class:
                            'Выбрать класс',
                        select_student:
                            'Выбрать ученика',
                        discountAmount:
                            'Сумма скидки',
                        selectUser:
                            'Выбрать пользователя',
                        insertAmount:
                            'Введите сумму',
                        insertTeacher:
                            'Выберите учителей и сотрудников',
                        paid_method:
                            'Форма оплаты',
                        paid_date:
                            'Дата оплаты',
                        used_date:
                            'Дата использования',
                        used_amount:
                            'Потраченная сумма',
                        remaining:
                            'Остаток',
                        quantity:
                            'Права',
                        start_date:
                            'Начало',
                        end_date:
                            'Конец',
                        paid_history:
                            'История платежей',
                        discount:
                            'Скидка',
                        history:
                            'История',
                        no_information:
                            'Нет информации!',
                        studentFinance:
                            'Финансовая информация об ученике',
                        delete:
                            'Удалить',
                        edit_chef:
                            'Корректировать информацию о поваре',
                        food_price_edit:
                            'Корректировать цену еды',
                        chef:
                            'Повар',
                        add_chef:
                            'Добавить повара',
                        food_type_name:
                            'Название типы питания',
                        price:
                            'Цена',
                        food_price:
                            'Стоимость еды',
                        create_menu:
                            'Создать меню',
                        food_menu:
                            'Меню еды',
                        food_name:
                            'Название блюда',
                        insert_food_name:
                            'Введите название блюда',
                        user_role:
                            'Профиль пользователя',
                        loan_settings:
                            'Настройка кредита',
                        max_loan:
                            'Лимит кредита',
                        maximum:
                            'Максимум',
                        image_size_error:
                            'Размер изображения большой. Установите максимальный размер изображения на 1 мегабайт.',
                        image_type_error:
                            'Неправильные настройки фото. Фото должно быть в формате png, x-png, jpg, jpeg, gif.',
                        item_type_has_repeatable:
                            'Использовать несколько раз в день',
                        item_type_has_schedule:
                            'Есть ли график?',
                        start_time:
                            'Время начала',
                        end_time:
                            'Время окончания',
                        select_item_type:
                            'Выберите тип блюда',
                        by_day:
                            'Днем',
                        by_product:
                            'В товарах',
                        product_quantity:
                            'Количество товаров',
                        add_another_item:
                            'Переоформить товар',
                        description:
                            'Информация еды'
                    }
                    ,
                    foodDashboard: {
                        className: 'Группа',
                        totalStudents:
                            'Обучающиеся',
                        cameStudent:
                            'Присутствовал',
                        students_with_sale:
                            'Есть права',
                        students_food_used:
                            'Ел',
                        students_food_used_loan:
                            'Займ',
                        students_food_not_used:
                            'Не ел',
                        eater:
                            'Поел',
                        loan_eat:
                            'Ел по займу',
                        payment:
                            'Оплатил',
                        select_school_shift:
                            'Выбрать смену',
                        select_time:
                            'Выбрать время',
                        by_class:
                            'По группе',
                        by_class_title:
                            'По классам',
                        by_student:
                            'По ученикам',
                        paid:
                            'Оплатил',
                        incomplete:
                            'Недостаточно',
                    }
                    ,
                    foodDashboardModal: {
                        status: 'Состояние',
                        student_code:
                            'Код ученика',
                        lastname:
                            'Фамилия',
                        firstname:
                            'Имя',
                    }
                    ,
                    foodDashboardFoodUsedStudent: {
                        status: '',
                        used_date:
                            'Дата использования',
                        created_date:
                            'Дата регистрации',
                        created_user:
                            'Зарегистрированный пользователь',
                        class_name:
                            'Класс',
                        student_code:
                            'Код',
                        last_name:
                            'Фамилия',
                        first_name:
                            'Имя',
                        sale_status:
                            'Состояние',
                    }
                    ,
                    groupDashboard: {
                        title: 'Кружок дашбоард',
                        code:
                            'Код',
                        lastName:
                            'Фамилия',
                        firstName:
                            'Имя',
                        groupName:
                            'Кружки/секции',
                        totalStudents:
                            'Число обучающихся',
                        perWeek:
                            'Неделя',
                        className:
                            'Группа',
                        totalStudentsNumber:
                            'Общее количество учащихся',
                        clubCount:
                            'Кружок',
                        sportCount:
                            'Секция',
                        leftStudentCount:
                            'Ни разу не участвовал',
                    }
                    ,
                    groupDashboardModal: {
                        student_code: 'Код ученика',
                        last_name:
                            'Фамилия ученика',
                        first_name:
                            'Имя ученика',
                        numbers:
                            'Число',
                        clubs:
                            'Кружок',
                        sports:
                            'Секция',
                    }
                    ,
                    home: 'Начало',
                    invalid_date:
                        'Дата неверна',
                    roles:
                        {
                            admin: "Администратор",
                            parent:
                                "Родитель",
                            teachers_staffs:
                                "Учителя и сотрудники",
                            title:
                                'Права',
                        }
                    ,
                    sale: {
                        action_username: 'Имя пользователя',
                        charge:
                            'Заряжать',
                        create:
                            'Создать права',
                        currentBalance:
                            'Текущий баланс',
                        inactiveContent:
                            'Отменить выбранную услугу?',
                        inactiveTitle:
                            'Отменить права',
                        loan:
                            'Займ',
                        loanCharge:
                            'Займ и пополнение',
                        logHistory:
                            'История состояния права',
                        recover:
                            'Восстановить права',
                        payment:
                            'Оплата',
                        sale_not_found:
                            'Права на услуги не найдены',
                        title:
                            'Права на обслуживание',
                        type: 'Үйлчилгээний төрөл',
                        usedDate: 'Ашигласан огноо',
                        usedFoodDate: 'Хоолонд орсон огноо'
                    }
                    ,
                    save: 'Сохранить',
                    survey:
                        {
                            edit: 'Исправить опрос',
                            title:
                                'Опрос/исследование',
                            main_information:
                                'Общая информация',
                            questions:
                                'Опрос',
                            question_description:
                                'Объяснение опроса',
                            confirmation:
                                'Подтверждение',
                            next:
                                'Следующий',
                            survey_code:
                                'Код опроса',
                            survey_name:
                                'Название опроса',
                            insert_code:
                                'Введите код',
                            insert_name:
                                'Введите имя',
                            survey_class:
                                'Опрашиваемый класс',
                            choose:
                                'Выбрать',
                            start_date:
                                'Дата/время начала',
                            select_time:
                                'Выберите время',
                            end_date:
                                'Дата/время окончания',
                            category:
                                'Категория',
                            survey_purpose:
                                'Цель опроса',
                            start:
                                'Начало',
                            end:
                                'Конец',
                            classes:
                                'Классы',
                            add_survey_category:
                                'Добавить категорию исследования',
                            parent_category:
                                'Категория принадлежности',
                            delete_survey_category:
                                'Удалить категорию исследований',
                            edit_survey_category:
                                'Корректировать категорию исследований',
                            survey_date:
                                'Период опроса',
                            add_question:
                                'Добавить опрос',
                            answers:
                                'Ответы',
                            question_type:
                                'Тип опроса',
                            answer_required:
                                'Обязательно выбрать ответ',
                            allow_multiple_answers:
                                'Выбрать несколько ответов',
                            insert_question:
                                'Введите опрос',
                            insert_question_description:
                                'Введите описание опроса',
                            insert_answer:
                                'Введите ответ',
                            add_more_question:
                                'Добавить опрос',
                            change_order:
                                'Изменить порядок',
                            delete_question:
                                'Удалить опрос',
                            select_question_type:
                                'Выберите тип опроса',
                            delete_survey:
                                'Удалить исследование',
                            disable_survey:
                                'Деактивировать опрос',
                            disable_survey_confirmation:
                                'Вы уверены, что хотите деактивировать?',
                            disable_survey_confirmation_description:
                                'Обратите внимание, что неактивные отчеты об опросе нельзя просмотреть.',
                            select_category:
                                'Выберите категорию',
                            survey_classes:
                                'Охваченные классы',
                            category_not_found:
                                'Категория не найдена',
                            edit_questions:
                                'Корректировать опрос',
                            excel_by_students:
                                'Эксель по ученикам',
                        }
                    ,
                    foodDashboardFinanceModalStudents: {
                        status: 'Тип',
                        student_code:
                            'Код ученика',
                        last_name:
                            'Фамилия ученика',
                        first_name:
                            'Имя ученика',
                        amount:
                            'Счёт к оплате',
                        unpaid_amount:
                            'Остаток',
                        paid_amount:
                            'Заплатил',
                        contactParent:
                            'Обратная связь',
                    }
                    ,
                    busDashboard: {
                        in_count: 'Число сидящих',
                        out_count:
                            'Число вне счета',
                        today:
                            'Сегодня',
                        week:
                            '14 дней',
                        payment:
                            'Платёж',
                        route_info:
                            'Информация маршрута',
                        passengers_information:
                            'Информация пассажиров',
                        total_student_by_bus:
                            'Общая информация всех пассажиров автобуса',
                        route:
                            'Маршрут',
                        search_by_code:
                            'Поиск учащихся по коду',
                        select_route:
                            'Выбрать маршрут',
                        select_class:
                            'Выбрать группу',
                        select_student:
                            'Выбрать ученика',
                        total_students:
                            'Всего количество учеников',
                        incomplete_students:
                            'Количество учеников с остатком по платежу',
                        overPayment:
                            'Излишнее',
                        by_route:
                            'По маршруту',
                        by_student:
                            'Учеником',
                        active:
                            'Активный',
                        loan:
                            'Займ',
                        loan_config:
                            'Настройки займа',
                        no_sale:
                            'Нет права',
                        map:
                            'Карта положения',
                        price:
                            'Цена'
                    }
                    ,
                    busDashboardToday: {
                        name: 'Маршрут',
                        in_count:
                            'Количество пассажиров',
                        incomplete_students:
                            'Оплата с остатком',
                        loan_students:
                            'Проезд за займ',
                    }
                    ,
                    busDashboardTodayModal: {
                        status: 'Статус',
                        class_name:
                            'Группа',
                        student_code:
                            'Код',
                        last_name:
                            'Фамилия',
                        first_name:
                            'Имя',
                        in:
                            'Сидеть',
                        out:
                            'Опуститься',
                        registered_driver:
                            'Водитель, который провёл регистрацию',
                        route_direction:
                            'Маршрут',
                    }
                    ,
                    busDashboardWeekDirectionStudents: {
                        used_date: 'Дата',
                        driver_name:
                            'Водитель',
                        status_sit:
                            'Статус сидеть',
                        direction:
                            'Остановка',
                        class_name:
                            'Группа',
                        student_code:
                            'Код',
                        last_name:
                            'Имя родитилей',
                        first_name:
                            'Имя ученика',
                        unknown:
                            'Состояние1',
                        unknown1:
                            'Состояние2',
                    }
                    ,
                    busDashboardWeekStudents: {
                        add: 'Добавить автобус',
                        used_date:
                            'Дата',
                        status_sit:
                            '',
                        direction:
                            'Маршрут',
                        station:
                            'Остановка',
                        driver_name:
                            'Водитель',
                        insert_driver_name:
                            'Введите водителя',
                        route:
                            'Маршрут',
                        route_number:
                            '№ маршрута',
                        route_name:
                            'Название маршрута',
                        insert_route_number:
                            'Введите № маршрута',
                        insert_route_name:
                            'Введите название маршрута',
                        stop_count:
                            'Количество остановок',
                        checker:
                            '',
                        add_driver:
                            'Добавить водителя',
                        edit_driver:
                            'Исправить данные водителя',
                        remove_driver:
                            'Убрать водителя',
                        remove_driver_title:
                            'Убрать ли водителя?',
                        number:
                            '№ автобуса',
                        insert_number:
                            'Введите № автобуса',
                        add_route:
                            'Добавить маршрут',
                        edit_route:
                            'Исправить маршрут',
                        delete_bus:
                            'Удалить автобус',
                        delete_route:
                            'Удалить машрут',
                        delete_bus_title:
                            'Удалить ли информацию автобуса?',
                        delete_route_title:
                            'Удалить ли информацию о маршруте?'
                    }
                    ,
                    busNoSale: {
                        title: 'Учащиеся не имеющие право на проезд в автобусе',
                        used_quantity:
                            'Количество проезжающих',
                        created_loan:
                            'Оформить займ',
                        no_sale:
                            'Учащиеся без права на проезд',
                        total_amount:
                            'Всего',
                    }
                    ,
                    filesDt: {
                        subject: 'Урок',
                        file:
                            'Файл',
                        file_limit:
                            'Требование не выше 25MB',
                        file_limit_with_video:
                            'Внимание файл не должен превышать 25Mb, а видео не больше 50Mb.',
                        image_type_error:
                            'Тип файла не подходит. Настроить тип файла / png, x -png, jpg, jpeg, gif, docx, xlsx, pptx, wmv, mp4, mp3, mpeg /',
                        image_type_video_error: 'Не подходит тип файла. Настроить вид файла /mp4, mpeg, avi, mov, wmv/ .',
                        created_date:
                            'Дата регистрации',
                        created_user:
                            'Зарегистрированный использователь',
                        delete_button:
                            '',
                    }
                    ,
                    timetable: {
                        room: 'Комната',
                        add_subject:
                            'Добавить урок',
                        choose_day:
                            'Выберите день',
                        select_class:
                            'Выберите класс',
                        select_students:
                            'Выберите ученика',
                        select_subject:
                            'Выберите урок',
                        title:
                            'Расписание уроков',
                        club_title:
                            'Расписание кружков',
                        subject:
                            'Урок',
                        teacher:
                            'Учитель',
                        score_weight:
                            '% оценивания',
                        get_previous_season_data:
                            'Скачать данные за прошлый четверть',
                        monday:
                            'Понедельник',
                        tuesday:
                            'Вторник',
                        wednesday:
                            'Среда',
                        thursday:
                            'Четверг',
                        friday:
                            'Пятница',
                        add:
                            'Добавить расписание уроков',
                        day:
                            'День недели',
                        time:
                            'Время',
                        edit:
                            'Исправить расписание уроков',
                        class_student:
                            'Проанализировать',
                        class_all_students:
                            'Учащиеся всего класса',
                        group_student:
                            'Разделить на группы',
                        day_not_empty:
                            'Расписание занятий было зарегистрировано на выбранный день, поэтому нажмите «Редактировать расписание занятий», чтобы внести изменения',
                        time_not_empty:
                            'Выбранное время дня повторяется',
                        empty_timetable:
                            'Не зарегистрировано расписание уроков. Перейдите в подменю «Расписание уроков» и введите расписание.',
                        check_group_info:
                            'Информацию о группе внесены не до конца',
                        download_last_season_timetable:
                            'ЗАГРУЗИТЬ ГРАФИК ПРОШЛОГО СЕМЕСТРА',
                        select_day:
                            'Выберите день!',
                        empty:
                            'График не создан',
                    }
                    ,
                    homework: {
                        assigned: 'Выдано домашнее задание',
                        assign_date:
                            'Дата домашнего задания',
                        checked_date:
                            'Дата проверки Д/З',
                        checked:
                            'Д/З проверено',
                        checkedHomework:
                            'Проверенное Д/З',
                        title:
                            'Домашнее задание',
                        date_description:
                            'Дата проверки домашнего задания',
                        delete_homework_info:
                            'Удалить ли информацию?',
                        delete_homework:
                            'Удалить ли домашнее задание?',
                        delete_homework_description:
                            'Обратите внимание, что после удаления домашнего задания, данные, связанные с этим домашним заданием, не могут быть восстановлены',
                        delete_student_homework:
                            'Удалить ли информацию о Д/З ученика?',
                        delete_student_homework_description:
                            'Обратите внимание, что после удаления домашнего задания данные, связанные с этим домашним заданием, не могут быть восстановлены.',
                        score:
                            'Получаемый счет',
                        file:
                            'Файл',
                        file_loading:
                            'Получить файл',
                        insert_file:
                            'Загрузить файл',
                        select_file:
                            'Выбрать файл',
                        no_file:
                            'Не загрузили файл',
                        not_found:
                            'Не задавали домашнее задание',
                        file_warning_message:
                            'Обратите внимание, что данные учащегося будут пересчитаны при изменении балла!!!',
                        homework_assigned_already:
                            'В выбранный день было задано домашнее задание',
                        homework_check:
                            'Проверить домашнее задание',
                        homework:
                            'Задать домашнее задание',
                        homework_due_date:
                            'Дата проверки Д/З',
                        homework_due_date_error:
                            'Дата проверки домашнего задания должна быть сегодня или в прошлом Пожалуйста проверьте свою дату.',
                        homework_sent:
                            'Отправлено',
                        homework_not_sent:
                            'Не отправлено',
                        score_higher_that_max_score:
                            'Оценка учащегося за домашнее задание больше, чем должно быть',
                        score_lower_that_max_score:
                            'Оценка учащегося за домашнее задание ниже ожидаемой',
                        empty_score:
                            'Оценка учащегося по домашнему заданию пуста, пожалуйста, введите оценку',
                        please_select_status:
                            'Выбрать статус исполнения Д/З.',
                        done:
                            'Выполнено',
                        not_done:
                            'Не выполнено',
                        not_checked:
                            'Не проверено',
                        total_score_error:
                            'Баллов не может быть больше, чем общее количетсво доступных баллов',
                    }
                    ,
                    homeworkReport: {
                        class_club: 'Класс / Кружок',
                        subject:
                            'Урок',
                        season:
                            'Четверть',
                        homework:
                            'Задание',
                        notChecked:
                            'Не проверено',
                        notCheckedShortName:
                            'НеПр',
                        insert_class_club:
                            'Класс / Выберите кружок',
                        insert_subject:
                            'Выберите урок',
                        insert_season:
                            'Выберите четверть',
                        insert_score:
                            'Введите баллы',
                        score:
                            'Балл',
                        takenScore:
                            'Полученный балл',
                    }
                    ,
                    homeworkDashboard: {
                        title: 'Домашнее задание',
                        seasonText:
                            'Четверть',
                        dateText:
                            'Дата',
                        showText:
                            'СМОТРЕТЬ',
                        errorFields:
                            'Выберите и заполните следующие поля!!!',
                        by_class:
                            'По группам',
                        by_subject:
                            'По урокам',
                        by_teacher:
                            'По учителям',
                    }
                    ,
                    homeworkDashboardDtClass: {
                        class_name: 'Группа',
                        total:
                            'Всего'
                    }
                    ,
                    homeworkDashboardDtClassModal: {
                        due_date: 'Дата',
                        subject_name:
                            'Урок',
                        first_name:
                            'Учитель',
                        complete:
                            'Б',
                        incomplete:
                            'Д',
                        no_assignment:
                            'ХГ',
                    }
                    ,
                    homeworkDashboardDtTeacherModal: {
                        due_date: 'Дата',
                        subject_name:
                            'Урок',
                        class_name:
                            'Группа',
                        complete:
                            'Б',
                        incomplete:
                            'Д',
                        no_assignment:
                            'ХГ',
                    }
                    ,
                    nfc: {
                        title: 'NFC регистрация'
                    }
                    ,
                    notification: {
                        unreadNotification: 'Есть непрочитанное уведомление [number]',
                        readAll: 'Сделать так, чтобы все прочитали'
                    },
                    teacher: {
                        add_teacher: 'Добавить учителя',
                        timeTableCount: 'Хичээлтэй цаг',
                        title:
                            'Учителя',
                        working:
                            'Работает',
                        not_working:
                            'Уволился',
                        add:
                            'Добавить снова',
                        examGroupCount: 'Дүн гарсан бүлгийн тоо',
                        photo:
                            'Фотография',
                        lastname:
                            'Фамилия учителя',
                        name:
                            'Имя учителя',
                        phone_number:
                            'Номер телефона',
                        code:
                            'Код учителя',
                        subjects:
                            'Преподаваемый урок',
                        subjectCount: 'Хичээл ордог бүлгийн тоо',
                        teacher_class:
                            'Руководствующий класс',
                        list:
                            'Список учитель',
                        login_name:
                            'Логин',
                        current_login_name:
                            'Текущее имя пользователя',
                        new_login_name:
                            'Новый логин',
                        new_login_name_repeat:
                            'Снова ввести новый логин',
                        new_lastname:
                            'Фамилия',
                        new_lastname_placeholder:
                            'Введите фамилию',
                        new_name:
                            'Имя',
                        new_name_placeholder:
                            'Введите имя',
                        insert_phone_number:
                            'Введите номер телефона',
                        insert_teacher_code:
                            'Введите код учителя',
                        insert_teacher_title:
                            'Введите должность',
                        teacher_title:
                            'Должность',
                        role:
                            'Педагогическая уровень',
                        select_role:
                            'Выберите уровень учителя',
                        view:
                            'Смотреть',
                        info_add:
                            'Добавить информацию учителя',
                        insert_info:
                            'Введите информацию учителя',
                        excuse:
                            'Увольнение учителя',
                        excuseStaff:
                            'Увольнение рабочего',
                        gender:
                            'Пол',
                        select_gender:
                            'Выбрать пол',
                        select_school:
                            'Выбрать школу',
                        teacher_info:
                            'Краткая информация учителя',
                        role_teacher:
                            'Учителя',
                        role_director:
                            'Директор',
                        role_staff:
                            'Социальный педагог',
                        role_school_staff:
                            'Сотрудники школы',
                        role_manager:
                            'Учебный менеджер',
                        role_lead_teacher:
                            'Старший учитель',
                        change_photo:
                            'Изменить изображение',
                        set_teacher:
                            'Перевести в состояние учителя',
                        set_staff:
                            'Перевести в состояние рабочего',
                        change_status:
                            'Изменить в состояние учителя',
                        change_status_staff:
                            'Изменить в состояние рабочего',
                        set_teacher_button_label:
                            'ПЕРЕВЕСТИ В СОСТОЯНИЕ УЧИТЕЛЯ',
                        edit:
                            'Редактировать учителя',
                        select_school_grade:
                            'Выберите уровень школы',
                        change_phone_number_description:
                            'Обратите внимание, что если вы измените номер учителя, вы не сможете войти в систему с предыдущим номером.',
                        change_login_name_description:
                            'Обратите внимание, что изменение вашего логина учителя не позволит вам войти в систему с вашим предыдущим логином.',
                        change_login_name_description_staff:
                            'Обратите внимание, что изменение логина сотрудника не позволит получить доступ к предыдущему логину.',
                        change_phone_number:
                            'Изменить № учителя',
                        change_login_name:
                            'Изменить логин учителя',
                        change_login_name_staff:
                            'Изменить логин учителя',
                        change_password:
                            'Изменить пароль учителя',
                        change_password_staff:
                            'Изменить пароль сотрудника',
                        change_password_description:
                            'Обратите внимание, что если вы измените пароль учителя, вы не сможете войти со своим старым паролем!',
                        change_password_description_staff:
                            'Обратите внимание, что изменение пароля сотрудника предотвратит доступ со старым паролем!',
                        manage_roles:
                            'Изменение прав учителя',
                        staff_code:
                            'Код рабочего',
                        staff_card_title:
                            'Удостоверение учителя, рабочего',
                        journal:
                            'Журнал',
                        hw:
                            'Домашнее задание',
                        classThatWillTakeExam:
                            'Экзаменационный класс',
                        onlineLesson:
                            {
                                title: 'Онлайн обучение',
                                createCourse:
                                    'Создать курс',
                                createNewCourse:
                                    'Создать новый курс',
                                lesson:
                                    'Обычный урок',
                                group:
                                    'Группы уроков',
                                collaboratingTeacher:
                                    'Сотрудничающий учитель',
                                activityName:
                                    'Заголовка урока',
                                enrollStudents:
                                    'Набор учащихся',
                                inCourse:
                                    'В ходе курса',
                                toCourse:
                                    'Перейти в курс',
                                editCourse:
                                    'Коррекция курса',
                                courseUrl:
                                    'URL курса',
                                changeLink:
                                    'Изменить ссылку',
                                userCode:
                                    'Код пользователя',
                                canEdit:
                                    'Есть ли право на редактирование',
                                addUser:
                                    'Добавить пользователя',
                                notFound:
                                    'Онлайн урок не найден',
                            }
                    }
                    ,
                    group: {
                        addClass: 'Бүлэг нэмэх',
                        addStudent: 'Сурагч нэмэх',
                        approveStudents: 'Сурагчдыг баталгаажуулах',
                        title: 'Группа',
                        type:
                            'Тип',
                        class_teacher_title:
                            'Классный руководитель',
                        student_count:
                            'Количество обучающихся',
                        score_type:
                            'Тип оценивания',
                        classroom:
                            'Комната',
                        school_shift:
                            'Смена',
                        grade:
                            'Уровень',
                        select_grade:
                            'Выберите смену',
                        code:
                            'Код класса',
                        class_teacher:
                            'Классный руководитель',
                        list:
                            'Список групп',
                        edit:
                            'Корректировать группу',
                        year:
                            'Год',
                        name:
                            'Класс',
                        calendar:
                            'Классный календарь',
                        teacher_list:
                            'Список учителей',
                        group_not_found:
                            'Не найдена информация группы',
                        addAgain:
                            'Снова добавить группу',
                    }
                    ,
                    subject: {
                        index: 'Индекс',
                        credit:
                            'Пакетное время',
                        name:
                            'Название урока',
                        code:
                            'Код урока',
                        teacher:
                            'Учитель',
                        subject_class:
                            'Преподаваемый класс',
                        title:
                            'Урок',
                        type:
                            'Тип',
                        insert_index:
                            'Введите индекс урока',
                        insert_name:
                            'Введите название урока',
                        insert_teacher:
                            'Введите преподаваемого учителя',
                        list:
                            'Список урок',
                        subject_type:
                            'Тип урок',
                        grade:
                            'Степень',
                        close_button_label:
                            'ЗАКРЫТЬ',
                        edit:
                            'Редактировать урок',
                        insert_credit:
                            'Введите пакет времени',
                        select_subject_type:
                            'Выберите тир урока',
                        select_teacher:
                            'Выберите преподаваемого учителя',
                        isAll:
                            'Все ли изучают',
                        isResult:
                            'Выставлять ли оценки',
                    }
                    ,
                    student_card: {
                        title: 'Ученический билет',
                        create:
                            'Создать ученический билет',
                        grade:
                            'Уровень',
                        class_title:
                            'Группа',
                        select_all_students:
                            'Выбрать всех',
                        close_button_label:
                            'ЗАКРЫТЬ',
                        order:
                            'Заказать билет',
                        print:
                            'Распечатать ученический билет',
                        card_recreate:
                            'Аннулировать ученический билет и распечатать новый?',
                        recreate:
                            'Создать снова',
                        printed:
                            'Распечатан',
                        printed_date:
                            'Дата печати',
                        print_description:
                            'Распечатать ученические билеты?',
                        print_recreate_description:
                            'Отменить существующий «ученический билет» следующих студентов и распечатать новый? Выберите имена учащихся, с которыми вы согласны.',
                        connect_student:
                            'Соединить учащегося',
                    }
                    ,
                    calendar: {
                        title: 'Школьный календарь',
                        color:
                            'Цвет',
                        add_activity:
                            'Добавить мероприятие',
                        no_event:
                            'Мероприятие не найдено',
                        activity:
                            'Активность',
                        activity_name:
                            'Название мероприятия',
                        start_end_date:
                            'Дата начала и окончания',
                        start_end_time:
                            'Начало и конец',
                        is_full_day:
                            'Продлится ли весь день',
                        length:
                            'Время продолжения',
                        description:
                            'Объяснение',
                        today:
                            'Сегодня',
                        view_event:
                            'Просмотреть мероприятие',
                        start_date:
                            'Дата начала',
                        end_date:
                            'Дата окончания',
                        edit_event:
                            'Редактировать мероприятие',
                        month:
                            'Месяц',
                        week:
                            'Неделя',
                        day:
                            'День',
                        list:
                            'Список',
                        all_day:
                            'Целый день',
                        enter_event_name:
                            'Введите название мероприятия.',
                        enter_start_date:
                            'Введите дата начала',
                        enter_end_date:
                            'Введите дата окончания',
                        enter_start_time:
                            'Введите время начала',
                        enter_end_time:
                            'Введите время окончания',
                        time_duplicate:
                            'Время совпадает',
                    }
                    ,
                    parents: {
                        confirmed: 'Зөвшөөрсөн',
                        total_parents: 'Общее количество родителей',
                        no_parent:
                            'Учащиеся без родителей',
                        parent_user_expired:
                            'Доступ к сервису отключён',
                        parentTotalTime:
                            'Общее время, проведенное родителями',
                        close_button_label:
                            'ЗАКРЫТЬ',
                        user_name:
                            'Имя пользователя',
                        title:
                            'Опекун',
                        settings: 'Асран хамгаалагчийн тохиргоо',
                        pendingConfirmation: 'Зөвшөөрөл хүлээж байгаа'
                    }
                    ,
                    movement: {
                        between_success: 'Миграция прошла успешно',
                        title:
                            'Миграция',
                        out_title:
                            'Переход',
                        entry_date:
                            'Дата постуления',
                        in:
                            'Мигрирует',
                        register_sheet:
                            'Лист регистрации',
                        register_sheet_description:
                            'Распечатайте «Регистрационный лист» с информацией о вновь зарегистрированном учащемся и отдайте один экземпляр родителям. Оставшийся процент дать финансовому директору.',
                        add_student:
                            'Добавить ученика',
                        add_one_student:
                            'Добавить одного ученика',
                        add_multiple_students:
                            'Добавить несколько учащихся',
                        add:
                            'Добавить ученика',
                        force_movement:
                            'Ученик не оплатил указанный выше счет/кредит. В случае перевода из школы с задолженностью выберите вариант выше. Пожалуйста, напишите подробну ю информацию об остатке платежа в разделе комментариев.',
                        from_school_name: 'Ирсэн сургууль',
                        insert_code:
                            'Введите код',
                        last_name:
                            'Фамилия',
                        out_action:
                            'Отписать',
                        out_success:
                            'Ученик снят с регистрации',
                        insert_last_name:
                            'Введите фамилию и имя',
                        insert_first_name:
                            'Введите имя',
                        birth_date:
                            'Дата рождения',
                        insert_register_number:
                            'Введите № регистрации',
                        from_class:
                            'Ушедший класс',
                        to_class:
                            'В класс',
                        transfer:
                            'Передача',
                        between:
                            'Внутренний переход',
                        view:
                            'СМОТРЕТЬ',
                        between_new:
                            'Добавить внутренний переход',
                        between_title:
                            'Внутренняя миграция',
                        up:
                            'Продвинуть класс',
                        up_class:
                            'Продвинутый класс',
                        up_date:
                            'Дата продвижения',
                        up_title:
                            'Продвинуть класс',
                        up_user:
                            'Пользователь, который продвинул',
                        no_year:
                            'Учебный год для продвижения класса не создан',
                        no_classes_next_year:
                            'Класс на следующий учебный год не создан',
                        to_class_title:
                            'Переходный класс',
                        qr_1:
                            '1. Отсканируйте QR -код слева, чтобы загрузить приложение eParent.',
                        qr_2: '2. Зарегистрироваться с вашими данными.',
                        qr_3: '3. Отсканируйте приведенный выше QR -код в разделе добавления ребенка, чтобы просмотреть информацию о вашем ребенке.',
                    }
                    ,
                    exam: {
                        title: 'Экзамен',
                        subject:
                            'Урок',
                        flow_exam:
                            'Текущий экзамен',
                        season_exam:
                            'Экзамен за триместр',
                        date:
                            'Дата экзамена',
                        name:
                            'Название экзамена',
                        create:
                            'Создать экзамен',
                        template_name:
                            'Название шаблона',
                        season:
                            'Четверть',
                        report:
                            'Отчет',
                        list:
                            'Список',
                        students_progress:
                            'Прогресс учащихся',
                        insert_score:
                            'Ввести оценки',
                        full_score:
                            'Полный балл',
                        exam_regard:
                            'Обратить внимание',
                        max_average:
                            'Выше среднего',
                        max_score:
                            'Максимальный балл',
                        min_average:
                            'Ниже среднего',
                        min_score:
                            'Минимальный балл',
                        notFound:
                            'Не найдена информация экзамена',
                        score:
                            'Оценка',
                        exam_all_student_count_title:
                            'Будет оценен',
                        exam_student_count_title:
                            'Оценен',
                        calculate_generalization:
                            'вычислить обобщение',
                        calculate_ranking:
                            'рассчитать рейтинг',
                        ranking:
                            'Рейтинг',
                        score_type:
                            'Оценка',
                        score_empty:
                            'Введите балл',
                        exam_complete:
                            'Полный',
                        exam_incomplete:
                            'Не полный',
                        exam_no_score:
                            'Совсем не сделан',
                        performance_percent:
                            '% эффективности',
                        publish_description:
                            'После подтверждения введенные вами оценки будут видны родителям напрямую, и вы не сможете редактировать или удалять информацию.',
                        publish_title:
                            'Обратите внимание, что после подтверждения результата теста его нельзя будет отредактировать или удалить.',
                        publish_title_season:
                            'Обратите внимание, что результаты триместра нельзя редактировать или удалить после подтверждения.',
                        publish_title_description:
                            'Учителям и родителям видны только подтвержденные оценки.',
                        insert_exam_template_question:
                            'Введите назначение шаблона экзамена',
                        insert_with_percentage:
                            'Рассчитывать в процентах при записи оценок',
                        delete_student_score_title:
                            'Удалить оценку ученика?',
                        delete_student_score:
                            'Удалить оценку ученика',
                        taken_score:
                            'Полученный балл',
                        exam_total_score:
                            'Балл, который нужен получать',
                        score_higher_that_max_score:
                            'Тестовый балл учащегося выше, чем квалификационный балл',
                        score_lower_that_max_score:
                            'Тестовый балл учащегося ниже квалификационного балла',
                        empty_score:
                            'Результат теста учащегося пуст, пожалуйста, введите балл',
                        warning_message:
                            'Обратите внимание, что в случае изменения экзаменационного балла балл ученика будет пересмотрен!!!',
                        average_success:
                            'Общее оценочное достижение',
                        yearType: 'Хагас жил',
                        changePercentage:
                            'Изменить %',
                        changeScore:
                            'Изменить балл',
                    }
                    ,
                    evaluation: {
                        title: 'Отношение, зрелость'
                    }
                    ,
                    absent: {
                        attachmentView: 'Хавсралт харах',
                        title: 'Освобождение',
                        created_user:
                            'Созданный пользователь',
                        period:
                            'Время',
                        request:
                            'Запрос освобождения',
                        select_type:
                            'Выберите тип освобождения',
                        registration:
                            'Регистрация освобождения',
                        view:
                            'Смотреть',
                        register:
                            'Регистрация освобождения',
                        request_sender:
                            'Запрос отправлен',
                        reason:
                            'Причина',
                        start_date:
                            'Начало',
                        end_date:
                            'Конец',
                        description:
                            'Объяснение',
                        subject_name:
                            'Урок',
                        user:
                            'Пользователь',
                        sick:
                            'Болен',
                        excused:
                            'Освобожден',
                        excuseSettingUser: 'Зөвшөөрөх хэрэглэгч',
                        excuseSettings: 'Чөлөөний тохиргоо',
                        excuseSettingsCreate: 'Чөлөөний тохиргоо нэмэх',
                        excuseSettingsEdit: 'Чөлөөний тохиргоо засах',
                        excuseMinDay: 'min өдөр',
                        excuseMaxDay: 'max өдөр',
                        day:
                            'День',
                        time:
                            'Время',
                        response:
                            'Ответить на запрос освобождения',
                        decline:
                            'Отказать',
                        approve:
                            'Разрешать',
                        select_class:
                            'Выберите класс',
                        select_student:
                            'Выберите ученика',
                        select_subject:
                            'Выберите урок',
                        select_start_date:
                            'Выберите дату начала',
                        select_end_date:
                            'Выберите дату окончания',
                        select_day:
                            'Выберите день',
                        select_reason:
                            'Выбрать причину',
                        dateError:
                            'Дата окончания не может быть раньше даты начала',
                        notResponded:
                            'Не ответил',
                        requestDate:
                            'Дата запроса',
                        respondedUser:
                            'Ответивший пользователь',
                    }
                    ,
                    exam_template: {
                        question_number: '№ вопроса',
                        answer:
                            'Ответ',
                        title:
                            'Образец экзамена',
                        select:
                            'Выберите образец экзамена',
                        code:
                            'Код образца',
                        name:
                            'Название образца',
                        exam_type:
                            'Тип экзамена',
                        subject:
                            'Урок',
                        category:
                            'Категория',
                        subject_category:
                            'Категории урока',
                        select_category:
                            'Выберите категорию урока',
                        total_question:
                            'Всего вопросов',
                        created_date:
                            'Дата создания',
                        created_user:
                            'Созданный пользователь',
                        disable:
                            'Отменить',
                        answer_disable:
                            'Отменить ответ',
                        view:
                            'Просмотреть',
                        question:
                            'Вопрос',
                        question_score:
                            'Оценка вопроса',
                        number:
                            'Число',
                        insert_number:
                            'Введите число',
                        create_question_please:
                            'Вопрос',
                        total_score:
                            'Получаемый балл',
                        only_me:
                            'Только я использую',
                        not_only_me:
                            'Все будут использовать',
                        confirmation:
                            'Подтвердить',
                        task:
                            'Задание',
                        score:
                            'Балл',
                        insert_score:
                            'Вставить балл',
                        insert_code:
                            'Введите код',
                        insert_name:
                            'Введите имя',
                        choose_template_name:
                            'Введите название шаблона',
                        choose_exam_type:
                            'Введите тип теста',
                        select_subject:
                            'Выберите урок',
                        select_exam_type:
                            'Выберите тип экзамена',
                        exam_complete:
                            'Завершенный',
                        exam_incomplete:
                            'Незавершенный',
                        exam_no_score:
                            'Вообще не сделан'
                    }
                    ,
                    omr_exam_template: {
                        title: 'Единая схема экзамена',
                        file:
                            'Название файла единого экзамена',
                        insert_file:
                            'Введите название файла единого экзамена',
                        please_select:
                            'Введите единый шаблон экзамена',
                        empty:
                            'Пусто',
                        subject_group:
                            'Группа уроков'
                    }
                    ,
                    omr_exam: {
                        title: 'Единый экзамен'
                    }
                    ,
                    season_score: {
                        calculate: 'Расчитать',
                        calculated_exam_count:
                            'Количество оцененных уроков',
                        title:
                            'Результаты триместра класса',
                        total_subject_count:
                            'Общее количество уроков',
                        subject_count:
                            'Количество уроков',
                        report:
                            'Отчет',
                        list:
                            'Список',
                        flow_season_score:
                            'Оценки триместра/ежеквартальные результаты',
                        students_progress:
                            'Прогресс учащихся',
                        student_progress:
                            'Прогресс учащегося',
                        board:
                            'Оценочный расчет',
                        board_unpublish_description:
                            'Отменить фиксированную плоскость оценок?',
                        season:
                            'Триместр',
                        performance:
                            'Производительность',
                        quality:
                            'Качество',
                        success:
                            'Успех',
                        student_count:
                            'Количество обучающихся',
                        published_date:
                            'Дата подтверждения',
                        method:
                            'Метод',
                        total_average:
                            'Общий результат',
                        subject:
                            'Урок',
                        disable:
                            'Запрещать',
                        view:
                            'Просмотреть',
                        create_class_board:
                            'Создать плоскость оценки класса',
                        published:
                            'Оценки триместра подтверждены',
                        publish_description:
                            'Обратите внимание, что плоскость подтвержденной оценки не может быть отредактирована или удалена,',
                        select_class:
                            'Выберите группу',
                        select_season:
                            'Выберите триместр',
                        select_method:
                            'Выберите метод',
                        score_template:
                            'Структура оценки',
                        select_score_template:
                            'Выберите структуру оценки',
                        skill:
                            'Оценка навыков',
                        total_credit:
                            'Всего часов',
                        chooseExam:
                            'Выбрать экзамен',
                        examChoice:
                            {
                                title: 'Выберите экзамены, которые повлияют на результаты триместра.',
                                description:
                                    'Выбранная вами структура оценивания влияет на результаты тестов.',
                            }
                        ,
                        skillChoice: {
                            title: 'Выберите оценку, которая повлияет на результаты триместра.',
                            description:
                                'На выбранную вами структуру рейтинга влияют рейтинги навыков.',
                        }
                        ,
                        chooseOne: 'Выберите по меньшей мере один тест'
                    }
                    ,
                    school_settings: {
                        attendanceType: 'Ирцийн төлөв',
                        attendanceTypeConfig: 'Ирцийн тохиргоо',
                        attendanceTypeDescription: 'Ирцийн төлөвт оноо өгөх үү?',
                        attendanceTypeFullDescription: 'Ирцийн төлөвт оруулсан оноо нь дүн гаргах үед татагдах ирцийн оноонд нөлөөлөхийг анхаарна уу',
                        attendanceTypeScore: 'Төлвийн оноо',
                        capacity: 'Место',
                        capacity_number:
                            'Количество мест',
                        detention: 'Сахилга бат',
                        relationHasConfirmation: 'Ангийн багш зөвшөөрөл өгөх эсэх',
                        room_number:
                            '№ комнаты',
                        register_room:
                            'Регистрировать комнату',
                        parent:
                            'регистрация',
                        title:
                            'Школьные настройки',
                        group_type:
                            'Вид группы',
                        year:
                            'Учебный год',
                        previous_year:
                            'Предыдущий учебный год',
                        current_year:
                            'Текущий год',
                        previous_season:
                            'Предыдущий сезон',
                        parent_season:
                            'Текущий сезон',
                        parent_year:
                            'Текущий учебный год',
                        add_year:
                            'Добавить учебный год',
                        insert_code:
                            'Ввести код',
                        insert_name:
                            'Ввести имя',
                        is_current_season:
                            'Текущий ли сезон',
                        is_timetable:
                            'Ввести расписание занятий',
                        is_exam:
                            'Наличие экзамена',
                        is_result:
                            'Наличие оценок',
                        edit_year:
                            'Корректировать учебный год',
                        delete_season:
                            'Удалить сезон',
                        delete_season_description:
                            'Сезон будет удалён. Обратите внимание, что удаленные данные не могут быть восстановлены',
                        group_setting:
                            'Настройка групп',
                        group_type_setting:
                            'Настройка типа группы',
                        group_type_add:
                            'Добавить тип группы',
                        insert_current_year:
                            'Введите год принадлёжности',
                        group_type_edit:
                            'Изменить тип группы',
                        group_setting_add:
                            'Настройка типа группы',
                        subject_type:
                            'Тип урока',
                        insert_subject_type:
                            'Введите тип урока',
                        select_group_type:
                            'Выберите тип группы',
                        score_template:
                            'Структура оценки',
                        score_template_edit:
                            'Исправление структуры оценивания',
                        score_template_add:
                            'Добавить структуру оценивания',
                        view:
                            'Смотреть',
                        is_ranked:
                            'Ранжировать',
                        requirement:
                            'Показатель',
                        is_editable:
                            'Ввести корректировку',
                        weight:
                            '% соотношения',
                        maxScore:
                            'Максимальная доля',
                        minScore:
                            'Минимальная доля',
                        ordering:
                            'Очерёдность',
                        score_template_delete_description:
                            'Попытка удалить оценки. Напоминаем, что восстановить удаленные данные невозможно',
                        score_template_disable_title:
                            'Перевести оценки в разряд «недействительно»',
                        score_template_disable_description:
                            'При переводе оценок в разряд «недейстивтельно», использовать данные оценки будет невозможно!',
                        school_shift:
                            'Смена',
                        delete_school_shift:
                            'Удалить смену',
                        delete_school_shift_description:
                            'Вы дейстивтельно хотите удалить смену? После удаления восстановить смену будет невозможно',
                        add_school_shift:
                            'Добавить смену',
                        edit_school_shift:
                            'Корректировать смену',
                        school_logo:
                            'Логотип школы',
                        delete_school_logo:
                            'Удалить логотип школы',
                        delete_school_logo_description:
                            'Вы пытаетесь удалить логотип школы. После удаления восставноление невозможно ',
                        class_type:
                            'Тип класса',
                        add_class_type:
                            'Добавить вид класса',
                        edit_class_type:
                            'Корректировать вид класса',
                        delete_class_type:
                            'Удалить вид класса',
                        delete_class_type_description:
                            'Вы пытаетесь удалить вид класса. После удаления восстановление невозможно ',
                        bell_schedule:
                            'Режим звонков',
                        add_bell_schedule:
                            'Добавить режим звонков',
                        edit_bell_schedule:
                            'Корректировать режим звонков ',
                        delete_bell_schedule:
                            'Удалить режим звонков',
                        delete_bell_schedule_description: 'Вы пытаетесь удалить режим звонков. После удаления восставновление невозможно',
                        add_score_type: 'Добавить критерий оценивания',
                        edit_score_type:
                            'Корректировать критерий оценивания',
                        delete_score_type:
                            'Удалить критерий оценивания',
                        delete_score_type_description:
                            'Вы пытаетесь удалить критерий оценивания. После удаления восстановление невозможно',
                        add_subject_type:
                            'Добавить тип урока',
                        edit_subject_type:
                            'Корректировать тип урока',
                        delete_subject_type:
                            'Удалить тип урока',
                        delete_subject_type_description:
                            'Вы пытаетесь удалить тип урока. После удаления восстановление невозможно',
                        add_exam_type:
                            'Добавить вид экзамена',
                        edit_exam_type:
                            'Корректировать вид экзамена',
                        delete_exam_type:
                            'Удалить вид экзамена',
                        delete_exam_type_description:
                            'Вы пытаетесь удалить вид экзамена. После удаления восстановление невозможно',
                        short_name:
                            'Сокращенное имя',
                        long_name:
                            'Полное наименование',
                        add_class_grade:
                            'Добавить уровень класса',
                        edit_class_grade:
                            'Корректировать уровень класса',
                        edit_class:
                            'Корректировать класс',
                        add_class:
                            'Добавить класс',
                        current_class:
                            'Текущий класс',
                        select_current_class:
                            'Выбрать класс',
                        prev_season_class:
                            'Класс в предыдущем году',
                        select_prev_season_class:
                            'Выберите класс в предыдущего года',
                        delete_class:
                            'Удалить класс',
                        delete_class_description:
                            'Вы пытаетесь удалить класс. После удаления восстановление невозможно',
                        is_class:
                            'Занятия полным классом',
                        include_exam_type:
                            'Внести тип экзамена',
                        abbreviation:
                            'Краткое название',
                        view_score_type:
                            'Просмотр системы оценивания',
                        manager: 'Менежер тохиргоо',
                        master_data: 'Мастер дата',
                        min_score_short:
                            'Минимум',
                        max_score_short:
                            'Максимум',
                        is_club:
                            'Внеурочное занятие?',
                        logout_to_see_difference:
                            'Успешно сохранено. Просьба проверить изменения'
                    }
                    ,
                    topic: {
                        current_topic: 'Текущая тема',
                        topic:
                            'Тема'
                    }
                    ,
                    foodIncomes: {
                        income: 'Прибыль',
                        cash:
                            'Касса',
                        current:
                            'Связаться ',
                        view:
                            'Просмотреть',
                        receipt_number:
                            '№ документа',
                        undo:
                            'Возврат оплаты',
                        undo_description:
                            'Вы уверены, что хотите вернуть информацию об оплате? Обращаем ваше внимание на необходимость повторной регистрации информации об оплате.',
                        create_cash:
                            'Регистрация кассы',
                        create_current:
                            'Создать связь',
                        amount:
                            'Сумма',
                    }
                    ,
                    students_progress: {
                        title: 'Динамика ученика',
                        exam_progress:
                            'Динамика экзамена',
                        behavior:
                            'Отношение',
                        result:
                            'Результат',
                        increased_in_level:
                            'Повышение в уровне',
                        increased_over_level:
                            'Переход на уровень выше',
                        increased_subjects:
                            'Предметы с положительной динамикой',
                        decreased_subjects:
                            'Предметы с отрицательной динамикой',
                        decreased_in_level:
                            'Понижение в уровне',
                        decreased_over_level:
                            'Переход на уровень ниже',
                        season_scoreboard:
                            'Общий балл',
                        students_list:
                            'Общий балл ',
                        total:
                            'Общий ',
                    }
                    ,
                    err: {
                        relation_confirm_empty: 'Зөвшөөрөл өгөх хэрэглэгч сонгоно уу',
                        select_class: 'Выбрать класс',
                        select_detention: 'Сахилгын төрөл сонгоно уу',
                        select_season: 'Улирал сонгоно уу',
                        select_student:
                            'Выбрать ученика',
                        select_invoice:
                            'Истребовать',
                        select_date:
                            'Выбрать дату',
                        select_time:
                            'Выбрать время',
                        select_type:
                            'Выбрать вид',
                        select_room:
                            'Выбрать кабинет',
                        select_curriculum:
                            'Выбрать программу',
                        insert_amount:
                            'Внести сумму',
                        insert_score:
                            'Внести баллы',
                        student_code_empty:
                            'Отсутствует код ученика',
                        select_requirement:
                            'Выбрать показатели',
                        select_exam_type:
                            'Выбрать тип экзамена',
                        select_score_type:
                            'Выбрать систему оценивания',
                        code_duplicate:
                            'Повторение кода',
                        order_duplicate:
                            'Повторение порядка',
                        image_size_error:
                            'Слишком большой размер фото. Размер фото не должен превышать 1 Мгб.',
                        image_type_error:
                            'Неправильные настройки фото. Фото должно быть в формате png, x-png, jpg, jpeg, gif.',
                        fill_all_fields:
                            'Заполнить информацию',
                        delete_info_not_found:
                            'Нет информации об удалаемом объекте ',
                        edit_info_not_found:
                            'Нет информации о корректировке объекта',
                        select_group:
                            'Выбрать группу ',
                        select_exam:
                            'Выбрать экзамен',
                        select_template:
                            'Выбрать тип',
                        insert_grade_name:
                            'Ввести название группы',
                        select_teacher:
                            'Выбрать учителя',
                        select_school_shift:
                            'Выбрать смену ',
                        enter_email:
                            'Ввести эл.почту ',
                        select_school:
                            'Выбрать школу',
                        enter_existing_phone_number:
                            'Ввести действующий номер телефона',
                        enter_new_phone_number:
                            'Ввести новый номер телефона',
                        error_occurred:
                            'Ошибка',
                        enter_valid_date:
                            'Введите правильный срок',
                        select_role:
                            'Выбрать права ',
                        invalid_image_format:
                            'Неверные параметры фото',
                        invoice_amount:
                            'Сумма к оплате 0.',
                        enter_password:
                            'Ввести пароль',
                        re_enter_password:
                            'Повторить пароль',
                        info_not_found:
                            'Нет информации',
                        file_size:
                            'Большой размер файла',
                        file_type:
                            'Неверные параметры файла',
                        file_empty:
                            'Неверные параметры файла',
                        choose_date:
                            'Выбрать дату',
                        invalid_email:
                            'Неверный адрес эл.почты',
                    }
                    ,
                    my: {
                        homework_report: 'Отчет по домашнему заданию',
                        online_lesson:
                            'Он-лайн уроки',
                        online_lesson_report:
                            'Отчеты по он-лайн урокам',
                        link:
                            'Ссылка',
                        link_name:
                            'Название ссылки',
                        google_driver:
                            'Гуугл драйв',
                        upload_file:
                            'Копировать файл',
                        upload_video:
                            'Копировать видео',
                        video:
                            'Видео',
                        description_text:
                            'Время для перемещения файла на сервер зависит от размера файла. Проверку он-лайн уроков производить только после полной загрузки файла на сервер.',
                        attention:
                            'Внимание',
                        in_progress:
                            'Идет копирование ...',
                        sent_file:
                            'Отправка файла',
                        sent_date:
                            'Дата отправки',
                        checked_date:
                            'Дата проверки'
                    }
                    ,
                    newsfeed: {
                        title: 'Информационная главная',
                        title_error:
                            'Ввести информацию на главную',
                        file_size_warning:
                            'Размер файла не должен превышать 500М.',
                        image_count_error:
                            'Количество фото не должно превышать 10',
                        likes:
                            'Нравится',
                        views:
                            'Просмотрел',
                        comments:
                            'Комментарии',
                        see_more:
                            'Продолжить чтение',
                        reply:
                            'Ответ',
                        reply_comment:
                            'Комментировать ответ',
                        reply_view:
                            'Просмотр ответов',
                        post_reply:
                            'Написать комментарии',
                        show_more_comment:
                            'Просмотреть предыдущие комментарии',
                        show_more_reply:
                            'Прочитать предыдущие комментарии',
                        post_edit:
                            'Корректировать пост',
                        post_delete:
                            'Удалить пост',
                        config:
                            'Настройки конфигураций'
                    }
                    ,
                    newsfeedConfig: {
                        addRecipient: 'Добавить получателей',
                        canSeeAllPost:
                            'Просмотреть всю информацию',
                        canSeeOwnPost:
                            'Просмотреть только свою информацию',
                        fromSchool:
                            'От школы',
                        parents:
                            'Родители',
                        students:
                            'Ученики',
                        hdrName:
                            'Имя',
                        parent_hdr:
                            'Текущая информация',
                        parent_hdr_type:
                            'Вид информации',
                        hdr_roles:
                            'Правила внесения поста',
                        insertNameError:
                            'Внести заглавие информации',
                        insertHdrTypeError:
                            'Выбрать вид информации',
                        insertParentHdrError:
                            'Выбрать текущую информацию',
                        insertRolesError:
                            'Выбрать фигуры для поста',
                        removeHdr:
                            'Удалить информацию?',
                        removeRecipient:
                            'Удалить пользователя из информации?',
                        selectHdrRecipient:
                            'Выбрать респондента',
                        title:
                            'Настройки информационного стенда'
                    }
                    ,
                    corporate: {
                        title: 'Копия',
                        show:
                            'Скачать копию',
                        qpos:
                            'QPOS',
                        cgw:
                            'CGW',
                        not_connect:
                            'Нет связи',
                        description:
                            'Название трансфера',
                        sent_account:
                            'Счёт для перевода',
                    }
                    ,
                    course: {
                        subject: 'Предметы',
                    }
                    ,
                    student_email: {
                        title: 'Эл. почта ученика',
                        duplicate_error_title:
                            'Повторение эл. почты (дублируются)',
                        invalid_error_title:
                            'Неверная эл.почта',
                    }
                    ,
                    studentTranscript: {
                        moveOutTitle: 'Шилжсэн сурагчийн тодорхойлолт',
                        title: 'Справка об оценках',
                        issuedUser:
                            'Распечатанный пользователь',
                        seasons:
                            'Годы для печати оценок:',
                    }
                    ,
                    health: {
                        record: {
                            title: 'Плановый осмотр',
                            warning_student_health_add:
                                'Неполная информация. Для продолжения необходимо нажать «сохранить» и продолжить',
                            warning_class_change:
                                'Вы меняете класс. При изменении класса, информация о детях будет удалена',
                            keep_going:
                                'Для продолжения введения информации нажмите «продолжить»',
                            record_date:
                                'Дата осмотра'
                        }
                        ,
                        template: {
                            title: 'Форма медицинской справки',
                            item:
                                'Медицинские показатели',
                            template_name:
                                'Наименование формы',
                            item_can_be_chosen_once:
                                'Выбран для осмотра',
                            add_item:
                                'Добавить показатели',
                            duplicate_error:
                                'Повторение очередности',
                        }
                        ,
                        report: {
                            title: 'Отчет о медосмотре',
                            choose_template:
                                'Выберите форму здоровья'
                        }
                    }
                    ,
                    userGroup: {
                        title: 'Класс потребителя'
                    }
                    ,
                    profile: {
                        title: 'Мой профайл',
                        about:
                            'Обо мне',
                        no_info:
                            'Информация не введена',
                        info_delete:
                            'Удалить информацию',
                        img_delete:
                            'Удалить изображение',
                        insert_photo:
                            'Ввести изображение',
                        delete_photo_not_found:
                            'Изображение для удаления не найдена',
                        old_password:
                            'Старый пароль',
                        new_password:
                            'Новый пароль',
                        new_password_repeat:
                            'Повторить новый пароль',
                        old_password_err:
                            'Новый пароль должен отличаться от старого пароля'
                    }
                    ,
                    skill: {
                        name: 'Навык',
                        title:
                            'Оценка навыков',
                        assessmentTemplate:
                            'Шаблон оценивания',
                        createdTeacher:
                            'Учитель, который зарегистрировал',
                        skillAssessmentTemplate:
                            'Шаблон оценки навыков',
                        criteria:
                            'Критерии',
                        chooseAllSubject:
                            'Выбрать все предметы',
                        addCriteria:
                            'Добавить критерии',
                        editCriteria:
                            'Редактировать критерии',
                        criteriaType:
                            'Тип критерии',
                        readd:
                            'Повторно ввести значение',
                        hasScore:
                            'Вставить балл или нет',
                        hasNotValue:
                            'Значение не записано',
                        hasValue:
                            'Значение записано',
                        optionValues:
                            'Опции значения',
                        numericalAnswer:
                            'С числовыми ответами',
                        checkboxAnswer:
                            'Checkbox ответы',
                        publish:
                            'Подтвердить оценку навыков?',
                        radioAnswer:
                            'с радио ответами',
                        textareaAnswer:
                            ' с TextArea ответами',
                        addAssessment:
                            'Ввести оценивание',
                        selectTemplate:
                            'Выбрать шаблон',
                        assessmentList:
                            'Список оценок',
                        createNewAssessment:
                            'Создать новые оценки',
                        notFound:
                            'Навыки не найдены',
                    }
                    ,
                    cardOrder: {
                        title: 'Заказ карты',
                        delivered:
                            'Доставлен',
                        ordered:
                            'Заказан',
                        order:
                            'Заказать',
                        cancel:
                            'Отменить заказ',
                        date:
                            'Дата заказа',
                        date_delivered:
                            'Дата доставки',
                        order_student_card:
                            'Заказать ученический билет',
                        warning:
                            'Обратите внимание, что дети без фотографий не будут отображаться в списке заказов. Также через приложение могут сделать заказ родители. Если вы впервые собираетесь получить новую карту, закажите ее в этом разделе.',
                        err_student:
                            'Выбрать ученика',
                        canceled_date:
                            'Аннулированная дата',
                        canceled:
                            'Отменен',
                        recover:
                            'Восстановить',
                        teacher_card_warning:
                            'Обратите внимание, что информация о пользователе без фотографии не будет отображаться в списке заказов.'
                    }
                    ,
                    club: {
                        students: 'Дугуйлангийн сурагчид',
                        title: 'Кружок',
                        register_student:
                            'Зарегистрировать учащихся',
                        name:
                            'Название кружка',
                        no_info:
                            'Информация кружка не найдена',
                        duplicateClasses:
                            'Классы совпадаются',
                    }
                    ,
                    dashboard_info: {
                        title: 'Обмен информационными панелями',
                        class_info_exchange:
                            'Информация активности, обмена информации классов',
                        parent_info_exchange:
                            'Родители, опекуны',
                        teacher_info_exchange:
                            'Информация активности, обмена информации учителей',
                        parent_num:
                            'Количество родителей',
                        post_num:
                            'Количество постов',
                        comment_num:
                            'Количество комментариев',
                        activity:
                            'Деятельность',
                        comment:
                            'Комментарии',
                        post:
                            'Пост',
                        answer:
                            'Ответ',
                        class_teacher_short:
                            'Классный руководитель',
                        see_all:
                            'Смотреть все',
                        your_class:
                            'Свой класс',
                        others_class:
                            'Другие классы',
                        today_attendance:
                            'Сегодняшний отчет о посещаемости',
                    }
                    ,
                    evaluation_final: {
                        title: 'Список конечных годовых оценок',
                        unpub_title:
                            'Информация об оценках на конец года деактивации',
                        delete_title:
                            'Итоги года',
                        excel_template:
                            'Шаблон файла на Excel',
                        name: 'Итоговый экзамен',
                        score_exists:
                            'Оценка введена',
                        calculated:
                            'Рассчитан',
                        wrote:
                            'Написан',
                        publish_confirmation:
                            'Обратите внимание, что после подтверждения результатов экзамена их нельзя редактировать или удалить!',
                        publish_confirmation_description:
                            'Учителям и родителям видны только подтвержденные оценки.',
                    }
                    ,
                    bus_dashboard: {
                        student_title: 'Ученики, которые имеют право сидеть, но не зарегистрированы как сели в автобус'
                    }
                    ,
                    invoice_form: {
                        invoice_from: 'Требователь',
                        bill_to:
                            'Плательщик',
                        address:
                            'Арес',
                        contact:
                            'Контакты',
                        bank:
                            'Название банка',
                        bank_account:
                            'Номер счета',
                        state_registration_number:
                            'Регистрационный номер',
                        invoice_date:
                            'Дата требования',
                        due_date:
                            'Дата оплаты',
                        ceo:
                            'Директор',
                        accountant:
                            'Бухгалтер',
                        quantity:
                            'Количество',
                        unit_price:
                            'Розничная цена',
                        total_amount:
                            'Общая цена',
                        amount:
                            'Цена',
                        vat:
                            'Налог на добавленную стоимость',
                        description:
                            'Назначение платежей',
                        employee_card:
                            'Идентификатор сотрудника',
                        nomch_address:
                            'г. Улаанбаатар, Чингэлтэй округ, 4-р район, Хийморь цогцолбор, 4-7 дом, 45 квартира',
                        nomch:
                            'Номч Ай Ти Консалтинг ХХК',
                        account_number:
                            '452583950',
                        tdb:
                            'Худалдаа Хөгжлийн банк',
                        invoice_pdf:
                            'БРАТЬ СЧЕТ',
                        parent_contact:
                            'Номер телефона родителей',
                        invoice_timetable:
                            'График оплаты',
                        total_unpaid:
                            'Общий остаток',
                        billed_amount:
                            'Требуемая сумма',
                        total_discount:
                            'Общая скидка',
                        discounts:
                            'Скидки',
                        parent_signature:
                            'Подпись родителя'
                    }
                    ,
                    analysis: {
                        title: 'Анализ',
                        list:
                            'Список анализов',
                        related_exam:
                            'Установленная экспертиза',
                        calculate:
                            'Анализировать',
                    }
                    ,
                    esis: {
                        attendance_daily: 'Ежедневная посещаемость',
                        class_id:
                            'Групповой идентификатор',
                        last_name:
                            'esis Фамилия',
                        first_name:
                            'esis Имя',
                        birth_date:
                            'esis Дата рождения',
                        excel_file:
                            'Эксель файл',
                        excel_filesize_exceed:
                            'Файл Excel больше 5 МB.',
                        company_code:
                            'Код организации',
                        academic_grade:
                            'Уровень образования',
                        curricula_code:
                            'Код программы обучения',
                        class_code:
                            'Код класса, группы',
                        class_name:
                            'Название класса, группы',
                        student_connection_remove:
                            'Удалить подключение к данным учащегося',
                        get_time:
                            'Скачать информацию',
                        title:
                            'ESIS',
                        createClass:
                            'Создать группу',
                        createStudent:
                            'Создать ученика',
                        createTeacher:
                            'Создать учителя',
                        createUser:
                            'Создать пользователя',
                        shortName:
                            'Краткое имя',
                        eschoolCode:
                            'eSchool код',
                        eschoolLastName:
                            'eSchool Фамилия',
                        eschoolFirstName:
                            'eSchool Имя',
                        eschoolClassName:
                            'eSchool имя класса',
                        eschoolTitle:
                            'eSchool должность',
                        linkTeacherStaff:
                            'Соединить учителя, сотрудника',
                        selectTeacherStaff:
                            'Выберите учителя, сотрудника!',
                        selectGrade:
                            'Выберите класс!',
                        selectStudent:
                            'Выберите ученика!',
                        selectOnlyOneTeacherStaff:
                            'Выберите только одного учителя или сотрудника!',
                        selectOnlyOneGrade:
                            'Выберите только один класс!',
                        selectOnlyOneStudent:
                            'Выберите только одного ученика!',
                        gradeName:
                            'Имя класса',
                        eschoolGrade:
                            'eSchool Уровень',
                        eschoolClass:
                            'eSchool класс',
                        editClass:
                            'Редактировать информацию о группе',
                        classCode:
                            'Код группы',
                        className:
                            'Имя группы',
                        classTeacher:
                            'Классный руководитель',
                        linkClass:
                            'Соединить класс',
                        syncStudents:
                            'Синхронизация данных учащихся',
                    }
                    ,
                    common: {
                        day: 'д',
                        hour: 'ч',
                        min: 'мин'
                    },
                    handToHand: {
                        classClockOut: 'Окончение уроков классов',
                        dismiss: 'Тараах',
                        nonRepliedStudentCount: 'Ученики, которых урок не окончен',
                        title: 'С руки в руку',
                        report: 'Отчет',
                        requestDate: 'Дата вызова',
                        requestRelationType: 'Кем является',
                        requestUser: 'Кто вызвал',
                        reply: 'Отвечать',
                        replyEmpty: 'Пожалуйста, выберите ученика',
                        repliedStudentCount: 'Ученики, которых урок окончен',
                    },
                    timeRecord: {
                        beforeMinute: 'Ранние минуты',
                        cameTime:
                            'Зарегистрированное время прибытия',
                        lateHours:
                            'Время опоздания',
                        lateMinute:
                            'Минуты опоздания',
                        outTime:
                            'Зарегистрированное время ухода',
                        overHours:
                            'Сверхурочная работа',
                        overMinute:
                            'Лишние минуты',
                        settings:
                            'Настройки регистрации времени',
                        shift:
                            'Временная смена',
                        shiftEmpty:
                            'Выберите временную смену',
                        title:
                            'Регистрация часов',
                        totalWorkHour:
                            'Общее рабочее время',
                        totalWorkedHour:
                            'Общее количество отработанных часов'
                    }
                    ,
                    faq: 'Руководство',
                    logout:
                        'Выйти',
                    scoreSchema:
                        'Схема оценивания',
                    manager:
                        {
                            title: 'Учебный менеджер',
                        }
                    ,
                    page: {
                        notFound: 'Страница, которую вы искали, не найдена!!',
                        Forbidden:
                            'Вы не имеете доступа к этой странице!',
                        goHome:
                            'Вернуться на главную страницу',
                    }
                    ,
                    dashboard: {
                        attendance: 'Ирцийн мэдээ',
                        attendanceTypes: {
                            byTime: 'Цагаар',
                            byClass: 'Ангиар',
                            byTeacher: 'Багшаар'
                        },
                        title: 'Панель управления',
                        parents_access:
                            'Родительский доступ',
                        parents_and_guardians:
                            'Родитель и опекуны',
                        parents_and_guardian:
                            'Родитель и опекун',
                        accessed_parents:
                            'Ученики, у которых родители зарегистрированы',
                        parents_count:
                            'Количество родителей',
                        homework_today:
                            'Сегодняшние информации о домашних заданиях',
                        homework_total:
                            'Сегодняшнее домашнее задание',
                        homework_check:
                            'Домашнее задание, которое нужно проверить сегодня',
                        newsfeed_today:
                            'Сегодняшние события',
                        teacher_journal: 'Багшийн тэмдэглэл',
                        usage: {
                            title:  'Ашиглалт',
                            staffs: 'Идэвхтэй багш, ажилтан',
                            parents: 'Идэвхтэй эцэг, эх',
                            by_parent: 'Эцэг, эхээр',
                            by_staff: 'Багш, ажилтнаар',
                            eTeacher: 'Гар утас',
                            totalUsed: 'Нийт ашигласан'
                        }
                    }
                    ,
                    staff: {
                        title: 'Сотрудник',
                        code:
                            'Код сотрудника',
                        lastName:
                            'Фамилия сотрудника',
                        firstName:
                            'Имя сотрудника',
                        select:
                            'Выберите сотрудника!',
                    }
                    ,
                    teacherToday: {
                        behavior: 'Хүмүүжил',
                        notification: 'Уведомление',
                        noNotification:
                            'Вы еще не получили уведомление.', regular:
                            'Ээлжит',
                        hw_assigned:
                            'Сдал домашнее задание',
                        hw_reviewed:
                            'Проверен домашнее задание',
                        hw_assign:
                            'Сдать домашнее задание',
                        hw_review:
                            'Проверить домашнее задание',
                        active:
                            'Активность',
                    }
                    ,
                    idle: {
                        title: 'Вы активен?',
                        description:
                            'Вы были неактивны в течение 10 или более минут и собираетесь выйти из системы. Если вы активны, пожалуйста, нажмите «Продолжить!»',
                        continue:
                            'Продолжить',
                    }
                    ,
                    sheetImport: {
                        regex: {
                            date: 'Пожалуйста, пишите в формате число-месяц-день!',
                            latinAndCyrillic:
                                'Пожалуйста, пишите латиницей и кириллицей!',
                            regNumber: '«Введите в формате AБ01234567!»',
                            email: 'Введите в формате example@example.com!',
                        }
                        ,
                        required: {
                            enrolDate: 'Дата регистрации не может быть пустой!',
                            studentLastName:
                                'Фамилия ученика не может быть пустой!',
                            studentFirstName:
                                'Имя ученика не может быть пустым!',
                            gender:
                                'Пол не должен быть пустым!',
                            studentCode:
                                'Код учащегося не может быть пустым!',
                            grade:
                                'Класс не должен быть пустым!',
                            username:
                                'Имя для входа не может быть пустым!'
                        }
                        ,
                        unique: {
                            regNumber: 'Не дублировать регистрационные номера!',
                            studentCode:
                                'Не дублировать коды учащихся!',
                            username:
                                'Не дублировать логины!',
                        }
                        ,
                        desc: {
                            gender: 'Должен быть либо мужчина, либо женщина!,',
                            notRequired:
                                'Не обязательно',
                            studentPassword:
                                'Если вы не введете пароль, в качестве пароля будет использоваться код учащегося',
                        }
                        ,
                        uploadStep: {
                            title: 'Копировать файл',
                            manifestTitle:
                                'Шаблон копируемого файла',
                            manifestDescription:
                                null,
                            dropzone:
                                {
                                    title: "копируйте .xlsx, .xls и .csv файл",
                                    errorToastDescription:
                                        "Отмена копирования файла",
                                    activeDropzoneTitle:
                                        "Скопировать файл сюда...",
                                    buttonTitle:
                                        "Выбрать файл",
                                    loadingTitle:
                                        "В процессе...",
                                }
                            ,
                            selectSheet: {
                                title: "Ваш файл содержит несколько страниц, выберите одну, чтобы продолжить",
                                nextButtonTitle:
                                    "Продолжить",
                            }
                            ,
                        }
                        ,
                        selectHeaderStep: {
                            title: "Выбрать заголовок",
                            nextButtonTitle:
                                "Продолжить",
                        }
                        ,
                        matchColumnsStep: {
                            title: "Соединить столбцы",
                            nextButtonTitle:
                                "Продолжить",
                            userTableTitle:
                                "Ваш файл",
                            templateTitle:
                                "Соединение столбцов",
                            selectPlaceholder:
                                "Выбрать столбец...",
                            ignoredColumnText:
                                "Столбец удален",
                            subSelectPlaceholder:
                                "Выбрать...",
                            matchDropdownTitle:
                                "Соединить",
                            unmatched:
                                " Не подключен ",
                            duplicateColumnWarningTitle:
                                " Выбран другой столбец ",
                            duplicateColumnWarningDescription:
                                " Столбцы не могут дублироваться",
                        }
                        ,
                        validationStep: {
                            title: " Проверить данные",
                            nextButtonTitle:
                                "Копировать",
                            noRowsMessage:
                                "Данные не найдены",
                            noRowsMessageWhenFiltered:
                                "Данные не найдены с ошибкой",
                            discardButtonTitle:
                                "Удалить выбранные строки",
                            filterSwitchTitle:
                                "Показать строки с ошибками",
                        }
                        ,
                        alerts: {
                            confirmClose: {
                                headerTitle: "Выйти",
                                bodyText:
                                    "Вы уверены, что выйдете из системы? Обратите внимание, что ваш ввод не будет сохранен!",
                                cancelButtonTitle:
                                    " Остановить",
                                exitButtonTitle:
                                    "Выйти",
                            }
                            ,
                            submitIncomplete: {
                                headerTitle: " Обнаружена ошибка ",
                                bodyText:
                                    " Обнаружены строки с ошибками. Обратите внимание, что строки с ошибками при копировании не копируются.",
                                bodyTextSubmitForbidden:
                                    " Есть еще строки с ошибками, пожалуйста, проверьте свои строки еще раз.",
                                cancelButtonTitle:
                                    "Остановить",
                                finishButtonTitle:
                                    "Копировать",
                            }
                            ,
                            unmatchedRequiredFields: {
                                headerTitle: " Не все столбцы подключены ",
                                bodyText:
                                    " Все столбцы, которые должны быть соединены, не соединены.",
                                listTitle:
                                    " Колонки, которые нужно соединить:",
                                cancelButtonTitle:
                                    "Остановить",
                                continueButtonTitle:
                                    "Продолжать",
                            }
                            ,
                            toast: {
                                error: "Ошибка",
                            }
                            ,
                        }
                        ,
                        error: {
                            studentNotExists1: 'В группе',
                            studentNotExists2:
                                'Нет ученика с кодом',
                        }
                        ,
                    }
                    ,
                    hr: {
                        title: 'Человеческие ресурсы',
                        teachersAttendance:
                            'Посещаемость учителя',
                        attendanceReport:
                            'Отчет посещаемости',
                        department:
                            'Отделение',
                        addStaff:
                            'Вход сотрудника',
                        staffCode:
                            'Код сотрудника',
                        structure:
                            'Состав',
                        addDepartment:
                            'Добавить отделение',
                        editDepartment:
                            'Редактировать отделение',
                        parentDepartment:
                            'Принадлежащее отделение',
                        departmentName:
                            'Название отделения',
                        departmentCode:
                            'Код отделения',
                        addEmployee:
                            'Добавить сотрудника',
                        noDepartment:
                            'Сотрудники не закрепленные за отделом',
                    }
                    ,
                    behavior: {
                        title: 'Воспитание',
                        positiveScore:
                            '+ балл',
                        negativeScore:
                            '- балл',
                        maturity:
                            'Зрелость'
                    }
                    ,
                }
        }
    }
}