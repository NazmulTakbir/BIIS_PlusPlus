DROP TABLE IF EXISTS student;
CREATE TABLE student
(
    student_id integer PRIMARY KEY,
    name text,
    email text,
    hall_id integer,
    dept_id integer,
    advisor_id integer,
    mobile_no text,
    bank_acc_no text,
    present_address text,
    contact_person_address text,
    date_of_birth date,
    nid_no text,
    level integer,
    term integer
);

DROP TABLE IF EXISTS teacher;
CREATE TABLE teacher
(
    teacher_id integer PRIMARY KEY,
    dept_id integer,
    name text
);

DROP TABLE IF EXISTS department;
CREATE TABLE department
(
    dept_id integer PRIMARY KEY,
    dept_name text
);

DROP TABLE IF EXISTS hall;
CREATE TABLE hall
(
    hall_id integer PRIMARY KEY,
    hall_name text,
    hall_provost_id integer
);

DROP TABLE IF EXISTS course;
CREATE TABLE course
(
    course_id text PRIMARY KEY,
    course_name text,
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

DROP TABLE IF EXISTS "hall supervisor";
CREATE TABLE "hall supervisor"
(
    hall_supervisor_id SERIAL PRIMARY KEY,
    hall_id integer,
    name text,
    phone_number text,
    email text
);

DROP TABLE IF EXISTS session;
CREATE TABLE session
(
    session_id text PRIMARY KEY,
    start date,
    "end" date
);

DROP TABLE IF EXISTS "course offering";
CREATE TABLE "course offering"
(
    offering_id SERIAL PRIMARY KEY,
    course_id text,
    session_id text,
    exam_slot_id integer
);

DROP TABLE IF EXISTS prerequisite;
CREATE TABLE prerequisite
(
    course_id text,
    prerequisite_course_id text,
    CONSTRAINT prerequisite_pkey PRIMARY KEY (course_id, prerequisite_course_id)
);

DROP TABLE IF EXISTS "course registration";
CREATE TABLE "course registration"
(
    student_id integer,
    offering_id integer, 
    date_of_registration date,
    session_id text,
    CONSTRAINT "course registration_pkey" PRIMARY KEY (student_id, offering_id)
);

DROP TABLE IF EXISTS "course offering teacher";
CREATE TABLE "course offering teacher"
(
    offering_id integer,
    teacher_id integer,
    "role" text,
    CONSTRAINT course_offering_teacher_pkey PRIMARY KEY (offering_id, teacher_id)
);

DROP TABLE IF EXISTS "exam time";
CREATE TABLE "exam time"
(
    exam_slot_id SERIAL PRIMARY KEY,
    exam_date date,
    start_time text,
    "end time" text
);

DROP TABLE IF EXISTS location;
CREATE TABLE location
(
    location_id SERIAL PRIMARY KEY,
    building text,
    room_no text
);

DROP TABLE IF EXISTS "offering time location";
CREATE TABLE "offering time location"
(
    offering_id integer,
    class_number integer,
    location_id integer,
    day text,
    start_time text,
    end_time text,
    section text,
    CONSTRAINT "offering time location_pkey" PRIMARY KEY (offering_id, class_number)
);

DROP TABLE IF EXISTS "registration request";
CREATE TABLE "registration request"
(
    reg_request_id SERIAL PRIMARY KEY,
    student_id integer,
    offering_id integer,
    request_type text CHECK (request_type='register' or request_type='add' or request_type='drop'),
    reg_status text CHECK (reg_status='awaiting_advisor' or
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
    criteria_name text,
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
    letter_grade text,
    grade_point text,
    CONSTRAINT grade_dist_policy_details_pkey PRIMARY KEY (gd_policy_id, policy_number)
);

DROP TABLE IF EXISTS "result util";
CREATE TABLE "result util"
(
    student_id integer,
    offering_id integer,
    criteria_name text,
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
    grade_point text,
    letter_grade text,
    result_status text CHECK (result_status='awaiting_headapproval' OR
    						  result_status='awaiting_provostapproval' OR
							  result_status='awaiting_examcontroller' OR
							  result_status='published'),
    CONSTRAINT "result summary_pkey" PRIMARY KEY (offering_id, student_id)
);

DROP TABLE IF EXISTS scholarship;
CREATE TABLE scholarship
(
    scholarship_id SERIAL PRIMARY KEY,
    student_id integer,
    session_id text,
    scholarship_state text check (scholarship_state='awaiting_application' OR
								  scholarship_state='awaiting_provost' OR
								  scholarship_state='awaiting_head' OR
								  scholarship_state='awaiting_comptroller' OR
								  scholarship_state='paid'),
    scholarship_type_id integer
);

DROP TABLE IF EXISTS "scholarship type";
CREATE TABLE "scholarship type"
(
    scholarship_type_id SERIAL PRIMARY KEY,
    scholarship_name text,
    amount integer
);
    
DROP TABLE IF EXISTS complaint;
CREATE TABLE complaint
(
    complaint_id SERIAL PRIMARY KEY,
    student_id integer,
    teacher_id integer,
    subject text,
    details text,
    submission_date date
);
    
DROP TABLE IF EXISTS student_seat_plan;
CREATE TABLE student_seat_plan
(
    seat_plan_id SERIAL PRIMARY KEY,
    location_id integer,
    row_no integer,
    col_no integer,
    session_id text,
    student_id integer
);
    
DROP TABLE IF EXISTS notice;
CREATE TABLE notice
(
    notice_id SERIAL PRIMARY KEY,
    description text,
    file_path text,
    upload_date date
);

DROP TABLE IF EXISTS exam_guidelines;
CREATE TABLE exam_guidelines
(
    guideline_id SERIAL PRIMARY KEY,
    description text,
    file_path text,
    session_id text
);
    
DROP TABLE IF EXISTS session_phase;
CREATE TABLE session_phase
(
    phase_number integer,
    session_id text,
    start_date date,
    end_date date,
    no_of_weeks integer,
    description text,
    CONSTRAINT "result summary_pkey" PRIMARY KEY (phase_number, session_id)
);
    
DROP TABLE IF EXISTS dues;
CREATE TABLE dues
(
    dues_id SERIAL PRIMARY KEY,
    student_id integer,
    dues_type_id integer,
    deadline date,
    dues_status text CHECK (dues_status='Not Paid' OR dues_status='Paid'),
	payment_date date
);
    
DROP TABLE IF EXISTS "dues type";
CREATE TABLE "dues type"
(
    "dues type id" SERIAL PRIMARY KEY,
    description text,
    amount text
);