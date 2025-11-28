# Block_Chain_Project_gymattendance_Flare_Risein
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GymAttendance {

    struct Attendance {
        address user;
        uint256 time;
    }

    Attendance[] public records;

    // Event to log attendance
    event CheckedIn(address user, uint time);

    // Function to mark attendance
    function checkIn() public {
        records.push(Attendance(msg.sender, block.timestamp));
        emit CheckedIn(msg.sender, block.timestamp);
    }

    // Get total attendance count
    function getTotalRecords() public view returns (uint) {
        return records.length;
    }

    // Get a specific attendance record
    function getRecord(uint index) public view returns (address, uint) {
        require(index < records.length, "Invalid index");
        Attendance memory record = records[index];
        return (record.user, record.time);
    }
}
