import { useState } from "react";

type Student = {
  id: number;
  first_name: string;
  last_name: string;
  age: string;
};

type Props = {
  students: Student[];
};

export default function Home({ students }: Props) {
  const [form, setForm] = useState({ first_name: "", last_name: "", age: "" });
  const [list, setList] = useState<Student[]>(students);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("https://citiedgecollege.co.uk/db-test?action=add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY as string
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        alert("✅ Student added!");
        // Add new student to local state without full reload
        setList([{ id: data.id, ...form }, ...list]);
        setForm({ first_name: "", last_name: "", age: "" });
      } else {
        alert("❌ Error: " + (data.error || "Unknown issue"));
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("❌ Failed to connect to API");
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Verdana" }}>
      <h2>📚 Student Records</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <button type="submit">Add Student</button>
      </form>

      <ul>
        {Array.isArray(list) && list.length > 0 ? (
          list.map((s) => (
            <li key={s.id}>
              {s.first_name} {s.last_name}, Age: {s.age}
            </li>
          ))
        ) : (
          <li>No students found</li>
        )}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch("https://citiedgecollege.co.uk/db-test.php?action=get", {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY as string
      }
    });
    const data = await res.json();
    const students: Student[] = Array.isArray(data) ? data : [];
    return { props: { students } };
  } catch (err) {
    console.error("Failed to fetch students:", err);
    return { props: { students: [] } };
  }
}
