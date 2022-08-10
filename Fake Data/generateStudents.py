import numpy as np
import pandas as pd
from faker import Faker
import random
from datetime import datetime

columns = ["student_id","name","email","hall_id","dept_id","advisor_id","mobile_no",
           "bank_acc_no","present_address","contact_person_address","date_of_birth",
           "nid_no","level","term"]

data = []

fake = Faker('it_IT')
for id in range(1706001, 1706181):
    if id>=1706001 and id<=1706030:
        advisor_id = 10030+0
    elif id>=1706031 and id<=1706060:
        advisor_id = 10030+1
    elif id>=1706061 and id<=1706090:
        advisor_id = 10030+2
    elif id>=1706091 and id<=1706120:
        advisor_id = 10030+3
    elif id>=1706121 and id<=1706150:
        advisor_id = 10030+4
    elif id>=1706151 and id<=1706180:
        advisor_id = 10030+5
    row = [id, fake.name(), fake.email(), random.randint(1,7), 6, advisor_id, fake.phone_number(),
           random.randint(1000000000,9999999999), fake.address(), fake.address(), 
           fake.date_between_dates(date_start=datetime(1997,1,1), date_end=datetime(2000,1,1)),
           random.randint(1000000000,9999999999), 1,2]
    data.append(row)

df = pd.DataFrame(columns=columns, data=data)

df.to_csv('students.csv', index=False)