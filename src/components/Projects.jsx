import React, { useEffect, useState } from "react";
import supabase from "../utils/Supabase";

const Projects = () => {
  const [project, setproject] = useState([]);
  const [title, settitle] = useState("");
  const [desc, setdesc] = useState("");
  const [clientid, setclientid] = useState("");
  const [clients, setclients] = useState([]);
  const [loading, setloading] = useState(false);
  const [status, setstatus] = useState("Pending");
  const [editingid, seteditingid] = useState(null);

  function handleedit(project) {
    settitle(project.title);
    setstatus(project.status);
    setdesc(project.description);
    setclientid(project.client_id);
    seteditingid(project.id);
  }

  //client id option
  function clientsid(e) {
    setclientid(e.target.value);
  }
  function statusid(e) {
    setstatus(e.target.value);
  }
  ///adding project handling
  async function handlesubmit(e) {
    e.preventDefault();
    if (!title || !desc) {
      alert("fill the inputs");
      return;
    }

    if (editingid) {
      const { error } = await supabase
        .from("projects")
        .update([
          {
            title: title,
            description: desc,
            client_id: clientid,
            status: status,
          },
        ])
        .eq("id", editingid);
      if (error) {
        alert(error.message + "error here");
        return;
      } else {
        seteditingid(null);
      }
      settitle("");
      setdesc("");
      alert("Successfully updated Submit");
    } else {
      const { error } = await supabase.from("projects").insert([
        {
          title: title,
          description: desc,
          client_id: clientid,
          status: status,
        },
      ]);
      if (error) {
        alert(error.message);
        return;
      } else {
        settitle("");
        setdesc("");
        alert("Successfully Submit");
      }
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
  //suparabase getting p
  async function fetchproject() {
    setloading(true);
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      alert(error.message);
      return;
    } else {
      setproject(data);
    }
    setloading(false);
  }

  async function handledelete(id) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    } else {
      alert("successfully deleting");
    }
    fetchproject();
  }
  function grouped(status) {
    return project.filter((allele) => {
      allele.status === status;
    });
  }
  return (
    <div>
      <h2> Projects</h2>
      {loading ? (
        <p style={{ backgroundColor: "red" }}>Projects are Loading</p>
      ) : (
        <div>
          {/* {["pending", "inprogress", "completed"].map((allele) => (
            <div>
              <ul>
                <li>{allele}</li>
              </ul>
              {grouped(allele).map((allele2) => {
                <li> {allele2.title}</li>;
              })}
            </div>
          ))} */}

          <ul>
            {project.map((allele) => (
              <li key={allele.id}>
                {allele.title}- {allele.description} - {allele.status}
                <button
                  onClick={() => {
                    handledelete(allele.id);
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    handleedit(allele);
                  }}
                >
                  Update project
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
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
        <select name="status" value={status} onChange={statusid}>
          <option value="Completed"> Completed</option>
          <option value="inprogress"> inprogress</option>
          <option value="Pending"> Pending</option>
        </select>
        <button onClick={handlesubmit}>{editingid ? "update" : "add"}</button>
      </form>
    </div>
  );
};

export default Projects;
