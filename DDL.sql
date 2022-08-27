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
    dept_admin_id int GENERATED ALWAYS AS IDENTITY (START WITH 300000),
    dept_id integer,
	name text, 
	password text
);

DROP TABLE IF EXISTS "office admin";
CREATE TABLE "office admin"
(
    office_admin_id int GENERATED ALWAYS AS IDENTITY (START WITH 400000),
	name text, 
	password text
);

DROP TABLE IF EXISTS "comptroller admin";
CREATE TABLE "comptroller admin"
(
    comptroller_admin_id SERIAL PRIMARY KEY
);

DROP TABLE IF EXISTS "hall admin";
CREATE TABLE "hall admin"
(
    hall_admin_id int GENERATED ALWAYS AS IDENTITY (START WITH 200000),
    hall_id integer,
	name text, 
	password text
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

DROP view IF EXISTS "course registrations";
CREATE VIEW "course registrations" AS
SELECT t3.student_id, t3.offering_id, t3.reg_status, t4.session_id, t4.course_id FROM
(	SELECT t1.student_id, t1.offering_id, reg_status FROM
		(SELECT student_id, offering_id, MAX(reg_request_id) as reg_request_id
		FROM "registration request" 
		GROUP BY student_id, offering_id) as t1,
		(SELECT reg_request_id, reg_status, request_type FROM "registration request") as t2
	where t1.reg_request_id=t2.reg_request_id and reg_status='approved' and request_type='add') as t3,
	
	(SELECT offering_id, session_id, course_id FROM "course offering") as t4
where t3.offering_id = t4.offering_id;

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
    end_time text
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
    class_number integer,--koto number class
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
    criteria_name text,
    criteria_weight real,
    total_marks integer,
	teacher_id integer, 
	offering_id integer,
    CONSTRAINT marking_criteria_pkey PRIMARY KEY (criteria_name, offering_id, teacher_id)
);

DROP TABLE IF EXISTS "grade distribution policy";
CREATE TABLE "grade distribution policy"
(
    offering_id integer,
    upper_bound integer,
    lower_bound integer,
    letter_grade text,
    grade_point text,
    CONSTRAINT grade_dist_policy_details_pkey PRIMARY KEY (offering_id, letter_grade)
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
    scholarship_name text,
    amount integer
);
    
DROP TABLE IF EXISTS feedback;
CREATE TABLE feedback
(
    feedback_id SERIAL PRIMARY KEY,
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

CREATE OR REPLACE VIEW "academic profile" AS 
select student_id, session_id, course_id, course_name, credits, grade_point, letter_grade,
level, term
from "result summary" as r natural join "course offering" as co natural join course as c
where result_status='published';

create or replace function offering_result_complete_for_student(
	oid int, 
	sid int, 
	req_status text) returns boolean as $$
    
	declare
		count_val int;
        complete boolean;
    begin
		select count(*) into count_val from "mark distribution policy" where offering_id=oid; 
		IF count_val = 0 THEN
     		return false;
   		END IF;
		
        select count(*) into count_val from (select criteria_name from "mark distribution policy" 
		where offering_id=oid
		EXCEPT 
		select criteria_name  from "result details" 
		where student_id=sid and offering_id=oid and status=req_status) as t1;

 		IF count_val = 0 THEN
     		return true;
 		ELSE
      		return false;
   		END IF;
		
	end;
	
$$ language plpgsql;

create or replace function all_offering_result_complete_for_student(
	sid int, 
	ssid text,
	req_status text) returns boolean as $$
    
	declare
		count_val int;
        complete boolean;
    begin
		complete := false;
		select coalesce(bool_and(offering_result_complete_for_student(offering_id, sid, req_status)), false) 
		into complete from "course registrations" where student_id=sid and session_id=ssid;
		
		return complete;
	end;
	
$$ language plpgsql;

create or replace function get_letter_grade(
	sid int, 
	oid int) returns text as $$
    
	declare
        let_grade text := 'NO GRADE DISTRIBUTION POLICY SET';
		total_marks int;
    begin
		select coalesce(obtained_marks,0) into total_marks from students_total_marks 
		where student_id=sid and offering_id=oid;
		
		select coalesce(letter_grade, 'NO GRADE DISTRIBUTION POLICY SET') into let_grade 
		from "grade distribution policy" where offering_id=oid
		and total_marks>lower_bound and total_marks<=upper_bound;
		
		if let_grade is null then
			return 'NO GRADE DISTRIBUTION POLICY SET';
		else
			return let_grade;
		end if;
		
	end;
	
$$ language plpgsql;

create or replace function get_grade_point(
	sid int, 
	oid int) returns text as $$
    
	declare
        grade_pt text := 'NO GRADE DISTRIBUTION POLICY SET';
		total_marks int;
    begin
		select coalesce(obtained_marks,0) into total_marks from students_total_marks 
		where student_id=sid and offering_id=oid;
		
		select coalesce(grade_point, 'NO GRADE DISTRIBUTION POLICY SET') into grade_pt 
		from "grade distribution policy" where offering_id=oid
		and total_marks>lower_bound and total_marks<=upper_bound;
		
		if grade_pt is null then
			return 'NO GRADE DISTRIBUTION POLICY SET';
		else
			return grade_pt;
		end if;
		
	end;
	
$$ language plpgsql;

CREATE TABLE IF NOT EXISTS public.student_notification_registrations
(
    notification_type text COLLATE pg_catalog."default",
    student_id integer,
    CONSTRAINT student_notification_registrations_notification_type_check CHECK (notification_type = 'Course Registration Approval/Rejection'::text OR notification_type = 'Results Published'::text OR notification_type = 'Scholarship Made Available'::text OR notification_type = 'Scholarship Paid'::text OR notification_type = 'New Dues to be Paid'::text OR notification_type = 'Dues Payment Confirmed'::text OR notification_type = 'Notice Added'::text),
	CONSTRAINT "student_notification_registrations_pkey" PRIMARY KEY (notification_type, student_id)
)

create table IF NOT EXISTS student_notifications (
	notification_id SERIAL PRIMARY KEY,
	notification_type text,
	student_id int,
	CONSTRAINT student_notifications_notification_type_check CHECK (notification_type = 'Course Registration Approval/Rejection'::text OR notification_type = 'Results Published'::text OR notification_type = 'Scholarship Made Available'::text OR notification_type = 'Scholarship Paid'::text OR notification_type = 'New Dues to be Paid'::text OR notification_type = 'Dues Payment Confirmed'::text OR notification_type = 'Notice Added'::text),
	notification_date date,
	details text,
	seen bool
)


