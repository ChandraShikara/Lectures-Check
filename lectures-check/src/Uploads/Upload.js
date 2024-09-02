import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './upload.css';

function Upload() {
    const location = useLocation();
    const { videoId } = location.state || {}; 
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [allPdf, setAllPdf] = useState([]);
    const [pdfId, setPdfId] = useState(null);
    const [isPdfUploaded, setIsPdfUploaded] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Current videoId:', videoId);
        console.log('Current pdfId:', pdfId);
    }, [videoId, pdfId]);
  
    const getPdf = async () => {
        try {
            const result = await axios.get("http://localhost:5000/get-files");
            setAllPdf(result.data.data);
        } catch (error) {
            console.error('Error fetching PDFs:', error);
        }
    };

    const submitPdf = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        setUploading(true);
  
        try {
            const result = await axios.post(
                "http://localhost:5000/upload-files",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentage);
                    }
                }
            );
            console.log('Upload result:', result.data);
            if (result.data.status === "ok") {
                alert("Uploaded Successfully!");
                getPdf();
  
                if (result.data.pdfId) {
                    setPdfId(result.data.pdfId);
                    setIsPdfUploaded(true);
                }
            } else {
                alert('Error uploading PDF.');
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
            alert('Error uploading PDF. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const showPdf = (pdf) => {
        window.open(`http://localhost:5000/files/${pdf}`, "_blank", "noreferrer");
    };

    const handleBack = () => {
        navigate('/uploadvd');
    };

    const handleNext = () => {
        if (pdfId && videoId) {
            navigate('/analyze', { state: { videoId, pdfId } });
        } else {
            alert('Please upload a video and select a PDF.');
        }
    };
  
    return (
        <div className="App">
            <form className="formStyle" onSubmit={submitPdf}>
                <h4>Upload PDF</h4><br/>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isPdfUploaded}
                />
                <br/>
                <input
                    type="file"
                    className="form-control"
                    accept="application/pdf"
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={isPdfUploaded}
                />
                <br/>
                {uploading && (
                    <div className="progress mt-2">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${uploadProgress}%` }}
                            aria-valuenow={uploadProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {uploadProgress}%
                        </div>
                    </div>
                )}
                <div className="button-container">
                    {!isPdfUploaded && (
                        <button className="btn btn-primary" type='submit'>
                            Submit
                        </button>
                    )}
                    <button 
                        className="btn btn-orangishyellow" 
                        onClick={handleBack}
                    >
                        Back
                    </button>
                    {isPdfUploaded && (
                        <button 
                            className="btn btn-success" 
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    )}
                </div>
            </form>

            <div className='uploaded'>
                <h4>Uploaded PDFs:</h4>
                <div className='scrollable-div'>
                    {allPdf.length === 0
                        ? "Loading..."
                        : allPdf.map((data) => (
                            <div className='inner-div' key={data._id}>
                                <h6>Title: {data.title}</h6>
                                <button className='btn btn-primary' onClick={() => showPdf(data.pdf)}>Show PDF</button>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Upload;
