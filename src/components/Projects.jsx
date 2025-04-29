import React, { useEffect, useState } from "react";
import supabase from "../utils/Supabase";

const Projects = () => {
  const [project, setproject] = useState([]);
  const [title, settitle] = useState("");
  const [desc, setdesc] = useState("");
  const [clientid, setclientid] = useState("");
  const [clients, setclients] = useState([]);
  //client id option
  function clientsid(e) {
    setclientid(e.target.value);
  }
  async function handlesubmit(e) {
    e.preventDefault();
    if (!title || !desc) {
      alert("fill the inputs");
      return;
    }

    const { error } = await supabase
      .from("projects")
      .insert([{ title: title, description: desc, client_id: clientid }]);
    if (error) {
      alert(error.message);
      return;
    } else {
      settitle("");
      setdesc("");
      alert("Successfully Submit");
    }
    fetchproject();
  }
  async function fetchclients() {
    const { data, error } = await supabase.from("clients").select("*");
    if (error) {
      alert(error.message);
      return;
    } else {
      setclients(data);
    }
  }
  function titles(e) {
    settitle(e.target.value);
  }
  function description(e) {
    setdesc(e.target.value);
  }
  useEffect(() => {
    fetchproject();
    fetchclients();
  }, []);
  async function fetchproject() {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      alert(error.message);
      return;
    } else {
      setproject(data);
    }
  }
  return (
    <div>
      <h2> Projects</h2>
      <ul>
        {project.map((allele) => (
          <li key={allele.id}>
            {allele.title}- {allele.description} - {allele.status}
          </li>
        ))}
      </ul>
      <h1>add projects</h1>
      <form action="">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={titles}
        />
        <input
          type="text"
          placeholder="description"
          value={desc}
          onChange={description}
        />
        <select name="client_id" value={clientid} onChange={clientsid}>
          <option value=""> selectclient</option>
          {clients.map((allele) => (
            <div>
              <option value={allele.id} key={allele.id}>
                {allele.name}
              </option>
            </div>
          ))}
        </select>
        <button onClick={handlesubmit}>ADD</button>
      </form>
    </div>
  );
};

export default Projects;
