import React, { useEffect, useState } from "react";
import supabase from "../utils/Supabase";
import { handleclientediting } from "../backend/Curd";

const Clients = () => {
  const [clients, setclients] = useState([]);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [editingid, seteditingid] = useState(null);

  function handleediting(client) {
    setname(client.name);
    setemail(client.email);
    seteditingid(client.id);
  }
  async function handlesubmit(e) {
    e.preventDefault();
    if (!name || !email) {
      alert("kindly fill the inputs");
      return;
    }
    if (editingid) {
      ///if editing id is null, else will run updating a client
      const { error } = await supabase
        .from("clients")
        .update([{ name: name, email: email }])
        .eq("id", editingid);
      if (error) {
        alert(error.message);
        return;
      } else {
        seteditingid(null);
      }
      setname("");
      setemail("");
      alert("client Updated successfully");
    } else {
      ///inserting new clients
      const { error } = await supabase
        .from("clients")
        .insert([{ name: name, email: email }]); //new client adding
      if (error) {
        alert(error.message);
        return;
      } else {
        setname("");
        setemail("");
        alert("client added successfully");
      }
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
  //delete

  async function handledelete(id) {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    } else {
      alert("client has been deleted successfully");
    }
    fetchclients();
  }
  return (
    <div>
      <h1>My Clients</h1>
      <ul>
        {clients.map((allele) => (
          <li key={allele.id}>
            {allele.name} - {allele.email}
            <button
              onClick={() => {
                handledelete(allele.id);
              }}
            >
              Delete
            </button>
            <button
              onClick={() => {
                handleediting(allele);
              }}
            >
              Update
            </button>
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
        <button onClick={handlesubmit}>{editingid ? "Update" : "ADD"}</button>
      </form>
    </div>
  );
};

export default Clients;
