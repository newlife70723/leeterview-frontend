import { useState } from "react";

export default function TestAPI() {
  const [data, setData] = useState<string>("Loading...");

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weatherforecast`);
      const result = await res.json();
      setData(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("API Error:", error);
      setData("Error fetching data");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>API 測試頁面</h1>
      <button onClick={fetchData}>獲取後端資料</button>
      <pre>{data}</pre>
    </div>
  );
}
