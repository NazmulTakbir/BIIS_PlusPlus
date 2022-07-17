DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: complaint; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.complaint (
    complaint_id integer NOT NULL,
    student_id integer,
    teacher_id integer,
    subject text,
    details text,
    submission_date date,
    receiver_type text
);


ALTER TABLE public.complaint OWNER TO postgres;

--
-- Name: complaint_complaint_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.complaint_complaint_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.complaint_complaint_id_seq OWNER TO postgres;

--
-- Name: complaint_complaint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.complaint_complaint_id_seq OWNED BY public.complaint.complaint_id;


--
-- Name: comptroller admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."comptroller admin" (
    comptroller_admin_id integer NOT NULL
);


ALTER TABLE public."comptroller admin" OWNER TO postgres;

--
-- Name: comptroller admin_comptroller_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."comptroller admin_comptroller_admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."comptroller admin_comptroller_admin_id_seq" OWNER TO postgres;

--
-- Name: comptroller admin_comptroller_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."comptroller admin_comptroller_admin_id_seq" OWNED BY public."comptroller admin".comptroller_admin_id;


--
-- Name: course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course (
    course_id text NOT NULL,
    course_name text,
    offered_by_dept_id integer,
    offered_to_dept_id integer,
    level integer,
    term integer,
    credits real
);


ALTER TABLE public.course OWNER TO postgres;

--
-- Name: course offering; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."course offering" (
    offering_id integer NOT NULL,
    course_id text,
    session_id text,
    exam_slot_id integer
);


ALTER TABLE public."course offering" OWNER TO postgres;

--
-- Name: course offering teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."course offering teacher" (
    offering_id integer NOT NULL,
    teacher_id integer NOT NULL,
    role text
);


ALTER TABLE public."course offering teacher" OWNER TO postgres;

--
-- Name: course offering_offering_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."course offering_offering_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."course offering_offering_id_seq" OWNER TO postgres;

--
-- Name: course offering_offering_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."course offering_offering_id_seq" OWNED BY public."course offering".offering_id;


--
-- Name: course registration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."course registration" (
    student_id integer NOT NULL,
    offering_id integer NOT NULL,
    date_of_registration date,
    session_id text
);


ALTER TABLE public."course registration" OWNER TO postgres;

--
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    dept_id integer NOT NULL,
    dept_name text
);


ALTER TABLE public.department OWNER TO postgres;

--
-- Name: department admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."department admin" (
    dept_admin_id integer NOT NULL,
    dept_id integer
);


ALTER TABLE public."department admin" OWNER TO postgres;

--
-- Name: department admin_dept_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."department admin_dept_admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."department admin_dept_admin_id_seq" OWNER TO postgres;

--
-- Name: department admin_dept_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."department admin_dept_admin_id_seq" OWNED BY public."department admin".dept_admin_id;


--
-- Name: dues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dues (
    dues_id integer NOT NULL,
    student_id integer,
    dues_type_id integer,
    deadline date,
    dues_status text,
    payment_date date,
    specification text,
    CONSTRAINT dues_dues_status_check CHECK (((dues_status = 'Not Paid'::text) OR (dues_status = 'Paid'::text)))
);


ALTER TABLE public.dues OWNER TO postgres;

--
-- Name: dues type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."dues type" (
    "dues type id" integer NOT NULL,
    description text,
    amount text
);


ALTER TABLE public."dues type" OWNER TO postgres;

--
-- Name: dues type_dues type id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."dues type_dues type id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."dues type_dues type id_seq" OWNER TO postgres;

--
-- Name: dues type_dues type id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."dues type_dues type id_seq" OWNED BY public."dues type"."dues type id";


--
-- Name: dues_dues_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dues_dues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dues_dues_id_seq OWNER TO postgres;

--
-- Name: dues_dues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dues_dues_id_seq OWNED BY public.dues.dues_id;


--
-- Name: exam time; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."exam time" (
    exam_slot_id integer NOT NULL,
    exam_date date,
    start_time text,
    end_time text
);


ALTER TABLE public."exam time" OWNER TO postgres;

--
-- Name: exam time_exam_slot_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."exam time_exam_slot_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."exam time_exam_slot_id_seq" OWNER TO postgres;

--
-- Name: exam time_exam_slot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."exam time_exam_slot_id_seq" OWNED BY public."exam time".exam_slot_id;


--
-- Name: exam_guidelines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_guidelines (
    guideline_id integer NOT NULL,
    description text,
    file_path text,
    session_id text
);


ALTER TABLE public.exam_guidelines OWNER TO postgres;

--
-- Name: exam_guidelines_guideline_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exam_guidelines_guideline_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exam_guidelines_guideline_id_seq OWNER TO postgres;

--
-- Name: exam_guidelines_guideline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exam_guidelines_guideline_id_seq OWNED BY public.exam_guidelines.guideline_id;


--
-- Name: grade distribution policy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."grade distribution policy" (
    gd_policy_id integer NOT NULL
);


ALTER TABLE public."grade distribution policy" OWNER TO postgres;

--
-- Name: grade distribution policy details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."grade distribution policy details" (
    gd_policy_id integer NOT NULL,
    policy_number integer NOT NULL,
    upper_bound integer,
    lower_bound integer,
    letter_grade text,
    grade_point text
);


ALTER TABLE public."grade distribution policy details" OWNER TO postgres;

--
-- Name: grade distribution policy_gd_policy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."grade distribution policy_gd_policy_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."grade distribution policy_gd_policy_id_seq" OWNER TO postgres;

--
-- Name: grade distribution policy_gd_policy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."grade distribution policy_gd_policy_id_seq" OWNED BY public."grade distribution policy".gd_policy_id;


--
-- Name: hall; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hall (
    hall_id integer NOT NULL,
    hall_name text,
    hall_provost_id integer,
    supervisor_name text,
    supervisor_phone text,
    supervisor_email text
);


ALTER TABLE public.hall OWNER TO postgres;

--
-- Name: hall admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."hall admin" (
    hall_admin_id integer NOT NULL,
    hall_id integer
);


ALTER TABLE public."hall admin" OWNER TO postgres;

--
-- Name: hall admin_hall_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."hall admin_hall_admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."hall admin_hall_admin_id_seq" OWNER TO postgres;

--
-- Name: hall admin_hall_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."hall admin_hall_admin_id_seq" OWNED BY public."hall admin".hall_admin_id;


--
-- Name: location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location (
    location_id integer NOT NULL,
    building text,
    room_no text,
    exam_config text
);


ALTER TABLE public.location OWNER TO postgres;

--
-- Name: location_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.location_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.location_location_id_seq OWNER TO postgres;

--
-- Name: location_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.location_location_id_seq OWNED BY public.location.location_id;


--
-- Name: mark distribution policy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."mark distribution policy" (
    md_policy_id integer NOT NULL,
    total_marks integer
);


ALTER TABLE public."mark distribution policy" OWNER TO postgres;

--
-- Name: mark distribution policy_md_policy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."mark distribution policy_md_policy_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."mark distribution policy_md_policy_id_seq" OWNER TO postgres;

--
-- Name: mark distribution policy_md_policy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."mark distribution policy_md_policy_id_seq" OWNED BY public."mark distribution policy".md_policy_id;


--
-- Name: marking criteria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."marking criteria" (
    criteria_name text NOT NULL,
    md_policy_id integer NOT NULL,
    criteria_weight real,
    total_marks integer
);


ALTER TABLE public."marking criteria" OWNER TO postgres;

--
-- Name: notice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notice (
    notice_id integer NOT NULL,
    description text,
    file_path text,
    upload_date date
);


ALTER TABLE public.notice OWNER TO postgres;

--
-- Name: notice_notice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notice_notice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_notice_id_seq OWNER TO postgres;

--
-- Name: notice_notice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notice_notice_id_seq OWNED BY public.notice.notice_id;


--
-- Name: offering time location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."offering time location" (
    offering_id integer NOT NULL,
    class_number integer NOT NULL,
    location_id integer,
    day text,
    start_time text,
    end_time text,
    section text
);


ALTER TABLE public."offering time location" OWNER TO postgres;

--
-- Name: office admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."office admin" (
    office_admin_id integer NOT NULL
);


ALTER TABLE public."office admin" OWNER TO postgres;

--
-- Name: office admin_office_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."office admin_office_admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."office admin_office_admin_id_seq" OWNER TO postgres;

--
-- Name: office admin_office_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."office admin_office_admin_id_seq" OWNED BY public."office admin".office_admin_id;


--
-- Name: prerequisite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prerequisite (
    course_id text NOT NULL,
    prerequisite_course_id text NOT NULL
);


ALTER TABLE public.prerequisite OWNER TO postgres;

--
-- Name: registration request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."registration request" (
    reg_request_id integer NOT NULL,
    student_id integer,
    offering_id integer,
    request_type text,
    reg_status text,
    CONSTRAINT "registration request_reg_status_check" CHECK (((reg_status = 'awaiting_advisor'::text) OR (reg_status = 'awaiting_head'::text) OR (reg_status = 'approved'::text))),
    CONSTRAINT "registration request_request_type_check" CHECK (((request_type = 'register'::text) OR (request_type = 'add'::text) OR (request_type = 'drop'::text)))
);


ALTER TABLE public."registration request" OWNER TO postgres;

--
-- Name: registration request_reg_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."registration request_reg_request_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."registration request_reg_request_id_seq" OWNER TO postgres;

--
-- Name: registration request_reg_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."registration request_reg_request_id_seq" OWNED BY public."registration request".reg_request_id;


--
-- Name: result summary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."result summary" (
    offering_id integer NOT NULL,
    student_id integer NOT NULL,
    grade_point text,
    letter_grade text,
    result_status text,
    CONSTRAINT "result summary_result_status_check" CHECK (((result_status = 'awaiting_headapproval'::text) OR (result_status = 'awaiting_provostapproval'::text) OR (result_status = 'awaiting_examcontroller'::text) OR (result_status = 'published'::text)))
);


ALTER TABLE public."result summary" OWNER TO postgres;

--
-- Name: result util; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."result util" (
    student_id integer NOT NULL,
    offering_id integer NOT NULL,
    criteria_name text,
    marks integer,
    teacher_id integer,
    scrutinized boolean
);


ALTER TABLE public."result util" OWNER TO postgres;

--
-- Name: scholarship; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scholarship (
    scholarship_id integer NOT NULL,
    student_id integer,
    session_id text,
    scholarship_state text,
    scholarship_type_id integer,
    payment_date date,
    CONSTRAINT scholarship_scholarship_state_check CHECK (((scholarship_state = 'awaiting_application'::text) OR (scholarship_state = 'awaiting_provost'::text) OR (scholarship_state = 'awaiting_head'::text) OR (scholarship_state = 'awaiting_comptroller'::text) OR (scholarship_state = 'paid'::text)))
);


ALTER TABLE public.scholarship OWNER TO postgres;

--
-- Name: scholarship type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."scholarship type" (
    scholarship_type_id integer NOT NULL,
    scholarship_name text,
    amount integer
);


ALTER TABLE public."scholarship type" OWNER TO postgres;

--
-- Name: scholarship type_scholarship_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."scholarship type_scholarship_type_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."scholarship type_scholarship_type_id_seq" OWNER TO postgres;

--
-- Name: scholarship type_scholarship_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."scholarship type_scholarship_type_id_seq" OWNED BY public."scholarship type".scholarship_type_id;


--
-- Name: scholarship_scholarship_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scholarship_scholarship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.scholarship_scholarship_id_seq OWNER TO postgres;

--
-- Name: scholarship_scholarship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scholarship_scholarship_id_seq OWNED BY public.scholarship.scholarship_id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    session_id text NOT NULL,
    start date,
    "end" date
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: session_phase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session_phase (
    phase_number integer NOT NULL,
    session_id text NOT NULL,
    start_date date,
    end_date date,
    no_of_weeks integer,
    description text
);


ALTER TABLE public.session_phase OWNER TO postgres;

--
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    student_id integer NOT NULL,
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


ALTER TABLE public.student OWNER TO postgres;

--
-- Name: student_seat_plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_seat_plan (
    seat_plan_id integer NOT NULL,
    location_id integer,
    row_no integer,
    col_no integer,
    session_id text,
    student_id integer
);


ALTER TABLE public.student_seat_plan OWNER TO postgres;

--
-- Name: student_seat_plan_seat_plan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_seat_plan_seat_plan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_seat_plan_seat_plan_id_seq OWNER TO postgres;

--
-- Name: student_seat_plan_seat_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_seat_plan_seat_plan_id_seq OWNED BY public.student_seat_plan.seat_plan_id;


--
-- Name: teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher (
    teacher_id integer NOT NULL,
    dept_id integer,
    name text,
    room_no text,
    office_phone text,
    cell_phone text,
    email text,
    link text
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- Name: complaint complaint_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaint ALTER COLUMN complaint_id SET DEFAULT nextval('public.complaint_complaint_id_seq'::regclass);


--
-- Name: comptroller admin comptroller_admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."comptroller admin" ALTER COLUMN comptroller_admin_id SET DEFAULT nextval('public."comptroller admin_comptroller_admin_id_seq"'::regclass);


--
-- Name: course offering offering_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."course offering" ALTER COLUMN offering_id SET DEFAULT nextval('public."course offering_offering_id_seq"'::regclass);


--
-- Name: department admin dept_admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."department admin" ALTER COLUMN dept_admin_id SET DEFAULT nextval('public."department admin_dept_admin_id_seq"'::regclass);


--
-- Name: dues dues_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dues ALTER COLUMN dues_id SET DEFAULT nextval('public.dues_dues_id_seq'::regclass);


--
-- Name: dues type dues type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dues type" ALTER COLUMN "dues type id" SET DEFAULT nextval('public."dues type_dues type id_seq"'::regclass);


--
-- Name: exam time exam_slot_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."exam time" ALTER COLUMN exam_slot_id SET DEFAULT nextval('public."exam time_exam_slot_id_seq"'::regclass);


--
-- Name: exam_guidelines guideline_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_guidelines ALTER COLUMN guideline_id SET DEFAULT nextval('public.exam_guidelines_guideline_id_seq'::regclass);


--
-- Name: grade distribution policy gd_policy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."grade distribution policy" ALTER COLUMN gd_policy_id SET DEFAULT nextval('public."grade distribution policy_gd_policy_id_seq"'::regclass);


--
-- Name: hall admin hall_admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hall admin" ALTER COLUMN hall_admin_id SET DEFAULT nextval('public."hall admin_hall_admin_id_seq"'::regclass);


--
-- Name: location location_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location ALTER COLUMN location_id SET DEFAULT nextval('public.location_location_id_seq'::regclass);


--
-- Name: mark distribution policy md_policy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."mark distribution policy" ALTER COLUMN md_policy_id SET DEFAULT nextval('public."mark distribution policy_md_policy_id_seq"'::regclass);


--
-- Name: notice notice_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice ALTER COLUMN notice_id SET DEFAULT nextval('public.notice_notice_id_seq'::regclass);


--
-- Name: office admin office_admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."office admin" ALTER COLUMN office_admin_id SET DEFAULT nextval('public."office admin_office_admin_id_seq"'::regclass);


--
-- Name: registration request reg_request_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."registration request" ALTER COLUMN reg_request_id SET DEFAULT nextval('public."registration request_reg_request_id_seq"'::regclass);


--
-- Name: scholarship scholarship_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scholarship ALTER COLUMN scholarship_id SET DEFAULT nextval('public.scholarship_scholarship_id_seq'::regclass);


--
-- Name: scholarship type scholarship_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."scholarship type" ALTER COLUMN scholarship_type_id SET DEFAULT nextval('public."scholarship type_scholarship_type_id_seq"'::regclass);


--
-- Name: student_seat_plan seat_plan_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_seat_plan ALTER COLUMN seat_plan_id SET DEFAULT nextval('public.student_seat_plan_seat_plan_id_seq'::regclass);


--
-- Data for Name: complaint; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.complaint (complaint_id, student_id, teacher_id, subject, details, submission_date, receiver_type) VALUES (1, 1705103, 10000, 'Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', '2022-07-16', 'Dept. Head');
INSERT INTO public.complaint (complaint_id, student_id, teacher_id, subject, details, submission_date, receiver_type) VALUES (2, 1705103, 10000, 'Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', '2022-06-10', 'Advisor');


--
-- Data for Name: comptroller admin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 203', 'Data Structures and Algorithms 1', 5, 5, 2, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 207', 'Data Structures and Algorithms 2', 5, 5, 2, 2, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 215', 'Database Systems', 5, 5, 2, 2, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 405', 'Computer Security', 5, 5, 4, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 406', 'Computer Security Sessional', 5, 5, 4, 1, 0.75);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 409', 'Computer Graphics', 5, 5, 4, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 421', 'Basic Graph Theory', 5, 5, 4, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 423', 'Fault Tolerant Systems', 5, 5, 4, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 453', 'High Performance Database Systems', 5, 5, 4, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 463', 'Introduction to Bioinformatics', 5, 5, 4, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('HUM 475', 'Engineering Economics', 20, 5, 4, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 408', 'Software Development Sessional', 5, 5, 4, 1, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 410', 'Computer Graphics Sessional', 5, 5, 4, 1, 0.75);


--
-- Data for Name: course offering; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (1, 'CSE 405', 'JAN 2022', 1);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (2, 'CSE 409', 'JAN 2022', 2);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (3, 'CSE 421', 'JAN 2022', 3);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (4, 'CSE 423', 'JAN 2022', 4);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (5, 'CSE 453', 'JAN 2022', 5);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (6, 'CSE 463', 'JAN 2022', 6);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (7, 'HUM 475', 'JAN 2022', 7);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (8, 'CSE 408', 'JAN 2022', NULL);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (9, 'CSE 410', 'JAN 2022', NULL);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (10, 'CSE 406', 'JAN 2022', NULL);


--
-- Data for Name: course offering teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: course registration; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."course registration" (student_id, offering_id, date_of_registration, session_id) VALUES (1705103, 1, '2022-07-15', 'JAN 2022');
INSERT INTO public."course registration" (student_id, offering_id, date_of_registration, session_id) VALUES (1705103, 2, '2022-07-15', 'JAN 2022');
INSERT INTO public."course registration" (student_id, offering_id, date_of_registration, session_id) VALUES (1705103, 4, '2022-07-15', 'JAN 2022');
INSERT INTO public."course registration" (student_id, offering_id, date_of_registration, session_id) VALUES (1705103, 5, '2022-07-15', 'JAN 2022');
INSERT INTO public."course registration" (student_id, offering_id, date_of_registration, session_id) VALUES (1705103, 7, '2022-07-15', 'JAN 2022');
INSERT INTO public."course registration" (student_id, offering_id, date_of_registration, session_id) VALUES (1705103, 8, '2022-07-15', 'JAN 2022');
INSERT INTO public."course registration" (student_id, offering_id, date_of_registration, session_id) VALUES (1705103, 9, '2022-07-15', 'JAN 2022');
INSERT INTO public."course registration" (student_id, offering_id, date_of_registration, session_id) VALUES (1705103, 10, '2022-07-15', 'JAN 2022');


--
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.department (dept_id, dept_name) VALUES (5, 'Computer Science and Engineering');
INSERT INTO public.department (dept_id, dept_name) VALUES (20, 'Humanities');


--
-- Data for Name: department admin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: dues; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.dues (dues_id, student_id, dues_type_id, deadline, dues_status, payment_date, specification) VALUES (1, 1705103, 1, '2022-09-30', 'Not Paid', NULL, 'Session JAN 2022');
INSERT INTO public.dues (dues_id, student_id, dues_type_id, deadline, dues_status, payment_date, specification) VALUES (2, 1705103, 2, '2022-03-31', 'Paid', '2022-01-20', 'Year 2022');


--
-- Data for Name: dues type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."dues type" ("dues type id", description, amount) VALUES (4, 'Dining Fees', '2500');
INSERT INTO public."dues type" ("dues type id", description, amount) VALUES (1, 'Exam Fee', '174');
INSERT INTO public."dues type" ("dues type id", description, amount) VALUES (2, 'Hall Fee Attached', '5050');
INSERT INTO public."dues type" ("dues type id", description, amount) VALUES (3, 'Hall Fee Resident', '11000');


--
-- Data for Name: exam time; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time) VALUES (1, '2022-09-25', '9am', '12pm');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time) VALUES (2, '2022-09-28', '9am', '12pm');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time) VALUES (3, '2022-09-30', '9am', '12pm');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time) VALUES (4, '2022-10-05', '9am', '12pm');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time) VALUES (5, '2022-10-08', '9am', '12pm');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time) VALUES (6, '2022-10-12', '9am', '12pm');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time) VALUES (7, '2022-10-12', '2pm', '5pm');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time) VALUES (8, '2022-10-20', '9am', '12pm');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time) VALUES (9, '2022-10-20', '2pm', '5pm');


--
-- Data for Name: exam_guidelines; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.exam_guidelines (guideline_id, description, file_path, session_id) VALUES (1, 'Guidelines for Teams', 'https://biis.buet.ac.bd/BIIS_WEB/resource/UGExam/Guidelines_using_Teams.pdf', 'JAN 2022');
INSERT INTO public.exam_guidelines (guideline_id, description, file_path, session_id) VALUES (2, 'Guidelines for CSE', 'https://biis.buet.ac.bd/BIIS_WEB/resource/UGExam/Guidelines_only_for_CSE.pdf', 'JAN 2022');
INSERT INTO public.exam_guidelines (guideline_id, description, file_path, session_id) VALUES (3, 'Demo for Camera Placement', 'https://www.youtube.com/watch?v=eMxrO74NdpE', 'JAN 2022');


--
-- Data for Name: grade distribution policy; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: grade distribution policy details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: hall; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (1, 'Kazi Nazrul Islam Hall', 10000, 'Mahmudun Nobi', '01754367234', '20chowdhury15@@gmail.com');
INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (2, 'Ahsanullah Hall', 10001, 'Bodrul Arefin', '01543657896', 'arefin87@gmail.com');
INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (3, 'Shere Bangla Hall', 10002, 'Abdur Rob Mia', '01943567891', 'mdabdurrob1988@gmail.com');
INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (4, 'Titumir Hall', 10003, 'Motiur Rahman', '01843565543', 'motiur181@gmail.com');


--
-- Data for Name: hall admin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.location (location_id, building, room_no, exam_config) VALUES (6, 'ECE', 'Database Lab', NULL);
INSERT INTO public.location (location_id, building, room_no, exam_config) VALUES (7, 'ECE', 'Programming Lab', NULL);
INSERT INTO public.location (location_id, building, room_no, exam_config) VALUES (1, 'ECE', '207', '10,4');
INSERT INTO public.location (location_id, building, room_no, exam_config) VALUES (2, 'ECE', '206', '10,4');
INSERT INTO public.location (location_id, building, room_no, exam_config) VALUES (3, 'ECE', '205', '10,4');
INSERT INTO public.location (location_id, building, room_no, exam_config) VALUES (4, 'ECE', '204', '10,6');
INSERT INTO public.location (location_id, building, room_no, exam_config) VALUES (5, 'ECE', '203', '10,6');
INSERT INTO public.location (location_id, building, room_no, exam_config) VALUES (8, 'ME', '406', '10,6');


--
-- Data for Name: mark distribution policy; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: marking criteria; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notice; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.notice (notice_id, description, file_path, upload_date) VALUES (1, 'Notice Regarding Covid 19', 'https://drive.google.com/file/d/1UzP7rXDh_CxGxcrbKYLBq3MH-ghsvWZI/view', '2022-07-06');
INSERT INTO public.notice (notice_id, description, file_path, upload_date) VALUES (2, 'FINAL PROGRAMME for the Examination of July 2021 (Supplementary)', 'https://drive.google.com/file/d/17qnPjoS4NudPngq-i6nwB4rk2184YcN4/view', '2022-07-04');
INSERT INTO public.notice (notice_id, description, file_path, upload_date) VALUES (3, 'Notice regarding classes on 25/06/2022', 'https://drive.google.com/file/d/1iHvE1h4mcQv4PwySmhPeGVjGX_scDheY/view', '2022-06-20');


--
-- Data for Name: offering time location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (5, 1, 1, 'Saturday', '9am', '10am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (5, 2, 1, 'Sunday', '11am', '12pm', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (5, 3, 1, 'Monday', '11am', '12pm', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (4, 1, 1, 'Sunday', '10am', '11am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (4, 2, 1, 'Monday', '9am', '10am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (4, 3, 1, 'Wednesday', '12pm', '1pm', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (1, 1, 2, 'Sunday', '9am', '10am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (1, 2, 2, 'Tuesday', '9am', '10am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (1, 3, 2, 'Wednesday', '8am', '9am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (2, 1, 2, 'Saturday', '11am', '12pm', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (2, 2, 2, 'Tuesday', '8am', '9am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (2, 3, 2, 'Wednesday', '10am', '11am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (7, 1, 1, 'Saturday', '10am', '11am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (7, 2, 1, 'Sunday', '8am', '9am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (7, 3, 1, 'Wednesday', '9am', '10am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (8, 1, 6, 'Monday', '2pm', '5pm', 'B2');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (10, 1, 7, 'Sunday', '2pm', '5pm', 'B2');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (9, 1, 6, 'Saturday', '2pm', '5pm', 'B2');


--
-- Data for Name: office admin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: prerequisite; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.prerequisite (course_id, prerequisite_course_id) VALUES ('CSE 453', 'CSE 215');
INSERT INTO public.prerequisite (course_id, prerequisite_course_id) VALUES ('CSE 207', 'CSE 203');
INSERT INTO public.prerequisite (course_id, prerequisite_course_id) VALUES ('CSE 421', 'CSE 207');
INSERT INTO public.prerequisite (course_id, prerequisite_course_id) VALUES ('CSE 463', 'CSE 207');


--
-- Data for Name: registration request; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status) VALUES (20, 1705103, 1, 'add', 'awaiting_advisor');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status) VALUES (21, 1705103, 1, 'drop', 'awaiting_advisor');


--
-- Data for Name: result summary; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (1, 1705103, '4.00', 'A+', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (2, 1705103, '4.00', 'A+', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (4, 1705103, '3.75', 'A', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (5, 1705103, '3.75', 'A', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (7, 1705103, '4.00', 'A+', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (8, 1705103, '4.00', 'A+', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (9, 1705103, '3.50', 'A-', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (10, 1705103, '3.75', 'A', 'published');


--
-- Data for Name: result util; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: scholarship; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.scholarship (scholarship_id, student_id, session_id, scholarship_state, scholarship_type_id, payment_date) VALUES (3, 1705103, 'JAN 2019', 'awaiting_provost', 3, NULL);
INSERT INTO public.scholarship (scholarship_id, student_id, session_id, scholarship_state, scholarship_type_id, payment_date) VALUES (4, 1705103, 'JAN 2019', 'awaiting_comptroller', 3, NULL);
INSERT INTO public.scholarship (scholarship_id, student_id, session_id, scholarship_state, scholarship_type_id, payment_date) VALUES (1, 1705103, 'JULY 2019', 'awaiting_application', 1, NULL);
INSERT INTO public.scholarship (scholarship_id, student_id, session_id, scholarship_state, scholarship_type_id, payment_date) VALUES (2, 1705103, 'JAN 2019', 'paid', 2, '2019-07-30');


--
-- Data for Name: scholarship type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."scholarship type" (scholarship_type_id, scholarship_name, amount) VALUES (1, 'Dean''s List', 2000);
INSERT INTO public."scholarship type" (scholarship_type_id, scholarship_name, amount) VALUES (2, 'University Merit', 5000);
INSERT INTO public."scholarship type" (scholarship_type_id, scholarship_name, amount) VALUES (3, 'Technical', 1500);
INSERT INTO public."scholarship type" (scholarship_type_id, scholarship_name, amount) VALUES (4, 'Board', 5500);


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.session (session_id, start, "end") VALUES ('JAN 2022', '2022-05-12', '2022-10-20');


--
-- Data for Name: session_phase; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (1, 'JAN 2022', '2022-05-14', '2022-07-01', 7, 'Class');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (2, 'JAN 2022', '2022-07-02', '2022-07-15', 2, 'Mid Break and Eid Ul Azha Break');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (3, 'JAN 2022', '2022-07-16', '2022-09-02', 7, 'Class');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (4, 'JAN 2022', '2022-09-03', '2022-09-23', 3, 'Exam Preparation Leave');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (5, 'JAN 2022', '2022-09-24', '2022-10-02', 3, 'Exam');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (6, 'JAN 2022', '2022-10-03', '2022-10-09', 1, 'Durga Puja Break');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (7, 'JAN 2022', '2022-10-10', '2022-10-24', 2, 'Exam');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (8, 'JAN 2022', '2022-10-25', '2022-11-18', 4, 'Term Break');


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term) VALUES (1705103, 'Nazmul Takbir', 'nazmultakbir98@gmail.com', 1, 5, 10000, '01727498589', '5847362365', 'Flat A8, House 287, Road 8A, Dhanmondi, Dhaka', 'Flat A8, House 287, Road 8A, Dhanmondi, Dhaka', '1999-05-08', '1485763241', 4, 1);


--
-- Data for Name: student_seat_plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (1, 8, 4, 1, 'JAN 2022', 1705103);


--
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link) VALUES (10000, 5, 'Abdullah Adnan', '406', '0281053398', '+8801710680500', 'abdullah.adnan@gmail.com', 'https://sites.google.com/site/abdullahadnan/');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link) VALUES (10001, 5, 'Saifur Rahman', '408', '0285478218', '+8801767945550', 'saifur.rahman@gmail.com', 'https://cse.buet.ac.bd/faculty/facdetail.php?id=mrahman');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link) VALUES (10002, 5, 'Sohel Rahman', '410', '02810578433', '+88017196134154', 'sohel.rahman@gmail.com', 'https://msrahman.buet.ac.bd/');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link) VALUES (10003, 5, 'Syed Latif', '413', '02913467521', '+8801711578932', 'syed.latif@gmail.com', 'https://cse.buet.ac.bd/faculty/facdetail.php?id=asmlatifulhoque');


--
-- Name: complaint_complaint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.complaint_complaint_id_seq', 2, true);


--
-- Name: comptroller admin_comptroller_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."comptroller admin_comptroller_admin_id_seq"', 1, false);


--
-- Name: course offering_offering_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."course offering_offering_id_seq"', 10, true);


--
-- Name: department admin_dept_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."department admin_dept_admin_id_seq"', 1, false);


--
-- Name: dues type_dues type id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."dues type_dues type id_seq"', 4, true);


--
-- Name: dues_dues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dues_dues_id_seq', 2, true);


--
-- Name: exam time_exam_slot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."exam time_exam_slot_id_seq"', 9, true);


--
-- Name: exam_guidelines_guideline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exam_guidelines_guideline_id_seq', 3, true);


--
-- Name: grade distribution policy_gd_policy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."grade distribution policy_gd_policy_id_seq"', 1, false);


--
-- Name: hall admin_hall_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."hall admin_hall_admin_id_seq"', 1, false);


--
-- Name: location_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.location_location_id_seq', 7, true);


--
-- Name: mark distribution policy_md_policy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."mark distribution policy_md_policy_id_seq"', 1, false);


--
-- Name: notice_notice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notice_notice_id_seq', 3, true);


--
-- Name: office admin_office_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."office admin_office_admin_id_seq"', 1, false);


--
-- Name: registration request_reg_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."registration request_reg_request_id_seq"', 21, true);


--
-- Name: scholarship type_scholarship_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."scholarship type_scholarship_type_id_seq"', 4, true);


--
-- Name: scholarship_scholarship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scholarship_scholarship_id_seq', 4, true);


--
-- Name: student_seat_plan_seat_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_seat_plan_seat_plan_id_seq', 1, true);


--
-- Name: complaint complaint_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaint
    ADD CONSTRAINT complaint_pkey PRIMARY KEY (complaint_id);


--
-- Name: comptroller admin comptroller admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."comptroller admin"
    ADD CONSTRAINT "comptroller admin_pkey" PRIMARY KEY (comptroller_admin_id);


--
-- Name: course offering course offering_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."course offering"
    ADD CONSTRAINT "course offering_pkey" PRIMARY KEY (offering_id);


--
-- Name: course registration course registration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."course registration"
    ADD CONSTRAINT "course registration_pkey" PRIMARY KEY (student_id, offering_id);


--
-- Name: course offering teacher course_offering_teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."course offering teacher"
    ADD CONSTRAINT course_offering_teacher_pkey PRIMARY KEY (offering_id, teacher_id);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (course_id);


--
-- Name: department admin department admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."department admin"
    ADD CONSTRAINT "department admin_pkey" PRIMARY KEY (dept_admin_id);


--
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (dept_id);


--
-- Name: dues type dues type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dues type"
    ADD CONSTRAINT "dues type_pkey" PRIMARY KEY ("dues type id");


--
-- Name: dues dues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dues
    ADD CONSTRAINT dues_pkey PRIMARY KEY (dues_id);


--
-- Name: exam time exam time_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."exam time"
    ADD CONSTRAINT "exam time_pkey" PRIMARY KEY (exam_slot_id);


--
-- Name: exam_guidelines exam_guidelines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_guidelines
    ADD CONSTRAINT exam_guidelines_pkey PRIMARY KEY (guideline_id);


--
-- Name: grade distribution policy grade distribution policy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."grade distribution policy"
    ADD CONSTRAINT "grade distribution policy_pkey" PRIMARY KEY (gd_policy_id);


--
-- Name: grade distribution policy details grade_dist_policy_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."grade distribution policy details"
    ADD CONSTRAINT grade_dist_policy_details_pkey PRIMARY KEY (gd_policy_id, policy_number);


--
-- Name: hall admin hall admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."hall admin"
    ADD CONSTRAINT "hall admin_pkey" PRIMARY KEY (hall_admin_id);


--
-- Name: hall hall_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hall
    ADD CONSTRAINT hall_pkey PRIMARY KEY (hall_id);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (location_id);


--
-- Name: mark distribution policy mark distribution policy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."mark distribution policy"
    ADD CONSTRAINT "mark distribution policy_pkey" PRIMARY KEY (md_policy_id);


--
-- Name: marking criteria marking_criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."marking criteria"
    ADD CONSTRAINT marking_criteria_pkey PRIMARY KEY (criteria_name, md_policy_id);


--
-- Name: notice notice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice
    ADD CONSTRAINT notice_pkey PRIMARY KEY (notice_id);


--
-- Name: offering time location offering time location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."offering time location"
    ADD CONSTRAINT "offering time location_pkey" PRIMARY KEY (offering_id, class_number);


--
-- Name: office admin office admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."office admin"
    ADD CONSTRAINT "office admin_pkey" PRIMARY KEY (office_admin_id);


--
-- Name: prerequisite prerequisite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prerequisite
    ADD CONSTRAINT prerequisite_pkey PRIMARY KEY (course_id, prerequisite_course_id);


--
-- Name: registration request registration request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."registration request"
    ADD CONSTRAINT "registration request_pkey" PRIMARY KEY (reg_request_id);


--
-- Name: result summary result summary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."result summary"
    ADD CONSTRAINT "result summary_pkey" PRIMARY KEY (offering_id, student_id);


--
-- Name: result util result util_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."result util"
    ADD CONSTRAINT "result util_pkey" PRIMARY KEY (student_id, offering_id);


--
-- Name: scholarship type scholarship type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."scholarship type"
    ADD CONSTRAINT "scholarship type_pkey" PRIMARY KEY (scholarship_type_id);


--
-- Name: scholarship scholarship_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scholarship
    ADD CONSTRAINT scholarship_pkey PRIMARY KEY (scholarship_id);


--
-- Name: session_phase session_phase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_phase
    ADD CONSTRAINT session_phase_pkey PRIMARY KEY (phase_number, session_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (session_id);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (student_id);


--
-- Name: student_seat_plan student_seat_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_seat_plan
    ADD CONSTRAINT student_seat_plan_pkey PRIMARY KEY (seat_plan_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

