const API_BASE_URL = "http://localhost:8080/api"; 

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(`HTTP error! Status: ${response.status} - ${errorText || response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return null; 
  }
};

export const getBatches = () => {
  return fetch(`${API_BASE_URL}/batches`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  }).then(handleResponse);
};

export const createBatch = (name) => {
  return fetch(`${API_BASE_URL}/batches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ name }),
  }).then(handleResponse);
};

export const updateBatchName = (batchId, name) => {
  return fetch(`${API_BASE_URL}/batches/${batchId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ name }),
  }).then(handleResponse);
};

export const deleteBatch = (batchId) => {
  return fetch(`${API_BASE_URL}/batches/${batchId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then(handleResponse);
};

export const initiatePayment = (batchId, paymentDetails) => {
  return fetch(`${API_BASE_URL}/batches/${batchId}/initiate-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(paymentDetails),
  }).then(handleResponse);
};

export const getEmployees = () => {
  return fetch(`${API_BASE_URL}/employees`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  }).then(handleResponse);
};

export const addEmployee = (employeeData) => {
  return fetch(`${API_BASE_URL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(employeeData),
  }).then(handleResponse);
};

export const deleteEmployee = (employeeId) => {
  return fetch(`${API_BASE_URL}/employees/${employeeId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then(handleResponse);
};

export const assignEmployeeToBatch = (employeeId, batchId) => {
  return fetch(`${API_BASE_URL}/employees/${employeeId}/assign/${batchId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  }).then(handleResponse);
};

export const unassignEmployee = (employeeId) => {
  return fetch(`${API_BASE_URL}/employees/${employeeId}/unassign`, {
    method: "PUT",
    headers: getAuthHeaders(),
  }).then(handleResponse);
};

export const bulkUploadEmployees = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${API_BASE_URL}/employees/bulk-upload`, {
    method: "POST",
    headers: getAuthHeaders(), 
    body: formData,
  }).then(handleResponse);
};

export const getBankAccounts = () => {
  return fetch(`${API_BASE_URL}/bank-accounts`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  }).then(handleResponse);
};
