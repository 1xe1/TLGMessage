import React from 'react'

const Chanel = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // ข้อมูล mock สำหรับค้นหา
  const mockGroups = [
    { id_group: "-10001201", namegroup: "Group A" },
    { id_group: "-10001202", namegroup: "Group B" },
  ]

  // ข้อมูลจาก database (ตัวอย่าง)
  const databaseGroups = [
    { id_group: "-10001201", namegroup: "Group A" },
  ]

  // ฟังก์ชันสำหรับการค้นหา
  const filteredGroups = mockGroups.filter(group =>
    group.id_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.namegroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันเพิ่มกลุ่มไปยังฐานข้อมูล
  const handleAddGroup = (group) => {
    // TODO: เพิ่มการเรียก API เพื่อบันทึกข้อมูลลงฐานข้อมูล
    console.log("Adding group to database:", group);
  };

  return (
    <div className="w-full flex gap-4 p-4">
      <div className="w-1/2 bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold mb-4">ค้นหากลุ่ม</h2>
        <input
          type="text"
          placeholder="ค้นหาด้วย ID หรือชื่อกลุ่ม"
          className="w-full p-2 mb-4 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Group ID</th>
              <th className="px-4 py-2 text-left">Group Name</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((group) => (
              <tr key={group.id_group} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{group.id_group}</td>
                <td className="px-4 py-2">{group.namegroup}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleAddGroup(group)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    เพิ่ม
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-1/2 bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold mb-4">กลุ่มในฐานข้อมูล</h2>
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Group ID</th>
              <th className="px-4 py-2 text-left">Group Name</th>
            </tr>
          </thead>
          <tbody>
            {databaseGroups.map((group) => (
              <tr key={group.id_group} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{group.id_group}</td>
                <td className="px-4 py-2">{group.namegroup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Chanel