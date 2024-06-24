import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Query.css';
import Navbar from './Navbar';

const Query = () => {
    const [description, setDescription] = useState('');
    const [queries, setQueries] = useState([]);
    const [comments, setComments] = useState({});
    const [selectedQueryId, setSelectedQueryId] = useState(null);
    const [editQueryId, setEditQueryId] = useState(null);
    const [editDescription, setEditDescription] = useState('');
    const mobileNumber = localStorage.getItem('mobileNumber');

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/farmer/queries?mobileNumber=${mobileNumber}`);
            setQueries(response.data);
        } catch (error) {
            console.error('Error fetching queries:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/api/farmer/query?mobileNumber=${mobileNumber}`, { description });
            setQueries([...queries, response.data]);
            setDescription('');
        } catch (error) {
            console.error('Error submitting query:', error);
        }
    };

    const handleViewComments = async (queryId) => {
        if (selectedQueryId === queryId) {
            // If comments are already showing, hide them
            setSelectedQueryId(null);
        } else {
            // Otherwise, fetch and show comments
            try {
                const response = await axios.get(`http://localhost:8080/api/farmer/queries/${queryId}/comments`);
                setComments((prevComments) => ({
                    ...prevComments,
                    [queryId]: response.data,
                }));
                setSelectedQueryId(queryId);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }
    };

    const handleUpdate = async (queryId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/farmer/query/${queryId}`, { description: editDescription });
            setQueries(queries.map(query => query.id === queryId ? response.data : query));
            setEditQueryId(null);
        } catch (error) {
            console.error('Error updating query:', error);
        }
    };

    const handleDelete = async (queryId) => {
        try {
            await axios.delete(`http://localhost:8080/api/farmer/query/${queryId}`);
            setQueries(queries.filter(query => query.id !== queryId));
        } catch (error) {
            console.error('Error deleting query:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="query-form">
                <h1>Submit a Query</h1>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter your query description"
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="query-list">
                <h2>Submitted Queries</h2>
                {queries.length > 0 ? (
                    queries.map(query => (
                        <div key={query.id} className="query-card">
                            {editQueryId === query.id ? (
                                <div className="edit-form">
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        required
                                    />
                                    <div className="edit-form-buttons">
                                        <button
                                            className="update-button"
                                            onClick={() => handleUpdate(query.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="cancel-button"
                                            onClick={() => setEditQueryId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p>{query.description}</p>
                                    <div className="action-buttons">
                                        <button
                                            className="view-comments-button"
                                            onClick={() => handleViewComments(query.id)}
                                        >
                                            {selectedQueryId === query.id ? 'Hide Comments' : 'View Comments'}
                                        </button>
                                        <button
                                            className="update-button"
                                            onClick={() => {
                                                setEditQueryId(query.id);
                                                setEditDescription(query.description);
                                            }}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(query.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                            {selectedQueryId === query.id && (
                                <div className="comments-section">
                                    <h3>Comments</h3>
                                    {comments[query.id] && comments[query.id].length > 0 ? (
                                        comments[query.id].map(comment => (
                                            <div key={comment.id} className="comment-card">
                                                <p>{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No comments yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No queries submitted yet.</p>
                )}
            </div>
        </div>
    );
};

export default Query;
