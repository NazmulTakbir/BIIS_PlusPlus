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
for id in range(1701001, 1701181):
    if id>=1701001 and id<=1701030:
        advisor_id = 10020+0
    elif id>=1701031 and id<=1701060:
        advisor_id = 10020+1
    elif id>=1701061 and id<=1701090:
        advisor_id = 10020+2
    elif id>=1701091 and id<=1701120:
        advisor_id = 10020+3
    elif id>=1701121 and id<=1701150:
        advisor_id = 10020+4
    elif id>=1701151 and id<=1701180:
        advisor_id = 10020+5
    row = [id, fake.name(), fake.email(), random.randint(1,7), 1, advisor_id, fake.phone_number(),
           random.randint(1000000000,9999999999), fake.address(), fake.address(), 
           fake.date_between_dates(date_start=datetime(1997,1,1), date_end=datetime(2000,1,1)),
           random.randint(1000000000,9999999999), 1,2]
    data.append(row)

df = pd.DataFrame(columns=columns, data=data)

df.to_csv('students.csv', index=False)