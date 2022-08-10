import numpy as np
import pandas as pd
from faker import Faker
import random
from datetime import datetime

columns = ["teacher_id", "dept_id", "name", "room_no", "office_phone", "cell_phone", "email", "link"]

data = []

fake = Faker('it_IT')
for id in range(10000, 10080):
    if id>=10000 and id<=10020:
        dept_id = 5
        building = "ECE"
    elif id>=10020 and id<=10030:
        dept_id = 1
        building = "ME"
    elif id>=10030 and id<=10040:
        dept_id = 6
        building = "ECE"
    elif id>=10040 and id<=10050:
        dept_id = 20
        building = "OAB"
    elif id>=10050 and id<=10060:
        dept_id = 21
        building = "OAB"
    elif id>=10060 and id<=10070:
        dept_id = 22
        building = "OAB"
    elif id>=10070 and id<=10080:
        dept_id = 23
        building = "OAB"

    row = [id, dept_id, fake.name(), building+" "+str(random.randint(100,500)), 
           fake.phone_number(), fake.phone_number(), fake.email(), "https://www.google.com/"]
    data.append(row)

df = pd.DataFrame(columns=columns, data=data)

df.to_csv('teachers.csv', index=False)