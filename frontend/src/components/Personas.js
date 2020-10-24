import React, { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API;

export const Personas = () => {

    const [nombre,setNombre]  =  useState('')
    const [fena,setFena]  =  useState('')
    const [puesto,setPuesto]  =  useState('')

    const [editar, setEditar] = useState(false)
    const [id, setId] = useState('')
    const [personas, setPersonas] = useState([])


    const add_Persona = async (e) =>{
        e.preventDefault();
        if(!editar){
            const resp = await fetch(`${API}/personas`, {
                method:'POST',
                headers: {
                    'Content-Type':'application/JSON'
                },
                body: JSON.stringify({
    
                    nombre: nombre,
                    fena: fena,
                    puesto: puesto
                })
            })
            const data = await resp.json();
            console.log(data)
        } else {
            const resp = await fetch(`${API}/personas/${id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    fena,
                    puesto
                })
            })
            const data = await resp.json();
            console.log(data)
            setEditar(false);
            setId('');
        }

        await getPersonas();

        setNombre('');
        setFena('');
        setPuesto('');
    }

    const getPersonas = async () => {
        const resp = await fetch(`${API}/personas`)
        const data = await resp.json();
        setPersonas(data)
    }

    useEffect(() => {
        getPersonas();
    }, [])

    const editPersona = async (id) => {
        // const resp = await fetch(`${API}/personas/${id}
        const resp = await fetch(`${API}/personas/${id}`)
        const data = await resp.json();
        console.log(data)

        setEditar(true);
        setId(id);

        setNombre(data.nombre);
        setFena(data.fena);
        setPuesto(data.puesto);
    }

    const deletePersona = async (id) => {
        const confirmacion = window.confirm('¿Seguro de querer eliminar el registro?')
        if(confirmacion){
            const resp = await fetch(`${API}/personas/${id}`,{
                method: 'DELETE'
            });
            const data = await resp.json();
            console.log(data)
            await getPersonas();
        }
    }

    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={add_Persona}>
                    <div className="form.group">
                        <label>Nombre</label>
                        <input type="text" onChange={ e => setNombre(e.target.value)} value={nombre} className="form-control" autoFocus>
                        </input>
                    </div>
                    <div className="form.group">
                        <label>Fecha de Nacimiento</label>
                        <input type="date" onChange={ e => setFena(e.target.value)} value={fena} className="form-control">
                        </input>
                    </div>
                    <div className="form.group">
                        <label>Puesto</label>
                        <input type="text" onChange={ e => setPuesto(e.target.value)} value={puesto} className="form-control">
                        </input>
                    </div>
                    <button className="btn btn-primary btn-block">
                        {editar ? 'Editar' : 'Guardar'}
                    </button>
                </form>
            </div>
            <div className="col-md-8">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha Nacimiento</th>
                            <th>Puesto</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {personas.map(persona => (
                        <tr key={persona.id}>
                            <td>{persona.nombre}</td>
                            <td>{persona.fena}</td>
                            <td>{persona.puesto}</td>
                            <td>
                                <button type="button" class="btn btn-warning btn-sm" onClick={() => editPersona(persona.id)}>
                                    Editar
                                </button>
                                <button type="button" class="btn btn-danger btn-sm" onClick={() => deletePersona(persona.id)}>
                                    Borrar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>            
        
        </div>
    )
}