const BASE = '/api';

function getHeaders(){
    const token = localStorage.getItem('token');
    return{
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}`}:{}),
    };
}

async function request(method, path, body) {
    const res = await fetch('${BASE}${path}',{method, headers: getHeaders(), ...(body ? {body: JSON.stringify(body)} : {})});
    if (res.status === 401){localStorage.clear(); window.location.href='/login';}
    if(!res.ok){const err=await res.json().catch(()=>({})); throw new Error(err.message || 'Request failed');}
    return res.json();
}

export const api = {
    get: path => request('GET', path),
    post:   (path, body) => request('POST',   path, body),
    put:    (path, body) => request('PUT',    path, body),
    patch:  (path, body) => request('PATCH',  path, body),
    delete: path        => request('DELETE',  path),
};