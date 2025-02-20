const baseUrl = 'http://localhost:9000/api';

const token = localStorage.getItem('token'); // Asegúrate de que este sea el nombre correcto


export const fetchDepartamentos = async () => {
    const response = await fetch(`${baseUrl}/departamentos`, {
        method: 'GET', // Asegura que es GET
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.map(departamento => ({ id: departamento.id, 
        name: departamento.name, 
        label: departamento.name, }));
};

export const fetchClasificaciones = async () => {
    const response = await fetch(`${baseUrl}/clasificaciones`, {
        method: 'GET', // Asegura que es GET
        mode: 'cors',  // Habilita CORS
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.map(clasificacion => ({
        id: clasificacion.id,
        name: clasificacion.name,
        acronym: clasificacion.acronym,
        label: `${clasificacion.name} - ${clasificacion.acronym}`
    }));
};



export const fetchPeticionarios = async () => {
    const response = await fetch(`${baseUrl}/peticionarios`, {
        method: 'GET', // Asegura que es GET
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.map(peticionario => ({
        id: peticionario.id,
        label: `${peticionario.name} ${peticionario.surname} - ${peticionario.dni ?? peticionario.cif ?? 'N/A'}`,
        tipo_peticionario: peticionario.tipo_peticionario,
        name: peticionario.name,
        surname: peticionario.surname,
        representaId: peticionario.representaId,
        dni: peticionario.dni,
        nif: peticionario.nif,
    }));
};

export const fetchEstadosExpedientes = async () => {
    const response = await fetch(`${baseUrl}/estadosexpedientes`, {
        method: 'GET', // Asegura que es GET
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.map(estado => ({ id: estado.id, 
        name: estado.name,
        label: estado.name,
    }));
};

export const fetchEmpresas = async () => {
    const response = await fetch(`${baseUrl}/empresas`, {
        method: 'GET', // Asegura que es GET
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.map(empresa => ({ id: empresa.id, 
        label: `${empresa.name} - ${empresa.cif}`,
        name: empresa.name, 
        cif: empresa.cif, 
        address: empresa.address, 
        tlf: empresa.tlf, 
        email: empresa.email, 
        representanteId: empresa.representanteId }));
}

export const fetchExpedientesPrincipales = async () => {
    const response = await fetch(`${baseUrl}/expedientesprincipales`, {
        method: 'GET', // Asegura que es GET
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.map(expediente => ({ id: expediente.id, 
        departamentoId: expediente.departamentoId, 
        clasificacionId: expediente.clasificacionId, 
        peticionarioId: expediente.peticionarioId,
        estadoId: expediente.estadoExpedienteId, 
        empresaId: expediente.empresaId,
        fechaInicio: expediente.fechaInicio,
        fechaRegistro: expediente.fechaRegistro,
        registro: expediente.registro,
        solicitud: expediente.solicitud,
        expediente: expediente.expediente,
        referenciaCatastral: expediente.referenciaCatastral,
        expedienteSecundarioIds: expediente.expedienteSecundarioIds,
        label: expediente.expediente,
    }));
}

export const fetchExpedientesSecundarios = async () => {
    const response = await fetch(`${baseUrl}/expedientessecundarios`, {
        method: 'GET', // Asegura que es GET
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    console.log(data);
    return data.map(expediente => ({ id: expediente.id, 
        departamentoId: expediente.departamentoId, 
        clasificacionId: expediente.clasificacionId, 
        peticionarioId: expediente.peticionarioId,
        estadoId: expediente.estadoExpedienteId, 
        empresaId: expediente.empresaId,
        fechaInicio: expediente.fechaInicio,
        fechaRegistro: expediente.fechaRegistro,
        registro: expediente.registro,
        solicitud: expediente.solicitud,
        expediente: expediente.expediente,
        referenciaCatastral: expediente.referenciaCatastral,
        expedientePrincipalId: expediente.expedientePrincipalId,}));
}