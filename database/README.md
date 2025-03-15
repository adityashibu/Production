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

   
