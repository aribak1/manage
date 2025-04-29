import React, { useEffect, useState } from "react";
import supabase from "../utils/Supabase";

const Clients = () => {
  const [clients, setclients] = useState([]);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");

  async function handlesubmit(e) {
    e.preventDefault();
    if (!name || !email) {
      alert("kindly fill the inputs");
      return;
    }

    const { error } = await supabase
      .from("clients")
      .insert([{ name: name, email: email }]);
    if (error) {
      alert(error.message);
      return;
    } else {
      setname("");
      setemail("");
      alert("client added successfully");
    }
    fetchclients(); //automatically refreh and show
  }

  function names(e) {
    setname(e.target.value);
  }
  function emails(e) {
    setemail(e.target.value);
  }
  useEffect(() => {
    fetchclients(); //new data update whenever refresh
  }, []);
  async function fetchclients() {
    const { data, error } = await supabase.from("clients").select("*");
    if (error) {
      alert(error.message);
      return;
    } else {
      setclients(data);
    }
  }

  return (
    <div>
      <h1>My Clients</h1>
      <ul>
        {clients.map((allele) => (
          <li key={allele.id}>
            {allele.name} - {allele.email}
          </li>
        ))}
      </ul>
      <h1>add client</h1>
      <form action="">
        <input
          type="text"
          placeholder="client name"
          value={name}
          onChange={names}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={emails}
        />
        <button onClick={handlesubmit}>ADD</button>
      </form>
    </div>
  );
};

export default Clients;
