const baseUrl = 'http://localhost:8081/api';

export const fetchEstados = async () => {
    const response = await fetch(`${baseUrl}/estadosexpedientes`);
    const data = await response.json();
    return data.map(estado => ({ value: estado.id, name: estado.name }));
};

export const fetchDepartamentos = async () => {
    const response = await fetch(`${baseUrl}/departamentos`);
    const data = await response.json();
    return data.map(departamento => ({ value: departamento.id, name: departamento.name }));
};

export const fetchClasificaciones = async () => {
    const response = await fetch(`${baseUrl}/clasificaciones`);
    const data = await response.json();
    return data.map(clasificacion => ({ value: clasificacion.id, name: `${clasificacion.name}` ,acronym:` ${clasificacion.acronym}` }));
};

export const fetchPeticionarios = async () => {
    const response = await fetch(`${baseUrl}/peticionarios`);
    const data = await response.json();
    return data.map(peticionario => ({
        value: peticionario.id,
        label: `${peticionario.name} ${peticionario.surname} - ${peticionario.dni ?? peticionario.cif ?? 'N/A'}`,
        tipo_peticionario: peticionario.tipo_peticionario,
        name: peticionario.name,
        surname: peticionario.surname
    }));
};