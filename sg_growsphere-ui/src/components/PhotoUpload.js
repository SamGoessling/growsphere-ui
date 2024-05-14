import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AuthService from "../services/AuthService";

function ImageUploaderAndGallery() {
    const [file, setFile] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchImages();

    }, []);

    const fetchImages = () => {
        setLoading(true);
        const user = AuthService.getCurrentUser(); // Ensure AuthService is implemented to fetch current user
        const token = user ? user.accessToken : null;

        axios.get('http://localhost:8080/api/files', {
            headers: { Authorization: `Bearer ${token}` } // Apply token
        })
            .then(response => {
                setImages(response.data); // Assume response.data is correctly formatted
            })
            .catch(error => {
                console.error('Error fetching files', error);
                alert('Failed to fetch images. Please check the console for more details.');
            })
            .finally(() => setLoading(false));
    };

    const onFileChange = event => {
        setFile(event.target.files[0]);
    };

    const onFileUpload = () => {
        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);

        const user = AuthService.getCurrentUser();
        const token = user ? user.accessToken : null;

        axios.post("http://localhost:8080/api/upload", formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                alert('File uploaded successfully');
                fetchImages();  // Refresh the gallery after upload
            })
            .catch(error => {
                alert('Error uploading file: ' + error.message);
                console.error('Upload error', error);
            })
            .finally(() => setLoading(false));
    };

    const onDelete = (id) => {
        setLoading(true);

        const user = AuthService.getCurrentUser();
        const token = user ? user.accessToken : null;

        axios.delete(`http://localhost:8080/api/files/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                alert('File deleted successfully');
                fetchImages();  // Refresh the gallery after deletion
            })
            .catch(error => {
                alert('Error deleting file: ' + error.message);
                console.error('Deletion error', error);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <h2>Upload a Photo</h2>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload} disabled={loading}>Upload!</button>

            <h2>Image Gallery</h2>
            {loading ? <p>Loading...</p> : images.map(image => (
                <div key={image.id}>
                    <img src={`http://localhost:8080/files/${image.filename}`} alt={image.filename} style={{width: "100px"}} />
                    <button onClick={() => onDelete(image.id)} disabled={loading}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default ImageUploaderAndGallery;
