# Database

## Database Design:

- Tables

    1. **Profile:**
        - allocated_devices (array of references to Device collection)
        - user_id (ID)
        - user_name (string)
        - user_password (string)
        - user_role (string)
  
    2. **Device:**
        - id (ID)
        - ip (string)
        - name (string)
 
    3. **Automation:**
        - device_ids (array of references to Device collection)
        - id (ID)
        - name (string)
        - status (string)
        - triggers (string)

      
- Tentative tables

    4. **Device Energy per day:**
        - ID (PK)
        - Device (FK)
        - Date
    5. **Automation Schedule:**
        - ID (PK)
        - Action
            - Device (FK)
            - Status 
        - Condition (Optional Field)
            - Device (FK)
            - Time
    6. **Energy Goal:**
        - ID (PK)
        - startDate 
        - endDate 
        - Goal Energy
    7. **Energy Achievement:**
        - ID (PK)
        - Badge Name
       
