# import pytest
# from unittest.mock import patch, mock_open, call
# import sys
# import os

# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# import devices_json

# @patch("devices_json.open", new_callable=mock_open, read_data='{"smart_home_devices": []}')
# def test_loadJSON(mock_file):
#     data = devices_json.loadJSON()
#     assert data == {"smart_home_devices": []}
#     mock_file.assert_called_once_with("devices.json", "r")

# @patch("devices_json.open", new_callable=mock_open)
# def test_saveJSON(mock_file):
#     data = {"smart_home_devices": []}
#     devices_json.saveJSON(data)
#     mock_file.assert_called_once_with("devices.json", "w")
#     expected_calls = [
#         call('{'),
#         call('\n  '),
#         call('"smart_home_devices"'),
#         call(': '),
#         call('[]'),
#         call('\n'),
#         call('}')
#     ]
#     mock_file().write.assert_has_calls(expected_calls, any_order=False)

# def test_randomizeDevice():
#     device = {"status": "on", "power_rating": 100, "uptime": 0}
#     devices_json.randomizeDevice(device)
#     assert device["uptime"] == 1
#     assert "power_usage" in device

# @patch("devices_json.loadJSON", return_value={"smart_home_devices": [{"id": 1, "name": "Device1", "timer": 0}]})
# @patch("devices_json.saveJSON")
# def test_setTimer(mock_save, mock_load):
#     result = devices_json.setTimer(1, 10)
#     assert result == {"success": "Set timer for Device1 to 10 seconds"}
#     mock_save.assert_called_once()

# @patch("devices_json.loadJSON", return_value={"smart_home_devices": [{"id": 1, "name": "Device1", "status": "on"}]})
# @patch("devices_json.saveJSON")
# def test_changeDeviceStatus(mock_save, mock_load):
#     result = devices_json.changeDeviceStatus(1)
#     assert result == {"success": "Changed Device1 status to off."}
#     mock_save.assert_called_once()

# @patch("devices_json.loadJSON", return_value={"smart_home_devices": [{"id": 1, "name": "Device1", "power_usage": 50}]})
# def test_sumPower(mock_load):
#     result = devices_json.sumPower()
#     assert result == 50

# @patch("devices_json.loadJSON", return_value={"smart_home_devices": [{"id": 1, "name": "Device1", "power_rating": 100}]})
# def test_sumRating(mock_load):
#     result = devices_json.sumRating()
#     assert result == 100

# @pytest.mark.asyncio
# @patch("devices_json.loadJSON", return_value={"smart_home_devices": [{"id": 1, "name": "Device1", "connection_status": "connected"}]})
# @patch("devices_json.saveJSON")
# async def test_deleteDevices(mock_save, mock_load):
#     result = await devices_json.changeConnection(1)
#     assert result == {"success": "Disconnected Device1."}
#     mock_save.assert_called_once()

# @pytest.mark.asyncio
# @patch("devices_json.loadJSON", return_value={"smart_home_devices": [{"id": 1, "name": "Device1", "connection_status": "not_connected"}]})
# @patch("devices_json.saveJSON")
# async def test_deleteDevices_reconnect(mock_save, mock_load):
#     result = await devices_json.changeConnection(1)
#     assert result == {"success": "Connected Device1."}
#     mock_save.assert_called_once()

# @patch("devices_json.loadJSON", return_value={"smart_home_devices": [{"id": 1, "name": "Device1", "connection_status": "connected"}]})
# def test_getUpdates(mock_load):
#     devices_json.updates = ["Message 1", "Message 2"]
#     result = devices_json.getUpdates()
#     assert result == ["Message 1", "Message 2"]
#     assert devices_json.updates == []