import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Navbar from './Navbar';
import './DoctorHome.css'; 

const DoctorHome = () => {
    const [queries, setQueries] = useState([]);
    const [comment, setComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [selectedQueryId, setSelectedQueryId] = useState(null);
    const mobileNumber = localStorage.getItem('mobileNumber');

    useEffect(() => {
        fetchSortedQueries();
    }, []);

    const fetchSortedQueries = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/doctor/queries/sorted');
            setQueries(response.data);
        } catch (error) {
            console.error('Error fetching sorted queries:', error);
        }
    };

    const handleAddComment = async (queryId) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/doctor/queries/${queryId}/comments`, { content: comment, mobileNumber }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setQueries(queries.map(query => query.id === queryId ? { ...query, comments: [...query.comments, response.data] } : query));
            setComment('');
            setSelectedQueryId(null);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleUpdateComment = async (commentId, queryId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/doctor/comments/${commentId}`, { content: comment, mobileNumber }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setQueries(queries.map(query => query.id === queryId ? { ...query, comments: query.comments.map(c => c.id === commentId ? response.data : c) } : query));
            setEditingCommentId(null);
            setComment('');
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDeleteComment = async (commentId, queryId) => {
        try {
            await axios.delete(`http://localhost:8080/api/doctor/comments/${commentId}`, { 
                params: { mobileNumber }, 
                headers: { 'Content-Type': 'application/json' }
            });
            setQueries(queries.map(query => query.id === queryId ? { ...query, comments: query.comments.filter(comment => comment.id !== commentId) } : query));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('mobileNumber');
        localStorage.removeItem('role');
        window.location.href = '/login';
    };

    const startEditingComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setComment(content);
    };

    return (
        <div className="doctor-home-container">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <div className="doctor-home">
                <h2>Doctor's Interface</h2>
                {Array.isArray(queries) && queries.length > 0 ? queries.map(query => (
                    <div key={query.id} className="query-card">
                        <h3>{query.title}</h3>
                        <p>{query.description}</p>
                        <div className="comments-section">
                            {Array.isArray(query.comments) && query.comments.map(c => (
                                <div key={c.id} className="comment-card">
                                    {editingCommentId === c.id ? (
                                        <>
                                            <textarea
                                                className="comment-input"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <button
                                                className="save-button"
                                                onClick={() => handleUpdateComment(c.id, query.id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="cancel-button"
                                                onClick={() => {
                                                    setEditingCommentId(null);
                                                    setComment('');
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p>{c.content}</p>
                                            <p>Commented by: {c.doctor?.name ?? 'Unknown'}</p>
                                            <button
                                                className="update-button"
                                                onClick={() => startEditingComment(c.id, c.content)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteComment(c.id, query.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                            {selectedQueryId === query.id ? (
                                <>
                                    <textarea
                                        className="comment-input"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add a comment"
                                    />
                                    <button
                                        className="comment-button"
                                        onClick={() => handleAddComment(query.id)}
                                    >
                                        Comment
                                    </button>
                                    <button
                                        className="cancel-button"
                                        onClick={() => {
                                            setSelectedQueryId(null);
                                            setComment('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="comment-button"
                                    onClick={() => setSelectedQueryId(query.id)}
                                >
                                    Add Comment
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <p>No queries available</p>
                )}
            </div>
        </div>
    );
};

export default DoctorHome;
