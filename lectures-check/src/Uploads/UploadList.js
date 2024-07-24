import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URI = 'http://localhost:5000';

const UploadList = () => {
    const [title, setTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [medias, setMedias] = useState([]);
    const [videoId, setVideoId] = useState(null);
    const [isVideoUploaded, setIsVideoUploaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMedias();
    }, []);

    const fetchMedias = async () => {
        try {
            const response = await axios.get(`${BACKEND_URI}/api/v1/media/all`);
            setMedias(response.data);
        } catch (error) {
            console.error('Error fetching medias:', error);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile || !title) {
            alert('Please select a file and enter a title.');
            return;
        }
    
        const formData = new FormData();
        formData.append('videos', selectedFile);
        formData.append('name', title);
    
        try {
            const response = await axios.post(`${BACKEND_URI}/api/v1/media/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            console.log('Upload response:', response.data);
            if (response.data.videoId) {
                setVideoId(response.data.videoId); // Set videoId from response
                setIsVideoUploaded(true);
                alert("Video Uploaded successfully!!");
            } else {
                alert('Video ID not found in the response.');
            }
            fetchMedias();
            setTitle('');
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Error uploading video. Please try again.');
        }
    };
    const handleNext = () => {
        navigate('/uploads', { state: { videoId } }); // Pass videoId to the Upload component
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <h2>Upload Video</h2>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title:</label>
                        <input 
                            type="text" 
                            id="title" 
                            className="form-control" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            disabled={isVideoUploaded} 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="file" className="form-label">Choose a video file:</label>
                        <input 
                            type="file" 
                            id="file" 
                            className="form-control" 
                            onChange={handleFileChange} 
                            disabled={isVideoUploaded} 
                        />
                    </div>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleUpload}
                        disabled={isVideoUploaded}
                    >
                        Upload
                    </button>
                </div>
                <div className="col-md-6">
                    <h2>Uploaded Videos</h2>
                    <div className="video-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <div className="list-group">
                            {medias.length > 0 ? (
                                medias.map((media) => (
                                    <div key={media._id} className="list-group-item">
                                        <h5 className="mb-1">Title: {media.name}</h5>
                                        <video width="100%" height="auto" controls>
                                            <source src={`${BACKEND_URI}${media.videos[0]}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                ))
                            ) : (
                                <p>No uploads available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isVideoUploaded && (
                <button 
                    className="btn btn-success mt-3" 
                    onClick={handleNext}
                >
                    Next (Upload PDF)
                </button>
            )}
        </div>
    );
};

export default UploadList;
