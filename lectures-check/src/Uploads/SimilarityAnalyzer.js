import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SimilarityAnalyzer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pdfId, videoId } = location.state || {};

    const [similarityScore, setSimilarityScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSimilarityScore = useCallback(async () => {
        if (!pdfId || !videoId) {
            setError('Missing videoId or pdfId.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:5000/api/v1/similarity", {
                params: {
                    video_id: videoId,
                    pdf_id: pdfId
                },
            });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            // Assuming similarity score is a decimal between 0 and 1
            const percentageScore = (response.data.similarity_score * 100).toFixed(2);
            setSimilarityScore(percentageScore);
            console.log(percentageScore);

        } catch (error) {
            setError(`Error fetching similarity score: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [pdfId, videoId]);

    const handleShowAnalysis = () => {
        navigate('/analysis', { state: { similarityScore } });
    };

    return (
        <div className="similarity-analyzer d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#1D232A', color: '#fff' }}>
            <div className="container text-center">
                <button 
                    className="btn btn-primary mb-4" 
                    onClick={fetchSimilarityScore} 
                    disabled={loading || !pdfId || !videoId}
                >
                    {loading ? 'Calculating...' : 'Calculate Similarity'}
                </button>

                {similarityScore !== null && (
                    <>
                        <h3 className="mb-4">Similarity Score: {similarityScore}%</h3>
                        <button 
                            className="btn btn-success"
                            onClick={handleShowAnalysis}
                        >
                            Show Analysis
                        </button>
                    </>
                )}

                {error && <div className="error-message text-danger">{error}</div>}
            </div>
        </div>
    );
};

export default SimilarityAnalyzer;
