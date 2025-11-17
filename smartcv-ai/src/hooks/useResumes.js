import { useCallback, useEffect, useState } from 'react';
import api from '../lib/api';

export default function useResumes() {
	const [resumes, setResumes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const fetchResumes = useCallback(async () => {
		try {
			setLoading(true);
			setError('');
			const res = await api.get('/api/resumes');
			setResumes(Array.isArray(res.data?.data) ? res.data.data : []);
		} catch (err) {
			setError(err?.response?.data?.message || 'Failed to fetch resumes');
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteResume = useCallback(async (id) => {
		await api.delete(`/api/resumes/${id}`);
		setResumes((prev) => prev.filter((r) => r._id !== id));
	}, []);

	useEffect(() => {
		fetchResumes();
	}, []);

	return { resumes, loading, error, fetchResumes, deleteResume, setResumes };
}


