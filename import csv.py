import csv
import random
from datetime import datetime, timedelta

# Define constants
types = ["CARD_PAYMENT", "TOPUP", "TRANSFER"]
products = ["Current"]
descriptions = ["Payment for goods", "Top-up from card", "Transfer to another account"]
currencies = ["EUR"]
states = ["COMPLETED"]

# Function to generate random date
def random_date(start, end):
    return start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())),
    )

# Generate random data
data = []
start_date = datetime(2024, 1, 1)
end_date = datetime(2024, 12, 31)

for _ in range(200):  # Generate 20 rows
    type_ = random.choice(types)
    product = random.choice(products)
    started_date = random_date(start_date, end_date)
    completed_date = started_date  # Assuming completed date is the same as started date
    description = random.choice(descriptions)
    amount = round(random.uniform(50.0, 150.0), 2)
    fee = 0.0
    currency = random.choice(currencies)
    state = random.choice(states)
    balance = round(random.uniform(10.0, 200.0), 2)
    
    data.append([
        type_, product, started_date.strftime("%Y-%m-%d %H:%M:%S"), 
        completed_date.strftime("%Y-%m-%d %H:%M:%S"), description, 
        amount, fee, currency, state, balance
    ])

# Write to CSV
with open('finance.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Type", "Product", "Started Date", "Completed Date", "Description", "Amount", "Fee", "Currency", "State", "Balance"])
    writer.writerows(data)