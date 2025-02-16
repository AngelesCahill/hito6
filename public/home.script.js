let currentUserId = null;
let currentProjectUserId = null;
let currentProjectId = null;

// Variables para mensajería
let messages = [];

// Función para mostrar el modal de actualización
function showUpdateModal(userId) {
    currentUserId = userId;
    const modal = document.getElementById('updateModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const form = document.getElementById('updateForm');
    
    modal.style.display = 'block';
    
    // Cerrar modal con la X
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    // Cerrar modal si se hace click fuera
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    // Manejar el envío del formulario
    form.onsubmit = async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('updateName').value;
        const email = document.getElementById('updateEmail').value;
        
        if (!name || !email) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${currentUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email })
            });
            
            if (response.ok) {
                alert('Usuario actualizado exitosamente');
                modal.style.display = 'none';
                form.reset();
                loadUsers();
            } else {
                const error = await response.json();
                alert(error.message || 'Error al actualizar usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar usuario');
        }
    }
}

// Función para cargar usuarios
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        const tableBody = document.getElementById('usersTableBody');
        tableBody.innerHTML = '';
        
        // Ocultar la tabla de proyectos
        document.getElementById('projectsSection').style.display = 'none';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn btn-update" onclick="showUpdateModal(${user.id})">
                        Actualizar
                    </button>
                </td>
                <td>
                    <button class="btn btn-delete" onclick="deleteUser(${user.id})">
                        Eliminar
                    </button>
                </td>
                <td>
                    <button class="btn btn-projects" onclick="viewProjects(${user.id})">
                        Ver Proyectos
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Función para eliminar usuario
async function deleteUser(userId) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Usuario eliminado exitosamente');
            loadUsers();
        } else {
            const error = await response.json();
            alert(error.message || 'Error al eliminar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar usuario');
    }
}

// Función para ver proyectos
async function viewProjects(userId) {
    try {
        // Limpiar las cards existentes
        document.getElementById('projectCards').innerHTML = '';
        
        currentProjectUserId = userId;
        const response = await fetch(`/api/projects/user/${userId}`);
        const projects = await response.json();
        
        const userResponse = await fetch(`/api/users/${userId}`);
        const user = await userResponse.json();
        
        const projectsSection = document.getElementById('projectsSection');
        const projectsTableBody = document.getElementById('projectsTableBody');
        
        document.getElementById('projectsUserId').textContent = `(ID: ${userId})`;
        
        projectsTableBody.innerHTML = '';
        projectsSection.style.display = 'block';
        
        if (projects.length === 0) {
            projectsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">
                        Este usuario no tiene proyectos
                    </td>
                </tr>
            `;
        } else {
            projects.forEach(project => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${project.title}</td>
                    <td>${project.description}</td>
                    <td>${user.name}</td>
                    <td>
                        <button class="btn btn-update" onclick="updateProject(${project.id})">
                            Actualizar
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-delete" onclick="deleteProject(${project.id})">
                            Eliminar
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-view" onclick="viewProjectDetail(${project.id})">
                            Ver Proyecto
                        </button>
                    </td>
                `;
                projectsTableBody.appendChild(row);
            });
        }

        projectsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los proyectos');
    }
}

// Función para actualizar proyecto
async function updateProject(projectId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para actualizar proyectos');
            return;
        }

        currentProjectId = projectId;

        // Obtener los datos actuales del proyecto
        const response = await fetch(`/api/projects/${projectId}`);
        const project = await response.json();

        // Rellenar el formulario con los datos actuales
        document.getElementById('updateProjectTitle').value = project.title;
        document.getElementById('updateProjectDescription').value = project.description;
        
        // Si hay una imagen, mostrarla en la previsualización
        const preview = document.getElementById('updateImagePreview');
        if (project.image) {
            preview.innerHTML = `<img src="${project.image}" alt="Current Image">`;
        } else {
            preview.innerHTML = '';
        }

        // Mostrar el modal
        document.getElementById('updateProjectModal').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos del proyecto');
    }
}

// Preview de imagen para actualización
document.getElementById('updateProjectImage').onchange = function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('updateImagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
};

// Manejar el envío del formulario de actualización
document.getElementById('updateProjectForm').onsubmit = async (e) => {
    e.preventDefault();
    
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('title', document.getElementById('updateProjectTitle').value);
        formData.append('description', document.getElementById('updateProjectDescription').value);
        
        const imageFile = document.getElementById('updateProjectImage').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await fetch(`/api/projects/${currentProjectId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            alert('Proyecto actualizado exitosamente');
            document.getElementById('updateProjectModal').style.display = 'none';
            document.getElementById('updateProjectForm').reset();
            document.getElementById('updateImagePreview').innerHTML = '';
            // Recargar la lista de proyectos
            if (currentProjectUserId) {
                viewProjects(currentProjectUserId);
            }
        } else {
            const error = await response.json();
            alert(error.message || 'Error al actualizar el proyecto, solo puede actualizar sus proyectos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar el proyecto');
    }
};

// Agregar el manejador de cierre para el nuevo modal
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});

// Función para eliminar proyecto
async function deleteProject(projectId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para eliminar proyectos');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Proyecto eliminado exitosamente');
            // Recargar la lista de proyectos
            if (currentProjectUserId) {
                viewProjects(currentProjectUserId);
            }
        } else {
            const error = await response.json();
            alert(error.message || 'Error al eliminar el proyecto, solo puede actualizar sus proyectos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el proyecto');
    }
}

// Función para ver detalle del proyecto
async function viewProjectDetail(projectId) {
    try {
        const response = await fetch(`/api/projects/${projectId}`);
        const project = await response.json();
        
        const cardsContainer = document.getElementById('projectCards');
        
        // Crear la card
        const card = document.createElement('div');
        card.className = 'project-card';
        card.id = `project-card-${project.id}`;
        
        // Contenido de la card
        card.innerHTML = `
            <button class="close-btn" onclick="closeProjectCard(${project.id})">&times;</button>
            <h3>${project.title}</h3>
            ${project.image 
                ? `<img src="${project.image}" alt="${project.title}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'no-image-placeholder\'>No hay imagen disponible</div>'">` 
                : '<div class="no-image-placeholder">No hay imagen disponible</div>'
            }
            <p>${project.description}</p>
        `;
        
        // Agregar la card al contenedor
        cardsContainer.appendChild(card);
        
        // Scroll suave hasta la card
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los detalles del proyecto');
    }
}

// Función para cerrar una card de proyecto
function closeProjectCard(projectId) {
    const card = document.getElementById(`project-card-${projectId}`);
    if (card) {
        card.remove();
    }
}

// Manejo de autenticación
function checkAuth() {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (token) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// Login
document.getElementById('loginBtn').onclick = () => {
    document.getElementById('loginModal').style.display = 'block';
}

document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Nombre del usuario:', data.name);
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);
            document.getElementById('loginModal').style.display = 'none';
            checkAuth();
            loadUsers();
            showChatButton();
        } else {
            const error = await response.json();
            alert(error.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión');
    }
}

// Registro
document.getElementById('registerBtn').onclick = () => {
    document.getElementById('registerModal').style.display = 'block';
}

document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', name);
            document.getElementById('registerModal').style.display = 'none';
            checkAuth();
            loadUsers();
            showChatButton();
        } else {
            const error = await response.json();
            alert(error.message || 'Error al registrarse');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrarse');
    }
}

// Logout
document.getElementById('logoutBtn').onclick = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    checkAuth();
    loadUsers();
}

// Cerrar modales
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    }
});

// Manejador para el botón de crear proyecto
document.getElementById('createProjectBtn').onclick = () => {
    if (!localStorage.getItem('token')) {
        alert('Debes iniciar sesión para crear un proyecto');
        return;
    }
    document.getElementById('createProjectModal').style.display = 'block';
};

// Agregar preview de imagen
document.getElementById('projectImage').onchange = function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
};

// Actualizar el manejador del formulario para incluir la imagen
document.getElementById('createProjectForm').onsubmit = async (e) => {
    e.preventDefault();
    
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('title', document.getElementById('projectTitle').value);
        formData.append('description', document.getElementById('projectDescription').value);
        
        const imageFile = document.getElementById('projectImage').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            alert('Proyecto creado exitosamente');
            document.getElementById('createProjectModal').style.display = 'none';
            document.getElementById('createProjectForm').reset();
            document.getElementById('imagePreview').innerHTML = '';
            // Recargar la lista de proyectos
            if (currentProjectUserId) {
                viewProjects(currentProjectUserId);
            }
        } else {
            const error = await response.json();
            alert(error.message || 'Error al crear el proyecto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el proyecto');
    }
};

// Función para mostrar el botón de chat después de iniciar sesión
function showChatButton() {
    document.getElementById('chatBtn').style.display = 'block';
}

// Función para redirigir al chat
function goToChat() {
    window.location.href = 'chat.html'; // Redirige a chat.html
}

function loginUser() {
    const inputUserName = document.getElementById('userNameInput'); // Asegúrate de que este ID sea correcto
    const userName = inputUserName.value; // Obtener el valor del campo de entrada

    if (userName) {
        localStorage.setItem('name', userName); // Almacenar el nombre en localStorage
        showChatButton(); // Mostrar el botón de chat
    } else {
        alert('Por favor, ingresa tu nombre.'); // Alerta si el nombre está vacío
    }
}



