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
        - id (int) (PK)
        - name (string)
        - status (string)
        - user (reference) (FK)


      
- Tentative tables

    4. **Device Energy per day:**
        - ID (int) (PK)
        - Device (FK)
        - Date
 
    6. **Energy Goal:**
        - ID (int) (PK)
        - Energy Goal (int)
    7. **DeviceGroup:**
        - devices (reference) (FK)
        - id (int) (PK)
        - name (string)
        - status (string)
        - user (reference) (FK)

