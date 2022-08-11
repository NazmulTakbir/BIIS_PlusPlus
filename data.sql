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
-- Name: result summary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."result summary" (
    offering_id integer NOT NULL,
    student_id integer NOT NULL,
    grade_point real,
    letter_grade text,
    result_status text,
    CONSTRAINT "result summary_result_status_check" CHECK (((result_status = 'awaiting_headapproval'::text) OR (result_status = 'awaiting_provostapproval'::text) OR (result_status = 'awaiting_examcontroller'::text) OR (result_status = 'published'::text)))
);


ALTER TABLE public."result summary" OWNER TO postgres;

--
-- Name: academic profile; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public."academic profile" AS
 SELECT r.student_id,
    co.session_id,
    co.course_id,
    c.course_name,
    c.credits,
    r.grade_point,
    r.letter_grade,
    c.level,
    c.term
   FROM ((public."result summary" r
     JOIN public."course offering" co USING (offering_id))
     JOIN public.course c USING (course_id))
  WHERE (r.result_status = 'published'::text);


ALTER TABLE public."academic profile" OWNER TO postgres;

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
-- Name: registration request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."registration request" (
    reg_request_id integer NOT NULL,
    student_id integer,
    offering_id integer,
    request_type text,
    reg_status text,
    request_date date,
    CONSTRAINT "registration request_reg_status_check" CHECK (((reg_status = 'awaiting_advisor'::text) OR (reg_status = 'awaiting_head'::text) OR (reg_status = 'approved'::text))),
    CONSTRAINT "registration request_request_type_check" CHECK (((request_type = 'register'::text) OR (request_type = 'add'::text) OR (request_type = 'drop'::text)))
);


ALTER TABLE public."registration request" OWNER TO postgres;

--
-- Name: course registrations; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public."course registrations" AS
 SELECT t3.student_id,
    t3.offering_id,
    t3.reg_status,
    t4.session_id,
    t4.course_id
   FROM ( SELECT t1.student_id,
            t1.offering_id,
            t2.reg_status
           FROM ( SELECT "registration request".student_id,
                    "registration request".offering_id,
                    max("registration request".reg_request_id) AS reg_request_id
                   FROM public."registration request"
                  GROUP BY "registration request".student_id, "registration request".offering_id) t1,
            ( SELECT "registration request".reg_request_id,
                    "registration request".reg_status,
                    "registration request".request_type
                   FROM public."registration request") t2
          WHERE ((t1.reg_request_id = t2.reg_request_id) AND (t2.reg_status = 'approved'::text) AND (t2.request_type = 'add'::text))) t3,
    ( SELECT "course offering".offering_id,
            "course offering".session_id,
            "course offering".course_id
           FROM public."course offering") t4
  WHERE (t3.offering_id = t4.offering_id);


ALTER TABLE public."course registrations" OWNER TO postgres;

--
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    dept_id integer NOT NULL,
    dept_name text,
    dept_head integer
);


ALTER TABLE public.department OWNER TO postgres;

--
-- Name: department admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."department admin" (
    dept_admin_id integer NOT NULL,
    dept_id integer,
    name text,
    password text
);


ALTER TABLE public."department admin" OWNER TO postgres;

--
-- Name: department admin_dept_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."department admin" ALTER COLUMN dept_admin_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."department admin_dept_admin_id_seq"
    START WITH 300000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


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
    "dues_type_id" integer NOT NULL,
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

ALTER SEQUENCE public."dues type_dues type id_seq" OWNED BY public."dues type"."dues_type_id";


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
    end_time text,
    session_id text
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
    session_id text,
    upload_date date
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
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    feedback_id integer NOT NULL,
    student_id integer,
    teacher_id integer,
    subject text,
    details text,
    submission_date date,
    receiver_type text
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- Name: feedback_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedback_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.feedback_feedback_id_seq OWNER TO postgres;

--
-- Name: feedback_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_feedback_id_seq OWNED BY public.feedback.feedback_id;


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
    hall_id integer,
    name text,
    password text
);


ALTER TABLE public."hall admin" OWNER TO postgres;

--
-- Name: hall admin_hall_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."hall admin" ALTER COLUMN hall_admin_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."hall admin_hall_admin_id_seq"
    START WITH 200000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location (
    location_id integer NOT NULL,
    building text,
    room_no text
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
    office_admin_id integer NOT NULL,
    name text,
    password text
);


ALTER TABLE public."office admin" OWNER TO postgres;

--
-- Name: office admin_office_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."office admin" ALTER COLUMN office_admin_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."office admin_office_admin_id_seq"
    START WITH 400000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: prerequisite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prerequisite (
    course_id text NOT NULL,
    prerequisite_course_id text NOT NULL
);


ALTER TABLE public.prerequisite OWNER TO postgres;

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
    start_date date,
    end_date date,
    registration_phase text,
    CONSTRAINT session_registration_phase_check CHECK (((registration_phase = 'not started'::text) OR (registration_phase = 'open'::text) OR (registration_phase = 'closed'::text)))
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
    term integer,
    password text
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
    link text,
    password text
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- Name: comptroller admin comptroller_admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."comptroller admin" ALTER COLUMN comptroller_admin_id SET DEFAULT nextval('public."comptroller admin_comptroller_admin_id_seq"'::regclass);


--
-- Name: course offering offering_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."course offering" ALTER COLUMN offering_id SET DEFAULT nextval('public."course offering_offering_id_seq"'::regclass);


--
-- Name: dues dues_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dues ALTER COLUMN dues_id SET DEFAULT nextval('public.dues_dues_id_seq'::regclass);


--
-- Name: dues type dues_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dues type" ALTER COLUMN "dues_type_id" SET DEFAULT nextval('public."dues type_dues type id_seq"'::regclass);


--
-- Name: exam time exam_slot_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."exam time" ALTER COLUMN exam_slot_id SET DEFAULT nextval('public."exam time_exam_slot_id_seq"'::regclass);


--
-- Name: exam_guidelines guideline_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_guidelines ALTER COLUMN guideline_id SET DEFAULT nextval('public.exam_guidelines_guideline_id_seq'::regclass);


--
-- Name: feedback feedback_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN feedback_id SET DEFAULT nextval('public.feedback_feedback_id_seq'::regclass);


--
-- Name: grade distribution policy gd_policy_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."grade distribution policy" ALTER COLUMN gd_policy_id SET DEFAULT nextval('public."grade distribution policy_gd_policy_id_seq"'::regclass);


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
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 208', 'Data Structures and Algorithms 2 Sessional', 5, 5, 2, 2, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 211', 'Theory of Computation', 5, 5, 2, 2, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 216', 'Database Sessional', 5, 5, 2, 2, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('EEE 269', 'Electrical Drives and Instrumentation', 6, 5, 2, 2, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('EEE 270', 'Electrical Drives and Instrumentation Sessional', 6, 5, 2, 2, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('Math 247', 'Linear Algebra, Laplace Transform and Fourier Analysis ', 21, 5, 2, 2, 4);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 101', 'Structured Programming Language', 5, 5, 1, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 102', 'Structured Programming Language Sessional', 5, 5, 1, 1, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('EEE 163', 'Introduction to Electrical Engineering', 6, 5, 1, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('EEE 164', 'Introduction to Electrical Engineering Sessional', 6, 5, 1, 1, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('MATH 145', 'Differential & Integral Calculus, Coordinate Geometry', 21, 5, 1, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('ME 165', 'Basic Mechanical Engineering', 1, 5, 1, 1, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('ME 174', 'Mechanical Engineering Drawing and CAD', 1, 5, 1, 1, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('PHY 102', 'Physics Sessional', 23, 5, 1, 1, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('PHY 109', 'Thermodynamics, Electricity, Magnestism and Waves', 23, 5, 1, 1, 4);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 103', 'Discrete Mathematics', 5, 5, 1, 2, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 107', 'Object Oriented Programming Language', 5, 5, 1, 2, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CSE 108', 'Object Oriented Programming Language Sessional', 5, 5, 1, 2, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CHEM 113', 'Chemistry ', 22, 5, 1, 2, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('CHEM 114', 'Inorganic Quantitative Analysis', 22, 5, 1, 2, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('HUM 172', 'Developing English Skills Sessional', 20, 5, 1, 2, 1.5);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('HUM 183', 'English', 20, 5, 1, 2, 3);
INSERT INTO public.course (course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, credits) VALUES ('MATH 147', 'ODE, PDE and Vector Calculus', 21, 5, 1, 2, 4);


--
-- Data for Name: course offering; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (39, 'CSE 101', 'JAN 2022', 10);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (40, 'EEE 163', 'JAN 2022', 11);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (41, 'MATH 145', 'JAN 2022', 12);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (42, 'PHY 109', 'JAN 2022', 13);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (43, 'ME 165', 'JAN 2022', 14);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (44, 'CSE 102', 'JAN 2022', NULL);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (45, 'PHY 102', 'JAN 2022', NULL);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (46, 'ME 174', 'JAN 2022', NULL);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (48, 'CSE 103', 'JULY 2022', 15);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (49, 'CSE 107', 'JULY 2022', 16);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (50, 'MATH 147', 'JULY 2022', 17);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (51, 'CHEM 113', 'JULY 2022', 18);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (52, 'HUM 183', 'JULY 2022', 19);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (53, 'CHEM 114', 'JULY 2022', NULL);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (54, 'HUM 172', 'JULY 2022', NULL);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (55, 'CSE 108', 'JULY 2022', NULL);
INSERT INTO public."course offering" (offering_id, course_id, session_id, exam_slot_id) VALUES (47, 'EEE 164', 'JAN 2022', NULL);


--
-- Data for Name: course offering teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.department (dept_id, dept_name, dept_head) VALUES (1, 'Mechanical Engineering', 100020);
INSERT INTO public.department (dept_id, dept_name, dept_head) VALUES (5, 'Computer Science and Engineering', 100000);
INSERT INTO public.department (dept_id, dept_name, dept_head) VALUES (6, 'Electrical and Electronics Engineering', 100030);
INSERT INTO public.department (dept_id, dept_name, dept_head) VALUES (20, 'Humanities', 100040);
INSERT INTO public.department (dept_id, dept_name, dept_head) VALUES (21, 'Mathematics', 100050);
INSERT INTO public.department (dept_id, dept_name, dept_head) VALUES (22, 'Chemistry', 100060);
INSERT INTO public.department (dept_id, dept_name, dept_head) VALUES (23, 'Physics', 100070);


--
-- Data for Name: department admin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: dues; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.dues (dues_id, student_id, dues_type_id, deadline, dues_status, payment_date, specification) VALUES (3, 1705103, 1, '2022-05-31', 'Paid', '2022-05-01', 'Session JAN 2022');
INSERT INTO public.dues (dues_id, student_id, dues_type_id, deadline, dues_status, payment_date, specification) VALUES (4, 1705103, 2, '2022-01-31', 'Paid', '2022-01-10', 'Year 2022');
INSERT INTO public.dues (dues_id, student_id, dues_type_id, deadline, dues_status, payment_date, specification) VALUES (5, 1705103, 1, '2022-11-30', 'Not Paid', NULL, 'Session JULY 2022');


--
-- Data for Name: dues type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."dues type" ("dues_type_id", description, amount) VALUES (4, 'Dining Fees', '2500');
INSERT INTO public."dues type" ("dues_type_id", description, amount) VALUES (1, 'Exam Fee', '174');
INSERT INTO public."dues type" ("dues_type_id", description, amount) VALUES (2, 'Hall Fee Attached', '5050');
INSERT INTO public."dues type" ("dues_type_id", description, amount) VALUES (3, 'Hall Fee Resident', '11000');


--
-- Data for Name: exam time; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time, session_id) VALUES (10, '2022-05-10', '9am', '12pm', 'JAN 2022');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time, session_id) VALUES (11, '2022-05-15', '9am', '12pm', 'JAN 2022');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time, session_id) VALUES (12, '2022-05-20', '9am', '12pm', 'JAN 2022');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time, session_id) VALUES (13, '2022-05-25', '9am', '12pm', 'JAN 2022');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time, session_id) VALUES (14, '2022-05-30', '9am', '12pm', 'JAN 2022');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time, session_id) VALUES (15, '2022-11-10', '9am', '12pm', 'JULY 2022');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time, session_id) VALUES (16, '2022-11-15', '9am', '12pm', 'JULY 2022');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time, session_id) VALUES (17, '2022-11-20', '9am', '12pm', 'JULY 2022');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time, session_id) VALUES (18, '2022-11-25', '9am', '12pm', 'JULY 2022');
INSERT INTO public."exam time" (exam_slot_id, exam_date, start_time, end_time, session_id) VALUES (19, '2022-11-30', '9am', '12pm', 'JULY 2022');


--
-- Data for Name: exam_guidelines; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.exam_guidelines (guideline_id, description, file_path, session_id, upload_date) VALUES (1, 'Guidelines for Teams', 'https://biis.buet.ac.bd/BIIS_WEB/resource/UGExam/Guidelines_using_Teams.pdf', 'JULY 2022', '2022-06-30');
INSERT INTO public.exam_guidelines (guideline_id, description, file_path, session_id, upload_date) VALUES (2, 'Guidelines for CSE', 'https://biis.buet.ac.bd/BIIS_WEB/resource/UGExam/Guidelines_only_for_CSE.pdf', 'JULY 2022', '2022-07-10');
INSERT INTO public.exam_guidelines (guideline_id, description, file_path, session_id, upload_date) VALUES (3, 'Demo for Camera Placement', 'https://www.youtube.com/watch?v=eMxrO74NdpE', 'JULY 2022', '2022-07-15');


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.feedback (feedback_id, student_id, teacher_id, subject, details, submission_date, receiver_type) VALUES (11, 1705103, 100000, 'Poor Wifi in ECE', 'We cannot utilize our free time in BUET due to lack of good internet connection in ECE', '2022-07-31', 'Department Head');
INSERT INTO public.feedback (feedback_id, student_id, teacher_id, subject, details, submission_date, receiver_type) VALUES (12, 1705103, 100004, 'Lorem Ipsum', 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum', '2022-08-03', 'Advisor');
INSERT INTO public.feedback (feedback_id, student_id, teacher_id, subject, details, submission_date, receiver_type) VALUES (13, 1705103, 100000, 'test', 'test', '2022-08-10', 'Department Head');
INSERT INTO public.feedback (feedback_id, student_id, teacher_id, subject, details, submission_date, receiver_type) VALUES (14, 1705103, 100000, 'test', 'test', '2022-08-11', 'Department Head');
INSERT INTO public.feedback (feedback_id, student_id, teacher_id, subject, details, submission_date, receiver_type) VALUES (15, 1705103, 100004, 'xcxczx', 'zxczcxzc', '2022-08-11', 'Advisor');
INSERT INTO public.feedback (feedback_id, student_id, teacher_id, subject, details, submission_date, receiver_type) VALUES (16, 1705103, 100000, 'wewqe', 'wqewqewqe', '2022-08-11', 'Department Head');


--
-- Data for Name: grade distribution policy; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: grade distribution policy details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: hall; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (1, 'Kazi Nazrul Islam Hall', 100000, 'Mahmudun Nobi', '01754367234', '20chowdhury15@@gmail.com');
INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (2, 'Ahsanullah Hall', 100001, 'Bodrul Arefin', '01543657896', 'arefin87@gmail.com');
INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (3, 'Shere Bangla Hall', 100002, 'Abdur Rob Mia', '01943567891', 'mdabdurrob1988@gmail.com');
INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (4, 'Titumir Hall', 100003, 'Motiur Rahman', '01843565543', 'motiur181@gmail.com');
INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (5, 'Sabequn Nahar Sony Hall', 100004, 'Ashraful Huq', '01855435676', 'ashraful@gmail.com');
INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (6, 'M.A. Rashid Hall', 100005, 'Rafiq Islam', '01755454335', 'rafiq@gmail.com
');
INSERT INTO public.hall (hall_id, hall_name, hall_provost_id, supervisor_name, supervisor_phone, supervisor_email) VALUES (7, 'Suhrawardy Hall', 100006, 'Rashid Kabir', '01855443422', 'rashid@gmail.com');


--
-- Data for Name: hall admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."hall admin" (hall_admin_id, hall_id, name, password) OVERRIDING SYSTEM VALUE VALUES (200000, 1, 'Asif Hasan', '$2a$10$rb0K8SGU8w720jnhWgktje5BXsm1Pz6RUOiehck7bitn3LZ0n9T3W');
INSERT INTO public."hall admin" (hall_admin_id, hall_id, name, password) OVERRIDING SYSTEM VALUE VALUES (200001, 2, 'Sadman Kabir', '$2a$10$1lMKh7xQnqLOENSjx3l01.j7OPZNiOMDoWQHJ1b.ZJkShLfzwvCIq');


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.location (location_id, building, room_no) VALUES (1, 'ECE', '104');
INSERT INTO public.location (location_id, building, room_no) VALUES (2, 'ECE', '105');
INSERT INTO public.location (location_id, building, room_no) VALUES (3, 'ECE', 'Database Lab');
INSERT INTO public.location (location_id, building, room_no) VALUES (4, 'ECE', 'Networking Lab');
INSERT INTO public.location (location_id, building, room_no) VALUES (5, 'OAB', 'English Lab');
INSERT INTO public.location (location_id, building, room_no) VALUES (6, 'OAB', 'Chemistry Lab');
INSERT INTO public.location (location_id, building, room_no) VALUES (8, 'ME', '406');
INSERT INTO public.location (location_id, building, room_no) VALUES (9, 'ME', '408');
INSERT INTO public.location (location_id, building, room_no) VALUES (7, 'ME', '407');
INSERT INTO public.location (location_id, building, room_no) VALUES (10, 'ME', '410');


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

INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (50, 3, 1, 'Tuesday', '9am', '10am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (50, 4, 1, 'Wednesday', '9am', '10am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (51, 1, 1, 'Sunday', '12pm', '1pm', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (55, 1, 3, 'Saturday', '11am', '2pm', 'B2');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (53, 1, 6, 'Sunday', '2pm', '5pm', 'B2');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (54, 1, 5, 'Saturday', '2pm', '5pm', 'B2');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (50, 2, 1, 'Monday', '11am', '12pm', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (52, 2, 2, 'Tuesday', '11am', '12pm', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (52, 3, 2, 'Wednesday', '10am', '11am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (52, 1, 2, 'Monday', '12pm', '1pm', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (51, 2, 1, 'Tuesday', '10am', '11am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (51, 3, 1, 'Wednesday', '11am', '12pm', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (48, 1, 1, 'Saturday', '9am', '10am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (48, 2, 1, 'Sunday', '9am', '10am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (48, 3, 1, 'Monday', '9am', '10am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (49, 1, 2, 'Saturday', '10am', '11am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (49, 2, 2, 'Sunday', '10am', '11am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (49, 3, 2, 'Monday', '10am', '11am', 'B');
INSERT INTO public."offering time location" (offering_id, class_number, location_id, day, start_time, end_time, section) VALUES (50, 1, 1, 'Sunday', '11am', '12pm', 'B');


--
-- Data for Name: office admin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: prerequisite; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.prerequisite (course_id, prerequisite_course_id) VALUES ('CSE 107', 'CSE 101');


--
-- Data for Name: registration request; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (20, 1705103, 39, 'add', 'approved', '2022-07-31');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (23, 1705103, 40, 'add', 'approved', '2022-07-31');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (24, 1705103, 41, 'add', 'approved', '2022-07-31');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (25, 1705103, 42, 'add', 'approved', '2022-07-31');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (26, 1705103, 43, 'add', 'approved', '2022-07-31');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (27, 1705103, 44, 'add', 'approved', '2022-07-31');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (30, 1705103, 47, 'add', 'approved', '2022-07-31');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (28, 1705103, 45, 'add', 'approved', '2022-07-31');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (29, 1705103, 46, 'add', 'approved', '2022-07-31');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (57, 1705103, 48, 'add', 'awaiting_advisor', '2022-08-10');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (59, 1705103, 48, 'drop', 'approved', '2022-08-10');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (58, 1705103, 49, 'add', 'approved', '2022-08-10');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (60, 1705103, 55, 'add', 'awaiting_advisor', '2022-08-11');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (61, 1705103, 51, 'add', 'awaiting_advisor', '2022-08-11');
INSERT INTO public."registration request" (reg_request_id, student_id, offering_id, request_type, reg_status, request_date) VALUES (62, 1705103, 53, 'add', 'awaiting_advisor', '2022-08-11');


--
-- Data for Name: result summary; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (39, 1705103, 4, 'A+', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (40, 1705103, 4, 'A+', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (41, 1705103, 3.75, 'A', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (42, 1705103, 3.75, 'A', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (43, 1705103, 4, 'A+', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (44, 1705103, 4, 'A+', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (45, 1705103, 3.5, 'A-', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (46, 1705103, 3.75, 'A', 'published');
INSERT INTO public."result summary" (offering_id, student_id, grade_point, letter_grade, result_status) VALUES (47, 1705103, 4, 'A+', 'published');


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

INSERT INTO public.session (session_id, start_date, end_date, registration_phase) VALUES ('JAN 2022', '2022-01-01', '2022-05-31', 'closed');
INSERT INTO public.session (session_id, start_date, end_date, registration_phase) VALUES ('JULY 2022', '2022-06-30', '2022-11-29', 'open');


--
-- Data for Name: session_phase; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (1, 'JAN 2022', '2022-01-01', '2022-02-19', 7, 'Class');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (2, 'JAN 2022', '2022-02-20', '2022-02-26', 1, 'Mid Break');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (3, 'JAN 2022', '2022-02-27', '2022-04-17', 7, 'Class');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (4, 'JAN 2022', '2022-04-18', '2022-05-09', 3, 'Exam Preparation Leave');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (5, 'JAN 2022', '2022-05-10', '2022-05-31', 3, 'Exam');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (6, 'JAN 2022', '2022-06-01', '2022-06-30', 4, 'Term Break');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (1, 'JULY 2022', '2022-07-01', '2022-08-19', 7, 'Class');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (2, 'JULY 2022', '2022-08-20', '2022-08-27', 1, 'Mid Break');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (3, 'JULY 2022', '2022-08-28', '2022-10-15', 7, 'Class');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (4, 'JULY 2022', '2022-10-16', '2022-11-07', 3, 'Exam Preparation Leave');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (5, 'JULY 2022', '2022-11-08', '2022-11-30', 3, 'Exam');
INSERT INTO public.session_phase (phase_number, session_id, start_date, end_date, no_of_weeks, description) VALUES (6, 'JULY 2022', '2022-12-01', '2022-12-31', 4, 'Term Break');


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705005, 'Graziella Calbo', 'fredonibali@example.net', 4, 5, 100001, '381379120', '2744819765', 'Via Stefania, 40 Appartamento 89
86034, Guglionesi (CB)', 'Borgo Majewski, 97 Piano 1
48034, Fusignano (RA)', '1997-12-05', '9980018867', 1, 2, '$2a$10$LfjFT3yZs7YZQYMPErXIoe7wJKFJDu4d27YEufYDp9pIBW.H9rlLS');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705006, 'Paoletta Costanzi', 'morena48@example.net', 1, 5, 100001, '+39 36394803856', '3794296122', 'Viale Antonio, 93
58045, Stazione Di Monte Antico (GR)', 'Strada Giuliana, 2
25058, Sulzano (BS)', '1998-04-02', '8174118776', 1, 2, '$2a$10$2jcikGMgWDgroXF3MqpySu.ui1PhPJ.UaCOTnBrY539xnGBfBcJKa');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705007, 'Dott. Osvaldo Petrucci', 'cappellinina@example.com', 3, 5, 100001, '+39 3820683507', '1345017519', 'Vicolo Lazzaro, 75
33031, Variano (UD)', 'Vicolo Ivan, 25
90144, Palermo (PA)', '1998-10-13', '8920379344', 1, 2, '$2a$10$VQI3GpS6psKvgoWc.SQxZODCxlHhewuLDv7aHaShVqzlp9Yu0Ahr2');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705009, 'Coluccio Malatesta', 'gian16@example.net', 1, 5, 100001, '093423818', '6428455873', 'Contrada Raffaellino, 582
22072, Cermenate (CO)', 'Piazza Roncalli, 97 Appartamento 1
23851, Galbiate (LC)', '1999-05-30', '9125960395', 1, 2, '$2a$10$uJdl6a3q6PJMVAbgD3ZUFOrgdw3qKr/8brHh26LM581ElhJsdTJ6K');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705010, 'Donato Scamarcio', 'gasperigiacinto@example.net', 4, 5, 100001, '+39 091934651', '7904036650', 'Contrada Raimondo, 69 Piano 6
44039, Final Di Rero (FE)', 'Strada Gullotta, 4
91015, Sperone Di Custonaci (TP)', '1999-05-27', '3121460263', 1, 2, '$2a$10$eCv6i0Rg7qUHm5/h9dA9nuUIuqNI4fprDdbn4Xee6wU.09IqNMUxO');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705011, 'Etta Basso', 'giuseppinacannizzaro@example.com', 1, 5, 100001, '+39 093219568', '2485462777', 'Canale Morrocco, 388 Appartamento 38
89868, Daffina'' (VV)', 'Via Chigi, 93
64046, Leognano (TE)', '1999-11-25', '5018429305', 1, 2, '$2a$10$wMwLlTEDNyfk8iPsJrM4x.nCVFQtTLRNdA8V.9B7Y8GkR9yG82HnK');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705012, 'Annalisa Zabarella', 'persicobarbara@example.net', 1, 5, 100001, '+39 0125992484', '8279165333', 'Borgo Tonia, 20 Piano 7
46013, Canneto Sull''Oglio (MN)', 'Strada Tonia, 483
26822, Brembio (LO)', '1998-05-29', '8510445270', 1, 2, '$2a$10$Biw2dRfT01ZD56rHAYRA.uXT9Qrfkrtvy6FGqOFqDqy1LyC.SW65O');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705014, 'Riccardo Natta-Disdero', 'pragamario@example.org', 7, 5, 100001, '35109600304', '1999099580', 'Canale Loredana, 47 Piano 4
88021, San Floro (CZ)', 'Incrocio Antonello, 17 Piano 1
28802, Mergozzo (VB)', '1998-11-28', '9546659561', 1, 2, '$2a$10$z9ll9HvEFqQePJNYZz1zlekwissgIRJVy6nrWCgHkXPUZKq0Hbsl.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705015, 'Sig. Gaspare Treccani', 'nigglidaniele@example.org', 7, 5, 100001, '+39 3770885023', '8451026260', 'Incrocio Mariana, 86 Appartamento 65
05029, San Gemini (TR)', 'Borgo Palladio, 9
80027, Frattamaggiore (NA)', '1998-11-29', '7202726768', 1, 2, '$2a$10$D8GjMcRzbIcmOTfh6ZDy3u2vZgxE50MuSHNR.I3xQXiIUSG.HRTWK');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705016, 'Carmelo Bandello', 'olopresti@example.net', 5, 5, 100001, '01920525045', '6550810648', 'Incrocio Matteotti, 60
74025, Marina Di Ginosa (TA)', 'Stretto Melissa, 35 Piano 1
98073, Mistretta (ME)', '1997-11-16', '1431897291', 1, 2, '$2a$10$ph9mgdq3uTh8fUKkfkbhG.1N2RsEFlB05m4RQMgU4VpFv7GnaZcAG');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705017, 'Margherita Basso', 'verdimelissa@example.org', 2, 5, 100001, '03656336493', '1098411507', 'Canale Donato, 9
43055, Casale (PR)', 'Strada Orlando, 837 Appartamento 9
31047, Negrisia (TV)', '1998-12-23', '3308552515', 1, 2, '$2a$10$5/s1jkGQvdAq4NjlOHOUHujLhqC0YMp5wlSjnKNgMkHuuYUbFl9Aa');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705019, 'Niccol╬ô├╢┬ú╬ô├╗├┤ Bersani', 'fceci@example.com', 6, 5, 100001, '+39 3713844881', '3892092148', 'Strada Ramona, 929
20836, Fornaci (MB)', 'Contrada Martucci, 51
73047, Monteroni Di Lecce (LE)', '1999-02-14', '4633354364', 1, 2, '$2a$10$mHsaE9i3Km4TKzF.l74EneGx6bURvKuPb0KJH9jxeeRHdwLQBh.lm');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705020, 'Antonella Binaghi', 'elisacappelli@example.com', 4, 5, 100001, '+39 33482939954', '2448532138', 'Contrada Fanucci, 53
84050, Magliano Vetere (SA)', 'Piazza Puccio, 397
40041, Gaggio Montano (BO)', '1999-10-03', '5956458889', 1, 2, '$2a$10$CSmJrWvWqrchK8T1Azxuu.CGxWVXjZ3rNdz9AkbGpPTxKODGrkGp6');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705021, 'Sig. Lamberto Porzio', 'hsabbatini@example.com', 4, 5, 100001, '+39 0735134658', '7266075825', 'Vicolo Veltroni, 67 Piano 8
50053, Osteria Bianca (FI)', 'Stretto Salvatore, 490 Piano 7
33017, Tarcento (UD)', '1999-05-21', '1643583075', 1, 2, '$2a$10$Ml2nAbWhY7w6hp52BrS2Ye4sKIM5z4j042eFGJ8imfP9/ba0zGAH2');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705023, 'Alderano Bell╬ô├╢┬ú╬ô├╗├┤', 'torquatocanova@example.org', 3, 5, 100001, '+39 088375617', '4636266410', 'Canale Stefanelli, 37
41027, Roccapelago (MO)', 'Strada Fulvio, 163
20814, Valera (MB)', '1998-04-29', '4044087027', 1, 2, '$2a$10$AHZz0teaUb3e//bcSWxmku/OCQPR2EiT7FE4M.drR3Augrfud2k4.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705024, 'Antonella Valguarnera', 'trupianogiuliano@example.net', 3, 5, 100001, '0165627504', '4350760844', 'Rotonda Castioni, 339 Appartamento 84
26042, Cingia De'' Botti (CR)', 'Canale Smirnoff, 614
63073, Offida (AP)', '1998-09-25', '9371146663', 1, 2, '$2a$10$reeQ5hLaKIWs6PE83zKcducV.gQRP0UhovdMKTTcelUOY/d.kBWSS');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705025, 'Sig. Giulio Benedetti', 'michelesanti@example.org', 1, 5, 100001, '+39 0812711818', '7009863951', 'Rotonda Beppe, 1 Appartamento 62
21015, Lonate Pozzolo (VA)', 'Piazza Vincentio, 5
75018, Stigliano (MT)', '1998-10-14', '8660421783', 1, 2, '$2a$10$BV6rXYNz8FRzEmmFFfBpjejHb4V2joAc0/EkRS8NoDtbmqoe9shVW');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705026, 'Etta Gravina', 'staglienogiorgio@example.net', 3, 5, 100001, '+39 0994453883', '3950650415', 'Contrada Cesare, 1 Piano 3
66023, Francavilla Al Mare (CH)', 'Stretto Oreste, 73 Appartamento 2
26049, Stagno Lombardo (CR)', '1997-02-27', '8306634805', 1, 2, '$2a$10$gwjohRg/4cKmPezVacpr4OHOSsGncRlOllKOsvc4runTNDEKmxCJ2');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705028, 'Mario Nonis', 'rapisardirosaria@example.org', 4, 5, 100001, '37795100946', '1065242731', 'Piazza Pezzali, 965
64032, Santa Margherita Di Atri (TE)', 'Vicolo Murialdo, 42
20028, San Vittore Olona (MI)', '1998-11-09', '4010273436', 1, 2, '$2a$10$zslTSm8ZxrWl7RTroG0iMeEV6H7YsbyhbQfPa/TGe6ZOYireXMcNS');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705029, 'Milo Carli', 'aldomonicelli@example.net', 3, 5, 100001, '0481821728', '4037717889', 'Incrocio Rizzoli, 73 Appartamento 45
86092, Cantalupo Nel Sannio (IS)', 'Stretto Angelina, 50 Appartamento 6
89044, Moschetta (RC)', '1997-07-29', '5472633323', 1, 2, '$2a$10$Zn62eCn1nSINOw41uht4GeI3uZ2yLObxVrcdD.H40.8PspIwx2xTm');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705030, 'Daniele Soprano', 'wcorbo@example.com', 2, 5, 100001, '057709540', '1223723292', 'Canale Ceci, 6 Appartamento 5
19016, Monterosso Al Mare (SP)', 'Stretto Liguori, 97 Piano 1
75027, San Giorgio Lucano (MT)', '1998-06-06', '9268161445', 1, 2, '$2a$10$lNLj6/BYm8Eko.MDbRckH.dT97BSCuOv.OZ2Xv2RVTFfW5pqtZjlm');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705031, 'Benvenuto Ramazzotti', 'mmonaco@example.net', 3, 5, 100002, '3464064153', '1875943657', 'Via Sorrentino, 54
09123, Cagliari (CA)', 'Canale Rossana, 87
56010, San Giovanni Alla Vena (PI)', '1998-06-24', '1676161546', 1, 2, '$2a$10$gpey7nxeAgnQNj102urow.csok5Blz/uv3aanocXlqvc8ivWeu7Ka');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705033, 'Nina Mozart', 'xzoppetto@example.com', 5, 5, 100002, '+39 0735443637', '7194011530', 'Vicolo Virginia, 2 Piano 5
18020, Aurigo (IM)', 'Viale Antonetti, 7
43056, San Polo (PR)', '1999-05-11', '7184001015', 1, 2, '$2a$10$LZJuAyNsWDjIH4uFKcySwe40LUM6fPiqGu8WJliVAl1a/Wx/EE.T6');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705002, 'Isabella Dovara', 'npulci@example.net', 4, 5, 100001, '0974170318', '8550287671', 'Contrada Sophia, 94 Piano 1
26042, Cingia De'' Botti (CR)', 'Canale Morlacchi, 558 Appartamento 84
00182, Roma (RM)', '1999-07-06', '5065577571', 1, 2, '$2a$10$9m5lmPTwmgiUajS61NFnWO5a.XOpnWDcS/UpBMRNtZXF4gKghDZoW');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705003, 'Raimondo Sanudo', 'ninettabottigliero@example.net', 1, 5, 100001, '051736377', '9979278707', 'Borgo Calbo, 33 Appartamento 80
26814, Livraga (LO)', 'Canale Ansaldo, 32 Piano 8
17017, Cosseria (SV)', '1997-05-05', '5706803471', 1, 2, '$2a$10$vc7W/Mk0DNwt/GFyH626PeozTBsOouAuvFKBBuAlKZ/WRtzomHjh.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705037, 'Gianluigi Troisi-Babbo', 'horlando@example.net', 3, 5, 100002, '092238738', '3242073024', 'Viale Rastelli, 54 Piano 4
90013, Castelbuono (PA)', 'Via Orlando, 90 Piano 7
22020, Pare'' (CO)', '1997-01-15', '4184207322', 1, 2, '$2a$10$mTqFwvuutWE5W3P6knv29eDO9WWIJnhU5/Eto7aRPCk7vX42DSNKy');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705039, 'Sig.ra Gianna Callegaro', 'cadornapellegrino@example.net', 6, 5, 100002, '34377979860', '7918921854', 'Vicolo Borrani, 24 Piano 7
19038, Marinella Di Sarzana (SP)', 'Viale Toninelli, 99
20053, Rodano (MI)', '1997-08-11', '6929488555', 1, 2, '$2a$10$PfT0xaO/mZYAgenpLb8Lm.iYEmgVRDNi5Vu9UzEIpBNiNsLdF/8tC');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705040, 'Ludovica Trillini', 'pininfarinaalfio@example.org', 7, 5, 100002, '0342895052', '7506792374', 'Piazza Faranda, 796 Piano 5
80063, Piano Di Sorrento (NA)', 'Vicolo Gremese, 34
16015, Orero (GE)', '1999-05-17', '7109834077', 1, 2, '$2a$10$wjSpUXizDhZnijzqDL0AYOLR7Jx7iBYmf77rHZkb7I8st0apBZluy');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705041, 'Pierpaolo Martinelli', 'livia94@example.org', 3, 5, 100002, '+39 07736305715', '3464977919', 'Vicolo Cirillo, 20 Piano 8
95012, Mitogio (CT)', 'Strada Manunta, 793 Appartamento 0
14018, Roatto (AT)', '1997-06-16', '3297671122', 1, 2, '$2a$10$nzQkaJ1w8DkMbAyTh2xcw./eBij6XWY/jIBO.Ir3OOsAXVqihNrHm');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705043, 'Piergiuseppe Boccaccio-Monti', 'lisa47@example.org', 7, 5, 100002, '08125376119', '7820471044', 'Viale Ottavio, 76 Piano 6
70129, Loseto (BA)', 'Strada Morucci, 8 Piano 2
95036, Randazzo (CT)', '1998-04-23', '7969704784', 1, 2, '$2a$10$g13iQ/Z5orrx5xaD73PqC.rztAOM1SIAvL2d7XSeE1zx0uD83qDn6');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705044, 'Cassandra Pedrazzini', 'ferrettiliberto@example.org', 2, 5, 100002, '03426138657', '9871988592', 'Piazza Danilo, 72 Appartamento 4
89012, Delianuova (RC)', 'Viale Acerbi, 35 Piano 6
16030, Sant''Anna (GE)', '1997-08-11', '3289426258', 1, 2, '$2a$10$erMLe8hovF4i2HTiiNfhEeWnoTycR4aHqbzw4sYFIU8SjOAg9ImdO');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705045, 'Giancarlo Barcella-Nievo', 'jzola@example.org', 6, 5, 100002, '+39 08842990615', '5362900302', 'Stretto Valentina, 9 Piano 5
21047, Saronno (VA)', 'Vicolo Serena, 8
80019, Qualiano (NA)', '1999-05-14', '6097480398', 1, 2, '$2a$10$9QXLiyJc1debA2svjXK83ua1t8GRhf.Sje3.AdqULTNIQEm8SYznm');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705047, 'Nicoletta Antonello-Pedroni', 'concettaleopardi@example.net', 4, 5, 100002, '+39 05773109136', '6952820569', 'Canale Tamburi, 296 Appartamento 4
98137, Santo Stefano Di Briga (ME)', 'Viale Donatello, 56
20815, Cogliate (MB)', '1997-03-16', '8659364570', 1, 2, '$2a$10$GhHzSPJn1pyc/ai6igq2Pe9BhzSVmrCPF8eK7rrG8BLUfMfE1jYfe');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705048, 'Sig. Giancarlo Casadei', 'pnievo@example.org', 4, 5, 100002, '+39 3474915290', '6211572596', 'Canale Emma, 926 Appartamento 89
05018, Morrano Nuovo (TR)', 'Viale Giulio, 748
33098, San Lorenzo (PN)', '1997-12-15', '7834085138', 1, 2, '$2a$10$Q7Ia5znPxGMNnUCdQ2/1NOJM3dlB908zyF1AhJy8SF6Gog7NeM4ZW');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705049, 'Pierluigi Rossi', 'pduodo@example.org', 6, 5, 100002, '+39 346620416', '6333240243', 'Stretto Borzom╬ô├╢┬úΓö¼Γò¥, 75 Piano 9
95013, Fiumefreddo Di Sicilia (CT)', 'Vicolo Fioravanti, 728 Piano 0
89058, Scilla (RC)', '1998-02-08', '3835424472', 1, 2, '$2a$10$iWxyBOTaZPokfxt3S08FI..AttTVkkiVMOsYBREgW6acxp2CH5MVO');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705050, 'Dott. Giulietta Rizzo', 'camillo96@example.org', 6, 5, 100002, '+39 39341264996', '4249197426', 'Rotonda Donatella, 39 Piano 1
40131, Bologna (BO)', 'Contrada Satta, 27 Piano 0
44049, Vigarano Mainarda (FE)', '1999-03-27', '4787174794', 1, 2, '$2a$10$iSLDX4qAO0js5JUe2kFi1ugyOiYLmfmPgNTdKksBdV6LABqZrICUS');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705052, 'Silvio Badoglio', 'bernardo63@example.net', 4, 5, 100002, '080670572', '8704608253', 'Vicolo Morena, 8 Appartamento 6
37013, Boi (VR)', 'Incrocio Franzese, 5
95013, Fiumefreddo Di Sicilia (CT)', '1999-06-17', '7498919884', 1, 2, '$2a$10$RxJz.CDwaYfVZ/zToz85YuAKkFCuqHvsy5YAI9TDN4/oSBRVOoEjC');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705053, 'Dott. Filippa Micheletti', 'giacobbe00@example.org', 4, 5, 100002, '+39 366631897', '8970271921', 'Strada Marta, 664 Appartamento 37
87023, Cirella (CS)', 'Viale Mauro, 218 Piano 9
25065, Pieve (BS)', '1997-05-08', '2196889073', 1, 2, '$2a$10$LVis7D4ziKwmS15zH0cpJ.l2u0LHBXNAAZ6y5OtqMuXKwoGTXF7xS');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705054, 'Marisa Falier', 'giannettileopoldo@example.com', 4, 5, 100002, '0363043715', '6663776683', 'Strada Rosina, 729 Piano 8
61100, Villa Ceccolini (PU)', 'Canale Ferraris, 50 Piano 7
56046, Riparbella (PI)', '1997-03-17', '2485954596', 1, 2, '$2a$10$8lfQGv4N2jAf7gOelQnwSuz5DGIBRbbG/esMSMnfT1//h/rpWy/0O');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705056, 'Calogero Necci', 'benito89@example.net', 2, 5, 100002, '+39 01849867667', '3622745929', 'Borgo Matilda, 14
20156, Milano (MI)', 'Stretto Sabatino, 27
65022, Bussi Sul Tirino (PE)', '1998-03-24', '6516412324', 1, 2, '$2a$10$D52URLNri8rvWqsADj39X.L0FlT6PqqXQSOxRmluRKuKvHy1eqmIa');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705057, 'Calogero Botta', 'cesarottisergius@example.org', 7, 5, 100002, '+39 3730815687', '6114276668', 'Incrocio Germano, 92
51021, Le Regine (PT)', 'Incrocio Emanuelli, 66 Piano 2
07036, Sennori (SS)', '1998-03-31', '3428255779', 1, 2, '$2a$10$reTUfWah/O.a0vCRdvEGH.9.wPQPEyDHXtra6FLco6RU5wUCB9TyS');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705058, 'Fernanda Solimena', 'victoria86@example.com', 7, 5, 100002, '+39 03713626946', '3070329985', 'Canale Angeli, 485 Appartamento 91
63071, Rotella (AP)', 'Strada Leopardi, 4
31050, Premaor (TV)', '1998-06-08', '2895342842', 1, 2, '$2a$10$Py4YGfb5BFsLVlsXgy7PquMVUuk/rZ3/CUaAbTp0cqYzlEFhHYKYu');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705059, 'Serena Acerbi', 'loredanavendetti@example.net', 4, 5, 100002, '+39 044595404', '5226628811', 'Canale Piergiorgio, 423
22019, Tremezzo (CO)', 'Incrocio Atenulf, 89 Piano 2
95014, Giarre (CT)', '1999-04-18', '9146887868', 1, 2, '$2a$10$3fplz4l660rwcUVUULIlheJa55M7.oZw2tdO2XMpkIuAXQI1LhSjG');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705061, 'Sig. Lazzaro Vecellio', 'zcorradi@example.net', 2, 5, 100003, '+39 3713920043', '7837719670', 'Piazza Sermonti, 925 Piano 5
23892, Bulciago (LC)', 'Stretto Zola, 0 Appartamento 9
14025, Chiusano D''Asti (AT)', '1999-01-30', '9655937174', 1, 2, '$2a$10$qRPtQZOtE75YLuLJJAmdUOdm01NuFK6mRReT2LrymEScoIVw95zD.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705062, 'Venancio Bramante', 'massimilianofornaciari@example.org', 6, 5, 100003, '+39 096237078', '4714483707', 'Piazza Temistocle, 90 Piano 8
73047, Monteroni Di Lecce (LE)', 'Borgo Raimondo, 957
50028, Sambuca (FI)', '1997-03-07', '8748098876', 1, 2, '$2a$10$VM8J2BReJQb4YlIvvIh1OO37mpFAV7OsN44.YYWF.2JZlH8/JFtz.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705063, 'Lisa Sinisi', 'napoleoneromiti@example.com', 4, 5, 100003, '0341516506', '7226784075', 'Via Fantozzi, 84
57122, Livorno (LI)', 'Strada Gaiatto, 5 Appartamento 5
72015, Selva (BR)', '1997-08-05', '4099384592', 1, 2, '$2a$10$HIWUf7EiJ2oHV24XtPr4O.vHEZAm74fKq.GZ56QpC3QnWcPsOlUpi');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705065, 'Gianluca Cesarotti', 'nargan@example.net', 4, 5, 100003, '379284403', '1232320014', 'Strada Isabella, 6 Appartamento 4
22034, Brunate (CO)', 'Canale Evangelista, 794 Appartamento 16
92021, Caldare (AG)', '1997-12-22', '5185307459', 1, 2, '$2a$10$yOUaGhlx7Xm1nhQeSRW0.O2sGK4CyRtsY68aRiE7/tAvoundV/fbW');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705066, 'Guglielmo Bombieri-Tornatore', 'simonesalieri@example.com', 3, 5, 100003, '+39 0732046272', '5921021574', 'Via Alfonsi, 954 Piano 5
65100, Pescara (PE)', 'Stretto Ravaglioli, 285
00013, Mentana (RM)', '1998-09-27', '2702974269', 1, 2, '$2a$10$dt7U4tiAJ8HPSANvn9GQN.L5kbMHB2d6snc0w/cPLGD/su/dD0SZS');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705035, 'Elmo Inzaghi-Giannelli', 'pontierika@example.net', 4, 5, 100002, '+39 3807925181', '6687890149', 'Incrocio Benito, 99
42023, Cadelbosco Di Sopra (RE)', 'Stretto Prati, 88 Piano 3
73100, Torre Chianca (LE)', '1997-01-26', '6530655875', 1, 2, '$2a$10$6uCtk/FmNs5tF4ZhXJSkuec27o17QRIYC4vbgYrJn0ldy/rkiCy.e');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705036, 'Rolando Stradivari', 'fedele29@example.com', 4, 5, 100002, '+39 09314338947', '3796264597', 'Incrocio Saragat, 3 Appartamento 35
14041, Agliano (AT)', 'Strada Enrico, 63
25054, Marone (BS)', '1998-05-21', '7329197993', 1, 2, '$2a$10$dEYUQJlDh/qMZ5gqmzXiVe3da0yxHXzsExXd4U3C6ul6fJWnn.pHO');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705071, 'Fiorenzo Vasari-Ginese', 'isatolentino@example.com', 5, 5, 100003, '+39 3732532200', '1039608606', 'Viale Cavalcanti, 125
88044, Marcellinara (CZ)', 'Stretto Rembrandt, 13
44124, Ferrara (FE)', '1999-10-18', '8723839037', 1, 2, '$2a$10$WM4zMfjO92RD1ep2.JaH5eNMK4WnKBlSL.qucBKBMxINb6/dmkwMm');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705072, 'Sig.ra Fortunata Inzaghi', 'mcampanella@example.com', 6, 5, 100003, '+39 01651340971', '7471180738', 'Contrada Boito, 95
18018, Arma Di Taggia (IM)', 'Viale Simone, 774
15052, Casalnoceto (AL)', '1997-09-27', '1596302146', 1, 2, '$2a$10$GdyfwAD1ZkxyVOwkiJM/S.yiWuonlp9RkgJbTHLRNGvNec50huqiq');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705073, 'Dott. Pasqual Bartoli', 'fagianifilippo@example.org', 2, 5, 100003, '3349894088', '5078483521', 'Strada Vezzali, 89
18027, Chiusanico (IM)', 'Via Torlonia, 32
23838, Vendrogno (LC)', '1999-07-28', '7149241641', 1, 2, '$2a$10$DRBqiRJKf.uAap9KB1LO9.nJUIFrdp5BSY5NB9c4Rj9G6MIwkeF2i');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705075, 'Martina Caracciolo', 'lamborghiniettore@example.com', 1, 5, 100003, '36291919673', '8102236393', 'Incrocio Federico, 21
44049, Vigarano Pieve (FE)', 'Incrocio Fantozzi, 57
88833, Cerenzia (KR)', '1997-11-20', '9252683931', 1, 2, '$2a$10$3vm0QAe68fjTythp./cYQOj.od0ISk5lGjSn1np6AXcT2/r1/Ad6u');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705076, 'Antonina Squarcione', 'scadutoamanda@example.net', 3, 5, 100003, '+39 0453867578', '5196905798', 'Incrocio Sinisi, 425 Piano 4
28833, Brovello Carpugnino (VB)', 'Canale Amadeo, 9
24024, Gandino (BG)', '1999-05-18', '5460814900', 1, 2, '$2a$10$sUTlorICiUI14995vWeCbe3lWs2jPDcn9co26wMeITTVQRodPlFGW');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705077, 'Beatrice Cerutti', 'jboiardo@example.net', 5, 5, 100003, '+39 092100989', '6681137583', 'Strada Crispi, 77
63834, Massa Fermana (FM)', 'Borgo Iolanda, 31 Piano 4
71038, Pietramontecorvino (FG)', '1998-02-24', '4956763386', 1, 2, '$2a$10$uGnhAL8P9.QODWJqim.ia.5VPhs5nlmKsJpxfAguvlAoxCoSflYZC');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705079, 'Franco Mastroianni', 'grazianopertini@example.org', 7, 5, 100003, '093233968', '6306891146', 'Viale Ludovico, 93 Piano 4
08016, Borore (NU)', 'Stretto Conte, 23
89815, Francavilla Angitola (VV)', '1999-04-22', '9764218837', 1, 2, '$2a$10$sPTf6bX6qTg9q5Wc479mouElsej/lXSL4P2Z8SibzhXxiM8TpCWr2');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705080, 'Lando Puglisi', 'giannoneoreste@example.net', 1, 5, 100003, '3483140294', '6539310142', 'Strada Guarino, 0 Piano 1
25088, Toscolano Maderno (BS)', 'Vicolo Beppe, 86
32040, Presenaio (BL)', '1999-09-12', '8605543464', 1, 2, '$2a$10$GfwdaP8aBET24Jwj6.umBuf2lX0ZXpif2bnXP5e0HzJ090wWfXtLu');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705081, 'Raimondo Malpighi', 'alderanobellocchio@example.org', 2, 5, 100003, '+39 089234158', '4083149689', 'Incrocio Ronaldo, 546
56011, Montemagno (PI)', 'Viale Priscilla, 623
02011, Accumoli (RI)', '1998-08-25', '8757320407', 1, 2, '$2a$10$6Qg/AlzyOPUr3jXKGaV1seqJo.DHS2d409/vNW3rjpR38.YrQkG5C');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705082, 'Pierpaolo Zola', 'marina44@example.org', 1, 5, 100003, '05843228564', '7675820506', 'Via Achille, 16
31028, Tezze (TV)', 'Viale Elisa, 26
95041, Santo Pietro (CT)', '1998-06-19', '6981295045', 1, 2, '$2a$10$G9daSozVkKxSMK8/AhsCJ.IP4tU6Ewj8NbXtbr6x6YBsukVhqeV06');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705084, 'Federica Panzera', 'kpetrucelli@example.net', 3, 5, 100003, '032168643', '6627617014', 'Canale Mattia, 847 Piano 3
04024, Gaeta (LT)', 'Borgo Raimondo, 22 Appartamento 36
02033, Monteleone Sabino (RI)', '1998-11-24', '6087770156', 1, 2, '$2a$10$nU8.YuZTQMaSTtVS/mX/E.QtQmup5ERCoGqMt4L5HHwOpXZvkO.D6');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705085, 'Marissa Papafava-Vigliotti', 'erranimariano@example.org', 6, 5, 100003, '01004521889', '1540667656', 'Strada Simone, 80
20059, Casarile (MI)', 'Borgo Treves, 4 Piano 1
43048, Varano Marchesi (PR)', '1999-07-03', '9850833949', 1, 2, '$2a$10$8CUgnVR5iuELlT.losirEeVwbNz6XVxOKIlFko/7/9U9edC9ya7dy');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705086, 'Dott. Ubaldo Manunta', 'juvarapaola@example.com', 2, 5, 100003, '351384111', '2014826870', 'Piazza Siffredi, 74 Appartamento 6
56017, Pappiana (PI)', 'Stretto Silvio, 14
90139, Palermo (PA)', '1997-05-30', '1947522501', 1, 2, '$2a$10$yrn0VzaoOahe23JmIAKG4enUalCMYbv0JGfTLMs/f0TZc0sOmY0k6');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705088, 'Luciana Lombardo', 'dborzomi@example.net', 4, 5, 100003, '03631588646', '8753439103', 'Via Luciano, 30 Appartamento 6
13833, Portula (BI)', 'Canale Armellini, 2
98122, Messina (ME)', '1998-03-15', '5301212422', 1, 2, '$2a$10$sRxqTt2BU3Ie7dvA.HocWeWAUyaF29xyrX6Cgxj84N29ix7RjzZuW');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705089, 'Riccardo Paruta-Volta', 'lara04@example.org', 5, 5, 100003, '+39 37572528342', '9148891026', 'Piazza Mercadante, 125
85050, Savoia Di Lucania (PZ)', 'Rotonda Fabrizi, 929 Piano 4
24015, San Giovanni Bianco (BG)', '1999-07-19', '9347974522', 1, 2, '$2a$10$xKiDN3tLkkYanCd5Y9nvGerG.QR1fbGW4ytxhDYIIfeL77qn9oUNu');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705090, 'Eleanora Conte', 'dmajorana@example.net', 5, 5, 100003, '+39 077326504', '1748486178', 'Rotonda Dino, 218
64041, Colledoro (TE)', 'Piazza Marini, 53 Piano 7
00054, Ara Nova (RM)', '1999-12-19', '3444605855', 1, 2, '$2a$10$feXx98JMG.rtWfAtBY7nD.yzxjjACdjJF14ZqQzoijCqJa5ky0Nk.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705091, 'Marissa Balla', 'tullio58@example.net', 4, 5, 100004, '+39 0564157416', '6792584080', 'Borgo Scarpa, 21 Appartamento 7
00039, Zagarolo (RM)', 'Canale Benvenuto, 251
42046, Brugneto (RE)', '1998-10-26', '4074174889', 1, 2, '$2a$10$HWMNRpCLoTdGtdGc/SuDLe2GlghF/QOTA.nTDPS0DR9QCn33v./2q');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705093, 'Dott. Livia Cattaneo', 'gianfranco01@example.com', 5, 5, 100004, '+39 052163704', '5102188939', 'Contrada Filogamo, 28 Piano 5
12041, Isola (CN)', 'Vicolo Vincenza, 4 Appartamento 79
74100, Paolo Vi (TA)', '1997-11-13', '9124936783', 1, 2, '$2a$10$j4sLRTzjJ/y0vUv4hQP3HOBLlbZMxLX8jskJDfembnSvcitZD6FNG');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705094, 'Sig. Giuliano Gozzi', 'tizianavalguarnera@example.net', 5, 5, 100004, '+39 38139120153', '9331143048', 'Strada Ezio, 5 Piano 4
11014, Saint Oyen (AO)', 'Strada Scarpetta, 9 Appartamento 1
16048, Rezzoaglio (GE)', '1997-11-08', '5033211184', 1, 2, '$2a$10$ht6RRxAbXPkF4ROongR3T.idT8A3x.EfldP9uCR/xfIvT/F0ksg2O');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705095, 'Pasqual Mercantini', 'fcurci@example.org', 5, 5, 100004, '0774395730', '5981512165', 'Vicolo Rossi, 43 Piano 2
85016, Pietragalla (PZ)', 'Strada Marina, 93 Piano 8
02023, Sant''Ippolito (RI)', '1997-04-05', '4941296969', 1, 2, '$2a$10$32NPIRE2nPVivihaFIt/O.Id.gb0vpHo5Qq5Q46bqxb37/iVu6f1G');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705097, 'Claudia Pozzecco', 'geronimogalilei@example.com', 5, 5, 100004, '+39 0358460532', '3266583157', 'Borgo Loretta, 2
88835, Roccabernarda (KR)', 'Stretto Zabarella, 8 Piano 3
32032, Feltre (BL)', '1998-06-12', '5008324433', 1, 2, '$2a$10$dr2zVablEvRFKCzm49qNiuAQmoPaJ.DiDS0sUaXoItDobIga0iIPC');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705098, 'Stefano Veneziano-Spadafora', 'cassandra52@example.com', 5, 5, 100004, '36678517055', '9209495841', 'Borgo Angelo, 90 Piano 0
24066, Pedrengo (BG)', 'Stretto Binaghi, 34
28859, Trontano (VB)', '1997-05-06', '1743233830', 1, 2, '$2a$10$jvPTd13Ss21NzqF/zkphC.bMzurgF5JY.aBrDLj4jh0iuFCJYO.Ui');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705099, 'Amanda Curci', 'dgentilini@example.org', 5, 5, 100004, '+39 096115992', '3998693197', 'Vicolo Sabatini, 35 Appartamento 7
36040, Vo'' (VI)', 'Via Rembrandt, 598 Piano 2
84135, Fratte (SA)', '1999-01-02', '1744644402', 1, 2, '$2a$10$8Wa/z4S0GPcfArLvthiECu7VlQX2QU4ZeAYIcpGsySzXd9LwRWon2');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705068, 'Ottone Vespucci', 'claudio75@example.com', 7, 5, 100003, '078958039', '3258387496', 'Borgo Giorgio, 66
43022, Monticelli Terme (PR)', 'Vicolo Marisa, 5 Appartamento 6
28061, Biandrate (NO)', '1999-04-11', '3467763681', 1, 2, '$2a$10$benOYWEuQttBsnxM2874muRq9FebvHXG5CsxgTPXx04t37zjcAgR.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705069, 'Giulia Bonino', 'sobrerogiovanni@example.net', 4, 5, 100003, '+39 381967440', '2016856724', 'Vicolo Ubaldo, 97
41016, Rovereto Sulla Secchia (MO)', 'Strada Renzo, 4 Piano 5
89041, Caulonia (RC)', '1997-04-21', '5061830811', 1, 2, '$2a$10$sCCgBGzqO7qoAi7u/4nwhOJfy/3D31g4U6DlcsXqVwKQHegG/Yzdi');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705105, 'Griselda Bertoni', 'orlandodomenico@example.net', 5, 5, 100004, '01228389095', '7760256392', 'Stretto Raurica, 720
35029, Pontelongo (PD)', 'Vicolo Ravaglioli, 38 Piano 5
74013, Ginosa (TA)', '1997-06-12', '1952975163', 1, 2, '$2a$10$6zaSqAlDcYuh9Ii4.AeLQOVcki4LjM1uZFahUZmniSyp/XmHyL.Nu');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705106, 'Giustino Falcone', 'fiorinofusani@example.net', 2, 5, 100004, '+39 0522170978', '5650747403', 'Borgo Stefania, 213
27059, Zavattarello (PV)', 'Contrada Cortese, 282 Appartamento 93
64040, Cortino (TE)', '1997-09-08', '8264448801', 1, 2, '$2a$10$0bvlcpVWBfUs5nYA7z/St.SC4r8RuYuBaBLfsqzC9bsWSW3lX3yGy');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705108, 'Benvenuto Zacco', 'bodonitullio@example.com', 3, 5, 100004, '+39 0426376184', '5102504335', 'Stretto Luigi, 4 Appartamento 51
38026, Ossana (TN)', 'Stretto Jacuzzi, 17 Piano 7
62014, Colbuccaro (MC)', '1999-06-10', '5954999590', 1, 2, '$2a$10$noFd1Aottsfo1bqBH.AcpuZzaUDwG1qNMwqLzAEaYtYTTyyXk5sUy');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705109, 'Pomponio Pincherle-Cagnin', 'gcollina@example.net', 5, 5, 100004, '373866997', '4826710189', 'Vicolo Pizzamano, 628
26034, Piadena (CR)', 'Contrada Cavalcanti, 348
15030, Conzano (AL)', '1997-08-31', '4313835889', 1, 2, '$2a$10$cco1aYjVtRuUeBFJ9hYxEesgd3K/szuVL7MIK1yqC3zyjg/cjezZ.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705110, 'Ricciotti Frescobaldi', 'utamburi@example.net', 7, 5, 100004, '+39 3518626031', '2170812293', 'Borgo Sandi, 670 Appartamento 27
28053, Castelletto Sopra Ticino (NO)', 'Strada Morellato, 6 Piano 6
25048, Cortenedolo (BS)', '1999-05-30', '8960945459', 1, 2, '$2a$10$iEoTVsbljKKSeAAHsxnLverhTHsxDJ3DlCDofAGKqKh0he1gPau7i');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705111, 'Nedda Gioberti', 'tonino00@example.net', 5, 5, 100004, '0789196591', '7458376750', 'Strada Coardi, 25
67025, Ofena (AQ)', 'Stretto Parini, 6
92025, Casteltermini (AG)', '1997-04-28', '1626673382', 1, 2, '$2a$10$lq1jAnK7RvfiQ/ZfV5Tg6.0Vzn8CctbTSIVXbU6oVMMWSgoheGH26');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705113, 'Natalia Ferretti', 'cristoforettigiacomo@example.com', 6, 5, 100004, '083597414', '5079599940', 'Borgo Sansoni, 8 Appartamento 9
54023, Ponticello (MS)', 'Borgo Gasperi, 86 Appartamento 3
23897, Vigano'' (LC)', '1999-03-17', '2125854467', 1, 2, '$2a$10$sKhzI/hBEAiqluUHhhsF2uPhDWZfMhGNYxYU1MwvnWmTacUr.ivDC');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705114, 'Francesca Gotti', 'antonellomilena@example.com', 6, 5, 100004, '+39 03924637073', '8058878806', 'Viale Tullio, 495
74123, Taranto (TA)', 'Contrada Farina, 285
12087, Serra (CN)', '1998-04-14', '4015102080', 1, 2, '$2a$10$FKa0B6MH5s4kkL.6GwLZTepwKdW.3SLYPh0L1DZIOjtSchetUqXK.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705115, 'Maura Cerquiglini', 'salvi86@example.net', 6, 5, 100004, '0461426616', '8314127880', 'Strada Bertolucci, 526
91012, Buseto Palizzolo (TP)', 'Vicolo Cesare, 2
36029, Valstagna (VI)', '1999-08-20', '6177349368', 1, 2, '$2a$10$L2y6ZpLykPgNZZ51ROAnbOxQ.HDlb6vHpGl0lTZ8wgmcYxk6OUDuW');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705116, 'Santino Donati-Altera', 'gianni41@example.net', 2, 5, 100004, '+39 3410587429', '8268874128', 'Incrocio Porcellato, 0
51019, Ponte Buggianese (PT)', 'Incrocio Sinisi, 425
89124, Eremo (RC)', '1999-08-12', '2172809115', 1, 2, '$2a$10$q9MBCHjyJsE4V7S4cLlotO.fRAHMzwDfztnXxYiso.OSG50dNiid6');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705118, 'Delfino Ferragni', 'amedeoagostini@example.net', 6, 5, 100004, '+39 03241843950', '3961071576', 'Rotonda Nanni, 957
80070, Bacoli (NA)', 'Contrada Marta, 90 Appartamento 78
94015, Piazza Armerina (EN)', '1999-04-10', '5215218387', 1, 2, '$2a$10$vOa3rq0AvGH384IRSyGoWOZzATAjr1RNPYTDhk8.lzvNtoNUeldhe');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705119, 'Galasso Franceschi', 'gianna77@example.com', 4, 5, 100004, '+39 09335338701', '3569633081', 'Via Venancio, 2
09033, Decimomannu (CA)', 'Vicolo Bonaventura, 297 Piano 0
46020, Pegognaga (MN)', '1998-09-02', '7725484157', 1, 2, '$2a$10$NbzSM1Gn38QDdaekBdxqYO9cBHmdPuGiQznSQXzLPt/xJLXbc5Zmm');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705120, 'Gianmarco Vigorelli', 'vincenzodoria@example.org', 6, 5, 100004, '34375858181', '3290317496', 'Borgo Ginese, 773
89026, San Ferdinando (RC)', 'Piazza Gonzaga, 1
38034, Lisignago (TN)', '1998-06-06', '6902098320', 1, 2, '$2a$10$OjXLGXNpUhEdZlYz/WBZb.Jq4hIMNTHMx3cKOGFZz21vEgVdLcG2W');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705004, 'Massimiliano Trevisan', 'iannellinino@example.net', 3, 5, 100001, '+39 0363335266', '9505846591', 'Borgo Fausto, 21
63093, Agelli (AP)', 'Stretto Micheletto, 9 Piano 7
88044, Marcellinara (CZ)', '1997-02-18', '9281087574', 1, 2, '$2a$10$BMl2i6cHkc7TfhGRsjza2.uFE85EE1R949Ziupgt44aH.A8miRB5a');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705001, 'Sig.ra Gemma Gozzano', 'fiorenzo06@example.net', 1, 5, 100001, '0734969777', '9627084899', 'Piazza Raffaello, 75
89823, Mongiana (VV)', 'Canale Puccio, 969
73030, Surano (LE)', '1999-05-18', '5019097201', 1, 2, '$2a$10$.oWmSFGWSVbGzX.BKXwI3e8WcvslnAzLoMZWJVzs0Dcaq4q7bjhhe');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705008, 'Benvenuto Chigi', 'marcotartaglia@example.net', 7, 5, 100001, '05864400365', '1626075616', 'Strada Camillo, 611 Appartamento 37
00135, La Giustiniana (RM)', 'Contrada Schiaparelli, 7
45030, Occhiobello (RO)', '1999-07-12', '7576663223', 1, 2, '$2a$10$FEFkg5R6hTtT6hpT/dttiOwgYxi2DCfG1SaHXVhFWER1BNMpCSYC6');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705013, 'Melina Lancisi', 'giacintonitti@example.net', 5, 5, 100001, '+39 04343266132', '1602725671', 'Incrocio Staglieno, 58 Appartamento 72
41042, Fiorano Modenese (MO)', 'Stretto Giacobbe, 14
28832, Belgirate (VB)', '1998-07-25', '3444745649', 1, 2, '$2a$10$92y5BpwMBHtIjNaFkKKeOehkh8Uu0csnlVeuHBia8yiwnSswZEB/q');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705018, 'Tiziano Tornatore-Giannelli', 'toselligemma@example.org', 7, 5, 100001, '0431663723', '1269861105', 'Contrada Coluccio, 6
28078, Romagnano Sesia (NO)', 'Canale Greco, 577 Appartamento 25
31012, Cappella Maggiore (TV)', '1998-08-04', '2102224318', 1, 2, '$2a$10$NDFg4oyo7QQsp7mM6y28g.Grm/r1knKZKZqgy84xYiAdBJcyHTYWi');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705022, 'Bettina Tomaselli', 'eugeniaiadanza@example.com', 3, 5, 100001, '04323863958', '7943801197', 'Stretto Sibilia, 223 Piano 4
25019, Colombare Di Sirmione (BS)', 'Canale Giorgio, 36 Appartamento 5
73032, Castiglione (LE)', '1997-03-18', '1063823862', 1, 2, '$2a$10$9rfV95Bg98X3NBEpLkgEjuB3Fxz1KkFcRm.ulT9YYcK01J2Yc.Caq');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705027, 'Sig. Cirillo Monte', 'mbrugnaro@example.org', 5, 5, 100001, '+39 34784627318', '3086168605', 'Vicolo Carli, 48
11017, Morgex (AO)', 'Borgo Conti, 56 Appartamento 77
17019, Alpicella (SV)', '1997-04-03', '2023275135', 1, 2, '$2a$10$vT5nFSBHShTyTPEyCVyJLOPKicKSD9Xl77pE2Gk7yy/SkSOwfSwSW');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705032, 'Claudio Pucci', 'wtron@example.net', 3, 5, 100002, '+39 33476037504', '9773746945', 'Canale Salgari, 797 Piano 3
22035, Canzo (CO)', 'Canale Pedrazzini, 75 Appartamento 86
00024, Castel Madama (RM)', '1999-11-12', '5040622205', 1, 2, '$2a$10$I6tndZZmAgVn6CAnKeEJJeEHZhdx7U1Ckmoo77iRhgaKXEPNsJgx.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705034, 'Danilo Lupo', 'dparmitano@example.com', 6, 5, 100002, '+39 057800839', '1820136327', 'Vicolo Spallanzani, 42
86047, Santa Croce Di Magliano (CB)', 'Borgo Malenchini, 33
01030, Calcata Nuova (VT)', '1999-01-09', '4957738960', 1, 2, '$2a$10$rMpH4MITNSacHgOqsRUQH.ichYcjSD.W6Zd8MOsbrc.AhZqkjl.ee');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705038, 'Francesca Volterra', 'bburcardo@example.net', 3, 5, 100002, '385687036', '4607270274', 'Stretto Zito, 8 Piano 8
24065, Lovere (BG)', 'Vicolo Galeati, 82 Piano 8
87032, Amantea Marina (CS)', '1997-08-07', '8059174550', 1, 2, '$2a$10$.VMzK/t.ja2m6zy/lD6wCeLhe4uBqXJv839.ayRDEHT7d533IUsem');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705042, 'Cristina Federici', 'michelangelomazzanti@example.com', 6, 5, 100002, '0183227080', '3243966375', 'Strada Ricciotti, 79 Piano 3
61011, Case Badioli (PU)', 'Rotonda Arnaldo, 81
20054, Segrate (MI)', '1997-09-22', '5603916753', 1, 2, '$2a$10$meDiKrrsShIcA656lKPejOHnRSXJLDri8VoJK5F1Cvi00rALXGDmy');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705104, 'Carmelo Paolucci', 'venanciomaglio@example.com', 4, 5, 100004, '3684143570', '3115563315', 'Rotonda Amedeo, 3 Piano 0
86086, Poggio Sannita (IS)', 'Via Saffi, 756
20147, Milano (MI)', '1997-08-13', '4776921950', 1, 2, '$2a$10$I.GCMDU7nilMThKzc8qIku/u5R2jXK5ZpFF.MBfR6jvMh3MUVhNP2');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705060, 'Arnaldo Malatesta', 'jfermi@example.net', 3, 5, 100002, '+39 09317876743', '9647029456', 'Rotonda Calbo, 398 Appartamento 9
00071, Pomezia (RM)', 'Canale Gucci, 31 Appartamento 6
21054, Bergoro (VA)', '1999-02-23', '9497504951', 1, 2, '$2a$10$lBdc.tNZeETV2p6SkIXK.udRpqyTB2F1CqNR.F9CCS6hG8DhVMAVO');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705064, 'Maria Togliatti', 'campanolodovico@example.net', 6, 5, 100003, '03450073822', '8187640881', 'Rotonda Concetta, 22 Piano 3
96016, Lentini (SR)', 'Piazza Ermes, 7 Piano 8
23014, Andalo Valtellino (SO)', '1997-03-31', '8035699185', 1, 2, '$2a$10$KazNkKWHt0m4Ek5Y1cXvG.F10V4SLyWJTip17xrIExt76yGn1iXfq');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705067, 'Dott. Ninetta Petrucci', 'zgagliano@example.com', 5, 5, 100003, '+39 0183407999', '7411124003', 'Rotonda Baccio, 2 Appartamento 45
64042, Villa Petto (TE)', 'Contrada Milo, 49 Appartamento 6
21014, Laveno Mombello (VA)', '1997-09-19', '7201613009', 1, 2, '$2a$10$TWgRXqccqhH3IH/c5yzlNebCrgI5Z/kfTx1EA/mbtuYQynHOfz2By');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705074, 'Rosalia Ceci', 'argentogemma@example.net', 6, 5, 100003, '+39 042947840', '4786982479', 'Viale Puccio, 27
20006, Pregnana Milanese (MI)', 'Canale Bottaro, 20 Piano 0
25124, Brescia (BS)', '1997-02-21', '2681426796', 1, 2, '$2a$10$yrxxVBfzzamnd3femymZwOox9hVb781sADpRymSddvSjzwh8U8Wlm');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705078, 'Dott. Raffaellino Eco', 'vmunari@example.org', 2, 5, 100003, '037663513', '2923729382', 'Contrada Eva, 15
06073, Corciano (PG)', 'Canale Lollobrigida, 7
85013, Genzano Di Lucania (PZ)', '1997-10-29', '7131458857', 1, 2, '$2a$10$Rty/AgGYK/vl7jFfNTUMYO9UST5FWKK7uQI.aTwim.KLkS9ODyccS');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705083, 'Napoleone Ferragni', 'melissa01@example.net', 3, 5, 100003, '351953543', '1422977651', 'Rotonda Pomponio, 5 Appartamento 7
43049, Pessola (PR)', 'Piazza Romano, 57
23857, Valgreghentino (LC)', '1997-07-13', '4107942405', 1, 2, '$2a$10$xCslZTPysddMyAQG3jyT2.zSiS8O2CDwoC4On9CM0WuMC4FxT0Nlu');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705087, 'Sig.ra Fabrizia Greco', 'pierpaolovidoni@example.org', 6, 5, 100003, '+39 0934580761', '5516636966', 'Stretto Martina, 3
35136, Padova (PD)', 'Piazza Torquato, 39 Appartamento 2
62025, Fiuminata (MC)', '1998-07-23', '4155709749', 1, 2, '$2a$10$3/PbC8TkGRg75eO/CZXKjOIIEjmMmVevxg2hgskg.3TgxA5lTazsC');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705092, 'Torquato Manacorda', 'ivan98@example.net', 2, 5, 100004, '343418211', '5498783330', 'Contrada Badoglio, 3
45010, Braglia (RO)', 'Rotonda Fo, 13
25100, Brescia (BS)', '1997-04-30', '8485438182', 1, 2, '$2a$10$NzgtSAZN.gCCD5eqVJA8kuc6XUW/yXAs2jI0ZVW9MorByVW.ihlyS');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705096, 'Gaspare Dulbecco-Luria', 'piermariaabatantuono@example.com', 5, 5, 100004, '+39 0314075160', '7871986263', 'Vicolo Filogamo, 7 Piano 1
13872, Borriana (BI)', 'Contrada Catenazzi, 47 Piano 7
90027, Petralia Sottana (PA)', '1998-05-29', '8835458108', 1, 2, '$2a$10$oea9ht8ddcDMmB//Cx.lzu/tyz4SjNCQemGgJHE4ghgP/zUmP0WfW');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705100, 'Pasquale Sagese-Speri', 'ernestobinaghi@example.net', 1, 5, 100004, '+39 05645987121', '7313248389', 'Piazza Fabia, 867 Piano 0
31012, Cappella Maggiore (TV)', 'Piazza Rizzoli, 2
01030, Carbognano (VT)', '1999-06-05', '7227362970', 1, 2, '$2a$10$BK0YR4XPXCfYpEV3UYBsyumDpWTEqxBm9zyeokyxqT8jyvONg8zTa');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705101, 'Antonia Gasperi', 'rothrosina@example.net', 6, 5, 100004, '+39 353366846', '2854886363', 'Strada Papetti, 531
53023, Castiglione D''Orcia (SI)', 'Stretto Adelmo, 13
82034, San Lupo (BN)', '1997-05-10', '1181680959', 1, 2, '$2a$10$yozYAzXtGBue2h53OO9OhOD/dk1p0pXriUxS3le4Ykd5/nM3bfPGS');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705102, 'Sig. Santino Sauro', 'vespagianfranco@example.org', 3, 5, 100004, '0825513052', '9708194548', 'Canale Udinese, 666 Appartamento 47
16149, Genova (GE)', 'Piazza Griselda, 2
24010, Ornica (BG)', '1999-07-21', '2253665991', 1, 2, '$2a$10$kD6wKU7247pbp5eE2MyBQOJWEyi9Ks27nf4VZikD1MNkop.gTY/Ia');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705107, 'Gelsomina Savorgnan-Abbagnale', 'ruffinistefano@example.net', 7, 5, 100004, '+39 0584591276', '1992437973', 'Incrocio Palladio, 180
37013, Boi (VR)', 'Rotonda Orsini, 90 Appartamento 1
87066, Longobucco (CS)', '1999-05-09', '9421892130', 1, 2, '$2a$10$JvHJ99G84QkOX8MUy5Unsesm1l9i7VuyUQM1ss7nAkOqF7WVeYLjC');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705112, 'Elvira Viviani-Dandolo', 'michelettigino@example.net', 7, 5, 100004, '053669499', '1035148198', 'Strada Livia, 98 Appartamento 4
67032, Pescasseroli (AQ)', 'Piazza Fantini, 96 Piano 4
86022, Limosano (CB)', '1999-06-18', '4944365281', 1, 2, '$2a$10$yXCnLpB6mkFvfy8tIDBfNOf.i2F5tW8vM9mMregJ4l95j5P4mbu.2');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705117, 'Dott. Martina Ferrucci', 'gmonteverdi@example.com', 1, 5, 100004, '3854022158', '8123033102', 'Strada Vittorio, 16
32036, Mas (BL)', 'Viale Piergiuseppe, 24
28813, Bee (VB)', '1998-12-08', '5809384147', 1, 2, '$2a$10$y4efBlHh8tYLXZuwC95whOmHspHmr7SQajwDnM7hh6NHTIiBKBz4i');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705103, 'Pietro Zeffirelli', 'zeffirelliarturo@example.net', 6, 5, 100004, '0375243087', '4356329673', 'Borgo Gianfranco, 13 Piano 8
24066, Pedrengo (BG)', 'Vicolo Durante, 177 Appartamento 97
07049, Usini (SS)', '1998-09-03', '4352420870', 1, 2, '$2a$10$FW4a3PagrNJeV7v9oTDGRe0Rs3CV14.QvW4kXPrejzjicW9/2kd3.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705046, 'Elena Ajello-Campano', 'lucio51@example.org', 5, 5, 100002, '+39 0574241030', '4169451900', 'Rotonda Vincentio, 699
38045, Seregnano (TN)', 'Rotonda Venancio, 46 Piano 1
26011, Casalbuttano (CR)', '1997-07-05', '5974284393', 1, 2, '$2a$10$yQKKzbI0WPFWtS7PRw.wfuohANFTg1hm3A7HvbtYj.QtfWO6hNole');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705051, 'Sig. Giampiero Vitturi', 'gottiettore@example.com', 4, 5, 100002, '+39 0773909431', '7570399790', 'Borgo Flaiano, 51 Piano 4
23875, Osnago (LC)', 'Contrada Iannucci, 63 Piano 1
67047, Rocca Di Cambio (AQ)', '1998-03-12', '2711712357', 1, 2, '$2a$10$/var/epvrXu2ZmAvsHAhVOHgM89TQDyZB1skImT5ID7szSECcC1G.');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705055, 'Flavio Filippelli', 'ilariamorgagni@example.com', 1, 5, 100002, '+39 03054956215', '6352598568', 'Stretto Fiamma, 19
32033, Arina (BL)', 'Strada Palmisano, 21 Piano 7
26825, Basiasco (LO)', '1998-11-16', '5327029970', 1, 2, '$2a$10$JgdPQd9IeHZInjpJ8LPnn.iI9nCT8Q3CumPWFwlfGa3zKpoLNHSwi');
INSERT INTO public.student (student_id, name, email, hall_id, dept_id, advisor_id, mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, nid_no, level, term, password) VALUES (1705070, 'Sig. Nanni Versace', 'marinettimario@example.net', 5, 5, 100003, '3515750547', '7150721300', 'Stretto Maria, 1
09126, Cala Mosca (CA)', 'Incrocio Bruno, 40 Appartamento 81
36055, Nove (VI)', '1999-03-08', '6781691922', 1, 2, '$2a$10$soxm4O0CRke3vHmKymlkUONLHAr8hKJTTQfkod5hQpcpgPTYJ98Ke');


--
-- Data for Name: student_seat_plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (2, 8, 1, 1, 'JULY 2022', 1705100);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (3, 8, 2, 1, 'JULY 2022', 1705101);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (4, 8, 3, 1, 'JULY 2022', 1705102);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (5, 8, 4, 1, 'JULY 2022', 1705103);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (6, 8, 5, 1, 'JULY 2022', 1705104);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (7, 8, 6, 1, 'JULY 2022', 1705105);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (8, 8, 7, 1, 'JULY 2022', 1705106);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (9, 8, 1, 2, 'JULY 2022', 1706001);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (10, 8, 2, 2, 'JULY 2022', 1706002);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (11, 8, 3, 2, 'JULY 2022', 1706003);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (12, 8, 4, 2, 'JULY 2022', 1706004);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (13, 8, 5, 2, 'JULY 2022', 1706005);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (14, 8, 6, 2, 'JULY 2022', 1706006);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (15, 8, 7, 2, 'JULY 2022', 1706007);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (16, 8, 1, 3, 'JULY 2022', 1705107);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (17, 8, 2, 3, 'JULY 2022', 1705108);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (18, 8, 3, 3, 'JULY 2022', 1705109);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (19, 8, 4, 3, 'JULY 2022', 1705110);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (20, 8, 5, 3, 'JULY 2022', 1705111);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (21, 8, 6, 3, 'JULY 2022', 1705112);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (22, 8, 7, 3, 'JULY 2022', 1705113);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (23, 8, 1, 4, 'JULY 2022', 1706008);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (24, 8, 2, 4, 'JULY 2022', 1706009);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (25, 8, 3, 4, 'JULY 2022', 1706010);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (26, 8, 4, 4, 'JULY 2022', 1706011);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (27, 8, 5, 4, 'JULY 2022', 1706012);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (28, 8, 6, 4, 'JULY 2022', 1706013);
INSERT INTO public.student_seat_plan (seat_plan_id, location_id, row_no, col_no, session_id, student_id) VALUES (29, 8, 7, 4, 'JULY 2022', 1706014);


--
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100003, 5, 'Nanni Ostinelli-Zamorani', 'ECE 431', '+39 043204936', '+39 0862253012', 'santinopanicucci@example.net', 'https://www.google.com/', '$2a$10$hJBNSAIfxxkfNcTpm4WK4u2cVD.N/MOA2maCE0dHvgPss8lEU22cy');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100004, 5, 'Federico Cociarelli', 'ECE 210', '+39 05869019016', '0324878076', 'bianca22@example.net', 'https://www.google.com/', '$2a$10$Ep7u2gAixggn97iw0s5bFeRCene11eWadL1sayM0YNwcmPsYiZdA2');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100006, 5, 'Sig.ra Licia Federico', 'ECE 167', '013160872', '+39 0963693755', 'agagliano@example.net', 'https://www.google.com/', '$2a$10$4GD.QaCCaY7Qz9346DQmR.yRksk5IoET9qN52Y7.Fed05FD1pD0/y');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100007, 5, 'Maurizio Ferrara', 'ECE 316', '081952060', '0545125467', 'gino99@example.com', 'https://www.google.com/', '$2a$10$qMyoixWz0zIGPU2mMFW.ge0mrRCBzK.R4bUBafFhad5Uzv/feh4cO');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100009, 5, 'Claudio Pacetti', 'ECE 220', '+39 0925942533', '0363863862', 'overcelloni@example.org', 'https://www.google.com/', '$2a$10$usFoRcg37X/QaJN9uHny5e7xefKsUFJWsLe0ZaT7tQ6Zq0uLOcB02');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100010, 5, 'Sig.ra Marina Petrucelli', 'ECE 377', '0732468678', '3245119076', 'fortunatagozzi@example.net', 'https://www.google.com/', '$2a$10$BXlNmfJFmttC2QIi32ng9O/mYQfI7j71.1VbAGC02i7xk3BjzdweG');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100011, 5, 'Arturo Mattarella', 'ECE 260', '3832753384', '0853556871', 'chinnicinatalia@example.com', 'https://www.google.com/', '$2a$10$MXuwqQNaI/Edp/hEFd5I5OYUmkruevCZ0HEkg3KbqP1p70/4aUSPu');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100013, 5, 'Achille Merisi', 'ECE 459', '+39 35115834922', '+39 043241265', 'liberto73@example.org', 'https://www.google.com/', '$2a$10$rDTeDhyVisM8LvbLx1eFm.mQdXrSlFuAk5N0BdXkXCLF0WcXXupNq');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100014, 5, 'Sylvia Panicucci', 'ECE 208', '0588196506', '34435217657', 'sommarugagiacobbe@example.org', 'https://www.google.com/', '$2a$10$85aY8nZd6fmxX2sRSFbDa.cgRpOXdX.3W/kI8VcsnxTYQK6ZwLfpm');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100016, 5, 'Sig.ra Paoletta Gualtieri', 'ECE 286', '+39 0372053053', '+39 3533162970', 'gianmarcofoa@example.net', 'https://www.google.com/', '$2a$10$4P9X6H0zxyIMURJSTG8GSe42pUV1VoSjGzu1mekhMvaTS7/z/aWKO');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100017, 5, 'Eugenia Cicala', 'ECE 458', '+39 0733994050', '0573811865', 'pucciolovato@example.com', 'https://www.google.com/', '$2a$10$rxUaFQvzmLv4NeWj9HCdxOzGu6o2y3b/tyHe22FN.8HDAZ/hTZwGO');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100019, 5, 'Sig. Gianpaolo Beccheria', 'ECE 129', '+39 3774907816', '33869752384', 'lara57@example.net', 'https://www.google.com/', '$2a$10$MJ.zgfMVtJ6wZsyd0zf4R.QWPMUG/WeqdtdWpUqo7f2LJzYbMbsJC');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100020, 5, 'Sig.ra Antonietta Sonnino', 'ECE 147', '+39 071827072', '+39 0552423213', 'bompianiermes@example.com', 'https://www.google.com/', '$2a$10$KV5rHCQKu6nyjKK3y2xt.OiwCWSuPznWLjcWA0XMk3IFpIux535ZS');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100022, 1, 'Martino Cerquiglini', 'ME 189', '0884410344', '3716243701', 'montecchifilippa@example.com', 'https://www.google.com/', '$2a$10$L8Etex1lI3G75krqPVkYj.zEgKSCy76wlpdzarPIaki8Jc/sebhB2');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100023, 1, 'Dott. Antonino Galuppi', 'ME 443', '35208640302', '09842728410', 'satrianibartolomeo@example.org', 'https://www.google.com/', '$2a$10$3e3f0J2k4XcCtWpGhSb2hOCkgos/ZD9qPbiva0xNMLmPLB.BUfgeG');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100024, 1, 'Vittoria Guarato', 'ME 161', '088333684', '+39 0124615942', 'pompeo09@example.net', 'https://www.google.com/', '$2a$10$0pdTA2MHCVxmyccBRDHSPuVpJ9Ddt3JGjvB02WmF4ytR9PaUWi.Fm');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100026, 1, 'Liliana Meucci', 'ME 469', '+39 0941733193', '+39 3272704947', 'dolores47@example.com', 'https://www.google.com/', '$2a$10$NrQ6TtGjdGw9X8DxIgrniu3Y5VXhkeg8jGpQeOQjrfD9ExeE1YL9i');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100027, 1, 'Paola Virgilio', 'ME 443', '33920682188', '0577621662', 'gianpietro37@example.net', 'https://www.google.com/', '$2a$10$tJIhROpbRNlu.1qo95SvquxqxFNhxcWSy2/whAe5tRNLgAADzFRfq');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100029, 1, 'Benito Mogherini', 'ME 125', '+39 3389290824', '+39 0424777339', 'paretogiulietta@example.org', 'https://www.google.com/', '$2a$10$jexnXm7A5yPkGCElAKGRseis5Z/S0d4S8uToZOG/vmkN6cQPp3IUC');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100030, 1, 'Fabia Zecchini', 'ME 169', '+39 3760733432', '+39 08748003268', 'ocuriel@example.com', 'https://www.google.com/', '$2a$10$qHMWtp/8Wmefon8PhQHT2.uKCGW2X3fle2UVlbz3jxpEok8lkePL.');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100032, 6, 'Mariano Chittolini-Poerio', 'ECE 285', '+39 01240660347', '01632713914', 'drubbia@example.com', 'https://www.google.com/', '$2a$10$YAcueC9VXX8u2PgYF9bIVOJ1nmfr.HJ3PAJTnR0k61wxv0hSLxMe.');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100033, 6, 'Adelasia Proietti', 'ECE 478', '+39 035289745', '3710842698', 'giorgio06@example.net', 'https://www.google.com/', '$2a$10$4Pj09MLWDJhVfJCUJd8Dk.YzBukf3SB0lefMYnopETTue.XjNOLYG');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100035, 6, 'Loredana Scarlatti', 'ECE 279', '38345068715', '+39 37781424498', 'adelmorenier@example.net', 'https://www.google.com/', '$2a$10$6WE2debkoLmp3AtEdxhrW.UgaKuxTMFjSVKkeNYOg6pU6DCmAN6Te');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100036, 6, 'Angelica Palladio', 'ECE 407', '052361924', '+39 0761027541', 'raimonditemistocle@example.com', 'https://www.google.com/', '$2a$10$KKwL8r.IhCQha6t3lhiQgeWIryo7BUvMAsL8oLcrltVfRUQFtIsYu');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100038, 6, 'Bianca Pareto', 'ECE 265', '3760931527', '3441305295', 'paretorenzo@example.net', 'https://www.google.com/', '$2a$10$W89PtkXF7VdAm.VsWT1YRePEmtYheT.r0Ig0YXu9dxK83uly8wSM6');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100039, 6, 'Dott. Adriano Salvini', 'ECE 423', '0306357628', '+39 370313371', 'melania23@example.org', 'https://www.google.com/', '$2a$10$ggIcFaVdMPYTttJw2KIZKOksqSWUqOWBtNgtBTkXR6ELqvIiHs3yO');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100041, 20, 'Dott. Victoria Cammarata', 'OAB 247', '+39 347748082', '0737249865', 'kgagliardi@example.net', 'https://www.google.com/', '$2a$10$k6XzfSuHG8ltQqbvWkkaBO9OHyd3QNN/J9h9j/RtK6phT164CJ8U6');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100042, 20, 'Raffaele Jacuzzi', 'OAB 113', '+39 0893539286', '+39 3756169175', 'jbramante@example.net', 'https://www.google.com/', '$2a$10$IdjT3EcqeAFDwzU107Ywk.lrF/.fU0es.Xj31yReoON1xgGBZ5yFa');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100044, 20, 'Michela Volterra', 'OAB 330', '0922029044', '+39 3239627141', 'xgucci@example.com', 'https://www.google.com/', '$2a$10$Dq8R4oq4Sl6Hs3.qk6BEB.G0m.nktAxUze7dGkyNXPjgrw0zz62iu');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100045, 20, 'Rosina Giacconi', 'OAB 465', '379294514', '+39 3686955050', 'ybonino@example.org', 'https://www.google.com/', '$2a$10$fSmuADtNP8.L3BjXq5ml.evc43VOdhIVjk0.D6iX/1SSH4ryR.gL6');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100047, 20, 'Mattia Celentano', 'OAB 342', '+39 031072446', '0185441066', 'chiaraiannuzzi@example.com', 'https://www.google.com/', '$2a$10$T68JoSw0Q6ufJj.DQz/HA.Jj3pvpWWFM8WtZWo8su3y/9ZzeScDJa');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100048, 20, 'Stefania Bertoni', 'OAB 332', '0574409339', '+39 0599777643', 'durante81@example.net', 'https://www.google.com/', '$2a$10$XGNrfQ08EjfHNucFCmHvgu3D/poNRGd7l6FM.cxbDiD9oLF6e5A4i');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100050, 20, 'Tonino Lombroso-Maderna', 'OAB 492', '0434295960', '+39 379318827', 'kcavanna@example.net', 'https://www.google.com/', '$2a$10$8nzyK/V5TMq09sACWeinA.GkGRaGKHfQN3KWA8xOfBUf7MEqG1Gwe');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100051, 21, 'Ilaria Camicione', 'OAB 177', '377312955', '0445571553', 'fbaresi@example.com', 'https://www.google.com/', '$2a$10$y5eLnZuZakDyFibugASIA.fwz2vD9Z/9sYmgpxQzz2MB50yZn2l5e');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100052, 21, 'Serena Cristoforetti', 'OAB 208', '+39 03117084677', '081663486', 'gioffreughi@example.org', 'https://www.google.com/', '$2a$10$5WZYDbHiEwZVcF/BPisouu3E8NCKFxHaGCEsmK1JbRVsg6c3dzTDa');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100054, 21, 'Nico Tasso-Borrani', 'OAB 124', '+39 03428174930', '+39 37010266922', 'angelomercadante@example.net', 'https://www.google.com/', '$2a$10$OeFgvz0mY9H6ozXGwixBOOL08zr41o4a3Awrc3X0wfxYYC8.6D0d6');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100055, 21, 'Dott. Stefania Gasperi', 'OAB 330', '05771642671', '0932065546', 'fabrizioguariento@example.org', 'https://www.google.com/', '$2a$10$PKsMZIYAvNQtmqh903MEb.2epc0L5I93Pw.0V/AxqDzyspzJ3uJje');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100001, 5, 'Federica Vivaldi', 'ECE 287', '04245080505', '+39 080646380', 'silvia48@example.com', 'https://www.google.com/', '$2a$10$7DzTi5r2Lh0sU3XBneTH/OskNXNHKFmO1sjDo6fvCpvsLv9oQoW/S');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100058, 21, 'Adelasia Trupiano-Zamengo', 'OAB 196', '038254172', '+39 0506553317', 'xbettoni@example.com', 'https://www.google.com/', '$2a$10$9Rmvrsdai7yA19sYHYTpFu0IsESgJJXeW5SCgzdKtv.LmVO1fGwL.');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100059, 21, 'Angelo Angiolello', 'OAB 418', '373207599', '+39 0372621920', 'umbertotrussardi@example.com', 'https://www.google.com/', '$2a$10$porMUNMwWhvVE1tQ7x6GOewCEYVDnkKG5OvBWI4TBPM08lsM//./O');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100060, 21, 'Elena Babato', 'OAB 194', '+39 3222262911', '0432436610', 'pasqualefornaciari@example.net', 'https://www.google.com/', '$2a$10$Qe2zQA3gjbHtjyhcRTQXWux8ZPR/o84OH3JKt.3QIoxIzsTCovSvW');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100061, 22, 'Fiamma Staglieno-Cainero', 'OAB 323', '+39 077131372', '+39 04211663779', 'rtommaseo@example.org', 'https://www.google.com/', '$2a$10$6XLA8YgkanVnZpwjFqjtI.68Vym10/5gnK3kWttIllKL4ofA5ZAsi');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100062, 22, 'Lidia Carnera', 'OAB 423', '3701477415', '073617560', 'benvenuto22@example.net', 'https://www.google.com/', '$2a$10$oN7MrmFLhZZxmWT4eFb/b.pzL5VcWUPgtrBEM438d6SjAJLo2ViIm');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100063, 22, 'Dott. Cesare Vecellio', 'OAB 418', '+39 3757740104', '351613516', 'antoninivictoria@example.org', 'https://www.google.com/', '$2a$10$exJLys4/qFtV97Mv5gh/TOxQLnwkFrVPdIh21LXEpqB4sAqt1UEIS');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100064, 22, 'Alessia Cavanna-Maderno', 'OAB 373', '37564806533', '095002399', 'angelinaferretti@example.com', 'https://www.google.com/', '$2a$10$IHp/n1ueMJkkiVjUyal7leOYM0cj3hcOfKSzI/IjRfcKo0wJgKwnS');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100065, 22, 'Serafina Agostinelli', 'OAB 128', '+39 350127068', '+39 0356336005', 'lombarditorquato@example.net', 'https://www.google.com/', '$2a$10$irbJdeBfANLlRbuFG95XP./6DBDsGC0WhTjMsRAV7U7WJNAm17SL.');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100066, 22, 'Gioacchino Stradivari', 'OAB 400', '0322853891', '+39 3482736839', 'sollimasergius@example.com', 'https://www.google.com/', '$2a$10$UZrmQ1XP8qamtHMe9da1AuSEYe6A5xNOL7hrkHFiXmYIdVrdeY3JW');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100067, 22, 'Etta Borgia-Strangio', 'OAB 207', '03240500985', '086522623', 'bottiglieroninetta@example.org', 'https://www.google.com/', '$2a$10$vjw6sonkY40CHkzfyNNQEO/tjsoejPdDCBYuU1ouBet7AZpVWtfb.');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100068, 22, 'Sig. Guglielmo Botta', 'OAB 241', '+39 087492925', '+39 073590002', 'franco51@example.org', 'https://www.google.com/', '$2a$10$r542jGM7G7Ee2u97B23Ude1AWwobEttnWzvES5ZGyeV9MY5pkb3re');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100069, 22, 'Gianni Tomasini', 'OAB 253', '+39 057559878', '051093529', 'ntrentini@example.net', 'https://www.google.com/', '$2a$10$onU.e4n3.D8pXNScBro3W.rFQgjx63G389WSVnfIjLLuI7LhbY4fW');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100070, 22, 'Ottone Ligorio', 'OAB 214', '+39 0187606310', '371454897', 'vpanicucci@example.net', 'https://www.google.com/', '$2a$10$s/qCi9jTaUWw7nNsD4ti5.5nVVCdrmCXnFaULYrMfwFadbrYessCG');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100072, 23, 'Marissa Cainero', 'OAB 347', '015718819', '+39 375632292', 'zbertoni@example.net', 'https://www.google.com/', '$2a$10$tO5Aw4L0fs8V0gOZq6TgF.nURnBDFam4tNgFoYy8HMycjpPencv3G');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100073, 23, 'Geronimo Prada', 'OAB 477', '0183523350', '+39 3686064332', 'emmacaetani@example.org', 'https://www.google.com/', '$2a$10$4v4eGDest6VkPzLNoyhXmuk4yrlljD2yeqRldY8LV.f8z4m408xZy');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100074, 23, 'Sole Farina', 'OAB 178', '+39 0114039021', '+39 0544618594', 'opedersoli@example.org', 'https://www.google.com/', '$2a$10$.VLcQDPOUathT7HuxabdSekOETZu7pHqCRHotm1Aw26my.SKg26IK');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100076, 23, 'Olga Coppola-Cammarata', 'OAB 255', '043485571', '0597562205', 'alfredo83@example.org', 'https://www.google.com/', '$2a$10$jbhbbMagGUsbm2R9UPd37OquRq9YF1LtGW6XtfDxWwwJkko70zOAW');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100077, 23, 'Rosa Sollima', 'OAB 325', '3734188817', '+39 047182502', 'efaggiani@example.net', 'https://www.google.com/', '$2a$10$femXtt.DkGKVa1eDPTpsU.WkaV3AuKHQgnxLO89s9WtBQ3FGIow02');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100079, 23, 'Oreste Moneta-Galvani', 'OAB 497', '3813787830', '0984508753', 'rmunari@example.org', 'https://www.google.com/', '$2a$10$Y.qVtKWrQMm0pn2EqKGrmuRaqnNzbQE92c9G/krVHEnxvjMnrIN7C');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100000, 5, 'Dott. Rosa Cainero', 'ECE 228', '+39 0544072616', '35132605492', 'xcundari@example.net', 'https://www.google.com/', '$2a$10$tWp3fS0a2o/nv6YSqaqaKO85ujcWbYHozynIQX9lLcrQXD./UnANm');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100002, 5, 'Sig.ra Emma Bodoni', 'ECE 408', '34337921203', '042966253', 'mgramsci@example.net', 'https://www.google.com/', '$2a$10$gIzDiGMHxgkL/lhMP1RtqOJty68rt.bS6fPKko9xYAR7g2MWZ4LGC');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100005, 5, 'Nina Gaito', 'ECE 262', '373647605', '3311576535', 'chinnicivictoria@example.net', 'https://www.google.com/', '$2a$10$kdtcUpnBtxfdwwKh.Gsj9eckkssgwMvzBVig6btuOIMQGKeche5ki');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100008, 5, 'Graziella Ajello', 'ECE 426', '+39 3226991568', '+39 08243415763', 'wnotarbartolo@example.org', 'https://www.google.com/', '$2a$10$.3j9phxUWCdbYRV//KQeeO8mg5qxQrwILCrk.0qrHtnjBY6iVk5G6');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100015, 5, 'Sig.ra Gemma Trillini', 'ECE 225', '328424952', '+39 346317007', 'ocastellitto@example.net', 'https://www.google.com/', '$2a$10$TsiaLitsYvhsvQYfNMbUY.yeGbkaO0busbSyVrq1J.Yj8FeJuSL4u');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100018, 5, 'Antonia Sagnelli', 'ECE 119', '+39 0362509906', '37764248772', 'gioffrenapolitano@example.org', 'https://www.google.com/', '$2a$10$49e9a9hN92W2YjhrQL34EuvjqI965fh.nK6L.eGFQVz2JmmbN2WWG');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100021, 1, 'Rosina Littizzetto-Morellato', 'ME 229', '042931771', '+39 016524003', 'giancarlo65@example.org', 'https://www.google.com/', '$2a$10$w4VqhVqN4BI1gFqa5ZYuXunaZrksxHy15Z9EnxLeDJHtHiwiUhwGa');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100025, 1, 'Pasquale Faranda', 'ME 192', '3773791000', '0974554133', 'umbertolucarelli@example.net', 'https://www.google.com/', '$2a$10$1E2p0L8hIYojsS77Z7na9OxiD/Me96GKnultbVq74XwHx/lxBVZZG');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100028, 1, 'Goffredo Leoncavallo', 'ME 106', '+39 35163714298', '+39 07371569121', 'donatella77@example.net', 'https://www.google.com/', '$2a$10$mR5FLnhRoODi.JFatubu8ucQeghLY1lw2esjiGfZfAzFjEe4xwa0u');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100031, 6, 'Isabella Baroffio', 'ECE 383', '+39 0461995547', '0504092796', 'fedele65@example.net', 'https://www.google.com/', '$2a$10$a7V9djzn/nNLNNrKiWqX/uwFMmAj5Ff25d0e/xiZNpFIov/fH5T3W');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100034, 6, 'Flavia Filzi', 'ECE 207', '3377193300', '3773074042', 'pragalodovico@example.com', 'https://www.google.com/', '$2a$10$WMVAj9a4ibg0tSCqMHvFxuGG/9NLNIufKD4P.W/xYn5I72IPmLX1K');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100037, 6, 'Pier Goldoni-Pizzamano', 'ECE 226', '+39 0171767517', '3817846099', 'bassiignazio@example.net', 'https://www.google.com/', '$2a$10$iZEOeLqr6z3CqStScNu5Te247JgPBsYuczbGanHnwyTjsBYxhskA6');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100040, 6, 'Lilla Dellucci', 'ECE 341', '0823870581', '3311596893', 'solerinaldi@example.net', 'https://www.google.com/', '$2a$10$4t2pR5fpDyh.EOpFF6Y9muYtEpw5u5HCDHU9AYFm36GbYoFmaT2.a');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100043, 20, 'Antonella Scotti', 'OAB 453', '345583074', '+39 0416926756', 'ferruccinicoletta@example.com', 'https://www.google.com/', '$2a$10$NORBTPmABFeyNtFRQdaPZ.J56zYhLs.8uEY4r4Tt4LhW19phMG2AW');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100046, 20, 'Romina Nonis', 'OAB 278', '343139620', '+39 072169937', 'elladiocaironi@example.com', 'https://www.google.com/', '$2a$10$D63L0KLA2wmA8DA0U/v3C.CKTLsge/M2yLjFl0mvzd8aob3yWy36G');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100049, 20, 'Dott. Stella Squarcione', 'OAB 417', '0371693704', '04810545817', 'pomponioanichini@example.com', 'https://www.google.com/', '$2a$10$QFcB9N8scZcdWJjvi9yyK.bkPA6M8iORlz25n9dBiHr1608qHACli');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100053, 21, 'Dott. Sole Gregorio', 'OAB 252', '+39 0113696097', '+39 05883715259', 'ceschigiulio@example.com', 'https://www.google.com/', '$2a$10$r2/lh2DUWwm3IOyRSx/KIe48qOAprWBY26DtAXjjL41j4OTZqoAoy');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100056, 21, 'Rosario Piane', 'OAB 474', '0429286923', '+39 34755692774', 'fcarocci@example.net', 'https://www.google.com/', '$2a$10$ewLRK15htZ8sgb9nQmpYQ.JkExQozPTWTc930JRNU08OLFOrD2huW');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100057, 21, 'Dott. Ettore Polizzi', 'OAB 276', '+39 3779255244', '05415342336', 'alfredovarano@example.org', 'https://www.google.com/', '$2a$10$MRatw/ygYS9ptKykeInMQupauutkpUcOi5QDok4znXEtF5ubb04Fa');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100012, 5, 'Gianmarco Mortati', 'ECE 403', '3973053126', '+39 37014210335', 'leonettigionata@example.com', 'https://www.google.com/', '$2a$10$bT0nQZB7x/Ekf9oPpGl9YO.n1tupzuhFFEA6lQx3ZZnoDj843GB5m');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100071, 23, 'Pier Scarpa-Amaldi', 'OAB 320', '+39 0541183488', '+39 3976439330', 'annibale14@example.com', 'https://www.google.com/', '$2a$10$7wfFiYdNpRkMoQ3kvbHGf.uHengMpE2AF.L0ByroEMFX9rrPobdza');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100075, 23, 'Bartolomeo Castiglione', 'OAB 141', '3208003351', '+39 351444477', 'gian76@example.net', 'https://www.google.com/', '$2a$10$lxJ51GNbfQAbbTRjwWp2eOfjxE9KBxZvTUKADJJ4KG0dXzR4M7eSi');
INSERT INTO public.teacher (teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link, password) VALUES (100078, 23, 'Zaira Contrafatto', 'OAB 372', '3730028990', '3519454954', 'mazzocchiiolanda@example.com', 'https://www.google.com/', '$2a$10$n9QC/yYg4Uoj.eu.MIP3guujo9n7/SM.r6QRRQquzv4bLkNSgHuoW');


--
-- Name: comptroller admin_comptroller_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."comptroller admin_comptroller_admin_id_seq"', 1, false);


--
-- Name: course offering_offering_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."course offering_offering_id_seq"', 56, true);


--
-- Name: department admin_dept_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."department admin_dept_admin_id_seq"', 300000, false);


--
-- Name: dues type_dues type id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."dues type_dues type id_seq"', 4, true);


--
-- Name: dues_dues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dues_dues_id_seq', 5, true);


--
-- Name: exam time_exam_slot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."exam time_exam_slot_id_seq"', 19, true);


--
-- Name: exam_guidelines_guideline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exam_guidelines_guideline_id_seq', 3, true);


--
-- Name: feedback_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_feedback_id_seq', 16, true);


--
-- Name: grade distribution policy_gd_policy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."grade distribution policy_gd_policy_id_seq"', 1, false);


--
-- Name: hall admin_hall_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."hall admin_hall_admin_id_seq"', 200001, true);


--
-- Name: location_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.location_location_id_seq', 10, true);


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

SELECT pg_catalog.setval('public."office admin_office_admin_id_seq"', 400000, false);


--
-- Name: registration request_reg_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."registration request_reg_request_id_seq"', 62, true);


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

SELECT pg_catalog.setval('public.student_seat_plan_seat_plan_id_seq', 29, true);


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
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (dept_id);


--
-- Name: dues type dues type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."dues type"
    ADD CONSTRAINT "dues type_pkey" PRIMARY KEY ("dues_type_id");


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
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (feedback_id);


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

