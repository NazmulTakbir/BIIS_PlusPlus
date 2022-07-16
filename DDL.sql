DROP TABLE IF EXISTS student;
CREATE TABLE student
(
    student_id integer PRIMARY KEY,
    name TEXT,
    email TEXT,
    hall_id integer,
    dept_id integer,
    advisor_id integer,
    mobile_no TEXT,
    bank_acc_no TEXT,
    present_address TEXT,
    contact_person_address TEXT,
    date_of_birth date,
    nid_no TEXT,
    level integer,
    term integer
);

DROP TABLE IF EXISTS teacher;
CREATE TABLE teacher
(
    teacher_id integer PRIMARY KEY,
    dept_id integer,
    name TEXT
);

DROP TABLE IF EXISTS department;
CREATE TABLE department
(
    dept_id integer PRIMARY KEY,
    dept_name TEXT
);

DROP TABLE IF EXISTS hall;
CREATE TABLE hall
(
    hall_id integer PRIMARY KEY,
    hall_name TEXT,
    hall_provost_id integer
);

DROP TABLE IF EXISTS course;
CREATE TABLE course
(
    course_id TEXT PRIMARY KEY,
    course_name TEXT,
    offered_by_dept_id integer,
    offered_to_dept_id integer,
    level integer,
    term integer,
    credits real
);

DROP TABLE IF EXISTS "department admin";
CREATE TABLE "department admin"
(
    dept_admin_id SERIAL PRIMARY KEY,
    dept_id integer
);

DROP TABLE IF EXISTS "office admin";
CREATE TABLE "office admin"
(
    office_admin_id SERIAL PRIMARY KEY
);

DROP TABLE IF EXISTS "comptroller admin";
CREATE TABLE "comptroller admin"
(
    comptroller_admin_id SERIAL PRIMARY KEY
);

DROP TABLE IF EXISTS "hall admin";
CREATE TABLE "hall admin"
(
    hall_admin_id SERIAL PRIMARY KEY,
    hall_id integer
);

DROP TABLE IF EXISTS session;
CREATE TABLE session
(
    session_id TEXT PRIMARY KEY,
    start date,
    "end" date
);

DROP TABLE IF EXISTS "course offering";
CREATE TABLE "course offering"
(
    offering_id SERIAL PRIMARY KEY,
    course_id TEXT,
    session_id TEXT,
    exam_slot_id integer
);

DROP TABLE IF EXISTS prerequisite;
CREATE TABLE prerequisite
(
    course_id TEXT,
    prerequisite_course_id TEXT,
    CONSTRAINT prerequisite_pkey PRIMARY KEY (course_id, prerequisite_course_id)
);

DROP TABLE IF EXISTS "course registration";
CREATE TABLE "course registration"
(
    student_id integer,
    offering_id integer, 
    date_of_registration date,
    session_id TEXT,
    CONSTRAINT "course registration_pkey" PRIMARY KEY (student_id, offering_id)
);

DROP TABLE IF EXISTS "course offering teacher";
CREATE TABLE "course offering teacher"
(
    offering_id integer,
    teacher_id integer,
    "role" TEXT,
    CONSTRAINT course_offering_teacher_pkey PRIMARY KEY (offering_id, teacher_id)
);

DROP TABLE IF EXISTS "exam time";
CREATE TABLE "exam time"
(
    exam_slot_id SERIAL PRIMARY KEY,
    exam_date date,
    start_time text,
    end_time text
);


DROP TABLE IF EXISTS location;
CREATE TABLE location
(
    location_id SERIAL PRIMARY KEY,
    building TEXT,
    room_no TEXT
);

DROP TABLE IF EXISTS "offering time location";
CREATE TABLE "offering time location"
(
    offering_id integer,
    class_number integer,--koto number class
    location_id integer,
    day TEXT,
    start_time TEXT,
    end_time TEXT,
    section TEXT,
    CONSTRAINT "offering time location_pkey" PRIMARY KEY (offering_id, class_number)
);

DROP TABLE IF EXISTS "registration request";
CREATE TABLE "registration request"
(
    reg_request_id SERIAL PRIMARY KEY,
    student_id integer,
    offering_id integer,
    request_type TEXT CHECK (request_type='register' or request_type='add' or request_type='drop'),
    reg_status TEXT CHECK (reg_status='awaiting_advisor' or
						   reg_status='awaiting_head' or
						   reg_status='approved')
);

DROP TABLE IF EXISTS "mark distribution policy";
CREATE TABLE "mark distribution policy"
(
    md_policy_id SERIAL PRIMARY KEY,
    total_marks integer
);

DROP TABLE IF EXISTS "marking criteria";
CREATE TABLE "marking criteria"
(
    criteria_name TEXT,
    md_policy_id integer,
    criteria_weight real,
    total_marks integer,
    CONSTRAINT marking_criteria_pkey PRIMARY KEY (criteria_name, md_policy_id)
);

DROP TABLE IF EXISTS "grade distribution policy";
CREATE TABLE "grade distribution policy"
(
    gd_policy_id SERIAL PRIMARY KEY
);

DROP TABLE IF EXISTS "grade distribution policy details";
CREATE TABLE "grade distribution policy details"
(
    gd_policy_id integer,
    policy_number integer,
    upper_bound integer,
    lower_bound integer,
    letter_grade TEXT,
    grade_point TEXT,
    CONSTRAINT grade_dist_policy_details_pkey PRIMARY KEY (gd_policy_id, policy_number)
);

DROP TABLE IF EXISTS "result util";
CREATE TABLE "result util"
(
    student_id integer,
    offering_id integer,
    criteria_name TEXT,
    marks integer,
    teacher_id integer,
    scrutinized boolean,
    CONSTRAINT "result util_pkey" PRIMARY KEY (student_id, offering_id)
);

DROP TABLE IF EXISTS "result summary";
CREATE TABLE "result summary"
(
    offering_id integer,
    student_id integer,
    grade_point TEXT,
    letter_grade TEXT,
    result_status TEXT CHECK (result_status='Pending Department Head Approval' OR
    						  result_status='Pending Hall Provost Approval' OR
							  result_status='Pending Exam Controller Approval' OR
							  result_status='Published'),
    CONSTRAINT "result summary_pkey" PRIMARY KEY (offering_id, student_id)
);

DROP TABLE IF EXISTS scholarship;
CREATE TABLE public.scholarship (
    scholarship_id integer NOT NULL,
    student_id integer,
    session_id text,
    scholarship_state text,
    scholarship_type_id integer,
    payment_date date,
    CONSTRAINT scholarship_scholarship_state_check CHECK (((scholarship_state = 'awaiting_application'::text) OR (scholarship_state = 'awaiting_provost'::text) OR (scholarship_state = 'awaiting_head'::text) OR (scholarship_state = 'awaiting_comptroller'::text) OR (scholarship_state = 'paid'::text)))
);

DROP TABLE IF EXISTS "scholarship type";
CREATE TABLE "scholarship type"
(
    scholarship_type_id SERIAL PRIMARY KEY,
    scholarship_name TEXT,
    amount integer
);
    
DROP TABLE IF EXISTS complaint;
CREATE TABLE complaint
(
    complaint_id SERIAL PRIMARY KEY,
    student_id integer,
    teacher_id integer,
    subject TEXT,
    details TEXT
);
    
DROP TABLE IF EXISTS student_seat_plan;
CREATE TABLE student_seat_plan
(
    seat_plan_id SERIAL PRIMARY KEY,
    location_id integer,
    row_no integer,
    col_no integer,
    session_id integer,
    student_id integer
);
    
DROP TABLE IF EXISTS notice;
CREATE TABLE notice
(
    notice_id SERIAL PRIMARY KEY,
    description TEXT,
    file_path TEXT,
    uploaded_by_admin_id integer
);
    
DROP TABLE IF EXISTS "academic calendar";
CREATE TABLE "academic calendar"
(
    academic_calendar_id integer PRIMARY KEY,
    session_id integer,
    level integer,
    term integer
);
    
DROP TABLE IF EXISTS phase;
CREATE TABLE phase
(
    phase_id integer PRIMARY KEY,
    academic_calendar_id integer,
    start_date date,
    end_date date,
    no_of_weeks integer,
    description TEXT
);
    
DROP TABLE IF EXISTS dues;
CREATE TABLE dues
(
    dues_id SERIAL PRIMARY KEY,
    student_id integer,
    dues_type_id integer,
    deadline date,
    dues_status TEXT CHECK (dues_status='Not Paid' OR dues_status='Paid'),
	payment_date date
);
    
DROP TABLE IF EXISTS "dues type";
CREATE TABLE "dues type"
(
    "dues type id" SERIAL PRIMARY KEY,
    description TEXT,
    amount TEXT
);