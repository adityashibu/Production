# Database

## Database Design:

- Tables

    1. **Profile:**
        - allocated_devices (reference) (FK)
        - user_id (int) (PK)
        - user_name (string)
        - user_password (string)
        - user_role (string)
  
    2. **Device:**
        - id (int) (PK)
        - ip (string)
        - name (string)
 
    3. **Automation:**
        - device_ids (reference) (FK)
        - id (int) (PK)
        - name (string)
        - status (string)
        - triggers (string)
      
    4. **DeviceGroup:**
        - devices (reference) (FK)
        - user-group_id (string) (PK)
        - name (string)
        - status (string)
        - user (reference) (FK)

    5. **DailyEnergy:**
        - id (int) (PK)
        - power_usage (int)
        - timestamp (timestamp)

    6.  **MonthlyEnergy:**
        - id (int) (PK)
        - power_usage (int)
        - timestamp (timestamp)

    7. **EnergyGoal:**
        - id (int) (PK)
        - goal_value (int)
   
